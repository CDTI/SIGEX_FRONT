import api from "../api";

import { Notice } from "../../interfaces/notice";

export const getAllNotices = async (): Promise<Notice[]> =>
{
  const response = await api.get("/notices");

  return response.data;
};

export async function hasActiveNoticesForUser(id: string): Promise<boolean>
{
  const response = await api.get(`/notices/hasActiveForUser/${id}`);

  return response.data;
}

export async function getActiveNoticesForUser(id: string, withPopulatedRefs: boolean = false): Promise<Notice[]>
{
  let uri = `/notices/activeForUser/${id}`;
  if (withPopulatedRefs)
    uri += "?withPopulatedRefs=true";

  const response = await api.get(uri);

  return response.data;
};

export const getNotice = async (id: string): Promise<Notice> =>
{
  const response = await api.get(`/notice/${id}`);

  return response.data;
};

export const createNotice = async (period: Notice): Promise<string> =>
{
  const response = await api.post("/notice", period);

  return response.data;
};

export const updateNotice = async (id: string, period: Notice): Promise<string> =>
{
  const response = await api.put(`/notice/${id}`, period);

  return response.data;
};

export const changeNoticeStatus = async (id: string): Promise<string> =>
{
  const response = await api.put(`/notice/changeStatus/${id}`);

  return response.data;
};
