export interface Campus {
  _id?: string;
  name: string;
  isActive: boolean;
}

export interface Course {
  _id?: string;
  key?: string;
  name: string;
  campus: Campus;
  isActive: boolean;
}

export function isCampus(c: any): c is Campus {
  return c != null && typeof c === "object" && !Array.isArray(c) && "name" in c;
}

export function isCourse(c: any): c is Course {
  return (
    c != null &&
    typeof c === "object" &&
    !Array.isArray(c) &&
    "name" in c &&
    "campus" in c &&
    "isActive" in c
  );
}

export function getCourseId(c: any): string | null {
  if (typeof c === "string") return c;

  if (isCourse(c) && c._id != null) return c._id;

  return null;
}
