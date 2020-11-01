import React, { useEffect } from 'react';

import { Provider } from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import AppNavigator from './src/navigation/AppNavigator';
import appStore from './src/redux/store/AppStore';
import { auth, startRecording } from './src/redux/actions/ActionCreator';

const App = () => {
  const init = async () => {
    await startRecording();
  }
  useEffect(() => {
    init().finally(() => {
      RNBootSplash.hide({ duration: 250 });
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
