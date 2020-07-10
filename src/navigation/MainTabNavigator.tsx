import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingScreen from '../screens/SettingScreen';
import { ReloadButton } from '../components/UpdateButton';
import { AppColor } from '../constants/AppConstant';
import TabBarIcon from '../components/TabBarIcon';


import { connect } from 'react-redux';
import { reloadWeekly, reloadMonthly }from '../redux/actions/ActionCreator';

type tabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
}

function LoadingScreen() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: AppColor.baseColor,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size="large" color={AppColor.white}/>
    </View>
  )
}

const tabConfig = {
    lazy: true,
    lazyPlaceholder: LoadingScreen,
    tabBarOptions: {
      // showIcon: false,
      // showLabel: false,
      // activeBackgroundColor: AppColor.highlightBlueL,
      labelStyle: {
        fontWeight: "bold" as const,
      },
      style: {
        backgroundColor: AppColor.baseDarkColor,
        borderTopWidth: 0.01,
      },
      activeTintColor: AppColor.tabIconSelected,
      inactiveTintColor: AppColor.tabIconDefault
    }
};

const MainStackOptions =  {
  headerStyle: {
    height: 45,
    backgroundColor: AppColor.baseColor,
    borderBottomWidth: 0.2,
    borderColor: AppColor.highlightBlue,
  },
  headerTitleStyle: {
    // fontWeight: 'bold'
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

function MainTabs({ navigation, route, reloadWeekly, reloadMonthly } :any) {
  const routeName = route.state
  ? route.state.routes[route.state.index].name
  : route.params?.screen || 'Home';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(routeName),
      headerRight: setHeaderRight(routeName),
    });

    // note that this will trig all nested items rerender
    // without explicted state check in componentwillupdate
    if(routeName === 'Statistics') {
      reloadWeekly();
      reloadMonthly();
    }

  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={ ({ navigation, route }) => ({
        tabBarIcon: ({ focused, color, size } : tabBarIconProps) => {
          let iconName;

          if(route.name === 'Home') {
            iconName = (Platform.OS === 'ios') ? 'rocket1' : 'rocket1';
          }else if (route.name === "Statistics") {
            iconName = (Platform.OS === 'ios') ?  'piechart' : 'piechart';
          }else if (route.name === 'Setting') {
            iconName = (Platform.OS === 'ios') ? 'setting' : 'setting';
          }

          return (
            <TabBarIcon focused={focused} name={iconName} size={26} />
          )
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

const mapReloadToProps = (dispatch: any) => {
  return {
    reloadWeekly: () => dispatch(reloadWeekly()),
    reloadMonthly: () => dispatch(reloadMonthly())
  }
}

const MainTabsConnect = connect(null, mapReloadToProps)(MainTabs);

const MainStack = createStackNavigator();

export default function MainTabNavigator() {
  return (
    <MainStack.Navigator screenOptions={MainStackOptions}>
      <MainStack.Screen name="Main" component={MainTabsConnect} />
    </MainStack.Navigator>
  );
}
