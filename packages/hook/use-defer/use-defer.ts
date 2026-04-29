/**
 * @fileoverview 延迟渲染 Hooks 模块
 * @description 提供基于 requestAnimationFrame 的延迟渲染控制功能
 * @module hook/use-defer
 * @author ZAIUI
 * @version 1.0.0
 */

/**
 * 延迟渲染控制器接口
 * @description 提供基于帧的延迟渲染检查功能，常用于虚拟列表优化
 */
export interface DeferController {
    /**
     * 检查是否在指定帧数后显示
     * @param showInFrameCount - 帧数阈值
     * @returns 如果当前帧数大于等于阈值返回 true
     */
    deferCheck(showInFrameCount: number): boolean;
    /** 停止帧计数 */
    stop(): void;
    /** 重置帧计数 */
    reset(): void;
    /** 获取当前帧数 */
    getCurrentFrame(): number;
}

/**
 * 创建一个延迟渲染检查器
 * @param maxFrameCount - 最大帧数，默认为 100
 * @returns 延迟渲染控制器
 * @description 基于 requestAnimationFrame 创建帧计数器，用于控制组件的延迟渲染
 * @example
 * const defer = useDefer(60); // 60帧后开始渲染
 * 
 * // 在 React 组件中使用
 * const show = defer.deferCheck(props.frame);
 * 
 * // 清理时停止
 * useEffect(() => {
 *   return () => defer.stop();
 * }, []);
 */
export const useDefer = (maxFrameCount = 100): DeferController => {
    if (maxFrameCount <= 0) {
        throw new Error('maxFrameCount must be a positive number');
    }

    let currentFrame = 0;
    let rafId: number | null = null;
    let isRunning = true;

    const countFrame = (): void => {
        if (!isRunning) return;
        if (currentFrame < maxFrameCount) {
            currentFrame++;
            rafId = requestAnimationFrame(countFrame);
        }
    };

    rafId = requestAnimationFrame(countFrame);

    return {
        deferCheck(showInFrameCount: number): boolean {
            return currentFrame >= showInFrameCount;
        },
        stop(): void {
            isRunning = false;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        },
        reset(): void {
            currentFrame = 0;
            if (!isRunning) {
                isRunning = true;
                rafId = requestAnimationFrame(countFrame);
            }
        },
        getCurrentFrame(): number {
            return currentFrame;
        }
    };
};
