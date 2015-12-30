import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import reducers from './reducers';

import "./polyfills/index";

import App from './components/app';
import Home from './components/home';
import Triangles from './components/triangles';
import LineEquation from './components/equation-of-a-line';
import Functions from "./components/functions";

require("../css/style.css");

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const store = createStore(reducer);
const history = createHistory();

syncReduxAndRouter(history, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="triangles" component={Triangles}/>
        <Route path="equation-of-a-line" component={LineEquation}/>
        <Route path="functions" component={Functions}/>
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.container')
);
