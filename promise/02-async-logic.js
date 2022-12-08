const PENGDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  promiseState = PENGDING;
  promiseResult = undefined;

  // async task unfinished, need to save callbacks
  onResolvedCallbacks = [];
  onRejectedCallbacks = [];

  resolve = value => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = FULFILLED;
    this.promiseResult = value;
    // todo: async task
    while (this.onResolvedCallbacks.length) {
      this.onResolvedCallbacks.shift()(this.promiseResult);
    }
  };

  reject = reason => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = REJECTED;
    this.promiseResult = reason;
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.promiseResult);
    }
  };

  then(onResolved, onRjected) {
    if (this.promiseState === FULFILLED) {
      onResolved(this.promiseResult);
    } else if (this.promiseState === REJECTED) {
      onRjected(this.promiseResult);
    } else {
      this.onResolvedCallbacks.push(onResolved);
      this.onRejectedCallbacks.push(onRjected);
    }
  }
}
