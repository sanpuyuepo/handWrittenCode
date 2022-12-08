/**
 * 补充：使用setTimeout()将代码变为异步代码有个缺点：
 * setTimeout() 是宏任务，而promise是微任务，
 * 修改为使用 queueMicroTask() :
 */

const PENGDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    // 1. 捕获执行器错误
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  promiseState = PENGDING;
  promiseResult = undefined;

  onResolvedCallbacks = [];
  onRejectedCallbacks = [];

  resolve = value => {
    if (this.promiseState !== PENGDING) return;
    this.promiseState = FULFILLED;
    this.promiseResult = value;
    while (this.onResolvedCallbacks.length) {
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

  // ^ 实例方法:
  then(
    onResolved = value => value,
    onRejected = reason => {
      throw reason;
    }
  ) {
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.promiseState === FULFILLED) {
        queueMicrotask(() => {
          try {
            let res = onResolved(this.promiseResult);
            resolvePromise(promise2, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.promiseState === REJECTED) {
        queueMicrotask(() => {
          try {
            let res = onRejected(this.promiseResult);
            resolvePromise(promise2, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        this.onResolvedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              let res = onResolved(this.promiseResult);
              resolvePromise(promise2, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              let res = onRejected(this.promiseResult);
              resolvePromise(promise2, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  // catch
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      value => {
        return MyPromise.resolve(onFinally()).then(() => value);
      },
      reason => {
        return MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        });
      }
    );
  }

  // ^ 静态方法
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

  // Promise.race()
  static race(array) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          current.then(resolve, reject);
        } else {
          resolve(current);
        }
      }
    });
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  // Promise.reject()
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise2, res, resolve, reject) {
  if (promise2 === res) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }

  if (res instanceof MyPromise) {
    res.then(resolve, reject);
  } else {
    resolve(res);
  }
}

console.log(1);
setTimeout(() => console.log(2));
MyPromise.resolve().then(() => console.log(3));
MyPromise.resolve().then(() => setTimeout(() => console.log(4)));
MyPromise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);

// 1 7 3 5 2 6 4
