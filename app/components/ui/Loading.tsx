import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans antialiased">
      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
    </div>
  );
}
