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

export default {
  getParamFromUrl,
};
