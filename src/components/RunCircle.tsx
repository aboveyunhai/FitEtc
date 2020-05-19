import React from 'react';
import { StyleSheet, StyleProp, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import Pedometer from '@JWWon/react-native-universal-pedometer';
import GoogleFit, { Scopes } from 'react-native-google-fit';

import DefaultText from '../components/AppText';
import { AppColor } from '../constants/AppConstant';
import { Circle } from 'react-native-svg';


console.log(GoogleFit.checkIsAuthorized());

const MAX_POINT = 100;

interface RunProp {
  style?: StyleProp<{}>;
  size: number;
}

interface RunState {
  points: number;
  pastStepCount: any;
  currentStepCount: number;
  maxPoint: number;
}

export default class RunCircle extends React.Component<RunProp,RunState> {

  constructor(props: Readonly<any>){
    super(props);
    this.state = {
      points: 0,
      pastStepCount: 0,
      currentStepCount: 0,
      maxPoint: MAX_POINT,
    }
  }

  _subscribe = () => {
    GoogleFit.checkIsAuthorized();
    console.log(GoogleFit.isAuthorized);
  }

  _unsubscribe = () => {
  }

  setGoal = (point: number) => {
    this.setState({
      maxPoint: point,
    });
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  render() {
    const fill: number = (this.state.currentStepCount / this.state.maxPoint) * 100; // number: 0-100

    const padding = this.props.size*.1, lineWidth = 3;
    const sizeCheck = this.props.size - padding - lineWidth; // prevent negative value in Svg
    const circularSize = sizeCheck > 0 ? sizeCheck : 0;

    return (
      <View style={[styles.container, this.props.style]}>
        <AnimatedCircularProgress
          size={circularSize}
          width={2}
          padding={padding}
          backgroundWidth={3}
          dashedBackground={{ width: 3, gap: 8 }}
          backgroundColor={AppColor.highlightBlueL}
          renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="8" fill={AppColor.highlightBlue} />}
          fill={fill}
          tintColor={AppColor.highlightBlueD}
          lineCap="round"
        >
          {fill =>
            <DefaultText>
              <Text style={[styles.points,{fontSize: circularSize / 6},]}>-{Math.round(this.state.maxPoint * (fill / 100))}-</Text>
            </DefaultText>
          }
        </AnimatedCircularProgress>
      </View>
    )
  }
}

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
