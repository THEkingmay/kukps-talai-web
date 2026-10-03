import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Notification } from "~/types";
import {
  getNotifications,
  NOTIFICATIONS_PAGE_SIZE,
} from "~/actions/notifications.action";
import { useAuth } from "~/components/providers/AuthProvider";
import {
  useWebsocket,
  type WebsocketMessageAlert,
} from "~/components/providers/WebsocketProvider";

export type NotificationRange = "1d" | "7d" | "30d" | "all";

const RANGE_DAYS: Record<NotificationRange, number | null> = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  all: null,
};

/** WS alert เข้ามาพร้อม ๆ กับการ fetch — ตัดซ้ำกันโดยดูช่วงเวลา (คลาดเคลื่อนไม่เกิน 5 วิ) */
const DEDUPE_WINDOW_MS = 5_000;

interface NotificationProviderContextType {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  range: NotificationRange;
  setRange: (range: NotificationRange) => void;
  retry: () => void;
}

const NotificationProviderContext =
  createContext<NotificationProviderContextType | null>(null);

export const useNotificationProvider = () => {
  const context = useContext(NotificationProviderContext);
  if (!context)
    throw new Error(
      "useNotificationProvider must be used within a NotificationProvider",
    );
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

/** map WS alert → Notification shape (WS message ไม่มี id/payload) */
function mapAlertToNotification(alert: WebsocketMessageAlert): Notification {
  const createdAt = alert.timestamp ? new Date(alert.timestamp) : new Date();
  return {
    id: `ws-${createdAt.getTime()}-${alert.carId}`,
    alertType: alert.alertType as Notification["alertType"],
    carId: alert.carId,
    message: alert.message,
    payload: {
      timestamp: alert.timestamp,
      carId: alert.carId,
    },
    createdAt,
  };
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const { user } = useAuth();
  const { subscribeAlert } = useWebsocket();

  const canView = user?.role === "admin" || user?.role === "superadmin";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRangeState] = useState<NotificationRange>("1d");
  const [refreshKey, setRefreshKey] = useState(0);

  // ดึง list ตาม range (เฉพาะ admin/superadmin — backend คืน 403 คนอื่น)
  useEffect(() => {
    if (!canView) return;

    let cancelled = false;

    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);

      const days = RANGE_DAYS[range];
      const from = days
        ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        : undefined;

      const result = await getNotifications({
        from,
        limit: NOTIFICATIONS_PAGE_SIZE,
      });

      if (cancelled) return;
      if (result.success) {
        setNotifications(result.data.data ?? []);
      } else {
        setError(result.error ?? "ดึงข้อมูลไม่สำเร็จ");
      }
      setIsLoading(false);
    };

    fetchNotifications();
    return () => {
      cancelled = true;
    };
  }, [canView, range, refreshKey]);

  const setRange = useCallback((next: NotificationRange) => {
    setRangeState(next);
  }, []);

  const retry = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  // WS alert ใหม่ → prepend เข้า list เดิมโดยไม่ต้อง refetch
  useEffect(() => {
    if (!canView) return;

    return subscribeAlert((alert) => {
      const incoming = mapAlertToNotification(alert);
      const incomingTs = new Date(incoming.createdAt).getTime();

      setNotifications((prev) => {
        const duplicate = prev.some(
          (n) =>
            n.alertType === incoming.alertType &&
            n.carId === incoming.carId &&
            Math.abs(new Date(n.createdAt).getTime() - incomingTs) <
              DEDUPE_WINDOW_MS,
        );
        return duplicate ? prev : [incoming, ...prev];
      });
    });
  }, [canView, subscribeAlert]);

  const value = useMemo(
    () => ({ notifications, isLoading, error, range, setRange, retry }),
    [notifications, isLoading, error, range, setRange, retry],
  );

  return (
    <NotificationProviderContext.Provider value={value}>
      {children}
    </NotificationProviderContext.Provider>
  );
}
