import { Category } from "./category";
import { Role } from "./user";

export interface Schedule
{
  day: number;
  location: string;
  period: string;
};

export interface Timetable
{
  category: string | Category;
  schedules: Schedule[];
}

export interface Notice
{
  _id?: string;
  canAccess: (string | Role)[];
  effectiveDate: Date;
  expirationDate: Date;
  isActive: boolean;
  name: string;
  number: number;
  reportDeadline: Date;
  timetables: Timetable[];
  type: "common" | "specific";
};

export function isNotice(n: any): n is Notice
{
  return n != null && typeof n === "object" && !Array.isArray(n)
    && "canAccess" in n
    && "effectiveDate" in n
    && "expirationDate" in n
    && "isActive" in n
    && "name" in n
    && "number" in n
    && "reportDeadline" in n
    && "timetables" in n
    && "type" in n;
}

export function getNoticeId(n: any): string | null
{
  if (typeof n === "string")
    return n;

  if (isNotice(n) && n._id != null)
    return n._id;

  return null;
}
