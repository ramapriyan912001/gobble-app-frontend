import React from 'react';
import {AppContainer} from './src/routes/routes'
import { Provider } from 'react-redux';
import configureStore from './src/store';

const store = configureStore();

export default function App() {
  console.log('App Executed');
  return (
    <Provider store={store}>
      <AppContainer/>
    </Provider>
  );
}
