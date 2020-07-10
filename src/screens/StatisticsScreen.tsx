import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { AppColor } from '../constants/AppConstant';
import { RecentScreen } from '../screens/StatisticsScreen/RecentScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

// navigation
const Tab = createMaterialTopTabNavigator();

const TabProps = {
  lazy: true,
  lazyPlaceholder: LoadingScreen,
  initialLayout: {
    width: SCREEN_WIDTH,
  },
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: { backgroundColor: AppColor.baseColor },
    tabStyle: { height: 40, paddingTop: 0 },
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
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>

    </View>
  )
}

function LoadingScreen() {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
      <ActivityIndicator size="small" color={AppColor.white} />
    </View>
  )
}

export default function StatisticsScreen() {
  return (
    <Tab.Navigator {...TabProps}>
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
