import {SET_EXPRESSION} from "../constants";

export function setExpression(expression) {
  return {
    type: SET_EXPRESSION,
    expression: expression
  };
};
