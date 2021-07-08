import React from 'react';
import 'antd/dist/antd.css'
import GlobalStyled from './global/global-style'

import Routes from './routes'
import { AuthProvider } from './context/auth'

import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";

function App() {
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
}

export default App;
