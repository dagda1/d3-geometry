export function wait(condition, func, counter = 0) {
  if(condition() || counter > 10) {
    return func();
  }

  setTimeout(wait.bind(null, condition, func, (counter + 1)), 30);
};