type CourseStatus = "In Progress" | "Upcoming" | "Completed";

export function getCourseStatus(startDateStr: string, endDateStr: string): CourseStatus {
  const now = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (now < startDate) {
    return "Upcoming";
  } else if (now >= startDate && now <= endDate) {
    return "In Progress";
  } else {
    return "Completed";
  }
}

export function getStatusBadgeColor(status: CourseStatus) {
  switch (status) {
    case "Upcoming": return "bg-yellow-500";
    case "In Progress": return "bg-blue-500";
    case "Completed": return "bg-green-500";
  }
}