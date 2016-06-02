import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ResizeComponent } from "./higher-order/resize-component";

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

require("../styles/sine.scss");

const radius = 90;

class Sine extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.createDocument();
  }

  createDocument() {
    const el = this.refs.sine;

    const dimensions = viewPortFromElement(el);

    const svg = d3.select(el).append("svg")
            .attr('class', 'svg-container')
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

    this.addAxis(svg, dimensions);
  }

  addAxis(svg, dimensions) {
    const xScale = d3.scale.linear()
            .domain([-1, ((Math.PI * 2)- 1)])
            .range([0, dimensions.width]);

    const yScale = d3.scale.linear()
            .domain([-1.0, 1.0])
            .range([(dimensions.height / 2), 0]);

  }

  render(el, props) {
    return (
        <div className="row">
          <div className="row">
            <div id="sine" ref="sine"/>
          </div>
        </div>
    );
  }
}

export default ResizeComponent(Sine);
