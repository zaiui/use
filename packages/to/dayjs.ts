import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import 'dayjs/locale/zh-cn.js';

dayjs.extend(relativeTime);

const DEFAULT_LOCALE = 'zh-cn';
dayjs.locale(DEFAULT_LOCALE);

/**
 * 切换 dayjs 语言（由 configureUse({ dayjsLocale }) 调用）
 */
export const applyDayjsLocale = (locale: string): void => {
    const normalized = locale.trim();
    if (!normalized) {
        dayjs.locale(DEFAULT_LOCALE);
        return;
    }
    dayjs.locale(normalized);
};

export default dayjs;
