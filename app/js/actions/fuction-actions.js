import {SET_EXPRESSION, CHANGE_SCALE} from "../constants";

export function setExpression(expression) {
  return {
    type: SET_EXPRESSION,
    expression: expression
  };
};

export function changeScale(min, max) {
  const minX = isNaN(parseInt(min)) ? -10 : parseInt(min);
  const maxX = isNaN(parseInt(max)) ? 11 : parseInt(max);

  return {
    type: CHANGE_SCALE,
    minX: minX,
    maxX: maxX
  };
};
