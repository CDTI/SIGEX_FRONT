import { ReactNode } from "react";

export interface FormView
{
  view: ReactNode;
  title: string;
}

export interface UrlParams
{
  id: string;
}