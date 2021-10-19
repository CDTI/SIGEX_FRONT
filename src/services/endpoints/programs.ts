import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllProgramsEndpoint(): HttpRequestConfiguration
{
  return { method: "GET", url: "/programs" };
}