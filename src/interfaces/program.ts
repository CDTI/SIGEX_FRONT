export interface Program
{
  _id?: string;
  description: string;
  isActive: boolean;
  name: string;
}

export function isProgram(p: any): p is Program
{
  return p && (p as Program)._id !== undefined;
}