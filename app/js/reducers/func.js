import { COMPUTE_EXPRESSION } from "../constants";

const initialState = {
  expression: 'x^3 + 6x'
};

export default function update(state = initialState, action = {}) {
  switch(action.type) {
  case COMPUTE_EXPRESSION:
    // do some stuff

    return state;
  default:
    return state;
  };
};
