import { createStore } from 'redux';
import AppReducer from '../reducers/AppReducer';

const appStore = createStore(AppReducer);
export default appStore;
