export interface Campus
{
  _id?: string;
  name: string;
}

export interface Course
{
  _id?: string;
  key?: string;
  name: string;
  campus: string | Campus;
  isActive: boolean;
}

export function isCampus(c: any): c is Campus
{
  return c != null && typeof c === "object" && !Array.isArray(c)
    && "name" in c;
}

export function isCourse(c: any): c is Course
{
  return c != null && typeof c === "object" && !Array.isArray(c)
    && "name" in c
    && "campus" in c
    && "isActive" in c;
}