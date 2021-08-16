export interface Role
{
  _id?: string;
  description: string;
};

export interface User
{
  _id?: string;
  cpf: string;
  createdAt: Date;
  email: string;
  isActive: boolean;
  lattes: string;
  name: string;
  password: string;
  roles: (string | Role)[];
  updatedAt: Date;
};

export function isRole(r: any): r is Role
{
  return r && (r as Role)._id !== undefined;
}

export function isUser(u: any): u is User
{
  return u && (u as User)._id !== undefined;
}
