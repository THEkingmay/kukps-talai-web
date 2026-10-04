import EtaView from "../dashboard/components/eta/EtaView";

export function meta() {
  return [
    { title: "ดูตำแหน่งรถแบบเรียลไทม์ — KUKPS smart talai" },
    { name: "description", content: "ดูตำแหน่งรถแบบเรียลไทม์" },
  ];
}

export default function AdminEtaPage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <EtaView role="admin" />
    </div>
  );
}
