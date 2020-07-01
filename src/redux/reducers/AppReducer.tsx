import { combineReducers } from 'redux';
import * as reducerType from './stepDataReducer';

export default combineReducers({
  runReducer: reducerType.runCircleReducer,
  stepWeeklyReducer: reducerType.stepWeeklyReducer,
  stepMonthlyReducer: reducerType.stepMonthlyReducer,
});
