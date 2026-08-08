import apiClient from "~/configs/axios";
import type { Route } from "~/types";
import axios from "axios";


export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };


export async function getRoutes(): Promise<ActionResult<{data : Route[]}>> {
  try {
    const response = await apiClient.get("/routes");
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

export async function getRouteById(id: string): Promise<ActionResult<{data : Route}>> {
  try {
    const response = await apiClient.get(`/routes/${id}`);
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

export async function createRoute(name:string): Promise<ActionResult<{data: Route}>> {
  try {
    const response = await apiClient.post("/routes", { name });
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

export async function deleteRoute(id: string): Promise<ActionResult<{message: string}>> {
  try {
    const response = await apiClient.delete(`/routes/${id}`);
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

export async function updateRoute(id: string, name: string): Promise<ActionResult<{data: Route}>> {
  try {
    const response = await apiClient.patch(`/routes/${id}`, { name });
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
