import React, { ReactNode, useContext, useMemo } from "react";
import { AuthContext } from "../context/auth";

import { Role } from "../interfaces/user";

interface Props
{
  allow: string | string[];
  disallow?: string | string[];
}

export const Restricted: React.FC<Props> = (props) =>
{
  const authContext = useContext(AuthContext);

  const shouldRender = useMemo(() =>
  {
    const userRoles = authContext.user?.roles.map((r: string | Role) =>
      (r as Role).description) ?? [];

    let result = typeof props.allow === "string"
      ? userRoles.some((r: string) => props.allow === r)
      : userRoles.some((r: string) => props.allow.includes(r));

    if (props.disallow != null)
      result = result && !(typeof props.disallow === "string"
        ? userRoles.some((r: string) => props.disallow === r)
        : userRoles.some((r: string) => props.allow.includes(r)));

    return result;
  }, [authContext.user]);

  if (!shouldRender)
    return null;

  return <>{props.children}</>;
};
