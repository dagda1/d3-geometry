import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

require("../styles/sine.scss");

const radius = 90;

export default class Sine extends Component {
  render(el, props) {
    return (
        <div className="row">
          <div className="row">
           <h1>Sine</h1>
          </div>
        </div>
    );
  }
}
