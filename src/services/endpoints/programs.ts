import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllProgramsEndpoint(): HttpRequestConfiguration {
  return { method: "GET", url: "/programs" };
}

export function getActiveProgramsEndpoint(): HttpRequestConfiguration {
  return { method: "GET", url: "/programs/active" };
}
