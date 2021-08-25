export interface Category
{
  _id?: string;
  createdAt?: Date;
  isActive: boolean;
  name: string;
  updatedAt?: Date;
};

export function isCategory(c: any): c is Category
{
  return c != null && typeof c === "object" && !Array.isArray(c)
    && "name" in c
    && "isActive" in c;
}

export function getCategoryId(c: any): string | null
{
  if (typeof c === "string")
    return c;

  if (isCategory(c) && c._id != null)
    return c._id;

  return null;
}
