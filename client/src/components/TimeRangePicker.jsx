import { useState } from "react";

const TimeSlotPicker = ({ onTimeSelect }) => {
  const [time, setTime] = useState({
    startTime: "",
    endTime: "",
  });

  const handleTimeChange = (field, value) => {
    const updatedTime = { ...time, [field]: value };
    setTime(updatedTime);

    if (updatedTime.startTime && updatedTime.endTime) {
      onTimeSelect(updatedTime);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white max-w-sm">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium">Start Time</label>
          <input
            type="time"
            value={time.startTime}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium">End Time</label>
          <input
            type="time"
            value={time.endTime}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
