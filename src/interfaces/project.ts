import moment from "moment";

import { Category } from "./category";
import { Notice, Schedule } from "./notice";
import { Program } from "./program";
import { User } from "./user";

export interface Contact
{
  name: string;
  phone: string;
}

export interface Partnership
{
  contacts: Contact[];
  text: string;
}

export interface Community
{
  location: string;
  peopleInvolved: number;
  text: string;
}

export interface Planning
{
  developmentMode: string;
  developmentSite: string;
  finalDate: string;
  startDate: string;
  text: string;
}

export interface Material
{
  description: string;
  item: string;
  quantity: number;
  totalPrice: number;
  unitaryValue: number;
  unity: string;
}

export interface Transport
{
  description: string;
  quantity: number;
  totalPrice: number;
  typeTransport: string;
  unitaryValue: number;
  unity: string;
}

export interface Resource
{
  materials: Material[];
  transport?: Transport;
}

export interface Discipline
{
  name: string;
}

export interface Teacher
{
  cpf: string;
  email: string;
  name: string;
  phone: string;
  registration: string;
  totalCH?: number;
}

export interface Report
{
  _id?: string;
  affectedPeople: number;
  communityContacts: Contact[];
  communityPeople: number;
  createdAt: Date;
  discussion: string;
  introduction: string;
  isLate: boolean;
  methodology: string;
  projectTitle: string;
  results: string;
  students: number;
  teams: number;
}

export interface Project
{
  _id?: string;
  author: string | User;
  category: string | Category;
  dateFinal: Date;
  dateStart: Date;
  description: string;
  disciplines: Discipline[];
  firstSemester: Schedule[];
  key?: string;
  maxClasses?: number;
  name: string;
  notice: string | Notice;
  partnership: Partnership[];
  planning: Planning[];
  program: string | Program;
  report?: Report;
  resources?: Resource;
  secondSemester: Schedule[];
  specificCommunity: Community;
  status: "pending" | "reproved" | "notSelected" | "selected" | "finished";
  teachers : Teacher[];
  totalCH?: number;
  typeProject: "common" | "extraCurricular" | "curricularComponent";
}

export function isProject(p: any): p is Project
{
  return p && (p as Project)._id !== undefined;
}

export function isReport(r: any): r is Report
{
  return r && (r as Report)._id !== undefined;
}