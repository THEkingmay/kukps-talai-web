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

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { ModeToggle } from "~/components/mode-toggle";

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

    alert(
      "กำลังเริ่มดาวน์โหลดแอปพลิเคชัน KUKPS smart talai สำหรับ Android (.apk)",
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {/*<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Bus className="h-4 w-4" />
            </div>
            }*/}
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none tracking-tight">
                TalaiETA
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                มหาวิทยาลัยเกษตรศาสตร์
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Link to="/auth" id="nav-admin-login">
                เข้าสู่ระบบเจ้าหน้าที่
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="sm:hidden">
              <Link to="/auth">
                <UserCheck className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Surface */}
      <main className="container mx-auto flex max-w-6xl flex-1 flex-col gap-16 px-6 py-12 md:py-24">
        {/* Minimal Hero Section */}
        <section className="relative flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
            <span className="h-2 w-2 rounded-full bg-primary" />
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            ระบบติดตามบริการรถตะไล
            <br />
          </h1>

          <p className="mt-6 max-w-[42rem] text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            แอปพลิเคชันติดตามตำแหน่งและตรวจสอบตารางเวลาการเดินรถสวัสดิการตะไล
            ครอบคลุมทุกจุดบริการภายใน มก.กำแพงแสน
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row sm:w-auto">
            <Button
              size="lg"
              onClick={handleDownload}
              className="gap-2 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              ดาวน์โหลดแอป Android (.APK)
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Link to="/auth">
                <UserCheck className="h-4 w-4" />
                เข้าสู่ระบบเจ้าหน้าที่
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            รองรับเฉพาะระบบปฏิบัติการ Android เท่านั้น (Android 8.0 ขึ้นไป)
          </div>
        </section>

        {/* System Highlights & Features Grid */}
        <section className="space-y-8">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              System Highlights
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              ฟังก์ชันหลักของระบบ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <section className="space-y-8 rounded-3xl border bg-card p-8 shadow-sm sm:p-12">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Easy Steps
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              3 ขั้นตอนง่ายๆ ในการเริ่มใช้งาน
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                1
              </div>
              <h3 className="font-bold">กดดาวน์โหลดไฟล์ APK</h3>
              <p className="text-sm text-muted-foreground">
                กดปุ่มดาวน์โหลดบนหน้าเว็บเพื่อรับไฟล์ติดตั้งสำหรับมือถือ Android
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                2
              </div>
              <h3 className="font-bold">เปิดแอปและเลือกสายรถ</h3>
              <p className="text-sm text-muted-foreground">
                กดติดตั้งแอปพลิเคชันและเปิดใช้งาน
                เลือกสายรถตะไลที่ต้องการเดินทาง
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                3
              </div>
              <h3 className="font-bold">เดินทางได้ทันที</h3>
              <p className="text-sm text-muted-foreground">
                ติดตามพิกัดรถบนแผนที่และออกมารอรถตะไลได้ตรงตามเวลา
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-background">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
              KU
            </div>
            <span className="text-sm font-semibold">KUKPS TALAI ETA</span>
          </div>
          <span className="text-xs text-muted-foreground">
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
    <Card className="transition-all hover:border-foreground/20 hover:shadow-md">
      <CardHeader>
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
