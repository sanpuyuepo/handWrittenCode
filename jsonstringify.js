function jsonStringify(data) {
  const type = typeof data;

  if (type !== "object") {
    let ret = data;
    if (Number.isNaN(data) || data === Infinity) {
      ret = "null";
    } else if (type === ("function" || "undefined" || "symbol")) {
      ret = "undefined";
    } else if (type === "string") {
      ret = '"' + data + '"';
    }
    return String(ret);
  }
  // 引用数据类型
  else if (type === "object") {
    if (data === null) return "null";
    else if (data.toJSON && typeof data.toJSON === "function") {
      return jsonStringify(data.toJSON());
    } else if (data instanceof Array) {
      let ret = [];
      data.forEach((item, index) => {
        if (typeof item === ("function" || "undefined" || "symbol")) {
          ret[index] = "null";
        } else {
          ret[index] = jsonStringify(item);
        }
      });
      ret = "[" + ret + "]";
      return ret.replace(/'/g, '"');
    } else {
      // 普通对象
      let ret = [];
      Object.keys(data).forEach((item, index) => {
        if (typeof item !== "symbol") {
          if (
            data[item] !== undefined &&
            typeof data[item] !== "function" &&
            typeof data[item] !== "symbol"
          ) {
            ret.push('"' + item + '":' + jsonStringify(data[item]));
          }
        }
      });
      return ("{" + ret + "}").replace(/'/g, '"');
    }
  }
}

const obj = {
  name: "yopox",
  age: 22,
};

console.log(typeof obj);
console.log(typeof jsonStringify(obj));
