import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies text to the clipboard and flags it for `resetMs` so the caller can
 * swap the copy icon for a check mark.
 *
 * Fails silently when the clipboard API is unavailable (permissions or a
 * non-secure context), matching the previous behaviour in the car detail page.
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
