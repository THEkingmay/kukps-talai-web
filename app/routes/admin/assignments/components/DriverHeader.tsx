import { Link } from "react-router";
import { Phone } from "lucide-react";

import type { User } from "~/types";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";

interface DriverHeaderProps {
  driver: User;
  name: string;
  initials: string;
}

export default function DriverHeader({
  driver,
  name,
  initials,
}: DriverHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Avatar size="lg">
        <AvatarImage src={driver.profileImageUrl ?? undefined} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
          {name}
        </h1>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="truncate">{driver.email}</span>
          {driver.phoneNumber && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {driver.phoneNumber}
            </span>
          )}
        </div>
      </div>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="h-8 self-start sm:self-auto"
      >
        <Link to="/admin/assignments">← กลับรายการมอบหมายงาน</Link>
      </Button>
    </div>
  );
}
