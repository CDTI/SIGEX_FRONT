import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getFeedbackEndpoint(projectId: string): HttpRequestConfiguration
{
  return { method: "GET", url: `/feedback/${projectId}` };
}

export function createFeedbackEndpoint(projectId: string): HttpRequestConfiguration
{
  return { method: "POST", url: `/feedback/${projectId}` };
}