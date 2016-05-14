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

    this.svg = d3.select(el).append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

    const g = this.svg.append("g");

    const circle = {x: xScale(18), y: yScale(5), radius: 90};

    g.append('circle')
      .attr('cx', circle.x)
      .attr('cy', circle.y)
      .attr('r', 90)
      .attr('fill-opacity', 0.0)
      .style('stroke', 'black');

    const line = {
      start: circle,
      finish: {x: circle.x, y: circle.y + 90}
    };

    g.append('line')
      .style('stroke', 'blue')
      .attr('class', 'line')
      .attr('x1', line.start.x)
      .attr('y1', line.start.y)
      .attr('x2', line.finish.x)
      .attr('y2', line.finish.y);

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
