import { useCallback, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useAuth } from "~/components/providers/AuthProvider";

/**
 * State + behaviour for the user profile sheet.
 *
 * `open` mirrors the sheet props (closing is handled through
 * `handleOpenChange`); everything the JSX needs is returned in one flat object.
 */
export function useUserProfileForm(
  _open: boolean,
  onOpenChange: (open: boolean) => void,
) {
  const { user, updateProfile } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "ไม่ระบุชื่อ"
    : "ไม่ระบุชื่อ";

  const resetForm = useCallback(() => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm],
  );

  const handleEditClick = useCallback(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhoneNumber(user?.phoneNumber || "");
    setIsEditing(true);
  }, [user]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    await updateProfile(firstName, lastName, selectedFile, phoneNumber);
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsLoading(false);
  }, [firstName, lastName, phoneNumber, selectedFile, updateProfile]);

  return {
    // context
    user,
    // derived
    userInitial,
    fullName,
    // form state
    isEditing,
    firstName,
    lastName,
    phoneNumber,
    selectedFile,
    previewUrl,
    isLoading,
    fileInputRef,
    // actions
    setFirstName,
    setLastName,
    setPhoneNumber,
    resetForm,
    handleOpenChange,
    handleEditClick,
    handleFileChange,
    handleSave,
  };
}
