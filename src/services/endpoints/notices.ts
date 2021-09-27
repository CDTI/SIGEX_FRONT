export function getAllNoticesEndpoint(): string
{
  return "/notices";
}

export function createNoticeEndpoint(): string
{
  return "/notice";
}

export function updateNoticeEndpoint(id: string): string
{
  return `/notice/${id}`;
}

export function changeNoticeStatusEndpoint(id: string): string
{
  return `/notice/${id}/is-active`;
}
