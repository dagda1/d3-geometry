export function availableViewPort() {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight);

  return {
    w: w,
    h: h
  };
}

export function viewPortFromElement(el) {
  const margin = {
    top: 20,
    right: 100,
    bottom: 30,
    left: 100
  };

  const w = el.offsetWidth;

  const h =  w * 0.68;

  return {
    margin,
    width: w,
    height: h
  };
}
