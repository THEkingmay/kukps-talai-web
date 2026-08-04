import apiClient from "~/configs/axios";
import axios from "axios";
import type { User } from "~/types";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export async function loginWithSessionAction(): Promise<
  ActionResult<{ user: User }>
> {
  try {
    const res = await apiClient.get("/auth/login-with-session");
    return { success: true, data: res.data };
  } catch {
    return { success: false, error: "ไม่พบเซสชันที่ใช้งานอยู่" };
  }
}

export async function logoutAction(): Promise<ActionResult<void>> {
  try {
    await apiClient.get("/auth/logout");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "ออกจากระบบไม่สำเร็จ" };
  }
}

export async function loginAction(
  email: string,
  password: string,
): Promise<ActionResult<{ user: User }>> {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    return { success: true, data: res.data };
  } catch {
    return {
      success: false,
      error: "กรุณาตรวจสอบอีเมลหรือรหัสผ่านใหม่อีกครั้ง",
    };
  }
}

export async function registerAction(
  email: string,
  password: string,
  invite_code?: string,
): Promise<ActionResult<{ user: User }>> {
  try {
    const res = await apiClient.post("/auth/register", {
      email,
      password,
      inviteCode: invite_code,
    });
    return { success: true, data: res.data };
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
