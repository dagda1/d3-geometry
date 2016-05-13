import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import reducers from './reducers';

import "./polyfills/index";

import App from './components/app';
import Home from './components/home';
import Triangles from './components/triangles';
import LineEquation from './components/equation-of-a-line';
import FunctionContainer from "./components/functions-container";
import SineContainer from "./components/sine-container";

require("../app/styles/style.scss");

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));

const store = createStore(reducer);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="triangles" component={Triangles}/>
        <Route path="equation-of-a-line" component={LineEquation}/>
        <Route path="functions" component={FunctionContainer}/>
        <Route path="sine" component={SineContainer}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('theContent')
);
