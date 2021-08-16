import { Project } from "./project";

export interface Register
{
  date: Date;
  text: string;
  typeFeedback: "system" | "user";
}

export interface Feedback
{
  _id?: string;
  project: string | Project;
  registers: Register[];
}
