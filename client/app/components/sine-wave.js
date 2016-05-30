import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
  viewPortFromElement
} from "../utils/dom";

import {
  wait
} from "../utils/common";

require("../styles/sine.scss");

const radius = 90;

export default class SineWave extends Component {
  componentDidMount() {
    this.createDocument();

    window.addEventListener("resize", _.debounce(this.resize.bind(this), 200));
  }

  createDocument() {
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

    const state = this.addGraphContainer(svg, xScale, yScale);

    this.addSineAxis(state);

    this.addMathJax(svg);
  }

  resize() {
    d3.select('.svg-container').remove();

    console.log('here');

    setTimeout(this.createDocument.bind(this), 500);
  }

  addSineAxis(state) {
    const intTickFormat = d3.format('d');

    const yAxis = d3.svg.axis()
            .orient('left')
            .tickValues([-1, 0, 1])
            .tickFormat(intTickFormat)
            .scale(state.yScaleAxis);

    state.graphContainer
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

    state.graphContainer
      .append('g')
      .attr('class', 'x axis left')
      .call(xAxis);
  }

  addGraphContainer(container, xScale, yScale) {
    const initialX = xScale(12);
    const initialY = yScale(15);

    const firstAxisXCoord = -(radius * 1.5);

    const graphContainer = container.append("g")
            .attr("class", "circle-container")
            .attr('transform', `translate(${initialX}, ${initialY})`);

    graphContainer.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('class', 'unit-circle')
      .style('fill', 'none');

    this.addRadianNumberLine(graphContainer);

    const hypotenuse = graphContainer.append('line')
            .attr('class', 'hypotenuse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const opposite = graphContainer.append('line')
            .attr('class', 'opposite')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const adjacent = graphContainer.append('line')
            .attr('class', 'adjacent')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const dot = graphContainer.append('circle')
            .attr('class', 'dot')
            .attr('cx', radius)
            .attr('cy', 0)
            .attr('r', 5);

    const verticalDot = graphContainer.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('class', 'vertical-guide');

    const joiningLine = graphContainer.append('line')
            .attr('class', 'joining-line')
            .attr('x1', firstAxisXCoord)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);

    const axisDot = graphContainer.append('circle')
            .attr('cx', radius)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('class', 'axis-dot');

    const yScaleAxis = d3.scale.linear()
            .domain([-1, 1])
            .range([radius, -radius]);

    const xScaleAxis = d3.scale.linear()
            .domain([0, (Math.PI * 2)])
            .range([firstAxisXCoord, -initialX + 20]);

    const state = {
      initialX: initialX,
      initialY: initialY,
      firstAxisXCoord: firstAxisXCoord,
      graphContainer: graphContainer,
      xScaleAxis: xScaleAxis,
      yScaleAxis: yScaleAxis,
      dot: dot,
      opposite: opposite,
      adjacent: adjacent,
      hypotenuse: hypotenuse,
      joiningLine, joiningLine,
      verticalDot: verticalDot,
      axisDot: axisDot,
      time: 0,
      xIncrement: 0
    };

    this.drawGraph(state);

    return state;
  }

  drawGraph(state) {
    const increase = ((Math.PI * 2) / 360);

    state.time += increase;
    state.xIncrement += increase;

    this.drawSineWave(state);

    if(state.xIncrement > (Math.PI * 2)) {
      state.xIncrement = increase;
    }

    const axisDotX = state.xScaleAxis(state.xIncrement);

    state.axisDot
      .attr('cx', axisDotX)
      .attr('cy', 0);

    const dx = radius * Math.cos(state.time);
    const dy = radius * -Math.sin(state.time); // counter-clockwise

    state.dot
      .attr('cx', dx)
      .attr('cy', dy);

    state.hypotenuse
      .attr('x2', dx)
      .attr('y2', dy);

    state.opposite
      .attr('x1', dx)
      .attr('y1', dy)
      .attr('x2', dx)
      .attr('y2', 0);

    state.adjacent
      .attr('x1', dx)
      .attr('y1', 0);

    state.verticalDot
      .attr('cy', dy);

    state.joiningLine
      .attr('y1', state.dot.attr('cy'))
      .attr('x2', state.dot.attr('cx'))
      .attr('y2', state.dot.attr('cy'));

    requestAnimationFrame(this.drawGraph.bind(this, state));
  }

  drawSineWave(state) {
    d3.select('.sine-curve').remove();

    const sineData = d3.range(0, 54)
            .map(x => x * 10 / 85)
            .map((x) => {
              return {x: x, y: - Math.sin(x - state.time)};
            });

    const sine = d3.svg.line()
            .interpolate('monotone')
            .x( (d) => {return state.xScaleAxis(d.x);})
            .y( (d) => {return state.yScaleAxis(d.y);});

    state.graphContainer.append('path')
      .datum(sineData)
      .attr('class', 'sine-curve')
      .attr('d', sine);
  }

  addRadianNumberLine(container) {
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

      const offsetX = (ray.val > Math.PI / 2 && ray.val < (3 * Math.PI) / 2)  ? -20 : -5;
      const offsetY = (ray.val > 0 && ray.val < Math.PI)  ? -35 : 0;

      container.append('g')
        .attr('class', 'tick')
        .attr('transform', `translate(${cosX + offsetX}, ${sinY + offsetY})`)
        .append('text')
        .text(() => ray.label);

      container.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', cosX)
        .attr('y2', sinY);
    });
  }

  addMathJax(svg) {
    const continuation = () => {
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
    };

    wait((window.hasOwnProperty('MathJax')), continuation.bind(this));
  }

  render(el, props){
    return (
        <div className="row">
          <div className="row">
            <h2 className="tick" className="col-xs-offset-3 col-md-offset-1">$\sin(x)$</h2>
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
