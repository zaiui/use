/**
 * @fileoverview 数组操作模块入口
 * @description 提供全面的数组操作功能
 * @module array
 */

import * as arrayUtils from './array';

/**
 * 数组操作工具集合接口
 */
export interface ArrayUtils {
    createArr: typeof arrayUtils.createArr;
    arrShuffle: typeof arrayUtils.arrShuffle;
    isArrItem: typeof arrayUtils.isArrItem;
    isArrIndex: typeof arrayUtils.isArrIndex;
    arrIndex: typeof arrayUtils.arrIndex;
    arrDel: typeof arrayUtils.arrDel;
    arrDelKey: typeof arrayUtils.arrDelKey;
    arrDelOther: typeof arrayUtils.arrDelOther;
    arrDelKeyOther: typeof arrayUtils.arrDelKeyOther;
    arrDelLeft: typeof arrayUtils.arrDelLeft;
    arrDelKeyLeft: typeof arrayUtils.arrDelKeyLeft;
    arrDelRight: typeof arrayUtils.arrDelRight;
    arrDelKeyRight: typeof arrayUtils.arrDelKeyRight;
    arrReplace: typeof arrayUtils.arrReplace;
    arrIntersection: typeof arrayUtils.arrIntersection;
    arrUnion: typeof arrayUtils.arrUnion;
    arrSomeOf: typeof arrayUtils.arrSomeOf;
    arrToId: typeof arrayUtils.arrToId;
    arrToKey: typeof arrayUtils.arrToKey;
    getArrValue: typeof arrayUtils.getArrValue;
    arrKeyValue: typeof arrayUtils.arrKeyValue;
    getArrItem: typeof arrayUtils.getArrItem;
    arrKeySort: typeof arrayUtils.arrKeySort;
    indexQf: typeof arrayUtils.indexQf;
    recursionChildren: typeof arrayUtils.recursionChildren;
}

/**
 * 获取数组操作工具集合
 * @returns 数组操作工具集合对象
 */
export function useArray(): ArrayUtils {
    return arrayUtils;
}

// 直接导出原始函数
export * from './array';

// 导出工具集合
export default useArray();
