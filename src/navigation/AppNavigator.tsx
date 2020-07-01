import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './MainTabNavigator';
import { isMountedRef, navigationRef } from './NavigationService';

export default function AppNavigation() {
  React.useEffect(() => {
      isMountedRef.current = true;

      return () => (isMountedRef.current = false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
