import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { LoginPage } from "../pages/login";
import { ChangePasswordPage } from "../pages/change-password";
import { HomePage } from "../pages/home";

export const SignRoutes: React.FC = () =>
{
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/changePassword" component={ChangePasswordPage} />
    </BrowserRouter>
  );
};
