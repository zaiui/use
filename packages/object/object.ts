/**
 * @fileoverview 对象操作工具模块
 * @description 提供全面的对象操作功能，包括深拷贝、属性检查、深度比较等
 * @module object
 * @author ZAIUI
 * @version 1.0.0
 */

import { isObject } from '../type/index';
import { isEmpty } from '../validate/index';

/**
 * 深拷贝对象（支持循环引用和多种数据类型）
 * @param obj - 要拷贝的对象
 * @param cache - 用于处理循环引用的 WeakMap 缓存
 * @returns 返回深拷贝后的新对象
 * @description 支持 Date、RegExp、Map、Set、ArrayBuffer、ArrayBufferView 等特殊类型
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original); // 完全独立的副本
 * cloned.b.c = 3;
 * original.b.c === 2; // true
 */
export const deepClone = <T>(obj: T, cache: WeakMap<object, unknown> = new WeakMap()): T => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (cache.has(obj as object)) {
        return cache.get(obj as object) as T;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }
    
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as unknown as T;
    }
    
    if (obj instanceof Map) {
        const clone = new Map();
        cache.set(obj, clone);
        obj.forEach((value, key) => {
            clone.set(deepClone(key, cache), deepClone(value, cache));
        });
        return clone as unknown as T;
    }
    
    if (obj instanceof Set) {
        const clone = new Set();
        cache.set(obj, clone);
        obj.forEach((value) => {
            clone.add(deepClone(value, cache));
        });
        return clone as unknown as T;
    }
    
    if (obj instanceof ArrayBuffer) {
        const clone = new ArrayBuffer(obj.byteLength);
        new Uint8Array(clone).set(new Uint8Array(obj));
        return clone as unknown as T;
    }
    
    if (ArrayBuffer.isView(obj)) {
        const Constructor = obj.constructor as new (buffer: ArrayBuffer, byteOffset: number, length: number) => ArrayBufferView;
        const clonedBuffer = deepClone(new Uint8Array(obj.buffer).slice().buffer, cache);
        return new Constructor(clonedBuffer, obj.byteOffset, obj.byteLength) as unknown as T;
    }
    
    if (Array.isArray(obj)) {
        const clone: unknown[] = [];
        cache.set(obj, clone);
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i], cache);
        }
        return clone as unknown as T;
    }
    
    const clone = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj, clone);
    
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        clone[key] = deepClone((obj as Record<string, unknown>)[key], cache);
    }
    
    const symbols = Object.getOwnPropertySymbols(obj);
    for (let i = 0; i < symbols.length; i++) {
        const sym = symbols[i];
        clone[sym] = deepClone((obj as Record<symbol, unknown>)[sym], cache);
    }
    
    return clone;
};

/**
 * 字符串或数值的深拷贝
 * @param str - 要拷贝的字符串或数值
 * @returns 返回拷贝后的字符串或数值，空值返回空字符串
 * @example
 * deepCloneStr('hello') // 'hello'
 * deepCloneStr(123)      // 123
 * deepCloneStr('')       // ''
 */
export const deepCloneStr = (str: string | number): string | number => {
    if (isEmpty(str)) {
        return '';
    }
    if (typeof str === 'number') {
        return Number(str);
    }
    return String(str);
};

/**
 * 通过 JSON 序列化克隆（仅 JSON 可表示的数据；Date 等会丢失或变形）
 * @param data - 要克隆的值
 * @returns 克隆结果；序列化失败时返回原值
 * @example
 * cloneJson({ a: 1, b: [2] }) // { a: 1, b: [2] } 新引用
 */
export const cloneJson = <T>(data: T): T => {
    try {
        return JSON.parse(JSON.stringify(data)) as T;
    } catch {
        return data;
    }
};

/**
 * 检查对象是否包含指定键或是否为空
 * @param obj - 要检查的对象
 * @param key - 可选的键名，不提供时仅检查对象是否为空
 * @returns 如果对象有指定键或非空则返回 true，否则返回 false
 * @example
 * objHasKey({ a: 1, b: 2 }, 'a') // true
 * objHasKey({ a: 1 }, 'c')       // false
 * objHasKey({ a: 1 })            // true
 * objHasKey({})                  // false
 */
export const objHasKey = (obj: unknown, key?: string): boolean => {
    if (!isObject(obj)) {
        return false;
    }
    if (key !== undefined) {
        return key in obj;
    }
    return Object.keys(obj).length > 0;
};

/**
 * 比较两个对象是否深度相等
 * @param obj1 - 第一个对象
 * @param obj2 - 第二个对象
 * @returns 如果两个对象深度相等返回 true，否则返回 false
 * @description 会递归比较所有属性，包括嵌套对象、数组、Date、RegExp 等
 * @example
 * objEqual({ a: 1 }, { a: 1 })              // true
 * objEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }) // true
 * objEqual([1, 2, 3], [1, 2, 3])             // true
 * objEqual({ a: 1 }, { a: 2 })              // false
 */
export const objEqual = (obj1: unknown, obj2: unknown): boolean => {
    if (obj1 === obj2) {
        return true;
    }
    
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }
    
    if (Number.isNaN(obj1) && Number.isNaN(obj2)) {
        return true;
    }
    
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    
    if (typeof obj1 !== 'object') {
        return obj1 === obj2;
    }
    
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }
    
    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.source === obj2.source && obj1.flags === obj2.flags;
    }

    if (obj1 instanceof Map && obj2 instanceof Map) {
        if (obj1.size !== obj2.size) {
            return false;
        }
        for (const [key, val] of obj1) {
            if (!obj2.has(key) || !objEqual(val, obj2.get(key))) {
                return false;
            }
        }
        return true;
    }

    if (obj1 instanceof Set && obj2 instanceof Set) {
        if (obj1.size !== obj2.size) {
            return false;
        }
        for (const val of obj1) {
            if (!obj2.has(val)) {
                return false;
            }
        }
        return true;
    }
    
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!objEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }
    
    if (Array.isArray(obj1) !== Array.isArray(obj2)) {
        return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2 as object);
    
    if (keys1.length !== keys2.length) {
        return false;
    }
    
    for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (!keys2.includes(key)) {
            return false;
        }
        if (!objEqual((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])) {
            return false;
        }
    }
    
    return true;
};

/**
 * 获取对象值（类型安全）
 * @param value - 要检查的值
 * @param returnFalseIfEmpty - 是否在值为空时返回 false，默认为 false
 * @returns 返回类型安全的对象值或 false
 * @example
 * getObjValue({ a: 1 })      // { a: 1 }
 * getObjValue({})            // {}
 * getObjValue({ a: 1 }, true) // { a: 1 }
 * getObjValue({}, true)      // false
 * getObjValue('string', true) // false
 */
export const getObjValue = <T>(value: unknown, returnFalseIfEmpty = false): T | Record<string, never> | false => {
    if (!isObject(value)) {
        return returnFalseIfEmpty ? false : {};
    }
    return returnFalseIfEmpty && isEmpty(value) ? false : value as T;
};

/**
 * 获取对象值并进行空值检查
 * @param value - 要检查的值
 * @returns 如果值是有效对象则返回该对象，否则返回 false
 * @description 内部调用 getObjValue 并检查结果是否为空
 * @example
 * getObjVal({ a: 1 }) // { a: 1 }
 * getObjVal({})        // false
 * getObjVal(null)      // false
 */
export const getObjVal = <T>(value: unknown): T | Record<string, never> | false => {
    const res = getObjValue<T>(value);
    return isEmpty(res) ? false : res;
};

/**
 * 获取嵌套对象属性值
 * @param obj - 源对象，默认为空对象
 * @param field - 外层字段名
 * @param key - 可选的内层字段名，提供后返回嵌套对象的指定属性
 * @returns 返回指定路径的属性值，如果不存在返回空字符串
 * @example
 * getToObjVal({ user: { name: '张三', age: 20 } }, 'user', 'name') // '张三'
 * getToObjVal({ user: { name: '张三' } }, 'user')                    // { name: '张三' }
 * getToObjVal({}, 'user', 'name')                                    // ''
 */
export const getToObjVal = <T>(obj: Record<string, unknown> = {}, field: string, key?: string): T | '' => {
    const value = obj?.[field];
    if (key !== undefined) {
        return (value as Record<string, T>)?.[key] ?? '';
    }
    return getObjValue(value, true) as T | '';
};
