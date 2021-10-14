import { HttpRequestConfiguration } from "../../hooks/useHttpClient";

export function getAllCategoriesEndpoint(): HttpRequestConfiguration
{
  return { method: "GET", url: "/categories" };
}

export function getActiveCategoriesEndpoint(): string
{
  return "/categories/is-active";
}