import apiClient from "~/configs/axios";
import axios from "axios";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };
import type { RoutePoint } from "~/types";

export async function getAllRoutePoints(): Promise<
  ActionResult<{ data: RoutePoint[] }>
> {
  try {
    const response = await apiClient.get("/route-points");
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ดึงข้อมูลไม่สำเร็จ",
      };
    }
    return { success: false, error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" };
  }
}

export async function getRoutePointsByRouteId(
  routeId: string,
): Promise<ActionResult<{ data: RoutePoint[] }>> {
  try {
    const response = await apiClient.get(`/route-points/by-route/${routeId}`);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ดึงข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function createPoints(
  newPoints: {
    routeId: string;
    sequence: number;
    lat: number;
    lng: number;
    name: string | null;
    timeToNextSecs: number | null;
  }[],
): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await apiClient.post("/route-points", newPoints);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "สร้างข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function updatePoint(
  pointId: string,
  newData: { name: string | null; timeToNextSecs: number | null },
): Promise<ActionResult<{ data: RoutePoint }>> {
  try {
    const response = await apiClient.patch(`/route-points/${pointId}`, newData);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "อัปเดตข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function deletePoint(
  pointId: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    await apiClient.delete(`/route-points/${pointId}`);
    return { success: true, data: { message: "ลบข้อมูลสำเร็จ" } };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ลบข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
