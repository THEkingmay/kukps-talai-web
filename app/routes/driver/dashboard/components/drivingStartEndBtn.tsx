import type { DrivingLog, CarDriverShift } from "~/types";

import {
  getCurrentDriving,
  startDriving,
  endDriving,
} from "~/actions/driving-log.action";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function DrivingStartEndBtn({
  currentShift,
}: {
  currentShift: CarDriverShift | undefined;
}) {
  if (!currentShift) return null;

  const [currentDriving, setCurrentDriving] = useState<DrivingLog | null>(null);

  const handleStart = async () => {
    console.log("handleStart", currentShift.id);
    if (!currentShift.id) return;
    const res = await startDriving(currentShift.id);
    if (res.success) {
      setCurrentDriving(res.data.data);
    }
  };

  const handleEnd = async () => {
    if (!currentDriving) return;
    console.log("handleEnd", currentDriving.id);
    const res = await endDriving(currentDriving.id);
    if (res.success) {
      setCurrentDriving(null);
    }
  };

  useEffect(() => {
    const fetchCurrentDriving = async () => {
      const res = await getCurrentDriving();
      if (res.success) {
        setCurrentDriving(res.data.data);
      }
    };

    fetchCurrentDriving();
  }, []);

  return (
    <div>
      งานที่กำลังทำอยู่ {currentShift.id}
      {currentDriving && (
        <div>
          งานที่กำลังวิ่งอยู่{currentDriving.id} , {currentDriving.status}
        </div>
      )}
      {currentDriving && <Button onClick={handleEnd}>End Driving</Button>}
      {!currentDriving && <Button onClick={handleStart}>Start Driving</Button>}
    </div>
  );
}
