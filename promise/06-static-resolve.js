const PENGDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
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
    while (this.onResolvedCallbacks.length) {
      // this.onResolvedCallbacks.shift()(this.promiseResult);
      this.onResolvedCallbacks.shift()();
    }
  };

  reject = reason => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = REJECTED;
    this.promiseResult = reason;
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()();
    }
  };

  then(
    onResolved = value => value,
    onRjected = reason => {
      throw reason;
    }
  ) {
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.promiseState === FULFILLED) {
        /* 
        取成功回调的返回值, 并判断返回值是普通值还是promise对象, 传递给下一个 promise 的 then 的成功回调:
        返回值是普通值, 直接调用resolve();
        返回值是promise对象, 根据promise对象返回的结果来调用resolve/reject
        */
        setTimeout(() => {
          try {
            let res = onResolved(this.promiseResult);
            resolvePromise(promise2, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else if (this.promiseState === REJECTED) {
        setTimeout(() => {
          try {
            let res = onRjected(this.promiseResult);
            resolvePromise(promise2, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let res = onResolved(this.promiseResult);
              resolvePromise(promise2, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let res = onRjected(this.promiseResult);
              resolvePromise(promise2, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }

  catch(onRjected) {
    return this.then(null, onRjected);
  }

  static all(array) {
    let result = [];
    let index = 0;

    return new MyPromise((resolve, reject) => {
      function addData(key, value) {
        result[key] = value;
        index++;
        if (index === array.length) {
          resolve(result);
        }
      }

      for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (current instanceof MyPromise) {
          current.then(
            value => addData(i, value),
            reason => reject(reason)
          );
        } else {
          addData(i, current);
        }
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }
}

function resolvePromise(promise, ret, resolve, reject) {
  if (promise === ret) {
    return reject(new TypeError("xxx"));
  }
  if (ret instanceof MyPromise) {
    ret.then(resolve, reject);
  } else {
    resolve(ret);
  }
}
