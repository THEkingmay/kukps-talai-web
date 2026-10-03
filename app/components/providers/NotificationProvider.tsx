import { useContext, createContext } from "react";
import type { Notification } from "~/types";
import { useState, useEffect } from "react";
import { getNotifications } from "~/actions/notifications.action";

interface NotificationProviderContextType {
  notifications: Notification[];
}

const NotificationProviderContext =
  createContext<NotificationProviderContextType>({ notifications: [] });

export const useNotificationProvider = () =>
  useContext(NotificationProviderContext);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async (
    carId: string | null,
    alertType: string | null,
    from: Date | null,
    to: Date | null,
    limit: number | null,
    offset: number | null,
  ) => {
    const fetchedNotifications = await getNotifications({
      carId,
      alertType,
      from,
      to,
      limit,
      offset,
    });
    setNotifications(fetchedNotifications);
  };

  useEffect(() => {
    fetchNotifications(null, null, null, null, null, null);
  }, []);

  return (
    <NotificationProviderContext.Provider value={{ notifications }}>
      {children}
    </NotificationProviderContext.Provider>
  );
}
