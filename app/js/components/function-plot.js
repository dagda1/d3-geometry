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

  getDimensions() {
    const margin = {top: 10, right: 50, bottom: 20, left: 50};

    const width = 500 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    return {margin: margin, height: height, width: width};
  }

  componentDidMount() {
    const el = this.refs.curve;

    const dimensions = this.getDimensions();

    this.svg = d3.select(el).append("svg")
          .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
          .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
          .append("g")
          .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

    this.xScale = d3.scale.linear()
          .range([0, dimensions.width]);

    this.yScale = d3.scale.linear()
          .range([dimensions.height, 0]);

    const data = this.getDataFromProps(this.props.expression);

    this.drawAxis(data);

    this.drawCurve(data);

    if(!window.MathJax){
      return;
    }

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.expr]);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.expression === this.props.expression) {
      return;
    }

    const data = this.getDataFromProps(nextProps.expression);

    d3.selectAll('.axis').remove();

    this.drawAxis(data);

    this.drawCurve(data);
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

  drawCurve(data) {
    d3.select('.curve').remove();

    const xScale = this.xScale;
    const yScale = this.yScale;

    const line = d3.svg.line()
            .interpolate('basis')
            .x(function (d) {return xScale(d.x);})
            .y(function (d) {return yScale(d.y);});

    this.svg.append('path')
      .datum(data)
      .attr('class', 'curve')
      .attr('d', line);
  }

  drawAxis(data) {
    const xAxis = d3.svg.axis()
            .scale(this.xScale);

    const yAxis = d3.svg.axis()
            .orient('left')
            .scale(this.yScale);

    const dimensions = this.getDimensions();

    this.xScale.domain(d3.extent(data, function (d) {return d.x;}));

    let yScaleDomain, xAxisPosition;

    const minY = d3.min(data, (d) => { return d.y; });
    const maxY = d3.max(data, (d) => { return d.y; });

    if(minY >= 0 && maxY >= 0) {
      yScaleDomain = [0, d3.max(data, function (d) {return d.y;})];
      xAxisPosition = dimensions.height;
    } else if(minY < 0 && maxY > 0) {
      const yValues = data.map((d) => { return d.y; });

      const zeroIndex = Math.floor(yValues.indexOf(0));
      const yLength = Math.floor(yValues.length);
      const yIndex = Math.floor(yLength - zeroIndex);
      yScaleDomain = d3.extent(data, function (d) {return d.y;});
      xAxisPosition = ((dimensions.height/yLength) * yIndex) + - 9.1;
    } else {
      yScaleDomain = d3.extent(data, function (d) {return d.y;});
      xAxisPosition = 0;
    }

    this.yScale.domain(yScaleDomain);

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + xAxisPosition + ')')
      .call(xAxis);

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + dimensions.width/2 + ',0)')
      .call(yAxis);}

  componentDidUpdate() {
    this.queueMathJax();
  }

  queueMathJax() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.expr]);
  }

  render() {
    const latextExpression = '$$ f(x) = ' + math.parse(this.props.expression).toTex() + '$$';

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
