import { useState } from "react";

// NOT USED 

const TimeSlotPicker = ({
  title = "Time Slot Picker",
  bookedSlots = [],
  onSelect,
}) => {
  const timeSlots = [
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1"],
    ["A2", "B2", "C2", "D2", "E2", "F2", "G2"],
  ];

  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSlotClick = (slot) => {
    if (!bookedSlots.includes(slot)) {
      setSelectedSlot(slot);
      onSelect(slot);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">{title}</h2>
      <div className="grid grid-cols-7 gap-2">
        {timeSlots.flat().map((slot) => (
          <button
            key={slot}
            onClick={() => handleSlotClick(slot)}
            className={`p-2 border rounded-md text-center cursor-pointer text-sm font-medium transition-all duration-300 ease-in-out
              ${
                bookedSlots.includes(slot)
                  ? "bg-red-500 text-white cursor-not-allowed opacity-70"
                  : selectedSlot === slot
                  ? "bg-green-500 text-white scale-105"
                  : "bg-gray-100 hover:bg-blue-400 hover:text-white"
              }`}
            disabled={bookedSlots.includes(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
