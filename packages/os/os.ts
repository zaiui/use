/**
 * @fileoverview 操作系统和浏览器模块
 * @description 提供浏览器检测、全屏控制、剪贴板操作等功能
 * @module os
 * @author ZAIUI
 * @version 1.0.2
 */

import { getDocument, getNavigator, isBrowser } from '../shared/browser';

/**
 * 获取操作系统位数
 * @returns 返回系统位数：'32'、'64'、'mac' 或 'unknown'
 * @example
 * getOsBit() // '64'（在 64 位 Windows 系统上）
 * getOsBit() // 'mac'（在 macOS 系统上）
 */
export const getOsBit = (): '32' | '64' | 'mac' | 'unknown' => {
    const navigatorRef = getNavigator();
    if (!navigatorRef) {
        return 'unknown';
    }
    const userAgent = navigatorRef.userAgent;
    if (userAgent.indexOf('Win64') !== -1 || userAgent.indexOf('x64') !== -1) {
        return '64';
    }
    if (userAgent.indexOf('Win32') !== -1 || userAgent.indexOf('x86') !== -1) {
        return '32';
    }
    if (userAgent.indexOf('Mac') !== -1) {
        return 'mac';
    }
    return 'unknown';
};

/**
 * 获取浏览器版本信息
 * @returns 返回包含浏览器名称和版本的对象
 * @example
 * getBrowserVersion() // { name: 'chrome', version: '120' }
 * getBrowserVersion() // { name: 'firefox', version: '121' }
 */
export const getBrowserVersion = (): { name: string; version: string } => {
    const navigatorRef = getNavigator();
    if (!navigatorRef) {
        return { name: 'unknown', version: 'unknown' };
    }
    const ua = navigatorRef.userAgent;
    let name = 'unknown';
    let version = 'unknown';

    if (ua.includes('Edg/')) {
        name = 'edge';
        const match = ua.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'unknown';
    } else if (ua.includes('Chrome') && !ua.includes('Edg')) {
        name = 'chrome';
        const match = ua.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'unknown';
    } else if (ua.includes('Firefox')) {
        name = 'firefox';
        const match = ua.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        name = 'safari';
        const match = ua.match(/Version\/(\d+)/);
        version = match ? match[1] : 'unknown';
    }

    return { name, version };
};

/**
 * 全屏切换
 * @param enable - true 进入全屏，false 退出全屏，默认为 true
 * @example
 * fullScreen();      // 进入全屏
 * fullScreen(true);  // 进入全屏
 * fullScreen(false); // 退出全屏
 */
export const fullScreen = async (enable = true): Promise<void> => {
    const doc = getDocument();
    if (!doc?.documentElement) {
        return;
    }
    if (enable) {
        await doc.documentElement.requestFullscreen();
    } else {
        await doc.exitFullscreen();
    }
};

/**
 * 新开浏览器窗口
 * @param url - 要打开的 URL 地址
 * @example
 * newWindow('https://www.example.com');
 */
export const newWindow = (url: string): void => {
    if (!isBrowser()) {
        return;
    }
    window.open(url, '_blank');
};

/**
 * 动态添加 JS 脚本
 * @param src - 脚本资源 URL
 * @param type - 脚本类型，默认为 'text/javascript'
 * @returns Promise，脚本加载完成后 resolve，加载失败则 reject
 * @example
 * await addOnJs('https://example.com/script.js');
 */
export const addOnJs = (src: string, type = 'text/javascript'): Promise<void> => {
    const doc = getDocument();
    if (!doc) {
        return Promise.reject(new Error('document is not available'));
    }
    return new Promise((resolve, reject) => {
        const script = doc.createElement('script');
        script.type = type;
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject();
        doc.head.appendChild(script);
    });
};

/**
 * 延时函数
 * @param timeout - 延时时间（毫秒），默认为 1000
 * @returns Promise，延时完成后返回 true
 * @example
 * await asyncTime(2000); // 延时 2 秒
 */
export const asyncTime = (timeout = 1000): Promise<true> => {
    return new Promise(resolve => setTimeout(() => resolve(true), timeout));
};

/**
 * 获取年份列表
 * @param end - 结束年份，默认为当前年份
 * @param start - 起始年份，默认为 1900
 * @returns 年份数组
 * @example
 * getYearList()            // [1900, 1901, ..., 2024]
 * getYearList(2030, 2000)  // [2000, 2001, ..., 2030]
 */
export const getYearList = (end = new Date().getFullYear(), start = 1900): number[] => {
    const years: number[] = [];
    for (let i = start; i <= end; i++) {
        years.push(i);
    }
    return years;
};

/**
 * 获取月份列表
 * @returns 月份字符串数组（01-12）
 * @example
 * getMonthList() // ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
 */
export const getMonthList = (): string[] => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
};

/**
 * 设置图片颜色样式（CSS filter）
 * @param id - HTML 元素 ID
 * @param value - CSS filter 值
 * @returns 成功返回 true，元素不存在返回 false
 * @example
 * await setImageFilter('myImage', 'grayscale(100%)');
 * await setImageFilter('myImage', 'sepia(50%)');
 */
export const setImageFilter = async (id: string, value: string): Promise<boolean> => {
    try {
        const element = getDocument()?.getElementById(id);
        if (element) {
            element.style.filter = value;
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

/**
 * 设置颜色滤镜（生成随机色相旋转）
 * @param value - 十六进制颜色值
 * @returns 包含 RGB 数组、颜色对象和滤镜结果的对象
 * @example
 * const result = await setImageColor('#ff0000');
 * // result.rgb = [255, 0, 0]
 * // result.color = { r: 255, g: 0, b: 0 }
 * // result.res = { filter: 'hue-rotate(XXXdeg)' }
 */
export const setImageColor = async (value: string): Promise<{
    rgb: number[];
    color: { r: number; g: number; b: number };
    res: { filter: string };
}> => {
    const hex = value.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return {
        rgb: [r, g, b],
        color: { r, g, b },
        res: { filter: `hue-rotate(${Math.random() * 360}deg)` }
    };
};

/**
 * 设置剪贴板文本（复制到剪贴板）
 * @param text - 要复制的文本
 * @returns 成功返回 true，失败返回 false
 * @example
 * await setCopyText('Hello World');
 */
export const setCopyText = async (text: string): Promise<boolean> => {
    const navigatorRef = getNavigator();
    if (!navigatorRef?.clipboard) {
        return false;
    }
    try {
        await navigatorRef.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
};

/**
 * 获取剪贴板文本（从剪贴板读取）
 * @returns 成功返回剪贴板内容，失败返回 false
 * @example
 * const text = await getCopyText();
 * if (text) console.log(text);
 */
export const getCopyText = async (): Promise<string | false> => {
    const navigatorRef = getNavigator();
    if (!navigatorRef?.clipboard) {
        return false;
    }
    try {
        const text = await navigatorRef.clipboard.readText();
        return text;
    } catch {
        return false;
    }
};

/**
 * 在光标位置插入内容
 * @param startPos - 起始位置
 * @param endPos - 结束位置
 * @param value1 - 原字符串
 * @param value2 - 要插入的内容
 * @returns 插入内容后的新字符串
 * @example
 * setPosInsert(2, 4, 'Hello World', 'Beautiful ') // 'HeBeautiful llo World'
 */
export const setPosInsert = (startPos: number, endPos: number, value1: string, value2: string): string => {
    return value1.substring(0, startPos) + value2 + value1.substring(endPos);
};

/**
 * 设置输入框光标位置
 * @param id - 输入框元素 ID
 * @param pos - 光标位置
 * @example
 * setPosRange('usernameInput', 5); // 将光标设置到第 5 个字符位置
 */
export const setPosRange = (id: string, pos: number): void => {
    const element = getDocument()?.getElementById(id) as HTMLInputElement | null;
    if (element) {
        element.setSelectionRange(pos, pos);
        element.focus();
    }
};

/**
 * 设置元素焦点
 * @param id - 元素 ID
 * @example
 * setEleFocus('usernameInput'); // 让输入框获得焦点
 */
export const setEleFocus = (id: string): void => {
    const element = getDocument()?.getElementById(id) as HTMLElement | null;
    element?.focus();
};

/**
 * 设置 Element UI 主题色
 * @param color - 主题颜色值，默认为 '#409EFF'（Element UI 默认蓝色）
 * @example
 * setEleMainColor('#409EFF'); // 设置为 Element UI 默认蓝色
 * setEleMainColor('#ff6600'); // 设置为橙色
 */
export const setEleMainColor = (color = '#409EFF'): void => {
    getDocument()?.documentElement.style.setProperty('--el-color-primary', color);
};
