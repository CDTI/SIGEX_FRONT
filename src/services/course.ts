import { AxiosRequestConfig } from "axios";

import { Campus, Course } from "../interfaces/course";

import api, { RequestOptions } from "./api";

export async function getAllCampi(options?: RequestOptions): Promise<Campus[]>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const { data } = await api.get("/campi", config);

  return data;
}

export async function getAllCourses(
  options?: RequestOptions)
  : Promise<Course[]>
{
  const config: AxiosRequestConfig = {};
  if (options != null)
  {
    if (options.withPopulatedRefs != null && options.withPopulatedRefs)
      config.params = { ...config.params, withPopulatedRefs: true }

    if (options.cancellationToken != null)
      config.cancelToken = options.cancellationToken;
  }

  const { data } = await api.get("/courses", config);

  return data;
}

export async function createCourse(
  course: Course,
  options?: RequestOptions)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const { data } = await api.post("/course", course, config);

  return data;
}

export async function updateCourse(
  id: string,
  course: Course,
  options?: RequestOptions)
  : Promise<string>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  const { data } = await api.put(`/course/${id}`, course, config);

  return data;
}

export async function deleteCourse(
  id: string,
  options?: RequestOptions)
  : Promise<void>
{
  const config: AxiosRequestConfig = {};
  if (options != null && options.cancellationToken != null)
    config.cancelToken = options.cancellationToken;

  await api.delete(`/course/${id}`, config);
}