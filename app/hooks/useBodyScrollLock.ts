import { useEffect } from "react";

/**
 * Locks `document.body` scrolling while `locked` is true.
 *
 * Restores the previous inline value on unlock/unmount so nested overlays
 * (modals inside sheets) cannot leave the page permanently unscrollable.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
