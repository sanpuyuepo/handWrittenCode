/**
 * 实现一个柯里化函数
 */

function curry(fn) {
  return function curriedFn(...args) {
    // 传递部分参数
    if (args.length < fn.length) {
      // 返回一个函数接受剩余参数
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)));
      };
    }
    return fn(...args);
  };
}

// Test:
function getSum(a, b, c) {
  return a + b + c;
}

const curried = curry(getSum);

console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));
console.log(curried(1, 2)(3));
