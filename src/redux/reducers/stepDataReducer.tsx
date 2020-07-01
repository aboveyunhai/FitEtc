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

const initWeeklyData = {
  weekly: {
    labels: ['SUN','MON','TUE','WED', 'THU', 'FRI','SAT'],
    data: [0, 0, 0, 0, 0, 0, 0],
    defMax: 1000,
  },
  isLoading: false,
  error: null
}

const initMonthlyData = {
  monthly: {
    data: [],
    endDate: moment().endOf('week').add(1, "days").format('YYYY-MM-DD'),
  },
  isLoading: false,
  error: null
}

export const stepWeeklyReducer = (state = initWeeklyData, action: any) => {
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

export const stepMonthlyReducer = (state = initMonthlyData, action: any) => {
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
