/**
 * @fileoverview 数据转换模块
 * @description 提供全面的数据转换功能
 * @module to
 * @author ZAIUI
 * @version 1.0.4
 */

import { isEmpty } from '../validate/index';
import dayjs from './dayjs';
import type { Dayjs } from 'dayjs';

const MAINLAND_MOBILE_LENGTH = 11;

const withMainlandMobile = (
    phone: unknown,
    format: (digits: string) => string
): string => {
    if (isEmpty(phone)) {
        return '';
    }
    const text = String(phone);
    if (text.length !== MAINLAND_MOBILE_LENGTH) {
        return text;
    }
    return format(text);
};

/**
 * 去除字符串中所有空白字符
 * @param str - 原字符串
 * @returns 去除空白后的字符串，空值返回 ''
 * @example
 * setStrTrim('  a b  ') // 'ab'
 * setStrTrim(null)      // ''
 */
export const setStrTrim = (str: unknown): string => {
    if (isEmpty(str)) {
        return '';
    }
    return String(str).replace(/\s/g, '');
};

/**
 * 字符串克隆（转为 string 副本）
 * @param str - 原值
 * @returns 字符串形式，空值返回 ''
 * @example
 * strClone('hello') // 'hello'
 * strClone(123)     // '123'
 */
export const strClone = (str: unknown): string => {
    if (isEmpty(str)) {
        return '';
    }
    return String(str);
};

/**
 * 格式化电话号码显示（中间添加空格）
 * @param phone - 11 位大陆手机号
 * @returns 格式为 `XXX XXXX XXXX`；非 11 位原样返回
 * @example
 * formatPhoneDisplay('18203088057') // '182 0308 8057'
 */
export const formatPhoneDisplay = (phone: unknown): string => {
    return withMainlandMobile(phone, (digits) =>
        `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`
    );
};

/**
 * 隐藏手机号中间四位
 * @param phone - 11 位大陆手机号
 * @returns 格式为 `XXX****XXXX`；非 11 位原样返回
 * @example
 * maskPhone('18203088057') // '182****8057'
 */
export const maskPhone = (phone: unknown): string => {
    return withMainlandMobile(phone, (digits) =>
        `${digits.slice(0, 3)}****${digits.slice(7)}`
    );
};

/**
 * 友好的相对/绝对时间显示（中文，基于 dayjs zh-cn）
 * @param date - 时间戳、ISO 字符串、Date 或 Dayjs
 * @returns 如「刚刚」「5分钟前」「昨天 14:30」「2024年01月02日 08:00」
 */
export const formatDateTime = (date: string | number | Date | Dayjs): string => {
    const target = dayjs(date);
    if (!target.isValid()) {
        return String(date);
    }

    const now = dayjs();
    if (target.isAfter(now)) {
        return formatAbsoluteDateTime(target, now);
    }

    const diffMinutes = now.diff(target, 'minute');

    if (diffMinutes < 1) {
        return '刚刚';
    }
    if (diffMinutes < 60) {
        return target.fromNow();
    }
    if (diffMinutes < 60 * 24) {
        return target.fromNow();
    }

    const diffDays = now.startOf('day').diff(target.startOf('day'), 'day');

    if (diffDays === 1) {
        return `昨天 ${target.format('HH:mm')}`;
    }
    if (diffDays === 2) {
        return `前天 ${target.format('HH:mm')}`;
    }
    return formatAbsoluteDateTime(target, now);
};

const formatAbsoluteDateTime = (target: Dayjs, now: Dayjs): string => {
    if (target.isSame(now, 'year')) {
        return target.format('MM月DD日 HH:mm');
    }
    return target.format('YYYY年MM月DD日 HH:mm');
};

/**
 * 格式化电话号码显示（中间添加空格）
 * @param phone - 手机号码字符串
 * @returns 格式化后的电话号码，格式为 "XXX XXXX XXXX"
 * @example
 * toPhoneFormat('13812345678') // '138 1234 5678'
 * toPhoneFormat('19987654321') // '199 8764 321'
 */
export const toPhoneFormat = (phone: string): string => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
};

/**
 * 隐藏手机号中间四位
 * @param phone - 手机号码字符串
 * @returns 脱敏后的手机号，格式为 "138****5678"
 * @example
 * toPhoneHide('13812345678') // '138****5678'
 * toPhoneHide('')             // ''
 */
export const toPhoneHide = (phone: string): string => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 将分数转换为元（金额转换）
 * @param score - 分数金额
 * @param decimal - 是否保留小数，默认为 false（不保留）
 * @param separator - 是否添加千分位分隔符，默认为 false
 * @returns 转换后的元金额字符串
 * @example
 * scoreToYuan(100)                // '1'
 * scoreToYuan(100, true)          // '1.00'
 * scoreToYuan(1000)                // '10'
 * scoreToYuan(1000, false, true)   // '10'
 * scoreToYuan(100000, true, true) // '1,000.00'
 */
export const scoreToYuan = (score: number | string, decimal = false, separator = false): string => {
    const num = typeof score === 'string' ? parseFloat(score) : score;
    if (isNaN(num)) return '0';
    const yuan = num / 100;
    let result = decimal ? yuan.toFixed(2) : String(Math.floor(yuan));
    if (separator) {
        result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return result;
};

/**
 * 将元转换为分（金额转换）
 * @param str - 元金额
 * @returns 转换后的分数
 * @example
 * yuanToScore(1)      // 100
 * yuanToScore('1.5') // 150
 * yuanToScore('0')    // 0
 */
export const yuanToScore = (str: number | string): number => {
    const num = typeof str === 'string' ? parseFloat(str) : str;
    if (isNaN(num)) return 0;
    return Math.round(num * 100);
};

/**
 * 设置空值为默认字符串
 * @param value - 要检查的值
 * @param df - 默认值，默认为空字符串
 * @returns 如果值是 null 或 undefined 返回默认值，否则返回字符串形式
 * @example
 * setEmpty(null)           // ''
 * setEmpty(undefined)       // ''
 * setEmpty(123)            // '123'
 * setEmpty('hello')        // 'hello'
 * setEmpty(null, 'default') // 'default'
 */
export const setEmpty = (value: unknown, df = ''): string => {
    if (value === null || value === undefined) return df;
    return String(value);
};

/**
 * 清除 HTML 标签和换行符
 * @param value - 包含 HTML 的字符串
 * @returns 清除 HTML 标签和换行符后的纯文本
 * @example
 * cleanHtml('<p>Hello<br>World</p>') // 'HelloWorld'
 * cleanHtml('<div>Text</div>')       // 'Text'
 */
export const cleanHtml = (value: string): string => {
    return value.replace(/<[^>]+>/g, '').replace(/\n/g, '');
};

/**
 * 获取字符串的实际长度（支持 Emoji 表情）
 * @param value - 要计算长度的字符串
 * @returns 字符串的实际字符数（Emoji 表情计为 1 个字符）
 * @example
 * getActualLength('hello')        // 5
 * getActualLength('你好')         // 2
 * getActualLength('👋🌍')          // 2
 */
export const getActualLength = (value: string): number => {
    return Array.from(value).length;
};

/**
 * 将 JSON 对象转换为 FormData
 * @param obj - 要转换的普通对象
 * @returns FormData 对象
 * @description 遍历对象属性，将非 null 和非 undefined 的值添加到 FormData
 * @example
 * const obj = { name: '张三', age: 20 };
 * const formData = toFormData(obj);
 */
export const toFormData = (obj: Record<string, unknown>): FormData => {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value as string | Blob);
        }
    });
    return formData;
};

/**
 * 将对象序列化为 URL 查询字符串
 * @param form - 要序列化的对象
 * @returns URL 编码的查询字符串
 * @example
 * toSerialize({ name: '张三', age: 20 }) // 'name=%E5%BC%A0%E4%B8%89&age=20'
 */
export const toSerialize = (form: Record<string, unknown>): string => {
    return Object.entries(form)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
};

/**
 * 混合两种颜色
 * @param c1 - 第一个颜色（十六进制）
 * @param c2 - 第二个颜色（十六进制）
 * @param ratio - 混合比例，默认为 0.5（均等混合）
 * @returns 混合后的颜色值（十六进制）
 * @example
 * toColor('#ff0000', '#0000ff')      // '#800080'（紫色）
 * toColor('#ffffff', '#000000', 0.3) // '#4d4d4d'
 */
export const toColor = (c1: string, c2: string, ratio = 0.5): string => {
    const hex = (x: number) => {
        const s = Math.round(x).toString(16);
        return s.length === 1 ? '0' + s : s;
    };
    
    const r1 = parseInt(c1.substring(1, 3), 16);
    const g1 = parseInt(c1.substring(3, 5), 16);
    const b1 = parseInt(c1.substring(5, 7), 16);
    
    const r2 = parseInt(c2.substring(1, 3), 16);
    const g2 = parseInt(c2.substring(3, 5), 16);
    const b2 = parseInt(c2.substring(5, 7), 16);
    
    const r = r1 * (1 - ratio) + r2 * ratio;
    const g = g1 * (1 - ratio) + g2 * ratio;
    const b = b1 * (1 - ratio) + b2 * ratio;
    
    return `#${hex(r)}${hex(g)}${hex(b)}`;
};

/**
 * 设置颜色透明度（减淡或加深）
 * @param color - 十六进制颜色值
 * @param amount - 调整量，默认为 0.5
 * @returns 调整后的十六进制颜色值
 * @description 值为正数时颜色变浅，负数时颜色变深
 * @example
 * toLighten('#808080', 0.5)  // 变浅
 * toLighten('#808080', -0.5) // 变深
 */
export const toLighten = (color: string, amount = 0.5): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
};

/**
 * 安全解析 JSON 字符串
 * @param value - JSON 字符串
 * @param d - 解析失败时的默认值
 * @returns 解析后的对象或默认值
 * @example
 * toParse('{"name": "张三"}')         // { name: '张三' }
 * toParse('invalid', { name: '' })   // { name: '' }
 * toParse('123')                     // 123
 */
export const toParse = <T>(value: string, d?: T): T => {
    try {
        return JSON.parse(value) as T;
    } catch {
        return d as T;
    }
};

/**
 * 处理栅格系统间隔样式
 * @param spacing - 间隔大小（像素值）
 * @param type - 样式类型，'m' 为 margin，'p' 为 padding，默认为 'm'
 * @returns CSS 样式字符串
 * @example
 * setRowSpace(20)       // 'margin: -10px'
 * setRowSpace(16, 'p')  // 'padding: 8px'
 */
export const setRowSpace = (spacing: number, type: 'm' | 'p' = 'm'): string => {
    const half = spacing / 2;
    return type === 'm' ? `margin: -${half}px` : `padding: ${half}px`;
};

/**
 * 将树形数组转换为扁平对象
 * @param arr - 树形数组
 * @param field - 作为键的字段名
 * @param objName - 存储结果的对象
 * @param arrName - 存储键名顺序的数组
 * @param children - 子数组字段名，默认为 'children'
 * @example
 * const tree = [{ id: '1', name: 'a', children: [{ id: '2', name: 'b' }] }];
 * const obj = {}, arr: string[] = [];
 * await arrToOneObj(tree, 'id', obj, arr);
 * // obj = { '1': {...}, '2': {...} }
 * // arr = ['1', '2']
 */
export const arrToOneObj = async <T extends Record<string, unknown>>(
    arr: T[],
    field: string,
    objName: Record<string, unknown> = {},
    arrName: string[] = [],
    children = 'children'
): Promise<void> => {
    arr.forEach(item => {
        const key = String(item[field]);
        objName[key] = item;
        arrName.push(key);
        const childArr = item[children] as T[] | undefined;
        if (childArr && Array.isArray(childArr)) {
            arrToOneObj(childArr, field, objName, arrName, children);
        }
    });
};

/**
 * 金额格式化（添加千分位分隔符）
 * @param price - 金额数值
 * @param decimal - 小数位数，默认为 2
 * @returns 格式化后的金额字符串
 * @example
 * priceFormat(1234567)       // '1,234,567.00'
 * priceFormat(1234567.8, 1)  // '1,234,567.8'
 * priceFormat(1000)          // '1,000.00'
 */
export const priceFormat = (price: number, decimal = 2): string => {
    return price.toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 数字格式化（转换为 K/W 表示）
 * @param num - 要格式化的数字
 * @returns 格式化后的数字或字符串（超过 1000 显示 K，超过 10000 显示 W）
 * @example
 * numberFormat(500)      // 500
 * numberFormat(1500)    // '1.5K'
 * numberFormat(25000)    // '2.5W'
 */
export const numberFormat = (num: number): string | number => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'W';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
};

/**
 * 计算两个时间戳之间的日期差异
 * @param date1 - 第一个时间戳
 * @param date2 - 第二个时间戳
 * @returns 包含天数、小时、分钟、秒数的对象
 * @example
 * const now = Date.now();
 * const yesterday = now - 86400000;
 * calcDate(now, yesterday) // { days: 1, hours: 0, minutes: 0, seconds: 0 }
 */
export const calcDate = (date1: number, date2: number): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} => {
    const diff = Math.abs(date2 - date1);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
};

/**
 * 根据背景色获取合适的文字颜色（黑或白）
 * @param color - 背景色（十六进制）
 * @param config - 配置选项
 * @param config.black - 深色文字颜色，默认为 '#000000'
 * @param config.white - 浅色文字颜色，默认为 '#ffffff'
 * @returns 根据背景色亮度返回黑或白
 * @description 基于颜色亮度算法，深色背景返回白色文字，浅色背景返回黑色文字
 * @example
 * toTextColor('#ffffff') // '#000000'
 * toTextColor('#000000') // '#ffffff'
 * toTextColor('#808080', { black: '#111', white: '#eee' }) // '#eee'
 */
export const toTextColor = (color: string, config: { black?: string; white?: string } = {}): string => {
    const { black = '#000000', white = '#ffffff' } = config;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? black : white;
};

/**
 * 判断 RGB 颜色是否为浅色
 * @param rgb - RGB 颜色数组 [r, g, b]
 * @returns 如果是浅色返回 true，否则返回 false
 * @example
 * isLight([255, 255, 255]) // true
 * isLight([0, 0, 0])         // false
 * isLight([128, 128, 128])   // false
 */
export const isLight = (rgb: number[]): boolean => {
    const [r, g, b] = rgb;
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
};

/**
 * 将十六进制颜色转换为 RGB 格式
 * @param hex - 十六进制颜色值（可带或不带 #）
 * @returns RGB 格式字符串，如 "rgb(255, 0, 0)"
 * @example
 * set16ToRgb('#ff0000') // 'rgb(255, 0, 0)'
 * set16ToRgb('00ff00')  // 'rgb(0, 255, 0)'
 */
export const set16ToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '';
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 将 RGB 颜色转换为十六进制格式
 * @param rgb - RGB 格式字符串
 * @returns 十六进制颜色值（带 #）
 * @example
 * setRgbTo16('rgb(255, 0, 0)') // '#ff0000'
 * setRgbTo16('rgb(0, 255, 0)') // '#00ff00'
 */
export const setRgbTo16 = (rgb: string): string => {
    const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgb);
    if (!result) return '';
    const r = parseInt(result[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(result[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(result[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
};

/**
 * 将 URL 协议替换为 https
 * @param url - 原始 URL
 * @returns 替换 http 为 https 后的 URL
 * @example
 * setUrlHttps('http://example.com') // 'https://example.com'
 * setUrlHttps('https://example.com') // 'https://example.com'（不变）
 */
export const setUrlHttps = (url: string): string => {
    return url.replace(/^http:/, 'https:');
};

/**
 * 将 URL 协议替换为 http
 * @param url - 原始 URL
 * @returns 替换 https 为 http 后的 URL
 * @example
 * setUrlHttp('https://example.com') // 'http://example.com'
 * setUrlHttp('http://example.com')  // 'http://example.com'（不变）
 */
export const setUrlHttp = (url: string): string => {
    return url.replace(/^https:/, 'http:');
};
