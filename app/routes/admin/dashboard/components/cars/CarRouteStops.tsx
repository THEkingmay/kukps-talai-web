import { useState, useEffect, useCallback } from "react";
import type { RoutePoint } from "~/types";
import { getRoutePointsByRouteId } from "~/actions/route-points.action";
import { RefreshCw, MapPin, AlertCircle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface CarRouteStopsProps {
  routeId: string;
  routeName: string;
  onManage: () => void;
}

export default function CarRouteStops({
  routeId,
  routeName,
  onManage,
}: CarRouteStopsProps) {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRoutePointsByRouteId(routeId);
      if (res.success) {
        setPoints([...res.data.data].sort((a, b) => a.sequence - b.sequence));
      } else {
        setError(res.error || "ไม่สามารถดึงข้อมูลจุดจอดได้");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {points.length} จุด · {routeName}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPoints}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </Button>
          <Button size="sm" onClick={onManage} className="h-8">
            <MapPin className="w-3.5 h-3.5 mr-2" />
            จัดการจุดจอด
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background">
        <div className="max-h-[65vh] overflow-y-auto relative">
          <Table className="text-xs font-mono">
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>SEQ</TableHead>
                <TableHead>ชื่อจุด / ป้าย</TableHead>
                <TableHead>ละติจูด (Lat)</TableHead>
                <TableHead>ลองจิจูด (Lng)</TableHead>
                <TableHead>เวลาไปจุดถัดไป</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary/60" />
                    <span>กำลังโหลดจุดจอด...</span>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="inline-flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                      <button
                        type="button"
                        onClick={fetchPoints}
                        className="ml-2 font-bold underline hover:text-destructive/80"
                      >
                        ลองอีกครั้ง
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : points.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <MapPin className="w-8 h-8 opacity-20 mx-auto mb-3" />
                    <p className="font-sans text-sm font-medium">
                      สายรถนี้ยังไม่มีจุดจอด
                    </p>
                    <p className="font-sans mt-1 text-xs opacity-70">
                      กด "จัดการจุดจอด" เพื่อกำหนดจุดจอดบนแผนที่
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                points.map((point, index) => (
                  <TableRow key={point.id}>
                    <TableCell className="text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {point.sequence}
                    </TableCell>
                    <TableCell className="font-sans font-medium">
                      {point.name ? (
                        point.name
                      ) : (
                        <span className="text-muted-foreground italic">
                          จุดผ่าน (ไม่มีชื่อ)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {point.lat.toFixed(5)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {point.lng.toFixed(5)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {point.timeToNextSecs != null
                        ? `${point.timeToNextSecs} วิ`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
