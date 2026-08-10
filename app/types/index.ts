export type UserRole = "superadmin" | "admin" | "user";
export type InviteStatus = "pending" | "accepted" | "rejected";
export type CarStatus = "active" | "inactive";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended" | "deleted";
  createdAt: string;
}

export interface AdminInvite {
  // ไม่แสดง code ผ่านหน้าจอ
  email: string;
  addedBy: string;
  status: InviteStatus;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
}

export interface RoutePoint {
  id: string;
  routeId: string;
  sequence: number;
  lat: number;
  lng: number;
  name: string | null;
  timeToNextSecs: number | null;
}

export type ResponseCarData = {
  routeId: string | null;
  carNumber: string;
  status: "active" | "inactive";
  createdAt: Date;
  id: string;
  updatedBy: string | null;
  updatedAt: Date;
};
export interface CarHistoryLog {
  id: string;
  carId: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface SessionUserType {
  id: string;
  email: string;
  role: UserRole;
  loginAt: string; // timestampz
}
