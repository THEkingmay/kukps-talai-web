import { useEffect, type RefObject } from "react";

/**
 * Locks scrolling for every scrollable ancestor of `containerRef` (plus `body`)
 * while the component is mounted.
 *
 * Needed by full-page overlays: the admin shell scrolls an inner `overflow-auto`
 * wrapper rather than `body`, so locking `body` alone leaves the page scrollable
 * behind the backdrop.
 */
export function useLockScrollableAncestors(
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const scrollables: HTMLElement[] = [];
    let node = containerRef.current?.parentElement ?? null;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      if (
        /(auto|scroll|overlay)/.test(
          `${style.overflow}${style.overflowX}${style.overflowY}`,
        )
      ) {
        scrollables.push(node);
      }
      node = node.parentElement;
    }

    const previous = scrollables.map((el) => el.style.overflow);
    scrollables.forEach((el) => {
      el.style.overflow = "hidden";
    });
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      scrollables.forEach((el, i) => {
        el.style.overflow = previous[i];
      });
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [containerRef]);
}
