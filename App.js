import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {AppContainer} from './src/routes/routes'
import { Provider } from 'react-redux';
import firebaseSvc from './src/reducers/FirebaseSvc'
import store from './src/reducers/index'
// const store = configureStore();

export default function App() {
  console.log(firebaseSvc.currentUser())
  console.log('App Executed');
  return (
    <Provider store={store}>
      <AppContainer/>
    </Provider> 
  );
}
