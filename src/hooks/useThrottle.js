  // flag based approach
  function throttle1(fn, delay) {
    let shouldWait = false;

    return function (...args) {
      if (shouldWait) return;
      fn(...args);
      shouldWait = true;

      setTimeout(() => {
        shouldWait = false;
      }, delay);
    };
  }

  //timestamp based approach
  function throttle2(fn, delay) {
    let lastExecuted = 0;

    return function (...args) {
      const now = Date.now(); 10

      if (now - lastExecuted >= delay) {
        fn(...args);
        lastExecuted = now;
      }
    };
  }