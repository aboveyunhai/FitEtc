import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ClockCircle from '../components/ClockCircle';
import RunCircle from '../components/RunCircle';
import { AppColor } from '../constants/AppConstant';
import DefaultView from '../components/AppView';

declare var global: {HermesInternal: null | {}};

export default function HomeScreen() {
  return (
    <View style={styles.container}>

          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={{ color: "#ffffff"}}>Engine: Hermes</Text>
            </View>
          )}

        <DefaultView style={[styles.widgetContainer, {flexDirection: 'row-reverse'}]} >
          {({width, height}) => <ClockCircle size={ width < height? width : height }/>}
        </DefaultView>
      {
        <DefaultView style={styles.mainContainer}>
          { ({width, height}) => <RunCircle size={ width < height? width : height }/> }
        </DefaultView>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: AppColor.componentColor,
  },
  mainContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, borderColor: "white"
  },
  widgetContainer: {
    flex: 1,
    // borderWidth: 1, borderColor: "white"
  },

  engine: {
    position: 'absolute',
    right: 0,
  },
});
