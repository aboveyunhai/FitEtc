import React from 'react';
import { Alert, StyleSheet, StyleProp, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Pedometer from '@JWWon/react-native-universal-pedometer';
import GoogleFit, { Scopes } from 'react-native-google-fit';

import DefaultText from '../components/AppText';
import { AppColor } from '../constants/AppConstant';
import { Circle } from 'react-native-svg';


interface RunProp {
  style?: StyleProp<{}>;
  size: number;
  dailyGoal: number;
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

  constructor(props: Readonly<any>){
    super(props);
    this.state = {
      points: 0,
      pastStepCount: 0,
      currentStepCount: 0,
    }
  }

  _subscribe = () => {
    // authentication
    GoogleFit.authorize(runOptions)
    .then(authResult => {
      if(authResult.success) {
        const options = {
          startDate: "2017-01-01T00:00:17.971Z", // required ISO8601Timestamp
          endDate: new Date().toISOString() // required ISO8601Timestamp
        };

        GoogleFit.startRecording( (callback)=> {
          console.log(callback);
           // Process data from Google Fit Recording API (no google fit app needed)
         });


        setInterval( () => {
        GoogleFit.getDailyStepCountSamples(options)
         .then((res) => {
             console.log('Daily steps >>> ', res.map( data => data.steps ));
         })
         .catch((err) => {console.warn(err)})
       }, 10000);

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
  }

  componentDidMount() {
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
          renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="8" fill={AppColor.highlightBlue} />}
          fill={fill}
          tintColor={AppColor.highlightBlueD}
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

export default connect(mapStateToProps, null)(RunCircle);

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
