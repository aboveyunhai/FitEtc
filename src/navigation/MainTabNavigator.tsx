import React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingScreen from '../screens/SettingScreen';
import { ReloadButton, reloadRecent } from '../components/UpdateButton';
import { AppColor, AppScreen, AppCompSize, AppFont } from '../constants/AppConstant';
import TabBarIcon from '../components/TabBarIcon';

import { connect } from 'react-redux';
import * as actionTypes from '../redux/actions/actionTypes';
import { loadDaily, loadWeekly, loadMonthly, loadData }from '../redux/actions/ActionCreator';

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
    tabBarOptions: {
      // showIcon: false,
      // showLabel: false,
      // activeBackgroundColor: AppColor.highlightBlueL,
      labelStyle: {
        // fontWeight: "bold" as const,
        fontFamily: AppFont.Oxanium.light
      },
      style: {
        height: AppCompSize.TABBAR_HEIGHT,
        backgroundColor: AppColor.baseDarkColor,
        borderTopWidth: 0.01,
        elevation: 0, // android only
      },
      activeTintColor: AppColor.tabIconSelected,
      inactiveTintColor: AppColor.tabIconDefault
    }
};

const MainStackOptions =  {
  headerStyle: {
    height: AppCompSize.NAVI_HEADER_HEIGHT,
    backgroundColor: AppColor.baseDarkColor,
    borderBottomWidth: 0.1,
    borderColor: AppColor.grey,
    elevation: 0, // android only
  },
  headerTitleStyle: {
    // fontWeight: 'bold'
    fontFamily: AppFont.Oxanium.bold
  },
  headerTintColor: AppColor.white,
};

const Tab = createBottomTabNavigator();

function getHeaderTitle(routeName: string) {
  switch (routeName) {
    case AppScreen.HOME: return AppScreen.HOME;
    case AppScreen.STATISTICS: return AppScreen.STATISTICS;
    case AppScreen.SETTINGS: return AppScreen.SETTINGS;
  }
}

const RButton = <ReloadButton />;

function setHeaderRight(routeName: string) {
  switch (routeName) {
    case AppScreen.HOME: return;
    case AppScreen.STATISTICS: return () => RButton;
    case AppScreen.SETTINGS: return;
  }
}

function MainTabs({ navigation, route, ...otherProps } :any) {
  const routeName = route.state
  ? route.state.routes[route.state.index].name
  : route.params?.screen || AppScreen.HOME;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(routeName),
      headerRight: setHeaderRight(routeName),
    });

  }, [navigation, route]);

  return (
    <Tab.Navigator
      screenOptions={ ({ navigation, route }) => ({
        tabBarIcon: ({ focused, color, size } : tabBarIconProps) => {
          let iconName='alert-box-outline';

          if(route.name === AppScreen.HOME) {
            iconName = (Platform.OS === 'ios') ? 'shoe-print' : 'shoe-print';
          }else if (route.name === "Statistics") {
            iconName = (Platform.OS === 'ios') ?  'chart-donut-variant' : 'chart-donut-variant';
          }else if (route.name === 'Settings') {
            iconName = (Platform.OS === 'ios') ? 'account-circle-outline' : 'account-circle-outline';
          }

          return (
            <TabBarIcon style={{marginBottom: -3}}type={"MaterialCommunity"} focused={focused} name={iconName} size={26} />
          )
        },
      })}
      {...tabConfig}
    >
      <Tab.Screen name={AppScreen.HOME} component={HomeScreen}/>
      <Tab.Screen name={AppScreen.STATISTICS} component={StatisticsScreen}
        listeners={({navigation, route}) => ({
          // note that this will trig all nested items rerender
          // without explicted state check in child components
          tabLongPress: e => {
            console.log('longPress');
            reloadRecent(otherProps);
          }
        })}
      />
      <Tab.Screen name={AppScreen.SETTINGS} component={SettingScreen}/>
    </Tab.Navigator>
  );
}

const mapReloadToProps = (dispatch: any) => {
  return {
    reload: () => {
      dispatch({  type: actionTypes.LOAD_FIT_DAY_START });
      dispatch(loadDaily());
      dispatch({  type: actionTypes.LOAD_FIT_WEEK_START });
      dispatch(loadWeekly());
      dispatch({  type: actionTypes.LOAD_FIT_MONTH_START });
      dispatch(loadMonthly());
    },
    loadData: (startDate:Date, endDate:Date) => {
      dispatch({ type: actionTypes.LOAD_FIT_DATA_START });
      dispatch(loadData(startDate, endDate));
    }
  }
}

const MainTabsConnect = connect(null, mapReloadToProps)(MainTabs);

const MainStack = createStackNavigator();

export default function MainTabNavigator() {
  return (
    <MainStack.Navigator screenOptions={MainStackOptions}>
      <MainStack.Screen name={AppScreen.MAIN} component={MainTabsConnect} />
    </MainStack.Navigator>
  );
}
