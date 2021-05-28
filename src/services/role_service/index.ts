import { IRole } from "../../interfaces/role";
import api from "../api";

export async function getRoles(): Promise<IRole[]>
{
  const response = await api.get("roles");

  return response.data;
};