/**
 * @fileoverview 转换模块入口
 * @description 提供数据转换功能
 * @module to
 */

import * as toUtils from './to';

/**
 * 数据转换工具集合接口
 */
export interface ToUtils {
    setStrTrim: typeof toUtils.setStrTrim;
    strClone: typeof toUtils.strClone;
    formatPhoneDisplay: typeof toUtils.formatPhoneDisplay;
    maskPhone: typeof toUtils.maskPhone;
    formatDateTime: typeof toUtils.formatDateTime;
    toPhoneFormat: typeof toUtils.toPhoneFormat;
    toPhoneHide: typeof toUtils.toPhoneHide;
    scoreToYuan: typeof toUtils.scoreToYuan;
    yuanToScore: typeof toUtils.yuanToScore;
    setEmpty: typeof toUtils.setEmpty;
    cleanHtml: typeof toUtils.cleanHtml;
    getActualLength: typeof toUtils.getActualLength;
    toFormData: typeof toUtils.toFormData;
    toSerialize: typeof toUtils.toSerialize;
    toColor: typeof toUtils.toColor;
    toLighten: typeof toUtils.toLighten;
    toParse: typeof toUtils.toParse;
    setRowSpace: typeof toUtils.setRowSpace;
    arrToOneObj: typeof toUtils.arrToOneObj;
    priceFormat: typeof toUtils.priceFormat;
    numberFormat: typeof toUtils.numberFormat;
    calcDate: typeof toUtils.calcDate;
    toTextColor: typeof toUtils.toTextColor;
    isLight: typeof toUtils.isLight;
    set16ToRgb: typeof toUtils.set16ToRgb;
    setRgbTo16: typeof toUtils.setRgbTo16;
    setUrlHttps: typeof toUtils.setUrlHttps;
    setUrlHttp: typeof toUtils.setUrlHttp;
}

/**
 * 获取数据转换工具集合
 * @returns 数据转换工具集合对象
 */
export function useTo(): ToUtils {
    return toUtils;
}

// 直接导出原始函数
export * from './to';

// 导出工具集合
export default useTo();
