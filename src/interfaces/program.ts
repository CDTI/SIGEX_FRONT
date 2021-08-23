export interface Program
{
  _id?: string;
  description: string;
  isActive: boolean;
  name: string;
}

export function isProgram(p: any): p is Program
{
  return p && typeof p === "object" && !Array.isArray(p)
    && "description" in p
    && "isActive" in p
    && "name" in p;
}

export function getProgramId(p: any): string | null
{
  if (typeof p === "string")
    return p;

  if (isProgram(p) && p._id != null)
    return p._id;

  return null;
}