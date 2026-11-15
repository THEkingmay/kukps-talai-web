import { Bus } from "lucide-react";

interface AuthBrandingPanelProps {
  year: number;
}

/** Left marketing pane of the auth page (hidden on small screens). */
export default function AuthBrandingPanel({ year }: AuthBrandingPanelProps) {
  return (
    <div className="hidden bg-zinc-950 lg:flex flex-col justify-between p-10 text-white w-1/2 lg:max-w-xl xl:max-w-2xl relative overflow-hidden">
      {/* Background Graphic / Vercel-like lines */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="z-10 flex items-center gap-2 font-medium">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-zinc-950">
          <Bus className="h-5 w-5" />
        </div>
        <span className="text-xl font-semibold">TalaiETA</span>
      </div>

      <div className="z-10 flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
          Kasetsart University
          <br />
          KamphaengSaen Campus
          <br />
          Talai ETA
        </h1>{" "}
      </div>

      <div className="z-10 text-sm text-zinc-500">
        © {year} KUKPS. All rights reserved.
      </div>
    </div>
  );
}
