import { Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";
import { TableRow, TableCell } from "./table";
import { cn } from "cn";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background p-8 space-y-4">
      <VercelSpinner />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">กำลังโหลดข้อมูล...</p>
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <VercelSpinner />
    </div>
  );
}

export function VercelSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center">
        <svg
          fill="none"
          className="h-full w-full animate-spin text-muted-foreground/20"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" />
        </svg>
        <svg
          fill="none"
          className="absolute h-full w-full animate-spin text-foreground"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          style={{ animationDuration: "1.5s", strokeDasharray: "60 100", strokeLinecap: "round" }}
        >
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}

export type ColumnType = "text" | "avatar-text" | "icon-text" | "badge" | "actions" | "date";

export function TableRowSkeleton({
  columns,
}: {
  columns: { type: ColumnType; className?: string }[];
}) {
  return (
    <TableRow>
      {columns.map((col, i) => (
        <TableCell key={i} className={col.className}>
          {col.type === "text" && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          )}
          {col.type === "avatar-text" && (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          )}
          {col.type === "icon-text" && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-3 w-[60px]" />
              </div>
            </div>
          )}
          {col.type === "badge" && <Skeleton className="h-5 w-[80px] rounded-full" />}
          {col.type === "date" && <Skeleton className="h-4 w-[100px]" />}
          {col.type === "actions" && (
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function TableSkeleton({
  rowCount = 5,
  columns,
}: {
  rowCount?: number;
  columns: { type: ColumnType; className?: string }[];
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </>
  );
}

export function MetricsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-6 py-2 px-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}
