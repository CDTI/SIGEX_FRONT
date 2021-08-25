import { AxiosRequestConfig } from "axios";

import api, { RequestOptions } from "../api";

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

export async function listAllProjects(
  options?: RequestOptions)
  : Promise<Project[]>
{
  const config: AxiosRequestConfig = {};
  if (options != null)
  {
    if (options.withPopulatedRefs != null && options.withPopulatedRefs)
      config.params = { ...config.params, withPopulatedRefs: true }

    if (options.cancellationToken != null)
      config.cancelToken = options.cancellationToken;
  }

  const response = await api.get("/projects", config);

  return response.data;
}

export async function listAllTeacherProjects(
  options?: RequestOptions)
  : Promise<Project[]>
{
  const config: AxiosRequestConfig = {};
  if (options != null)
  {
    if (options.withPopulatedRefs != null && options.withPopulatedRefs)
      config.params = { ...config.params, withPopulatedRefs: true }

    if (options.cancellationToken != null)
      config.cancelToken = options.cancellationToken;
  }

  const response = await api.get("/projects/forTeacher");

  return response.data;
}

export async function createProject(
  project: Project,
  options?: RequestOptions)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const response = await api.post("/project", project, config);

  return response.data;
}

export async function updateProject(
  id: string,
  project: Project,
  options?: RequestOptions)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const response = await api.put(`/project/${id}`, project, config);

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