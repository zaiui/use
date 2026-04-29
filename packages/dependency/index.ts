/**
 * @fileoverview 依赖注入模块入口
 * @description 提供简单的依赖注入功能
 * @module dependency
 */

import * as dependencyUtils from './dependency';

/**
 * 依赖注入工具集合接口
 */
export interface DependencyUtils {
    DependencyError: typeof dependencyUtils.DependencyError;
    provide: typeof dependencyUtils.provide;
    inject: typeof dependencyUtils.inject;
    dependencyHas: typeof dependencyUtils.dependencyHas;
    dependencyRemove: typeof dependencyUtils.dependencyRemove;
    dependencyClear: typeof dependencyUtils.dependencyClear;
    dependencyKeys: typeof dependencyUtils.dependencyKeys;
    dependencySize: typeof dependencyUtils.dependencySize;
}

/**
 * 获取依赖注入工具集合
 * @returns 依赖注入工具集合对象
 */
export function useDependency(): DependencyUtils {
    return dependencyUtils;
}

// 直接导出原始函数
export * from './dependency';

// 导出工具集合
export default useDependency();
