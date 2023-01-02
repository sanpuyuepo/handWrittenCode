/**
 * 模拟实现lodash中的 flowRight 方法
 */

function compose(...fns) {
  return function (value) {
    return fns.reverse().reduce((acc, func) => func(acc), value);
  };
}

// test:
function reverse(array) {
  return array.reverse();
}

function first(array) {
  return array[0];
}

const last = compose(first, reverse);

let r = last([1, 2, 3, 4]);
console.log(r);
