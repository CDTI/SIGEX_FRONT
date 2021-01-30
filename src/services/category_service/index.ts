import { ICategory } from "../../interfaces/category";
import api from "../api";

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const createCategory = async (category: ICategory): Promise<ReturnRequest> => {
  try {
    const response = await api.post("/category", category);

    return response.data;
  } catch (e) {
    return e;
  }
};

export const listCategories = async (): Promise<ICategory[]> => {
  const response = await api.get("/category");

  return response.data.categories;
};

export const listCategoriesByPeriod = async (id: string): Promise<ICategory[]> => {
  const response = await api.get(`/categoryByPeriod/${id}`);

  return response.data.categories;
};

export const listCategoriesDashboard = async (): Promise<ICategory[]> => {
  const response = await api.get("/categoryDashboard");

  return response.data.categories;
};

export const changeStatusCategory = async (id: string): Promise<ReturnRequest> => {
  const response = await api.put(`/changeStatusCategory/${id}`);

  return response.data as ReturnRequest;
};

export const updateCategory = async (category: any): Promise<ReturnRequest> => {
  const response = await api.put("/category", category);

  return response.data as ReturnRequest;
};
