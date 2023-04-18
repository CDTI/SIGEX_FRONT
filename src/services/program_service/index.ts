import { httpClient } from "../httpClient";

import { Program } from "../../interfaces/program";

declare type ResultResponse = "success" | "error";

export interface ReturnResponsePost {
  program?: Program;
  message: string;
  created: boolean;
  result: ResultResponse;
}

interface ReturnResponseGet {
  message: string;
  programs: Program[];
}

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const createProgram = async (
  program: Program
): Promise<ReturnResponsePost> => {
  const response = await httpClient.post("/program", program);

  return response.data;
};

export const listPrograms = async (): Promise<Program[]> => {
  const response = await httpClient.get("/programs");

  return response.data;
};

export const listActivePrograms = async (): Promise<Program[]> => {
  const response = await httpClient.get("/programs/active");

  return response.data;
};

export const updateProgram = async (
  id: string,
  program: any
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/program/${id}`, program);

  return response.data as ReturnRequest;
};

export const changeProgramStatus = async (
  id: string
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/program/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
