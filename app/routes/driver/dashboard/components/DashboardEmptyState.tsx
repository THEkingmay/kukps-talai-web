import type { ReactNode } from "react";

interface DashboardEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/** Centered icon + copy shown when a dashboard tab has no data. */
export default function DashboardEmptyState({
  icon,
  title,
  description,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
