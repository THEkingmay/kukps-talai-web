import RedirectByRole from "../redirect-by-role";

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

/**
 * Legacy URL — the old state-based tab dashboard has been replaced by
 * route-based sections (/admin/cars, /admin/routes, ...).
 */
export default function LegacyDashboardRoute() {
  return <RedirectByRole />;
}
