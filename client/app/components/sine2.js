import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ResizeComponent } from "./base/resize-component";

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

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

    let state = this.addAxis(svg, dimensions);

    state = this.addShapes(state);

    state.time = 0;

    this.animateCircle(state, {forward: true});
  }

  animateCircle(state, direction) {
    const twoPI = (Math.PI *2);

    const increase = (twoPI / 360);

    let nextX;

    if(direction.forward) {
      state.time += increase;
      nextX = parseFloat(state.dot.attr('cx')) + state.time;
    } else {
      state.time -= increase;
      nextX = parseFloat(state.dot.attr('cx')) - state.time;
    }

    state.dot.attr('cx', nextX);

    if(direction.forward && state.time > 5.25) {
      direction = {backwards: true};
    }

    if(direction.backwards && (nextX < 5.26)) {
      state.time = 0;
      direction = {forward: true};
      state.dot.attr('cx', 0);
    }

    requestAnimationFrame(this.animateCircle.bind(this, state, direction));
  }

  addShapes(state) {
    state.radius = 150;

    const unitCircleCx = 0 - state.radius;

    state.unitCircle = state.graphContainer.append('circle')
      .attr('cx', unitCircleCx)
      .attr('cy', state.yAxisZero)
      .attr('r', state.radius)
      .attr('class', 'unit-circle')
      .style('fill', 'none');

    state.guidingLine = state.graphContainer.append('line')
            .attr('class', 'ln')
            .attr('x1', unitCircleCx)
            .attr('y1', state.yAxisZero)
            .attr('x2', state.yAxisZero - state.radius)
            .attr('y2', state.yAxisZero);

    state.dot = state.graphContainer.append('circle')
      .attr('cx', 0)
      .attr('cy', state.yAxisZero)
      .attr('class', 'x-circle')
      .attr('r', 10);

    state.hypotenuse = state.graphContainer.append('line')
      .attr('class', 'hypotenuse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);

    state.opposite = state.graphContainer.append('line')
            .attr('class', 'opposite')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    state.adjacent = state.graphContainer.append('line')
            .attr('class', 'adjacent')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    return state;
  }

  addAxis(container, dimensions) {
    const xScale = d3.scale.linear()
            .domain([0, ((Math.PI * 2))])
            .range([0, (dimensions.width)]);

    const yScale = d3.scale.linear()
            .domain([-1.0, 1.0])
            .range([(dimensions.height - 100), 0]);

    const graphContainer = container.append("g")
            .attr("class", "graph-container")
            .attr('transform', `translate(${xScale(1.5)}, ${yScale(0.5)})`);

    const yAxis = d3.svg.axis()
            .tickValues([-1.0, -0.5, 0, 0.5, 1.0])
            .outerTickSize(0)
            .orient('left')
            .scale(yScale);

    graphContainer
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const xAxis = d3.svg.axis()
            .tickValues(xTickValues)
            .tickFormat((t) => {
              return t === 0 ? '' : t;
            })
            .scale(xScale);

    const findZeroTick = (data) => {
      return data === 0.0;
    };

    const yAxisZero = graphContainer.selectAll(".y.axis .tick").filter(findZeroTick).map((tick) => {
        return d3.transform(d3.select(tick[0]).attr('transform')).translate[1];
    })[0];

    graphContainer
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${yAxisZero})`)
      .call(xAxis);

    return {
      xScale,
      yScale,
      graphContainer,
      xAxis,
      yAxis,
      yAxisZero
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
