(function () {
   'use strict';
}());

import {solveMatrix} from './utils/matrices';

import {
  distance,
  midpoint,
  gradient,
  perpendicularGradient,
  getYIntercept
} from "./utils/line";

import {
  availableViewPort
} from "./utils/dom";

function convertPoint(area, point) {
  return {
    x: area.xScale.invert(area.points[point].x),
    y: area.yScale.invert(area.points[point].y)
  };
}

function render(state = {}) {
  if(state.resizeFunc) {
    window.removeEventListener("resize", state.resizeFunc);
  }

  const viewportDimensions = availableViewPort();

  const availableHeight = viewportDimensions.h - 50;
  const availableWidth = availableHeight * 1.32;

  const margin = {top: 20, right: 100, bottom: 30, left: 100},
        width = availableWidth - margin.left - margin.right,
        height = availableHeight - margin.top - margin.bottom;

  d3.select("body").select("svg").remove();

  d3.selectAll('label').remove();
  d3.selectAll('input[type=radio]').remove();

  const initialScale = 1;
  const initialXY = [0, 0];

  d3.behavior.zoom()
    .scale(initialScale)
    .translate(initialXY)
    .size([width, height])
    .on("zoom",function() {
      svg.attr("transform","translate("+ d3.event.translate.join(",") + ") scale(" + d3.event.scale + ")");
    });


  const xScale = d3.scale.linear()
          .domain([0, 20])
          .range([0, width]);

  const yScale = d3.scale.linear()
          .domain([0, 20])
          .range([height, 0]);

  let points;

  if(state.points) {
    points = {
      a: {
        x: xScale(state.xScale.invert(state.points.a.x)),
        y: yScale(state.yScale.invert(state.points.a.y))
      },
      b: {
        x: xScale(state.xScale.invert(state.points.b.x)),
        y: yScale(state.yScale.invert(state.points.b.y))
      },
      c: {
        x: xScale(state.xScale.invert(state.points.c.x)),
        y: yScale(state.yScale.invert(state.points.c.y))
      }
    };
  } else {
    points = {
      a: {x: xScale(0), y: yScale(0)},
      b: {x: xScale(6), y: yScale(18)},
      c: {x: xScale(16), y: yScale(2)}
    };
  }

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

  const area = {
    xScale: xScale,
    yScale: yScale
  };

  area.currentEffect = state.currentEffect || drawMedians;

  area.points = points;

  addRadioButtons(area);

  const g = svg.append('g');

  area.g = g;
  area.svg = svg;

  const vertices = [
    {point: area.points.a, label: 'a'},
    {point: area.points.b, label: 'b'},
    {point: area.points.c, label: 'c'}
  ];

  drawTriangle(points, g);

  addCurrentEffects(area);

  addPointLabels(area, vertices);

  addGrabbers(area, vertices);

  const resizeFunc = render.bind(null, area);

  area.resizeFunc = resizeFunc;

  //window.addEventListener("resize", area.resizeFunc);
}

function addRadioButtons(area) {
  const form = d3.select('body').append('form');

  const effects = _.toArray(getEffects());

  const findEffectFunction = (effect) => {
    return _.find(effects, (e) =>  {
      return effect.label === e.label;
    });
  };

  form.selectAll('label')
    .data(effects)
    .enter()
    .append('label')
    .text(function(d) { return d.label; })
    .insert('input')
    .attr({
      type: 'radio',
      class: "shape",
      name: 'mode',
      value: function(d) {
        return d;
      }
    }).property('checked', function(effect) {
      const currentEffect = findEffectFunction(effect);

      return area.currentEffect === currentEffect.func;
    }).on('change', function(effect) {
      const selected = findEffectFunction(effect);
      area.currentEffect = selected.func;
      addCurrentEffects(area);
    });
}

function addCurrentEffects(area) {
  d3.select('.circumcircle').remove();
  d3.selectAll('.line').remove();

  area.currentEffect.call(null, area);
}

function drawTriangle(points, g) {
  g.append('path')
    .attr('d', function() {
      return 'M ' + points.a.x +' '+ points.a.y +
             ' L' + points.b.x + ' ' + points.b.y +
             ' L' + points.c.x + ' ' + points.c.y +
             ' z';
    })
    .attr('class', 'triangle')
    .attr('fill-opacity', 0.3)
    .style('stroke', 'red');
}

function drawMedian(area, vertex, pointA, pointB) {
  const mid = midpoint(pointA, pointB);

  drawTriangleLine(area.g, {
    x1: vertex.x,
    y1: vertex.y,
    x2: mid.x,
    y2: mid.y
  });
}

function drawMedians(area) {
  drawMedian(area, area.points.a, area.points.b ,area.points.c);
  drawMedian(area, area.points.b, area.points.a, area.points.c);
  drawMedian(area, area.points.c, area.points.b, area.points.a);
}

function drawAltitudes(area) {
  altitude(area, convertPoint(area, 'a'), convertPoint(area, 'b'), convertPoint(area, 'c'));
  altitude(area, convertPoint(area, 'b'), convertPoint(area, 'a'), convertPoint(area, 'c'));
  altitude(area, convertPoint(area, 'c'), convertPoint(area, 'b'), convertPoint(area, 'a'));
}

function altitude(area, vertex, a, b) {
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

  drawTriangleLine(area.g, {
    x1: area.xScale(vertex.x),
    y1: area.yScale(vertex.y),
    x2: area.xScale(result.x),
    y2: area.yScale(result.y)
  });
}

function drawTriangleLine(group, vertices) {
  group.append('line')
    .style('stroke', 'red')
    .attr('class', 'line')
    .attr('x1', vertices.x1)
    .attr('y1', vertices.y1)
    .attr('x2', vertices.x2)
    .attr('y2', vertices.y2);
}

function perpendicularBisector(area, a, b) {
  const slope = perpendicularGradient(a, b),
        midPoint = midpoint(a, b),
        yIntercept = getYIntercept(midPoint, slope),
        xIntercept =  - yIntercept / (slope);

  if((yIntercept === Infinity || yIntercept === -Infinity)) {
    return drawTriangleLine(area.g, {
      x1: area.xScale(midPoint.x),
      y1: area.yScale(0),
      x2: area.xScale(midPoint.x),
      y2: area.yScale(20)
    });
  }

  if((a.x === b.x) || isNaN(xIntercept)) {
    drawTriangleLine(area.g, {
      x1: area.xScale(0),
      y1: area.yScale(midPoint.y),
      x2: area.xScale(20),
      y2: area.yScale(midPoint.y)
    });

    return { vertex: midPoint, slope: slope};
  }

  if(xIntercept < 0 || yIntercept < 0) {
    drawTriangleLine(area.g, {
      x1: area.xScale(xIntercept),
      y1: area.yScale(0),
      x2: area.xScale(20),
      y2: area.yScale((slope * 20) + yIntercept)
    });

    return { vertex: midPoint, slope: slope};
  }

  drawTriangleLine(area.g, {
      x1: area.xScale(xIntercept),
      y1: area.yScale(0),
      x2: area.xScale(0),
      y2: area.yScale(yIntercept)
    });

  return {vertex: midPoint, slope: slope};
}

function drawPerpendicularBisectors(area) {
  const ab = perpendicularBisector(area, convertPoint(area, 'a'), convertPoint(area, 'b'));
  const ac = perpendicularBisector(area, convertPoint(area, 'a'), convertPoint(area, 'c'));
  perpendicularBisector(area, convertPoint(area, 'b'), convertPoint(area, 'c'));

  drawCirumCircle(area, ab, ac);
}

function drawCirumCircle(area, lineA, lineB) {
  if(!lineA || !lineB) {
    return;
  }

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
        dist = distance(convertPoint(area, 'b'), circumCircleCentre);

  area.g.append('circle')
   .attr('cx', area.xScale(circumCircleCentre.x))
   .attr('cy', area.yScale(circumCircleCentre.y))
   .attr('r', area.xScale(dist))
   .attr('class', 'circumcircle')
   .attr('fill-opacity', 0.0)
   .style('stroke', 'red');
}

function getEffects() {
  return {
    "drawPerpendicularBisectors": {
      "func": drawPerpendicularBisectors,
      "label": "Perpendicular Bisectors"
    },
    "drawMedians": {
      "func": drawMedians,
      "label": "Medians"
    },
    "drawAltitudes": {
      "func": drawAltitudes,
      "label": "Altitudes"
    }
  };
}

function addPointLabels(area, vertices) {
  area.g.selectAll('text')
    .data(vertices)
    .enter().append('text')
    .attr("x", function(d){return d.point.x + 10;})
    .attr("y", function(d){return d.point.y + 10;})
    .attr('class', function(d) {return "label " + d.label;})
    .text( function(d) {
      const x = Math.round(area.xScale.invert(d.point.x));
      const y = Math.round(area.yScale.invert(d.point.y));

      return `${d.label.toUpperCase()} (${x}, ${y})`;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .attr("fill", "black");
}

function addGrabbers(area, vertices) {
  const drag = d3.behavior
        .drag()
        .on("drag", draggable.bind(null, area));

  area.g.selectAll('.grabber')
    .data(vertices)
    .enter().append('circle')
    .attr('class', function(d) { return 'grabber ' + d.label; })
    .attr('cx', function(d) { return d.point.x; })
    .attr('cy', function(d) { return d.point.y; })
    .attr('r', 10)
    .style('fill', 'red')
    .call(drag);
}


function draggable(area, d) {
  const circle = d3.select(`.grabber.${d.label}`);

  d3.select('.triangle').remove();
  d3.select('.circumcircle').remove();
  d3.selectAll('.line').remove();

  const label = d3.select(".label." + d.label);
  const x = d3.format(",.0f")(area.xScale.invert(d3.event.x));
  const y = d3.format(",.0f")(area.yScale.invert(d3.event.y));

  label.text( function () {
    return `${d.label.toUpperCase()} (${x}, ${y})`;
  });

  label.attr('x', d3.event.x).attr('y', d3.event.y - 20);

  area.points[d.label] = {x: d3.event.x, y: d3.event.y};

  drawTriangle(area.points, area.g);

  addCurrentEffects(area);

  circle
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
}

render();
