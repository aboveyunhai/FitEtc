import React from 'react';
import { StyleSheet, StyleProp, Text, View } from 'react-native';
import { Circle, Defs, RadialGradient, Stop, Svg } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import DefaultText from '../components/AppText';
import { AppColor } from '../constants/AppConstant';

const MAX_SEC = 60;
const GOLDEN_RATIO = (1+Math.sqrt(5))/2; //1.6...

// const ClockNum =  function(props) {
//   const digits = convertTimeToTwoDigits(props.digit);
//   const digitDisplay = digits.split('').map((value) =>
//     <View style={{flex: 1}}>
//       <DefaultText style={props.style}>{ value }</DefaultText>
//     </View>
//   );
//   return (<View style={{flex: digits.length, flexDirection:'row'}}>{ digitDisplay }</View>);
// }


/*
  react-native has its own limitation on text spacing
  so each digit of clock is contained by <View></View> individually
*/

interface NumProp {
    hour: number;
    minute: number;
    second: number;
}

const ClockNumDisplay = (props: ClockProp & NumProp ) => {
  return (
    <View style={{ flexDirection:"row", height: props.size, width: props.size * GOLDEN_RATIO}}>
      <View style={styles.textContainer}><DefaultText style={[styles.textHour, resizeFont(props.size)]}>{convertTimeToTwoDigits(props.hour).charAt(0)}</DefaultText></View>
      <View style={styles.textContainer}><DefaultText style={[styles.textHour, resizeFont(props.size)]}>{convertTimeToTwoDigits(props.hour).charAt(1)}</DefaultText></View>
      <View style={{flex: 1, flexDirection:'column'}}>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.textContainer}><DefaultText style={[styles.textMin, resizeFont(props.size/2)]}>{convertTimeToTwoDigits(props.minute).charAt(0)}</DefaultText></View>
          <View style={styles.textContainer}><DefaultText style={[styles.textMin, resizeFont(props.size/2)]}>{convertTimeToTwoDigits(props.minute).charAt(1)}</DefaultText></View>
        </View>
        <View style={{flex:1}}><DefaultText style={[styles.textSec, resizeFont(props.size/4)]}>{convertTimeToTwoDigits(props.second)}</DefaultText></View>
      </View>
    </View>
  )
};

function resizeFont(size:number) : { [key:string]: string|number|boolean } {
  return { fontSize: size*.9, lineHeight: size, textAlignVertical:'center' };
}

function convertTimeToTwoDigits(time:number) : string {
  return ("0" + time).slice(-2);
}

interface ClockState {
  date: Date;
}

interface ClockProp {
  style?: StyleProp<{}>;
  size: number;
}

export default class ClockCircle extends React.Component<ClockProp, ClockState>
{
  timerID!: number;
  // myRef: React.RefObject<unknown>;
  //
  constructor(props: Readonly<ClockProp>) {
    super(props);
    // this.myRef = React.createRef();
    this.state = { date: new Date(),  };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    const currentDate = this.state.date;
    const fill = ( currentDate.getSeconds() / MAX_SEC ) * 100;

    const padding = this.props.size*.05, lineWidth = 2;
    const sizeCheck = this.props.size - padding - lineWidth; // prevent negative value in Svg
    const circularSize = sizeCheck > 0 ? sizeCheck : 0;

    const clockNumDisplaySize = (circularSize)/Math.SQRT2 /GOLDEN_RATIO; //Inner panel Font Height

    return (
      <View style={[ styles.container , this.props.style ]}>
        <AnimatedCircularProgress
          rotation={0} //start point
          size={ circularSize }
          width={3}
          tintColor={AppColor.componentColor}
          backgroundWidth={3}
          backgroundColor={AppColor.highlightGreen + AppColor.opa80}
          dashedBackground={{width: 3, gap:10}}
          fill={fill}
          padding={padding}
          lineCap={"round"}
          // tintTransparency={false}
          // skipAnimOnComplete={true}
          renderCap={ ({ center }) =>
            <Svg>
              <Defs>
                <RadialGradient id="grad">
                  <Stop offset="0" stopColor={AppColor.highlightOrange} stopOpacity="1" />
                  <Stop offset="1" stopColor={AppColor.highlightOrange} stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Circle cx={center.x} cy={center.y} r="6" fill="url(#grad)" />
            </Svg> }
          >
          { () => <ClockNumDisplay
              style={ styles.textContainer }
              size={ clockNumDisplaySize }
              hour={currentDate.getHours()}
              minute={currentDate.getMinutes()}
              second={currentDate.getSeconds()} />}
          </AnimatedCircularProgress>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHour: {
    color: AppColor.highlightBlue,
    fontFamily: 'Oxanium-ExtraLight',
  },
  textMin: {
    color: AppColor.highlightOrange,
    fontFamily: 'Oxanium-Light',
  },
  textSec: {
    color: AppColor.highlightGreen,
    fontFamily: 'Oxanium-Bold',
  }
});
