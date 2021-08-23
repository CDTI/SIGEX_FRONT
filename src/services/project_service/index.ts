import api from "../api";

import { Project, Report } from "../../interfaces/project";

export interface ReturnResponse
{
  message: string,
  project: Project,
  result: "error" | "success",
}

export interface GetResponse
{
  message: string,
  projects: Project[]
}

export async function listAllProjects(withPopulatedRefs: boolean = false): Promise<Project[]>
{
  let uri = "/projects";
  if (withPopulatedRefs)
    uri += "?withPopulatedRefs=true";

  const response = await api.get(uri);

  return response.data;
}

export async function listAllTeacherProjects(withPopulatedRefs: boolean = false): Promise<Project[]>
{
  let uri = "/projects/forTeacher";
  if (withPopulatedRefs)
    uri += "?withPopulatedRefs=true";

  const response = await api.get(uri);

  return response.data;
}

export async function createProject(data: Project): Promise<string>
{
  const response = await api.post("/project", data);

  return response.data;
}

export async function updateProject(id: string, data: Project): Promise<string>
{
  const response = await api.put(`/project/${id}`, data);

  return response.data;
}

export const listApprovedProjects = async(): Promise<GetResponse> =>
{
    const response =  await api.get("/listApprovedProject")

    return response.data
}

export const deleteProject = async(projectId: string): Promise<ReturnResponse> =>
{
    const response = await api.delete(`/project/${projectId}`)

    return response.data
}

export const downloadCSV = async(programId: string): Promise<any> =>
{
    if(programId !== "null"){
        const response = await api.get("/downloadCsv/".concat(programId), { responseType: "blob" })
        console.log(response.headers)
        window.open(response.data)
        return response.data
    } else {
        const response = await api.get("/downloadCsv/")
        window.open(response.data)
        return response.data
    }
}

export async function createReport(projectId: string, report: Report): Promise<string>
{
  const response = await api.post(`/project/report/${projectId}`, report);

  return response.data;
}

export async function updateReport(id: string, report: Report): Promise<string>
{
  const response = await api.put(`/project/report/${id}`, report);

  return response.data;
}