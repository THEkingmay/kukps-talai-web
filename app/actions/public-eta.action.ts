import { publicApiClient } from "~/configs/axios";
import axios from "axios";
import type { ResponseCarData, Route, RoutePoint } from "~/types";

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getCarsPublic(): Promise<ActionResult<{ data: ResponseCarData[] }>> {
  try {
    const response = await publicApiClient.get("/cars");
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { success: false, error: err.response?.data?.message ?? err.message ?? "ดึงข้อมูลไม่สำเร็จ" };
    }
    return { success: false, error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" };
  }
}

export async function getRoutesPublic(): Promise<ActionResult<{ data: Route[] }>> {
  try {
    const response = await publicApiClient.get("/routes");
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { success: false, error: err.response?.data?.message ?? err.message ?? "ดึงข้อมูลไม่สำเร็จ" };
    }
    return { success: false, error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" };
  }
}

export async function getRoutePointsByRouteIdPublic(
  routeId: string,
): Promise<ActionResult<{ data: RoutePoint[] }>> {
  try {
    const response = await publicApiClient.get(`/route-points/by-route/${routeId}`);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return { success: false, error: err.response?.data?.message ?? err.message ?? "ดึงข้อมูลไม่สำเร็จ" };
    }
    return { success: false, error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" };
  }
}
