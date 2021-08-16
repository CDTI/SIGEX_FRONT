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

export function isNotice(n : any): n is Notice
{
  return n && (n as Notice)._id !== undefined;
}
