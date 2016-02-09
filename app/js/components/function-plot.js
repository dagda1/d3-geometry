import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import math from 'mathjs';

import "../plugins/mathdiff.js";

import {
  getYIntercept
} from "../utils/line";


require("../../css/functions.css");

export default class FunctionPlot extends Component {
  handleSubmit(fn, e) {
    if(e.which !== 13) {
      return;
    }

    fn();
  }

  handleExpressionBlur() {
    this.setExpression();
  }

  setExpression() {
    this.props.setExpression(this.refs.expressionInput.value);
  }

  handleXScaleBlur() {
    this.setXRange();
  }

  setXRange() {
    const minX = this.refs.lowerX.value;
    const maxX = this.refs.upperX.value;

    this.props.changeScale(minX, maxX);
  }

  getDimensions() {
    const margin = {top: 10, right: 50, bottom: 20, left: 50};

    const width = 500 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    return {margin: margin, height: height, width: width};}

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

    const data = this.getDataFromProps(this.props);

    this.drawAxes(data);

    this.drawCurve(data);

    if(!window.MathJax){
      return;
    }

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.refs.expr]);
  }

  componentWillReceiveProps(nextProps) {
    const data = this.getDataFromProps(nextProps);

    d3.selectAll('.axis').remove();

    this.drawAxes(data);

    this.drawCurve(data);
  }

  getDataFromProps(state) {
    const expression = math.parse(state.expression);

    const fn = (x) => {
      return expression.eval({x: x});
    };

    return d3.range(state.minX, state.maxX).map( (d) => {
      return {x:d, y:fn(d)};
    });
  }

  drawCurve(data) {
    d3.select('.curve').remove();
    d3.select('.diff').remove();
    d3.select('.difflabel').remove();
    d3.select('.tangent').remove();

    const xScale = this.xScale;
    const yScale = this.yScale;
    const svg = this.svg;

    const line = d3.svg.line()
            .interpolate('basis')
            .x( (d) => {return xScale(d.x);})
            .y( (d) => {return yScale(d.y);});

    const me = this;

    const g = svg.append('g');

    g.append('circle')
      .attr('class', 'diff')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 7)
      .style('fill', 'red');

    g.append('text')
      .attr('class', 'difflabel');

    g.append('line')
      .style('stroke', 'red')
      .attr('class', 'tangent')
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', xScale(0))
      .attr('y2', yScale(0));

    const maxX = d3.max(data, (d) => d.x);

    const mouseMove = function() {
      const m = d3.mouse(d3.select('.curve').node());

      let x = m[0];

      let y = yScale(math.parse(me.props.expression).eval({
        x: xScale.invert(x)
      }));

      const point = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };

      if(point.x > maxX) {
        const maxY = _.find(data, (d) => d.x === maxX).y;

        point.x = maxX;
        point.y = maxY;

        x = xScale(maxX);
        y = yScale(maxY);
      }

      g.select('.diff')
        .attr('cx', x)
        .attr('cy', y);

      g.select('.difflabel')
        .text( function() {
          const xLabel = Math.round(point.x);
          const yLabel = Math.round(point.y);

          return `(${xLabel}, ${yLabel})`;
        })
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

      g.select('.tangent')
        .attr('x1', xScale(tangentPoint1.x))
        .attr('y1', yScale(tangentPoint1.y))
        .attr('x2', xScale(tangentPoint2.x))
        .attr('y2', yScale(tangentPoint2.y));
    };

    this.svg.append('path')
      .datum(data)
      .attr('class', 'curve')
      .attr('d', line);

    d3.select('svg').on('mousemove', mouseMove);
  }

  drawAxes(data) {
    const xAxis = d3.svg.axis()
            .scale(this.xScale);

    const yAxis = d3.svg.axis()
            .orient('left')
            .scale(this.yScale);

    const dimensions = this.getDimensions();

    this.xScale.domain(d3.extent(data, (d) => d.x));

    const minY = d3.min(data, (d) => d.y);
    const maxY = d3.max(data, (d) => d.y);

    const nonNegativeXAxis = minY >= 0 && maxY >= 0;
    const positiveAndNegativeXAxis = minY < 0 && maxY > 0;

    let yScaleDomain, xAxisPosition;

    if(nonNegativeXAxis) {
      yScaleDomain = [0, d3.max(data, (d) => d.y)];
    }  else {
      yScaleDomain = d3.extent(data, (d) => d.y);
    }

    this.yScale.domain(yScaleDomain);

    const findZeroTick = (data) => {
      return data === 0;
    };

    this.svg.append('g')
      .attr('class', 'axis y-axis')
      .style('visibility', 'hidden')
      .call(yAxis);

    if(nonNegativeXAxis) {
      yScaleDomain = [0, d3.max(data, (d) => d.y)];
      xAxisPosition = dimensions.height;
    } else if(positiveAndNegativeXAxis) {
      xAxisPosition = this.svg.selectAll(".tick").filter(findZeroTick).map((tick) => {
        return d3.transform(d3.select(tick[0]).attr('transform')).translate[1];
      });
    } else {
      yScaleDomain = d3.extent(data, (d) => d.y);
      xAxisPosition = 0;
    }

    this.svg.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${xAxisPosition})`)
      .call(xAxis);

    d3.select('.y-axis').remove();

    const minX = d3.min(data, (d) => d.x);
    const maxX = d3.max(data, (d) => d.y);

    const positiveXOnly = minX > 0 && maxX > 0;
    const negativeXOnly = minX < 0 && maxX < 0;

    let yAxisPosition;

    if(positiveXOnly) {
      yAxisPosition = 0;
    } else if(negativeXOnly) {
      yAxisPosition = dimensions.width;
    } else {
      yAxisPosition = this.svg.selectAll(".x-axis .tick").filter(findZeroTick).map((tick) => {
        return d3.transform(d3.select(tick[0]).attr('transform')).translate[0];
      });
    }

    this.svg.append('g')
      .attr('class', 'axis y-axis')
      .attr('transform', `translate(${yAxisPosition}, 0)`)
      .call(yAxis);

    const expression = this.props.expression;

    const svg = this.svg;
    const xScale = this.xScale;
    const yScale = this.yScale;

    const clickable = function (data){
      const tick = d3.select(this);

      const transform = d3.transform(tick.attr("transform")).translate;

      const fn = (x) => {
        return math.parse(expression).eval({x: x});
      };

      const y = fn(data);

      svg.append('line')
        .attr('x1', xScale(data))
        .attr('y1', yScale(0))
        .attr('x2', xScale(data))
        .attr('y2', yScale(y));
    };

    d3.selectAll('.x-axis .tick').on('click', clickable);
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

  componentWillUnmount() {
    d3.select('.x-axis').on('click', null);
    d3.select('svg').on('mousemove', null);
  }

  render() {
    const latextExpression = '$$ f(x) = ' + math.parse(this.props.expression).toTex() + '$$';

    return (
      <div className="plotter row">
        <div className="row">
          <h2 ref="expr" className="col-xs-offset-3 col-md-offset-1">{latextExpression}</h2>
          <div className="col-lg-4 col-md-6 col-xs-12 function-curve">
            <div ref="curve"></div>
          </div>
          <div className="function-dashboard col-lg-3 col-md-5 col-xs-9">
            <div className="form-horizontal">
              <div className="form-group">
                <fieldset className="field-set">
                  <legend>Enter Expression</legend>
                  <div className="expression col-xs-10 col-md-10">
                    <input type="text"
                      className="form-control input-md"
                      defaultValue={this.props.expression}
                      onKeyDown={this.handleSubmit.bind(this, this.setExpression.bind(this))}
                      onBlur={this.handleExpressionBlur.bind(this)}
                      ref="expressionInput"
                    />
                  </div>
                  <button className="btn btn-primary btn-responsive" onClick={this.setExpression.bind(this)}>Go</button>
                </fieldset>
                <fieldset className="field-set window">
                  <legend>X Range</legend>
                     <input type="text"
                      className="form-control input-md limits"
                      defaultValue={this.props.minX}
                      onBlur={this.handleXScaleBlur.bind(this)}
                      onKeyDown={this.handleSubmit.bind(this, this.setXRange.bind(this))}
                      ref="lowerX"
                     />

                    <label>&lt; x &lt;</label>

                    <input type="text"
                      className="form-control input-md limits"
                      defaultValue={this.props.maxX}
                      onBlur={this.handleXScaleBlur.bind(this)}
                      onKeyDown={this.handleSubmit.bind(this, this.setXRange.bind(this))}
                      ref="upperX"
                     />
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
