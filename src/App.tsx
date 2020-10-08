import React from 'react';
import 'antd/dist/antd.css'
import { RouterGuard } from 'react-router-guard';
import config from './routes/routes'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import GlobalStyled from './global/global-style'

import { persistor, store } from './store'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <GlobalStyled />
          <RouterGuard config={config} />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
