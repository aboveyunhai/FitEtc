import { combineReducers } from 'redux';
import { runCircleReducer } from './RunCircleReducer';

export default combineReducers({
  runReducer: runCircleReducer,
});
