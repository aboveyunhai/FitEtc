import * as types from '../actions/actionTypes';

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
