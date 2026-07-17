/**
 * 浏览器环境检测与 Storage 安全访问（SSR / Node 下返回 null）
 */
export const isBrowser = (): boolean =>
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as typeof globalThis & { window?: Window }).window !== 'undefined';

export const getStorage = (session = false): Storage | null => {
    if (!isBrowser()) {
        return null;
    }
    try {
        return session ? window.sessionStorage : window.localStorage;
    } catch {
        return null;
    }
};

export const getDocument = (): Document | null =>
    isBrowser() ? document : null;

export const getNavigator = (): Navigator | null =>
    isBrowser() ? navigator : null;
