import { SET_TRIANGLE_MODE } from '../constants';

export function setTriangleMode(mode) {
  return {
    type: SET_TRIANGLE_MODE,
    payload: {
      mode
    }
  };
};