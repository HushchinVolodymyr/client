import { DayOfWeekEnum } from "@/types/enums/day-of-week-enum";

export const dayOfWheekNames: Record<number, string> = {
  [DayOfWeekEnum.Sunday]: "Sunday",
  [DayOfWeekEnum.Monday]: "Monday",
  [DayOfWeekEnum.Tuesday]: "Tuesday",
  [DayOfWeekEnum.Wednesday]: "Wednesday",
  [DayOfWeekEnum.Thursday]: "Thursday",
  [DayOfWeekEnum.Friday]: "Friday",
  [DayOfWeekEnum.Saturday]: "Saturday",
};

// Функция для получения названия категории по числу
export function getDayOfWeek(dayOfWeekNumber: number): string {
  return dayOfWheekNames[dayOfWeekNumber] ?? "Unknown";
}