import {COMPUTE_EXPRESSION} from "../constants";

function computeExpression(expression) {
  return {
    type: COMPUTE_EXPRESSION,
    expression: expression
  };
};

export default { computeExpression };
