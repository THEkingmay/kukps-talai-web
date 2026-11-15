import type { User } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/helper";

interface UserProfileViewPanelProps {
  user: User;
  userInitial: string;
  fullName: string;
}

/** Read-only account details of the profile sheet. */
export default function UserProfileViewPanel({
  user,
  userInitial,
  fullName,
}: UserProfileViewPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 pt-12 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Section - Left Aligned */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border shadow-sm">
          {user.profileImageUrl && (
            <AvatarImage
              src={user.profileImageUrl}
              alt={fullName}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-muted text-foreground font-mono text-xl">
            {userInitial}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col pt-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight">{fullName}</h3>
            <Badge
              variant={
                user.role === "admin" || user.role === "superadmin"
                  ? "default"
                  : "secondary"
              }
              className="uppercase text-[10px] px-1.5 py-0 h-5 font-medium tracking-wider"
            >
              {user.role}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
        </div>
      </div>

      {/* Details Section - Refined Card */}
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-foreground px-1">
          ข้อมูลทั่วไป
        </h4>
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-muted-foreground">ไอดีบัญชี</span>
            <span
              className="font-mono text-xs max-w-[150px] sm:max-w-[200px] truncate text-right bg-muted/50 px-2 py-1 rounded"
              title={user.id}
            >
              {user.id}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-muted-foreground">ชื่อ</span>
            <span className="font-medium text-right">
              {user.firstName || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-muted-foreground">นามสกุล</span>
            <span className="font-medium text-right">
              {user.lastName || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-muted-foreground">เบอร์โทร</span>
            <span className="font-medium text-right">
              {user.phoneNumber || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between p-4">
            <span className="text-muted-foreground">เข้าร่วมเมื่อ</span>
            <span className="font-medium text-right">
              {user.createdAt ? formatDate(user.createdAt) : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
