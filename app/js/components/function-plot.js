import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import math from 'mathjs';

require("../../css/functions.css");

export default class FunctionPlot extends Component {
  componentDidMount() {
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const el = ReactDOM.findDOMNode(this);

    var svg = d3.select(el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scale.linear()
          .range([0, width]);

    const y = d3.scale.linear()
          .range([height, 0]);

    const xAxis = d3.svg.axis()
            .scale(x);

    const yAxis = d3.svg.axis()
      .orient('left')
      .scale(y);

    const line = d3.svg.line()
            .interpolate('basis')
            .x(function (d) {return x(d.x);})
            .y(function (d) {return y(d.y);});

    const expression = math.parse(this.props.expression);

    const fn = (x) => {
      return expression.eval({x: x});
    };

    const data = d3.range(-10, 11).map(function (d) {
      return {x:d, y:fn(d)};
    });

    x.domain(d3.extent(data, function (d) {return d.x;}));
    y.domain([0, d3.max(data, function (d) {return d.y;})]);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + width/2 + ',0)')
      .call(yAxis);

    svg.append('path')
      .datum(data)
      .attr('d', line);
  }

  render() {
    return (
      <div className="plotter"></div>
    );
  }
};
