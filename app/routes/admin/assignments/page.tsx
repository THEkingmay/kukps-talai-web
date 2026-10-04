import AssignmentDriverComponent from "../dashboard/components/assignment-driver.component";

export function meta() {
  return [
    { title: "การจัดการงานผู้ขับรถ — KUKPS smart talai" },
    { name: "description", content: "จัดการงานผู้ขับรถ" },
  ];
}

export default function AssignmentsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <AssignmentDriverComponent />
    </div>
  );
}
