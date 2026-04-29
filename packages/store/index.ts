/**
 * @fileoverview 存储模块入口
 * @description 提供 localStorage 和 sessionStorage 的封装操作
 * @module store
 */

import * as storeUtils from './store';

/**
 * 存储操作工具集合接口
 */
export interface StoreUtils {
    setStore: typeof storeUtils.setStore;
    getStore: typeof storeUtils.getStore;
    delStore: typeof storeUtils.delStore;
    allStore: typeof storeUtils.allStore;
    clearStore: typeof storeUtils.clearStore;
    clearAllStore: typeof storeUtils.clearAllStore;
    storeTime: typeof storeUtils.storeTime;
}

/**
 * 获取存储操作工具集合
 * @returns 存储操作工具集合对象
 */
export function useStore(): StoreUtils {
    return storeUtils;
}

// 直接导出原始函数
export * from './store';

// 导出工具集合
export default useStore();
