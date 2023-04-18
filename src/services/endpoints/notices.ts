import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllNoticesEndpoint(): HttpRequestConfiguration {
  return { method: "GET", url: "/notices" };
}

export function createNoticeEndpoint(): string {
  return "/notice";
}

export function updateNoticeEndpoint(id: string): string {
  return `/notice/${id}`;
}

export function changeNoticeStatusEndpoint(id: string): string {
  return `/notice/${id}/is-active`;
}
