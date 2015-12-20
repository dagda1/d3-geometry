import React from "react";
import ReactDOM from "react-dom";

import App from './components/app.js';

require('bootstrap/dist/css/bootstrap.css');

ReactDOM.render(
  <App />,
  document.querySelector('.container')
);
