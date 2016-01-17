import { SET_EXPRESSION } from "../constants";

const initialState = {
  expression: '-3x^2 + 2'
};

export default function update(state = initialState, action = {}) {
  switch(action.type) {
  case SET_EXPRESSION:
    return {expression: action.expression};

  default:
    return state;
  };
};
