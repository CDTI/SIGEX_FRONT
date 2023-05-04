import { httpClient } from "../httpClient";

export const generateReport = async (city: string, year: number) => {
  const data = { city: city, year: year };
  const response = await httpClient.post("/project/generateYearReport", data);

  return response.data;
};
