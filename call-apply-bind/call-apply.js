Function.prototype.$call = function (ctx, ...args) {
  ctx = ctx || window;

  ctx.fn = this;

  // 可以不用eval，直接 ctx.fn(...args)
  // let ret = eval("ctx.fn(...args)");
  const ret = ctx.fn(...args);

  delete ctx.fn;

  return ret;
};

Function.prototype.$apply = function (ctx, args) {
  ctx = ctx || window;

  ctx.fn = this;

  // let ret = eval("ctx.fn(...args)");
  const ret = ctx.fn(...args);

  delete ctx.fn;

  return ret;
};

const arr = [13, 6, 10, 11, 16];

const max = Math.max.$apply(Math, arr);
const min = Math.min.$call(Math, ...arr);

console.log(max);
console.log(min);
