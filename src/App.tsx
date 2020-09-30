import React from 'react';
import 'antd/dist/antd.css'
import { RouterGuard } from 'react-router-guard';
import config from './routes/routes'

function App() {
  return (
    <div className="App">
      <RouterGuard config={config} />
    </div>
  );
}

export default App;
