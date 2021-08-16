import Axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

import { Campus, Course } from "../interfaces/course";

import api from "./api";

export async function getAllCampi(cancellationToken?: CancelTokenSource): Promise<Campus[]>
{
  const config: AxiosRequestConfig = {};
  if (cancellationToken !== undefined)
    config.cancelToken = cancellationToken.token;

  const { data } = await api.get("/campi", config);

  return data;
}

export async function getAllCourses(
  cancellationToken?: CancelTokenSource)
  : Promise<Course[]>
{
  const config: AxiosRequestConfig = {};
  if (cancellationToken !== undefined)
    config.cancelToken = cancellationToken.token;

  const { data } = await api.get("/courses", config);

  return data;
}

export async function createCourse(
  course: Course,
  cancellationToken?: CancelTokenSource)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (cancellationToken !== undefined)
    config.cancelToken = cancellationToken.token;

  const { data } = await api.post("/course", course, config);

  return data;
}

export async function updateCourse(
  id: string,
  course: Course,
  cancellationToken?: CancelTokenSource)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (cancellationToken !== undefined)
    config.cancelToken = cancellationToken.token;

  const { data } = await api.put(`/course/${id}`, course, config);

  return data;
}
