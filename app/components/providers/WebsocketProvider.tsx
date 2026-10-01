import { useEffect, useRef, useState, createContext, useContext } from "react";
import apiClient, { publicApiClient } from "~/configs/axios";
import GlobalAlert from "../ui/GlobalAlert";

interface WebsocketMessageTypeLocation {
  type: "location";
  carId: string;
  lat: number;
  lng: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface WebsocketMessageAlert {
  type: "alert";
  alertType: string;
  carId: string;
  driverId: string;
  message: string;
  timestamp: string;
}
const WebsocketContext = createContext<{
  currentLocation: Omit<WebsocketMessageTypeLocation, "type">[] | null;
  isConnected: boolean;
} | null>(null);

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context)
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  return context;
};

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

export default function WebsocketProvider({
  children,
}: {
  children: React.ReactNode | React.JSX.Element;
}) {
  const [currentLocation, setCurrentLocation] = useState<
    Omit<WebsocketMessageTypeLocation, "type">[] | null
  >(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;

    const fetchInitialLocation = async () => {
      try {
        const res = await publicApiClient.get(`/cars/live-positions`);
        if (!unmountedRef.current) setCurrentLocation(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const connect = () => {
      if (unmountedRef.current) return;
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!unmountedRef.current) setIsConnected(true);
      };
      ws.onclose = () => {
        if (unmountedRef.current) return;
        setIsConnected(false);
        reconnectTimerRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = () => {
        ws.close();
      };
      ws.onmessage = (event) => {
        if (unmountedRef.current) return;

        const data = JSON.parse(event.data);
        const type = data.type;

        if (type === "location") {
          if (Array.isArray(data)) {
            setCurrentLocation(data);
          } else {
            setCurrentLocation((prev) => {
              const arr = prev ?? [];
              const idx = arr.findIndex((c) => c.carId === data.carId);
              if (idx >= 0) {
                const next = [...arr];
                next[idx] = data;
                return next;
              }
              return [...arr, data];
            });
          }
        } else if (type === "alert") {
          // ค่อยทำ
        }
      };
    };

    fetchInitialLocation().then(connect);
    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);
  return (
    <WebsocketContext.Provider value={{ currentLocation, isConnected }}>
      {children}
    </WebsocketContext.Provider>
  );
}
