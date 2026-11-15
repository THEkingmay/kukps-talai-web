import { Link } from "react-router";
import type { DrivingLog, ResponseCarData, Route } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatDate, formatElapsed } from "~/helper";
import { CarStatusBadge } from "~/routes/admin/dashboard/components/cars/CarTable";
import InfoCard from "./InfoCard";
import {
  Car,
  Clock,
  Database,
  ExternalLink,
  MapPin as MapPinIcon,
  RefreshCw,
  Route as RouteIcon,
  Settings,
  User,
  Wifi,
} from "lucide-react";

interface CarOverviewTabProps {
  car: ResponseCarData;
  carRoute: Route | null;
  routeStopCount: number;
  currentDriving: DrivingLog | null;
  now: number;
  onOpenEdit: () => void;
  isDeleted: boolean;
}

/** "ข้อมูลทั่วไป" tab: assigned route, identity grid, driver + current shift. */
export default function CarOverviewTab({
  car,
  carRoute,
  routeStopCount,
  currentDriving,
  now,
  onOpenEdit,
  isDeleted,
}: CarOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Assigned Route Card */}
      <Card className="border-border/50 transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <RouteIcon className="h-4 w-4 text-muted-foreground/70" />
              สายการเดินรถที่กำหนด
            </CardTitle>
            {carRoute && (
              <Button variant="ghost" size="sm" asChild className="h-8 px-3">
                <Link
                  to={`/admin/routes/${carRoute.id}`}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  ดูรายละเอียด
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {carRoute ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RouteIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {carRoute.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {carRoute.id}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <MapPinIcon className="h-3 w-3" />
                    {routeStopCount} จุดหยุด
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/50">
                <RouteIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  ยังไม่ได้กำหนดสายการเดินรถ
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  กด "แก้ไขข้อมูล" เพื่อเลือกสายรถ
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenEdit}
                className="w-full sm:w-auto"
              >
                <Settings className="mr-1.5 h-3.5 w-3.5" />
                ตั้งค่าสายรถ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={<Database className="h-4 w-4" />}
          label="รหัสระบบ (ID)"
          value={car.id}
          mono
          copyable
        />
        <InfoCard
          icon={<Car className="h-4 w-4" />}
          label="สถานะการเคลื่อนที่"
          value={<CarStatusBadge status={car.status} isDeleted={isDeleted} />}
        />
        <InfoCard
          icon={<User className="h-4 w-4" />}
          label="ผู้แก้ไขล่าสุด"
          value={car.updatedBy || "System Admin"}
          mono
        />
        <InfoCard
          icon={<Clock className="h-4 w-4" />}
          label="สร้างเมื่อ"
          value={formatDate(car.createdAt)}
        />
        <InfoCard
          icon={<RefreshCw className="h-4 w-4" />}
          label="อัปเดตล่าสุด"
          value={formatDate(car.updatedAt)}
        />
        <InfoCard
          icon={<Wifi className="h-4 w-4" />}
          label="MQTT Topic"
          value={`cars/${car.id}`}
          mono
          copyable
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              คนขับรถที่รับผิดชอบปัจจุบัน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {car.driverData ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-muted">
                      {car.driverData.profileImageUrl ? (
                        <AvatarImage
                          src={car.driverData.profileImageUrl}
                          alt={car.driverData.email || "User"}
                          className="transition-transform hover:scale-[1.02]"
                        />
                      ) : (
                        <AvatarFallback className="bg-muted transition-colors hover:bg-muted/80">
                          {car.driverData.firstName?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {car.driverData.firstName} {car.driverData.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {car.driverData.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/assignments/${car.driverData.id}`}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    ดูประวัติการมอบหมายงาน
                  </Link>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <Avatar className="h-8 w-8 border-muted">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        ?
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ไม่มีข้อมูลคนขับรถที่รับผิดชอบปัจจุบัน
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    โปรดตรวจสอบการมอบหมายงานในระบบ
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              สถานะการทำงานปัจจุบัน
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentDriving ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  เริ่มทำงาน: {formatDate(currentDriving.startedAt)}
                </p>
                <p className="text-base font-semibold text-foreground">
                  ทำงานมาแล้ว{" "}
                  {formatElapsed(
                    now - new Date(currentDriving.startedAt).getTime(),
                  )}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">ยังไม่ได้กดเริ่มงาน</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
