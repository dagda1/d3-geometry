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
    const el = this.refs.curve;

    const margin = {top: 10, right: 50, bottom: 20, left: 50};

    const width = 500 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;


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
    this.yScale.domain([0, d3.max(data, function (d) {return d.y;})]);

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

  componentDidUpdate() {
    this.queueMathJax();
  }

  queueMathJax() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.expr]);
  }

  render() {
    const latextExpression = '$$' + math.parse(this.props.expression).toTex() + '$$';

    return (
      <div className="plotter">
        <h2 ref="expr" className="col-xs-offset-3 col-md-offset-1">{latextExpression}</h2>
        <div ref="curve"></div>
        <div className="form-horizontal">
          <div className="form-group">
             <fieldset className="field-set col-xs-12 col-md-4 col-xs-offset-1">
              <legend>Enter Expression</legend>
              <div className="expression col-xs-10 col-md-10">
                <input type="text"
                    className="form-control input-md"
                    defaultValue={this.props.expression}
                    onKeyDown={this.handleSubmit.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    ref="expressionInput"
                />
              </div>
              <button className="btn btn-primary btn-responsive" onClick={this.setExpression.bind(this)}>Go</button>
            </fieldset>
          </div>
        </div>
      </div>
    );
  }
};
