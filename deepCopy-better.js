/* 
改进方法:
1. 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys() 方法；
2. 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；
3. 利用 Object 的 getOwnPropertyDescriptors() 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create() 方法创建一个新对象，并继承传入原对象的原型链；
4. 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏（你可以关注一下 Map 和 weakMap 的关键区别，这里要用 weakMap()，作为检测循环引用很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。
*/

function isComplexDataType(obj) {
  return (typeof obj === "object" || typeof obj === "function") && obj !== null;
}

function deepClone(obj, hash = new WeakMap()) {
  // Date/RegExp
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);

  // weakMap 解决循环引用
  if (hash.has(obj)) return hash.get(obj);

  // 获取源对象所有自身属性的描述符
  let allDescriptors = Object.getOwnPropertyDescriptors(obj);
  // 设置克隆对象的原型为源对象的原型，并传入源对象的自有可枚举属性
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDescriptors);

  // 解决循环引用
  hash.set(obj, cloneObj);

  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key] =
      isComplexDataType(obj[key]) && typeof obj[key] !== "function"
        ? deepClone(obj[key], hash)
        : obj[key];
  }
  return cloneObj;
}
