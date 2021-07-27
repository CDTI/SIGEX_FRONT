import { ICommunity } from "./community";

export function isReport(r : string | IReport): r is IReport
{
  return r !== undefined && (r as IReport)._id !== undefined;
}

export interface IReport
{
  _id: string;
  projectTitle: string;
  introduction: string;
  methodology: string;
  results: string;
  students: number;
  teams: number;
  communityPeople: number;
  affectedPeople: number;
  discussion: string;
  community: ICommunity;
}