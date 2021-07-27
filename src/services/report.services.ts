import api from "./api";

import { IReport } from "../interfaces/report";

export async function createReport(projectId: string, report: IReport): Promise<string>
{
  const response = await api.post(`/report/${projectId}`, report);

  return response.data;
}

export async function updateReport(id: string, report: IReport): Promise<string>
{
  const response = await api.put(`/report/${id}`, report);

  return response.data;
}