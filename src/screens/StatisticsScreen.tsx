import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppColor } from '../constants/AppConstant';

class Statistics extends Component {
  render() {
    return (
      <Text style={{color: "#FFFFFF"}}>Statistics Screen</Text>
    )
  };
}

export default function StatisticsScreen() {
  return (
    <View style={styles.container}>
      <Statistics />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: AppColor.componentColor,
  }
});
