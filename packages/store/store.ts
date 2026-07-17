/**
 * @fileoverview 本地存储模块
 * @description 提供 localStorage 和 sessionStorage 的封装操作
 * @module store
 * @author ZAIUI
 * @version 1.0.5
 */

import {
    collectScopedStoreKeys,
    getStoreKeyPrefix,
    isScopedStoreDataKey,
    isStoreMetaKey,
    resolveStoreKey,
    storeTimeKey,
    toLogicalStoreKey,
} from '../config/state';
import { getStorage } from '../shared/browser';

/**
 * 保存数据到本地存储
 * @param key - 存储键名（逻辑键，会自动加上 configureUse 中的 storeKey 前缀）
 * @param value - 要存储的值（会自动 JSON 序列化）
 * @param session - 是否使用 sessionStorage，默认为 false（使用 localStorage）
 * @example
 * configureUse({ storeKey: 'abc' });
 * setStore('user', { name: '张三' }); // 实际键 abc-user
 */
export const setStore = (key: string, value: unknown, session = false): void => {
    const storage = getStorage(session);
    if (!storage) {
        return;
    }
    const storageKey = resolveStoreKey(key);
    storage.setItem(storageKey, JSON.stringify(value));
    storage.setItem(storeTimeKey(storageKey), String(Date.now()));
};

/**
 * 从本地存储获取数据
 * @param key - 存储键名
 * @param session - 是否使用 sessionStorage，默认为 false
 * @returns 返回存储的值（自动反序列化），如果键不存在返回 undefined
 */
export const getStore = <T>(key: string, session = false): T | undefined => {
    const storage = getStorage(session);
    if (!storage) {
        return undefined;
    }
    const value = storage.getItem(resolveStoreKey(key));
    if (value === null) {
        return undefined;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return value as unknown as T;
    }
};

/**
 * 删除本地存储中的指定数据
 * @param key - 要删除的存储键名
 * @param session - 是否使用 sessionStorage，默认为 false
 */
export const delStore = (key: string, session = false): void => {
    const storage = getStorage(session);
    if (!storage) {
        return;
    }
    const storageKey = resolveStoreKey(key);
    storage.removeItem(storageKey);
    storage.removeItem(storeTimeKey(storageKey));
};

/**
 * 获取所有存储数据（仅当前 storeKey 作用域；name 为逻辑键）
 * @param session - 是否使用 sessionStorage，默认为 false
 */
export const allStore = <T>(session = false): Array<{ name: string; content: T }> => {
    const storage = getStorage(session);
    if (!storage) {
        return [];
    }
    const result: Array<{ name: string; content: T }> = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key || isStoreMetaKey(key) || !isScopedStoreDataKey(key)) {
            continue;
        }
        const value = storage.getItem(key);
        if (value !== null) {
            try {
                result.push({ name: toLogicalStoreKey(key), content: JSON.parse(value) });
            } catch {
                result.push({ name: toLogicalStoreKey(key), content: value as unknown as T });
            }
        }
    }
    return result;
};

/**
 * 清空存储：未配置 storeKey 时清空整个 Storage；配置后仅删除带前缀的键
 * @param session - 是否使用 sessionStorage，默认为 false
 */
export const clearStore = (session = false): void => {
    const storage = getStorage(session);
    if (!storage) {
        return;
    }
    if (!getStoreKeyPrefix()) {
        storage.clear();
        return;
    }
    for (const key of collectScopedStoreKeys(storage)) {
        storage.removeItem(key);
    }
};

/**
 * 清空 localStorage 与 sessionStorage（受 storeKey 作用域约束）
 */
export const clearAllStore = (): void => {
    clearStore(false);
    clearStore(true);
};

/**
 * 检查缓存是否过期
 * @param key - 存储键名
 * @param time - 过期时间（毫秒），默认为 0（永不过期）
 * @param session - 是否使用 sessionStorage，默认为 false
 */
export const storeTime = (key: string, time = 0, session = false): boolean => {
    const storage = getStorage(session);
    if (!storage) {
        return true;
    }
    const timestamp = storage.getItem(storeTimeKey(resolveStoreKey(key)));
    if (!timestamp) {
        return true;
    }
    if (time <= 0) {
        return false;
    }
    const storedTime = parseInt(timestamp, 10);
    if (Number.isNaN(storedTime)) {
        return true;
    }
    return Date.now() - storedTime > time;
};
