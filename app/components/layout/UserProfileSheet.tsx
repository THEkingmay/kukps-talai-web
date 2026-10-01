import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/components/providers/AuthProvider";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/helper";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Camera, Loader2 } from "lucide-react";

interface UserProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileSheet({
  open,
  onOpenChange,
}: UserProfileSheetProps) {
  const { user, updateProfile } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U";
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "ไม่ระบุชื่อ";

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEditClick = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhoneNumber(user.phoneNumber || "");
    setIsEditing(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await updateProfile(firstName, lastName, selectedFile, phoneNumber);
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>โปรไฟล์ผู้ใช้งาน</SheetTitle>
          <SheetDescription>
            ข้อมูลบัญชีผู้ใช้และสิทธิ์การใช้งานของคุณ
          </SheetDescription>
        </SheetHeader>

        {isEditing ? (
          <div className="flex-1 overflow-y-auto p-6 pt-12 flex flex-col gap-8 animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 border shadow-sm transition-opacity group-hover:opacity-80">
                  {(previewUrl || user.profileImageUrl) && (
                    <AvatarImage
                      src={previewUrl || user.profileImageUrl || undefined}
                      alt={fullName}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-muted text-foreground font-mono text-3xl">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                คลิกเพื่อเปลี่ยนรูปโปรไฟล์
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="กรอกชื่อของคุณ"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="กรอกนามสกุลของคุณ"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber">เบอร์โทร</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="กรอกเบอร์โทรของคุณ"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        ) : (
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
                  <h3 className="text-xl font-semibold tracking-tight">
                    {fullName}
                  </h3>
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
                <p className="text-sm text-muted-foreground mt-1">
                  {user.email}
                </p>
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
        )}

        {/* Sticky Footer */}
        <div className="p-6 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {isEditing ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetForm}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                บันทึกข้อมูล
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              className="w-full shadow-sm"
              onClick={handleEditClick}
            >
              แก้ไขโปรไฟล์
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
