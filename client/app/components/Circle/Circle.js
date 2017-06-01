import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import { select, selectAll, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { drag } from 'd3-drag';
import { format } from 'd3-format';
import { range } from 'd3-array';
import { line, curveMonotoneX, arc } from 'd3-shape';
import {
  viewPortFromElement
} from '../../utils/dom';
import './_circle.scss';

export default class Circle extends Component {
  componentDidMount() {
    const container = this.container;

    const dimensions = viewPortFromElement(container, true);

    const { width, height} = dimensions;

    const svg = select(container).append('svg')
                                 .attr("width", dimensions.width)
                                 .attr("height", dimensions.height)
                                 .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
                                 .attr('preserveAspectRatio','xMinYMin')
                                 .append('g')
                                 .attr("transform", `translate(0, 20)`);


    const xScale = scaleLinear()
      .domain([-3, 3])
      .range([0, dimensions.width - 30]);

    const yScale = scaleLinear()
      .domain([-3, 3])
      .range([0, dimensions.height - 30]);

    const tickValues = [-3, -2, -1, 0, 1, 2, 3];

    const xAxis = axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat(format(",.0f"))
      .tickSizeOuter(0);

    const yAxis = axisLeft(yScale)
      .tickValues(tickValues)
      .tickFormat(format(",.0f"))
      .tickSizeOuter(0);

    svg.append('g')
       .attr('class', 'x-axis')
       .attr('transform', `translate(0, ${yScale(0)})`)
       .call(xAxis);

    svg.append('g')
       .attr('class', 'y-axis')
       .attr('transform', `translate(${xScale(0)}, 0)`)
       .call(yAxis);

    const outer = svg.append('circle')
                     .attr('class', 'outer-circle')
                     .attr('cx', xScale(0))
                     .attr('cy', yScale(0))
                     .attr('r', xScale(3) / 2)

    const inner = svg.append('circle')
                     .attr('class', 'inner-circle')
                     .attr('cx', xScale(2))
                     .attr('cy', yScale(0))
                     .attr('r', xScale(3) / 6);

    const dot = svg.append('circle')
                   .attr('cx', xScale(2))
                   .attr('cy', yScale(0))
                   .attr('r', 5);

    const line = svg.append('line')
                    .attr('class', 'radial')
                    .attr('x1', xScale(2))
                    .attr('y1', yScale(0))
                    .attr('x2', xScale(3))
                    .attr('y2', yScale(0))
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div className="circle-container" ref={el => this.container = el}/>
          </Col>
        </Row>
      </Grid>
    );
  }
}
