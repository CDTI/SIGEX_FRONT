export interface Category
{
  _id?: string;
  createdAt: Date;
  isActive: boolean;
  name: string;
};

export function isCategory(c: any): c is Category
{
  return c;
}
