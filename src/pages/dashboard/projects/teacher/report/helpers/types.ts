import { ReactNode } from "react";

export interface ContentMap
{
  [key: string]:
  {
    content: ReactNode,
    title?: string,
  }
}

export interface UrlParams
{
  id: string
}