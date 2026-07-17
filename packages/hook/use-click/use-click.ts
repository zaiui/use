/**
 * @fileoverview 点击控制 Hooks 模块
 * @description 提供防止重复点击、防抖点击等交互控制功能
 * @module hook/use-click
 * @author ZAIUI
 * @version 1.0.3
 */

const clickCooldownUntil = new Map<string, number>();

/**
 * 防连点：冷却期内再次调用会 resolve(false)，首次或冷却结束后 resolve(true)
 * @param delay - 冷却时间（毫秒），默认为 1000
 * @param key - 可选，区分不同按钮/操作的冷却通道，默认为 `'default'`
 * @returns `true` 表示允许继续执行点击逻辑，`false` 表示应直接 return
 * @example
 * const handleClick = async () => {
 *   if (!(await useClick(1000))) return;
 *   await submitForm();
 * };
 *
 * // 多个按钮互不干扰
 * if (!(await useClick(800, 'save'))) return;
 * if (!(await useClick(800, 'delete'))) return;
 */
export const useClick = (delay = 1000, key = 'default'): Promise<boolean> => {
    if (delay <= 0) {
        return Promise.resolve(true);
    }
    const now = Date.now();
    const cooldownUntil = clickCooldownUntil.get(key) ?? 0;
    if (now < cooldownUntil) {
        return Promise.resolve(false);
    }
    clickCooldownUntil.set(key, now + delay);
    return Promise.resolve(true);
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
 * safeSubmit(); // 执行
 * safeSubmit(); // 被忽略
 */
export const useGuard = <T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay = 1000
): (...args: Parameters<T>) => Promise<void> | undefined => {
    let clickLock = false;
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
 * await sleep(2000);
 * console.log('2秒后执行');
 */
export const sleep = (ms = 1000): Promise<true> => {
    return new Promise(resolve => setTimeout(() => resolve(true), ms));
};

/**
 * 重置指定通道（或全部）的 useClick 冷却
 * @param key - 不传则清空所有通道
 */
export const resetClickCooldown = (key?: string): void => {
    if (key === undefined) {
        clickCooldownUntil.clear();
        return;
    }
    clickCooldownUntil.delete(key);
};
