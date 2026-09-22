import apiClient from "~/configs/axios";
import type { ResponseCarData } from "~/types";
import axios from "axios";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export async function getCars(): Promise<
  ActionResult<{ data: ResponseCarData[] }>
> {
  try {
    const response = await apiClient.get("/cars");
    return { success: true, data: response.data };
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

export async function getCarById(
  id: string,
): Promise<ActionResult<{ data: ResponseCarData }>> {
  try {
    const response = await apiClient.get(`/cars/${id}`);
    return { success: true, data: response.data };
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

export async function createCar(data: {
  routeId: string;
  carNumber: string;
}): Promise<ActionResult<{ data: ResponseCarData }>> {
  try {
    const response = await apiClient.post("/cars", data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "สร้างข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function updateCar(
  id: string,
  data: {
    id: string;
    createdAt: string;
    routeId: string;
    carNumber: string;
    status: "active" | "inactive";
  },
): Promise<ActionResult<{ data: ResponseCarData }>> {
  try {
    const response = await apiClient.patch(`/cars/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "อัปเดตข้อมูลไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function deleteCar(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await apiClient.delete(`/cars/${id}`);
    return { success: true, data: response.data };
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

export async function restoreCar(
  id: string,
): Promise<ActionResult<{ message: string }>> {
  try {
    const response = await apiClient.patch(`/cars/restore/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ?? error.message ?? "คืนค่าไม่สำเร็จ",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
