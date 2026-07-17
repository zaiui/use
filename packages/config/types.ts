/**
 * @zaiui/use 全局配置项
 */
export interface UseGlobalConfig {
    /**
     * localStorage / sessionStorage 键名前缀
     * @example 'my-app' → 实际键名为 `my-app-token`
     */
    storeKey?: string;
    /**
     * dayjs 语言包名称
     * @example 'zh-cn' | 'en'
     */
    dayjsLocale?: string;
}
