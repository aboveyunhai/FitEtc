import React from 'react';
import { Platform } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingScreen from '../screens/SettingScreen';

import { AppColor } from '../constants/AppConstant';

// import { TabBar } from './createAnimatedBottomTabNavigtor';

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
  headerTintColor: '#ffffff'
};

type MainStackParamList = {
  Home: undefined;
  Statistics: undefined;
  Setting: undefined;
}
type MainStackRouteProp = RouteProp<MainStackParamList, 'Home'>;
type MainStackNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

type Props = {
  route: MainStackRouteProp;
  navigation: MainStackNavigationProp
};

const Tab = createBottomTabNavigator();

function getHeaderTitle(route) {
  const routeName = route.state
  ?
    route.state.routes[route.state.index].name
  :
    route.params?.screen || 'Home';

  switch (routeName) {
    case 'Home': return 'Home';
    case 'Statistics': return 'Statistics';
    case 'Setting': return 'Setting';
  }
}

type tabBarIconProps ={
  focused: boolean;
  color: string;
  size: number;
}

function MainTabs({ navigation, route }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });
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
