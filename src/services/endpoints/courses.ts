export function getAllCoursesEndpoint(): string {
  return "/courses";
}

export function getAllCoursesPaginatedEndpoint(): string {
  return "/courses/paginated";
}

export function createCourseEndpoint(): string {
  return "/course";
}

export function updateCourseEndpoint(id: string): string {
  return `/course/${id}`;
}

export function deleteCourseEndpoint(id: string): string {
  return `/course/${id}`;
}

export function toggleCourseEndpoint(id: string): string {
  return `/course/${id}/isActive`;
}
