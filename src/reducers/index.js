import func from './func';
import triangles from './triangles';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default combineReducers(Object.assign({}, {
  func,
  triangles,
},
{ routing: routerReducer })
);
