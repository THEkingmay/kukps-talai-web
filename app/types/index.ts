export type UserRole = "superadmin" | "admin" | "user" | "driver";
export type InviteStatus = "pending" | "accepted" | "rejected";
export type CarStatus = "active" | "inactive";
export type InviteRole = "superadmin" | "admin" | "driver";

export interface User {
  id: string;
  email: string;
  role: "superadmin" | "admin" | "user" | "driver";
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  phoneNumber: string | null;
}

export interface AdminInvite {
  // ไม่แสดง code ผ่านหน้าจอ
  email: string;
  addedBy: string;
  status: InviteStatus;
  role: InviteRole;
  createdAt: string;
}

export interface Route {
  id: string;
  name: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  deletedAt: string | null;
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
  id: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedBy: string | null;
  updatedAt: Date;
  routeId: string | null;
  carNumber: string;
  status: "active" | "inactive";
  driverData?: {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    email: string | null;
  } | null;
};
export interface CarHistoryLog {
  id: string;
  carId: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface CarDriverShift {
  id: string;
  carId: string;
  driverId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  editOption: {
    isEditable: boolean;
    message: string;
  }; // จาก backend: ประเมินว่าลบ/แก้ไขได้หรือไม่ พร้อมเหตุผล
}

export interface SessionUserType {
  id: string;
  email: string;
  role: UserRole;
  loginAt: string; // timestampz
}

export interface DrivingLog {
  id: string;
  shiftId: string;
  startedAt: Date;
  endedAt: Date | null;
  status: "active" | "ended";
  createdAt: Date;
}

export type NotificationAlertType = "driver_not_confirmed";
export type NotificationPayloadType_driver_not_confirmed = {
  carId: string;
  timestamp: string;
};

export interface Notification {
  id: string;
  alertType: NotificationAlertType;
  carId: string | null;
  message: string;
  payload: NotificationPayloadType_driver_not_confirmed;
  createdAt: Date;
}
