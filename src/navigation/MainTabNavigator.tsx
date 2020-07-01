import React from 'react';
import { Button, Platform } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingScreen from '../screens/SettingScreen';
import { ReloadButton } from '../components/UpdateButton';

import { AppColor } from '../constants/AppConstant';

type tabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
}

const tabConfig = {
    tabBarOptions: {
      // showIcon: false,
      // showLabel: false,
      activeBackgroundColor: AppColor.highlightBlueL,
      labelStyle: {
        fontWeight: "bold" as const,
      },
      style: {
        backgroundColor: AppColor.baseColor,
      },
      activeTintColor: AppColor.tabIconSelected,
      inactiveTintColor: AppColor.tabIconDefault
    }
};

const MainStackOptions =  {
  headerStyle: {
    backgroundColor: AppColor.baseColor,
    borderBottomWidth: 0.3,
    borderColor: AppColor.highlightBlue,
  },
  headerTintColor: '#ffffff',
};

const Tab = createBottomTabNavigator();

function getHeaderTitle(routeName: string) {
  switch (routeName) {
    case 'Home': return 'Home';
    case 'Statistics': return 'Statistics';
    case 'Setting': return 'Setting';
  }
}

function setHeaderRight(routeName: string) {
  switch (routeName) {
    case 'Home': return;
    case 'Statistics': return () => ( <ReloadButton /> );
    case 'Setting': return;
  }
}

function MainTabs({ navigation, route } :any) {
  const routeName = route.state
  ? route.state.routes[route.state.index].name
  : route.params?.screen || 'Home';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(routeName),
      headerRight: setHeaderRight(routeName),
    });
  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={ ({ route }) => ({
        tabBarIcon: ({ focused, color, size } : tabBarIconProps) => {
          let iconName;

          if(route.name === 'Home') {
            iconName = (Platform.OS === 'ios') ? 'rocket1' : 'rocket1';
          }else if (route.name === "Statistics") {
            iconName = (Platform.OS === 'ios') ?  'piechart' : 'piechart';
          }else if (route.name === 'Setting') {
            iconName = (Platform.OS === 'ios') ? 'setting' : 'setting';
          }

          return <TabBarIcon focused={focused} name={iconName} size={26} />
        },
      })}
      {...tabConfig}
    >
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Statistics" component={StatisticsScreen}/>
      <Tab.Screen name="Setting" component={SettingScreen}/>
    </Tab.Navigator>
  );
}

const MainStack = createStackNavigator();

export default function MainTabNavigator() {
  return (
    <MainStack.Navigator screenOptions={MainStackOptions}>
      <MainStack.Screen name="Main" component={MainTabs} />
    </MainStack.Navigator>
  );
}
