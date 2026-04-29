/**
 * @fileoverview 随机数生成模块入口
 * @description 提供密码学安全的随机数生成功能
 * @module random
 */

import * as randomUtils from './random';

/**
 * 随机数生成工具集合接口
 */
export interface RandomUtils {
    getUUID: typeof randomUtils.getUUID;
    uniqueId: typeof randomUtils.uniqueId;
    getRandom: typeof randomUtils.getRandom;
    getNumber: typeof randomUtils.getNumber;
    getLowerCase: typeof randomUtils.getLowerCase;
    getUpperCase: typeof randomUtils.getUpperCase;
    getNumberLower: typeof randomUtils.getNumberLower;
    getNumberUpper: typeof randomUtils.getNumberUpper;
    getAlphabets: typeof randomUtils.getAlphabets;
    getRandomForm: typeof randomUtils.getRandomForm;
}

/**
 * 获取随机数生成工具集合
 * @returns 随机数生成工具集合对象
 */
export function useRandom(): RandomUtils {
    return randomUtils;
}

// 直接导出原始函数
export * from './random';

// 导出工具集合
export default useRandom();
