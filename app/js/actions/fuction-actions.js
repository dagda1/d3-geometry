import {SET_EXPRESSION, CHANGE_SCALE} from "../constants";

export function setExpression(expression) {
  return {
    type: SET_EXPRESSION,
    expression: expression
  };
};

export function changeScale(min, max) {
  const calculateMax = (min) => {
    if(isNaN(max)) {
      max = 11;
    }

    if((max - min) < 3) {
      return (min + 5);
    }

    return max;
  };

  const minX = isNaN(parseInt(min)) ? -10 : parseInt(min);
  const maxX = calculateMax(min, parseInt(max));

  return {
    type: CHANGE_SCALE,
    minX: minX,
    maxX: maxX
  };
};
