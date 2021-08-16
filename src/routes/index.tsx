import React from "react";

import { SignRoutes } from "./login_routes";
import { OtherRoutes } from "./other_routes";

import { useAuth } from "../context/auth";

export const Routes: React.FC = () =>
{
  const { signed } = useAuth();

  return signed ? <OtherRoutes /> : <SignRoutes />;
};
