import {solveMatrix} from '../utils/matrices';

import {
  distance,
  midpoint,
  gradient,
  perpendicularGradient,
  getYIntercept
} from "../utils/line";

import {
  viewPortFromElement
} from "../utils/dom";

export default class Triangulator {
  render(el, props = {}) {
    if(props.resizeFunc) {
      window.removeEventListener("resize", props.resizeFunc);
    }

    const dimensions = viewPortFromElement(el);

    const xScale = d3.scale.linear()
            .domain([0, 20])
            .range([0, dimensions.width]);

    const yScale = d3.scale.linear()
            .domain([0, 20])
            .range([dimensions.height, 0]);

    let points;

    if(props.points) {
      points = {
        a: {
          x: xScale(props.xScale.invert(props.points.a.x)),
          y: yScale(props.yScale.invert(props.points.a.y))
        },
        b: {
          x: xScale(props.xScale.invert(props.points.b.x)),
          y: yScale(props.yScale.invert(props.points.b.y))
        },
        c: {
          x: xScale(props.xScale.invert(props.points.c.x)),
          y: yScale(props.yScale.invert(props.points.c.y))
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

    const margin = {top: 20, right: 100, bottom: 30, left: 100};

    const svg = d3.select(el).append("svg")
            .attr("width", dimensions.width + margin.left + margin.right)
            .attr("height", dimensions.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append('g')
      .attr('class', 'x axis')
      .attr("transform", "translate(0," + dimensions.height + ")")
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    const area = {
      el: el,
      xScale: xScale,
      yScale: yScale
    };

    area.currentEffect = props.currentEffect || this.drawPerpendicularBisectors;

    area.points = points;

    this.addRadioButtons(area);

    const g = svg.append('g');

    area.g = g;
    area.svg = svg;

    this.drawTriangle(points, g);

    this.addCurrentEffects(area);

    const vertices = [
      {point: area.points.a, label: 'a'},
      {point: area.points.b, label: 'b'},
      {point: area.points.c, label: 'c'}
    ];

    this.addPointLabels(area, vertices);

    this.addGrabbers(area, vertices);
  }

  addRadioButtons(area) {
    const form = d3.select(area.el).append('form');

    const effects = _.toArray(this.getEffects());

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
      }).property('checked', (effect) => {
        const currentEffect = (effect);

        return area.currentEffect === currentEffect.func;
      }).on('change', (effect) => {
        const selected = findEffectFunction(effect);
        area.currentEffect = selected.func;
        this.addCurrentEffects(area);
      });
  }

  getEffects() {
    return {
      "drawPerpendicularBisectors": {
        "func": this.drawPerpendicularBisectors,
        "label": "Perpendicular Bisectors"
      },
      "drawMedians": {
        "func": this.drawMedians,
        "label": "Medians"
      },
      "drawAltitudes": {
        "func": this.drawAltitudes,
        "label": "Altitudes"
      }
    };
  }

  drawMedians(area) {
    this.drawMedian(area, area.points.a, area.points.b ,area.points.c);
    this.drawMedian(area, area.points.b, area.points.a, area.points.c);
    this.drawMedian(area, area.points.c, area.points.b, area.points.a);
  }

  drawMedian(area, vertex, pointA, pointB) {
    const mid = midpoint(pointA, pointB);

    this.drawTriangleLine(area.g, {
      x1: vertex.x,
      y1: vertex.y,
      x2: mid.x,
      y2: mid.y
    });
  }

  drawAltitudes(area) {
    this.altitude(area, this.convertPoint(area, 'a'), this.convertPoint(area, 'b'), this.convertPoint(area, 'c'));
    this.altitude(area, this.convertPoint(area, 'b'), this.convertPoint(area, 'a'), this.convertPoint(area, 'c'));
    this.altitude(area, this.convertPoint(area, 'c'), this.convertPoint(area, 'b'), this.convertPoint(area, 'a'));
  }

  altitude(area, vertex, a, b) {
    const slope = gradient(a, b);
    const x1 = - slope;
    const y1 = 1;
    const c1 = getYIntercept(a, slope);
    const perpendicularSlope = perpendicularGradient(a, b);
    const x2 = - perpendicularSlope;
    const y2 = 1;
    const c2 = getYIntercept(vertex, perpendicularSlope);

    const matrix = [
      [x1, y1],
      [x2, y2]
    ];

    const result = solveMatrix(matrix, [c1, c2]);

    this.drawTriangleLine(area.g, {
      x1: area.xScale(vertex.x),
      y1: area.yScale(vertex.y),
      x2: area.xScale(result.x),
      y2: area.yScale(result.y)
    });
  }

  drawPerpendicularBisectors(area) {
    const ab = this.perpendicularBisector(area, this.convertPoint(area, 'a'), this.convertPoint(area, 'b'));
    const ac = this.perpendicularBisector(area, this.convertPoint(area, 'a'), this.convertPoint(area, 'c'));
    this.perpendicularBisector(area, this.convertPoint(area, 'b'), this.convertPoint(area, 'c'));

    this.drawCirumCircle(area, ab, ac);
  }

  perpendicularBisector(area, a, b) {
    const slope = perpendicularGradient(a, b);
    const midPoint = midpoint(a, b);
    const yIntercept = getYIntercept(midPoint, slope);
    const xIntercept =  - yIntercept / (slope);

    if((yIntercept === Infinity || yIntercept === -Infinity)) {
      return this.drawTriangleLine(area.g, {
        x1: area.xScale(midPoint.x),
        y1: area.yScale(0),
        x2: area.xScale(midPoint.x),
        y2: area.yScale(20)
      });
    }

    if((a.x === b.x) || isNaN(xIntercept)) {
      this.drawTriangleLine(area.g, {
        x1: area.xScale(0),
        y1: area.yScale(midPoint.y),
        x2: area.xScale(20),
        y2: area.yScale(midPoint.y)
      });

      return { vertex: midPoint, slope: slope};
    }

    if(xIntercept < 0 || yIntercept < 0) {
      this.drawTriangleLine(area.g, {
        x1: area.xScale(xIntercept),
        y1: area.yScale(0),
        x2: area.xScale(20),
        y2: area.yScale((slope * 20) + yIntercept)
      });

      return { vertex: midPoint, slope: slope};
    }

    this.drawTriangleLine(area.g, {
      x1: area.xScale(xIntercept),
      y1: area.yScale(0),
      x2: area.xScale(0),
      y2: area.yScale(yIntercept)
    });

    return {vertex: midPoint, slope: slope};
  }

  drawCirumCircle(area, lineA, lineB) {
    if(!lineA || !lineB) {
      return;
    }

    const x1 = - lineA.slope;
    const y1 = 1;
    const c1 = getYIntercept(lineA.vertex, lineA.slope);
    const x2 = - lineB.slope;
    const y2 = 1;
    const c2 = getYIntercept(lineB.vertex, lineB.slope);

    const matrix = [
      [x1, y1],
      [x2, y2]
    ];

    const circumCircleCentre = solveMatrix(matrix, [c1, c2]);
    const dist = distance(this.convertPoint(area, 'b'), circumCircleCentre) - 0.7;

    console.log(dist);

    area.g.append('circle')
      .attr('cx', area.xScale(circumCircleCentre.x))
      .attr('cy', area.yScale(circumCircleCentre.y))
      .attr('r', area.xScale(dist))
      .attr('class', 'circumcircle')
      .attr('fill-opacity', 0.0)
      .style('stroke', 'red');
  }

  addCurrentEffects(area) {
    d3.select('.circumcircle').remove();
    d3.selectAll('.line').remove();

    area.currentEffect.call(this, area);
  }

  drawTriangle(points, g) {
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

  drawTriangleLine(group, vertices) {
    group.append('line')
      .style('stroke', 'red')
      .attr('class', 'line')
      .attr('x1', vertices.x1)
      .attr('y1', vertices.y1)
      .attr('x2', vertices.x2)
      .attr('y2', vertices.y2);
  }

  convertPoint(area, point) {
    return {
      x: area.xScale.invert(area.points[point].x),
      y: area.yScale.invert(area.points[point].y)
    };
  }

  addPointLabels(area, vertices) {
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

  draggable(area, d) {
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

    this.drawTriangle(area.points, area.g);

    this.addCurrentEffects(area);

    circle
      .attr('cx', d.x = d3.event.x)
      .attr('cy', d.y = d3.event.y);
  }

  addGrabbers(area, vertices) {
    const drag = d3.behavior
            .drag()
            .on("drag", this.draggable.bind(this, area));

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
};
