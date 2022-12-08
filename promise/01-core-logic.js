const PENGDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }

  promiseState = PENGDING;
  prommiseResult = undefined;

  resolve = value => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = FULFILLED;
    this.prommiseResult = value;
  };

  reject = reason => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = REJECTED;
    this.prommiseResult = reason;
  };

  then(onResolved, onRjected) {
    if (this.promiseState === FULFILLED) {
      onResolved(this.prommiseResult);
    } else if (this.promiseState === REJECTED) {
      onRjected(this.prommiseResult);
    } else {
      // todo: async task unfinished
    }
  }
}
