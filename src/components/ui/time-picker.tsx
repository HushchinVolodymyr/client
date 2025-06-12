import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, minute] = value.split(":");
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (newHour: string) => {
    onChange(`${newHour}:${minute || "00"}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    onChange(`${hour || "00"}:${newMinute}`);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Select value={hour || "00"} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[85px]">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={pad(h)}>
              {pad(h)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={minute || "00"} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[85px]">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={pad(m)}>
              {pad(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
