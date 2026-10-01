import type { User } from "~/types";
import { TableSkeleton } from "~/components/ui/Loading";
import {
  Lock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: string;
  updatingId: string | null;
  onRestoreUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onRefresh: () => void;
  formatDate: (dateInput?: Date | string | null) => string;
}

export default function UserTable({
  users,
  filteredUsers,
  isLoading,
  error,
  currentUserId,
  updatingId,
  onRestoreUser,
  onDeleteUser,
  onRefresh,
  formatDate,
}: UserTableProps) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>บัญชีผู้ใช้</TableHead>
            <TableHead>เบอร์โทรศัพท์</TableHead>
            <TableHead>บทบาท (Role)</TableHead>
            <TableHead>สถานะ (Status)</TableHead>
            <TableHead>วันที่สร้าง</TableHead>
            <TableHead className="text-right">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton
              rowCount={5}
              columns={[
                { type: "avatar-text" },
                { type: "text" },
                { type: "badge" },
                { type: "badge" },
                { type: "text" },
                { type: "actions", className: "text-right" },
              ]}
            />
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-destructive">
                  <p className="mb-2">{error}</p>
                  <Button variant="outline" size="sm" onClick={onRefresh}>
                    ลองใหม่อีกครั้ง
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                ไม่พบข้อมูลผู้ใช้งานที่ตรงกับเงื่อนไข
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((item) => {
              const isDeleted = item.deletedAt !== null;
              const isCurrent = item.id === currentUserId;
              const isUpdatingThis = updatingId === item.id;
              const hasName = item.firstName || item.lastName;

              return (
                <TableRow
                  key={item.id}
                  className={isDeleted ? "opacity-60 grayscale" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={item.profileImageUrl || ""}
                          alt={hasName ? `${item.firstName || ""} ${item.lastName || ""}`.trim() : item.email}
                        />
                        <AvatarFallback>
                          {(item.firstName?.[0] || item.email[0]).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {hasName
                            ? `${item.firstName || ""} ${item.lastName || ""}`.trim()
                            : item.email}
                          {isCurrent && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] uppercase font-mono"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          {hasName ? item.email : item.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.phoneNumber ? (
                      <span className="font-mono">{item.phoneNumber}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.role === "superadmin"
                          ? "default"
                          : item.role === "admin" ||
                              item.role === "user" ||
                              item.role === "driver"
                            ? "secondary"
                            : "outline"
                      }
                      className="font-mono text-[10px] uppercase"
                    >
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge isDeleted={isDeleted} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {isDeleted ? (
                      <div className="flex items-center justify-end gap-2">
                        <Badge
                          variant="outline"
                          className="text-muted-foreground gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          ถูกลบแล้ว
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUpdatingThis}
                          onClick={() => onRestoreUser(item)}
                          title="กู้คืนผู้ใช้"
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "กู้คืน"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {!isCurrent && (
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={isUpdatingThis}
                            onClick={() => onDeleteUser(item)}
                            title="ลบบัญชีผู้ใช้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground font-mono flex items-center justify-between">
        <span>
          แสดง {filteredUsers.length} จาก {users.length} รายการ
        </span>
        <span>ความปลอดภัย: Super Admin Control</span>
      </div>
    </div>
  );
}

function StatusBadge({ isDeleted }: { isDeleted: boolean }) {
  if (!isDeleted) {
    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200 gap-1 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
      >
        <CheckCircle2 className="w-3 h-3 animate-pulse" />
        ใช้งานอยู่
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground gap-1">
      <XCircle className="w-3 h-3" />
      ลบแล้ว
    </Badge>
  );
}
