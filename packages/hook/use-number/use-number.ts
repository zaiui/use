/**
 * @fileoverview 数字计算工具模块
 * @description 基于 BigNumber.js 提供精确的数值计算功能
 * @module hook/use-number
 * @author ZAIUI
 * @version 1.0.0
 */

import BigNumber from 'bignumber.js';

/**
 * 精确数字计算
 * @param num1 - 第一个数字（字符串或数字）
 * @param type - 运算类型：'+' 加法、'-' 减法、'*' 乘法、'/' 除法、'=' 比较
 * @param num2 - 第二个数字（字符串或数字）
 * @returns 计算结果数字或比较结果字符串
 * @description 使用 BigNumber.js 进行精确的浮点数计算，避免 JavaScript 原生计算的精度问题
 * @example
 * jfwNum(0.1, '+', 0.2);           // 0.3（精确计算）
 * jfwNum(0.1, '*', 0.2);          // 0.02
 * jfwNum('1000000', '*', '1000'); // 1000000000
 * jfwNum(5, '=', 5);             // '等于'
 * jfwNum(5, '=', 3);             // '大于'
 */
export const jfwNum = (
    num1: string | number,
    type: '+' | '-' | '*' | '/' | '=',
    num2: string | number
): number | boolean | string => {
    const n1 = new BigNumber(num1);
    const n2 = new BigNumber(num2);

    switch (type) {
        case '+':
            return n1.plus(n2).toNumber();
        case '-':
            return n1.minus(n2).toNumber();
        case '*':
            return n1.multipliedBy(n2).toNumber();
        case '/':
            return n1.dividedBy(n2).toNumber();
        case '=':
            return n1.isEqualTo(n2) ? '等于' : n1.isGreaterThan(n2) ? '大于' : '小于';
        default:
            return 0;
    }
};
