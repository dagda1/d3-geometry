import {
  viewPortFromElement
} from "../utils/dom";

export default class DraggableLine {
  render(el, props = {}) {
    const dimensions = viewPortFromElement(el);

    const xScale = d3.scale.linear()
          .domain([0, 20])
          .range([0, dimensions.width]);

    const yScale = d3.scale.linear()
          .domain([0, 20])
          .range([dimensions.height, 0]);

    const xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .innerTickSize(-dimensions.height)
          .tickPadding(10);

    const yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .innerTickSize(-dimensions.width)
          .outerTickSize(0)
          .tickPadding(10);

    const svg = d3.select(el).append("svg")
          .attr("width", dimensions.width + dimensions.margin.left + dimensions.margin.right)
          .attr("height", dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
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
      start: {x: 2, y: 3, type: 'start'},
      finish: {x: 14, y: 6, type: 'finish'}
    };

    const g = svg.append('g');

    g.append('line')
      .style('stroke', 'blue')
      .attr('class', 'line')
      .attr('x1', xScale(line.start.x))
      .attr('y1', yScale(line.start.y))
      .attr('x2', xScale(line.finish.x))
      .attr('y2', yScale(line.finish.y));

    svg.append('text')
      .attr('class', 'title')
      .text(this.equationOfLine(line.start, line.finish))
      .attr('x', xScale(2))
      .attr('y', yScale(18))
      .attr("font-family", "sans-serif")
      .attr("font-size", "24px");

    const lineData = [line.start, line.finish];
    const equationOfLine = this.equationOfLine;

    const drag = d3.behavior
            .drag()
            .on("drag", function(d) {
              const circle = d3.select(this);
              const line = d3.select('.line');
              const isStart = circle.classed('start');
              const textClass = isStart ? ".textstart" : ".textfinish";
              const lineX = isStart ? 'x1' : 'x2';
              const lineY = isStart ? 'y1' : 'y2';
              const text = d3.select(textClass);
              const title = d3.select('.title');
              const xStart = d3.format(",.0f")(xScale.invert(line.attr('x1')));
              const yStart = d3.format(",.0f")(yScale.invert(line.attr('y1')));
              const xFinish = d3.format(",.0f")(xScale.invert(line.attr('x2')));
              const yFinish = d3.format(",.0f")(yScale.invert(line.attr('y2')));
              text.text( function (d) { return "( " + d3.format(",.0f")(xScale.invert(d.x))  + ", " + d3.format(",.0f")(yScale.invert(d.y)) +" )"; });

              line.attr(lineX, d3.event.x).attr(lineY, d3.event.y);
              text.attr('x', d3.event.x).attr('y', d3.event.y - 20);
              circle.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

              title.text(equationOfLine({x: xStart, y: yStart}, {x: xFinish, y: yFinish}));
            });

    g.selectAll('circle')
      .data(lineData)
      .enter().append("circle")
      .attr('class', function(d){ return "circle " + d.type;})
      .attr('cx', function(d){return xScale(d.x);})
      .attr('cy', function(d){return yScale(d.y);})
      .attr('r', 10)
      .style('fill', 'red')
      .call(drag);

    g.selectAll('text')
      .data(lineData)
      .enter().append('text')
      .attr("x", function(d){return xScale(d.x);})
      .attr("y", function(d){return yScale(d.y + 1);})
      .attr('class', function(d) {return "text" + d.type;})
      .text( function (d) { return "( " + d.x  + ", " + d.y +" )"; })
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

    return 'y = ' + d3.format(",.2f")(slope) + 'x + ' + d3.format(",.2f")(yIntercept);
  }
};
