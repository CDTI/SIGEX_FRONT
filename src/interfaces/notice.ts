import { Category } from "./category";
import { Discipline } from "./discipline";
import { Role } from "./user";

export interface Schedule {
  _id?: string;
  day: number;
  location: string;
  period: string;
}

export interface Timetable {
  category?: string | Category;
  discipline: string;
  schedules: Schedule[];
}

export interface Notice {
  _id?: string;
  canAccess: (string | Role)[];
  createdAt?: Date;
  effectiveDate: Date;
  expirationDate: Date;
  isActive: boolean;
  key?: string;
  name: string;
  number: number;
  reportDeadline: Date;
  category: string | Category;
  timetables: Timetable[];
  type: "common" | "specific";
  updatedAt?: Date;
  projectExecutionPeriod: string;
  projectExecutionYear: Date;
}

export function isNotice(n: any): n is Notice {
  return (
    n != null &&
    typeof n === "object" &&
    !Array.isArray(n) &&
    "canAccess" in n &&
    "effectiveDate" in n &&
    "expirationDate" in n &&
    "isActive" in n &&
    "name" in n &&
    "number" in n &&
    "reportDeadline" in n &&
    "timetables" in n &&
    "type" in n
  );
}

export function getNoticeId(n: any): string | null {
  if (typeof n === "string") return n;

  if (isNotice(n) && n._id != null) return n._id;

  return null;
}
