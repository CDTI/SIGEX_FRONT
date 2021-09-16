export function hasActiveNoticesEndpoint(): string
{
  return "/user/me/notices/is-active";
}

export function getActiveNoticesEndpoint(): string
{
  return "/user/me/notices";
}

export function getAllUsersEndpoint(): string
{
  return "/users";
}

export function createUserEndpoint(): string
{
  return "/user";
}

export function updateUserEndpoint(id: string): string
{
  return `/user/${id}`;
}

export function requestUsersPasswordChangeEndpoint(cpf: string): string
{
  return `/user/${cpf}/password-change-request`;
}

export function toggleUserEndpoint(id: string): string
{
  return `/user/${id}/is-active`;
}