import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require("../styles/sine.scss");

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
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    this.addCircleGroup(svg, xScale, yScale);
  }

  addCircleGroup(container, xScale, yScale) {
    const x = xScale(18);
    const y = yScale(5);
    const radius = 90;

    const circleGroup = container.append("g")
            .attr("class", "circle-container")
            .attr('transform', `translate(${x}, ${y})`);

    function rotate() {
      circleGroup.transition()
        .duration(10000)
        .ease('linear')
        .attrTween("transform", function(d, i , a) {
          return function(t) {
            const rotation = t * 360;
            return `translate(${x}, ${y}) rotate(${String(rotation)})`;
          };
        }).each("end", rotate);
    };

    rotate();

    circleGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .style('fill', 'none')
      .style('stroke', 'steelblue');

    circleGroup.append('line')
      .style('stroke', 'steelblue')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', radius)
      .attr('y2', 0);
  }

  render(el, props){
    return (
        <div id="sineWave" className="row">
          <div className="row">
            <div ref="sine">
            </div>
          </div>
        </div>
    );
  }

  getDimensions() {
    const minWidth = window.innerWidth;

    const margin = {
      top: 20,
      right: 50,
      left: 50,
      bottom: 50
    };

    const width = minWidth - margin.left - margin.right;

    const height = 500 - margin.top - margin.bottom;

    return {
      margin,
      width,
      height
    };
  }
};
