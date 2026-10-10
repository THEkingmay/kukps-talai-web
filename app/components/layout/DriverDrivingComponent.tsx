import { useAuth } from "../providers/AuthProvider";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { User } from "lucide-react";

export default function DriverDrivingComponent() {
  const { user } = useAuth();

  if (!user || !["superadmin", "admin"].includes(user.role)) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="size-4" />
          <span className="sr-only">คนขับที่กำลังขับอยู่</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[400px] max-w-[calc(100vw-2rem)] rounded-xl p-0"
      >
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium leading-none">
            คนขับที่กำลังขับอยู่
          </h2>
        </div>
      </PopoverContent>
    </Popover>
  );
}
