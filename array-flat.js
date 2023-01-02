/**
 * 数组扁平化
 */

// 1.递归实现
function recursiveFlat(arr) {
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    if (!Array.isArray(arr[i])) {
      ret.push(arr[i]);
    }
    ret = ret.concat(recursiveFlat(arr[i]));
  }
  return ret;
}

// 2. reduce 实现
function reduceFlat(arr) {
  let ret = [];
  return arr.reduce((prevVal, curVal, index, arr) => {
    return prevVal.concat(Array.isArray(curVal) ? reduceFlat(curVal) : curVal);
  }, ret);
}

// 3. ... + some()
function someFlat(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// 4. split() + toString(): 扁平化后的每一项都会变为字符串
function splitFlat(arr) {
  return arr.toString().split(",");
}

// 5. es6 flat()
function flatten(arr) {
  return arr.flat(Infinity);
}

const arr = [1, 2, [3, 4, [5, 6, 7]]];

console.log(recursiveFlat(arr));
console.log(reduceFlat(arr));
console.log(someFlat(arr));
console.log(splitFlat(arr));
console.log(flatten(arr));
