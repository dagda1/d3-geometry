import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import math from 'mathjs';

require("../../css/functions.css");

export default class FunctionPlot extends Component {
  handleSubmit(e) {
    if(e.which !== 13) {
      return;
    }

    this.setExpression();
  }

  handleBlur() {
    this.setExpression();
  }

  setExpression() {
    this.props.setExpression(this.refs.expressionInput.value);
  }

  componentDidMount() {
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const el = ReactDOM.findDOMNode(this);

    this.svg = d3.select(el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.xScale = d3.scale.linear()
          .range([0, width]);

    this.yScale = d3.scale.linear()
          .range([height, 0]);

    const xAxis = d3.svg.axis()
            .scale(this.xScale);

    const yAxis = d3.svg.axis()
            .orient('left')
            .scale(this.yScale);

    const data = this.getDataFromProps(this.props.expression);

    this.xScale.domain(d3.extent(data, function (d) {return d.x;}));
    this.yScale.domain([0, 10]);

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + width/2 + ',0)')
      .call(yAxis);

    this.drawCurve(this.props.expression);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.expression === this.props.expression) {
      return;
    }

    this.drawCurve(nextProps.expression);
  }

  getDataFromProps(expr) {
    const expression = math.parse(expr);

    const fn = (x) => {
      return expression.eval({x: x});
    };

    return d3.range(-10, 11).map(function (d) {
      return {x:d, y:fn(d)};
    });
  }

  drawCurve(expression) {
    d3.select('.curve').remove();

    const xScale = this.xScale;
    const yScale = this.yScale;
    const data = this.getDataFromProps(expression);

    const line = d3.svg.line()
            .interpolate('basis')
            .x(function (d) {return xScale(d.x);})
            .y(function (d) {return yScale(d.y);});

    this.svg.append('path')
      .datum(data)
      .attr('class', 'curve')
      .attr('d', line);
  }

  render() {
    return (
      <div className="plotter">
        <h1>{this.props.expression}</h1>
        <div></div>
        <div><input type="text"
                    defaultValue={this.props.expression}
                    onKeyDown={this.handleSubmit.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    ref="expressionInput"
             />
             <button className="btn btn-primary" onClick={this.setExpression.bind(this)}>Go</button>
        </div>
      </div>
    );
  }
};
