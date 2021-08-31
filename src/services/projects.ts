export function getAllProjectsEndpoint(): string
{
  return "/projects";
}

export function deleteProjectEndpoint(id: string): string
{
  return `/project/${id}`;
}