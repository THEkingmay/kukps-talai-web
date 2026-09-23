import type { AdminInvite, InviteRole } from "~/types";
import apiClient from "~/configs/axios";
import axios from "axios";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export async function addAdminInvite(
  email: string,
  role: InviteRole,
): Promise<ActionResult<{ data: AdminInvite }>> {
  try {
    const response = await apiClient.post("/admin-invites", { email, role });
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "สมัครสมาชิกไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
export async function getAdminInvites(): Promise<
  ActionResult<{ data: AdminInvite[] }>
> {
  try {
    const response = await apiClient.get("/admin-invites");
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
export async function deleteAdminInvite(
  email: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await apiClient.delete(`/admin-invites/${email}`);
    return { success: true, data: response.data };
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
