import { applyDayjsLocale } from '../to/dayjs';
import type { UseGlobalConfig } from './types';
import { mergeUseConfig } from './state';

/**
 * 在应用入口一次性配置 @zaiui/use 的全局行为（可多次调用，后者合并覆盖）
 * @example
 * configureUse({ storeKey: 'my-app', dayjsLocale: 'zh-cn' })
 */
export const configureUse = (options: UseGlobalConfig): void => {
    mergeUseConfig(options);
    if (options.dayjsLocale !== undefined) {
        applyDayjsLocale(options.dayjsLocale);
    }
};
