import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import reducers from './reducers';

import "./polyfills/index";

import App from './components/app';
import Home from './components/Home/Home';
import Triangles from './components/Triangles/Triangles';
import LineEquation from './components/Line/EquationOfaLine';
import FunctionPlot from './components/FunctionPlot/FunctionPlot';
import SineWave from './components/SineWave/SineWave';
import Sine2 from './components/Sine2/Sine2';
import Cube from './components/Cube/Cube'
import Pyramid from './components/Pyramid/Pyramid';
import Hexagon from './components/Hexagon/Hexagon';
import Circle from './components/Circle/Circle';

import 'bootstrap/dist/css/bootstrap.min.css';

require('../app/styles/style.scss');

const store = createStore(reducers);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="triangles" component={Triangles}/>
        <Route path="equation-of-a-line" component={LineEquation}/>
        <Route path="functions" component={FunctionPlot}/>
        <Route path="sine" component={SineWave}/>
        <Route path="sine2" component={Sine2}/>
        <Route path="cube" component={Cube}/>
        <Route path="pyramid" component={Pyramid}/>
        <Route path="hexagon" component={Hexagon}/>
        <Route path="circle" component={Circle} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('theContent')
);
