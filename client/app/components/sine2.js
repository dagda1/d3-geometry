import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ResizeComponent } from "./base/resize-component";

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

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
            .attr('class', 'sine2-container')
            .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
            .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.top)
            .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

    const state = this.addAxis(svg, dimensions);

    this.addCircle(state);
  }

  addCircle(state) {
    const radius = 150;

    const unitCircle = state.graphContainer.append('circle')
            .attr('cx', state.zeroPosition)
            .attr('cy', state.zeroPosition)
            .attr('r', radius)
            .attr('transform', `translate(${-radius + 30}, 0)`)
            .attr('class', 'unit-circle')
            .style('fill', 'none');

    const line = state.graphContainer.append('line')
            .attr('x1', state.zeroPosition)
            .attr('y1', state.zeroPosition)
            .attr('x2', state.zeroPosition - radius + 30)
            .attr('y2', state.zeroPosition);

    const smallCircle = state.graphContainer.append('circle')
            .attr('cx', state.zeroPosition + 30)
            .attr('cy', state.zeroPosition)
            .attr('r', 10)
  }

  addAxis(container, dimensions) {
    const graphContainer = container.append("g")
            .attr("class", "graph-container");

    const xScale = d3.scale.linear()
            .domain([0, ((Math.PI * 2))])
            .range([0, (dimensions.width)]);

    const yScale = d3.scale.linear()
            .domain([-1.0, 1.0])
            .range([(dimensions.height - 100), 0]);

    const xPosition = xScale(1.5);

    const yAxis = d3.svg.axis()
            .tickValues([-1.0, -0.5, 0, 0.5, 1.0])
            .outerTickSize(0)
            .orient('left')
            .scale(yScale);

    const yOffset = 10;

    graphContainer
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${xPosition}, ${yOffset})`)
      .call(yAxis);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const xAxis = d3.svg.axis()
            .tickValues(xTickValues)
            .tickFormat((t) =>{
              return t === 0 ? '' : t;
            })
            .scale(xScale);

    const findZeroTick = (data) => {
      return data === 0.0;
    };

    const zeroPosition = graphContainer.selectAll(".y.axis .tick").filter(findZeroTick).map((tick) => {
        return d3.transform(d3.select(tick[0]).attr('transform')).translate[1];
    })[0];

    graphContainer
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${xPosition - 4}, ${zeroPosition + yOffset})`)
      .call(xAxis);

    return {
      graphContainer,
      xAxis,
      yAxis,
      zeroPosition: zeroPosition + yOffset
    };
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
