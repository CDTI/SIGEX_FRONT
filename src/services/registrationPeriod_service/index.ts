import { IRegistrationPeriod } from "../../interfaces/registrationPeriod";
import api from "../api";

interface ReturnRequest {
  message: string;
  deleted?: boolean;
  created?: boolean;
  edited?: boolean;
  status: "error" | "success";
}

export const getAllPeriods = async (): Promise<IRegistrationPeriod[]> => {
  const response = await api.get("getAllRegistrationPeriod");

  return response.data;
};

export const getAllPeriodsActive = async (): Promise<IRegistrationPeriod[]> => {
  const response = await api.get("registrationPeriodActive");

  return response.data;
};

export const updatePeriod = async (period: IRegistrationPeriod): Promise<ReturnRequest> => {
  const response = await api.put("registrationPeriod", period);

  return response.data;
};

export const createRegistrationPeriod = async (period: IRegistrationPeriod): Promise<ReturnRequest> => {
  try {
    const response = await api.post("/registrationPeriod", period);
    return response.data;
  } catch (e) {
    return e;
  }
};
export const changeStatusRegistrationPeriod = async (id: string): Promise<ReturnRequest> => {
  const response = await api.put(`/changeStatusRegistrationPeriod/${id}`);

  return response.data as ReturnRequest;
};
