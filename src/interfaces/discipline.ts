import { Category } from "./category";

export interface Discipline {
  _id?: string;
  createdAt?: Date;
  isActive: boolean;
  name: string;
  updatedAt?: Date;
  category: string | Category;
}

export function isDiscipline(d: any): d is Discipline {
  return (
    d != null &&
    typeof d === "object" &&
    !Array.isArray(d) &&
    "name" in d &&
    "isActive" in d
  );
}

export function getCategoryId(c: any): string | null {
  if (typeof c === "string") return c;

  if (isDiscipline(c) && c._id != null) return c._id;

  return null;
}
