import type { CarDriverShift } from "~/types";
import apiClient from "~/configs/axios";
import axios from "axios";
export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

// format response from backend = {success : boolean , data }

export async function getAll(): Promise<
  ActionResult<{ data: CarDriverShift[] }>
> {
  try {
    const response = await apiClient.get("/assignment-driver");
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ไม่สามารถดึงข้อมูลได้",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function getByDriverId(
  id: string,
): Promise<ActionResult<{ data: CarDriverShift[] }>> {
  try {
    const response = await apiClient.get(`/assignment-driver/driver/${id}`);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ไม่สามารถดึงข้อมูลได้",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function create(data: {
  carId: string;
  driverId: string;
  startTime: Date;
  endTime: Date;
}) {
  try {
    const response = await apiClient.post("/assignment-driver", data);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ??
          err.message ??
          "ไม่สามารถสร้างข้อมูลได้",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function update(
  id: string,
  data: {
    id: string;
    carId: string;
    driverId: string;
    startTime: Date;
    endTime: Date;
  },
) {
  try {
    const response = await apiClient.put(`/assignment-driver/${id}`, data);
    return { success: true, data: response.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ??
          err.message ??
          "ไม่สามารถอัปเดตข้อมูลได้",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

export async function deleteById(id: string) {
  try {
    await apiClient.delete(`/assignment-driver/${id}`);
    return { success: true };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        error:
          err.response?.data?.message ?? err.message ?? "ไม่สามารถลบข้อมูลได้",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
