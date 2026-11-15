import type { ChangeEvent, RefObject } from "react";
import { Camera } from "lucide-react";

import type { User } from "~/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface UserProfileEditPanelProps {
  user: User;
  userInitial: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  previewUrl: string | null;
  isLoading: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/** Editable profile fields (avatar picker + name / phone inputs). */
export default function UserProfileEditPanel({
  user,
  userInitial,
  fullName,
  firstName,
  lastName,
  phoneNumber,
  previewUrl,
  isLoading,
  fileInputRef,
  onChangeFirstName,
  onChangeLastName,
  onChangePhoneNumber,
  onFileChange,
}: UserProfileEditPanelProps) {
  return (
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
            onChange={onFileChange}
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
            onChange={(e) => onChangeFirstName(e.target.value)}
            placeholder="กรอกชื่อของคุณ"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">นามสกุล</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onChangeLastName(e.target.value)}
            placeholder="กรอกนามสกุลของคุณ"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phoneNumber">เบอร์โทร</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => onChangePhoneNumber(e.target.value)}
            placeholder="กรอกเบอร์โทรของคุณ"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
