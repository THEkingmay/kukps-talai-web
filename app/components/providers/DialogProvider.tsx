import React, { createContext, useContext, useState, type ReactNode } from "react";

interface DialogOptions {
  title: string;
  description?: string;
  confirmText?: string;
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

  const alert = (opts: DialogOptions) => {
    setType("alert");
    setOptions(opts);
    setIsOpen(true);
  };

  const confirm = (opts: ConfirmOptions) => {
    setType("confirm");
    setOptions(opts);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setOptions(null);
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
      {isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-sm text-center p-6">
            <h2 className="text-lg font-bold text-black mb-2">{options.title}</h2>
            {options.description && (
              <p className="text-sm text-gray-600 mb-6">{options.description}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              {type === "confirm" && (
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-black bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  {(options as ConfirmOptions).cancelText || "ยกเลิก"}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black border border-black hover:bg-gray-900 transition-colors focus:outline-none"
              >
                {options.confirmText || "ตกลง"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}
