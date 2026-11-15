import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { useUserProfileForm } from "~/hooks/useUserProfileForm";
import UserProfileEditPanel from "./user-profile/UserProfileEditPanel";
import UserProfileViewPanel from "./user-profile/UserProfileViewPanel";

interface UserProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileSheet({
  open,
  onOpenChange,
}: UserProfileSheetProps) {
  const form = useUserProfileForm(open, onOpenChange);
  const { user } = form;

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={form.handleOpenChange}>
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

        {form.isEditing ? (
          <UserProfileEditPanel
            user={user}
            userInitial={form.userInitial}
            fullName={form.fullName}
            firstName={form.firstName}
            lastName={form.lastName}
            phoneNumber={form.phoneNumber}
            previewUrl={form.previewUrl}
            isLoading={form.isLoading}
            fileInputRef={form.fileInputRef}
            onChangeFirstName={form.setFirstName}
            onChangeLastName={form.setLastName}
            onChangePhoneNumber={form.setPhoneNumber}
            onFileChange={form.handleFileChange}
          />
        ) : (
          <UserProfileViewPanel
            user={user}
            userInitial={form.userInitial}
            fullName={form.fullName}
          />
        )}

        {/* Sticky Footer */}
        <div className="p-6 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {form.isEditing ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={form.resetForm}
                disabled={form.isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={form.handleSave}
                disabled={form.isLoading}
              >
                {form.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                บันทึกข้อมูล
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              className="w-full shadow-sm"
              onClick={form.handleEditClick}
            >
              แก้ไขโปรไฟล์
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
