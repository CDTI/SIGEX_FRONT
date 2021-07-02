import IUser from "../../interfaces/user";
import api from "../api";

interface ResponseUsers {
  status: "error" | "success";
  user: IUser[];
  message: string;
}

interface ResponseUser {
  status: "error" | "success";
  user: IUser;
  message: string;
  created: boolean;
}

export const getUsers = async (): Promise<ResponseUsers> => {
  const response = await api.get("/user");

  return response.data;
};

export const createUser = async (user: any): Promise<ResponseUser> => {
  const response = await api.post("/user", user);

  return response.data;
};

export const updateUser = async (user: any): Promise<ResponseUser> => {
  const response = await api.put("/user", user);

  return response.data;
};

export const checkUser = async (user: any): Promise<boolean> => {
  const response = await api.post("/checkUser", user);

  return response.data;
};

export const resetPassword = async (user: any): Promise<ResponseUser> => {
  const response = await api.put(`/resetPassword/${user.cpf}`);

  return response.data;
};

export const requestPasswordChange = async (cpf: string): Promise<boolean> =>
{
  const response = await api.post("/requestPasswordChange", { cpf });

  return response.data;
};

export const changePassword = async (value: any): Promise<boolean> =>
{
  const response = await api.put("/changePassword", value);

  return response.data;
};

export const getUserName = async (cpf: string): Promise<string> =>
{
  const response = await api.get(`/user/name/${cpf}`);

  return response.data;
};


export const hasPasswordChangeToken = async (cpf: string): Promise<string> =>
{
  const response = await api.get(`/user/passwordChangeRequest/exists/${cpf}`);

  return response.data;
};