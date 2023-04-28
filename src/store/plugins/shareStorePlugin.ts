import { ipcRenderer } from "electron";
import cacheUtils from "@/utils/cacheUtils";
import { PiniaPluginContext } from "pinia";

// 预设本地store版本缓存时间为50s  实际开发中可以设置很大，缓存时间的限制，目的是为了让版本归零，避免自增超过上限
const STORE_CACHE_TIME = 50;
// 设置本地store缓存的key
const STORE_CACHE_KEY_PREFIX = "storeUpdateVersion_";

declare module "pinia" {
  export interface PiniaCustomProperties {
    storeUpdateVersion: number; // 标记store变更的版本
  }
}

/**获取本地缓存的store的修改版本 */
function getLocalStoreUpdateVersion(storeCacheKey: string) {
  let currentStoreUpdateVersion: number = cacheUtils.get(storeCacheKey);
  // 如果本地没有，就初始化一个
  if (
    currentStoreUpdateVersion === null ||
    currentStoreUpdateVersion === undefined
  ) {
    currentStoreUpdateVersion = 0;
    cacheUtils.set(storeCacheKey, currentStoreUpdateVersion, STORE_CACHE_TIME);
  }
  return currentStoreUpdateVersion;
}

// 处理electron多窗口，pinia共享问题
export function shareStorePlugin({ store }: PiniaPluginContext) {
  // 初始化本地缓存版本
  const storeName: string = store.$id;
  /// 缓存key
  const storeCacheKey = STORE_CACHE_KEY_PREFIX + storeName;
  let currentStoreUpdateVersion: number =
    getLocalStoreUpdateVersion(storeCacheKey);
  // 初始化同步store版本
  store.storeUpdateVersion = currentStoreUpdateVersion;

  // 监听数据变化
  store.$subscribe(() => {
    // 获取本地存储的最新状态
    currentStoreUpdateVersion = cacheUtils.get(storeCacheKey);
    /// 如果本地缓存过期，则重置一个缓存，并且通知主进程让其他窗口更新状态
    if (
      currentStoreUpdateVersion === null ||
      currentStoreUpdateVersion === undefined
    ) {
      currentStoreUpdateVersion = 0;
      cacheUtils.set(
        storeCacheKey,
        currentStoreUpdateVersion,
        STORE_CACHE_TIME
      );
      store.storeUpdateVersion = currentStoreUpdateVersion;
      console.log(`主动更新 ${storeName} 的状态`);
      // 通知主线程更新
      ipcRenderer.invoke(
        "pinia-store-change",
        storeName,
        Object.keys(store.$state),
        Object.values(store.$state)
      );
    } else {
      // 如果版本一致，则增加版本号，且更新本地存储版本 ，并且通知主线程告知其他窗口同步更新store状态
      if (store.storeUpdateVersion === currentStoreUpdateVersion) {
        store.storeUpdateVersion++;
        cacheUtils.set(
          storeCacheKey,
          store.storeUpdateVersion,
          STORE_CACHE_TIME
        );
        console.log(`主动更新 ${storeName} 的状态`);

        // 通知主线程更新
        ipcRenderer.invoke(
          "pinia-store-change",
          store.$id,
          Object.keys(store.$state),
          Object.values(store.$state)
        );
      } else {
        // 如果当前store的版本大于本地存储的版本，说明本地版本重置了【过期重新创建】，此时重置store的版本
        // 如果当前store的版本小于本地存储的版本，说明是被动更新引起的state变动回调，此时仅更新版本即可
        store.storeUpdateVersion = currentStoreUpdateVersion;
      }
    }
  });

  // 监听数据同步修改
  ipcRenderer.on(
    "pinia-store-set",
    (event, targetStoreName: string, keys: string[], values: any[]) => {
      // 监听到状态改变后，同步更新状态
      if (storeName === targetStoreName) {
        console.log("被动更新状态:" + storeName);

        /// 更新各个key对应的值的状态
        for (let i = 0; i < keys.length; i++) {
          store.$state[keys[i]] = values[i];
        }
      }
    }
  );
}
