/**
 * @fileoverview 类型判断模块入口
 * @description 提供全面的 JavaScript 类型检测功能
 * @module type
 */

import * as typeUtils from './type';

/**
 * 类型判断工具集合接口
 */
export interface TypeUtils {
    getType: typeof typeUtils.getType;
    isType: typeof typeUtils.isType;
    isString: typeof typeUtils.isString;
    isNumber: typeof typeUtils.isNumber;
    isBoolean: typeof typeUtils.isBoolean;
    isArray: typeof typeUtils.isArray;
    isPlainObject: typeof typeUtils.isPlainObject;
    isObject: typeof typeUtils.isObject;
    isDate: typeof typeUtils.isDate;
    isFunction: typeof typeUtils.isFunction;
    isAsyncFunction: typeof typeUtils.isAsyncFunction;
    isPromise: typeof typeUtils.isPromise;
    isElement: typeof typeUtils.isElement;
    isSymbol: typeof typeUtils.isSymbol;
    isBigInt: typeof typeUtils.isBigInt;
    isRegExp: typeof typeUtils.isRegExp;
    isMap: typeof typeUtils.isMap;
    isSet: typeof typeUtils.isSet;
    isWeakMap: typeof typeUtils.isWeakMap;
    isWeakSet: typeof typeUtils.isWeakSet;
    isError: typeof typeUtils.isError;
    isInteger: typeof typeUtils.isInteger;
    isNaN: typeof typeUtils.isNaN;
    isNil: typeof typeUtils.isNil;
}

/**
 * 获取类型判断工具集合
 * @returns 类型判断工具集合对象
 */
export function useType(): TypeUtils {
    return typeUtils;
}

// 直接导出原始函数
export * from './type';

// 导出工具集合
export default useType();
