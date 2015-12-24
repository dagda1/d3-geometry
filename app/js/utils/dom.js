export function availableViewPort() {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight);

  return {
    w: w,
    h: h
  };
}

export function viewPortFromElement(el) {
  const scrollPosition = document.querySelector('body').scrollTop;
  const availableHeight = (window.innerHeight - (el.offsetTop - scrollPosition)) * 0.65;

  const availableWidth = availableHeight * 1.24;

  return {
    width: availableWidth,
    height: availableHeight
  };
}