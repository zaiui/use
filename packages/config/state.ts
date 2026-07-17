import type { UseGlobalConfig } from './types';

let config: UseGlobalConfig = {};

export const getUseConfig = (): Readonly<UseGlobalConfig> => config;

export const mergeUseConfig = (partial: UseGlobalConfig): void => {
    config = { ...config, ...partial };
};

export const getStoreKeyPrefix = (): string => config.storeKey?.trim() ?? '';

/**
 * 逻辑键 → 实际写入 Storage 的键
 */
export const resolveStoreKey = (key: string): string => {
    const prefix = getStoreKeyPrefix();
    if (!prefix) {
        return key;
    }
    return `${prefix}-${key}`;
};

/**
 * 实际 Storage 键 → 返回给业务侧的逻辑键（allStore 展示用）
 */
export const toLogicalStoreKey = (storageKey: string): string => {
    const prefix = getStoreKeyPrefix();
    if (!prefix) {
        return storageKey;
    }
    const head = `${prefix}-`;
    return storageKey.startsWith(head) ? storageKey.slice(head.length) : storageKey;
};

/** 当前配置下是否由本库管理的业务键 */
export const isScopedStoreDataKey = (storageKey: string): boolean => {
    if (isStoreMetaKey(storageKey)) {
        return false;
    }
    const prefix = getStoreKeyPrefix();
    if (!prefix) {
        return true;
    }
    return storageKey.startsWith(`${prefix}-`);
};

export const STORE_TIME_PREFIX = '@zaiui/use:time:';

export const storeTimeKey = (resolvedKey: string): string =>
    `${STORE_TIME_PREFIX}${resolvedKey}`;

export const isStoreMetaKey = (key: string): boolean =>
    key.startsWith(STORE_TIME_PREFIX);

/** 列出当前 scope 下应删除的键（含时间戳 meta） */
export const collectScopedStoreKeys = (storage: Storage): string[] => {
    const prefix = getStoreKeyPrefix();
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key) {
            continue;
        }
        if (isStoreMetaKey(key)) {
            const dataKey = key.slice(STORE_TIME_PREFIX.length);
            if (!prefix || dataKey.startsWith(`${prefix}-`)) {
                keys.push(key);
            }
            continue;
        }
        if (isScopedStoreDataKey(key)) {
            keys.push(key);
        }
    }
    return keys;
};
