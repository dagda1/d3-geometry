import React, {Component} from 'react';
import {connect} from 'react-redux';

import FunctionPlot from './function-plot';

require("../../css/functions.css");

export default class FunctionContainer extends Component {
  render() {
    return (
      <FunctionPlot/>
    );
  }
};
