import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ClockCircle from '../components/ClockCircle';
import RunCircle from '../components/RunCircle';
import { DailyButton } from '../components/UpdateButton';
import { AppColor } from '../constants/AppConstant';
import AppView from '../components/AppView';
import AppText from '../components/AppText';
import { AppFont } from '../constants/AppConstant';

declare var global: {HermesInternal: null | {}};
/***
* HomeScreen component
* 2.5 : 1 = main container : widget container
*/
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {
          __DEV__ && global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <AppText>
                <Text style={{ color: AppColor.white }}>Engine: Hermes</Text>
              </AppText>
            </View>
          )
      }
        <View style={{flex: 1, flexDirection: "row", justifyContent:"space-between"}}>
          <DailyButton />
          {
            <AppView style={styles.widgetContainer} >
              {({width, height}) => <ClockCircle size={ width < height? width : height }/>}
            </AppView>
          }
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
    borderWidth: 0.3,
    borderColor: AppColor.white+AppColor.opa60
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
