webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	__webpack_require__(3);

	var margin = { top: 20, right: 100, bottom: 30, left: 100 },
	    width = 660 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var xScale = d3.scale.linear().domain([0, 20]).range([0, width]);

	var yScale = d3.scale.linear().domain([0, 20]).range([height, 0]);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + height + ")").call(xAxis);

	svg.append('g').attr('class', 'y axis').call(yAxis);

	var pointA = { x: xScale(1), y: yScale(1) },
	    pointB = { x: xScale(6), y: yScale(18) },
	    pointC = { x: xScale(14), y: yScale(6) };

	var g = svg.append('g');

	var drawTriangle = function drawTriangle() {
	  g.append('path').attr('d', function (d) {
	    return 'M ' + pointA.x + ' ' + pointA.y + ' L' + pointB.x + ' ' + pointB.y + ' L' + pointC.x + ' ' + pointC.y + ' z';
	  }).attr('class', 'triangle').style('stroke', 'blue');
	};

	drawTriangle();

	Math.approx = function (d) {
	  return Math.round(d * 100) / 100;
	};

	var midpoint = function midpoint(a, b) {
	  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
	};

	var gradient = function gradient(a, b) {
	  return (b.y - a.y) / (b.x - a.x);
	};

	var perpendicularGradient = function perpendicularGradient(a, b) {
	  return -1 / gradient(a, b);
	};

	var convertPoint = function convertPoint(point) {
	  return { x: xScale.invert(point.x), y: yScale.invert(point.y) };
	};

	function getYIntercept(vertex, slope) {
	  return vertex.y - slope * vertex.x;
	}

	function distance(a, b) {
	  return Math.floor(Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)));
	}

	function det(matrix) {
	  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
	}

	function solveMatrix(matrix, r) {
	  var determinant = det(matrix);
	  var x = det([[r[0], matrix[0][1]], [r[1], matrix[1][1]]]) / determinant;

	  var y = det([[matrix[0][0], r[0]], [matrix[1][0], r[1]]]) / determinant;

	  return { x: Math.approx(x), y: Math.approx(y) };
	}

	function drawMedian(vertex, pointA, pointB) {
	  var mid = midpoint(pointA, pointB);

	  g.append('line').style('stroke', 'red').attr('class', 'line').attr('x1', vertex.x).attr('y1', vertex.y).attr('x2', mid.x).attr('y2', mid.y);
	}

	function drawMedians() {
	  drawMedian(pointA, pointB, pointC);
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
	      x1 = -slope,
	      y1 = 1,
	      c1 = getYIntercept(a, slope),
	      perpendicularSlope = perpendicularGradient(a, b),
	      x2 = -perpendicularSlope,
	      y2 = 1,
	      c2 = getYIntercept(vertex, perpendicularSlope);

	  var matrix = [[x1, y1], [x2, y2]];

	  var result = solveMatrix(matrix, [c1, c2]);

	  g.append('line').style('stroke', 'red').attr('class', 'line').attr('x1', xScale(vertex.x)).attr('y1', yScale(vertex.y)).attr('x2', xScale(result.x)).attr('y2', yScale(result.y));
	}

	function perpendicularBisector(a, b) {
	  var slope = perpendicularGradient(a, b),
	      midPoint = midpoint(a, b),
	      yIntercept = getYIntercept(midPoint, slope),
	      xIntercept = -yIntercept / slope;

	  if (xIntercept > 0) {
	    g.append('line').style('stroke', 'green').attr('class', 'line').attr('x1', xScale(0)).attr('y1', yScale(yIntercept)).attr('x2', xScale(xIntercept)).attr('y2', yScale(0));
	  } else {
	    svg.append('line').style('stroke', 'green').attr('class', 'line').attr('x1', xScale(midPoint.x)).attr('y1', yScale(midPoint.y)).attr('x2', xScale(0)).attr('y2', yScale(yIntercept));
	  }

	  return { vertex: midPoint, slope: slope };
	}

	function drawPerpendicularBisectors() {
	  var ab = perpendicularBisector(convertPoint(pointA), convertPoint(pointB));
	  var bc = perpendicularBisector(convertPoint(pointA), convertPoint(pointC));
	  var cd = perpendicularBisector(convertPoint(pointB), convertPoint(pointC));

	  drawCirumCircle(ab, bc);
	}

	function drawCirumCircle(lineA, lineB) {
	  var x1 = -lineA.slope,
	      y1 = 1,
	      c1 = getYIntercept(lineA.vertex, lineA.slope),
	      x2 = -lineB.slope,
	      y2 = 1,
	      c2 = getYIntercept(lineB.vertex, lineB.slope);

	  var matrix = [[x1, y1], [x2, y2]];

	  var circumCircleCentre = solveMatrix(matrix, [c1, c2]),
	      dist = distance(convertPoint(pointB), circumCircleCentre);

	  g.append('circle').attr('cx', xScale(circumCircleCentre.x)).attr('cy', yScale(circumCircleCentre.y)).attr('r', xScale(dist)).attr('class', 'circumcircle').attr('fill-opacity', 0.0).style('stroke', 'black');
	}

	drawPerpendicularBisectors();

	var that = undefined;

	var drag = d3.behavior.drag().on("drag", function (d) {

	  var circle = d3.select(this);

	  d3.select('.triangle').remove();
	  d3.select('.circumcircle').remove();
	  d3.selectAll('.line').remove();

	  that[d.label] = { x: d3.event.x, y: d3.event.y };

	  drawTriangle();

	  drawPerpendicularBisectors();

	  circle.attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
	});

	var circles = g.selectAll('.grabber').data([{ point: pointA, label: 'pointA' }, { point: pointB, label: 'pointB' }, { point: pointC, label: 'pointC' }]).enter().append('circle').attr('class', function (d) {
	  return 'grabber ' + d.label;
	}).attr('cx', function (d) {
	  return d.point.x;
	}).attr('cy', function (d) {
	  return d.point.y;
	}).attr('r', 10).style('fill', 'red').call(drag);

	// drawAltitudes();

	// drawMedians();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?root=.!./style.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?root=.!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".chart {\n  background: #fff;\n  font: 10px sans-serif;\n  shape-rendering: crispEdges;\n}\n.chart text {\n  fill: black;\n}\n.axis line, .axis path {\n  fill: none;\n  stroke: #000;\n  shape-rendering: crispEdges;\n}\n\n.axis text {\n  text-shadow: 0 1px 0 #fff;\n  cursor: move;\n}", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
]);