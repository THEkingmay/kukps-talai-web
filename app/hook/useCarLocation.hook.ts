import { useEffect, useState } from "react";
import apiClient from "~/configs/axios";
import type {} from "~/types";

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
  const [reconnectTimeout, setReconnectTimeout] =
    useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    const fetchInitialLocation = async () => {
      try {
        const res = await apiClient.get(`/cars/live-positions`);
        setCurrentLocation(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const connect = () => {
      ws.onopen = () => {
        setIsConnected(true);
      };
      ws.onclose = () => {
        setIsConnected(false);
        // ลองต่อใหม่หลังจากผ่านไป 3 วินาที
        setReconnectTimeout(setTimeout(connect, 3000));
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // แก้แค่ไอดีนั้นๆ
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
      ws.onerror = () => {
        setIsConnected(false);
        if (reconnectTimeout) clearTimeout(reconnectTimeout);
        setReconnectTimeout(
          setTimeout(() => {
            ws.close();
          }, 0),
        );
      };
    };
    fetchInitialLocation().then(connect);
    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [wsUrl]);

  return { currentLocation, isConnected };
}
