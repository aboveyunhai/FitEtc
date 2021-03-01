import * as types from './actionTypes';
import {Alert} from 'react-native';
import GoogleFit, {
  Scopes,
  StartAndEndDate,
  BucketOptions,
  FoodIntake,
  MealType,
  BucketUnit,
  Nutrient,
  SleepSample,
} from 'react-native-google-fit';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {sum} from '../../constants/HelperFunction';

const STEP_ESTIMATED = 'com.google.android.gms:estimated_steps';
const WEEK_OFFSET = 105; // 15 weeks includes currentWeek

const runOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    // Scopes.FITNESS_NUTRITION_READ,
    // Scopes.FITNESS_NUTRITION_WRITE,
    // Scopes.FITNESS_BODY_READ,
    // Scopes.FITNESS_LOCATION_READ,
    // Scopes.FITNESS_BLOOD_PRESSURE_READ,
    // Scopes.FITNESS_BLOOD_GLUCOSE_READ,
    // Scopes.FITNESS_LOCATION_READ,
    // Scopes.FITNESS_LOCATION_WRITE,
    Scopes.FITNESS_SLEEP_READ,
    Scopes.FITNESS_SLEEP_WRITE
  ],
};

export type StepOptions = StartAndEndDate & Partial<BucketOptions>;

export const auth = async () => {
  var isAuth = GoogleFit.isAuthorized;

  // toggle authentication
  if (!isAuth) {
    isAuth = await GoogleFit.authorize(runOptions)
      .then(authResult => {
        if (authResult.success) {
          console.log('GoogleFit.isAuthorized: ' + authResult.success);
        } else {
          Alert.alert('AUTH_DENIED', authResult.message);
        }
        return authResult.success === true;
      })
      .catch(() => {
        Alert.alert(
          'AUTH_ERROR',
          'Click Reload button to re-authorize.',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {text: 'OK', onPress: () => auth()},
          ],
          {cancelable: false},
        );
        return false;
      });
  }

  return isAuth;
};

export const startRecording = async () => {
  const isAuth = await auth();
  if (isAuth) {
    GoogleFit.startRecording(
      callback => {
        console.log(callback);
        // Process data from Google Fit Recording API (no google fit app needed)
      },
      ['step', 'distance'],
    );
  }
};

export const setGoal = (newGoal: string) => {
  return (dispatch: any) => {
    AsyncStorage.setItem('@storage_dailyGoal', newGoal)
      .then(() => {
        dispatch({
          type: types.SET_GOAL,
          newGoal,
        });
      })
      .catch((error: any) => {});
  };
};

export const loadDaily = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if (isAuth) {
      const today = moment();
      const options: StepOptions = {
        startDate: moment(today).startOf('day').toISOString(),
        endDate: moment(today).endOf('day').toISOString(),
        bucketInterval: 30,
        bucketUnit: 'MINUTE',
      };

      // const distance = await GoogleFit.getDailyDistanceSamples(options);
      // console.log(distance);
      // const activity = await GoogleFit.getActivitySamples(options);
      // console.log(activity);
      // const calories = await GoogleFit.getDailyCalorieSamples(options);
      // console.log(calories);
      // const nutritions = await GoogleFit.getDailyNutritionSamples(options);
      // console.log(nutritions);


    //   const opt = {
    //     mealType: MealType.BREAKFAST,
    //     foodName: "banana",
    //     date: moment().format(), //equals to new Date().toISOString()
    //     nutrients: {
    //         [Nutrient.TOTAL_FAT]: 0.4,
    //         [Nutrient.SODIUM]: 1,
    //         [Nutrient.SATURATED_FAT]: 0.1,
    //         [Nutrient.PROTEIN]: 1.3,
    //         [Nutrient.TOTAL_CARBS]: 27.0,
    //         [Nutrient.CHOLESTEROL]: 0,
    //         [Nutrient.CALORIES]: 105,
    //         [Nutrient.SUGAR]: 14,
    //         [Nutrient.DIETARY_FIBER]: 3.1,
    //         [Nutrient.POTASSIUM]: 422,
    //     }
    // } as FoodIntake;

    //   GoogleFit.saveFood(opt, (err, res) => {
    //     console.log(err, res);
    //   })

      // const opt = {
      //   unit: "pound", // required; default 'kg'
      //   startDate: moment().startOf('month').toISOString(), // required
      //   endDate: new Date().toISOString(), // required
      //   ascending: false, // optional; default false
      //   bucketUnit: 'MINUTE' as BucketUnit,
      //   bucketInterval: 30
      // };
      // const weight = await GoogleFit.getWeightSamples(opt);
      // console.log(weight);
      // const height = await GoogleFit.getHeightSamples(opt);
      // console.log(height);

      // const heartrate = await GoogleFit.getHeartRateSamples(options);
      // console.log(heartrate);

      // const bloodpressure = await GoogleFit.getBloodPressureSamples(options);
      // console.log(bloodpressure);

      // const hydrationArray = [
      //   {
      //     date: moment().valueOf(),
      //     waterConsumed: 0.325,
      //   },
      // ];

      // GoogleFit.saveHydration(hydrationArray, (err, res) => {
      //   if (err) throw "Cant save data to the Google Fit";
      //   console.log(res)
      // });

      // const opt = {
      //   startDate: moment().startOf('year').toISOString(),
      //   endDate: moment().toISOString()
      // }

      // const hydration = await GoogleFit.getHydrationSamples(opt);
      // console.log(hydration);
      // const opt = {
      //   startDate: moment().subtract(1, 'months').startOf('month').toISOString(),
      //   endDate: moment().toISOString(),
      // }
      // const sleep = await GoogleFit.getSleepSamples(opt);
      // for(const data of sleep) {
      //   for(const d of data["granularity"]) {
      //     console.log(d);
      //   };
      // }
      // console.log(sleep);

      // const sd = moment().subtract(10, 'hour').valueOf();
      // const ed = moment().subtract(5, 'hour').valueOf();

      // const opts: SleepSample = {
      //   startDate: sd,
      //   endDate: ed,
      //   sessionName: `${sd}-${ed}:sleep_session`,
      //   identifier: `${sd}-${ed}:sleep_identifier`,
      //   description: "some description",
      //   granularity: [
      //     {
      //       startDate: sd,
      //       endDate: ed,
      //       sleepStage: 5,
      //     },
      //   ]
      // }
      // const result = await GoogleFit.saveSleep(opts);
      // console.log(result);

      GoogleFit.getDailyStepCountSamples(options)
        .then((response: any) => {
          const res_estimated = response.filter(
            (data: any) => data.source === STEP_ESTIMATED,
          );
          const rawSteps = res_estimated[0].rawSteps;
          const {data, totalTime, activeHour} = initDailyData(rawSteps);

          dispatch({
            type: types.LOAD_FIT_DAY_SUCCESS,
            payload: {
              data: data,
              avgPerHour: Math.ceil(sum(data) / (activeHour || 1)),
            },
          });
        })
        .catch((error: any) => {
          dispatch({
            type: types.LOAD_FIT_DAY_FAILURE,
            payload: error,
          });
        });
    } else {
      dispatch({
        type: types.LOAD_FIT_DAY_FAILURE,
        payload: 'Authentication failure',
      });
    }
  };
};

export const loadWeekly = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if (isAuth) {
      const today = moment();
      const options: StepOptions = {
        startDate: moment(today).startOf('week').toISOString(),
        endDate: moment(today).endOf('week').toISOString(),
        bucketInterval: 1,
        bucketUnit: 'DAY',
      };

      GoogleFit.getDailyStepCountSamples(options)
        .then((response: any) => {
          const res_estimated = response.filter(
            (data: any) => data.source === STEP_ESTIMATED,
          );

          const data = initWeekData(today);

          if (res_estimated[0].steps.length > 0) {
            // console.log(res_estimated[0].steps)
            for (const item of res_estimated[0].steps) {
              data[item.date] = item.value;
            }
          }

          const result = Object.keys(data).map(key => data[key]);
          const max = Math.max(...result);
          const baseLog = getBaseLog(2, max / 1000);
          const power = Math.ceil(baseLog === -Infinity ? 0 : baseLog);

          dispatch({
            type: types.LOAD_FIT_WEEK_SUCCESS,
            payload: {
              data: result,
              defMax: 1000 * Math.pow(2, power),
            },
          });
        })
        .catch((error: any) => {
          dispatch({
            type: types.LOAD_FIT_WEEK_FAILURE,
            payload: error,
          });
        });
    } else {
      dispatch({
        type: types.LOAD_FIT_WEEK_FAILURE,
        payload: 'Authentication failure',
      });
    }
  };
};

export const loadMonthly = () => {
  return async (dispatch: any) => {
    const isAuth = await auth();

    if (isAuth) {
      const today = moment();
      const endDate = moment(today)
        .endOf('week')
        .add(1, 'days');
      const startDate = moment(endDate)
        .subtract(WEEK_OFFSET, 'days')
        .startOf('day');
      const options: StepOptions = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        bucketInterval: 1,
        bucketUnit: 'DAY',
      };

      GoogleFit.getDailyStepCountSamples(options)
        .then(response => {
          const res_estimated = response.filter(
            (data: any) => data.source === STEP_ESTIMATED,
          );
          var data: any = [];
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
              inactiveDay: inactiveDay,
            },
          });
        })
        .catch((error: any) => {
          dispatch({
            type: types.LOAD_FIT_MONTH_FAILURE,
            payload: error,
          });
        });
    } else {
      dispatch({
        type: types.LOAD_FIT_WEEK_FAILURE,
        payload: 'Authentication failure',
      });
    }
  };
};

export const loadData = (start: Date, end: Date) => {
  return async (dispatch: any) => {
    const startDate = moment(start).startOf('day');
    const endDate = moment(end).endOf('day');

    if (!endDate.isAfter(startDate)) return;

    const isAuth = await auth();
    const bucketConfig = startDate.isSame(endDate, 'day');

    if (isAuth) {
      const options: StepOptions = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        bucketInterval: bucketConfig ? 1 : 1,
        bucketUnit: bucketConfig ? 'HOUR' : 'DAY',
      };
      GoogleFit.getDailyStepCountSamples(options)
        .then(response => {
          const res_estimated = response.filter(
            (data: any) => data.source === STEP_ESTIMATED,
          );
          var dataS = [];
          let activeDay = 0;
          let inactiveDay = 0;
          const rawSteps = res_estimated[0].rawSteps;
          if (bucketConfig) {
            const {
              highData,
              lowData,
              data,
              activeHour,
              inactiveHour,
            } = initDailyData(rawSteps);
            const totalStep = sum(data);
            dispatch({
              type: types.LOAD_FIT_DATA_SUCCESS,
              payload: {
                data: data,
                activeTime: activeHour,
                inactiveTime: inactiveHour,
                totalTime: activeHour + inactiveHour,
                startDate: startDate,
                endDate: endDate,
                unit: 'h',
                totalStep: totalStep,
                highData: highData,
                lowData: lowData,
                speed: sum(data) / (activeHour || 1),
              },
            });
          } else {
            dataS = initData(startDate, endDate);
            inactiveDay = endDate.diff(startDate, 'days') + 1;
            let totalStep = 0;
            let highData = {
              value: -Infinity,
              date: moment(),
            };
            let lowData = {
              value: Infinity,
              date: moment(),
            };
            if (res_estimated[0].steps.length > 0) {
              // console.log(res_estimated[0].steps)
              activeDay = res_estimated[0].steps.length;
              inactiveDay -= activeDay;
              res_estimated[0].steps.forEach((element: any) => {
                let index = moment(element.date).diff(startDate, 'days');
                dataS[index] = element.value;
                totalStep += element.value;
                if (element.value > highData.value) {
                  highData.value = element.value;
                  highData.date = element.date;
                }
                if (element.value < lowData.value) {
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
                totalTime: activeDay + inactiveDay,
                startDate: startDate,
                endDate: endDate,
                unit: 'd',
                totalStep: totalStep,
                speed: totalStep / (activeDay + inactiveDay),
                highData: highData,
                lowData: lowData,
              },
            });
          }
        })
        .catch(error => {
          dispatch({
            type: types.LOAD_FIT_DATA_FAILURE,
            payload: error,
          });
        });
    } else {
      dispatch({
        type: types.LOAD_FIT_DATA_FAILURE,
        payload: 'Authentication failure',
      });
    }
  };
};

// some helper functions
function getBaseLog(x: number, y: number) {
  return Math.log(y) / Math.log(x);
}

function initDailyData(rawSteps: any) {
  let totalTime = 0;
  const data = Array(24).fill(0);
  let activeHour = 0;
  let inactiveHour = data.length;
  let highData = {
    value: -Infinity,
    date: moment(),
  };
  let lowData = {
    value: Infinity,
    date: moment(),
  };

  if (rawSteps.length > 0) {
    rawSteps.forEach((item: any) => {
      const index = parseInt(moment(item.endDate).format('H'));
      data[index] += item.steps;
      if (item.steps > 0) {
        // console.log(moment(item.startDate).format('HH:mm:ss') + '-' + moment(item.endDate).format('HH:mm:ss'))
        if (item.steps > highData.value) {
          highData.value = item.steps;
          highData.date = item.endDate;
        }
        if (item.steps < lowData.value) {
          lowData.value = item.steps;
          lowData.date = item.endDate;
        }
        activeHour++;
        totalTime += moment(item.endDate).diff(
          moment(item.startDate),
          'minutes',
        );
      }
    });
    inactiveHour -= activeHour;
  }
  if (totalTime <= 0) totalTime = 1;
  return {data, totalTime, activeHour, inactiveHour, highData, lowData};
}

function initWeekData(date: moment.Moment) {
  //construct dataset
  const startDate = date.startOf('weeks');
  const data: {[key: string]: number} = {};
  for (let i = 0; i < 7; i++) {
    const dateStr = moment(startDate)
      .add(i, 'days')
      .format('YYYY-MM-DD');
    data[dateStr] = 0;
  }
  return data;
}

function initData(startDate: moment.Moment, endDate: moment.Moment) {
  const range = endDate.diff(startDate, 'days') + 1;
  return Array(range).fill(0);
}
