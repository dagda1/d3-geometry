export function availableViewPort() {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight);

  return {
    w: w,
    h: h
  };
}

export function viewPortFromElement(el, square) {
  const margin = {
    top: 20,
    right: 100,
    bottom: 30,
    left: 30
  };

  let h, w;

  h = el.clientHeight || Math.min(document.documentElement.clientHeight - 100, 500)

  if(square) {
    w = h;
  } else {
    w = Math.min(el.clientWidth, document.documentElement.clientWidth);
  }

  return {
    margin,
    width: w,
    height: h
  };
}
