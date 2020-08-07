import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { AppColor, AppFont, AppCompSize } from '../constants/AppConstant';
import { RecentScreen } from '../screens/StatisticsScreen/RecentScreen';
import { OverallScreen } from '../screens/StatisticsScreen/OverallScreen';

const TABBAR_HEIGHT = AppCompSize.TABBAR_HEIGHT - 10;

// navigation
const Tab = createMaterialTopTabNavigator();

const LoadingScreen = () => {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
      <ActivityIndicator size="small" color={AppColor.white} />
    </View>
  )
}

const TabProps = {
  lazy: true,
  lazyPlaceholder: LoadingScreen,
  initialLayout: {
    width: AppCompSize.SCREEN_W,
  },
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
      fontFamily: AppFont.Oxanium.regular,
    },
    style: { backgroundColor: AppColor.baseColor },
    tabStyle: { height: TABBAR_HEIGHT, paddingTop: 0},
    indicatorStyle: {
      backgroundColor: AppColor.highlightBlue,
    },
    activeTintColor: AppColor.white,
  }
}

function RecentHistory() {
  return (
    <ScrollView style={styles.container}>
      <RecentScreen />
    </ScrollView>
  )
}

function OverallHistory() {
  return (
    <View style={styles.container}>
      <OverallScreen />
    </View>
  )
}

export default function StatisticsScreen() {
  return (
    <Tab.Navigator {...TabProps} swipeEnabled={true}>
      <Tab.Screen name="Recent" component={RecentHistory} />
      <Tab.Screen name="Overall" component={OverallHistory} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.baseColor,
  },
});
