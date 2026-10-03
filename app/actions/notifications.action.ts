import type { Notification, NotificationAlertType } from "~/types";
import type { ActionResult } from "./route-points.action";
import axios from "axios";
import apiClient from "~/configs/axios";

export interface GetNotificationsParams {
  carId?: string;
  alertType?: NotificationAlertType;
  from?: Date | string;
  to?: Date | string;
  limit?: number;
  offset?: number;
}

/** จำนวน notification ที่ดึงต่อครั้ง (ครบรอบประมาณ list ใน panel) */
export const NOTIFICATIONS_PAGE_SIZE = 30;

export async function getNotifications({
  carId,
  alertType,
  from,
  to,
  limit = NOTIFICATIONS_PAGE_SIZE,
  offset = 0,
}: GetNotificationsParams): Promise<
  ActionResult<{ data: Notification[] }>
> {
  try {
    const params = new URLSearchParams();
    if (carId) params.set("carId", carId);
    if (alertType) params.set("alertType", alertType);
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(to).toISOString());
    params.set("limit", String(limit));
    params.set("offset", String(offset));

    const response = await apiClient.get(
      `/notifications?${params.toString()}`,
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
