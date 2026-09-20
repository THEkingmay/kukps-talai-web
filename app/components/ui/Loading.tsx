import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm font-medium text-muted-foreground">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
