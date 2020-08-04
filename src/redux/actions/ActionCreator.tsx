import * as types from './actionTypes';
import { Alert } from 'react-native';
import GoogleFit, { Scopes }  from 'react-native-google-fit';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { sum } from '../../constants/HelperFunction';

const STEP_ESTIMATED = "com.google.android.gms:estimated_steps";
const WEEK_OFFSET = 105; // 15 weeks includes currentWeek

const runOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_LOCATION_READ,
  ]
};

export const auth = async() => {
  var isAuth = GoogleFit.isAuthorized;

  // toggle authentication
  if (!isAuth) {
    isAuth = await GoogleFit.authorize(runOptions)
    .then(authResult => {
      if(authResult.success) {
        console.log("GoogleFit.isAuthorized: " + authResult.success);

      }else{
        Alert.alert("AUTH_DENIED", authResult.message);
      }
      return authResult.success === true;
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
          { text: "OK", onPress: () => auth() }
        ],
        { cancelable: false }
      );
      return false;
    })
  }

  return isAuth;
}

export const startRecording = async() => {
  const isAuth = await auth();
  if(isAuth) {
    GoogleFit.startRecording( callback => {
      console.log(callback);
       // Process data from Google Fit Recording API (no google fit app needed)
     }, ['step']);
  }
}

export const setGoal = (newGoal: string) => {

  return (dispatch: any) => {
    AsyncStorage.setItem('@storage_dailyGoal', newGoal).then
    (() => {
      dispatch({
        type: types.SET_GOAL,
        newGoal,
      })
    }).catch((error: any) => {});
  }
}

export const loadDaily = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if(isAuth){
      const today = moment()
      const options = {
        startDate: moment(today).startOf('day'),
        endDate: moment(today).endOf('day'),
        configs:{
          bucketTime: 15,
          bucketUnit: 'MINUTE'
        }
      }

      GoogleFit.getDailyStepCountSamples(options).then
      ((response: any) => {
        const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);
        const rawSteps = res_estimated[0].rawSteps;
        const { data, totalMin } = initDailyData(rawSteps);

        dispatch({
          type: types.LOAD_FIT_DAY_SUCCESS,
          payload: {
            data: data,
            avgPerMin: Math.ceil(sum(data) / totalMin)
          }
        });
      }).catch
      ((error: any) => {
        dispatch({
          type: types.LOAD_FIT_DAY_FAILURE,
          payload: error
        })
      });
    }else {
      dispatch({
        type: types.LOAD_FIT_DAY_FAILURE,
        payload: "Authentication failure"
      })
    }
  }
}

export const loadWeekly = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if(isAuth){
     const today = moment()
     const options = {
       startDate: moment(today).startOf('week'),
       endDate: moment(today).endOf('week'),
       configs:{
         bucketTime: 1,
         bucketUnit: 'DAY'
       }
     }

     GoogleFit.getDailyStepCountSamples(options).then
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
    }else {
      dispatch({
       type: types.LOAD_FIT_WEEK_FAILURE,
       payload: "Authentication failure"
      })
    }
  }
}

export const loadMonthly = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if(isAuth){
      const today = moment();
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

      GoogleFit.getDailyStepCountSamples(options).then
      ((response) => {
        const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);
        var data = [];
        let activeDay = 0;
        let inactiveDay = 0;

        if (res_estimated[0].steps.length > 0) {
         // console.log(res_estimated[0].steps)
         activeDay = res_estimated[0].steps.length;
         inactiveDay = WEEK_OFFSET - activeDay;
         data = res_estimated[0].steps;
        }
        dispatch({
          type: types.LOAD_FIT_MONTH_SUCCESS,
          payload: {
            data: data,
            endDate: endDate.format('YYYY-MM-DD'),
            activeDay: activeDay,
            inactiveDay: inactiveDay
          }
        })
      }).catch
      ((error: any) => {
        dispatch({
          type: types.LOAD_FIT_MONTH_FAILURE,
          payload: error
        })
      });

    }else {
      dispatch({
        type: types.LOAD_FIT_WEEK_FAILURE,
        payload: "Authentication failure"
      })
    }
  }
}

export const loadData = (start: Date, end: Date) => {
  return async (dispatch: any) => {
    const startDate = moment(start).startOf('day');
    const endDate = moment(end).endOf('day');

    if(!endDate.isAfter(startDate)) return;

    const isAuth = await auth();
    const bucketConfig = startDate.isSame(endDate, 'day');

    if(isAuth) {
      const options = {
        startDate: startDate,
        endDate: endDate,
        configs:{
          bucketTime: (bucketConfig)? 15 : 1,
          bucketUnit: (bucketConfig)? 'MINUTE' : 'DAY'
        }
      }

      GoogleFit.getDailyStepCountSamples(options).then((response)=>{

        const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);
        var dataS = [];
        let totalMinS = 0
        let activeDay = 0;
        let inactiveDay = 0;
        const rawSteps = res_estimated[0].rawSteps;
        if(bucketConfig) {
          const { totalMin, data, activeHour, inactiveHour } = initDailyData(rawSteps);
          dispatch({
            type: types.LOAD_FIT_DATA_SUCCESS,
            payload: {
              data: data,
              activeTime: activeHour,
              inactiveTime: inactiveHour,
              startDate: startDate,
              endDate: endDate,
            }
          });
        }else{
          dataS = initData(startDate, endDate);
          if (res_estimated[0].steps.length > 0) {
           // console.log(res_estimated[0].steps)
           activeDay = res_estimated[0].steps.length;
           inactiveDay = endDate.diff(startDate, 'days')+1 - activeDay;
           res_estimated[0].steps.forEach((element: any) => {
             let index = moment(element.date).diff(startDate, 'days');
             dataS[index] = element.value;
           });
          }
          dispatch({
            type: types.LOAD_FIT_DATA_SUCCESS,
            payload: {
              data: dataS,
              activeTime: activeDay,
              inactiveTime: inactiveDay,
              startDate: startDate,
              endDate: endDate,
            }
          });
        }
      }).catch((error)=>{
        dispatch({
          type: types.LOAD_FIT_DATA_FAILURE,
          payload: error
        })
      })

    }else {
      dispatch({
        type: types.LOAD_FIT_DATA_FAILURE,
        payload: "Authentication failure"
      });
    }
  }
}

// some helper functions
function getBaseLog(x:number, y:number) {
  return Math.log(y) / Math.log(x);
}

function initDailyData(rawSteps: any) {
  let totalMin = 0;
  const data = Array(24).fill(0);
  let activeHour = 0;
  let inactiveHour = 0;

  if (rawSteps.length > 0) {
    rawSteps.forEach( (item: any) => {
      const index = parseInt(moment(item.endDate).format("H"));
      data[index] += item.steps;
      if(item.steps > 0) {
        // console.log(moment(item.endDate).format('HH:mm:ss') + '-' + moment(item.startDate).format('HH:mm:ss'))
        activeHour++;
        totalMin += moment(item.endDate).diff(moment(item.startDate), "minutes")
      }
    });
    inactiveHour = data.length - activeHour;
  }
  if (totalMin <= 0) totalMin = 1;
  return { data, totalMin, activeHour, inactiveHour };
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

function initData(startDate: moment.Moment, endDate: moment.Moment) {
  const range = endDate.diff(startDate, 'days') + 1;
  return Array(range).fill(0);
}
