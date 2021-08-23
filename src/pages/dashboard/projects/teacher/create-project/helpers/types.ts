import { ReactNode } from "react";

export interface FormsMap
{
  [key: string]:
  {
    form: ReactNode,
    label?: string
  };
}

export interface UrlParams
{
  id: string;
}