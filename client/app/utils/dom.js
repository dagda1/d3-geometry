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
    right: 50,
    left: 50,
    bottom: 50
  };

  const width = parseInt(el.offsetWidth);
  const height =  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return {
    margin,
    width,
    height
  };
}
