export function getAllCampiEndpoint(): string
{
  return "/campi";
}

export function getAllCoursesEndpoint(): string
{
  return "/courses";
}

export function createCourseEndpoint(): string
{
  return "/course";
}

export function updateCourseEndpoint(id: string): string
{
  return `/course/${id}`;
}

export function deleteCourseEndpoint(id: string): string
{
  return `/course/${id}`;
}

export function toggleCourseEndpoint(id: string): string
{
  return `/course/${id}/isActive`;
}