import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "~/components/providers/AuthProvider";
import { useDialog } from "~/components/providers/DialogProvider";
import { UserProfileSheet } from "~/components/layout/UserProfileSheet";

import { ModeToggle } from "~/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import NotificationsComponent from "~/components/layout/NotificationsComponent";
import DriverDrivingComponent from "./DriverDrivingComponent";

/**
 * Right-hand cluster of an admin/driver top bar:
 * theme toggle, notifications, profile menu + profile sheet.
 * Shared between the admin top bar and the driver Navbar.
 */
export default function TopBarControls() {
  const { user, logout } = useAuth();
  const { confirm } = useDialog();
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const handleLogout = () => {
    confirm({
      title: "ยืนยันการออกจากระบบ",
      description: "คุณต้องการออกจากระบบผู้ดูแลระบบใช่หรือไม่?",
      confirmText: "ออกจากระบบ",
      cancelText: "ยกเลิก",
      onConfirm: () => {
        logout();
      },
      variant: "destructive",
    });
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "A";

  return (
    <>
      <div className="flex flex-1 items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
        <ModeToggle />
        <DriverDrivingComponent />
        <NotificationsComponent />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border">
                {user?.profileImageUrl && (
                  <AvatarImage
                    src={user.profileImageUrl}
                    alt={user?.email || "User"}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-primary font-mono text-xs">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.email || "ผู้ดูแลระบบ"}
                </p>
                <p className="text-xs leading-none text-muted-foreground uppercase">
                  Role: {user?.role || "Admin"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setIsProfileSheetOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4 " />
              <span>ออกจากระบบ</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UserProfileSheet
        open={isProfileSheetOpen}
        onOpenChange={setIsProfileSheetOpen}
      />
    </>
  );
}
