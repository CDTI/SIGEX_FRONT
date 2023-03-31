import React from "react";
import "antd/dist/antd.css";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";

import { Routes } from "./routes";
import { AuthProvider } from "./context/auth";
import { BrowserRouter } from "react-router-dom";
import { Maintenance } from "./pages/maintenance";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider locale={ptBR}>
          {/* <Routes /> */}
          <Maintenance></Maintenance>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
