import { Link } from "react-router";

export function meta() {
  return [
    { title: "KUKPS smart talai — ระบบติดตามรถตะไล มก.กำแพงแสน" },
    { name: "description", content: "แอปพลิเคชันติดตามตำแหน่งและตารางเวลาการเดินรถสวัสดิการตะไล มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน" },
  ];
}

export default function Home() {
  const handleDownload = () => {
    // Trigger direct Android APK download
    const link = document.createElement("a");
    link.href = "#"; // Replace with actual APK link when available
    link.download = "kukps-talai.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("กำลังเริ่มดาวน์โหลดแอปพลิเคชัน KUKPS smart talai สำหรับ Android (.apk)");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8m-8 4h8m-4 4h4m1 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block leading-none">
                KUKPS smart talai
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-medium mt-0.5 block">
                มหาวิทยาลัยเกษตรศาสตร์
              </span>
            </div>
          </div>
          <Link
            to="/auth"
            id="nav-admin-login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all duration-200"
          >
            <span>เข้าสู่ระบบผู้ดูแล</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content Surface */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 lg:py-14 flex flex-col gap-12">
        {/* Minimal Hero Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-6 relative z-10">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                ระบบติดตามบริการรถตะไล
                <br />
                <span className="text-emerald-700">
                  สะดวกรวดเร็ว แม่นยำทุกการเดินทาง
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                แอปพลิเคชันติดตามตำแหน่งและตรวจสอบตารางเวลาการเดินรถสวัสดิการตะไล
                ครอบคลุมทุกจุดบริการภายใน มก.กำแพงแสน
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="home-download-btn"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all shadow-sm active:scale-[0.99]"
              >
                {/* Android Icon */}
                <svg
                  className="w-5 h-5 text-emerald-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.552 0 .9997.4482.9997.9993s-.4477.9997-.9997.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.552 0 .9997.4482.9997.9993s-.4476.9997-.9997.9997zm11.4045-6.02l1.9973-3.4592c.1256-.2176.051-.4956-.1666-.6212-.2177-.1256-.4957-.051-.6213.1666l-2.0298 3.5155c-1.4883-.6796-3.1554-1.0607-4.9101-1.0607s-3.4218.3811-4.9101 1.0607l-2.0298-3.5155c-.1256-.2176-.4036-.2922-.6213-.1666-.2176.1256-.2922.4036-.1666.6212l1.9973 3.4592c-3.1706 1.7371-5.3039 4.9575-5.5907 8.7042h22.6423c-.2868-3.7467-2.4201-6.9671-5.5907-8.7042z" />
                </svg>
                ดาวน์โหลดแอป Android (.APK)
              </button>

              <Link
                to="/auth"
                id="home-admin-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
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
                เข้าสู่ระบบผู้ดูแลระบบ
              </Link>
            </div>

            {/* Platform Note */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>รองรับเฉพาะระบบปฏิบัติการ Android เท่านั้น (Android 8.0 ขึ้นไป)</span>
            </div>
          </div>
        </section>

        {/* System Highlights & Features Grid */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold block mb-1">
              System Highlights
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              ฟังก์ชันหลักของระบบ KUKPS smart talai
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              }
              title="เช็กตำแหน่งเรียลไทม์"
              description="มองเห็นพิกัดของรถตะไลทุกคันบนแผนที่ campus แบบสดๆ ไม่ต้องยืนรอลุ้น"
            />
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
              title="คำนวณเวลาถึงป้าย"
              description="ทราบเวลาประมาณการที่รถจะมาถึงป้ายถัดไปได้แม่นยำ วางแผนเวลาเรียนได้เป๊ะ"
            />
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              }
              title="แผนที่สายการเดินรถ"
              description="รวมข้อมูลเส้นทางเดินรถทุกสายใน มก.กำแพงแสน เข้าใจง่าย ครอบคลุมทุกคณะ"
            />
            <FeatureCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              }
              title="ติดตั้งบน Android"
              description="ออกแบบไฟล์ติดตั้ง APK ให้มีขนาดเบา ใช้งานเสถียร ประหยัดแบตเตอรี่"
            />
          </div>
        </section>

        {/* 3 Step Quick Start Guide */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold block">
              Easy Steps
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              3 ขั้นตอนง่ายๆ ในการเริ่มใช้งานบนมือถือ Android
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold font-mono flex items-center justify-center text-base shadow-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">กดดาวน์โหลดไฟล์ APK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                กดปุ่มดาวน์โหลดบนหน้าเว็บเพื่อรับไฟล์ติดตั้งสำหรับมือถือ Android
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold font-mono flex items-center justify-center text-base shadow-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">เปิดแอปและเลือกสายรถ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                กดติดตั้งแอปพลิเคชันและเปิดใช้งาน เลือกสายรถตะไลที่ต้องการเดินทาง
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold font-mono flex items-center justify-center text-base shadow-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">เดินทางได้ทันที</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ติดตามพิกัดรถบนแผนที่และออกมารอรถตะไลได้ตรงตามเวลา
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-emerald-700 rounded flex items-center justify-center text-white text-xs font-bold font-mono">
              KU
            </div>
            <span className="text-xs font-semibold text-slate-800">
              KUKPS smart talai System
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            © 2567 มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
          </span>
        </div>
      </footer>
    </div>
  );
}

/* Feature Card Sub-component */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group flex flex-col justify-between">
      <div className="space-y-3">
        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {icon}
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
