import RedirectByRole from "./redirect-by-role";

export function meta() {
  return [
    { title: "Dashboard — KUKPS smart talai" },
    {
      name: "description",
      content:
        "ระบบควบคุมและบริหารจัดการ KUKPS smart talai สำหรับผู้ดูแลระบบ",
    },
  ];
}

export default function AdminIndexRoute() {
  return <RedirectByRole />;
}
