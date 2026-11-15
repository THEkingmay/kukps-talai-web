import { Link } from "react-router";
import type { ResponseCarData } from "~/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CarStatusBadge } from "~/routes/admin/dashboard/components/cars/CarTable";
import { formatDate } from "~/helper";

interface RouteCarsCardProps {
  carsInRoute: ResponseCarData[];
}

/** Cars currently assigned to this route, with an empty state. */
export default function RouteCarsCard({ carsInRoute }: RouteCarsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รถในสายนี้</CardTitle>
      </CardHeader>
      <CardContent>
        {carsInRoute.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-10 text-center text-muted-foreground">
            <p className="text-sm font-medium">ยังไม่มีรถในสายนี้</p>
            <p className="text-xs opacity-70">
              เพิ่มรถแล้วเลือก assign เข้าสายนี้จากหน้ารถตะไล
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หมายเลขรถ / ID</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>อัปเดตล่าสุด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carsInRoute.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <Link
                      to={`/admin/cars/${car.id}`}
                      className="font-bold text-foreground hover:underline"
                    >
                      {car.carNumber}
                    </Link>
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                      ID: {car.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CarStatusBadge
                      status={car.status}
                      isDeleted={car.deletedAt !== null}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(car.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
