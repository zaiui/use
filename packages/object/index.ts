/**
 * @fileoverview 对象操作模块入口
 * @description 提供全面的对象操作功能
 * @module object
 */

import * as objectUtils from './object';

/**
 * 对象操作工具集合接口
 */
export interface ObjectUtils {
    deepClone: typeof objectUtils.deepClone;
    cloneJson: typeof objectUtils.cloneJson;
    deepCloneStr: typeof objectUtils.deepCloneStr;
    objHasKey: typeof objectUtils.objHasKey;
    objEqual: typeof objectUtils.objEqual;
    getObjValue: typeof objectUtils.getObjValue;
    getObjVal: typeof objectUtils.getObjVal;
    getToObjVal: typeof objectUtils.getToObjVal;
}

/**
 * 获取对象操作工具集合
 * @returns 对象操作工具集合对象
 */
export function useObject(): ObjectUtils {
    return objectUtils;
}

// 直接导出原始函数
export * from './object';

// 导出工具集合
export default useObject();
