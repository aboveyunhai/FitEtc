import * as types from '../actions/actionTypes';
import moment from 'moment';

export const runCircleReducer = (state = { dailyGoal: '1000' }, action: any) => {
  switch (action.type) {
    case types.SET_GOAL:
      return {
        ...state,
        dailyGoal: action.newGoal,
      };
    default:
      return state;
  }
};

const INIT_DAILY_DATA = {
  daily:{
    labels: Array.from({length: 24}, (v, k) => k.toString()),
    data: Array(24).fill(0),
    avgPerMin: 0,
  },
  isLoading: false,
  error: null
}

const INIT_WEEKLY_DATA = {
  weekly: {
    labels: ['SUN','MON','TUE','WED', 'THU', 'FRI','SAT'],
    data: [0, 0, 0, 0, 0, 0, 0],
    defMax: 1000,
  },
  isLoading: false,
  error: null
}

const INIT_MONTHLY_DATA = {
  monthly: {
    data: [],
    activeDay: 0,
    inactiveDay: 0,
    endDate: moment().endOf('week').add(1, "days").format('YYYY-MM-DD'),
  },
  isLoading: false,
  error: null
}

const INIT_DATA = {
  overall: {
    labels: [1,2,3],
    data: [0,0,0],
    activeDay: 0,
    inactiveDay: 0,
    startDate: moment(),
    endDate: moment(),
  },
  isLoading: false,
  error: null,
}

export const stepDailyReducer = (state = INIT_DAILY_DATA, action: any) => {
  switch (action.type) {
    case types.LOAD_FIT_DAY_START:
      return {
        ...state,
        isLoading: true
      };
    case types.LOAD_FIT_DAY_SUCCESS:
      return {
        ...state,
        daily: {
          ...state.daily,
          data: action.payload.data,
          avgPerMin: action.payload.avgPerMin,
        },
        isLoading: false
      };
    case types.LOAD_FIT_DAY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    default:
      return state;
  }
}

export const stepWeeklyReducer = (state = INIT_WEEKLY_DATA, action: any) => {
  switch (action.type) {
    case types.LOAD_FIT_WEEK_START:
      return {
        ...state,
        isLoading: true
      };
    case types.LOAD_FIT_WEEK_SUCCESS:
      return {
        ...state,
        weekly: {
          ...state.weekly,
          data: action.payload.data,
          defMax: action.payload.defMax
        },
        isLoading: false
      };
    case types.LOAD_FIT_WEEK_FAILURE:
       return {
         ...state,
         error: action.payload,
         isLoading: false,
       }
    default:
      return state;
  }
};

export const stepMonthlyReducer = (state = INIT_MONTHLY_DATA, action: any) => {
  switch (action.type) {
    case types.LOAD_FIT_MONTH_START:
      return {
        ...state,
        isLoading: true
      }
    case types.LOAD_FIT_MONTH_SUCCESS:
      return {
        ...state,
        monthly: {
          ...state.monthly,
          data: action.payload.data,
          endDate: action.payload.endDate,
          activeDay: action.payload.activeDay,
          inactiveDay: action.payload.inactiveDay,
        },
        isLoading: false
      };
      case types.LOAD_FIT_MONTH_FAILURE:
        return {
          ...state,
          error: action.payload,
          isLoading: false,
        }
      default:
        return state;
  }
}

export const stepReducer = (state = INIT_DATA, action: any) => {
  switch (action.type) {
    case types.LOAD_FIT_DATA_START:
      return {
        ...state,
        isLoading: true,
      }
    case types.LOAD_FIT_DATA_SUCCESS:
      return {
        ...state,
        overall: {
          ...state.overall,
          data: action.payload.data,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          activeTime: action.payload.activeDay,
          inactiveTime: action.payload.inactiveDay,
        },
        isLoading: false
      }
    case types.LOAD_FIT_DATA_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    default:
      return state;
  }
}
