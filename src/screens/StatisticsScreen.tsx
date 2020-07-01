import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';

import { connect } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BarChart, ContributionGraph } from 'react-native-chart-kit';

import { AppColor } from '../constants/AppConstant';
import AppText from '../components/AppText';
import { reloadWeekly, reloadMonthly } from '../redux/actions/ActionCreator';

const WEEK_OFFSET = 105; // 15 weeks includes currentWeek
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GRAPH_HEIGHT = 220;

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
  backgroundGradientFrom: AppColor.highlightBlue,
  backgroundGradientFromOpacity: 0.1,
  backgroundGradientTo: AppColor.highlightBlue,
  backgroundGradientToOpacity: 0.1,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  fillShadowGradientOpacity: 0.8,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  chartStyle: {
    borderRadius: 10,
    paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 20,
    paddingRight: 20,
  },
  gutterTop: 20,
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
    borderRadius: 10,
  }
}

class WeeklyChart extends React.Component<WeeklyProps> {
  render() {
    return (
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
      />
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

  render() {
    return (
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
        <AppText style={styles.header}>Weekly Activity</AppText>
        {
          this.props.isLoading[0]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <WeeklyChart defMax={this.props.weekly.defMax} data={this.props.weekly.data} labels={this.props.weekly.labels}/>
        }

        <AppText style={styles.header}>Monthly Activity</AppText>
        {
          this.props.isLoading[1]
          ? <View style={styles.indicatorContainer}><ActivityIndicator /></View>
          : <MonthlyChart data={this.props.monthly.data} endDate={this.props.monthly.endDate} />
        }
      </View>
    )
  };
}

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

const RecentScreen = connect(mapStateToProps, mapDispatchToProps)(Analysis);
const Tab = createMaterialTopTabNavigator();

function RecentHistory() {
  return (
      <ScrollView style={styles.container}>
        <RecentScreen />
      </ScrollView>
  )
}

function OverallHistory() {
  return (
    <View style={styles.container}>
    </View>
  )
}

function LoadingScreen() {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignContent: 'center'}]}>
      <Text>Loading...</Text>
    </View>
  )
}

const TabProps = {
  lazy: true,
  lazyPlaceholder: LoadingScreen,
  initialLayout: {
    width: SCREEN_WIDTH,
  },
  tabBarOptions: {
    labelStyle: {
      fontSize: 12,
    },
    style: { backgroundColor: AppColor.baseColor },
    tabStyle: { height: 40, paddingTop: 0 },
    indicatorStyle: {
      backgroundColor: AppColor.highlightBlue,
    },
    activeTintColor: AppColor.white,
  }
}

export default function StatisticsScreen() {
  return (
    <Tab.Navigator {...TabProps}>
      <Tab.Screen name="Recent" component={RecentHistory} />
      <Tab.Screen name="Overall" component={OverallHistory} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColor.baseColor,
  },
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
