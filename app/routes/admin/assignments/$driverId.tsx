import { useEffect, useState } from "react";
import { useParams } from "react-router";

import type { CarDriverShift, DrivingLog } from "~/types";

import { getByDriverId } from "~/actions/assignment-driver.action";
import { getAll } from "~/actions/driving-log.action";

export default function DriverAssignmentsPage() {
  const { driverId } = useParams<{ driverId: string }>();
  const [allShift, setAllShift] = useState<CarDriverShift[]>([]);
  const [allLogs, setLogs] = useState<DrivingLog[]>([]);
  useEffect(() => {
    const res = await getByDriverId(driverId);
    await getAll(driverId);
  }, [driverId]);
  return <div>Driver Assignments Logs Monitor</div>;
}
