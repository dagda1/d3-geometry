import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import { select, selectAll, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { drag } from 'd3-drag';
import { format } from 'd3-format';
import { range } from 'd3-array';
import { line, curveMonotoneX, arc } from 'd3-shape';
import './_circle.scss';

export default class Circle extends Component {
  componentDidMount() {
    const container = this.container;

    const width = container.offsetWidth - 100;
    const height = width;

    const dimensions = {
      width: width,
      height: height
    }

    const xScale = scaleLinear()
      .domain([-3, 3])
      .range([0, dimensions.width - 30]);

    const yScale = scaleLinear()
      .domain([-3, 3])
      .range([0, dimensions.height - 30]);

    const yTranslate = 10;

    const tickValues = [-3, -2, -1, 0, 1, 2, 3];

    const xAxis = axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat(format(",.0f"))
      .tickSizeOuter(0);

    const yAxis = axisLeft(yScale)
      .tickValues(tickValues)
      .tickFormat(format(",.0f"))
      .tickSizeOuter(0);

    const svg = select(container).append('svg')
                                 .attr('class', 'circle-container')
                                 .attr("width", dimensions.width)
                                 .attr("height", dimensions.height)
                                 .attr("transform", `translate(20, 0)`);


    svg.append('g')
       .attr('class', 'x-axis')
       .attr('transform', `translate(0, ${yScale(0) + yTranslate})`)
       .call(xAxis);

    svg.append('g')
       .attr('class', 'y-axis')
       .attr('transform', `translate(${xScale(0)}, ${yTranslate})`)
       .call(yAxis);

    const outer = svg.append('circle')
                     .attr('class', 'outer-circle')
                     .attr('cx', xScale(0))
                     .attr('cy', yScale(0))
                     .attr('r', xScale(3) / 2)
                     .attr('transform', `translate(0, ${yTranslate})`)
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
