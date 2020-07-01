import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import AppReducer from '../reducers/AppReducer';

const appStore = createStore(
  AppReducer,
  applyMiddleware(thunkMiddleware),
);
export default appStore;
