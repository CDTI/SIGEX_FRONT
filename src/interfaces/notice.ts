import { Moment } from "moment";

import { ICategory } from "./category";
import { IRole } from "./role";

export interface ISchedule
{
  location: string;
  period: string;
  day: number;
};

export interface ITimetable
{
  category: string | ICategory;
  schedules: ISchedule[];
}

export interface INotice
{
  _id?: string;
  number: number;
  name: string;
  type: "common" | "specific";
  canAccess: (string | IRole)[];
  timetables: ITimetable[];
  isActive: boolean;
  effectiveDate: Date;
  expirationDate: Date;
  reportDeadline: Date;
  createdAt?: Date;
  updateAt?: Date;
};

export function isNotice(n : string | INotice): n is INotice
{
  return (n as INotice)._id !== undefined;
}