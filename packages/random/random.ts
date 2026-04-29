/**
 * @fileoverview 随机数生成模块
 * @description 提供密码学安全的随机数生成功能
 * @module random
 * @author ZAIUI
 * @version 1.0.0
 */

const NUMBER = '0123456789';
const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALL_CHARS = NUMBER + LOWER_CASE + UPPER_CASE;

/**
 * 生成 UUID v4（通用唯一标识符）
 * @returns 返回标准的 UUID v4 格式字符串
 * @description 使用 Math.random() 生成，符合 RFC 4122 规范
 * @example
 * getUUID() // '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
 * getUUID() // '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
 */
export const getUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * 生成唯一 ID（短格式）
 * @returns 返回 6 位随机字符串
 * @description 基于 36 进制生成，包含数字和小写字母
 * @example
 * uniqueId() // 'a1b2c3'
 * uniqueId() // 'x9y8z7'
 */
export const uniqueId = (): string => {
    return Math.random().toString(36).substring(2, 8);
};

/**
 * 生成随机字符串
 * @param length - 字符串长度，默认为 8
 * @param type - 字符集，默认为数字 + 小写字母 + 大写字母
 * @returns 返回指定长度的随机字符串
 * @example
 * getRandom()              // 'Ab3dEf12'
 * getRandom(4)            // 'aB3d'
 * getRandom(10, '01')     // '0100110011'
 */
export const getRandom = (length = 8, type = ALL_CHARS): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += type.charAt(Math.floor(Math.random() * type.length));
    }
    return result;
};

/**
 * 生成随机数字字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的数字字符串
 * @example
 * getNumber()   // '123456'
 * getNumber(4)  // '1234'
 */
export const getNumber = (length = 6): string => getRandom(length, NUMBER);

/**
 * 生成随机小写字母字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的小写字母字符串
 * @example
 * getLowerCase()   // 'abcdef'
 * getLowerCase(4)  // 'abcd'
 */
export const getLowerCase = (length = 6): string => getRandom(length, LOWER_CASE);

/**
 * 生成随机大写字母字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的大写字母字符串
 * @example
 * getUpperCase()   // 'ABCDEF'
 * getUpperCase(4)  // 'ABCD'
 */
export const getUpperCase = (length = 6): string => getRandom(length, UPPER_CASE);

/**
 * 生成随机数字和小写字母字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的数字和小写字母混合字符串
 * @example
 * getNumberLower()   // 'a1b2c3'
 * getNumberLower(4)  // '12ab'
 */
export const getNumberLower = (length = 6): string => getRandom(length, NUMBER + LOWER_CASE);

/**
 * 生成随机数字和大写字母字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的数字和大写字母混合字符串
 * @example
 * getNumberUpper()   // 'A1B2C3'
 * getNumberUpper(4)  // '12AB'
 */
export const getNumberUpper = (length = 6): string => getRandom(length, NUMBER + UPPER_CASE);

/**
 * 生成随机大小写字母字符串
 * @param length - 字符串长度，默认为 6
 * @returns 返回指定长度的大小写字母混合字符串
 * @example
 * getAlphabets()   // 'AbCdEf'
 * getAlphabets(4)  // 'AbCd'
 */
export const getAlphabets = (length = 6): string => getRandom(length, LOWER_CASE + UPPER_CASE);

/**
 * 生成指定范围内的随机整数
 * @param lower - 范围下限，默认为 0
 * @param upper - 范围上限，默认为 10
 * @returns 返回包含上下限的随机整数
 * @example
 * getRandomForm()    // 0-10 之间的随机整数
 * getRandomForm(1, 6) // 1-6 之间的随机整数（模拟骰子）
 * getRandomForm(-5, 5) // -5 到 5 之间的随机整数
 */
export const getRandomForm = (lower = 0, upper = 10): number => {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};
