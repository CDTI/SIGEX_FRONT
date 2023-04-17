import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllDisciplinesEndpoint(): HttpRequestConfiguration {
  return { method: "GET", url: "/disciplines" };
}

export function getActiveDisciplinesEndpoint(): string {
  return "/disciplines/is-active";
}
