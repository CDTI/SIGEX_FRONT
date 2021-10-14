import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllProjectsEndpoint(): HttpRequestConfiguration
{
  return { method: "GET", url: "/projects" };
}

export function createProjectEndpoint(): HttpRequestConfiguration
{
  return { method: "POST", url: "/project" };
}

export function updateProjectEndpoint(id: string): HttpRequestConfiguration
{
  return { method: "PUT", url: `/project/${id}` };
}

export function deleteProjectEndpoint(id: string): string
{
  return `/project/${id}`;
}