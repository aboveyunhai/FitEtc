/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import appStore from './src/redux/store/AppStore';

const App = () => {
  return (
    <>
        <Provider store={appStore}>
          <AppNavigator />
        </Provider>
    </>
  );
};

export default App;
