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

    // this.animateCircle(state, {forward: true});

    this.drawSineGraph(state);
  }

  drawSineGraph(state) {
    const sineData = d3.range(0, 54)
            .map(x => x * 10 / 85)
            .map((x) => {
              return {x: x, y: Math.sin(x)};
            });

    const sine = d3.svg.line()
            .interpolate('monotone')
            .x( (d) => {return state.xScale(d.x);})
            .y( (d) => {return state.yScale(d.y + 1);});

    state.xAxisGroup.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('d', sine);
  }

  animateCircle(state, direction) {
    const twoPI = (Math.PI *2);

    const increase = ((Math.PI * 2) / 360);

    if(direction.forward) {
      state.time += increase;
    } else {
      state.time -= increase;
    }

    const nextX = state.xScale(state.time);

    state.unitCircle.attr('cx', nextX - state.radius);

    const dx = parseFloat(state.unitCircle.attr('cx')) + (state.radius * Math.cos(state.time));
    const dy = parseFloat(state.unitCircle.attr('cy')) + (state.radius * -Math.sin(state.time));

    state.guidingLine
      .attr('x1', nextX - state.radius)
      .attr('x2', dx)
      .attr('y2', dy);

    state.opposite
      .attr('x1', dx)
      .attr('y1', dy)
      .attr('x2', dx)
      .attr('y2', 0);

    state.adjacent
      .attr('x1', nextX - state.radius)
      .attr('x2', dx)
      .attr('y2', 0);

    state.dot
      .attr('cx', dx);

    if(direction.forward && state.time > twoPI) {
      direction = {backwards: true};
    }

    if(direction.backwards && state.time < 0) {
      state.time = 0;
      direction = {forward: true};
    }

    setTimeout(() => {
      requestAnimationFrame(this.animateCircle.bind(this, state, direction));
    }, 0);
  }

  addShapes(state) {
    state.radius = 150;

    const unitCircleCx = 0 - state.radius;

    state.unitCircle = state.xAxisGroup.append('circle')
      .attr('cx', unitCircleCx)
      .attr('cy', 0)
      .attr('r', state.radius)
      .attr('class', 'unit-circle')
      .style('fill', 'none');

    state.dot = state.xAxisGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('class', 'x-circle')
      .attr('r', 10);

    state.guidingLine = state.xAxisGroup.append('line')
      .attr('class', 'ln')
      .attr('x1', unitCircleCx)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);

    state.hypotenuse = state.xAxisGroup.append('line')
      .attr('class', 'hypotenuse ln')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);

    state.opposite = state.xAxisGroup.append('line')
      .attr('class', 'opposite ln')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);

    state.adjacent = state.xAxisGroup.append('line')
      .attr('class', 'adjacent ln')
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

    const yAxisGroup = graphContainer
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

    const xAxisGroup = graphContainer
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${yAxisZero})`)
            .call(xAxis);

    return {
      xScale,
      yScale,
      graphContainer,
      xAxisGroup,
      yAxisGroup,
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
