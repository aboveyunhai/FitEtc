import React from 'react';
import { StyleSheet, StyleProp, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Defs, RadialGradient, Stop } from 'react-native-svg';

import moment from 'moment';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AsyncStorage from '@react-native-community/async-storage';
import { Circle } from 'react-native-svg';

import { setGoal, loadDaily } from '../redux/actions/ActionCreator';
import DefaultText from '../components/AppText';
import { AppColor, AppFont } from '../constants/AppConstant';
import { DailyProps } from '../screens/StatisticsScreen/RecentScreen';
import { isArrayEqual, sum } from '../constants/HelperFunction';

interface RunProp {
  style?: StyleProp<{}>;
  size: number;
  dailyGoal: number;
  setGoal: (value:string) => void;
  daily: DailyProps;
  loadDaily: () => Promise<void>;
}

interface RunState {
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
  constructor(props: RunProp){
    super(props);
    this.state = {
      currentStepCount: 0,
    }
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
    // init
    this.props.loadDaily();

    this.timerID = setInterval(() => {
      this.props.loadDaily();
    }, 30 * 1000);
  }

  shouldComponentUpdate(nextProps: RunProp, nextState: RunState) {
    if(nextProps.size !== this.props.size) {
      console.log("RunCircleDynamicSize_update");
      return true;
    }

    if(nextProps.dailyGoal !== this.props.dailyGoal) return true;
    if(!isArrayEqual(this.props.daily.data, nextProps.daily.data)) return true;

    return false;
  }

  componentWillUnmount() {
    this._unsubscribe();
    GoogleFit.unsubscribeListeners();
  }

  render() {
    const fill: number = (sum(this.props.daily.data) /this.props.dailyGoal) * 100; // number: 0-100

    const padding = this.props.size*.1, lineWidth = 3;
    const sizeCheck = this.props.size - padding - lineWidth; // prevent negative value in Svg
    const circularSize = sizeCheck > 0 ? sizeCheck : 0;

    let mostActiveHour = 0;
    let mostActiveHourStep = 0;

    this.props.daily.data.forEach( (item: any, index) => {
      if(mostActiveHourStep < item) {
        // console.log(parseInt(moment(item.endDate).format("HH")), 'Step: ' + item.steps);
        mostActiveHourStep = item;
        mostActiveHour = parseInt(moment.utc(index*3600*1000).format("HH"));
      }
    });


    return (
      <>
        <View style={styles.trivia}>
          <DefaultText>
            <Text style={{
              color: AppColor.highlightGreen,
              fontSize: circularSize / 20,
              fontFamily: AppFont.Oxanium.extraLight
            }}>
              Highlight: {'\n'}
              <Text style={{fontSize: circularSize / 22}}>
                Most Active Hour:
                {
                  (mostActiveHourStep > 0)
                  ? <Text style={{fontSize: circularSize / 23}}> { mostActiveHour }:00 - { mostActiveHour + 1 }:00</Text>
                  : <Text style={{fontSize: circularSize / 23}}> no move yet</Text>
                }
                {'\n'}
                Active Hour Steps: {mostActiveHourStep}
              </Text>
            </Text>
          </DefaultText>
        </View>
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
                  <Text style={[styles.points, {fontSize: circularSize / 6}]}>
                    {Math.round(this.props.dailyGoal * (fill / 100))}
                  </Text>
                </DefaultText>
                <DefaultText>
                  <Text style={[styles.points, {fontSize: circularSize / 18, fontFamily: AppFont.Oxanium.light}]}>
                  {this.props.dailyGoal}
                  </Text>
                </DefaultText>
              </>
            }
          </AnimatedCircularProgress>
        </View>
      </>
    )
  }
}

/***
* connect Circle component to Redux store
*/

const mapStateToProps = (state: any) => {
  return {
    dailyGoal: parseInt(state.runReducer.dailyGoal),
    daily: state.stepDailyReducer.daily,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setGoal: (newGoal:string) => dispatch(setGoal(newGoal)),
    loadDaily: () => dispatch(loadDaily()),
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
  trivia: {
    flex: 1,
    position: 'absolute',
    zIndex:1,
    padding: 5,
    width:'100%',
    height: '100%'
  }
});
