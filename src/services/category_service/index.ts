import { httpClient } from "../httpClient";

import { Category } from "../../interfaces/category";

interface ReturnRequest
{
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const getAllCategories = async (): Promise<Category[]> =>
{
  const response = await httpClient.get("/categories");

  return response.data;
};

export const getActiveCategories = async (): Promise<Category[]> =>
{
  const response = await httpClient.get("/categories/is-active");
  return response.data;
}

export const getCategoriesByNotice = async (id: string): Promise<Category[]> => {
  const response = await httpClient.get(`/categories/byNotice/${id}`);

  return response.data;
};

export const getCategory = async (id: string): Promise<Category> =>
{
  const response = await httpClient.get(`/category/${id}`);

  return response.data;
};

export const createCategory = async (category: Category): Promise<ReturnRequest> =>
{
  const response = await httpClient.post("/category", category);

  return response.data;
};

export const updateCategory = async (id: string, category: any): Promise<ReturnRequest> =>
{
  const response = await httpClient.put(`/category/${id}`, category);

  return response.data as ReturnRequest;
};

export const changeCategoryStatus = async (id: string): Promise<ReturnRequest> =>
{
  const response = await httpClient.put(`/category/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
