import {
  viewPortFromElement
} from "../../utils/dom";

import { select, event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { drag } from 'd3-drag';
import { format } from 'd3-format';

export default class DraggableLine {
  render(el, props = {}) {
    const dimensions = viewPortFromElement(el);

    console.log(dimensions);
    const xScale = scaleLinear()
      .domain([0, 20])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([0, 20])
      .range([dimensions.height, 0]);

    const xAxis = axisBottom(xScale)
      .tickSizeInner(-dimensions.height)
      .tickPadding(10);

    const yAxis = axisLeft(yScale)
      .tickSizeInner(-dimensions.width)
      .tickSizeOuter(0)
      .tickPadding(10);

    const { width, height } = dimensions;

    const svg = select(el).append("svg")
                          .attr('width', width)
                          .attr('height', height)
                          .attr('viewBox', `0 0 ${width * 2} ${height * 2}`)
                          .attr('preserveAspectRatio','xMinYMin meet')
                          .append("g")
                          .attr("transform", "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")");

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + dimensions.height + ")")
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis);

    const line = {
      start: {x: xScale(2), y: yScale(3), type: 'start'},
      finish: {x: xScale(14), y: yScale(6), type: 'finish'}
    };

    const g = svg.append('g');

    g.append('line')
     .style('stroke', 'blue')
     .attr('class', 'line')
     .attr('x1', line.start.x)
     .attr('y1', line.start.y)
     .attr('x2', line.finish.x)
     .attr('y2', line.finish.y);

    svg.append('text')
       .attr('class', 'title')
       .text(this.equationOfLine(line.start, line.finish))
       .attr('x', xScale(2))
       .attr('y', yScale(18))
       .attr("font-family", "sans-serif")
       .attr("font-size", "24px");

    const lineData = [line.start, line.finish];

    const equationOfLine = this.equationOfLine;

    const formatText = d => `(${format(",.0f")(xScale.invert(d.x))}, ${format(",.0f")(yScale.invert(d.y))})`


    const draggable = drag()
      .on("drag", function(d) {
        select(this).attr("cx", d.x = xScale(event.x)).attr("cy", d.y = yScale(event.y));
        const circle = select(`.circle.${d.type}`);

        circle.attr("cx", d.x = event.x)
              .attr("cy", d.y = event.y);

        const line = select('.line');
        const isStart = d.type === 'start';
        const textClass = isStart ? ".textstart" : ".textfinish";
        const lineX = isStart ? 'x1' : 'x2';
        const lineY = isStart ? 'y1' : 'y2';
        const text = select(textClass);
        const title = select('.title');
        const xStart = format(",.0f")(xScale.invert(line.attr('x1')));
        const yStart = format(",.0f")(yScale.invert(line.attr('y1')));
        const xFinish = format(",.0f")(xScale.invert(line.attr('x2')));
        const yFinish = format(",.0f")(yScale.invert(line.attr('y2')));
        text.text(formatText);

        line.attr(lineX, event.x).attr(lineY, event.y);
        text.attr('x', event.x).attr('y', event.y - 20);

        title.text(equationOfLine({x: xStart, y: yStart}, {x: xFinish, y: yFinish}));
      });

    g.selectAll('circle')
     .data(lineData)
     .enter().append("circle")
     .attr('class', function(d){ return "circle " + d.type;})
     .attr('cx', d => d.x)
     .attr('cy', d => d.y)
     .attr('r', 10)
     .style('fill', 'red')
     .call(draggable);

    g.selectAll('text')
     .data(lineData)
     .enter().append('text')
     .attr('x', d => d.x)
     .attr('y', d => d.y)
     .attr('class', d => "text" + d.type)
     .text(formatText)
     .attr("font-family", "sans-serif")
     .attr("font-size", "14px")
     .attr("fill", "red");
  }

  equationOfLine(start, finish) {
    const slope = (finish.y - start.y) / (finish.x - start.x);

    const yIntercept = start.y - (slope * start.x);

    if(slope === 0) {
      return 'y = ' + start.y;
    }

    if(slope === -Infinity || slope === Infinity){
      return 'x = ' + start.x;
    }

    return 'y = ' + format(",.2f")(slope) + 'x + ' + format(",.2f")(yIntercept);
  }
};
