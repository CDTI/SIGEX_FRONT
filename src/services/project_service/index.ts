import { AxiosRequestConfig } from "axios";

import { httpClient, RequestOptions } from "../httpClient";

import { Project, Report } from "../../interfaces/project";

export interface ReturnResponse {
  message: string;
  project: Project;
  result: "error" | "success";
}

export interface GetResponse {
  message: string;
  projects: Project[];
}

export async function listAllProjects(
  options?: RequestOptions
): Promise<Project[]> {
  const config: AxiosRequestConfig = {};
  if (options != null) {
    if (options.withPopulatedRefs != null && options.withPopulatedRefs)
      config.params = { ...config.params, withPopulatedRefs: true };

    if (options.cancellationToken != null)
      config.cancelToken = options.cancellationToken;
  }

  const response = await httpClient.get("/projects", config);

  return response.data;
}

export async function countProjects(programId: string) {
  if (programId) {
    const response = await httpClient.get("/projects/count", {
      params: { program: programId },
    });
    return response.data;
  } else {
    const response = await httpClient.get("/projects/count", {});
    return response.data;
  }
}

export async function listAllTeacherProjects(params: any) {
  const response = await httpClient.get("/projects/forTeacher", {
    params: params,
  });

  return response.data;
}

export async function createProject(
  project: Project,
  options?: RequestOptions
): Promise<string> {
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const response = await httpClient.post("/project", project, config);

  return response.data;
}

export async function updateProject(
  id: string,
  project: Project,
  options?: RequestOptions
): Promise<string> {
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const response = await httpClient.put(`/project/${id}`, project, config);

  return response.data;
}

export const listApprovedProjects = async (): Promise<GetResponse> => {
  const response = await httpClient.get("/listApprovedProject");

  return response.data;
};

export const deleteProject = async (
  projectId: string
): Promise<ReturnResponse> => {
  const response = await httpClient.delete(`/project/${projectId}`);

  return response.data;
};

export const downloadCSV = async (programId: string): Promise<any> => {
  if (programId !== "null") {
    const response = await httpClient.get("/downloadCsv/".concat(programId), {
      responseType: "blob",
    });
    window.open(response.data);
    return response.data;
  } else {
    const response = await httpClient.get("/downloadCsv/");
    window.open(response.data);
    return response.data;
  }
};

export async function createReport(
  projectId: string,
  report: Report
): Promise<string> {
  const response = await httpClient.post(
    `/project/report/${projectId}`,
    report
  );

  return response.data;
}

export async function updateReport(
  id: string,
  report: Report
): Promise<string> {
  const response = await httpClient.put(`/project/report/${id}`, report);

  return response.data;
}
