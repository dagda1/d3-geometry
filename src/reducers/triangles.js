import { SET_TRIANGLE_MODE } from '../constants';

const initialState = {
  mode: 'Perpendicular Bisectors'
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_TRIANGLE_MODE:
      return Object.assign({}, {
        mode: action.payload.mode
      })
    default:
      return state;
  }
};