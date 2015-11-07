export function availableViewPort() {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight);

  return {
    w: w,
    h: h
  };
}