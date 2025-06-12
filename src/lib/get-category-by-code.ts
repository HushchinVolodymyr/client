import { CourseCategoryEnum } from "@/types/enums/course-category-enum";

export const courseCategoryNames: Record<number, string> = {
  [CourseCategoryEnum.ComputerScience]: "Computer Science",
  [CourseCategoryEnum.Mathematics]: "Mathematics",
  [CourseCategoryEnum.Physics]: "Physics",
  [CourseCategoryEnum.Chemistry]: "Chemistry",
  [CourseCategoryEnum.PE]: "PE",
  [CourseCategoryEnum.Languages]: "Languages",
};

export function getCategoryName(categoryNumber: number): string {
  return courseCategoryNames[categoryNumber] ?? "Unknown";
}