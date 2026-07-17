/**
 * @fileoverview 验证工具模块
 * @description 提供全面的数据验证功能，包括 URL、邮箱、手机号、身份证等常见格式验证
 * @module validate
 * @author ZAIUI
 * @version 1.0.0
 */

import { isArray, isMap, isObject, isPlainObject, isSet, isString } from '../type/index';

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^1[3-9]\d{9}$/;
const LOWER_CASE_REGEX = /^[a-z]+$/;
const UPPER_CASE_REGEX = /^[A-Z]+$/;
const ALPHABETS_REGEX = /^[A-Za-z]+$/;
const NAME_REGEX = /^[\u4e00-\u9fa5]{2,4}$/;
const INTEGER_REGEX = /^-?\d+$/;
const DECIMAL_REGEX = /^-?\d+(\.\d+)?$/;

/**
 * 验证网址是否合法
 * @param value - 要验证的值
 * @returns 如果网址格式合法返回 true，否则返回 false
 * @description 支持 http 和 https 协议，可包含子域名和路径
 * @example
 * isUrl('https://www.example.com')       // true
 * isUrl('http://localhost:8080')         // true
 * isUrl('example.com/path')              // true
 * isUrl('not-a-url')                     // false
 */
export const isUrl = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return URL_REGEX.test(value);
};

/**
 * 验证邮箱地址是否合法
 * @param value - 要验证的值
 * @returns 如果邮箱格式合法返回 true，否则返回 false
 * @example
 * isEmail('user@example.com')           // true
 * isEmail('test.user@domain.co.uk')     // true
 * isEmail('invalid-email')               // false
 * isEmail('@example.com')               // false
 */
export const isEmail = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return EMAIL_REGEX.test(value);
};

/**
 * 验证手机号码是否合法（中国大陆）
 * @param value - 要验证的值
 * @returns 如果手机号码格式合法返回 true，否则返回 false
 * @description 验证中国手机号码格式，以 1 开头，第二位为 3-9 的 11 位数字
 * @example
 * isPhone('13812345678')               // true
 * isPhone('19987654321')                // true
 * isPhone('12345678901')                // false（第二位不符合）
 * isPhone('1234567890')                 // false（位数不足）
 */
export const isPhone = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return PHONE_REGEX.test(value);
};

/**
 * 判断字符串是否全部为小写字母
 * @param value - 要验证的值
 * @returns 如果全部是小写字母返回 true，否则返回 false
 * @example
 * isLowerCase('hello')                 // true
 * isLowerCase('Hello')                  // false
 * isLowerCase('hello123')               // false
 */
export const isLowerCase = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return LOWER_CASE_REGEX.test(value);
};

/**
 * 判断字符串是否全部为大写字母
 * @param value - 要验证的值
 * @returns 如果全部是大写字母返回 true，否则返回 false
 * @example
 * isUpperCase('HELLO')                  // true
 * isUpperCase('Hello')                   // false
 * isUpperCase('HELLO123')                // false
 */
export const isUpperCase = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return UPPER_CASE_REGEX.test(value);
};

/**
 * 判断字符串是否只包含大小写字母（不包含数字和特殊字符）
 * @param value - 要验证的值
 * @returns 如果只包含字母返回 true，否则返回 false
 * @example
 * isAlphabets('Hello')                  // true
 * isAlphabets('ABC')                    // true
 * isAlphabets('Hello123')               // false
 * isAlphabets('Hello World')            // false
 */
export const isAlphabets = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return ALPHABETS_REGEX.test(value);
};

/**
 * 验证身份证号码是否合法（支持 15 位和 18 位）
 * @param value - 要验证的值
 * @returns 如果身份证号码格式合法返回 true，否则返回 false
 * @description 支持 18 位身份证号码（含校验位验证）和 15 位身份证号码（含出生日期验证）
 * @example
 * isIdCard('110101199003078888')       // true（18位，需校验）
 * isIdCard('110101900307888')           // true（15位）
 * isIdCard('123456789012345')           // false
 */
export const isIdCard = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    
    const idCard = value.toUpperCase();
    
    if (idCard.length === 18) {
        return validate18DigitIdCard(idCard);
    } else if (idCard.length === 15) {
        return validate15DigitIdCard(idCard);
    }
    
    return false;
};

/**
 * 判断中文姓名是否正确
 * @param value - 要验证的值
 * @returns 如果姓名格式正确返回 true，否则返回 false
 * @description 姓名为 2-4 个中文字符
 * @example
 * isName('张三')                         // true
 * isName('李四')                         // true
 * isName('张三丰')                       // true
 * isName('张')                           // false
 * isName('张三李四')                     // false
 */
export const isName = (value: unknown): boolean => {
    if (!isString(value)) {
        return false;
    }
    return NAME_REGEX.test(value);
};

/**
 * 判断字符串是否为整数
 * @param value - 要验证的值
 * @returns 如果是整数返回 true，否则返回 false
 * @description 支持正整数和负整数
 * @example
 * isNum('123')                          // true
 * isNum('-456')                         // true
 * isNum('12.3')                         // false
 * isNum('12a')                          // false
 */
export const isNum = (value: unknown): boolean => {
    return INTEGER_REGEX.test(String(value));
};

/**
 * 判断字符串是否为小数或整数
 * @param value - 要验证的值
 * @returns 如果是小数或整数返回 true，否则返回 false
 * @example
 * isNumord('123')                       // true
 * isNumord('-45.67')                    // true
 * isNumord('12.3')                      // true
 * isNumord('abc')                       // false
 */
export const isNumord = (value: unknown): boolean => {
    return DECIMAL_REGEX.test(String(value));
};

/**
 * 检查值是否为空值
 * @param value - 要检查的值
 * @returns 如果值是空值返回 true，否则返回 false
 * @description 空值包括：undefined、null、空字符串、空数组、空对象、空 Map、空 Set
 * @example
 * isEmpty(null)                         // true
 * isEmpty(undefined)                    // true
 * isEmpty('')                            // true
 * isEmpty([])                            // true
 * isEmpty({})                            // true
 * isEmpty(new Map())                     // true
 * isEmpty(new Set())                     // true
 * isEmpty(0)                             // false
 * isEmpty(false)                         // false
 * isEmpty({ a: 1 })                      // false
 */
export const isEmpty = (value: unknown): boolean => {
    if (value == null) {
        return true;
    }
    
    if (isString(value)) {
        return value.length === 0;
    }
    
    if (isArray(value)) {
        return value.length === 0;
    }
    
    if (isPlainObject(value)) {
        return Object.keys(value).length === 0;
    }
    
    if (isMap(value) || isSet(value)) {
        return value.size === 0;
    }
    
    return false;
};

/**
 * 验证车牌号是否合法
 * @param plate - 要验证的车牌号
 * @returns 如果车牌号格式合法返回 true，否则返回 false
 * @description 支持普通车牌、新能源车牌、临时车牌、挂学警港澳车牌
 * @example
 * isValidLicensePlate('京A12345')       // true
 * isValidLicensePlate('沪A1234D')       // true（新能源）
 * isValidLicensePlate('粤Z1234港')       // true（港澳）
 * isValidLicensePlate('12345678')        // false
 */
export const isValidLicensePlate = (plate: string): boolean => {
    const trimmedPlate = plate.trim();
    const regex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9 挂学警港澳]$|^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z]\d{5}[ABDEFGHJK]$/;
    return regex.test(trimmedPlate);
};

/**
 * 校验字符串是否为数字或小数
 * @param text - 要校验的值
 * @param allowNegative - 是否允许负数，默认为 true
 * @returns 如果是数字或小数返回 true，否则返回 false
 * @example
 * isNumberReg('123')                     // true
 * isNumberReg('12.34')                   // true
 * isNumberReg('-56.78')                  // true
 * isNumberReg('abc')                     // false
 * isNumberReg('12.34', false)            // false（不允许负数）
 */
export const isNumberReg = (text: unknown, allowNegative = true): boolean => {
    const pattern = allowNegative ? DECIMAL_REGEX : /^\d+(\.\d+)?$/;
    return pattern.test(String(text));
};

/**
 * 饿了么 UI（Element Plus）表单验证
 * @param formRef - 表单引用对象，需包含 validate 方法
 * @returns 返回 Promise，验证通过为 true，失败为 false
 * @example
 * const formRef = ref();
 * const isValid = await formValidate(formRef.value);
 * if (isValid) {
 *   console.log('表单验证通过');
 * }
 */
export const formValidate = async (formRef: { validate: (callback: (valid: boolean) => void) => void }): Promise<boolean> => {
    if (!formRef || typeof formRef.validate !== 'function') {
        throw new Error('无效的表单校验');
    }
    
    return new Promise((resolve) => {
        formRef.validate((valid) => {
            resolve(!!valid);
        });
    });
};

const validate18DigitIdCard = (idCard: string): boolean => {
    const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
        return false;
    }
    
    const birthYear = parseInt(idCard.substring(6, 10), 10);
    const birthMonth = parseInt(idCard.substring(10, 12), 10);
    const birthDay = parseInt(idCard.substring(12, 14), 10);
    
    if (birthYear < 1900 || birthYear > new Date().getFullYear()) {
        return false;
    }
    
    if (birthMonth < 1 || birthMonth > 12) {
        return false;
    }
    
    const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
    if (birthDay < 1 || birthDay > daysInMonth) {
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 17; i++) {
        sum += parseInt(idCard.charAt(i), 10) * weightFactors[i];
    }
    
    const checkCode = checkCodes[sum % 11];
    return idCard.charAt(17) === checkCode;
};

const validate15DigitIdCard = (idCard: string): boolean => {
    if (!/^\d{15}$/.test(idCard)) {
        return false;
    }
    
    const birthYear = parseInt('19' + idCard.substring(6, 8), 10);
    const birthMonth = parseInt(idCard.substring(8, 10), 10);
    const birthDay = parseInt(idCard.substring(10, 12), 10);
    
    if (birthYear < 1900 || birthYear > new Date().getFullYear()) {
        return false;
    }
    
    if (birthMonth < 1 || birthMonth > 12) {
        return false;
    }
    
    const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
    if (birthDay < 1 || birthDay > daysInMonth) {
        return false;
    }
    
    return true;
};
