/**
 * @fileoverview 颜色处理类
 * @description 提供颜色处理和 CSS filter 生成功能
 * @module os/color
 * @author ZAIUI
 * @version 1.0.0
 */

export interface HSLColor {
    h: number;
    s: number;
    l: number;
}

export interface SolverResult {
    values: number[];
    loss: number;
    filter: string;
}

/**
 * RGB 颜色类，用于颜色处理和转换
 * @description 提供 RGB 颜色的基本操作和 CSS filter 效果模拟
 */
export class Color {
    r: number;
    g: number;
    b: number;

    /**
     * 创建 RGB 颜色实例
     * @param r - 红色通道值（0-255）
     * @param g - 绿色通道值（0-255）
     * @param b - 蓝色通道值（0-255）
     */
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * 转换为 RGB 字符串
     * @returns RGB 格式字符串，如 "rgb(255, 0, 0)"
     */
    toString(): string {
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }

    /**
     * 设置颜色值
     * @param r - 红色通道值
     * @param g - 绿色通道值
     * @param b - 蓝色通道值
     */
    set(r: number, g: number, b: number): void {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * 色相旋转
     * @param angle - 旋转角度（度），默认为 0
     * @description 根据角度旋转颜色，模拟 CSS filter: hue-rotate()
     */
    hueRotate(angle = 0): void {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
        ]);
    }

    /**
     * 灰度处理
     * @param value - 灰度强度（0-1），默认为 1（完全灰度）
     * @description 将颜色转换为灰度，模拟 CSS filter: grayscale()
     */
    grayscale(value = 1): void {
        this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
        ]);
    }

    /**
     * 棕褐色调处理
     * @param value - 棕褐强度（0-1），默认为 1（完全棕褐色）
     * @description 添加棕褐色调，模拟 CSS filter: sepia()
     */
    sepia(value = 1): void {
        this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
        ]);
    }

    /**
     * 饱和度调整
     * @param value - 饱和度乘数（0-1），默认为 1（原始饱和度）
     * @description 调整颜色饱和度，模拟 CSS filter: saturate()
     */
    saturate(value = 1): void {
        this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
        ]);
    }

    /**
     * 矩阵乘法（内部方法，用于实现各种滤镜效果）
     * @param matrix - 3x3 变换矩阵
     */
    multiply(matrix: number[]): void {
        const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
        const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
        const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    /**
     * 亮度调整
     * @param value - 亮度乘数，默认为 1（原始亮度）
     * @description 调整颜色亮度，模拟 CSS filter: brightness()
     */
    brightness(value = 1): void {
        this.linear(value);
    }

    /**
     * 对比度调整
     * @param value - 对比度乘数，默认为 1（原始对比度）
     * @description 调整颜色对比度，模拟 CSS filter: contrast()
     */
    contrast(value = 1): void {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    /**
     * 线性调整（内部方法）
     * @param slope - 斜率
     * @param intercept - 截距
     */
    linear(slope = 1, intercept = 0): void {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }

    /**
     * 反相处理
     * @param value - 反相强度（0-1），默认为 1（完全反相）
     * @description 反转颜色，模拟 CSS filter: invert()
     */
    invert(value = 1): void {
        this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }

    /**
     * 转换为 HSL 颜色
     * @returns HSL 颜色对象
     */
    hsl(): HSLColor {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 100, s: s * 100, l: l * 100 };
    }

    /**
     * 限制数值在 0-255 范围内
     * @param value - 要限制的数值
     * @returns 限制后的数值
     */
    clamp(value: number): number {
        return Math.max(0, Math.min(255, value));
    }
}

/**
 * Solver 类，用于生成近似目标颜色的 CSS filter
 * @description 使用优化算法找到能产生目标颜色的 CSS filter 参数
 */
export class Solver {
    target: Color;
    targetHSL: HSLColor;
    reusedColor: Color;

    /**
     * 创建 Solver 实例
     * @param target - 目标颜色
     * @param baseColor - 基础颜色，默认为黑色
     */
    constructor(target: Color, baseColor = new Color(0, 0, 0)) {
        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = baseColor;
    }

    /**
     * 求解最佳 CSS filter 参数
     * @returns 包含数值、损失值和 CSS filter 字符串的结果对象
     * @example
     * const solver = new Solver(new Color(255, 0, 0));
     * const result = solver.solve();
     * // result.filter = 'filter: invert(0%) sepia(0%) saturate(1%) ...'
     */
    solve(): SolverResult {
        const result = this.solveNarrow(this.solveWide());
        return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values)
        };
    }

    solveWide(): { loss: number; values?: number[] } {
        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];

        let best = { loss: Infinity };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best;
    }

    solveNarrow(wide: { loss: number; values?: number[] }): SolverResult {
        const A = wide.loss;
        const c = 2;
        const A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];

        return this.spsa(A, a as number[], c, wide.values || [50, 20, 3750, 50, 100, 100], 500);
    }

    spsa(A: number, a: number[], c: number, values: number[], iters: number): SolverResult {
        const alpha = 1;
        const gamma = 0.16666666666666666;

        let best = [...values];
        let bestLoss = Infinity;

        const deltas = new Array(6);
        const highArgs = new Array(6);
        const lowArgs = new Array(6);

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = [...values];
                bestLoss = loss;
            }
        }

        return { values: best, loss: bestLoss, filter: this.css(best) };

        function fix(value: number, idx: number): number {
            let max = 100;
            if (idx === 2) max = 7500;
            else if (idx === 4 || idx === 5) max = 200;
            if (idx === 3) {
                if (value > max) value %= max;
                else if (value < 0) value = max + value % max;
            } else if (value < 0) value = 0;
            else if (value > max) value = max;
            return value;
        }
    }

    loss(filters: number[]): number {
        const color = this.reusedColor;
        color.set(0, 0, 0);
        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100 + 1);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100 + 1);

        const colorHSL = color.hsl();
        return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
        );
    }

    css(filters: number[]): string {
        function fmt(idx: number, multiplier = 1): string {
            return String(Math.round(filters[idx] * multiplier));
        }
        return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
    }
}

/**
 * 十六进制颜色转 RGB 数组
 * @param hex - 十六进制颜色值（可带或不带 #）
 * @returns RGB 数组 [r, g, b]，解析失败返回 null
 * @example
 * hexToRgb('#ff0000') // [255, 0, 0]
 * hexToRgb('00ff00')  // [0, 255, 0]
 */
export const hexToRgb = (hex: string): number[] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};
