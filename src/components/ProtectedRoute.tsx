import React, { useContext, useMemo } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { Role } from "../interfaces/user";

interface Props {
  allow: string | string[];
  path: string | string[];
  exact?: boolean;
}

export const ProtectedRoute: React.FC<Props> = (props) => {
  const authContext = useContext(AuthContext);
  const shouldRender = useMemo(() => {
    const userRoles =
      authContext.user?.roles.map(
        (r: string | Role) => (r as Role).description
      ) ?? [];

    if (typeof props.allow === "string")
      return userRoles.some((r: string) => props.allow === r);

    return userRoles.some((r: string) => props.allow.includes(r));
  }, [authContext.user]);

  return (
    <Route path={props.path} exact={props.exact ?? false}>
      {shouldRender ? props.children : <Redirect to="/home" />}
    </Route>
  );
};
