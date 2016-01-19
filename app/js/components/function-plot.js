import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import math from 'mathjs';

import "../plugins/mathdiff.js";

import {
  getYIntercept
} from "../utils/line";


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

    this.drawAxes(data);

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

    this.drawAxes(data);

    this.drawCurve(data);
  }

  getDataFromProps(expr) {
    const expression = math.parse(expr);


    const fn = (x) => {
      return expression.eval({x: x});
    };

    return d3.range(-10, 11).map( (d) => {
      return {x:d, y:fn(d)};
    });
  }

  drawCurve(data) {
    d3.select('.curve').remove();

    const xScale = this.xScale;
    const yScale = this.yScale;
    const svg = this.svg;

    const line = d3.svg.line()
            .interpolate('basis')
            .x( (d) => {return xScale(d.x);})
            .y( (d) => {return yScale(d.y);});

    const me = this;

    const mouseOver = function() {
      const m = d3.mouse(this);
      const x = m[0];
      const y = m[1];

      const g = svg.append('g');

      g.append('circle')
        .attr('class', 'diff')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 7)
        .style('fill', 'red');

      const point = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };

      g.append('text')
        .text( function() {
          const xLabel = Math.round(point.x);
          const yLabel = Math.round(point.y);

          return `(${xLabel}, ${yLabel})`;
        })
        .attr('class', 'difflabel')
        .attr('dx', x + 10)
        .attr('dy', y + 8);

      const derivative = math.diff(math.parse(me.props.expression), "x");

      const gradient = derivative.eval({x: point.x});

      const yIntercept = getYIntercept(point, gradient);

      const lineEquation = math.parse("m * x + c");


      const getTangentPoint = (delta) => {
        const deltaX = xScale.invert(x + delta);

        const tangentPoint = {
          x: deltaX,
          y: lineEquation.eval({
            m: gradient,
            x: deltaX,
            c: yIntercept
          })
        };

        return tangentPoint;
      };

      const length = xScale(200);

      const tangentPoint1 = getTangentPoint(+ length);
      const tangentPoint2 = getTangentPoint(- length);

      g.append('line')
        .style('stroke', 'red')
        .attr('class', 'tangent')
        .attr('x1', xScale(tangentPoint1.x))
        .attr('y1', yScale(tangentPoint1.y))
        .attr('x2', xScale(tangentPoint2.x))
        .attr('y2', yScale(tangentPoint2.y));
    };

    const mouseOut = function() {
      d3.selectAll('.diff').remove();
      d3.selectAll('.difflabel').remove();
      d3.selectAll('.tangent').remove();
    };

    d3.select('.curve')
      .on('mouseover', null)
      .on('mouseout', null);

    this.svg.append('path')
      .datum(data)
      .attr('class', 'curve')
      .attr('d', line)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);
  }

  drawAxes(data) {
    const xAxis = d3.svg.axis()
            .scale(this.xScale);

    const yAxis = d3.svg.axis()
            .orient('left')
            .scale(this.yScale);

    const dimensions = this.getDimensions();

    this.xScale.domain(d3.extent(data,  (d) => {return d.x;}));

    const minY = d3.min(data, (d) => { return d.y; });
    const maxY = d3.max(data, (d) => { return d.y; });

    const nonNegativeAxis = minY >= 0 && maxY >= 0;
    const positiveAndNegativeAxis = minY < 0 && maxY > 0;

    let yScaleDomain, xAxisPosition;

    if(nonNegativeAxis) {
      yScaleDomain = [0, d3.max(data, (d) => {return d.y;})];
    }  else {
      yScaleDomain = d3.extent(data, (d) => {return d.y;});
    }

    this.yScale.domain(yScaleDomain);

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + dimensions.width/2 + ',0)')
      .call(yAxis);

    if(nonNegativeAxis) {
      yScaleDomain = [0, d3.max(data, (d) => {return d.y;})];
      xAxisPosition = dimensions.height;
    } else if(positiveAndNegativeAxis) {
      xAxisPosition = this.svg.selectAll(".tick").filter((data) => {
        return data === 0;
      }).map((tick) => {
        return d3.transform(d3.select(tick[0]).attr('transform')).translate[1];
      });
    } else {
      yScaleDomain = d3.extent(data, (d) => {return d.y;});
      xAxisPosition = 0;
    }

    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + xAxisPosition + ')')
      .call(xAxis);
  }

  componentDidUpdate() {
    this.queueMathJax();
  }

  queueMathJax() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.expr]);
  }

  convertPoint(point) {
    return {
      x: this.xScale.invert(point.x),
      y: this.yScale.invert(point.y)
    };
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
