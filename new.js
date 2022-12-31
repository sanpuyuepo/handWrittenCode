/* 
实现一个 new 方法

new的执行步骤：
1. 创建一个新对象；
2. 新对象内部的 [[prototype]] 指针赋值为构造函数的 prototype 属性
3. 构造函数内部的 this 赋值为该新对象，即 this 指向新对象
4. 执行构造函数中的代码，给新对象添加属性
5. 如果构造函数返回非空对象，则返回该对象；否则返回创建的新对象
*/

function _new(ctor, ...args) {
  if (typeof ctor !== "function")
    throw new TypeError("ctor must be a function");

  // 创建新对象
  let obj = new Object();
  // prototype
  obj.__proto__ = Object.create(ctor.prototype);
  // this 指向新对象, 添加属性
  let res = ctor.apply(obj, args);

  // 判断返回结果
  let isObject = typeof res === "object" && res !== null;
  let isFunction = typeof res === "function";

  return isObject || isFunction ? res : obj;
}

function Person() {
  this.name = "Jack";

  // return { age: 18 };
}

// var p = new Person();
var p = _new(Person);

console.log(p); // {age: 18}
console.log(p.name); // undefined
console.log(p.age); // 18
