import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import math from 'mathjs';

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

    const state = this.addCircleGroup(svg, xScale, yScale);

    this.addSineAxis(state);

    setTimeout(() => {
      MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [ ['$','$'], ["\\(","\\)"] ],
          processEscapes: true
        }
      });

      MathJax.Hub.Register.StartupHook("End", function() {
        setTimeout(() => {
          svg.selectAll('.tick').each(function(){
            var self = d3.select(this),
                 g = self.select('text>span>svg');

            if(g[0][0] && g[0][0].tagName === 'svg') {
              g.remove();
              self.append(function(){
                return g.node();
              });
            }
          });
        }, 500);
      });

      MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg.node()]);
    }, 500);
  }

  resize() {
    const dimensions = this.getDimensions();

    d3.select('svg-container')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
  }

  addSineAxis(state) {
    const intTickFormat = d3.format('d');

    const yAxis = d3.svg.axis()
            .orient('left')
            .tickValues([-1, 0, 1])
            .tickFormat(intTickFormat)
            .scale(state.yScaleAxis);

    state.circleGroup
      .append('g')
      .attr('class', 'y axis left')
      .attr("transform", `translate(${state.firstAxisXCoord}, 0)`)
      .call(yAxis);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const piMap = {'0': '0', '1.57': '\\pi\\over 2', '3.14': '\\pi', '4.71': '3\\pi\\over 2', '6.28': '2\\pi'};

    const xAxis = d3.svg.axis()
            .orient('bottom')
            .tickValues(xTickValues)
            .innerTickSize(0)
            .outerTickSize(0)
            .tickFormat((x) => `$${piMap[x]}$`)
            .scale(state.xScaleAxis);

    state.circleGroup
      .append('g')
      .attr('class', 'x axis left')
      .call(xAxis);
  }

  addCircleGroup(container, xScale, yScale) {
    const initialX = xScale(12);
    const initialY = yScale(15);

    const firstAxisXCoord = -(radius * 1.5);

    const circleGroup = container.append("g")
            .attr("class", "circle-container")
            .attr('transform', `translate(${initialX}, ${initialY})`);

    circleGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('class', 'outer-circle')
      .style('fill', 'none');

    [
      {val: Math.PI/4, label: "$\\frac" + "{\\pi}4$"},
      {val: Math.PI/2, label: "$\\frac" + "{\\pi}2$"},
      {val: (3 * Math.PI) / 4, label: "$\\frac" + "{3\\pi}4$"},
      {val: Math.PI, label: "$\\pi$"},
      {val: (5 * Math.PI) / 4, label: "$\\frac" + "{5\\pi}4$"},
      {val: (3 * Math.PI) / 2, label: "$\\frac" + "{3\\pi}2$"},
      {val: (7 * Math.PI) / 4, label: "$\\frac" + "{7\\pi}4$"},
      {val: (2 * Math.PI), label: "${2\\pi}$"},
    ].forEach((ray) => {
      const cosX = radius * Math.cos(ray.val);
      const sinY = radius * -Math.sin(ray.val);

      circleGroup.append('g')
        .attr('class', 'tick')
        .attr('transform', `translate(${cosX}, ${sinY})`)
        .append('text')
        .text(() => ray.label);

      circleGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', cosX)
        .attr('y2', sinY);
    });

    const guideLine = circleGroup.append('line')
            .attr('class', 'guide-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', radius)
            .attr('y2', 0);

    const opposite = circleGroup.append('line')
            .attr('class', 'opposite')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const adjacent = circleGroup.append('line')
            .attr('class', 'adjacent')
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
            .attr('class', 'joining-line')
            .attr('x1', firstAxisXCoord)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const yScaleAxis = d3.scale.linear()
            .domain([-1, 1])
            .range([radius, -radius]);

    const xScaleAxis = d3.scale.linear()
            .domain([0, (Math.PI * 2)])
            .range([firstAxisXCoord, -initialX + 20]);

    let time = 0;

    const state = {
      initialX: initialX,
      initialY: initialY,
      firstAxisXCoord: firstAxisXCoord,
      circleGroup: circleGroup,
      xScaleAxis: xScaleAxis,
      yScaleAxis: yScaleAxis
    };

    function drawGraph() {
      const increase = ((Math.PI * 2) / 360);

      time += increase;

      this.drawSineWave(circleGroup, xScaleAxis, yScaleAxis, time);

      const newX = radius * Math.cos(time);
      const newY = radius * -Math.sin(time); // counter clockwise

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

      requestAnimationFrame(drawGraph.bind(this));
    };

    drawGraph.call(this);

    return state;
  }

  drawSineWave(container, xScale, yScale, t) {
    d3.select('.sine-curve').remove();

    const xValues = d3.range(0,84).map(x => x * 10 /100);

    const sineData = xValues.map((x) => {
      return {x: x, y: - Math.sin(x - t)};
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
