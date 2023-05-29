import { httpClient } from "../httpClient";

import { Campus, Unit } from "../../interfaces/course";

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

export const deleteCampus = async (id: string): Promise<ReturnRequest> => {
  const response = await httpClient.delete(`/campus/${id}`);

  return response.data as ReturnRequest;
};

export const getAllUnits = async (): Promise<Unit[]> => {
  const response = await httpClient.get("/unit");
  return response.data;
};

export const getActiveUnits = async (): Promise<Unit[]> => {
  const response = await httpClient.get("/unit/is-active");
  return response.data;
};

export const createUnit = async (unit: Unit): Promise<ReturnRequest> => {
  const response = await httpClient.post("/unit", unit);

  console.log(response.data);
  return response.data;
};

export const updateUnit = async (
  id: string,
  unit: any
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/unit/${id}`, unit);

  return response.data as ReturnRequest;
};

export const changeUnitStatus = async (id: string): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/unit/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
