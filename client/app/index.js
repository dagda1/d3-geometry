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
import Sine2Container from "./components/sine2-container";
import Cube from './components/cube';
import Pyramid from './components/pyramid';

import 'bootstrap/dist/css/bootstrap.min.css';

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
        <Route path="sine2" component={Sine2Container}/>
        <Route path="cube" component={Cube}/>
        <Route path="pyramid" component={Pyramid}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('theContent')
);
