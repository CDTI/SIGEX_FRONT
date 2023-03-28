import { httpClient } from "../httpClient";

import { User } from "../../interfaces/user";
import { Course } from "../../interfaces/course";

interface ResponseUsers {
  status: "error" | "success";
  user: User[];
  message: string;
}

interface ResponseUser {
  status: "error" | "success";
  user: User;
  message: string;
  created: boolean;
}

export const getUsers = async (): Promise<ResponseUsers> => {
  const response = await httpClient.get("/users");

  return response.data;
};

export const getUserCourses = async (id: string): Promise<string[]> => {
  const response = await httpClient.get(`/user/courses/${id}`);

  return response.data;
};

export const createUser = async (user: any): Promise<ResponseUser> => {
  const response = await httpClient.post("/user", user);

  return response.data;
};

export const updateUser = async (user: any): Promise<ResponseUser> => {
  const response = await httpClient.put(`/user/${user._id!}`, user);

  return response.data;
};

export const checkUser = async (user: any): Promise<boolean> => {
  const response = await httpClient.post("/checkUser", user);

  return response.data;
};

export const requestPasswordChange = async (cpf: string): Promise<boolean> => {
  const response = await httpClient.post(
    `/user/${cpf}/password-change-request`
  );

  return response.data;
};

export const changePassword = async (value: any): Promise<boolean> => {
  const response = await httpClient.put("/changePassword", value);

  return response.data;
};

export const getUserName = async (cpf: string): Promise<string> => {
  const response = await httpClient.get(`/user/name/${cpf}`);

  return response.data;
};

export const hasPasswordChangeToken = async (cpf: string): Promise<string> => {
  const response = await httpClient.get(
    `/user/passwordChangeRequest/exists/${cpf}`
  );

  return response.data;
};
