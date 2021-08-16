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

export const listAllProject = async (): Promise<Project[]> =>
{
    const response = await api.get("/project")

    return response.data.projects
}

export const listProjectForTeacher = async (): Promise<Project[]> =>
{
    const response = await api.get("/projectForTeacher")

    return response.data.projects
}

export const createProject = async (project: Project): Promise<Project> =>
{
    const response = await api.post("/project", project)

    return response.data
}

export const updateProject = async (project: Project): Promise<ReturnResponse> =>
{
    const response = await api.put("/project", project)

    return response.data
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