import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import {
  viewPortFromElement
} from "../../utils/dom";

import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line, curveMonotoneX, arc } from 'd3-shape';
import './_Sine2.scss';

const TWO_PI = (Math.PI *2);

class Sine extends Component {
  componentDidMount() {
    this.createDocument();
    this.cancel = undefined;
  }

  createDocument() {
    const el = this.sine;

    const dimensions = viewPortFromElement(el);

    const { width, height } = dimensions;

    const svg = select(el).append("svg")
                          .attr('class', 'sine2-container')
                          .attr('viewBox', `0 0 1300  ${height}`)
                          .attr('preserveAspectRatio','xMinYMin meet')


    let state = this.initializeArea(svg, dimensions);

    state = this.addShapes(state);

    state.time = 0;

    this.animate(state, {forward: true});
  }

  progressSineGraph(state, direction) {
    if(direction.forward) {
      state.sineData.push(state.time);
    } else {
      state.sineData.pop();
    }

    state.sineCurve.attr('d', state.sine(state.sineData));
  }

  animate(state, direction) {
    if(direction.forward) {
      state.time += state.increase;
    } else {
      state.time -= state.increase;
    }

    const xTo = state.xScale(state.time);

    const dx = (state.radius * Math.cos(state.time));
    const dy = (state.radius * -Math.sin(state.time));

    state.dot
         .attr('cx', xTo);

    const hypotenuseCentre = xTo - dx;

    const hypotenuseCoords = {
      x1: hypotenuseCentre,
      y1: parseFloat(state.hypotenuse.attr('y1')),
      x2: xTo,
      y2: dy
    };

    state.hypotenuse
         .attr('x1', hypotenuseCoords.x1)
         .attr('x2', hypotenuseCoords.x2)
         .attr('y2', hypotenuseCoords.y2);

    let angle = Math.atan2(
      (hypotenuseCoords.y2 - hypotenuseCoords.y1),
      (hypotenuseCoords.x2 - hypotenuseCoords.x1)
    );

    if(angle > 0) {
      angle = (-2 * (Math.PI) + angle);
    }

    angle = angle + Math.PI / 2;

    const innerArc = arc()
      .innerRadius(8)
      .outerRadius(12)
      .startAngle(Math.PI/2)
      .endAngle(angle);

    const outerArc = arc()
      .innerRadius(state.radius - 1)
      .outerRadius(state.radius + 3)
      .startAngle(Math.PI/2)
      .endAngle(angle);

    state.innerAngle
         .attr('d', innerArc)
         .attr('transform', `translate(${hypotenuseCentre}, 0)`);

    state.outerAngle
         .attr('d', outerArc)
         .attr('transform', `translate(${hypotenuseCentre}, 0)`);

    state.unitCircle.attr('cx', hypotenuseCoords.x1);

    state.opposite
         .attr('x1', xTo)
         .attr('y1', 0)
         .attr('x2', xTo)
         .attr('y2', dy);

    state.adjacent
         .attr('x1', 0)
         .attr('y1', 0)
         .attr('x2', xTo)
         .attr('y2', 0);

    if(direction.forward && state.time > TWO_PI) {
      direction = {backwards: true};
    }

    if(direction.backwards && state.time < 0) {
      state.time = 0;
      direction = {forward: true};
    }

    this.progressSineGraph(state, direction);

    this.cancel = requestAnimationFrame(this.animate.bind(this, state, direction));
  }

  addShapes(state) {
    state.radius = state.yScale(0);

    const unitCircleCx = 0 - state.radius;

    state.unitCircle = state.xAxisGroup.append('circle')
                            .attr('cx', unitCircleCx)
                            .attr('cy', 0)
                            .attr('r', state.radius)
                            .attr('class', 'unit-circle')
                            .style('fill', 'none');

    state.dot = state.xAxisGroup.append('circle')
                     .attr('cx', 0)
                     .attr('cy', 0)
                     .attr('class', 'x-circle')
                     .attr('r', 10);

    state.hypotenuse = state.xAxisGroup.append('line')
                            .attr('class', 'hypotenuse')
                            .attr('x1', 0)
                            .attr('y1', 0)
                            .attr('x2', 0)
                            .attr('y2', 0);

    state.opposite = state.xAxisGroup.append('line')
                          .attr('class', 'opposite')
                          .attr('x1', 0)
                          .attr('y1', 0)
                          .attr('x2', 0)
                          .attr('y2', 0);

    state.adjacent = state.xAxisGroup.append('line')
                          .attr('class', 'adjacent ln')
                          .attr('x1', 0)
                          .attr('y1', 0)
                          .attr('x2', 0)
                          .attr('y2', 0);

    state.sine = line()
      .curve(curveMonotoneX)
		  .x((d, i) => { return state.xScale(d); })
		  .y((d, i) => { return state.yScale(Math.sin(d) + 1); });

    state.sineData = [];

    state.sineCurve = state.xAxisGroup.append('path')
                           .attr('class', 'sine-curve');

    state.innerAngle = state.xAxisGroup
                            .append("path")
                            .attr("class", "arc");

    state.outerAngle = state.xAxisGroup
                            .append("path")
                            .attr("class", "arc");

    return state;
  }

  initializeArea(container, dimensions) {
    const xScale = scaleLinear()
      .domain([0, (TWO_PI)])
      .range([0, (dimensions.width)]);

    const yScale = scaleLinear()
      .domain([-1.0, 1.0])
      .range([(dimensions.height - 100), 0]);

    const graphContainer = container.append("g")
                                    .attr("class", "graph-container")
                                    .attr('transform', `translate(${xScale(1.5)}, 20)`);

    const yAxis = axisLeft(yScale)
      .tickValues([-1.0, -0.5, 0, 0.5, 1.0])
      .tickSizeOuter(0);

    const yAxisGroup = graphContainer
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    const xTickValues = [0, 1.57, 3.14, 4.71, 6.28];

    const piMap = {"1.57": "π/2", "3.14": "π", "4.71": "3π/2", "6.28": "2π"};

    const xAxis = axisBottom(xScale)
      .tickValues(xTickValues)
      .tickFormat((t) => {
        return t === 0 ? '' : piMap[t.toString()];
      });

    const xAxisGroup = graphContainer
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${yScale(0)})`)
      .call(xAxis);

    const leftXAxis = axisBottom(xScale)
      .tickValues(xTickValues)
      .tickFormat(() => '')
      .tickSizeInner(0)
      .tickSizeOuter(0);

    graphContainer
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${-300}, ${yScale(0)})`)
      .call(leftXAxis);

    return {
      xScale,
      yScale,
      graphContainer,
      xAxisGroup,
      yAxisGroup,
      increase: (TWO_PI / 360)
    };
  }

  componentWillUnmount() {
    if(!this.cancel) {
      return;
    }

    window.cancelAnimationFrame(this.cancel)
  }

  render(el, props) {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div id="sine2" ref={el => this.sine = el}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Sine;
