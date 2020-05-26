import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './MainTabNavigator';

export default function AppNavigation() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
        <NavigationContainer>
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
