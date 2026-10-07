import apiClient from "~/configs/axios";
import type { User } from "~/types";
import axios from "axios";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export async function getAll(): Promise<ActionResult<{ data: User[] }>> {
  try {
    const response = await apiClient.get("/users");
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

export async function getById(
  id: string,
): Promise<ActionResult<{ data: User }>> {
  try {
    const response = await apiClient.get(`/users/${id}`);
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

export async function restoreUser(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const res = await apiClient.patch(`/users/restore/${id}`);
    return { success: true, data: res.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error: err.response?.data?.message ?? err.message ?? "คืนค่าไม่สำเร็จ",
      };
    }
    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function deleteUser(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const res = await apiClient.delete(`/users/${id}`);
    return { success: true, data: res.data };
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

export async function updateProfileAction(
  userId: string,
  firstName: string | null,
  lastName: string | null,
  profileImage: File | null,
  phoneNumber: string | null,
): Promise<ActionResult<{ user: User }>> {
  try {
    const formData = new FormData();
    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    if (profileImage) formData.append("profileImage", profileImage);
    if (phoneNumber) formData.append("phoneNumber", phoneNumber);

    const res = await apiClient.patch(`/users/profile/${userId}`, formData);
    return { success: true, data: res.data };
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
