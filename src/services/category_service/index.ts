import { ICategory } from "../../interfaces/category";
import api from "../api";

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const getAllCategories = async (): Promise<ICategory[]> => {
  const response = await api.get("/categories");

  return response.data.categories;
};

export const getActiveCategories = async (): Promise<ICategory[]> =>
{
  const response = await api.get("/categories/active");
  return response.data.categories;
}

export const getCategoriesByNotice = async (id: string): Promise<ICategory[]> => {
  const response = await api.get(`/categories/byNotice/${id}`);

  return response.data.categories;
};

export const getCategory = async (id: string): Promise<ICategory> => {
  const response = await api.get(`/category/${id}`);

  return response.data.category;
};

export const createCategory = async (category: ICategory): Promise<ReturnRequest> => {
  try {
    const response = await api.post("/category", category);

    return response.data;
  } catch (e) {
    return e;
  }
};

export const updateCategory = async (id: string, category: any): Promise<ReturnRequest> => {
  const response = await api.put(`/category/${id}`, category);

  return response.data as ReturnRequest;
};

export const changeCategoryStatus = async (id: string): Promise<ReturnRequest> => {
  const response = await api.put(`/category/changeStatus/${id}`);

  return response.data as ReturnRequest;
};
