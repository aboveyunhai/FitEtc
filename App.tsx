import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import AppNavigator from './src/navigation/AppNavigator';
import appStore from './src/redux/store/AppStore';

const App = () => {
  let init = async () => {

  };

  useEffect(() => {
    init().finally(() => {
      RNBootSplash.hide({ duration: 150 });
    });
  }, [])

  return (
    <>
      <Provider store={appStore}>
        <AppNavigator />
      </Provider>
    </>
  );
};

export default App;
