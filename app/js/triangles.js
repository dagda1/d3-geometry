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

const pointA = {x: xScale(1), y: yScale(1)},
    pointB = {x: xScale(6), y: yScale(18)},
    pointC = {x: xScale(14), y: yScale(6)};

const g = svg.append('g');

var drawTriangle = function() {
  g.append('path')
    .attr('d', function(d) { 
      return 'M ' + pointA.x +' '+ pointA.y + 
             ' L' + pointB.x + ' ' + pointB.y + 
             ' L' + pointC.x + ' ' + pointC.y + 
             ' z';
    })
     .attr('class', 'triangle')
    .style('stroke', 'blue');
};

drawTriangle();

Math.approx = function(d){ return Math.round(d*100)/100; };

var midpoint = function(a, b) {
  return {x: ((a.x + b.x) / 2), y: ((a.y + b.y) / 2)};
};

var gradient = function(a, b) {  
  return ((b.y - a.y) / (b.x - a.x));
};

var perpendicularGradient = function (a, b) {
  return -1 / gradient(a, b);
};

var convertPoint = function(point) {
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
   var determinant = det(matrix);
   var x = det([
      [r[0], matrix[0][1]],
      [r[1], matrix[1][1]]
    ]) / determinant;
  
   var y = det([
     [matrix[0][0], r[0]],
     [matrix[1][0], r[1]]
   ]) / determinant;
  
  return {x: Math.approx(x), y: Math.approx(y)};
}

function drawMedian(vertex, pointA, pointB) {
  var mid = midpoint(pointA, pointB);
  
  g.append('line')
    .style('stroke', 'red')
    .attr('class', 'line')
    .attr('x1', vertex.x)
    .attr('y1', vertex.y)
    .attr('x2', mid.x)
    .attr('y2', mid.y);
}

function drawMedians() {
  drawMedian(pointA, pointB ,pointC);
  drawMedian(pointB, pointA, pointC);
  drawMedian(pointC, pointB, pointA);
}

function drawAltitudes() {
  altitude(convertPoint(pointA), convertPoint(pointB), convertPoint(pointC));
  altitude(convertPoint(pointB), convertPoint(pointA), convertPoint(pointC));
  altitude(convertPoint(pointC), convertPoint(pointB), convertPoint(pointA));
}

function altitude(vertex, a, b) {
  var slope = gradient(a, b),
      x1 = - slope,
      y1 = 1,
      c1 = getYIntercept(a, slope),
      perpendicularSlope = perpendicularGradient(a, b),
      x2 = - perpendicularSlope,
      y2 = 1,
      c2 = getYIntercept(vertex, perpendicularSlope);
 
  var matrix = [
    [x1, y1],
    [x2, y2]
  ];
  
  var result = solveMatrix(matrix, [c1, c2]);

  g.append('line')
    .style('stroke', 'red')
    .attr('class', 'line')
    .attr('x1', xScale(vertex.x))
    .attr('y1', yScale(vertex.y))
    .attr('x2', xScale(result.x))
    .attr('y2', yScale(result.y));
} 

function perpendicularBisector(a, b) {
  var slope = perpendicularGradient(a, b),
      midPoint = midpoint(a, b),
      yIntercept = getYIntercept(midPoint, slope),
      xIntercept =  - yIntercept / (slope);
  
  if(xIntercept > 0) {
    g.append('line')
    .style('stroke', 'green')
    .attr('class', 'line')
    .attr('x1', xScale(0))
    .attr('y1', yScale(yIntercept))
    .attr('x2', xScale(xIntercept))
    .attr('y2', yScale(0));
  } else {
    svg.append('line')
    .style('stroke', 'green')
    .attr('class', 'line')
    .attr('x1', xScale(midPoint.x))
    .attr('y1', yScale(midPoint.y))
    .attr('x2', xScale(0))
    .attr('y2', yScale(yIntercept));
  }

  return {vertex: midPoint, slope: slope};
}

function drawPerpendicularBisectors() {
  var ab = perpendicularBisector(convertPoint(pointA), convertPoint(pointB));
  var bc = perpendicularBisector(convertPoint(pointA), convertPoint(pointC));
  var cd = perpendicularBisector(convertPoint(pointB), convertPoint(pointC));

  drawCirumCircle(ab, bc);
}

function drawCirumCircle(lineA, lineB) {
  var x1 = - lineA.slope,
      y1 = 1,
      c1 = getYIntercept(lineA.vertex, lineA.slope),
      x2 = - lineB.slope,
      y2 = 1,
      c2 = getYIntercept(lineB.vertex, lineB.slope);

  var matrix = [
    [x1, y1],
    [x2, y2]
  ];

  var circumCircleCentre = solveMatrix(matrix, [c1, c2]),
      dist = distance(convertPoint(pointB), circumCircleCentre);

  g.append('circle')
   .attr('cx', xScale(circumCircleCentre.x))
   .attr('cy', yScale(circumCircleCentre.y))
   .attr('r', xScale(dist))
   .attr('class', 'circumcircle')
   .attr('fill-opacity', 0.0)
   .style('stroke', 'black');
}

drawPerpendicularBisectors();

var that = this;

var drag = d3.behavior
     .drag()
     .on("drag", function(d) {
  
  var circle = d3.select(this);

  d3.select('.triangle').remove();
  d3.select('.circumcircle').remove();
  d3.selectAll('.line').remove();

  that[d.label] = {x: d3.event.x, y: d3.event.y};

  drawTriangle();

  drawPerpendicularBisectors();

  circle
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
});

var circles = g
  .selectAll('.grabber')
  .data([
    {point: pointA, label: 'pointA'},
    {point: pointB, label: 'pointB'},
    {point: pointC, label: 'pointC'}
  ])
  .enter().append('circle')
  .attr('class', function(d) { return 'grabber ' + d.label; })
  .attr('cx', function(d) { return d.point.x; })
  .attr('cy', function(d) { return d.point.y; })
  .attr('r', 10)
  .style('fill', 'red')
  .call(drag);


// drawAltitudes();

// drawMedians();
