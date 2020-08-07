import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View, Easing} from 'react-native';

import { connect } from 'react-redux';
import { BarChart, ContributionGraph } from 'react-native-chart-kit';
import GoogleFit from 'react-native-google-fit';

import { AppColor, AppFont, AppCompSize } from '../../constants/AppConstant';
import AppText from '../../components/AppText';
import { HeaderTag } from '../../components/HeaderTag';
import * as actionTypes from '../../redux/actions/actionTypes';
import { loadDaily, loadWeekly, loadMonthly } from '../../redux/actions/ActionCreator';
import { GraphDecorator } from '../../components/GraphDecorator';
import { isArrayEqual, isArrayOfObjectDiff, sum } from '../../constants/HelperFunction';

const WEEK_OFFSET = 105; // 15 weeks includes currentWeek
const SCREEN_WIDTH = AppCompSize.SCREEN_W;
const GRAPH_HEIGHT = AppCompSize.GRAPH_HEIGHT;

export interface StatProps {
  daily: DailyProps,
  weekly: WeeklyProps,
  monthly: MonthlyProps,
  isLoading: boolean[],
  error: any[],
  load: ()=> void,
}

interface StatState {
  fadeAnim: Animated.Value
}

export interface DailyProps {
  labels: Array<string>,
  data: Array<number>,
  avgPerHour: number,
}

interface WeeklyProps {
  labels: Array<string>,
  data: Array<number>,
  defMax: number,
}

interface MonthlyProps {
  data: Array<{ date: string, value: string }>,
  endDate: string
}

const chartBackground = {
  backgroundGradientFrom: AppColor.highlightBlueL,
  backgroundGradientFromOpacity: 0.05,
  backgroundGradientTo: AppColor.highlightBlueL,
  backgroundGradientToOpacity: 0.05,
}

const barChartConfig = {
  ...chartBackground,
  propsForLabels:{
    fontFamily: AppFont.Oxanium.light
  },
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  fillShadowGradientOpacity: 0.8,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  chartStyle: {
    borderRadius: 5,
    paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 20,
    paddingRight: 20,
  },
  gutterTop: 20,
  horizontalLabelWidth: 60,
  barRadius: 3,
};

const contributionChartConfig = {
  ...chartBackground,
  propsForLabels:{
    fontFamily: AppFont.Oxanium.bold
  },
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  toggleColor: `rgba(26, 255, 146, 1)`,
  chartStyle: {
    paddingTop: 15,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 10,
    justifyContent: 'start',
    alignItems: 'center',
    borderRadius: 5,
  },
}

class DailyChart extends React.Component<DailyProps> {
  shouldComponentUpdate = (nextProps: DailyProps, nextState: any) => {
    if(isArrayEqual(this.props.data, nextProps.data)) return false
    return true;
  }

  componentDidUpdate = () => {
    // console.log("Daily_update");
  }

  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'D'}
          tagContent={'Avg: ' + this.props.avgPerHour + '/h'}
        />
        <BarChart
          style={styles.chartContainerStyle}
          chartConfig={{
            ...barChartConfig,
            ...{
                chartStyle:{
                  ...barChartConfig.chartStyle,
                  paddingTop: 30,
                  paddingRight: 40
                }
              }
          }}
          data={{
            labels: this.props.labels,
            datasets: [
              {
               data: this.props.data
             },
            ],
          }}
          hideLabelsAtIndex={Array.from({length: 24}, (v, k) => (k)%3 === 0 ? null : k) }
          width={SCREEN_WIDTH*.9}
          height={GRAPH_HEIGHT+20}
          yAxisLabel=""
          yAxisSuffix=""
          defMin={0}
          defMax={500}
          segments={5}
          barWidth={6}
          decorator={(config) => {
            // return an svg or an array of svg
            return (
              <GraphDecorator {...config} />
            )
          }}
        />
      </>
    )
  }
}

class WeeklyChart extends React.Component<WeeklyProps> {

  shouldComponentUpdate = (nextProps: WeeklyProps, nextState: any) => {
    if(isArrayEqual(this.props.data, nextProps.data)) return false
    return true;
  }

  componentDidUpdate = () => {
    // console.log("Weekly_update");
  }

  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'W'}
          tagContent={ 'Avg: ' + Math.ceil( sum(this.props.data) / this.props.data.length ) + '/day'}
        />
        <BarChart
          style={styles.chartContainerStyle}
          chartConfig={barChartConfig}
          data={{
            labels: this.props.labels,
            datasets: [
              {
               data: this.props.data
             },
            ],
          }}
          width={SCREEN_WIDTH*.9}
          height={GRAPH_HEIGHT}
          yAxisLabel=""
          yAxisSuffix=""
          showValuesOnTopOfBars={true}
          defMin={0}
          defMax={this.props.defMax}
          segments={6}
          barWidth={20}
        />
      </>
    );
  }
}

const CENTER_DIFF = (SCREEN_WIDTH*0.9 - (WEEK_OFFSET / 7 * 21 - 1))/2;
const SQUARE_SIZE = 20;
const TOOLTIP_WIDTH = 150;

class MonthlyChart extends React.Component<MonthlyProps> {
  tooltipContent = (dateInfo: any, args: any) => {
    const { index, x, y } = args;
    var tx = Math.floor(index / 7) * (SQUARE_SIZE + 1) + CENTER_DIFF - (TOOLTIP_WIDTH - SQUARE_SIZE)/2;
    tx = tx < 0 ? 0 : tx; //left overflow
    tx = tx + TOOLTIP_WIDTH > SCREEN_WIDTH*.9 ? SCREEN_WIDTH*.9 - TOOLTIP_WIDTH : tx; //right overflow
    return (
      <View style={[
        styles.tooltipContainer,
        {
          transform: [
            { translateX: tx },
            { translateY: y - 50 } // conside finger itself may block your view on device
          ],
        }
      ]}>
        <AppText style={styles.tooltipContentStyle}>
          <Text>Date: {dateInfo.date} </Text>
          <Text>Count: {dateInfo.value}</Text>
        </AppText>
      </View>
    )
  }

   getAverage = (data: Array<{date: string, value: string}>) => {
     if(data.length <= 0) return 0;
     const dataSize = data.length || 1;
     return data.reduce((total: number, item: {date: string, value: string}) => total + parseInt(item.value), 0) / dataSize;
   }

  shouldComponentUpdate = (nextProps: MonthlyProps, nextState: any) => {
    if(nextProps.endDate !== this.props.endDate) return true;
    if(isArrayOfObjectDiff(nextProps.data, this.props.data)) return true;
    return false;
  }

  componentDidUpdate = () => {
    // console.log("Monthly_update");
  }

  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'M'}
          tagContent={ 'Avg: ' + Math.ceil(this.getAverage(this.props.data)) + '/day' }
        />
        {
        <ContributionGraph
          style={styles.chartContainerStyle}
          values={this.props.data}
          endDate={new Date(this.props.endDate)}
          numDays={WEEK_OFFSET}
          width={SCREEN_WIDTH*.9}
          height={GRAPH_HEIGHT}
          chartConfig={contributionChartConfig}
          toggleTooltip={true}
          tooltipContent={this.tooltipContent}
          accessor={'value'}
          squareSize={20}
          // horizontal={false}
        />
      }
      </>
    )
  }
}

const LoadingBar = () => {
  return (
    <View style={styles.loadingBar}>
      <View style={styles.loadingBarIndicator}>
        <ActivityIndicator size={'large'}  color={AppColor.black}/>
      </View>
    </View>
  );
}

class Analysis extends React.Component<StatProps,StatState> {

  state = {
    fadeAnim: new Animated.Value(0)
  }

  fadeAnim = (toValue: number) => {
    Animated.timing(this.state.fadeAnim, {
      toValue: toValue,
      easing: Easing.ease,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }

  componentDidMount = () => {
    this.props.load();
  }

  componentWillUnmount = () => {
    GoogleFit.unsubscribeListeners();
  }

  componentDidUpdate = () => {
    // console.log("Analysis_update")
    if(this.props.isLoading.indexOf(true) !== -1){
      this.fadeAnim(1);
    }else{
      this.fadeAnim(0);
    }
  }

  shouldComponentUpdate = (nextProps: StatProps, nextState: any) => {
    if(!isArrayEqual(this.props.isLoading, nextProps.isLoading)) return true;

    if(!isArrayEqual(this.props.daily.data, nextProps.daily.data)) return true;

    if(this.props.weekly.defMax !== nextProps.weekly.defMax) return true;
    if(!isArrayEqual(this.props.weekly.data, nextProps.weekly.data)) return true;

    if(this.props.monthly.endDate !== this.props.monthly.endDate) return true;
    if(isArrayOfObjectDiff(this.props.monthly.data, nextProps.monthly.data)) return true;
    return false;
  }

  render() {
    return (
      <View style={{paddingTop:10}}>
        {
          <Animated.View
            style={{
              opacity: this.state.fadeAnim
            }}
          >
            <LoadingBar />
          </Animated.View>
        }
        {
          this.props.isLoading[0]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <DailyChart data={this.props.daily.data} avgPerHour={this.props.daily.avgPerHour} labels = {this.props.daily.labels}/>
        }
        {
          this.props.isLoading[1]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <WeeklyChart defMax={this.props.weekly.defMax} data={this.props.weekly.data} labels={this.props.weekly.labels}/>
        }
        {
          this.props.isLoading[2]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <MonthlyChart {...this.props.monthly} />
        }
      </View>
    )
  };
}

const styles = StyleSheet.create({
  loadingBar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    position: 'absolute',
    zIndex: 1024
  },
  loadingBarIndicator:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColor.white,
    height:40,
    width:40,
    borderRadius: 20
  },
  //below indecator style is for graph loading
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: GRAPH_HEIGHT,
  },
  header: {
    fontSize: 18,
    color: AppColor.highlightBlue,
    paddingLeft: 10,
  },
  chartContainerStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipContainer: {
    padding: 5,
    height: 50,
    width: TOOLTIP_WIDTH,
    opacity: 0.8,
    backgroundColor: 'black',
    borderColor: AppColor.highlightGreen,
    borderWidth: 1,
    justifyContent: 'center'
  },
  tooltipContentStyle: {
    fontSize: 14,
    color: AppColor.white,
  },
});

//connect to redux
const mapStateToProps = (state: any) => {
  return {
    daily: state.stepDailyReducer.daily,
    weekly: state.stepWeeklyReducer.weekly,
    monthly: state.stepMonthlyReducer.monthly,
    isLoading: [state.stepDailyReducer.isLoading, state.stepWeeklyReducer.isLoading, state.stepMonthlyReducer.isLoading],
    error: [state.stepDailyReducer.error, state.stepWeeklyReducer.error, state.stepMonthlyReducer.error]
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    load: () => {
      dispatch({  type: actionTypes.LOAD_FIT_DAY_START });
      dispatch(loadDaily());
      dispatch({  type: actionTypes.LOAD_FIT_WEEK_START });
      dispatch(loadWeekly());
      dispatch({  type: actionTypes.LOAD_FIT_MONTH_START });
      dispatch(loadMonthly());
    },
  }
};

export const RecentScreen = connect(mapStateToProps, mapDispatchToProps)(Analysis);
