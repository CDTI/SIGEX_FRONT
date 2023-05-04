import { Category } from "./category";
import { Course } from "./course";
import { Discipline } from "./discipline";
import { Notice, Schedule } from "./notice";
import { Program } from "./program";
import { User } from "./user";

export type ProjectStatus =
  | "pending"
  | "reproved"
  | "notSelected"
  | "selected"
  | "finished";

export interface Contact {
  name: string;
  phone?: string;
}

export interface Partnership {
  contacts: Contact[];
  text: string;
}

export interface Community {
  location: string;
  peopleInvolved: number;
  text: string;
}

export interface Planning {
  developmentMode: string;
  developmentSite: string;
  finalDate: string;
  startDate: string;
  text: string;
}

export interface Material {
  description: string;
  item: string;
  quantity: number;
  unitaryValue: number;
}

export interface Transport {
  description: string;
  quantity: number;
  typeTransport: string;
  unitaryValue: number;
}

export interface Resources {
  materials: Material[];
  transport: Transport[];
}

export interface Teacher {
  cpf: string;
  email: string;
  name: string;
  phone: string;
  registration: string;
  totalCH?: number;
}

export interface Report {
  _id?: string;
  affectedPeople: number;
  communityName: string;
  communityContacts: Contact[];
  communityPeople: number;
  createdAt?: Date;
  discussion: string;
  introduction: string;
  isLate: boolean;
  methodology: string;
  projectTitle: string;
  results: string;
  students: number;
  teams: number;
  updatedAt?: Date;
  ods: string[];
  midiaLinks: string[];
}

export interface Project {
  _id?: string;
  author: string | User;
  category: string | Category;
  createdAt?: Date;
  course?: Course[];
  dateFinal: Date;
  courses: string[];
  dateStart: Date;
  description: string;
  researchTypeDescription?: string;
  studentsLearningDescription?: string;
  transformingActionsDescription?: string;
  disciplineLearningObjectivesDescription?: string;
  ods?: string[];
  discipline: Discipline;
  firstSemester: Schedule[];
  key?: string;
  maxClasses?: number;
  name: string;
  notice: string | Notice;
  partnership: Partnership[];
  planning: Planning[];
  program: string | Program;
  report?: Report;
  resources: Resources;
  secondSemester: Schedule[];
  specificCommunity: Community;
  status: ProjectStatus;
  teachers: User[];
  totalCH?: number;
  totalCHManha?: number;
  totalCHTarde?: number;
  totalCHNoite?: number;
  // school: string;
  // schoolCourses: string[];
  updatedAt?: Date;
}

export function isProject(p: any): p is Project {
  return (
    p != null &&
    typeof p === "object" &&
    !Array.isArray(p) &&
    "author" in p &&
    "category" in p &&
    "dateFinal" in p &&
    "dateStart" in p &&
    "description" in p &&
    "disciplines" in p &&
    "firstSemester" in p &&
    "name" in p &&
    "notice" in p &&
    "partnership" in p &&
    "planning" in p &&
    "program" in p &&
    "resources" in p &&
    "secondSemester" in p &&
    "specificCommunity" in p &&
    "ods" in p &&
    "midiaLinks" in p &&
    "status" in p &&
    "teachers " in p
  );
}

export function isReport(r: any): r is Report {
  return (
    r != null &&
    typeof r === "object" &&
    !Array.isArray(r) &&
    "affectedPeople" in r &&
    "communityContacts" in r &&
    "communityPeople" in r &&
    "discussion" in r &&
    "introduction" in r &&
    "isLate" in r &&
    "methodology" in r &&
    "projectTitle" in r &&
    "results" in r &&
    "students" in r &&
    "teams" in r
  );
}
