/**
 * 实现 instanceof 方法
 * 思路：
 *    1. 判断一个数据是否是某个引用类型的实例，所以需要两个参数
 *    2. 如果是原始数据类型，返回false：这里使用typeof判断，注意两个特殊点：typeof function、typeof null
 *    3. 如果是引用类型，获取该值的原型，
 *       如果与类型的原型对象相等，则说明该值是该类型的实例，返回true，
 *       如果不是，则去找该值原型的原型，依次类推，直到null，返回false。
 *    4. 获取原型用方法：Object.getPrototypeOf():
 * @param {*} value 要判断的引用类型
 * @param {*} type 对象
 * @returns 布尔值
 */
function myInstanceof(value, type) {
  // 两个特殊：typeof function、typeof null
  if (typeof value === "function") return true;
  // primitive
  if (typeof value !== "object" || value === null) return false;

  // reference
  let proto = Object.getPrototypeOf(value);
  while (true) {
    if (proto === null) return false;
    if (proto === type.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

// console.log(myInstanceof([1, 2, 3], Array));
// console.log(myInstanceof(myInstanceof, Function));
// console.log(myInstanceof({}, Object));
// console.log(myInstanceof("100", String));
// console.log("100" instanceof String);
console.log(NaN instanceof Number);
console.log(myInstanceof(NaN, Number));
