import React, { createContext, useContext, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface DialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmOptions extends DialogOptions {
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  alert: (options: DialogOptions) => void;
  confirm: (options: ConfirmOptions) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"alert" | "confirm">("alert");
  const [options, setOptions] = useState<ConfirmOptions | DialogOptions | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const alert = (opts: DialogOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setType("alert");
    setOptions(opts);
    setIsOpen(true);
  };

  const confirm = (opts: ConfirmOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setType("confirm");
    setOptions(opts);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOptions(null), 300); // clear after animation
  };

  const handleConfirm = () => {
    if (type === "confirm" && options && "onConfirm" in options) {
      (options as ConfirmOptions).onConfirm();
    }
    handleClose();
  };

  const handleCancel = () => {
    if (type === "confirm" && options && "onCancel" in options && options.onCancel) {
      options.onCancel();
    }
    handleClose();
  };

  return (
    <DialogContext.Provider value={{ alert, confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{options?.title}</DialogTitle>
            {options?.description && (
              <DialogDescription>
                {options.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="mt-4">
            {type === "confirm" && (
              <Button variant="outline" onClick={handleCancel}>
                {(options as ConfirmOptions)?.cancelText || "ยกเลิก"}
              </Button>
            )}
            <Button
              variant={options?.variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              {options?.confirmText || "ตกลง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
}
