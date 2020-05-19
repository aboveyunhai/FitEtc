import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppColor } from '../constants/AppConstant';


export default function SettingScreen() {
  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: AppColor.componentColor,
  }
});
