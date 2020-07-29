import { Dimensions } from 'react-native';

// Color
const tintColor = '#58afef';
const baseColor = "#21252b"
const baseDarkColor = "#1d2026";
const componentColor = "#282c34";
const opa80 = 'CC', opa60 = '99', opa40 = '66', opa20 = '33';
const grey = '#C4C4C4';
const highlightBlue = '#58afef';
const highlightBlGr = '#56b6c2';
const highlightGreen = '#73c990';
const highlightOrange = '#e5c07b';
const highlightPurple = '#c678dd';
const white = '#ffffff';
const shadow = '#273240';
const black = '#000000';

const AppColor = {
  tintColor, baseColor, baseDarkColor, componentColor,
  opa80, opa60, opa40, opa20,
  white,
  black,
  grey,
  shadow,
  highlightBlue,
  highlightBlueL: highlightBlue+opa20,
  highlightGreen,
  highlightOrange,
  highlightBlueD: highlightBlue+opa80,
  tabIconDefault: '#5c6366',
  tabIconSelected: tintColor,
  tabBar: '#fefefe',
  errorBackground: 'red',
  errorText: '#fff',
  warningBackground: '#EAEB5E',
  warningText: '#666804',
  noticeBackground: tintColor,
  noticeText: '#fff',
};

//component size
/* resize component to fix device screen */
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
/* circle size to short edge */
const CIRCLE_S = SCREEN_W < SCREEN_H ? SCREEN_W * 0.7 : SCREEN_H * 0.7;

const NAVI_HEADER_HEIGHT = 45;
const TABBAR_HEIGHT = 50;
const GRAPH_HEIGHT = 200;

const AppCompSize = {
  SCREEN_W,
  SCREEN_H,
  CIRCLE_S,
  NAVI_HEADER_HEIGHT,
  TABBAR_HEIGHT,
  GRAPH_HEIGHT,
}

const AppScreen = {
  MAIN: 'Main',
  HOME: 'Home',
  STATISTICS: 'Statistics',
  SETTINGS: 'Settings',
  RECENT: 'Recent',
  OVERALL: 'Overall'
}

const AppFont = {
  Oxanium: {
    regular: 'Oxanium-Regular',
    light: 'Oxanium-Light',
    extraLight: 'Oxanium-ExtraLight',
    bold: 'Oxanium-Bold'
  }
}

export { AppColor, AppCompSize, AppScreen, AppFont };
