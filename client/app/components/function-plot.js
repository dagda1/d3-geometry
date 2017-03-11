import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { find } from 'lodash';
import math from 'mathjs';
import * as X from './index';
import "../plugins/mathdiff.js";

import {
  getYIntercept
} from "../utils/line";

import { select, selectAll, event, mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { drag } from 'd3-drag';
import { format } from 'd3-format';
import { range } from 'd3-array';
import { line, curveMonotoneX, curveBasis, arc } from 'd3-shape';
import { max, min, extent } from 'd3-array';
import { transform } from 'd3-zoom';

require("../styles/functions.scss");

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
    this.props.setExpression(this.expressionInput.value);
  }

  handleXScaleBlur() {
    this.setXRange();
  }

  setXRange() {
    const minX = this.lowerX.value;
    const maxX = this.upperX.value;

    this.props.changeScale(minX, maxX);
  }

  getDimensions() {
    const margin = {top: 10, right: 50, bottom: 20, left: 50};

    const width = 500 - margin.left - margin.right;
    const height = 380 - margin.top - margin.bottom;

    return {margin: margin, height: height, width: width};
  }

  componentDidMount() {
    const el = this.curve;

    const dimensions = this.getDimensions();

    this.svg = select(el).append("svg")
      .attr('class', 'function-svg')
      .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
      .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
      .append("g");

    this.xScale = scaleLinear()
          .range([0, dimensions.width]);

    this.yScale = scaleLinear()
          .range([dimensions.height, 0]);

    const data = this.getDataFromProps(this.props);

    this.drawAxes(data);

    this.drawCurve(data);

    if(!window.MathJax){
      return;
    }

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.expr]);
  }

  componentWillReceiveProps(nextProps) {
    const data = this.getDataFromProps(nextProps);

    selectAll('.axis').remove();

    this.drawAxes(data);

    this.drawCurve(data);
  }

  getDataFromProps(state) {
    const expression = math.parse(state.expression);

    const fn = (x) => {
      return expression.eval({x: x});
    };

    return range(state.minX, state.maxX).map( (d) => {
      return {x:d, y:fn(d)};
    });
  }

  drawCurve(data) {
    select('.curve').remove();
    select('.diff').remove();
    select('.difflabel').remove();
    select('.tangent').remove();

    const xScale = this.xScale;
    const yScale = this.yScale;
    const svg = this.svg;

    const lin = line()
            .curve(curveBasis)
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

    const maxX = max(data, (d) => d.x);

    const mouseMove = function() {
      const m = mouse(select('.curve').node());

      let x = m[0];

      let y = yScale(math.parse(me.props.expression).eval({
        x: xScale.invert(x)
      }));

      const point = {
        x: xScale.invert(x),
        y: yScale.invert(y)
      };

      if(point.x > maxX) {
        const maxY = find(data, (d) => d.x === maxX).y;

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
      .attr('d', lin);

    select('.function-svg').on('mousemove', mouseMove);
  }

  drawAxes(data) {
    const xAxis = axisBottom(this.xScale);

    const yAxis = axisLeft(this.yScale);

    const dimensions = this.getDimensions();

    this.xScale.domain(extent(data, (d) => d.x));

    const minY = min(data, (d) => d.y);
    const maxY = max(data, (d) => d.y);

    const nonNegativeXAxis = minY >= 0 && maxY >= 0;
    const positiveAndNegativeXAxis = minY < 0 && maxY > 0;

    let yScaleDomain, xAxisPosition;

    if(nonNegativeXAxis) {
      yScaleDomain = [0, max(data, (d) => d.y)];
    }  else {
      yScaleDomain = extent(data, (d) => d.y);
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
      yScaleDomain = [0, max(data, (d) => d.y)];
      xAxisPosition = dimensions.height;
    } else if(positiveAndNegativeXAxis) {
      xAxisPosition = this.svg.selectAll(".tick").filter(findZeroTick)._groups
                          .map((tick) => {
                            return parseFloat(select(select(tick[0])._groups[0][0]).attr('transform').split(',')[1].replace(/\)/, ''), 10)
                          });
    } else {
      yScaleDomain = extent(data, (d) => d.y);
      xAxisPosition = 0;
    }

    this.svg.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${xAxisPosition})`)
      .call(xAxis);

    select('.y-axis').remove();

    const minX = min(data, (d) => d.x);
    const maxX = max(data, (d) => d.y);

    const positiveXOnly = minX > 0 && maxX > 0;
    const negativeXOnly = minX < 0 && maxX < 0;

    let yAxisPosition;

    if(positiveXOnly) {
      yAxisPosition = 0;
    } else if(negativeXOnly) {
      yAxisPosition = dimensions.width;
    } else {
      yAxisPosition = selectAll(".x-axis .tick").filter(findZeroTick)._groups.map((tick) => {
        return parseFloat(/\(([^)]+)\,/.exec(select(tick[0]).attr('transform'))[1]);
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
      const tick = select(this);

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

    selectAll('.x-axis .tick').on('click', clickable);
  }

  componentDidUpdate() {
    this.queueMathJax();
  }

  queueMathJax() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.expr]);
  }

  convertPoint(point) {
    return {
      x: this.xScale.invert(point.x),
      y: this.yScale.invert(point.y)
    };
  }

  componentWillUnmount() {
    select('.x-axis').on('click', null);
    select('svg').on('mousemove', null);
  }

  render() {
    const latextExpression = '$$ f(x) = ' + math.parse(this.props.expression).toTex() + '$$';

    return (
      <X.Grid>
        <X.Row className="plotter">
          <X.Col md={5}>
             <h2 ref={el => this.expr = el}>{latextExpression}</h2>
             <div>
                 <div ref={el => this.curve = el}></div>
             </div>
          </X.Col>
         <X.Col md={5}>
           <X.Row>
               <X.Col lg={6} lg-offset={0} md={6} md-offset={0} sm={4} sm-offset={1} xs={7} xs-offset={3} className="mt-20">
                   <div className="panel panel-default text-center">
                       <div className="panel-heading">
                           <label>Enter Expression</label>
                       </div>
                       <div className="panel-body">
                           <div className="input-group">
                               <input type="text"
                                      defaultValue={this.props.expression}
                                      onKeyDown={this.handleSubmit.bind(this, this.setExpression.bind(this))}
                                      onBlur={this.handleExpressionBlur.bind(this)}
                                      ref={el => this.expressionInput = el}
                                      className="form-control"
                               />
                               <span className="input-group-btn">
                                   <button className="btn btn-primary" onClick={this.setExpression.bind(this)}>Go</button>
                               </span>
                           </div>
                       </div>
                   </div>
             </X.Col>
           </X.Row>
           <X.Row>
             <X.Col lg={6} lg-offset={0} md={6} md-offset={0} sm={4} sm-offset={1} xs={7} xs-offset={3}>
               <div className="panel panel-default scale text-center">
                 <div className="panel-heading">
                   <label>X Range</label>
                 </div>
                 <div className="panel-body">
                   <input type="text"
                          defaultValue={this.props.minX}
                          onBlur={this.handleXScaleBlur.bind(this)}
                          onKeyDown={this.handleSubmit.bind(this, this.setXRange.bind(this))}
                          className="form-control"
                          ref={el => this.lowerX = el}
                   />
                   <label className="range">&lt; x &lt;</label>
                   <input type="text"
                          defaultValue={this.props.maxX}
                          onBlur={this.handleXScaleBlur.bind(this)}
                          onKeyDown={this.handleSubmit.bind(this, this.setXRange.bind(this))}
                          className="form-control"
                          ref={el => this.upperX = el}
                   />
                 </div>
               </div>
             </X.Col>
           </X.Row>
         </X.Col>
        </X.Row>
      </X.Grid>
    );
  }
}
