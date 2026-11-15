import { RefreshCw, AlertCircle, MapPin, Clock, Loader2 } from "lucide-react";
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
import { useCarHistoryLogs } from "~/routes/admin/dashboard/hooks/useCarHistoryLogs";

interface CarHistoryLogListProps {
  carId: string;
  formatDate: (dateInput?: Date | string | null) => string;
}

export default function CarHistoryLogList({
  carId,
  formatDate,
}: CarHistoryLogListProps) {
  const history = useCarHistoryLogs({ carId });

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar with Refresh Button */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            {history.logs.length} รายการล่าสุด (100 ล่าสุด)
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={history.refresh}
          disabled={history.isLoading}
          className="h-8"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-2 ${history.isLoading ? "animate-spin" : ""}`}
          />
          รีเฟรช
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-background">
        <div className="max-h-[65vh] overflow-y-auto relative">
          <Table className="text-xs font-mono">
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>เวลาบันทึก</span>
                  </div>
                </TableHead>
                <TableHead>ละติจูด (Lat)</TableHead>
                <TableHead>ลองจิจูด (Lng)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {history.isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary/60" />
                    <span>กำลังโหลดประวัติ...</span>
                  </TableCell>
                </TableRow>
              ) : history.error ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="inline-flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{history.error}</span>
                      <button
                        type="button"
                        onClick={history.refresh}
                        className="ml-2 font-bold underline hover:text-destructive/80"
                      >
                        ลองอีกครั้ง
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : history.logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-muted-foreground"
                  >
                    <MapPin className="w-8 h-8 opacity-20 mx-auto mb-3" />
                    <p className="font-sans text-sm font-medium">
                      ไม่พบประวัติการเดินทาง
                    </p>
                    <p className="font-sans mt-1 text-xs opacity-70">
                      ยังไม่มีการบันทึกพิกัด GPS
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                history.logs.map((log, index) => {
                  const isLatest = index === 0;

                  return (
                    <TableRow
                      key={log.id}
                      className={
                        isLatest ? "bg-primary/5 hover:bg-primary/10" : ""
                      }
                    >
                      <TableCell className="text-center text-muted-foreground">
                        {isLatest ? (
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-pulse"
                            title="ล่าสุด"
                          />
                        ) : (
                          index + 1
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {formatDate(log.createdAt)}
                          {isLatest && (
                            <Badge
                              variant="default"
                              className="h-4 px-1.5 text-[10px] leading-none py-0 uppercase"
                            >
                              ล่าสุด
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {log.lat.toFixed(5)}
                      </TableCell>

                      <TableCell className="font-medium">
                        {log.lng.toFixed(5)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
