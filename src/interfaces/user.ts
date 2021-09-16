import { Course } from "./course";

export interface Role
{
  _id?: string;
  description: string;
};

export interface User
{
  _id?: string;
  courses: (string | Course)[];
  cpf: string;
  createdAt?: Date;
  email: string;
  isActive: boolean;
  lattes: string;
  name: string;
  password: string;
  roles: (string | Role)[];
  updatedAt?: Date;
};

export function isRole(r: any): r is Role
{
  return r != null && typeof r === "object" && !Array.isArray(r)
    && "description" in r;
}

export function isUser(u: any): u is User
{
  return u != null && typeof u === "object" && !Array.isArray(u)
    && "courses" in u
    && "cpf" in u
    && "email" in u
    && "isActive" in u
    && "lattes" in u
    && "name" in u
    && "password" in u
    && "roles" in u;
}

export function getUserId(u: any): string | null
{
  if (typeof u === "string")
    return u;

  if (isUser(u) && u._id != null)
    return u._id;

  return null;
}