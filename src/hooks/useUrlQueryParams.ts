import { useLocation } from "react-router-dom";

export function useUrlQueryParams()
{
  const { search } = useLocation();

  return new URLSearchParams(search);
}