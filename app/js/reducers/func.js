
import { COMPUTE_EXPRESSION } from "../constants";

const initialState = {
  expression: 'x^3 - 3x^2 + 3^x -1'
};

export default function update(state = initialState, action = {}) {
  switch(action) {
  case COMPUTE_EXPRESSION:
    console.log(action.expression);

    break;
  default:
    throw new Error(`Unknown action type ${action} passed to update`);
  };

  return state;
};
