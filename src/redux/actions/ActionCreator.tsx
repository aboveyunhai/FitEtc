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
    Scopes.FITNESS_ACTIVITY_WRITE,
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
        bucketTime: 1,
        bucketUnit: "MINUTE"
      }

      GoogleFit.getDailyStepCountSamples(options).then
      ((response: any) => {
        const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);
        const rawSteps = res_estimated[0].rawSteps;
        const { data, totalTime, activeHour } = initDailyData(rawSteps);

        dispatch({
          type: types.LOAD_FIT_DAY_SUCCESS,
          payload: {
            data: data,
            avgPerHour: Math.ceil(sum(data) / (activeHour||1))
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
       bucketTime: 1,
       bucketUnit: 'DAY'
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
        bucketTime: 1,
        bucketUnit: 'DAY'
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
        bucketTime: (bucketConfig)? 1 : 1,
        bucketUnit: (bucketConfig)? 'HOUR' : 'DAY'
      }

      GoogleFit.getDailyStepCountSamples(options).then((response)=>{

        const res_estimated = response.filter( (data:any) => data.source === STEP_ESTIMATED);

        var dataS = [];
        let activeDay = 0;
        let inactiveDay = 0;
        const rawSteps = res_estimated[0].rawSteps;
        if(bucketConfig) {
          const { highData, lowData, data, activeHour, inactiveHour } = initDailyData(rawSteps);
          const totalStep = sum(data);
          dispatch({
            type: types.LOAD_FIT_DATA_SUCCESS,
            payload: {
              data: data,
              activeTime: activeHour,
              inactiveTime: inactiveHour,
              totalTime: activeHour+inactiveHour,
              startDate: startDate,
              endDate: endDate,
              unit: 'h',
              totalStep: totalStep,
              highData: highData,
              lowData: lowData,
              speed: sum(data)/(activeHour||1)
            }
          });
        }else{
          dataS = initData(startDate, endDate);
          inactiveDay = endDate.diff(startDate, 'days')+1;
          let totalStep = 0;
          let highData = {
            value: -Infinity,
            date: moment()
          };
          let lowData = {
            value: Infinity,
            date: moment()
          }
          if (res_estimated[0].steps.length > 0) {
           // console.log(res_estimated[0].steps)
           activeDay = res_estimated[0].steps.length;
           inactiveDay -= activeDay;
           res_estimated[0].steps.forEach((element: any) => {
             let index = moment(element.date).diff(startDate, 'days');
             dataS[index] = element.value;
             totalStep += element.value;
             if(element.value > highData.value) {
               highData.value = element.value;
               highData.date = element.date;
             }
             if(element.value < lowData.value) {
               lowData.value = element.value;
               lowData.date = element.date;
             }
           });
          }
          dispatch({
            type: types.LOAD_FIT_DATA_SUCCESS,
            payload: {
              data: dataS,
              activeTime: activeDay,
              inactiveTime: inactiveDay,
              totalTime: activeDay+inactiveDay,
              startDate: startDate,
              endDate: endDate,
              unit: 'd',
              totalStep: totalStep,
              speed: totalStep/(activeDay+inactiveDay),
              highData: highData,
              lowData: lowData,
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
  let totalTime = 0;
  const data = Array(24).fill(0);
  let activeHour = 0;
  let inactiveHour = data.length;
  let highData = {
    value: -Infinity,
    date: moment()
  };
  let lowData = {
    value: Infinity,
    date: moment()
  }

  if (rawSteps.length > 0) {
    rawSteps.forEach( (item: any) => {
      const index = parseInt(moment(item.endDate).format("H"));
      data[index] += item.steps;
      if(item.steps > 0) {
        // console.log(moment(item.startDate).format('HH:mm:ss') + '-' + moment(item.endDate).format('HH:mm:ss'))
        if(item.steps > highData.value) {
          highData.value = item.steps;
          highData.date = item.endDate;
        }
        if(item.steps < lowData.value) {
          lowData.value = item.steps;
          lowData.date = item.endDate;
        }
        activeHour++;
        totalTime += moment(item.endDate).diff(moment(item.startDate), "minutes")
      }
    });
    inactiveHour -= activeHour;
  }
  if (totalTime <= 0) totalTime = 1;
  return { data, totalTime, activeHour, inactiveHour, highData, lowData };
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
