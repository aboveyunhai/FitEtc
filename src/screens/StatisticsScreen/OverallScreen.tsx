import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Easing,
  Platform,
  Text,
  PanResponder
} from 'react-native';

import Button from 'react-native-button';
import GoogleFit from 'react-native-google-fit';
import { LineChart } from 'react-native-chart-kit';
import Carousel from 'react-native-snap-carousel';
import Svg, { Text as SvgText, Line, Path, G } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { AppColor, AppCompSize, AppFont } from '../../constants/AppConstant';
import { HeaderTag } from '../../components/HeaderTag';
import TabBarIcon from '../../components/TabBarIcon';
import { connect } from 'react-redux';
import * as actionTypes from '../../redux/actions/actionTypes';
import { loadData } from '../../redux/actions/ActionCreator';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import HelperFunction, { piePath } from '../../constants/HelperFunction';

const GRAPH_HEIGHT = 220;
const TICKBOX_HEIGHT = 30;
const OFFSET = 6;
const SEGMENT = AppCompSize.SCREEN_W/4;
const INNERTICK_COUNT= 5;
const BOTTOMMENU_HEIGHT = 126;
const TOGGLE_HEIGHT = 30;
const BOTTOMMENU_MAIN = BOTTOMMENU_HEIGHT - TOGGLE_HEIGHT - 1;
const SQUARE_SIZE = AppCompSize.SCREEN_W/2;

interface MyProps {
  summary: any,
  loadData: (startDate: Date, endDate: Date) => void;
}

const mapStateToProps = (state: any) => {
  return {
    summary: state.stepReducer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadData: (startDate:Date, endDate:Date) => {
      dispatch({  type: actionTypes.LOAD_FIT_DATA_START });
      dispatch(loadData(startDate, endDate))
    }
  }
}

const chartBackground = {
  backgroundGradientFrom: AppColor.highlightBlueL,
  backgroundGradientFromOpacity: 0.05,
  backgroundGradientTo: AppColor.highlightBlueL,
  backgroundGradientToOpacity: 0.05,
}

const chartConfig = {
  ...chartBackground,
  decimalPlaces: 1, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => AppColor.highlightGreen,
  propsForLabels: {
    fontFamily: AppFont.Oxanium.light,
  },
  chartStyle: {
    paddingTop: 10,
    paddingRight: 30,
  },
  gutterTop: 30,
  scrollableDotFill: AppColor.white,
  scrollableDotRadius: 4,
  scrollableDotStrokeColor: AppColor.highlightBlue,
  scrollableDotStrokeWidth: 3,
  scrollableInfoViewStyle: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: AppColor.black+AppColor.opa80,
    borderRadius: 3
  },
  scrollableInfoTextStyle: {
    color: AppColor.grey,
    textAlign: "center",
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: AppFont.Oxanium.light
  },

  scrollableInfoSize: { width: 65, height: 30 },
  scrollableInfoOffset: -40
}

const Tick = [
  {
    id: 0,
    title: '1d'
  },
  {
    id: 1,
    title: '1w'
  },
  {
    id: 2,
    title: '1m'
  },
  {
    id: 3,
    title: '1y'
  }
];

const _renderInnerTick = (index: number) => {
  return (
    <Svg key={index}>
      <Line
        x1={(index+1)*SEGMENT/(INNERTICK_COUNT+1)}
        y1={0}
        x2={(index+1)*SEGMENT/(INNERTICK_COUNT+1)}
        y2={TICKBOX_HEIGHT/2-OFFSET*1.7}
        stroke={AppColor.grey}
        strokeWidth={0.5}
      />
      <Line
        x1={(index+1)*SEGMENT/(INNERTICK_COUNT+1)}
        y1={TICKBOX_HEIGHT/2+OFFSET*1.7}
        x2={(index+1)*SEGMENT/(INNERTICK_COUNT+1) }
        y2={TICKBOX_HEIGHT}
        stroke={AppColor.grey}
        strokeWidth={0.5}
      />
    </Svg>
  )
}

const TickBox = ( { title } : { title:string } ) => (
  <View style={[styles.tickContainer, styles.center]}>
    <Svg height={30} width={SEGMENT}>
      <Line
        x1={0}
        y1={0}
        x2={0}
        y2={TICKBOX_HEIGHT/2-OFFSET}
        stroke={AppColor.white}
        strokeWidth={1}
      />
      <Line
        x1={0}
        y1={TICKBOX_HEIGHT/2+OFFSET}
        x2={0}
        y2={TICKBOX_HEIGHT}
        stroke={AppColor.white}
        strokeWidth={1}
      />
      {
        Array.from({length: INNERTICK_COUNT}, (v, i) => _renderInnerTick(i))
      }
      <SvgText
        x={SEGMENT/2}
        y={TICKBOX_HEIGHT/2}
        alignmentBaseline="central"
        textAnchor='middle'
        fill={AppColor.white}
        {...styles.text}
      >
        {title}
      </SvgText>
    </Svg>
  </View>
)

const DateButton = (props: any) => {
  return (
    <View style={[styles.pickerContainer, styles.center]}>
      <Button
        style={styles.picker}
        onPress={props.onPress}
      >
        { props.date }
      </Button>
    </View>
  )
}

const DateBox = (props: MyProps) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [id, setId] = useState(1);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState(false);

  const onPress = (id: number) => {
    setId(id);
    switch(id) {
      case 1: setDate(startDate); break;
      case 2: setDate(endDate); break;
    }
    setShow(true);
  }

  const onChange = (event: any, selectedDate: any) => {
    setShow(false);
    const currentDate = selectedDate;
    if(currentDate) {
      switch(id) {
        case 1: setStartDate(currentDate); break;
        case 2: setEndDate(currentDate); break;
      }
    }
  };

  const onPressIn = () => {
    setActive(true);
    props.loadData(startDate, endDate)
  }

  const onPressOut = () => {
    setActive(false);
  }

  return (
    <>
      <DateButton onPress={()=>onPress(1)} date={moment(startDate).format('L')}/>
      <View style={[styles.arrow, styles.center]}>
        <TabBarIcon focused={false} name={'arrowright'} size={20} color={AppColor.grey} />
      </View>
      <DateButton onPress={()=>onPress(2)} date={moment(endDate).format('L')}/>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      <View style={[styles.confirm]}>
        <Button
          style={[styles.confirmButton, styles.center, styles.text,
            {
              backgroundColor: active? AppColor.highlightGreen+AppColor.opa80 : AppColor.baseColor,
              color: active? AppColor.baseDarkColor : AppColor.highlightGreen
            }
          ]}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          VIEW
        </Button>
      </View>
    </>
  );
}

const BottomMenu = (props: any) => {
  let _carousel: Carousel<{ id: number; title: string; }> | null = null;
  const [activeTick, shiftTick] = useState(0);

  const eventOnTickChange = (index: number) => {
    const today = moment();
    switch(index){
      case 0: props.loadData(today,today);return;
      case 1: props.loadData(moment(today).startOf('week'), today);return;
      case 2: props.loadData(moment(today).startOf('month'), today);return;
      case 3: props.loadData(moment(today).startOf('year'), today);return;
      default:
    }
  }

  const tickChange = (index: number) => {
    shiftTick(index);
    eventOnTickChange(index);
  }

  return(
    <Animated.View
      style={[
        styles.bottomContainer,
        {
          transform: [{
            translateY: props.panValue.y.interpolate({
              inputRange: [-AppCompSize.SCREEN_H, 0, BOTTOMMENU_MAIN, AppCompSize.SCREEN_H],
              outputRange: [0, 0, BOTTOMMENU_MAIN, BOTTOMMENU_MAIN],
            })
          }]
        }
        //reserve for clicking action
        // {
        //   transform: [{
        //     translateY: props.toggleVal.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [0, 100]
        //     })
        //   }]
        // }
      ]}
    >
      <View
        style={styles.toggleContainer}
        {...props.panResponder.panHandlers}
      >
        <Animated.View
          style={{
            transform:[{
              rotate: props.panValue.y.interpolate({
                inputRange: [-AppCompSize.SCREEN_H, 0, BOTTOMMENU_MAIN, AppCompSize.SCREEN_H],
                outputRange: ['0deg', '0deg', '180deg', '180deg']
              })
            }]
          }}
        >
          <TabBarIcon type={'MaterialCommunity'} size={24} name={'drag-horizontal'} color={AppColor.grey}/>
        </Animated.View>
      </View>
      <View style={styles.dateBoxContainer}>
        <DateBox {...props} />
      </View>
      <View style={styles.carouselContainer}>
        {/*** middle red bar ***/}
        <View style={{
            opacity: 0.8,
            height:30,
            borderWidth: 1,
            borderColor: 'red',
            position: 'absolute',
            right: "50%",
          }}>
        </View>
        <View>
          <Carousel
            ref={ref => { _carousel = ref; }}
            data={Tick}
            firstItem={activeTick}
            renderItem={props.renderItem}
            sliderWidth={AppCompSize.SCREEN_W}
            itemWidth={SEGMENT}
            loop={true}
            loopClonesPerSide={3}
            onSnapToItem={(index) => tickChange(index)}
            inactiveSlideScale={1}
          />
        </View>
      </View>
    </Animated.View>
  )
}

const BottomMenuConnected = connect(null, mapDispatchToProps)(BottomMenu);

function setValueBoundary(input : Animated.Value, upperBound = 100, lowerBound = 0) {
    var output = input;
    if(output._value > upperBound) {
      return upperBound;
    };
    if(output._value < lowerBound){
      return lowerBound;
    };
    return output._value;
}

export class Analysis extends React.Component<MyProps> {
  enablePan = true;
  pan = new Animated.ValueXY({x:0, y:100});
  Ypos = this.pan.y._value;

  //reserve for clicking action
  // toggleVal = new Animated.Value(1);
  // toggle = false;
  // toggleAnim = () => {
  //   const toValue = this.toggle? 1 : 0;
  //   this.toggle = !this.toggle
  //   Animated.timing(this.toggleVal, {
  //     toValue: toValue,
  //     duration: 300,
  //     easing: Easing.ease,
  //     useNativeDriver: true,
  //   }).start();
  // }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => this.enablePan,
    onPanResponderGrant: (evt, gestureState) => {
      if(this.enablePan){
        this.pan.setOffset(this.pan.__getValue());
        this.pan.setValue({x: 0, y: 0});
      }
    },

    onPanResponderMove: Animated.event([
      null,
      {
        // dx: this.pan.x,
        dy: this.pan.y
      }
    ],
    {useNativeDriver: false}
    ),
    onPanResponderRelease: () => {
      // may change to third party swiper for easier implement
      // instead of some hacky way here
      this.enablePan = false;
      this.pan.flattenOffset();
      let temp = setValueBoundary(this.pan.y);
      this.pan.setValue({x: 0, y: temp});
      Animated.spring(this.pan, {
        toValue: {
          x: 0,
          y: this.Ypos<this.pan.y._value ? BOTTOMMENU_MAIN : 0
        },
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
        useNativeDriver: true,
      }).start(()=>{
        this.Ypos= this.Ypos<this.pan.y._value ? BOTTOMMENU_MAIN : 0;
        this.pan.setValue({x: 0, y: this.Ypos });
        this.enablePan = true;
      });
    }
  })

  state = {
    data: [],
  }

  componentDidMount = () => {
    this.props.loadData(new Date(), new Date());
    // console.log(this.props.summary.overall.data)
  }

  componentWillUnmount = () =>{
    GoogleFit.unsubscribeListeners();
  }

  componentDidUpdate = () => {
  }

  // shouldComponentUpdate = (nextProps, nextState: any) => {
  //   if(this.state.startDate !== nextState.toggle) return true;
  //   return false;
  // }

  _renderItem = ({ item }: any) => (
    <TickBox title={item.title} />
  )

  render() {
    const pieDiameter = SQUARE_SIZE/2 * 0.6;
    const padding = SQUARE_SIZE/2 - pieDiameter;
    let activeTime = this.props.summary.overall.activeTime;
    let inactiveTime = this.props.summary.overall.inactiveTime;
    const totalTime = this.props.summary.overall.totalTime;
    activeTime = activeTime/totalTime === 1 ? 0.999999 : activeTime/totalTime;
    inactiveTime = inactiveTime/totalTime === 1 ? 0.999999 : inactiveTime/totalTime;

    return (
      <View style={styles.container}>
        <HeaderTag tagLabel={'S'} tagContent={"Summary"}/>
        <View style={[styles.rowContainer, { height: 30,  marginTop: 5 }]}>
          <View><Text style={[styles.text,{color: AppColor.white}]}>
            <Text style={{color: AppColor.highlightBlue}}>From: </Text>
            {this.props.summary.overall.startDate.format('L')}
          </Text></View>
          <View><Text style={[styles.text,{color: AppColor.white}]}>
            <Text style={{color: AppColor.highlightBlue}}>To: </Text>
            <Text>{this.props.summary.overall.endDate.format('L')}</Text>
          </Text></View>
        </View>
        <BottomMenuConnected
          // toggleVal={this.toggleVal}
          // toggleAnim={this.toggleAnim}
          renderItem={this._renderItem}
          panValue={this.pan}
          panResponder={this.panResponder}
          {...this.props}
        />
        <ScrollView
          style={{marginBottom: TOGGLE_HEIGHT+1}}
        >
          <View style={styles.chartContainer}>
          {
            (this.props.summary.isLoading === true)
            ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
            :<LineChart
              data={{
                 labels: [],
                 datasets: [
                   {
                     data: this.props.summary.overall.data
                   }
                 ]
               }}
              width={AppCompSize.SCREEN_W*0.9} // from react-native
              height={GRAPH_HEIGHT}
              withInnerLines={true}
              withDots={false}
              withShadow={false}
              withScrollableDot={true}
              yAxisInterval={1} // optional, defaults to 1
              bezier={true}
              chartConfig={chartConfig}
              innerLines={6}
              defMin={0}
              defMax={1000}
           />
         }
          </View>
          <View style={styles.rowContainer}>
            <View style={[styles.square, styles.center]}>
              <Text style={[styles.text, {color: AppColor.highlightBlue, fontSize: 22}]}>Speed</Text>
              {
                (this.props.summary.isLoading === true)
                ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
                : <AnimatedCircularProgress
                    duration={1000}
                    size={SQUARE_SIZE*0.8}
                    fill={this.props.summary.overall.speed/5000}
                    // prefill={50}
                    backgroundWidth={3}
                    dashedBackground={{ width: 3, gap: 8 }}
                    backgroundColor={AppColor.highlightBlueL}
                    padding={10}
                    width={8}
                    rotation={0}
                    tintColor={AppColor.highlightBlueD}
                    tintColorSecondary={AppColor.highlightGreen}
                    lineCap="round"
                    children={(value: number) => {return(
                      <>
                        <Text style={[styles.text, {color: AppColor.highlightBlue, fontSize: 25}]}>
                          {this.props.summary.overall.speed.toFixed(0)}/{this.props.summary.overall.unit}
                        </Text>
                        <Text style={[styles.text, {color: AppColor.highlightBlue, fontSize: 13}]}>
                          5000
                        </Text>
                      </>
                    )}}
                    />
              }
            </View>
            <View style={[styles.square, styles.center]}>
            {
              (this.props.summary.isLoading === true)
              ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
              : <Svg>
                  { (inactiveTime>0)?
                    <G x={padding*3/2} y={padding*3/2} rotation={activeTime*360} origin={pieDiameter}>
                      <Path
                        d={piePath(pieDiameter, inactiveTime*100)}
                        stroke={AppColor.highlightBlue}
                        // fill={AppColor.highlightBlue}
                        strokeWidth={1}
                        strokeDasharray={10}
                      />
                    </G>
                    :null
                  }
                  { (activeTime>0)?
                    <G x={padding*3/2} y={padding*3/2}>
                      <Path
                        d={piePath(pieDiameter, activeTime*100)}
                        stroke={AppColor.highlightGreen}
                        // fill={AppColor.highlightGreen}
                        strokeWidth={1}
                        // strokeDasharray={10}
                      />
                    </G>
                    :null
                  }
                  <G>
                  <SvgText fill={AppColor.highlightGreen} x={10} y={20} fontSize={14}>
                    Active: { this.props.summary.overall.activeTime }{this.props.summary.overall.unit}
                    {' '}({((this.props.summary.overall.activeTime/(this.props.summary.overall.totalTime||1))*100).toFixed(1)}%)
                  </SvgText>
                  <SvgText fill={AppColor.highlightBlue}  x={10} y={40} fontSize={14}>
                   Inactive: { this.props.summary.overall.inactiveTime }{this.props.summary.overall.unit}
                   {' '}({((this.props.summary.overall.inactiveTime/(this.props.summary.overall.totalTime||1))*100).toFixed(1)}%)
                  </SvgText>
                  </G>
                </Svg>
            }
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.square}>
              <Text style={[styles.text, {color: AppColor.highlightBlue, fontSize: 22, paddingLeft: 10, paddingBottom: 10}]}>Record</Text>
            {
              (this.props.summary.isLoading === true)
              ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
              : <View style={{paddingLeft: 10}}>
                  <Text style={[styles.text, {color:AppColor.highlightOrange}]}>
                  <Text>Total Steps: {this.props.summary.overall.totalStep}</Text>{ '\n'}
                  <Text>{ this.props.summary.overall.highData.value }</Text>{'\n'}
                  <Text>{ moment(this.props.summary.overall.highData.date).format("L, HH:mm:ss")}</Text>{'\n'}
                  <Text>{ this.props.summary.overall.lowData.value }</Text>{'\n'}
                  <Text>{ moment(this.props.summary.overall.lowData.date).format("L, HH:mm:ss")}</Text>
                  </Text>
                </View>
            }
            </View>
            <View style={styles.square}>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export const OverallScreen = connect(mapStateToProps, mapDispatchToProps)(Analysis);

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    height: '100%',
  },
  chartContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: AppColor.baseColor,
    zIndex: 1024,
    height: BOTTOMMENU_HEIGHT,
    borderColor: AppColor.grey,
    borderBottomWidth: 0.3,
    borderBottomColor: AppColor.white+AppColor.opa20,
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    height: TOGGLE_HEIGHT,
    width: '100%',
    borderColor: AppColor.grey,
    borderBottomColor: AppColor.white+AppColor.opa20,
    marginBottom: 10,
  },
  dateBoxContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  carouselContainer: {
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    borderColor: AppColor.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: AppFont.Oxanium.light,
    fontSize: 14,
  },
  tickContainer: {
    height: TICKBOX_HEIGHT+1,
    borderColor: AppColor.white,
  },
  arrow: {
    width: '5%',
  },
  confirm: {
    width: '20%',
    paddingLeft: 5
  },
  confirmButton: {
    borderWidth: 0.3,
    height: 30,
    borderColor: AppColor.white,
    lineHeight:30,
  },
  pickerContainer: {
    width: '35%',
  },
  picker: {
    padding: 5,
    fontFamily: AppFont.Oxanium.light,
    // fontSize: 15,
    color: AppColor.highlightBlue,
    borderColor: AppColor.white,
    borderWidth: 0.3,
    height: 30,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  square: {
    height: SQUARE_SIZE,
    width: SQUARE_SIZE,
    borderColor: AppColor.highlightBlue+AppColor.opa20,
    borderWidth: 0.3,
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: GRAPH_HEIGHT,
  }
});
