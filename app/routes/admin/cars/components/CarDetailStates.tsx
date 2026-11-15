import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { VercelSpinner } from "~/components/ui/Loading";
import { SearchX } from "lucide-react";

/** Loading placeholder shown before the car payload arrives. */
export function CarDetailLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <VercelSpinner />
      <p className="text-sm font-medium text-muted-foreground">
        กำลังโหลดข้อมูลรถตะไล...
      </p>
    </div>
  );
}

/** Not-found / load-error state for the car detail page. */
export function CarDetailError({ loadError }: { loadError: string | null }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">
        ไม่พบข้อมูลรถตะไล
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {loadError ??
          "รถตะไลที่เลือกไม่พบในระบบ (อาจถูกลบหรือใช้ URL ไม่ถูกต้อง)"}
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link to="/admin/cars">กลับหน้ารายการรถตะไล</Link>
      </Button>
    </div>
  );
}
