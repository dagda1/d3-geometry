"use strict";

require("../css/style.css");

const margin = {top: 20, right: 100, bottom: 30, left: 100},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const xScale = d3.scale.linear()
    .domain([0, 20])
    .range([0, width]);

const yScale = d3.scale.linear()
    .domain([0, 20])
    .range([height, 0]);

const points = {
  a: {x: xScale(1), y: yScale(1)},
  b: {x: xScale(12), y: yScale(10)},
  c: {x: xScale(14), y: yScale(6)}
};

const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append('g')
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

const g = svg.append('g');

const drawTriangle = function() {
  g.append('path')
    .attr('d', function() {
      return 'M ' + points.a.x +' '+ points.a.y +
             ' L' + points.b.x + ' ' + points.b.y +
             ' L' + points.c.x + ' ' + points.c.y +
             ' z';
    })
     .attr('class', 'triangle')
    .style('stroke', 'blue');
};

drawTriangle();

Math.approx = function(d){ return Math.round(d*100)/100; };

const midpoint = function(a, b) {
  return {x: ((a.x + b.x) / 2), y: ((a.y + b.y) / 2)};
};

const gradient = function(a, b) {
  return ((b.y - a.y) / (b.x - a.x));
};

const perpendicularGradient = function (a, b) {
  return -1 / gradient(a, b);
};

const convertPoint = function(point) {
  return {x: xScale.invert(point.x), y: yScale.invert(point.y)};
};

function getYIntercept(vertex, slope) {
  return vertex.y - (slope * vertex.x);
}

function distance(a, b) {
  return Math.floor(Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2)));
}

function det(matrix) {
  return (matrix[0][0]*matrix[1][1])-(matrix[0][1]*matrix[1][0]);
}

function solveMatrix(matrix, r) {
   const determinant = det(matrix);
   const x = det([
      [r[0], matrix[0][1]],
      [r[1], matrix[1][1]]
    ]) / determinant;

   const y = det([
     [matrix[0][0], r[0]],
     [matrix[1][0], r[1]]
   ]) / determinant;

  return {x: Math.approx(x), y: Math.approx(y)};
}

function drawMedian(vertex, pointA, pointB) {
  const mid = midpoint(pointA, pointB);

  g.append('line')
    .style('stroke', 'red')
    .attr('class', 'line')
    .attr('x1', vertex.x)
    .attr('y1', vertex.y)
    .attr('x2', mid.x)
    .attr('y2', mid.y);
}

function drawMedians() {
  drawMedian(points.a, points.b ,points.c);
  drawMedian(points.b, points.a, points.c);
  drawMedian(points.c, points.b, points.a);
}

function drawAltitudes() {
  altitude(convertPoint(points.a), convertPoint(points.b), convertPoint(points.c));
  altitude(convertPoint(points.b), convertPoint(points.a), convertPoint(points.c));
  altitude(convertPoint(points.c), convertPoint(points.b), convertPoint(points.a));
}

function altitude(vertex, a, b) {
  const slope = gradient(a, b),
      x1 = - slope,
      y1 = 1,
      c1 = getYIntercept(a, slope),
      perpendicularSlope = perpendicularGradient(a, b),
      x2 = - perpendicularSlope,
      y2 = 1,
      c2 = getYIntercept(vertex, perpendicularSlope);

  const matrix = [
    [x1, y1],
    [x2, y2]
  ];

  const result = solveMatrix(matrix, [c1, c2]);

  g.append('line')
    .style('stroke', 'red')
    .attr('class', 'line')
    .attr('x1', xScale(vertex.x))
    .attr('y1', yScale(vertex.y))
    .attr('x2', xScale(result.x))
    .attr('y2', yScale(result.y));
}

const drawTriangleLine = function drawTriangleLine(group, vertices) {
  group.append('line')
    .style('stroke', 'green')
    .attr('class', 'line')
    .attr('x1', vertices.x1)
    .attr('y1', vertices.y1)
    .attr('x2', vertices.x2)
    .attr('y2', vertices.y2);
};

function perpendicularBisector(a, b) {
  const slope = perpendicularGradient(a, b),
        midPoint = midpoint(a, b),
        yIntercept = getYIntercept(midPoint, slope),
        xIntercept =  - yIntercept / (slope);

  if(yIntercept === Infinity || yIntercept === -Infinity) {
    return drawTriangleLine(g, {
      x1: xScale(midPoint.x),
      y1: yScale(0),
      x2: xScale(midPoint.x),
      y2: yScale(20)
    });
  }

  if(a.x === b.x) {
    return drawTriangleLine(g, {
      x1: xScale(0),
      y1: yScale(midPoint.y),
      x2: xScale(20),
      y2: yScale(midPoint.y)
    });
  }

  if(xIntercept < 0 || yIntercept < 0) {
    return drawTriangleLine(g, {
      x1: xScale(xIntercept),
      y1: yScale(0),
      x2: xScale(20),
      y2: yScale((slope * 20) + yIntercept)
    });
  }

  drawTriangleLine(g, {
      x1: xScale(xIntercept),
      y1: yScale(0),
      x2: xScale(0),
      y2: yScale(yIntercept)
    });

  return {vertex: midPoint, slope: slope};
}

function drawPerpendicularBisectors() {
  const ab = perpendicularBisector(convertPoint(points.a), convertPoint(points.b));
  const ac = perpendicularBisector(convertPoint(points.a), convertPoint(points.c));
  const bc = perpendicularBisector(convertPoint(points.b), convertPoint(points.c));

  drawCirumCircle(ab, ac);
}

function drawCirumCircle(lineA, lineB) {
  const x1 = - lineA.slope,
      y1 = 1,
      c1 = getYIntercept(lineA.vertex, lineA.slope),
      x2 = - lineB.slope,
      y2 = 1,
      c2 = getYIntercept(lineB.vertex, lineB.slope);

  const matrix = [
    [x1, y1],
    [x2, y2]
  ];

  const circumCircleCentre = solveMatrix(matrix, [c1, c2]),
      dist = distance(convertPoint(points.b), circumCircleCentre);

  g.append('circle')
   .attr('cx', xScale(circumCircleCentre.x))
   .attr('cy', yScale(circumCircleCentre.y))
   .attr('r', xScale(dist))
   .attr('class', 'circumcircle')
   .attr('fill-opacity', 0.0)
   .style('stroke', 'black');
}

drawPerpendicularBisectors();

const drag = d3.behavior
        .drag()
        .on("drag", function(d) {

  const circle = d3.select(this);

  d3.select('.triangle').remove();
  d3.select('.circumcircle').remove();
  d3.selectAll('.line').remove();

  const label = d3.select(".label." + d.label);

    label.text( function () {
      return `${d.label} (${d3.format(",.0f")(xScale.invert(d3.event.x))}, ${d3.format(",.0f")(yScale.invert(d3.event.y))})`;
  });

  label.attr('x', d3.event.x).attr('y', d3.event.y - 20);

  points[d.label] = {x: d3.event.x, y: d3.event.y};

  drawTriangle();

  drawPerpendicularBisectors();

  circle
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
});

const vertices = [
  {point: points.a, label: 'a'},
  {point: points.b, label: 'b'},
  {point: points.c, label: 'c'}
];

g.selectAll('.grabber')
  .data(vertices)
  .enter().append('circle')
  .attr('class', function(d) { return 'grabber ' + d.label; })
  .attr('cx', function(d) { return d.point.x; })
  .attr('cy', function(d) { return d.point.y; })
  .attr('r', 10)
  .style('fill', 'red')
  .call(drag);

g.selectAll('text')
  .data(vertices)
  .enter().append('text')
  .attr("x", function(d){return d.point.x;})
  .attr("y", function(d){return d.point.y + 1;})
  .attr('class', function(d) {return "label " + d.label;})
  .text( function(d) {
    return `${d.label} (${xScale.invert(d.point.x)}, ${yScale.invert(d.point.y)})`;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "14px")
  .attr("fill", "blue");

// drawAltitudes();

// drawMedians();
