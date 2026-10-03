import type { Notification, NotificationAlertType } from "~/types";
import type { ActionResult } from "./route-points.action";
import axios from "axios";
import apiClient from "~/configs/axios";

export interface GetNotificationsParams {
  carId?: string;
  alertType?: NotificationAlertType;
  from?: Date;
  to?: Date;
  limit: number;
  offset: number;
}
export async function getNotifications({
  carId,
  alertType,
  from,
  to,
  limit,
  offset,
}: GetNotificationsParams): Promise<ActionResult<{ data: Notification[] }>> {
  try {
    const response = await apiClient.get(
      `/notifications?carId=${carId}&alertType=${alertType}&from=${from}&to=${to}&limit=${limit}&offset=${offset}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "ดึงข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
