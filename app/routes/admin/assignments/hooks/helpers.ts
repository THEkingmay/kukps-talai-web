import { isAfter, isBefore } from "date-fns";

import type { DrivingLog, User } from "~/types";

export type StatusBadge = {
  label: string;
  variant: "default" | "secondary" | "outline";
};

/** ชื่อที่แสดงของคนขับ — ใช้ email เป็นตัวสำรองเมื่อไม่มีชื่อ */
export const driverName = (user: User) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
};

/** อักษรย่อสำหรับ AvatarFallback */
export const driverInitials = (user: User) => {
  const first = (user.firstName ?? "").trim().charAt(0);
  const last = (user.lastName ?? "").trim().charAt(0);
  return (first + last || user.email.charAt(0)).toUpperCase();
};

export const shiftStatus = (
  start: Date | string,
  end: Date | string,
): StatusBadge => {
  const now = new Date();
  if (isBefore(now, new Date(start))) {
    return { label: "งานในอนาคต", variant: "secondary" };
  }
  if (isAfter(now, new Date(end))) {
    return { label: "งานสิ้นสุดแล้ว", variant: "outline" };
  }
  return { label: "กำลังดำเนินอยู่", variant: "default" };
};

export const logStatus = (log: DrivingLog): StatusBadge =>
  log.status === "active"
    ? { label: "กำลังขับ", variant: "default" }
    : { label: "สิ้นสุดแล้ว", variant: "outline" };
