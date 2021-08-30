import { httpClient } from "../httpClient";

import { Role } from "../../interfaces/user";

export async function getRoles(): Promise<Role[]>
{
  const response = await httpClient.get("/roles");

  return response.data;
};