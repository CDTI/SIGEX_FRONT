import { INotice } from "../../interfaces/notice";
import api from "../api";

export const getAllNotices = async (): Promise<INotice[]> =>
{
  const response = await api.get("notices");

  return response.data;
};

export const getActiveNoticesForUser = async (id?: string): Promise<INotice[]> =>
{
  const response = await api.get(`notices/activeForUser/${id}`);

  return response.data;
};

export const getNotice = async (id: string): Promise<INotice> =>
{
  const response = await api.get(`notice/${id}`);

  return response.data;
};

export const createNotice = async (period: INotice): Promise<string> =>
{
  const response = await api.post("notice", period);

  return response.data;
};

export const updateNotice = async (id: string, period: INotice): Promise<string> =>
{
  const response = await api.put(`notice/${id}`, period);

  return response.data;
};

export const changeNoticeStatus = async (id: string): Promise<string> =>
{
  const response = await api.put(`notice/changeStatus/${id}`);

  return response.data;
};
