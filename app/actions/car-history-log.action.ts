import apiClient from "~/configs/axios";
import type { CarHistoryLog } from "~/types";
import axios from "axios";

export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export async function getCarLogsByCarId(
  carId: string,
  limit: number = 50
): Promise<ActionResult<{ data: CarHistoryLog[] }>> {
  try {
    const res = await apiClient.get(`/car-history-logs/by-car/${carId}`, {
      params: { limit },
    });
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ?? error.message ?? "ลบข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
