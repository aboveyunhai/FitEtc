import { combineReducers } from 'redux';
import * as reducerType from './stepDataReducer';

export default combineReducers({
  runReducer: reducerType.runCircleReducer,
  stepDailyReducer: reducerType.stepDailyReducer,
  stepWeeklyReducer: reducerType.stepWeeklyReducer,
  stepMonthlyReducer: reducerType.stepMonthlyReducer,
  stepReducer: reducerType.stepReducer,
});
