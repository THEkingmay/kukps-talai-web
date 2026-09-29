import EtaView from "../admin/dashboard/components/eta/EtaView";

export function meta() {
  return [
    { title: "ติดตามรถ — KUKPS smart talai" },
    { name: "description", content: "ดูตำแหน่งรถแบบเรียลไทม์" },
  ];
}

export default function EtaPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <EtaView role="user" />
    </div>
  );
}
