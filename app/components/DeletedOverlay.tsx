import { useRef } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useLockScrollableAncestors } from "~/hooks/useLockScrollableAncestors";
import { Loader2, Trash2 } from "lucide-react";

interface DeletedOverlayProps {
  /** หัวข้อกลางจอ เช่น "รถตะไลคันนี้ถูกลบแล้ว" */
  title: string;
  description?: string;
  /** ถ้ามีค่า จะแสดงปุ่มกู้คืน */
  onRestore?: () => void;
  restoreLabel?: string;
  restorePending?: boolean;
  /** ปุ่มกลับ — ใช้ backTo (Link) หรือ onBack (handler) */
  backTo?: string;
  backLabel?: string;
  onBack?: () => void;
}

/**
 * Overlay เต็มพื้นที่หน้า (ไม่ครอบ TopBar/Sidebar ของ shell):
 * - backdrop เบลอกันคลิก/เลื่อนเนื้อหาด้านหลัง
 * - การ์ดแจ้งเตือนกลางจอ + ปุ่มกู้คืน / กลับหน้ารายการ
 * - ล็อก scroll ของ ancestor ที่ scroll ได้ (รวม body) ระหว่างแสดง
 */
export default function DeletedOverlay({
  title,
  description,
  onRestore,
  restoreLabel,
  restorePending,
  backTo,
  backLabel,
  onBack,
}: DeletedOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLockScrollableAncestors(containerRef);

  return (
    <>
      {/* Backdrop — เบลอเฉพาะพื้นที่หน้านี้ (parent ต้องมี position: relative) */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="absolute inset-0 z-40 animate-in fade-in-0 duration-200 bg-background/60 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40"
      />

      {/* การ์ดแจ้งเตือนกลางจอ — pointer-events-none จึงไม่ขวาง shell ด้านนอก */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="alertdialog"
          aria-live="polite"
          className="animate-in fade-in-0 zoom-in-95 duration-200 pointer-events-auto w-full max-w-md space-y-4 rounded-xl border bg-card/95 p-6 text-center shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/80"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {onRestore && (
              <Button onClick={onRestore} disabled={restorePending}>
                {restorePending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  restoreLabel || "กู้คืน"
                )}
              </Button>
            )}
            {backTo ? (
              <Button variant="outline" asChild>
                <Link to={backTo}>{backLabel || "กลับหน้ารายการ"}</Link>
              </Button>
            ) : onBack ? (
              <Button variant="outline" onClick={onBack}>
                {backLabel || "กลับหน้ารายการ"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
