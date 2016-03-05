import { SET_EXPRESSION, CHANGE_SCALE } from "../constants";

const initialState = {
  expression: 'x^2 - 20',
  minX: -10,
  maxX: 11
};

export default function update(state = initialState, action = {}) {
  switch(action.type) {
  case SET_EXPRESSION:
    return {
      expression: action.expression,
      minX: state.minX,
      maxX: state.maxX
    };

  case CHANGE_SCALE:
    return {
      expression: state.expression,
      minX: action.minX,
      maxX: action.maxX
    };

  default:
    return state;
  };
};
