import { Dimensions } from 'react-native';

// Color
const tintColor = '#58afef';
const baseColor = "#21252b"
const componentColor = "#282c34";
const opa80 = 'CC', opa60 = '99', opa40 = '66', opa20 = '33';
const highlightBlue = '#58afef';
const highlightBlGr = '#56b6c2';
const highlightGreen = '#73c990';
const highlightOrange = '#e5c07b';
const highlightPurple = '#c678dd';

const AppColor = {
  tintColor, baseColor, componentColor,
  opa80, opa60, opa40, opa20,
  highlightBlue, highlightBlueL: highlightBlue+opa20,
  highlightGreen, highlightOrange,
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

const AppComponentSize = {
  SCREEN_W,
  SCREEN_H,
  CIRCLE_S
}

export { AppColor, AppComponentSize };
