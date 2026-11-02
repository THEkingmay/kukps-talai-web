import { isSameDay, isToday } from "date-fns";

// Format Helper
const formatDate = (dateInput?: Date | string | null) => {
  if (!dateInput) return "-";
  try {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return String(dateInput);
  }
};

const toDate = (input: Date | string) =>
  typeof input === "string" ? new Date(input) : input;

const thaiDateFormatter = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
});
const thaiFullDateFormatter = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const thaiMonthYearFormatter = new Intl.DateTimeFormat("th-TH", {
  month: "long",
  year: "numeric",
});
const thaiDayFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const thaiShortDayFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
});
const thaiTimeFormatter = new Intl.DateTimeFormat("th-TH", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "2 พ.ย. 2569" */
export const formatThaiDate = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiDateFormatter.format(toDate(input));
};

/** "วันจันทร์ที่ 2 พฤศจิกายน 2569" */
export const formatThaiFullDate = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiFullDateFormatter.format(toDate(input));
};

/** "พฤศจิกายน 2569" */
export const formatThaiMonthYear = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiMonthYearFormatter.format(toDate(input));
};

/** "3 พ.ย. 2569" */
export const formatThaiDay = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiDayFormatter.format(toDate(input));
};

/** "3 พ.ย." */
export const formatThaiShortDay = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiShortDayFormatter.format(toDate(input));
};

/** "15:01" */
export const formatThaiTime = (input?: Date | string | null) => {
  if (!input) return "-";
  return thaiTimeFormatter.format(toDate(input));
};

/** "15:01 – 18:01" หรือ "2 พ.ย. 23:01 – 3 พ.ย. 04:01" สำหรับกะข้ามวัน */
export const formatTimeWindow = (
  startInput: Date | string,
  endInput: Date | string,
) => {
  const start = toDate(startInput);
  const end = toDate(endInput);

  if (isSameDay(start, end)) {
    return `${formatThaiTime(start)} – ${formatThaiTime(end)}`;
  }

  const startDay =
    start.getFullYear() === end.getFullYear()
      ? formatThaiShortDay(start)
      : formatThaiDay(start);
  const endDay =
    start.getFullYear() === end.getFullYear()
      ? formatThaiShortDay(end)
      : formatThaiDay(end);

  return `${startDay} ${formatThaiTime(start)} – ${endDay} ${formatThaiTime(end)}`;
};

/** "วันนี้ · 15:01 – 18:01" หรือ "2 พ.ย. 2569 · 15:01 – 18:01" */
export const formatShiftWindow = (
  startInput: Date | string,
  endInput: Date | string,
) => {
  const start = toDate(startInput);
  const end = toDate(endInput);

  if (isSameDay(start, end)) {
    const day = isToday(start) ? "วันนี้" : formatThaiDate(start);
    return `${day} · ${formatThaiTime(start)} – ${formatThaiTime(end)}`;
  }

  return formatTimeWindow(start, end);
};

export { formatDate };
