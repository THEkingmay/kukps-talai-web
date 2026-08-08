import { Link } from "react-router";
import {
  Bus,
  ArrowRight,
  Download,
  UserCheck,
  MapPin,
  Clock,
  Map,
  Smartphone,
} from "lucide-react";

export function meta() {
  return [
    { title: "KUKPS smart talai — ระบบติดตามรถตะไล มก.กำแพงแสน" },
    {
      name: "description",
      content:
        "แอปพลิเคชันติดตามตำแหน่งและตารางเวลาการเดินรถสวัสดิการตะไล มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน",
    },
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
              <Bus className="w-5 h-5 text-white" />
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
            <ArrowRight className="w-3.5 h-3.5" />
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
                <Download className="w-5 h-5 text-emerald-100" />
                <span>ดาวน์โหลดแอป Android (.APK)</span>
              </button>

              <Link
                to="/auth"
                id="home-admin-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition-all"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>เข้าสู่ระบบผู้ดูแลระบบ</span>
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
              Icon={MapPin}
              title="เช็กตำแหน่งเรียลไทม์"
              description="มองเห็นพิกัดของรถตะไลทุกคันบนแผนที่ campus แบบสดๆ ไม่ต้องยืนรอลุ้น"
            />
            <FeatureCard
              Icon={Clock}
              title="คำนวณเวลาถึงป้าย"
              description="ทราบเวลาประมาณการที่รถจะมาถึงป้ายถัดไปได้แม่นยำ วางแผนเวลาเรียนได้เป๊ะ"
            />
            <FeatureCard
              Icon={Map}
              title="แผนที่สายการเดินรถ"
              description="รวมข้อมูลเส้นทางเดินรถทุกสายใน มก.กำแพงแสน เข้าใจง่าย ครอบคลุมทุกคณะ"
            />
            <FeatureCard
              Icon={Smartphone}
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
  Icon,
  title,
  description,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group flex flex-col justify-between">
      <div className="space-y-3">
        <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
