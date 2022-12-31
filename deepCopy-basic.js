/*
深拷贝：
将一个对象从内存中完整地拷贝出来一份给目标对象，
并从堆内存中开辟一个全新的空间，存放新对象，
且新对象的修改并不会改变原对象，二者实现真正的分离。
*/
/* 
常用深拷贝方法：
1. JSON.stringify()/JSON.parse()
*/

function deepClone(target) {
  const cloneTarget = {};

  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      if (typeof target[key] === "object") {
        cloneTarget[key] = deepClone(target[key]);
      } else {
        cloneTarget[key] = target[key];
      }
    }
  }
  return cloneTarget;
}

/**
基础版（手写递归实现）存在的问题: 
1. 这个深拷贝函数并不能复制不可枚举的属性以及 Symbol 类型；
2. 这种方法只是针对普通的引用类型的值做递归复制，而对于 Array、Date、RegExp、Error、Function 这样的引用类型并不能正确地拷贝；
3. 对象的属性里面成环，即循环引用没有解决。
 */
