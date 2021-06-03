import React from 'react';
import {AppContainer} from './src/routes/routes'
import { Provider } from 'react-redux';
import store from 

export default function App() {
  console.log('App Executed');
  return (
    <Provider>
      <AppContainer/>
    </Provider>
  );
}
