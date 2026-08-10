import { useEffect, useState } from "react";
import { X, Eye, EyeOff, Copy, Check, KeyRound, Loader2 } from "lucide-react";
import apiClient from "~/configs/axios";

interface CredentialModalProps {
  isOpen: boolean;
  carId: string;
  onClose: () => void;
}

interface CarCredentials {
  carMqttUsername: string;
  encryptedMqttPassword: string;
}

export default function CredentialModal({
  isOpen,
  carId,
  onClose,
}: CredentialModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<CarCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !carId) return;

    setIsLoading(true);
    setError(null);
    setCredentials(null);
    setShowPassword(false);
    setCopiedField(null);

    apiClient
      .get(`/cars/mqtt-credentials/${carId}`)
      .then((res) => setCredentials(res.data.data))
      .catch(() => setError("ไม่สามารถโหลดข้อมูล Credentials ได้"))
      .finally(() => setIsLoading(false));
  }, [isOpen, carId]);

  if (!isOpen) return null;

  const username = credentials?.carMqttUsername ?? "";
  const password = credentials?.encryptedMqttPassword ?? "";

  function handleCopy(value: string, field: string) {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-xs bg-slate-900/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                MQTT Credentials
              </h3>
              <p className="text-[10px] font-mono text-slate-400 tracking-wider">
                {carId.length > 8 ? `${carId.slice(0, 8)}…` : carId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิด"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {isLoading ? (
            <div className="py-8 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                กำลังโหลด…
              </span>
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-xs text-rose-600 font-medium">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  apiClient
                    .get(`/cars/credentials/${carId}`)
                    .then((res) => setCredentials(res.data.data))
                    .catch(() =>
                      setError("ไม่สามารถโหลดข้อมูล Credentials ได้"),
                    )
                    .finally(() => setIsLoading(false));
                }}
                className="mt-2 text-[11px] font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-2 cursor-pointer"
              >
                ลองอีกครั้ง
              </button>
            </div>
          ) : (
            <>
              <CredentialField
                label="Username"
                value={username}
                isCopied={copiedField === "username"}
                onCopy={() => handleCopy(username, "username")}
              />

              <CredentialField
                label="Password"
                value={showPassword ? password : "••••••••••••"}
                isCopied={copiedField === "password"}
                onCopy={() => handleCopy(password, "password")}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                }
              />
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 active:bg-slate-200 transition-all shadow-2xs cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

function CredentialField({
  label,
  value,
  isCopied,
  onCopy,
  trailing,
}: {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
          {label}
        </span>
        <span className="text-sm font-mono font-semibold text-slate-800 block truncate select-all">
          {value || "—"}
        </span>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {trailing}
        <button
          type="button"
          onClick={onCopy}
          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
          aria-label={`คัดลอก ${label}`}
        >
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
