import React from 'react';
import { Alert, StyleSheet, StyleProp, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Defs, RadialGradient, Stop } from 'react-native-svg';

import moment from 'moment';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-community/async-storage';

import { setGoal } from '../redux/actions/ActionCreator';
import DefaultText from '../components/AppText';
import { AppColor } from '../constants/AppConstant';
import { Circle } from 'react-native-svg';

const STEP_SOURCE = "com.google.android.gms:estimated_steps";

interface RunProp {
  style?: StyleProp<{}>;
  size: number;
  dailyGoal: number;
  setGoal: (value:string) => void;
}

interface RunState {
  points: number;
  pastStepCount: any;
  currentStepCount: number;
}

const runOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_LOCATION_READ,
  ]
};

class RunCircle extends React.Component<RunProp,RunState> {
  timerID: number = 0;
  constructor(props: Readonly<any>){
    super(props);
    this.state = {
      points: 0,
      pastStepCount: 0,
      currentStepCount: 0,
    }
  }

  requestApiStep = () => {
      const today = moment();
      // const today = date.toISOString().split('T')[0];// YYYY-MM-DD format

      const dailyOptions = {
        startDate: moment(today).startOf('day'),
        endDate: moment(today).endOf('day'),
        // configs:{
        //   bucketTime: 15,
        //   bucketUnit: 'MINUTE'
        // }
      }

      GoogleFit.getDailyStepCountSamples(dailyOptions)
       .then((res:any) => {
         // result => [{"source": "com.google.android.gms:estimated_steps", "steps": [[Object]]}]
         // steps => [{"date": "currentDate", "value": number}]
         const result = res.filter( (data:any) => data.source === STEP_SOURCE);
         let res_step = 0;

         // const rawSteps = result[0].rawSteps;
         //
         // if (rawSteps.length > 0) {
         //   rawSteps.forEach( (item: any) => {
         //     console.log(parseInt(moment(item.endDate).format("HH")), 'Step: ' + item.steps);
         //   });
         // }

         if (result[0].steps.length > 0) {
           res_step = (result[0].steps)[0].value;
         }
         this.setState({
           currentStepCount: res_step,
         })
         // console.log("Details >>", res.map( (data:any) => data.steps ));

       })
       .catch((err: any) => {console.warn(err)})
  }

  _subscribe = () => {
    // authentication
    GoogleFit.authorize(runOptions)
    .then(authResult => {
      if(authResult.success) {

        GoogleFit.startRecording( callback => {
          console.log(callback);
           // Process data from Google Fit Recording API (no google fit app needed)
         }, ['step']);

         this.requestApiStep();
         this.timerID = setInterval(() => {
           this.requestApiStep();
         }, 10 * 1000);

      }else{
        Alert.alert("AUTH_DENIED", authResult.message);
      }


    })
    .catch(() => {

      Alert.alert(
        "AUTH_ERROR",
        "Click Reload button to re-authorize.",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          { text: "OK", onPress: () => this._subscribe() }
        ],
        { cancelable: false }
      );

    })
  }

  _unsubscribe = () => {
    clearInterval(this.timerID);
  }

  restoreState = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_dailyGoal');
      if(value !== null) {
        this.props.setGoal(value);
      }
    } catch(e) {
      // error reading value
    }
  }

  componentDidMount() {
    this.restoreState();
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    const fill: number = (this.state.currentStepCount /this.props.dailyGoal) * 100; // number: 0-100

    const padding = this.props.size*.1, lineWidth = 3;
    const sizeCheck = this.props.size - padding - lineWidth; // prevent negative value in Svg
    const circularSize = sizeCheck > 0 ? sizeCheck : 0;

    return (
      <View style={[styles.container, this.props.style]}>
        <AnimatedCircularProgress
          size={circularSize}
          width={4}
          padding={padding}
          backgroundWidth={3}
          dashedBackground={{ width: 3, gap: 8 }}
          backgroundColor={AppColor.highlightBlueL}
          renderCap={
            ({ center }) =>
            <>
              <Defs>
                <RadialGradient id='grad' gradientUnits="userSpaceOnUse">
                  <Stop offset={(fill/100) > 1 ? 1 : (fill/100)} stopColor={AppColor.highlightGreen} />
                  <Stop offset="1" stopColor={AppColor.highlightBlueD} />
                </RadialGradient>
              </Defs>
              <Circle cx={center.x} cy={center.y} r="8" fill="url(#grad)" />
            </>
          }
          fill={fill}
          tintColor={AppColor.highlightBlueD}
          tintColorSecondary={AppColor.highlightGreen}
          lineCap="round"
          duration={1000}
        >
          {fill =>
            <>
              <DefaultText>
                <Text style={[styles.points,{fontSize: circularSize / 6, fontFamily: 'Oxanium-Light'},]}>
                  {Math.round(this.props.dailyGoal * (fill / 100))}
                </Text>
              </DefaultText>
              <DefaultText>
                <Text style={[styles.points,{fontSize: circularSize / 18, fontFamily: 'Oxanium-ExtraLight'}]}>
                {this.props.dailyGoal}
                </Text>
              </DefaultText>
            </>
          }
        </AnimatedCircularProgress>
      </View>
    )
  }
}

/***
* connect Circle component to Redux store
*/

const mapStateToProps = (state: any) => {
  return {
    dailyGoal: parseInt(state.runReducer.dailyGoal)
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setGoal: (newGoal:string) => dispatch(setGoal(newGoal))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RunCircle);

const styles = StyleSheet.create({
  points: {
    textAlign: "center",
    alignItems: "center",
    color: AppColor.highlightBlue,
    textShadowColor: "#3d5875",
    textShadowRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
