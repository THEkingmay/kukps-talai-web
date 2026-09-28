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

export { formatDate };
