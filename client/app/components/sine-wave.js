import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  viewPortFromElement
} from "../utils/dom";


require("../styles/sine.scss");

const radius = 90;

export default class SineWave extends Component {
  componentDidMount() {
    const el = this.refs.sine;

    const dimensions = this.getDimensions();

    const xScale = d3.scale.linear()
            .domain([0, 20])
            .range([0, dimensions.width]);

    const yScale = d3.scale.linear()
            .domain([0, 20])
            .range([dimensions.height, 0]);

    const svg = d3.select(el).append("svg")
            .attr('class', 'svg-container')
            .attr("width", dimensions.width)
            .attr("height", dimensions.height);

    const circleGroup = this.addCircleGroup(svg, xScale, yScale);
  }

  resize() {
    const dimensions = this.getDimensions();

    d3.select('svg-container')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
  }

  addCircleGroup(container, xScale, yScale) {
    const x = xScale(12);
    const y = yScale(15);

    const circleGroup = container.append("g")
            .attr("class", "circle-container")
            .attr('transform', `translate(${x}, ${y})`);

    const intTickFormat = d3.format('d');

    const yScaleAxis = d3.scale.linear()
            .domain([-1, 1])
            .range([radius, -radius]);

    const yAxis = d3.svg.axis()
            .orient('left')
            .tickValues([-1, 0, 1])
            .tickFormat(intTickFormat)
            .scale(yScaleAxis);

    circleGroup
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    const firstAxisXCoord = -(radius * 1.5);

    circleGroup
      .append('g')
      .attr('class', 'y axis left')
      .attr("transform", `translate(${firstAxisXCoord}, 0)`)
      .call(yAxis);

    const xScaleAxis = d3.scale.linear()
            .domain([0, (Math.PI * 2)])
            .range([firstAxisXCoord, -x + 20]);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const xAxis = d3.svg.axis()
            .orient('bottom')
            .tickValues(xTickValues)
            .tickFormat(d3.format('.2f'))
            .scale(xScaleAxis);

    circleGroup
      .append('g')
      .attr('class', 'x axis left')
      .call(xAxis);

    circleGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('class', 'outer-circle')
      .style('fill', 'none');

    const guideLine = circleGroup.append('line')
            .attr('class', 'line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', radius)
            .attr('y2', 0);

    const opposite = circleGroup.append('line')
            .attr('class', 'line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const adjacent = circleGroup.append('line')
            .attr('class', 'line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const dot = circleGroup.append('circle')
            .attr('cx', radius)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('class', 'circle-guide')
            .attr('fill-opacity', 0.1);

    const verticalDot = circleGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('class', 'vertical-guide')
            .attr('fill-opacity', 0.1);

    const joiningLine = circleGroup.append('line')
            .attr('class', 'line joining-line')
            .attr('x1', firstAxisXCoord)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    let angle = 0;

    function drawGraph() {
      this.drawSineWave(circleGroup, xTickValues, xScaleAxis, yScaleAxis, angle);

      const increase = ((Math.PI * 2) / 360);

      angle += increase;

      const newX = radius * Math.cos(angle);
      const newY = radius * Math.sin(angle);

      dot
        .attr('cx', newX)
        .attr('cy', newY);

      guideLine
        .attr('x2', newX)
        .attr('y2', newY);

      opposite
        .attr('y1', newY);

      verticalDot
        .attr('cy', newY);

      adjacent
        .attr('x1', verticalDot.attr('cx'))
        .attr('y1', verticalDot.attr('cy'))
        .attr('x2', dot.attr('cx'))
        .attr('y2', dot.attr('cy'));

      joiningLine
        .attr('y1', dot.attr('cy'))
        .attr('x2', dot.attr('cx'))
        .attr('y2', dot.attr('cy'));

      setTimeout(drawGraph.bind(this), 35);
    };

    drawGraph.call(this);


    return circleGroup;
  }

  drawSineWave(container, xTickValues, xScale, yScale, t) {
    const xValues = xTickValues.map(x => x);

    const sineData = xValues.map((x) => {
      return {x: x, y: Math.sin(x)};
    });

    const sine = d3.svg.line()
            .interpolate('monotone')
            .x( (d) => {return xScale(d.x);})
            .y( (d) => {return yScale(d.y);});

    container.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('d', sine);

  }

  render(el, props){
    return (
        <div className="row">
          <div className="row">
            <div id="sine-wave" ref="sine">
            </div>
          </div>
        </div>
    );
  }

  getDimensions() {
    const margin = {
      top: 20,
      right: 50,
      left: 50,
      bottom: 50
    };

    const width = parseInt(d3.select("#sine-wave").style("width"));
    const height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    return {
      margin,
      width,
      height
    };
  }
};
