import { useEffect, useRef, useState } from "react";
import apiClient, { publicApiClient } from "~/configs/axios";

export interface CarLocationUpdate {
  carId: string;
  status: "active" | "inactive";
  lat: number;
  lng: number;
  createdAt: string;
}

export function useCarLocation(wsUrl: string) {
  const [currentLocation, setCurrentLocation] = useState<
    CarLocationUpdate[] | null
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
      const ws = new WebSocket(wsUrl);
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
        const data = JSON.parse(event.data) as
          CarLocationUpdate | CarLocationUpdate[];
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
      };
    };

    fetchInitialLocation().then(connect);

    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [wsUrl]);

  return { currentLocation, isConnected };
}
