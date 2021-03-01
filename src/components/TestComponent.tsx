import React, { useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import GoogleFit, { Scopes, DateValueResponse } from 'react-native-google-fit';
import { auth } from '../redux/actions/ActionCreator';
import moment from 'moment';

const TestComponent = () => {

  async function onPress(func: any): Promise<void> {
    const isAuth = await auth();

    const printData = ((error: boolean, data: DateValueResponse[]) => {
      console.log(error, data);
    });

    const options = {
      startDate: moment().startOf('week').toISOString(),
      endDate: moment().endOf('week').toISOString()
    }

    if(isAuth) {
      func(options, printData);
    }
  }

  return (
    <View>
      <Text>Test Component</Text>
      <Button onPress={() => onPress(GoogleFit.getBloodPressureSamples)} title="Blood Function"/>
      <Button onPress={() => onPress(GoogleFit.getHeartRateSamples)} title="Heart Function"/>
    </View>
  )
}

export default TestComponent;
