/**
 * @fileoverview 事件总线 Hooks 模块
 * @description 提供微型跨文件、全局事件监听功能
 * @module hook/use-mitt
 * @author ZAIUI
 * @version 1.0.0
 */

/**
 * 事件处理器类型
 * @typeParam T - 事件数据的类型
 */
export type EventHandler<T = unknown> = (data: T) => void;

/**
 * 事件发射器接口
 * @description 定义事件总线的基本操作方法
 */
export interface MittEmitter {
    /**
     * 订阅事件
     * @param type - 事件类型
     * @param handler - 事件处理函数
     */
    on<T = unknown>(type: string, handler: EventHandler<T>): void;
    /**
     * 取消订阅事件
     * @param type - 事件类型
     * @param handler - 可选，指定要移除的处理函数，不传则移除该类型所有处理函数
     */
    off<T = unknown>(type: string, handler?: EventHandler<T>): void;
    /**
     * 触发事件
     * @param type - 事件类型
     * @param data - 可选，传递给处理函数的数据
     */
    emit<T = unknown>(type: string, data?: T): void;
    /** 清空所有事件订阅 */
    clear(): void;
}

/**
 * 创建一个微型事件监听器（类似 mitt 库）
 * @param handlers - 可选的事件处理器 Map
 * @returns 事件发射器实例
 * @description 提供轻量级的事件发布/订阅系统
 * @example
 * const emitter = useMitt();
 * 
 * // 订阅事件
 * emitter.on('user-login', (data) => {
 *   console.log('用户登录:', data);
 * });
 * 
 * // 触发事件
 * emitter.emit('user-login', { userId: 123 });
 * 
 * // 取消订阅
 * emitter.off('user-login');
 */
export const useMitt = (handlers = new Map<string, Set<EventHandler>>()): MittEmitter => {
    return {
        on<T>(type: string, handler: EventHandler<T>): void {
            if (!handlers.has(type)) {
                handlers.set(type, new Set());
            }
            handlers.get(type)!.add(handler as EventHandler);
        },
        off<T>(type: string, handler?: EventHandler<T>): void {
            const set = handlers.get(type);
            if (set) {
                if (handler) {
                    set.delete(handler as EventHandler);
                } else {
                    set.clear();
                }
            }
        },
        emit<T>(type: string, data?: T): void {
            const set = handlers.get(type);
            if (set) {
                set.forEach(handler => handler(data));
            }
        },
        clear(): void {
            handlers.clear();
        }
    };
};

/**
 * 全局事件发射器实例
 * @description 应用级别的全局事件总线
 * @example
 * // 订阅全局事件
 * emitter.on('app-theme-changed', (theme) => {
 *   console.log('主题切换为:', theme);
 * });
 * 
 * // 触发全局事件
 * emitter.emit('app-theme-changed', 'dark');
 */
export const emitter = useMitt();
