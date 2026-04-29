/**
 * @fileoverview 操作系统和浏览器模块入口
 * @description 提供浏览器检测、全屏控制、剪贴板操作等功能
 * @module os
 */

import * as osUtils from './os';

/**
 * 操作系统/浏览器工具集合接口
 */
export interface OsUtils {
    getActualLength: typeof osUtils.getActualLength;
    getOsBit: typeof osUtils.getOsBit;
    getBrowserVersion: typeof osUtils.getBrowserVersion;
    fullScreen: typeof osUtils.fullScreen;
    newWindow: typeof osUtils.newWindow;
    addOnJs: typeof osUtils.addOnJs;
    asyncTime: typeof osUtils.asyncTime;
    getYearList: typeof osUtils.getYearList;
    getMonthList: typeof osUtils.getMonthList;
    setImageFilter: typeof osUtils.setImageFilter;
    setImageColor: typeof osUtils.setImageColor;
    setCopyText: typeof osUtils.setCopyText;
    getCopyText: typeof osUtils.getCopyText;
    setPosInsert: typeof osUtils.setPosInsert;
    setPosRange: typeof osUtils.setPosRange;
    setEleFocus: typeof osUtils.setEleFocus;
    setEleMainColor: typeof osUtils.setEleMainColor;
}

/**
 * 获取操作系统/浏览器工具集合
 * @returns 操作系统/浏览器工具集合对象
 */
export function useOs(): OsUtils {
    return osUtils;
}

// 直接导出原始函数
export * from './os';

// 从 color 重新导出
export * from './color';

// 导出工具集合
export default useOs();
