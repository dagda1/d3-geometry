import {COMPUTE_EXPRESSION} from "../constants";

export function computeExpression(expression) {
  return {
    type: COMPUTE_EXPRESSION,
    expression: expression
  };
};
