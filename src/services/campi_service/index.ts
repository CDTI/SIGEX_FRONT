import { httpClient } from "../httpClient";

import { Campus } from "../../interfaces/course";

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const getAllCampi = async (): Promise<Campus[]> => {
  const response = await httpClient.get("/campi");
  return response.data;
};

export const getActiveCampi = async (): Promise<Campus[]> => {
  const response = await httpClient.get("/campi/is-active");
  return response.data;
};

export const createCampus = async (campus: Campus): Promise<ReturnRequest> => {
  const response = await httpClient.post("/campus", campus);

  console.log(response.data);
  return response.data;
};

export const updateCampus = async (
  id: string,
  campus: any
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/campus/${id}`, campus);

  return response.data as ReturnRequest;
};

export const changeCampusStatus = async (
  id: string
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/campus/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
