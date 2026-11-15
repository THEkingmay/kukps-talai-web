import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Check, Copy } from "lucide-react";

interface CredentialFieldProps {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
  trailing?: ReactNode;
}

/** Read-only credential row with a copy button. */
export default function CredentialField({
  label,
  value,
  isCopied,
  onCopy,
  trailing,
}: CredentialFieldProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="min-w-0 flex-1">
        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="block select-all truncate font-mono text-sm font-semibold">
          {value || "—"}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {trailing}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCopy}
          aria-label={`คัดลอก ${label}`}
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
