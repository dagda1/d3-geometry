import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ResizeComponent } from "./base/resize-component";

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

const TWO_PI = (Math.PI *2);

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

    let state = this.initializeArea(svg, dimensions);

    state = this.addShapes(state);

    state.time = 0;

    this.animate(state, {forward: true});
  }

  progressSineGraph(state, direction) {
    if(direction.forward) {
      state.sineData.push(state.time);
    } else {
      state.sineData.pop();
    }

    state.sineCurve.attr('d', state.sine(state.sineData));
  }

  animate(state, direction) {
    if(direction.forward) {
      state.time += state.increase;
    } else {
      state.time -= state.increase;
    }

    const xTo = state.xScale(state.time);

    const dx = (state.radius * Math.cos(state.time));
    const dy = (state.radius * -Math.sin(state.time));

    state.dot
      .attr('cx', xTo);

    const hypotenuseCentre = xTo - dx;

    const hypotenuseCoords = {
      x1: hypotenuseCentre,
      y1: parseFloat(state.hypotenuse.attr('y1')),
      x2: xTo,
      y2: dy
    };

    state.hypotenuse
      .attr('x1', hypotenuseCoords.x1)
      .attr('x2', hypotenuseCoords.x2)
      .attr('y2', hypotenuseCoords.y2);

    let angle = Math.atan2(
      (hypotenuseCoords.y2 - hypotenuseCoords.y1),
      (hypotenuseCoords.x2 - hypotenuseCoords.x1)
    );

    if(angle > 0) {
      angle = (-2 * (Math.PI) + angle);
    }

    angle = angle + Math.PI / 2;

    const innerArc = d3.svg.arc()
            .innerRadius(8)
            .outerRadius(12)
            .startAngle(Math.PI/2)
            .endAngle(angle);

    const outerArc = d3.svg.arc()
            .innerRadius(state.radius - 1)
            .outerRadius(state.radius + 3)
            .startAngle(Math.PI/2)
            .endAngle(angle);

    state.innerAngle
      .attr('d', innerArc)
      .attr('transform', `translate(${hypotenuseCentre}, 0)`);

    state.outerAngle
      .attr('d', outerArc)
      .attr('transform', `translate(${hypotenuseCentre}, 0)`);

    state.unitCircle.attr('cx', hypotenuseCoords.x1);

    state.opposite
      .attr('x1', xTo)
      .attr('y1', 0)
      .attr('x2', xTo)
      .attr('y2', dy);

    state.adjacent
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', xTo)
      .attr('y2', 0);

    if(direction.forward && state.time > TWO_PI) {
      direction = {backwards: true};
    }

    if(direction.backwards && state.time < 0) {
      state.time = 0;
      direction = {forward: true};
    }

    this.progressSineGraph(state, direction);

    requestAnimationFrame(this.animate.bind(this, state, direction));
  }

  addShapes(state) {
    state.radius = state.yScale(0);

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

    state.hypotenuse = state.xAxisGroup.append('line')
      .attr('class', 'hypotenuse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);

    state.opposite = state.xAxisGroup.append('line')
      .attr('class', 'opposite')
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

    const sine = state.sine = d3.svg.line()
            .interpolate('monotone')
		        .x((d, i) => { return state.xScale(d); })
		        .y((d, i) => { return state.yScale(Math.sin(d) + 1); });

    const sineData = state.sineData = [];

    state.sineCurve = state.xAxisGroup.append('path')
      .attr('class', 'sine-curve');

    state.innerAngle = state.xAxisGroup
      .append("path")
      .attr("class", "arc");

    state.outerAngle = state.xAxisGroup
      .append("path")
      .attr("class", "arc");

    return state;
  }

  initializeArea(container, dimensions) {
    const xScale = d3.scale.linear()
            .domain([0, (TWO_PI)])
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

    const piMap = {"1.57": "π/2", "3.14": "π", "4.71": "3π/2", "6.28": "2π"};

    const xAxis = d3.svg.axis()
            .tickValues(xTickValues)
            .tickFormat((t) => {
              return t === 0 ? '' : piMap[t.toString()];
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

    const leftXAxis = d3.svg.axis()
            .tickValues(xTickValues)
            .tickFormat(() => '')
            .innerTickSize(0)
            .outerTickSize(0)
            .scale(xScale);

    graphContainer
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${-300}, ${yAxisZero})`)
      .call(leftXAxis);

    return {
      xScale,
      yScale,
      graphContainer,
      xAxisGroup,
      yAxisGroup,
      yAxisZero,
      increase: (TWO_PI / 360)
    };
  }

  render(el, props) {
    return (
        <div className="row">
          <div className="row">
            <div id="sine" ref="sine" className="col-lg-6"/></div>
        </div>
    );
  }
}

export default ResizeComponent(Sine);
