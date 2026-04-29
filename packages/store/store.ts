/**
 * @fileoverview 本地存储模块
 * @description 提供 localStorage 和 sessionStorage 的封装操作
 * @module store
 * @author ZAIUI
 * @version 1.0.0
 */

/**
 * 保存数据到本地存储
 * @param key - 存储键名
 * @param value - 要存储的值（会自动 JSON 序列化）
 * @param session - 是否使用 sessionStorage，默认为 false（使用 localStorage）
 * @example
 * setStore('user', { name: '张三', age: 20 });
 * setStore('token', 'abc123', true); // 使用 sessionStorage
 */
export const setStore = (key: string, value: unknown, session = false): void => {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
};

/**
 * 从本地存储获取数据
 * @param key - 存储键名
 * @param debug - 是否启用调试模式，默认为 false
 * @param session - 是否使用 sessionStorage，默认为 false
 * @returns 返回存储的值（自动反序列化），如果键不存在返回 undefined
 * @example
 * const user = getStore<{ name: string }>('user'); // { name: '张三' }
 * const token = getStore<string>('token', false, true);
 */
export const getStore = <T>(key: string, debug = false, session = false): T | undefined => {
    const storage = session ? sessionStorage : localStorage;
    const value = storage.getItem(key);
    if (value === null) return undefined;
    try {
        const parsed = JSON.parse(value);
        return debug ? parsed : parsed;
    } catch {
        return value as unknown as T;
    }
};

/**
 * 删除本地存储中的指定数据
 * @param key - 要删除的存储键名
 * @param session - 是否使用 sessionStorage，默认为 false
 * @example
 * delStore('user');
 * delStore('token', true);
 */
export const delStore = (key: string, session = false): void => {
    const storage = session ? sessionStorage : localStorage;
    storage.removeItem(key);
};

/**
 * 获取所有存储数据
 * @param session - 是否使用 sessionStorage，默认为 false
 * @returns 返回包含所有键值对的数组，每个元素包含 name（键名）和 content（值）
 * @example
 * const all = allStore(); // [{ name: 'user', content: {...} }, ...]
 * const sessionAll = allStore(true);
 */
export const allStore = <T>(session = false): Array<{ name: string; content: T }> => {
    const storage = session ? sessionStorage : localStorage;
    const result: Array<{ name: string; content: T }> = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
            const value = storage.getItem(key);
            if (value !== null) {
                try {
                    result.push({ name: key, content: JSON.parse(value) });
                } catch {
                    result.push({ name: key, content: value as unknown as T });
                }
            }
        }
    }
    return result;
};

/**
 * 清空指定存储的所有数据
 * @param session - 是否使用 sessionStorage，默认为 false
 * @example
 * clearStore(); // 清空 localStorage
 * clearStore(true); // 清空 sessionStorage
 */
export const clearStore = (session = false): void => {
    const storage = session ? sessionStorage : localStorage;
    storage.clear();
};

/**
 * 清空所有存储（包括 localStorage 和 sessionStorage）
 * @example
 * clearAllStore();
 */
export const clearAllStore = (): void => {
    localStorage.clear();
    sessionStorage.clear();
};

/**
 * 检查缓存是否过期
 * @param key - 存储键名
 * @param time - 过期时间（毫秒），默认为 0（永不过期）
 * @returns 如果缓存已过期或不存在返回 true，否则返回 false
 * @description 用于判断本地存储的数据是否超过指定时间
 * @example
 * storeTime('user', 60000); // 检查 user 缓存是否超过 60 秒
 * storeTime('token', 3600000); // 检查 token 缓存是否超过 1 小时
 */
export const storeTime = (key: string, time = 0): boolean => {
    const timestamp = localStorage.getItem(`${key}_time`);
    if (!timestamp) return true;
    const storedTime = parseInt(timestamp, 10);
    return Date.now() - storedTime > time;
};
