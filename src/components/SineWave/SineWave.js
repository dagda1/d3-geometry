import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { range } from 'd3-array';
import { line, curveMonotoneX } from 'd3-shape';

import {
  viewPortFromElement
} from "../../utils/dom";

import {
  wait
} from "../../utils/common";
import './_SineWave.scss';

const radius = 90;

export default class SineWave extends Component {
  componentDidMount() {
    this.createDocument();
    this.cancel = undefined;
  }

  createDocument() {
    const el = this.sine;

    const dimensions = viewPortFromElement(el);

    const xScale = scaleLinear()
      .domain([0, 20])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([0, 20])
      .range([dimensions.height, 0]);

    const { width, height } = dimensions;

    const svg = select(el).append("svg")
                          .attr('class', 'sinewave-container')
                          .attr('viewBox', `0 0 ${width} ${height}`)
                          .attr('preserveAspectRatio','xMinYMin meet');

    const state = this.addGraphContainer(svg, xScale, yScale);

    this.addSineAxis(state);

    this.addMathJax(svg);
  }

  addSineAxis(state) {
    const yAxis = axisLeft(state.yScaleAxis)
      .tickValues([-1, 0, 1])
      .tickFormat(format('d'))

    state.graphContainer
      .append('g')
      .attr('class', 'y axis left')
      .attr("transform", `translate(${state.firstAxisXCoord}, 0)`)
      .call(yAxis);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const piMap = {'0': '0', '1.57': '\\pi\\over 2', '3.14': '\\pi', '4.71': '3\\pi\\over 2', '6.28': '2\\pi'};

    const xAxis = axisBottom(state.xScaleAxis)
      .tickValues(xTickValues)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .tickFormat((x) => `$${piMap[x]}$`)
      .scale(state.xScaleAxis);

    state.graphContainer
         .append('g')
         .attr('class', 'x axis left')
         .call(xAxis);
  }

  addGraphContainer(container, xScale, yScale) {
    const initialX = xScale(12);
    const initialY = 125;

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

    const yScaleAxis = scaleLinear()
      .domain([-1, 1])
      .range([radius, -radius]);

    const xScaleAxis = scaleLinear()
      .domain([0, (Math.PI * 2)])
      .range([firstAxisXCoord, -initialX + 20]);

    const state = {
      initialX,
      initialY,
      firstAxisXCoord,
      graphContainer,
      xScaleAxis,
      yScaleAxis,
      dot,
      opposite,
      adjacent,
      hypotenuse,
      joiningLine,
      verticalDot,
      axisDot,
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

    this.cancel = requestAnimationFrame(this.drawGraph.bind(this, state));

    console.log(this.cancel)
  }

  drawSineWave(state) {
    select('.sine-curve').remove();

    const sineData = range(0, 54)
      .map(x => x * 10 / 85)
      .map((x) => {
        return {x: x, y: - Math.sin(x - state.time)};
      });

    const sine = line()
      .curve(curveMonotoneX)
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
            var self = select(this),
                g = self.select('text>span>svg');

            if(g._groups[0][0] && g._groups[0][0].tagName === 'svg') {
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

  componentWillUnmount() {
    if(!this.cancel) {
      return;
    }

    window.cancelAnimationFrame(this.cancel)
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col sm={12}>
            <Col xsOffset={3} mdOffset={1} componentClass="h2">sin(x)</Col>
            <div id="sine-wave" ref={(sine) => { this.sine = sine }} />
          </Col>
        </Row>
      </Grid>
    );
  }
};
