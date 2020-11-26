import React from 'react';
import 'antd/dist/antd.css'
import GlobalStyled from './global/global-style'

import Routes from './routes'
import { AuthProvider } from './context/auth'

function App() {
  return (
    <div className="App">
      <GlobalStyled />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

export default App;
