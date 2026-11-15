import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker images are resolved at runtime; import them so Vite
// bundles the URLs instead of guessing a public path.
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export type SequenceIconKind = "pending" | "stop" | "pass";

const ICON_BASE = {
  className: "custom-leaflet-icon",
  iconSize: [0, 0] as [number, number],
  iconAnchor: [0, 0] as [number, number],
};

/**
 * Marker that renders a sequence label (e.g. "1" or "1,4,7" when several points
 * share the same coordinate).
 */
export function createSequenceIcon(
  seqText: string | number,
  isPending: boolean = false,
  isStop: boolean = false,
) {
  const text = String(seqText);

  if (isPending) {
    return L.divIcon({
      ...ICON_BASE,
      html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[32px] h-8 px-1.5 rounded-full border-2 shadow-sm font-mono text-[11px] font-bold leading-none transition-all bg-amber-100 border-amber-500 text-amber-800 whitespace-nowrap">${text}</div>`,
    });
  }

  if (isStop) {
    return L.divIcon({
      ...ICON_BASE,
      html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[32px] h-8 px-1.5 rounded-full border-2  shadow-sm font-mono text-[11px] font-bold leading-none transition-all bg-primary text-primary-foreground  whitespace-nowrap">${text}</div>`,
    });
  }

  return L.divIcon({
    ...ICON_BASE,
    html: `<div style="transform: translate(-50%, -50%);" class="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full border-[1.5px] border-muted-foreground/30 bg-background shadow-sm font-mono text-[9px] font-bold leading-none transition-all text-muted-foreground whitespace-nowrap">${text}</div>`,
  });
}

/** Roughly KU Kamphaeng Saen — where the map opens before any point exists. */
export const DEFAULT_MAP_CENTER: L.LatLngTuple = [14.025, 99.975];
