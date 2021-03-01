/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, Text, View} from 'react-native';

import GoogleFit from 'react-native-google-fit';

import {AppColor} from '../constants/AppConstant';
import AppText from '../components/AppText';
import TabBarIcon from '../components/TabBarIcon';
import {auth} from '../redux/actions/ActionCreator';

const chartConfig = {
  backgroundGradientFrom: AppColor.highlightBlue,
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: AppColor.highlightBlue,
  backgroundGradientToOpacity: 0.1,
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  chartStyle: {
    borderRadius: 10,
    paddingTop: 10,
    // paddingRight: 20,
    // paddingLeft: 20,
    // paddingBottom: 10,
  },
};

export const disconnect = () =>
  new Promise(resolve => {
    Alert.alert('Alert', 'Disconnect from current account?', [
      {
        text: 'Cancel',
        onPress: () => {
          resolve(false);
        },
      },
      {
        text: 'OK',
        onPress: async () => {
          // need to change repo native module to make sure disconnect() is successful
          // potential issues that can cause crush
          GoogleFit.disconnect();
          return resolve(true);
        },
      },
    ]);
  });

function ListItem(props: any) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        key={Math.random()}
        style={[
          styles.listContainerStyle,
          {
            height: props.height,
          },
        ]}>
        {props.icon ? (
          <TabBarIcon
            style={styles.iconStyle}
            focused={false}
            name={props.icon}
            iconColor={AppColor.white}
            size={18}
          />
        ) : null}
        <AppText>
          <Text style={styles.listTextStyle}>{props.content}</Text>
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

export default function SettingScreen() {
  const [isConnect, setConnect] = useState(GoogleFit.isAuthorized);
  return (
    <View style={styles.container}>
      {isConnect ? (
        <ListItem
          height={50}
          content={'Disconnect'}
          icon={'disconnect'}
          onPress={async () => {
            const result = await disconnect();
            if (result) {
              setConnect(GoogleFit.isAuthorized);
            }
          }}
        />
      ) : (
        <ListItem
          height={50}
          content={'Connect'}
          icon={'adduser'}
          onPress={async () => {
            const isAuth = await auth();
            if (isAuth) setConnect(GoogleFit.isAuthorized);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: AppColor.baseColor,
  },
  listContainerStyle: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: AppColor.grey + AppColor.opa20,
    alignItems: 'center',
    alignContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  iconStyle: {
    marginRight: 10,
  },
  listTextStyle: {
    color: AppColor.grey,
    fontSize: 15,
  },
});
