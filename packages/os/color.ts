/**
 * @fileoverview 颜色处理类
 * @description 提供颜色处理和 CSS filter 生成功能
 * @module os/color
 * @author ZAIUI
 * @version 1.0.3
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

const IDENTITY_MATRIX: readonly number[] = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];

const GRAYSCALE_MATRIX: readonly number[] = [
    0.2126, 0.7152, 0.0722,
    0.2126, 0.7152, 0.0722,
    0.2126, 0.7152, 0.0722,
];

const SEPIA_MATRIX: readonly number[] = [
    0.393, 0.769, 0.189,
    0.349, 0.686, 0.168,
    0.272, 0.534, 0.131,
];

/** saturate(0) 对应的矩阵系数 */
const DESATURATE_MATRIX: readonly number[] = [
    0.213, 0.715, 0.072,
    0.213, 0.715, 0.072,
    0.213, 0.715, 0.072,
];

const FILTER_PARAM_COUNT = 6;
const SPSA_GAMMA = 1 / 6;
const WIDE_SEARCH_INITIAL = [50, 20, 3750, 50, 100, 100];

const clamp255 = (value: number): number => Math.max(0, Math.min(255, value));

/** 在 identity 与 effect 矩阵之间按 amount 插值（与原有 a + b*(1-v) 公式等价） */
const blendMatrix = (effect: readonly number[], amount: number): number[] => {
    const t = 1 - amount;
    const out = new Array<number>(9);
    for (let i = 0; i < 9; i++) {
        out[i] = effect[i] + (IDENTITY_MATRIX[i] - effect[i]) * t;
    }
    return out;
};

const clampFilterParam = (value: number, idx: number): number => {
    let max = 100;
    if (idx === 2) {
        max = 7500;
    } else if (idx === 4 || idx === 5) {
        max = 200;
    }
    if (idx === 3) {
        if (value > max) {
            return value % max;
        }
        if (value < 0) {
            return max + value % max;
        }
        return value;
    }
    if (value < 0) {
        return 0;
    }
    if (value > max) {
        return max;
    }
    return value;
};

/**
 * RGB 颜色类，用于颜色处理和转换
 * @description 提供 RGB 颜色的基本操作和 CSS filter 效果模拟
 */
export class Color {
    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toString(): string {
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }

    set(r: number, g: number, b: number): void {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    hueRotate(angle = 0): void {
        const rad = angle / 180 * Math.PI;
        const sin = Math.sin(rad);
        const cos = Math.cos(rad);

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

    grayscale(value = 1): void {
        this.multiply(blendMatrix(GRAYSCALE_MATRIX, value));
    }

    sepia(value = 1): void {
        this.multiply(blendMatrix(SEPIA_MATRIX, value));
    }

    saturate(value = 1): void {
        const out = new Array<number>(9);
        for (let i = 0; i < 9; i++) {
            out[i] = DESATURATE_MATRIX[i] + (IDENTITY_MATRIX[i] - DESATURATE_MATRIX[i]) * value;
        }
        this.multiply(out);
    }

    multiply(matrix: readonly number[]): void {
        const { r, g, b } = this;
        this.r = clamp255(r * matrix[0] + g * matrix[1] + b * matrix[2]);
        this.g = clamp255(r * matrix[3] + g * matrix[4] + b * matrix[5]);
        this.b = clamp255(r * matrix[6] + g * matrix[7] + b * matrix[8]);
    }

    brightness(value = 1): void {
        this.linear(value);
    }

    contrast(value = 1): void {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    linear(slope = 1, intercept = 0): void {
        const offset = intercept * 255;
        this.r = clamp255(this.r * slope + offset);
        this.g = clamp255(this.g * slope + offset);
        this.b = clamp255(this.b * slope + offset);
    }

    invert(value = 1): void {
        const scale = 1 - 2 * value;
        const base = value * 255;
        this.r = clamp255(base + this.r * scale);
        this.g = clamp255(base + this.g * scale);
        this.b = clamp255(base + this.b * scale);
    }

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
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                default:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return { h: h * 100, s: s * 100, l: l * 100 };
    }

    clamp(value: number): number {
        return clamp255(value);
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

    constructor(target: Color, baseColor = new Color(0, 0, 0)) {
        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = baseColor;
    }

    solve(): SolverResult {
        const result = this.solveNarrow(this.solveWide());
        return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
        };
    }

    solveWide(): { loss: number; values?: number[] } {
        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];

        let best: { loss: number; values?: number[] } = { loss: Infinity };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const result = this.spsa(A, a, c, [...WIDE_SEARCH_INITIAL], 1000);
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
        const initial = wide.values ?? [...WIDE_SEARCH_INITIAL];

        return this.spsa(A, a, c, initial, 500);
    }

    spsa(A: number, a: number[], c: number, values: number[], iters: number): SolverResult {
        const alpha = 1;

        let best = [...values];
        let bestLoss = Infinity;

        const deltas = new Array<number>(FILTER_PARAM_COUNT);
        const highArgs = new Array<number>(FILTER_PARAM_COUNT);
        const lowArgs = new Array<number>(FILTER_PARAM_COUNT);

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, SPSA_GAMMA);
            for (let i = 0; i < FILTER_PARAM_COUNT; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < FILTER_PARAM_COUNT; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = clampFilterParam(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = [...values];
                bestLoss = loss;
            }
        }

        return { values: best, loss: bestLoss, filter: this.css(best) };
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
        const fmt = (idx: number, multiplier = 1): string =>
            String(Math.round(filters[idx] * multiplier));
        return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
    }
}

/**
 * 十六进制颜色转 RGB 数组
 * @param hex - 十六进制颜色值（可带或不带 #）
 * @returns RGB 数组 [r, g, b]，解析失败返回 null
 */
export const hexToRgb = (hex: string): number[] | null => {
    const normalized = hex.trim().replace(/^#/, '');
    if (!/^[a-f\d]{6}$/i.test(normalized)) {
        return null;
    }
    return [
        parseInt(normalized.slice(0, 2), 16),
        parseInt(normalized.slice(2, 4), 16),
        parseInt(normalized.slice(4, 6), 16),
    ];
};
