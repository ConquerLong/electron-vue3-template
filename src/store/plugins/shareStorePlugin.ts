import { ipcRenderer } from "electron";
import cacheUtils from "@/utils/cacheUtils";
import { PiniaPluginContext } from "pinia";

// 预设本地store版本缓存时间为50s  实际开发中可以设置很大，缓存时间的限制，目的是为了让版本归零，避免自增超过上限
const STORE_CACHE_TIME = 50;
// 设置本地store缓存的key
const STORE_CACHE_KEY_PREFIX = "store_";
const STORE_CACHE_VERSION_KEY_PREFIX = STORE_CACHE_KEY_PREFIX + "version_";

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
  const storeCacheVersionKey = STORE_CACHE_VERSION_KEY_PREFIX + storeName;
  let currentStoreUpdateVersion: number =
    getLocalStoreUpdateVersion(storeCacheVersionKey);
  // 初始化同步store版本
  store.storeUpdateVersion = currentStoreUpdateVersion;

  // 初始化store
  initStore(store);

  // 监听数据变化
  store.$subscribe(() => {
    // 获取本地存储的最新状态
    currentStoreUpdateVersion = cacheUtils.get(storeCacheVersionKey);
    /// 如果本地缓存过期，则重置一个缓存，并且通知主进程让其他窗口更新状态
    if (
      currentStoreUpdateVersion === null ||
      currentStoreUpdateVersion === undefined
    ) {
      // 2023/5/12 调整重置值为 1 ，解决为null，重置值为0，其他窗口被动更新触发状态修改监听，结果缓存值和store的版本值都为0，导致主动更新，旧值覆盖新值的情况
      currentStoreUpdateVersion = 1;
      store.storeUpdateVersion = currentStoreUpdateVersion;
      console.log(`主动更新 ${storeName} 的状态`);

      // 主动更新
      updateStoreSync(
        JSON.stringify(store.$state),
        storeName,
        store.storeUpdateVersion
      );
    } else {
      // 如果版本一致，则增加版本号，且更新本地存储版本 ，并且通知主线程告知其他窗口同步更新store状态
      if (store.storeUpdateVersion === currentStoreUpdateVersion) {
        store.storeUpdateVersion++;
        console.log(`主动更新 ${storeName} 的状态`);

        // 主动更新
        updateStoreSync(
          JSON.stringify(store.$state),
          storeName,
          store.storeUpdateVersion
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
    (event, targetStoreName: string, jsonStr: string) => {
      // 监听到状态改变后，同步更新状态
      if (storeName === targetStoreName) {
        console.log("被动更新状态:" + storeName);

        const obj = JSON.parse(jsonStr);
        const keys = Object.keys(obj);
        const values = Object.values(obj);

        /// 更新各个key对应的值的状态
        for (let i = 0; i < keys.length; i++) {
          store.$state[keys[i]] = values[i];
        }
      }
    }
  );
}

/**
 * 状态更新同步
 * @param stateJsonStr 序列化的状态修改字符串
 * @param storeName  修改的状态的名称
 * @param storeUpdateVersion  状态修改的版本号
 */
function updateStoreSync(
  stateJsonStr: string,
  storeName: string,
  storeUpdateVersion: number
) {
  // 更新本地缓存的store版本号
  const storeCacheVersionKey = STORE_CACHE_VERSION_KEY_PREFIX + storeName;
  cacheUtils.set(storeCacheVersionKey, storeUpdateVersion, STORE_CACHE_TIME);

  // 通知主线程更新
  ipcRenderer.invoke("pinia-store-change", storeName, stateJsonStr);

  // 更新本地缓存的store
  cacheUtils.set(STORE_CACHE_KEY_PREFIX + storeName, stateJsonStr);
}

/**
 * 初始化状态对象
 * @param store
 */
function initStore(store: any) {
  const cacheKey = STORE_CACHE_KEY_PREFIX + store.$id;
  // 从本地缓存中读取store的值
  const stateJsonStr = cacheUtils.get(cacheKey);
  if (stateJsonStr) {
    const stateCache = JSON.parse(stateJsonStr);
    const keys = Object.keys(stateCache);
    const values = Object.values(stateCache);

    /// 更新各个key对应的值的状态
    for (let i = 0; i < keys.length; i++) {
      store.$state[keys[i]] = values[i];
    }
  }
}
