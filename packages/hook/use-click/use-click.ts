/**
 * @fileoverview 点击控制 Hooks 模块
 * @description 提供防止重复点击、防抖点击等交互控制功能
 * @module hook/use-click
 * @author ZAIUI
 * @version 1.0.0
 */

let clickLock = false;

/**
 * 防止并发操作的点击处理函数
 * @param delay - 延迟时间（毫秒），默认为 1000
 * @returns Promise，延迟后 resolve
 * @description 返回一个 Promise，用于在点击后添加延迟，防止用户快速重复点击
 * @example
 * const handleClick = async () => {
 *   await useClick(1000); // 1秒内不能再次点击
 *   // 执行点击逻辑
 * };
 */
export const useClick = (delay = 1000): Promise<true> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, delay);
    });
};

/**
 * 防止并发，只执行第一次点击（守卫函数）
 * @param fn - 要执行的函数
 * @param delay - 锁定时间（毫秒），默认为 1000
 * @returns 包装后的异步函数
 * @description 返回一个新函数，该函数在锁定期间只会执行第一次调用，后续调用将被忽略
 * @example
 * const safeSubmit = useGuard(async () => {
 *   await submitForm();
 * }, 2000);
 * 
 * // 快速连续调用只有第一次会执行
 * safeSubmit(); // 执行
 * safeSubmit(); // 被忽略
 * safeSubmit(); // 被忽略
 */
export const useGuard = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay = 1000
): (...args: Parameters<T>) => Promise<void> | undefined => {
    return async (...args: Parameters<T>): Promise<void> => {
        if (clickLock) {
            return undefined;
        }
        clickLock = true;
        try {
            await fn(...args);
        } finally {
            setTimeout(() => {
                clickLock = false;
            }, delay);
        }
    };
};

/**
 * 延迟函数（Promise 形式的 setTimeout）
 * @param ms - 延迟时间（毫秒），默认为 1000
 * @returns Promise，延迟后返回 true
 * @example
 * await sleep(2000); // 延时 2 秒
 * console.log('2秒后执行');
 */
export const sleep = (ms = 1000): Promise<true> => {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
};
