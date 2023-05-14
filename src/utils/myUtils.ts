const urlParamKey = "urlParamData=";
/**
 * 返回url传输的对象
 */
export const getParamFromUrl = function (): any {
  const url = decodeURIComponent(document.location.href);
  const index = url.indexOf(urlParamKey);
  if (index >= 0) {
    return JSON.parse(url.substring(index + urlParamKey.length));
  }
  return null;
};

/**
 * 处理map类型序列化后为 {} 的情况
 */
export function stringify(obj: any): string {
  return JSON.stringify(cloneToObject(obj));
}

/**
 * 将字段包含map的对象转为json对象的格式
 * 解决map对象被JSON序列化后，为{}的情况
 * @param obj
 * @returns
 */
export function cloneToObject(obj: any): any {
  let newObj: any = obj;
  if (obj instanceof Map) {
    return Object.fromEntries(obj);
  }
  if (obj instanceof Object) {
    newObj = {};
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      newObj[key] = cloneToObject(value);
    }
  }
  if (obj instanceof Array) {
    newObj = [];
    for (let i = 0; i < obj.length; i++) {
      newObj[i] = cloneToObject(obj[i]);
    }
  }
  return newObj;
}

export default {
  getParamFromUrl,
  stringify,
  cloneToObject,
};
