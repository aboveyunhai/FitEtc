import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ClockCircle from '../components/ClockCircle';
import RunCircle from '../components/RunCircle';
import { DailyButton } from '../components/UpdateButton';
import { AppColor } from '../constants/AppConstant';
import AppView from '../components/AppView';

declare var global: {HermesInternal: null | {}};
/***
* HomeScreen component
*/
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {
          __DEV__ && global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={{ color: "#ffffff"}}>Engine: Hermes</Text>
            </View>
          )
      }
        <View style={{flex: 1, flexDirection: "row", justifyContent:"space-between"}}>
          <DailyButton />
          <AppView style={styles.widgetContainer} >
            {({width, height}) => <ClockCircle size={ width < height? width : height }/>}
          </AppView>
        </View>
      {
        <AppView style={styles.mainContainer}>
          { ({width, height}) => <RunCircle size={ width < height? width : height }/> }
        </AppView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: AppColor.baseColor,
  },
  mainContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: .5,
    borderColor: "#ffffff"
  },
  widgetContainer: {
    flex: 1,
    // borderWidth: 1, borderColor: "white"
  },
  engine: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});
