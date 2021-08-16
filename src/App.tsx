import React from "react";
import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";

import { Routes } from "./routes";
import { AuthProvider } from "./context/auth";
import GlobalStyled from "./global/global-style";

export function App()
{
  return (
    <div className="App">
      <GlobalStyled />
      <AuthProvider>
        <ConfigProvider locale={ptBR}>
          <Routes />
        </ConfigProvider>
      </AuthProvider>
    </div>
  );
};
