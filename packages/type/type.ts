/**
 * @fileoverview 类型判断工具模块
 * @description 提供全面的 JavaScript 类型检测功能，支持所有内置类型和常见对象类型的判断
 * @module type
 * @author ZAIUI
 * @version 1.0.0
 */

const toString = Object.prototype.toString;
const AsyncFunction = (async () => {}).constructor as FunctionConstructor;

/**
 * 获取值的具体类型名称
 * @param value - 要获取类型的值
 * @returns 类型名称字符串，如 'Number'、'Array'、'Null' 等
 * @example
 * getType(1) // 'Number'
 * getType([]) // 'Array'
 * getType(null) // 'Null'
 * getType(undefined) // 'Undefined'
 */
export const getType = (value: unknown): string => {
    return toString.call(value).slice(8, -1);
};

/**
 * 判断值是否为指定的类型
 * @param value - 要检查的值
 * @param typeName - 类型名称（区分大小写）
 * @returns 如果值是指定类型则返回 true，否则返回 false
 * @example
 * isType(1, 'Number') // true
 * isType([], 'Array') // true
 * isType(null, 'Null') // true
 */
export const isType = (value: unknown, typeName: string): boolean => {
    return getType(value) === typeName;
};

/**
 * 检查值是否为字符串类型
 * @param value - 要检查的值
 * @returns 如果值是字符串则返回 true，否则返回 false
 * @example
 * isString('hello') // true
 * isString(123) // false
 * isString('') // true
 */
export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

/**
 * 检查值是否为数值（不包括 NaN 和 Infinity）
 * @param value - 要检查的值
 * @returns 如果值是有限数值则返回 true，否则返回 false
 * @example
 * isNumber(1) // true
 * isNumber(1.5) // true
 * isNumber(NaN) // false
 * isNumber(Infinity) // false
 * isNumber(-Infinity) // false
 */
export const isNumber = (value: unknown): value is number => {
    return typeof value === 'number' && Number.isFinite(value);
};

/**
 * 检查值是否为布尔值
 * @param value - 要检查的值
 * @returns 如果值是布尔值则返回 true，否则返回 false
 * @example
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(1) // false
 */
export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === 'boolean';
};

/**
 * 检查值是否为数组类型
 * @param value - 要检查的值
 * @returns 如果值是数组则返回 true，否则返回 false
 * @example
 * isArray([1, 2, 3]) // true
 * isArray({}) // false
 * isArray('array') // false
 */
export const isArray = <T>(value: unknown): value is T[] => {
    return Array.isArray(value);
};

/**
 * 检查值是否为普通对象（plain object）
 * @param value - 要检查的值
 * @returns 如果值是普通对象则返回 true，否则返回 false
 * @description 普通对象指通过字面量 {} 或 new Object() 创建的对象，不包括 Date、RegExp、Array 等内置对象
 * @example
 * isPlainObject({}) // true
 * isPlainObject(new Date()) // false
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
};

/**
 * 检查值是否为对象类型（不包括 null）
 * @param value - 要检查的值
 * @returns 如果值是对象则返回 true，否则返回 false
 * @description 包括数组、普通对象、Date、RegExp 等所有对象类型
 * @example
 * isObject({}) // true
 * isObject([]) // true
 * isObject(null) // false
 * isObject(new Date()) // true
 */
export const isObject = (value: unknown): value is object => {
    return value !== null && typeof value === 'object';
};

/**
 * 检查值是否为有效的 Date 对象
 * @param value - 要检查的值
 * @returns 如果值是有效的 Date 对象则返回 true，否则返回 false
 * @example
 * isDate(new Date()) // true
 * isDate(new Date('invalid')) // false
 * isDate('2023-01-01') // false
 */
export const isDate = (value: unknown): value is Date => {
    return value instanceof Date && !Number.isNaN(value.getTime());
};

/**
 * 检查值是否为函数类型
 * @param value - 要检查的值
 * @returns 如果值是函数则返回 true，否则返回 false
 * @example
 * isFunction(() => {}) // true
 * isFunction(function() {}) // true
 * isFunction(async () => {}) // true
 * isFunction(123) // false
 */
export const isFunction = (value: unknown): value is Function => {
    return typeof value === 'function';
};

/**
 * 检查值是否为异步函数
 * @param value - 要检查的值
 * @returns 如果值是异步函数则返回 true，否则返回 false
 * @example
 * isAsyncFunction(async () => {}) // true
 * isAsyncFunction(() => {}) // false
 * isAsyncFunction(Promise.resolve()) // false
 */
export const isAsyncFunction = (value: unknown): boolean => {
    return isFunction(value) && value.constructor === AsyncFunction;
};

/**
 * 检查值是否为 Promise 对象
 * @param value - 要检查的值
 * @returns 如果值是 Promise 对象则返回 true，否则返回 false
 * @description 支持原生 Promise 和 thenable 对象的检测
 * @example
 * isPromise(Promise.resolve()) // true
 * isPromise({ then: () => {}, catch: () => {} }) // true
 * isPromise(123) // false
 */
export const isPromise = <T>(value: unknown): value is Promise<T> => {
    return value instanceof Promise || (
        isObject(value) &&
        'then' in value &&
        'catch' in value &&
        isFunction((value as { then: unknown }).then) &&
        isFunction((value as { catch: unknown }).catch)
    );
};

/**
 * 检查值是否为 DOM 元素
 * @param value - 要检查的值
 * @returns 如果值是 DOM 元素则返回 true，否则返回 false
 * @example
 * isElement(document.createElement('div')) // true
 * isElement(document.body) // true
 * isElement({}) // false
 */
export const isElement = (value: unknown): value is Element => {
    return isObject(value) &&
           typeof (value as Element).nodeName === 'string' &&
           (value as Element).nodeType === 1;
};

/**
 * 检查值是否为 Symbol 类型
 * @param value - 要检查的值
 * @returns 如果值是 Symbol 类型则返回 true，否则返回 false
 * @example
 * isSymbol(Symbol()) // true
 * isSymbol(Symbol('desc')) // true
 * isSymbol('symbol') // false
 */
export const isSymbol = (value: unknown): value is symbol => {
    return typeof value === 'symbol';
};

/**
 * 检查值是否为 BigInt 类型
 * @param value - 要检查的值
 * @returns 如果值是 BigInt 类型则返回 true，否则返回 false
 * @example
 * isBigInt(BigInt(123)) // true
 * isBigInt(123n) // true
 * isBigInt(123) // false
 */
export const isBigInt = (value: unknown): value is bigint => {
    return typeof value === 'bigint';
};

/**
 * 检查值是否为正则表达式
 * @param value - 要检查的值
 * @returns 如果值是正则表达式则返回 true，否则返回 false
 * @example
 * isRegExp(/abc/) // true
 * isRegExp(new RegExp('abc')) // true
 * isRegExp('/abc/') // false
 */
export const isRegExp = (value: unknown): value is RegExp => {
    return value instanceof RegExp;
};

/**
 * 检查值是否为 Map 对象
 * @param value - 要检查的值
 * @returns 如果值是 Map 对象则返回 true，否则返回 false
 * @example
 * isMap(new Map()) // true
 * isMap(new Map([['key', 'value']])) // true
 * isMap({}) // false
 */
export const isMap = <K, V>(value: unknown): value is Map<K, V> => {
    return value instanceof Map;
};

/**
 * 检查值是否为 Set 对象
 * @param value - 要检查的值
 * @returns 如果值是 Set 对象则返回 true，否则返回 false
 * @example
 * isSet(new Set()) // true
 * isSet(new Set([1, 2, 3])) // true
 * isSet([]) // false
 */
export const isSet = <T>(value: unknown): value is Set<T> => {
    return value instanceof Set;
};

/**
 * 检查值是否为 WeakMap 对象
 * @param value - 要检查的值
 * @returns 如果值是 WeakMap 对象则返回 true，否则返回 false
 * @example
 * isWeakMap(new WeakMap()) // true
 * isWeakMap(new Map()) // false
 */
export const isWeakMap = (value: unknown): value is WeakMap<object, unknown> => {
    return value instanceof WeakMap;
};

/**
 * 检查值是否为 WeakSet 对象
 * @param value - 要检查的值
 * @returns 如果值是 WeakSet 对象则返回 true，否则返回 false
 * @example
 * isWeakSet(new WeakSet()) // true
 * isWeakSet(new Set()) // false
 */
export const isWeakSet = (value: unknown): value is WeakSet<object> => {
    return value instanceof WeakSet;
};

/**
 * 检查值是否为 Error 对象
 * @param value - 要检查的值
 * @returns 如果值是 Error 对象则返回 true，否则返回 false
 * @example
 * isError(new Error()) // true
 * isError(new TypeError()) // true
 * isError({ message: 'error' }) // false
 */
export const isError = (value: unknown): value is Error => {
    return value instanceof Error;
};

/**
 * 检查值是否为整数
 * @param value - 要检查的值
 * @returns 如果值是整数则返回 true，否则返回 false
 * @example
 * isInteger(1) // true
 * isInteger(-1) // true
 * isInteger(1.5) // false
 * isInteger(NaN) // false
 */
export const isInteger = (value: unknown): boolean => {
    return isNumber(value) && Number.isInteger(value);
};

/**
 * 检查值是否为 NaN
 * @param value - 要检查的值
 * @returns 如果值是 NaN 则返回 true，否则返回 false
 * @example
 * isNaN(NaN) // true
 * isNaN(0/0) // true
 * isNaN(1) // false
 * isNaN('NaN') // false
 */
export const isNaN = (value: unknown): boolean => {
    return Number.isNaN(value);
};

/**
 * 检查值是否为 undefined 或 null
 * @param value - 要检查的值
 * @returns 如果值是 undefined 或 null 则返回 true，否则返回 false
 * @example
 * isNil(undefined) // true
 * isNil(null) // true
 * isNil(0) // false
 * isNil('') // false
 * isNil(false) // false
 */
export const isNil = (value: unknown): value is undefined | null => {
    return value === undefined || value === null;
};
