import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View} from 'react-native';

import { connect } from 'react-redux';
import { BarChart, ContributionGraph } from 'react-native-chart-kit';
import moment from 'moment';
import GoogleFit from 'react-native-google-fit';

import { AppColor } from '../../constants/AppConstant';
import { HeaderTag } from '../../components/HeaderTag';
import { reloadWeekly, reloadMonthly } from '../../redux/actions/ActionCreator';
import { GraphDecorator } from '../../components/GraphDecorator';

const WEEK_OFFSET = 105; // 15 weeks includes currentWeek
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_HEIGHT = 200;
const STEP_SOURCE = "com.google.android.gms:estimated_steps";

export interface StatProps {
  weekly: WeeklyProps,
  monthly: MonthlyProps,
  isLoading: boolean[],
  error: any[],
  reloadWeekly: ()=> void,
  reloadMonthly: ()=> void,
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

const barChartConfig = {
  backgroundGradientFrom: AppColor.highlightBlueL,
  backgroundGradientFromOpacity: 0.05,
  backgroundGradientTo: AppColor.highlightBlueL,
  backgroundGradientToOpacity: 0.05,
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
  horizontalLabelWidth: SCREEN_WIDTH*0.9*0.15,
  barRadius: 3,
};

const contributionChartConfig = {
  backgroundGradientFrom: AppColor.highlightBlue,
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: AppColor.highlightBlue,
  backgroundGradientToOpacity: 0.1,
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
  }
}

export const isArrayEqual = (arr1: number[], arr2: number[]) => {
  if (arr1.length !== arr2.length) return false;
  for(let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

class DailyChart extends React.Component {

  state = {
    labels: Array.from({length: 24}, (v, k) => k.toString()),
    data: Array(24).fill(0),
    avgPerMin: 0,
  }

  componentDidMount = () => {
    this.loadingData();
  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    this.loadingData();
  }

  loadingData = () => {
    const today = moment();
    const options = {
      startDate: moment(today).startOf('day'),
      endDate: moment(today).endOf('day'),
      configs:{
        bucketTime: 15,
        bucketUnit: 'MINUTE'
      }
    }

    GoogleFit.getDailyStepCountSamples(options).then((res) => {
      const result = res.filter( (data:any) => data.source === STEP_SOURCE);

      const rawSteps = result[0].rawSteps;
      let totalMin = 0;

      if (rawSteps.length > 0) {
        const data = Array(24).fill(0);
        rawSteps.forEach( (item: any) => {
          const index = parseInt(moment(item.endDate).format("H"));
          data[index] += item.steps;
          if(item.steps > 0) {
            // console.log(moment(item.endDate).format('HH:mm:ss') + '-' + moment(item.startDate).format('HH:mm:ss'))
            totalMin += moment(item.endDate).diff(moment(item.startDate), "minutes")
          }
        });

        // this line is to determine state update, remove will cause infinite loop
        if(isArrayEqual(data, this.state.data)) return;

        if (totalMin < 0) totalMin = 1;

        this.setState({
          data: data,
          avgPerMin: Math.ceil(data.reduce((total, value) => (total + value), 0) / totalMin)
        });
      }
    }).catch((error) => { console.log(error) });
  }

  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'D'}
          headerContent={this.state.avgPerMin + '/min'}
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
            labels: this.state.labels,
            datasets: [
              {
               data: this.state.data
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
  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'W'}
          headerContent={ Math.ceil(this.props.data.reduce((x, y) => x + y, 0) / this.props.data.length) + '/day'}
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
        <Text style={{color: AppColor.white, fontSize: 14}}>Date: {dateInfo.date} </Text>
        <Text style={{color: AppColor.white, fontSize: 14}}>Count: {dateInfo.value}</Text>
      </View>
    )
  }

   getAverage = (data: Array<{date: string, value: string}>) => {
     if(data.length <= 0) return 0;
     const dataSize = data.length || 1;
     return data.reduce((total: number, item: {date: string, value: string}) => total + parseInt(item.value), 0) / dataSize;
   }

  render() {
    return (
      <>
        <HeaderTag
          tagLabel={'M'}
          headerContent={Math.ceil(this.getAverage(this.props.data)) + '/day' }
        />
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
      </>
    )
  }
}

class Analysis extends React.Component<StatProps> {

  componentDidMount = () => {
    this.props.reloadWeekly();
    this.props.reloadMonthly();
  }

  render() {
    return (
      <View style={{paddingTop:10}}>
        {
          <DailyChart />
        }
        {
          this.props.isLoading[0]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <WeeklyChart defMax={this.props.weekly.defMax} data={this.props.weekly.data} labels={this.props.weekly.labels}/>
        }
        {
          this.props.isLoading[1]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <MonthlyChart data={this.props.monthly.data} endDate={this.props.monthly.endDate} />
        }
      </View>
    )
  };
}

const styles = StyleSheet.create({
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
    // justifyContent: 'center'
  },
});

//connect to redux
const mapStateToProps = (state: any) => {
  return {
    weekly: state.stepWeeklyReducer.weekly,
    monthly: state.stepMonthlyReducer.monthly,
    isLoading: [state.stepWeeklyReducer.isLoading, state.stepMonthlyReducer.isLoading],
    error: [state.stepWeeklyReducer.error, state.stepMonthlyReducer.error]
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    reloadWeekly: () => dispatch(reloadWeekly()),
    reloadMonthly: () => dispatch(reloadMonthly())
  }
};

export const RecentScreen = connect(mapStateToProps, mapDispatchToProps)(Analysis);
