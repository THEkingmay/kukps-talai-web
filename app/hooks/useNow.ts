import { useEffect, useState } from "react";

/**
 * Returns the current timestamp (ms since epoch), refreshed on an interval.
 *
 * Use it for "live" counters such as elapsed driving time so the value does not
 * freeze while the component stays mounted.
 *
 * @param intervalMs refresh rate (default 30s — matches the driving log ticker)
 * @param enabled pause the ticker when no live value is on screen
 */
export function useNow(intervalMs = 30_000, enabled = true) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;

    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, enabled]);

  return now;
}
