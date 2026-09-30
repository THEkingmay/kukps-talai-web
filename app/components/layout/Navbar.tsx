import { useState } from "react";
import { Link } from "react-router";
import { Bus, LogOut, Settings, User } from "lucide-react";
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

export default function Navbar() {
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center">
        {/* Logo Section */}
        <div className="flex h-full items-center px-4 md:w-56 md:shrink-0 md:border-r border-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold tracking-tight">TalaiETA</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
          <ModeToggle />

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
      </div>

      <UserProfileSheet
        open={isProfileSheetOpen}
        onOpenChange={setIsProfileSheetOpen}
      />
    </header>
  );
}
