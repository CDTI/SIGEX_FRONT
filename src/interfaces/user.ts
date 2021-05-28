import { IRole } from "./role";

export default interface IUser
{
  _id: string,
  cpf: string,
  name: string,
  lattes: string;
  email: string;
  password: string;
  roles: (string | IRole)[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};