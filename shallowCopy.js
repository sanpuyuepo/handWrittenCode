/*
浅拷贝：
简单理解为:自己创建一个新的对象，来接受需要重新复制或引用的对象值
如果对象属性是基本数据类型，复制的就是基本类型的值给新对象；
如果对象属性是引用数据类型，复制的就是内存中的地址，如果复制对象改变了这个内存中的地址，肯定会影响到原始对象
*/
/* 
常用浅拷贝方法：
1. Object.assign()
2. ...扩展运算符
3. 数组的 concat()
4. 数组的 slice()
*/
function shallowCopy(target) {
  if (typeof target === "object" && target !== null) {
    const copyTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
      if (Object.hasOwnProperty.call(target, key)) {
        copyTarget[key] = target[key];
      }
    }
    return copyTarget;
  } else {
    return target;
  }
}
