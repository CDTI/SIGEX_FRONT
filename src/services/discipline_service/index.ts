import { httpClient } from "../httpClient";

import { Discipline } from "../../interfaces/discipline";

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const getAllDisciplines = async (): Promise<Discipline[]> => {
  const response = await httpClient.get("/disciplines");

  return response.data;
};

export const getActiveDisciplines = async (): Promise<Discipline[]> => {
  const response = await httpClient.get("/disciplines/is-active");
  return response.data;
};

export const getDisciplinesByNotice = async (
  id: string
): Promise<Discipline[]> => {
  const response = await httpClient.get(`/disciplines/byNotice/${id}`);

  return response.data;
};

export const getDisciplinesByCategory = async (
  id: string
): Promise<Discipline[]> => {
  const response = await httpClient.get(`/disciplines/byCategory/${id}`);

  return response.data;
};

export const getDisciplinesByCourses = async (
  courses: Array<string>
): Promise<Discipline[]> => {
  let query = "?courses=";
  courses.forEach((el) => (query += `${el},`));
  const response = await httpClient.get(
    `/disciplines/byCourses/${query.slice(0, -1)}`
  );
  // const response = await httpClient.get(`/disciplines`);

  return response.data;
};

export const getDiscipline = async (id: string): Promise<Discipline> => {
  const response = await httpClient.get(`/discipline/${id}`);

  return response.data;
};

export const createDiscipline = async (
  discipline: Discipline
): Promise<ReturnRequest> => {
  const response = await httpClient.post("/discipline", discipline);

  return response.data;
};

export const updateDiscipline = async (
  id: string,
  discipline: any
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/discipline/${id}`, discipline);

  return response.data as ReturnRequest;
};

export const changeDisciplineStatus = async (
  id: string
): Promise<ReturnRequest> => {
  const response = await httpClient.put(`/discipline/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
