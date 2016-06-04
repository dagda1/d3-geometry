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
      console.log('here');
      state.time -= increase;
      nextX = parseFloat(state.dot.attr('cx')) - state.time;
    }

    state.dot.attr('cx', nextX);

    if(direction.forward && state.time > 5.25) {
      direction = {backwards: true};
    }

    if(direction.backwards && state.time < 0) {
      direction = {forward: true};
    }
    requestAnimationFrame(this.animateCircle.bind(this, state, direction));
  }

  addShapes(state) {
    const radius = 150;

    const offset = 30;

    state.unitCircle = state.graphContainer.append('circle')
      .attr('cx', state.zeroPosition)
      .attr('cy', state.zeroPosition)
      .attr('r', radius)
      .attr('transform', `translate(${-radius + offset}, 0)`)
      .attr('class', 'unit-circle')
      .style('fill', 'none');

    state.radius = state.graphContainer.append('line')
            .attr('class', 'ln')
            .attr('x1', state.zeroPosition)
            .attr('y1', state.zeroPosition)
            .attr('x2', state.zeroPosition - radius + offset)
            .attr('y2', state.zeroPosition);

    state.dot = state.graphContainer.append('circle')
      .attr('cx', state.zeroPosition + offset)
      .attr('cy', state.zeroPosition)
      .attr('class', 'x-circle')
      .attr('r', 10);

    state.hypotenuse = state.graphContainer.append('line')
      .attr('class', 'hypotenuse')
      .attr('x1', state.zeroPosition)
      .attr('y1', state.zeroPosition)
      .attr('x2', state.zeroPosition)
      .attr('y2', state.zeroPosition);

    state.opposite = state.graphContainer.append('line')
            .attr('class', 'opposite')
            .attr('x1', state.zeroPosition)
            .attr('y1', state.zeroPosition)
            .attr('x2', state.zeroPosition)
            .attr('y2', state.zeroPosition);

    state.adjacent = state.graphContainer.append('line')
            .attr('class', 'adjacent')
            .attr('x1', state.zeroPosition)
            .attr('y1', state.zeroPosition)
            .attr('x2', state.zeroPosition)
            .attr('y2', state.zeroPosition);

    return state;
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
      xScale,
      yScale,
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
