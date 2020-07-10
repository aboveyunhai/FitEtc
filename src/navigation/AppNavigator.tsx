import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './MainTabNavigator';
import { isMountedRef, navigationRef } from './NavigationService';
import { AppColor } from '../constants/AppConstant';

export default function AppNavigation() {
  React.useEffect(() => {
      isMountedRef.current = true;

      return () => (isMountedRef.current = false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={AppColor.componentColor} barStyle="light-content" />
        <NavigationContainer ref={navigationRef} >
          <MainTabNavigator/>
        </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
