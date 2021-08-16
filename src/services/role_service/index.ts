import api from "../api";

import { Role } from "../../interfaces/user";

export async function getRoles(): Promise<Role[]>
{
  const response = await api.get("/roles");

  return response.data;
};