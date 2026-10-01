import type { AdminInvite } from "~/types";
import { TableSkeleton } from "~/components/ui/Loading";
import {
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface InviteTableProps {
  filteredInvites: AdminInvite[];
  isLoading: boolean;
  deletingEmail: string | null;
  onDeleteInvite: (invite: AdminInvite) => void;
}

export default function InviteTable({
  filteredInvites,
  isLoading,
  deletingEmail,
  onDeleteInvite,
}: InviteTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>อีเมลผู้รับเชิญ</TableHead>
            <TableHead>สร้างโดย (Added By)</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>ระดับสิทธิ์</TableHead>
            <TableHead>วันที่สร้าง</TableHead>
            <TableHead className="text-right">แอ็กชัน</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton
              rowCount={5}
              columns={[
                { type: "text" },
                { type: "badge" },
                { type: "badge" },
                { type: "badge" },
                { type: "text" },
                { type: "actions", className: "text-right" },
              ]}
            />
          ) : filteredInvites.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                ไม่พบรายการรหัสเชิญ
              </TableCell>
            </TableRow>
          ) : (
            filteredInvites.map((invite, index) => (
              <TableRow key={invite.email || index}>
                <TableCell className="font-medium text-foreground">
                  {invite.email}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {invite.addedBy || "Super Admin"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={invite.status} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invite.role === "superadmin"
                        ? "default"
                        : invite.role === "admin" || invite.role === "driver"
                          ? "secondary"
                          : "outline"
                    }
                    className="font-mono text-[10px] uppercase"
                  >
                    {invite.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {invite.createdAt
                    ? new Date(invite.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {invite.status === "pending" ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteInvite(invite)}
                      disabled={deletingEmail === invite.email}
                    >
                      {deletingEmail === invite.email ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">ลบคำเชิญ</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="text-muted-foreground opacity-50"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      ลบไม่ได้
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 gap-1 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          ลงทะเบียนแล้ว
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1">
          <XCircle className="w-3.5 h-3.5" />
          ยกเลิก
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-200 gap-1 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30"
        >
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          รอยืนยัน
        </Badge>
      );
  }
}
