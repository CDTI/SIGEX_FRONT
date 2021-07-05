export interface ICategory
{
  _id: string;
  name: string;
  isActive: boolean;
};

export function isCategory(c: string | ICategory): c is ICategory
{
  return (c as ICategory)._id !== undefined;
}