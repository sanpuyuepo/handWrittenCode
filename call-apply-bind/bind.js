Function.prototype.$bind = function (ctx, ...args) {
  if (typeof this !== "function")
    throw new TypeError("this must be a function");

  const self = this;

  const bindFn = function () {
    self.apply(
      this instanceof self ? this : ctx,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };

  if (this.prototype) {
    bindFn.prototype = Object.create(this.prototype);
  }

  return bindFn;
};
