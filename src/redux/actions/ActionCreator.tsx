import * as types from './actionTypes';
import GoogleFit from 'react-native-google-fit';
import moment from 'moment';

const STEP_ESTIMATED = "com.google.android.gms:estimated_steps";
const WEEK_OFFSET = 105; // 15 weeks includes currentWeek

export const setGoal = (newGoal: string) => {
  return {
    type: types.SET_GOAL,
    newGoal,
  };
};

const getBaseLog = (x:number, y:number) => {
  return Math.log(y) / Math.log(x);
}

function initWeekData(date: moment.Moment) {
  //construct dataset
  const startDate = date.startOf('weeks');
  const data: { [key: string]: number } = {};
  for (let i = 0; i < 7; i++) {
    const dateStr = moment(startDate).add(i, 'days').format("YYYY-MM-DD");
    data[dateStr] = 0;
  }
  return data;
}

export const reloadWeekly = () => {
 const today = moment()

 return (dispatch: any) => {
   requestWeekly(today).then
   ((response: any) => {
       const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);

       const data = initWeekData(today);

       if (res_estimated[0].steps.length > 0) {
         // console.log(res_estimated[0].steps)
         for(const item of res_estimated[0].steps) {
           data[item.date] = item.value;
         }
       }

       const result = Object.keys(data).map(key => data[key]);
       const max = Math.max(...result);
       const baseLog = getBaseLog(2, max/1000);
       const power = Math.ceil( baseLog === -Infinity ? 0 : baseLog);

       dispatch({
         type: types.LOAD_FIT_WEEK_SUCCESS,
         payload: {
           data: result,
           defMax: 1000*Math.pow(2, power)
         }
       })
   }).catch
   ((error: any) => {
     dispatch({
       type: types.LOAD_FIT_WEEK_FAILURE,
       payload: error
     })
   });
 }
}

export const reloadMonthly = () => {
  const today = moment();
  const endDate = moment(today).endOf('week').add(1, 'days');
  return (dispatch: any) => {
    requestMonthly(today).then
    ((response: any) => {
      const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);
      var data = {};
      if (res_estimated[0].steps.length > 0) {
       // console.log(res_estimated[0].steps)
       data = res_estimated[0].steps;
      }
      dispatch({
        type: types.LOAD_FIT_MONTH_SUCCESS,
        payload: {
          data: data,
          endDate: endDate.format('YYYY-MM-DD'),
        }
      })
    }).catch
    ((error: any) => {
      dispatch({
        type: types.LOAD_FIT_MONTH_FAILURE,
        payload: error
      })
    });
  }
}

function requestWeekly(today: moment.Moment) {
  const options = {
    startDate: moment(today).startOf('week'),
    endDate: moment(today).endOf('week'),
    configs:{
      bucketTime: 1,
      bucketUnit: 'DAY'
    }
  }

  return GoogleFit.getDailyStepCountSamples(options);
}

function requestMonthly(today: moment.Moment) {
  const endDate = moment(today).endOf('week').add(1, 'days');
  const startDate = moment(endDate).subtract(WEEK_OFFSET, 'days').startOf('day');
  const options = {
    startDate: startDate,
    endDate: endDate,
    configs:{
      bucketTime: 1,
      bucketUnit: 'DAY'
    }
  }

  return GoogleFit.getDailyStepCountSamples(options);
}
