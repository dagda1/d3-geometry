export function midpoint(a, b) {
  return {x: ((a.x + b.x) / 2), y: ((a.y + b.y) / 2)};
}

export function gradient(a, b) {
  return ((b.y - a.y) / (b.x - a.x));
}

export function perpendicularGradient(a, b) {
  return -1 / gradient(a, b);
}

export function getYIntercept(vertex, slope) {
  return vertex.y - (slope * vertex.x);
}

export function distance(a, b) {
  return Math.floor(Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2)));
}
