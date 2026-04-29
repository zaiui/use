/**
 * @fileoverview 依赖注入模块
 * @description 提供简单的依赖注入功能
 * @module dependency
 * @author ZAIUI
 * @version 1.0.0
 */

/**
 * 依赖注入错误类
 * @description 用于抛出依赖注入相关的错误
 * @example
 * throw new DependencyError('Dependency not found');
 */
export class DependencyError extends Error {
    name = 'DependencyError';
    constructor(message: string) {
        super(message);
    }
}

const dependencyMap = new Map<string, unknown>();

/**
 * 提供依赖（注册服务）
 * @param key - 依赖的唯一标识键
 * @param value - 要注册的值或服务
 * @example
 * provide('userService', new UserService());
 * provide('apiBaseUrl', 'https://api.example.com');
 */
export const provide = <T>(key: string, value: T): void => {
    dependencyMap.set(key, value);
};

/**
 * 获取依赖（注入服务）
 * @param key - 依赖的唯一标识键
 * @param value - 可选的默认值，当依赖不存在时返回
 * @returns 注册的值，如果不存在则返回默认值
 * @example
 * const userService = inject<UserService>('userService');
 * const apiUrl = inject('apiBaseUrl', 'default-url');
 */
export const inject = <T>(key: string, value?: T): T | undefined => {
    if (dependencyMap.has(key)) {
        return dependencyMap.get(key) as T;
    }
    return value;
};

/**
 * 检查依赖是否已注册
 * @param key - 依赖的唯一标识键
 * @returns 如果依赖已注册返回 true，否则返回 false
 * @example
 * dependencyHas('userService') // true 或 false
 */
export const dependencyHas = (key: string): boolean => {
    return dependencyMap.has(key);
};

/**
 * 移除指定依赖
 * @param key - 依赖的唯一标识键
 * @returns 如果移除成功返回 true，如果依赖不存在返回 false
 * @example
 * dependencyRemove('userService');
 */
export const dependencyRemove = (key: string): boolean => {
    return dependencyMap.delete(key);
};

/**
 * 清空所有已注册的依赖
 * @example
 * dependencyClear(); // 移除所有依赖
 */
export const dependencyClear = (): void => {
    dependencyMap.clear();
};

/**
 * 获取当前容器中所有已注册的依赖键名
 * @returns 所有依赖键的数组
 * @example
 * const keys = dependencyKeys(); // ['userService', 'apiBaseUrl', ...]
 */
export const dependencyKeys = (): string[] => {
    return Array.from(dependencyMap.keys());
};

/**
 * 获取容器中已注册依赖的数量
 * @returns 依赖的数量
 * @example
 * const count = dependencySize(); // 5
 */
export const dependencySize = (): number => {
    return dependencyMap.size;
};
