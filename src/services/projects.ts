export function getAllProjectsEndpoint(): string
{
  return "/projects";
}

export function createProjectEndpoint(): string
{
  return "/project";
}

export function updateProjectEndpoint(id: string): string
{
  return `/project/${id}`;
}

export function deleteProjectEndpoint(id: string): string
{
  return `/project/${id}`;
}