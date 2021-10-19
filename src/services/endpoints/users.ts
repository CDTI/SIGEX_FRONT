import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function hasActiveNoticesEndpoint(): string
{
  return "/user/me/notices/is-active";
}

export function getActiveNoticesEndpoint(): string
{
  return "/user/me/notices";
}

export function getAssociatedCoursesEndpoint(): string
{
  return "/user/me/courses";
}

export function getAllUsersEndpoint(): string
{
  return "/users";
}

export function createUserEndpoint(): HttpRequestConfiguration
{
  return { method: "POST", url: "/user" };
}

export function updateUserProfileEndpoint(): HttpRequestConfiguration
{
  return { method: "PUT", url: "/user/me" };
}

export function updateUserEndpoint(id: string): HttpRequestConfiguration
{
  return { method: "PUT", url: `/user/${id}` };
}

export function requestUsersPasswordChangeEndpoint(cpf: string): string
{
  return `/user/${cpf}/password-change-request`;
}

export function toggleUserEndpoint(id: string): string
{
  return `/user/${id}/is-active`;
}

export function loginUserEndpoint(): HttpRequestConfiguration
{
  return { method: "POST", url: "/login" };
}