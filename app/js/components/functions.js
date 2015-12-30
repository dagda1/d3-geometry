import React, {Component} from 'react';
import {connect} from 'react-redux';

import FunctionPlot from './function-plot';

require("../../css/functions.css");

export default class Functions extends Component {
  componentDidMount() {
    const functionPlot = new FunctionPlot();

    const el = document.querySelector('.plotter');

    functionPlot.render(el);
  }

  render() {
    return (
      <div className="plotter"></div>
    );
  }
};
