import * as types from './actionTypes';

export const setGoal = (newGoal: string) => {
  return {
    type: types.SET_GOAL,
    newGoal,
  };
};
