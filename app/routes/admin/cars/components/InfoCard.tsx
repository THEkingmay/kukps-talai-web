import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useCopyToClipboard } from "~/hooks/useCopyToClipboard";
import { Check, Copy } from "lucide-react";

type InfoCardBadgeVariant = React.ComponentProps<typeof Badge>["variant"];

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  mono?: boolean;
  copyable?: boolean;
  badge?: InfoCardBadgeVariant;
  badgeIcon?: ReactNode;
}

/** Single key/value tile used by the car overview grid. */
export default function InfoCard({
  icon,
  label,
  value,
  mono,
  copyable,
  badge,
  badgeIcon,
}: InfoCardProps) {
  const { copied, copy } = useCopyToClipboard();
  const textValue = typeof value === "string" ? value : null;

  const handleCopy = () => {
    if (!textValue) return;
    void copy(textValue);
  };

  return (
    <Card className="border-border/50">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-center gap-1.5">
            {badge ? (
              <Badge variant={badge} className="gap-1">
                {badgeIcon}
                {value}
              </Badge>
            ) : (
              <p
                className={`truncate text-sm font-medium text-foreground ${
                  mono ? "font-mono text-xs" : ""
                }`}
              >
                {value}
              </p>
            )}
            {copyable && textValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
                aria-label={`คัดลอก${label}`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
