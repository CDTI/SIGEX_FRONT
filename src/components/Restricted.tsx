import React from "react";

import { Role } from "../interfaces/user";

import { useAuth } from "../context/auth";

interface Props
{
  allowedRoles: string[];
  notAllowedRoles?: string[]
}

export const Restricted: React.FC<Props> = (props) =>
{
  const { user } = useAuth();

  let shouldRender = user !== null && user.roles.some((r: string | Role) =>
    props.allowedRoles.includes((r as Role).description));

  if (props.notAllowedRoles !== undefined)
    shouldRender = shouldRender && !user!.roles.some((r: string | Role) =>
      props.notAllowedRoles!.includes((r as Role).description));

  if (!shouldRender)
    return null;

  return <>{props.children}</>;
};
