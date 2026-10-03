import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Info, type LucideIcon } from "lucide-react";

import { useAuth } from "~/components/providers/AuthProvider";
import {
  useWebsocket,
  type WebsocketMessageAlert,
} from "~/components/providers/WebsocketProvider";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast";

type ToastVariant = React.ComponentProps<typeof Toast>["variant"];

/** ตัวแทนค่าที่ backend ใช้เมื่อไม่มีข้อมูล */
const PLACEHOLDER = "ไม่ระบุ";

/** นิยามการแสดงผลแยกตาม alertType — เพิ่มชนิดใหม่โดยเพิ่มบรรทัดเดียว */
const ALERT_REGISTRY: Record<
  string,
  { variant: ToastVariant; Icon: LucideIcon }
> = {
  driver_not_confirmed: { variant: "warning", Icon: AlertTriangle },
};

const FALLBACK_ALERT = { variant: "info", Icon: Info } as const;

/** แสดงพร้อมกันได้มากสุดกี่อัน */
const MAX_VISIBLE = 3;
/** อัตโนมัติปิดหลังกี่มิลลิวินาที */
const DURATION_MS = 10_000;
/** รถคันเดิมซ้ำภายในช่วงนี้ ไม่แสดงซ้ำ */
const DEDUPE_MS = 60_000;
/** รวม alert ที่มาถึงในช่วงนี้เป็นเสียงเดียว */
const SOUND_COALESCE_MS = 2_000;
/** เป้ารัวกี่ครั้งต่อ burst */
const BEEP_COUNT = 3;
/** ความยาวแต่ละเป้า (วินาที) */
const BEEP_DURATION_S = 0.18;
/** ระยะห่างระหว่างเป้า (วินาที) */
const BEEP_GAP_S = 0.1;
/** ระดับเสียงสูงสุด (0-1) */
const BEEP_PEAK = 0.7;

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  Icon: LucideIcon;
}

const isUsable = (value: string | null | undefined): value is string =>
  !!value && value !== PLACEHOLDER;

export default function GlobalAlert() {
  const { user } = useAuth();
  const { subscribeAlert } = useWebsocket();

  const canReceiveAlert = user?.role === "admin" || user?.role === "superadmin";

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const seenCarsRef = useRef<Map<string, number>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastBeepAtRef = useRef(0);

  // เป้าสั้น 3 ครั้ง (แนวด่วน) ครั้งเดียวต่อ burst — ถ้า browser ยังไม่อนุญาต (ยังไม่เคยคลิกหน้าเว็บ) ก็เงียบไป
  const playAlertSound = useCallback(() => {
    const now = Date.now();
    if (now - lastBeepAtRef.current < SOUND_COALESCE_MS) return;
    lastBeepAtRef.current = now;

    try {
      const AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtor) return;

      const ctx = audioContextRef.current ?? new AudioCtor();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();

      const now$ = ctx.currentTime;
      // sawtooth ผ่าน low-pass ให้ฟังเป็นสัญญาณเตือนโดยไม่แหลมบาดหู
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      filter.connect(ctx.destination);

      for (let i = 0; i < BEEP_COUNT; i++) {
        const t = now$ + i * (BEEP_DURATION_S + BEEP_GAP_S);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(BEEP_PEAK, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + BEEP_DURATION_S);
        osc.connect(gain).connect(filter);
        osc.start(t);
        osc.stop(t + BEEP_DURATION_S + 0.05);
      }
    } catch {
      // browser บล็อกเสียง — ข้ามไป ไม่กระทบการแสดง toast
    }
  }, []);

  const handleAlert = useCallback(
    (alert: WebsocketMessageAlert) => {
      const now = Date.now();

      // กันรถคันเดิมเด้งซ้ำ (เช่น ตอน reconnect แล้ว backend ยิงซ้ำ)
      const seenAt = seenCarsRef.current.get(alert?.carId);
      if (seenAt !== undefined && now - seenAt < DEDUPE_MS) return;
      seenCarsRef.current.set(alert?.carId, now);

      const { variant, Icon } =
        ALERT_REGISTRY[alert.alertType] ?? FALLBACK_ALERT;

      const item: ToastItem = {
        id: `${alert?.carId}-${alert.timestamp}`,
        message: alert.message,
        variant,
        Icon,
      };

      setToasts((prev) => {
        const next = [...prev, item];
        return next.length > MAX_VISIBLE
          ? next.slice(next.length - MAX_VISIBLE)
          : next;
      });

      playAlertSound();
    },
    [playAlertSound],
  );

  useEffect(() => {
    if (!canReceiveAlert) return;
    return subscribeAlert(handleAlert);
  }, [canReceiveAlert, subscribeAlert, handleAlert]);

  const toastsEl = useMemo(
    () =>
      toasts.map(({ id, message, variant, Icon }) => (
        <Toast
          key={id}
          variant={variant}
          duration={DURATION_MS}
          onOpenChange={(open) => {
            if (!open)
              setToasts((prev) => prev.filter((item) => item.id !== id));
          }}
        >
          <Icon className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <ToastTitle>{message}</ToastTitle>
          </div>
          <ToastClose />
        </Toast>
      )),
    [toasts],
  );

  if (!canReceiveAlert) return null;

  return (
    <ToastProvider swipeDirection="right">
      {toastsEl}
      <ToastViewport />
    </ToastProvider>
  );
}
