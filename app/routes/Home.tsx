import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-sky-500 rounded flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7v5l3 3"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              KUKPS Talai Transit
            </span>
          </div>
          <Link
            to="/auth"
            id="nav-admin-login"
            className="text-xs font-medium text-gray-500 hover:text-sky-600 transition-colors"
          >
            เข้าสู่ระบบผู้ดูแล →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: copy & CTA */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Status badge */}
            <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ระบบออนไลน์
            </span>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                ระบบติดตาม
                <br />
                <span className="text-sky-500">รถตะลัย</span>
                <br />
                <span className="text-gray-300 font-light">แบบเรียลไทม์</span>
              </h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-sm">
                ติดตามรถสวัสดิการ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
                ทราบตำแหน่งและเวลาเดินทางได้แม่นยำ
              </p>
            </div>

            {/* Divider line */}
            <div className="border-t border-gray-200" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="home-download-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                ดาวน์โหลดแอป
              </button>
              <Link
                to="/auth"
                id="home-admin-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                เข้าสู่ระบบผู้ดูแล
              </Link>
            </div>

            {/* Footnote */}
            <p className="text-xs font-mono text-gray-400">
              KUKPS Transit Control · KU Kamphaeng Saen Campus
            </p>
          </div>

          {/* Right: mock control panel */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Window chrome */}
              <div className="h-9 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <span className="text-xs font-mono text-gray-400 select-none">
                  live-fleet-monitor — v2.1
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 border-b border-gray-100">
                <StatCell
                  label="ยานพาหนะที่ใช้งาน"
                  value="12"
                  unit="/15"
                  unitColor="text-sky-400"
                />
                <StatCell
                  label="ความหน่วงของระบบ"
                  value="42"
                  unit="ms"
                  unitColor="text-gray-400"
                  border
                />
                <StatCell
                  label="เส้นทางที่ใช้งาน"
                  value="4"
                  unit=" เส้น"
                  unitColor="text-gray-400"
                  border
                />
              </div>

              {/* Map area */}
              <div className="relative h-64 bg-gray-50">
                {/* Grid pattern */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="28"
                      height="28"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 28 0 L 0 0 0 28"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Ping beacon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-8 rounded-full border border-sky-200 opacity-50 animate-ping" />
                    <div className="absolute -inset-4 rounded-full border border-sky-200" />
                    <div className="w-3 h-3 bg-sky-500 rounded-full shadow-sm shadow-sky-200" />
                  </div>
                </div>

                {/* Coordinate overlay */}
                <div className="absolute bottom-3 left-3 bg-white border border-gray-200 rounded px-2.5 py-1">
                  <span className="text-xs font-mono text-gray-500">
                    LAT: 14.0208 / LNG: 99.9722
                  </span>
                </div>

                {/* Status chip */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-gray-500">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400">
            © 2567 KUKPS Talai Transit
          </span>
          <span className="text-xs font-mono text-gray-300">
            Powered by GPS + MQTT
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Sub-component ─── */
function StatCell({
  label,
  value,
  unit,
  unitColor,
  border = false,
}: {
  label: string;
  value: string;
  unit: string;
  unitColor: string;
  border?: boolean;
}) {
  return (
    <div
      className={`p-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors ${border ? "border-l border-gray-100" : ""}`}
    >
      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider truncate">
        {label}
      </span>
      <span className="text-2xl font-light font-mono text-gray-900 leading-none">
        {value}
        <span className={`text-sm ${unitColor}`}>{unit}</span>
      </span>
    </div>
  );
}
