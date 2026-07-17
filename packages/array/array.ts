/**
 * @fileoverview 数组操作工具模块
 * @description 提供全面的数组操作功能，包括创建、查找、删除、排序等常用操作
 * @module array
 * @author ZAIUI
 * @version 1.0.0
 */

import { isArray, isObject, isString } from '../type/index';

/**
 * 创建一个指定长度和初始值的数组
 * @param value - 数组元素的初始值，默认为空字符串
 * @param len - 数组长度，默认为 1
 * @returns 返回填充了指定值的数组
 * @description 当 value 为对象或数组时，各元素共享同一引用
 * @example
 * createArr('a', 3) // ['a', 'a', 'a']
 * createArr(0, 5)   // [0, 0, 0, 0, 0]
 * createArr()       // ['']
 */
export const createArr = <T>(value: T = '' as unknown as T, len: number = 1): T[] => {
    if (len <= 0) {
        return [];
    }
    return Array(len).fill(value);
};

/**
 * 随机打乱数组顺序（使用 Fisher-Yates 洗牌算法）
 * @param arr - 要打乱的数组
 * @returns 返回打乱后的新数组，原数组保持不变
 * @example
 * arrShuffle([1, 2, 3, 4, 5]) // 随机顺序的新数组
 */
export const arrShuffle = <T>(arr: unknown): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

/**
 * 检查一维数组中是否存在指定元素
 * @param arr - 要检查的数组
 * @param key - 要查找的元素
 * @param variable - 可选对象，用于接收元素的索引位置
 * @returns 如果找到元素返回 true，否则返回 false
 * @example
 * isArrItem([1, 2, 3], 2)              // true
 * isArrItem(['a', 'b'], 'c')           // false
 * const idx = { value: 0 };
 * isArrItem([10, 20, 30], 20, idx);    // idx.value === 1
 */
export const isArrItem = <T>(arr: unknown, key: T, variable?: { value?: number }): boolean => {
    if (!isArray<T>(arr)) {
        return false;
    }
    const index = arr.indexOf(key);
    if (isObject(variable)) {
        variable.value = index;
    }
    return index !== -1;
};

/**
 * 检查二维数组中是否存在指定字段值的元素
 * @param arr - 要检查的二维数组
 * @param field - 要匹配的字段名
 * @param key - 要查找的字段值
 * @param variable - 可选对象，用于接收元素的索引位置
 * @returns 如果找到匹配的的元素返回 true，否则返回 false
 * @example
 * const users = [{id: 1, name: '张三'}, {id: 2, name: '李四'}];
 * isArrIndex(users, 'id', 1)  // true
 * isArrIndex(users, 'name', '王五') // false
 */
export const isArrIndex = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown,
    variable?: { value?: number }
): boolean => {
    if (!isArray<T>(arr)) {
        return false;
    }
    const index = arrIndex(arr, field, key);
    if (isObject(variable)) {
        variable.value = index;
    }
    return index !== -1;
};

/**
 * 获取二维数组中指定字段值的索引位置
 * @param arr - 要搜索的二维数组
 * @param field - 要匹配的字段名
 * @param key - 要查找的字段值
 * @returns 返回找到的元素索引，未找到则返回 -1
 * @example
 * const arr = [{id: 1}, {id: 2}, {id: 3}];
 * arrIndex(arr, 'id', 2) // 1
 * arrIndex(arr, 'id', 5) // -1
 */
export const arrIndex = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): number => {
    if (!isArray<T>(arr)) {
        return -1;
    }
    return arr.findIndex((item) => item[field] === key);
};

/**
 * 从数组中移除指定元素
 * @param arr - 原数组
 * @param item - 要移除的元素
 * @returns 返回移除元素后的新数组
 * @example
 * arrDel([1, 2, 3, 4], 2) // [1, 3, 4]
 * arrDel(['a', 'b', 'c'], 'd') // ['a', 'b', 'c']（元素不存在时返回原数组副本）
 */
export const arrDel = <T>(arr: unknown, item: T): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arr.indexOf(item);
    if (index === -1) {
        return [...arr];
    }
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

/**
 * 从二维数组中移除指定字段值匹配的元素的
 * @param arr - 原二维数组
 * @param field - 要匹配的字段名
 * @param key - 要移除的字段值
 * @returns 返回移除元素后的新数组
 * @example
 * const users = [{id: 1, name: '张三'}, {id: 2, name: '李四'}];
 * arrDelKey(users, 'id', 1) // [{id: 2, name: '李四'}]
 */
export const arrDelKey = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arrIndex(arr, field, key);
    if (index === -1) {
        return [...arr];
    }
    return arrDel(arr, arr[index]);
};

/**
 * 保留数组中指定元素，移除其他所有元素
 * @param arr - 原数组
 * @param item - 要保留的元素
 * @returns 返回只包含指定元素的数组
 * @example
 * arrDelOther([1, 2, 3, 4], 2) // [2]
 * arrDelOther(['a', 'b', 'c'], 'd') // []（元素不存在时返回空数组）
 */
export const arrDelOther = <T>(arr: unknown, item: T): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arr.indexOf(item);
    if (index === -1) {
        return [];
    }
    return [arr[index]];
};

/**
 * 保留二维数组中指定字段值匹配的元素的
 * @param arr - 原二维数组
 * @param field - 要匹配的字段名
 * @param key - 要保留的字段值
 * @returns 返回只包含匹配元素的新数组
 * @example
 * const users = [{id: 1, name: '张三'}, {id: 2, name: '李四'}];
 * arrDelKeyOther(users, 'id', 1) // [{id: 1, name: '张三'}]
 */
export const arrDelKeyOther = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arrIndex(arr, field, key);
    if (index === -1) {
        return [];
    }
    return [arr[index]];
};

/**
 * 移除数组中指定元素及其左侧所有元素
 * @param arr - 原数组
 * @param item - 参照元素
 * @returns 返回从指定元素开始到数组末尾的新数组
 * @example
 * arrDelLeft([1, 2, 3, 4, 5], 3) // [3, 4, 5]
 * arrDelLeft(['a', 'b', 'c'], 'a') // ['a', 'b', 'c']
 */
export const arrDelLeft = <T>(arr: unknown, item: T): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arr.indexOf(item);
    if (index === -1) {
        return [...arr];
    }
    return arr.slice(index);
};

/**
 * 移除二维数组中指定字段值及其左侧所有元素
 * @param arr - 原二维数组
 * @param field - 要匹配的字段名
 * @param key - 参照字段值
 * @returns 返回从匹配元素开始到数组末尾的新数组
 * @example
 * const users = [{id: 1}, {id: 2}, {id: 3}];
 * arrDelKeyLeft(users, 'id', 2) // [{id: 2}, {id: 3}]
 */
export const arrDelKeyLeft = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arrIndex(arr, field, key);
    if (index === -1) {
        return [...arr];
    }
    return arr.slice(index);
};

/**
 * 移除数组中指定元素及其右侧所有元素
 * @param arr - 原数组
 * @param item - 参照元素
 * @returns 返回从数组开头到指定元素的新数组
 * @example
 * arrDelRight([1, 2, 3, 4, 5], 3) // [1, 2, 3]
 * arrDelRight(['a', 'b', 'c'], 'c') // ['a', 'b', 'c']
 */
export const arrDelRight = <T>(arr: unknown, item: T): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arr.indexOf(item);
    if (index === -1) {
        return [...arr];
    }
    return arr.slice(0, index + 1);
};

/**
 * 移除二维数组中指定字段值及其右侧所有元素
 * @param arr - 原二维数组
 * @param field - 要匹配的字段名
 * @param key - 参照字段值
 * @returns 返回从数组开头到匹配元素的新数组
 * @example
 * const users = [{id: 1}, {id: 2}, {id: 3}];
 * arrDelKeyRight(users, 'id', 2) // [{id: 1}, {id: 2}]
 */
export const arrDelKeyRight = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index = arrIndex(arr, field, key);
    if (index === -1) {
        return [...arr];
    }
    return arr.slice(0, index + 1);
};

/**
 * 替换数组中两个元素的位置
 * @param arr - 原数组
 * @param item1 - 第一个元素
 * @param item2 - 第二个元素
 * @returns 返回交换位置后的新数组
 * @example
 * arrReplace([1, 2, 3, 4], 2, 4) // [1, 4, 3, 2]
 * arrReplace(['a', 'b', 'c'], 'a', 'c') // ['c', 'b', 'a']
 */
export const arrReplace = <T>(arr: unknown, item1: T, item2: T): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    const index1 = arr.indexOf(item1);
    const index2 = arr.indexOf(item2);
    if (index1 === -1 || index2 === -1) {
        return [...arr];
    }
    const newArr = [...arr];
    [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];
    return newArr;
};

/**
 * 获取两个数组的交集（共同元素）
 * @param arr1 - 第一个数组
 * @param arr2 - 第二个数组
 * @returns 返回包含两个数组共同元素的新数组
 * @example
 * arrIntersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 * arrIntersection(['a', 'b'], ['b', 'c']) // ['b']
 */
export const arrIntersection = <T>(arr1: unknown, arr2: unknown): T[] => {
    if (!isArray<T>(arr1) || !isArray<T>(arr2)) {
        return [];
    }
    const set2 = new Set(arr2);
    return arr1.filter((item) => set2.has(item));
};

/**
 * 获取两个数组的并集（合并后去重）
 * @param arr1 - 第一个数组
 * @param arr2 - 第二个数组
 * @returns 返回合并去重后的新数组
 * @example
 * arrUnion([1, 2, 3], [2, 3, 4]) // [1, 2, 3, 4]
 * arrUnion(['a', 'b'], ['b', 'c']) // ['a', 'b', 'c']
 */
export const arrUnion = <T>(arr1: unknown, arr2: unknown): T[] => {
    if (!isArray<T>(arr1) || !isArray<T>(arr2)) {
        return [];
    }
    return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * 判断两个数组是否有交集
 * @param arr1 - 第一个数组
 * @param arr2 - 第二个数组
 * @returns 如果有交集返回 true，否则返回 false
 * @example
 * arrSomeOf([1, 2, 3], [3, 4, 5]) // true
 * arrSomeOf([1, 2], [3, 4])       // false
 */
export const arrSomeOf = <T>(arr1: unknown, arr2: unknown): boolean => {
    if (!isArray<T>(arr1) || !isArray<T>(arr2)) {
        return false;
    }
    const set2 = new Set(arr2);
    return arr1.some((item) => set2.has(item));
};

/**
 * 将二维数组中的 id 字段值拼接为字符串
 * @param arr - 要处理的二维数组
 * @returns 返回拼接后的字符串，默认用逗号分隔
 * @example
 * const items = [{id: 1}, {id: 2}, {id: 3}];
 * arrToId(items) // '1,2,3'
 */
export const arrToId = (arr: unknown): string => {
    return arrToKey(arr, 'id');
};

/**
 * 将二维数组中的指定字段值拼接为字符串
 * @param arr - 要处理的二维数组
 * @param field - 要提取的字段名，默认为 'id'
 * @param join - 分隔符，默认为逗号
 * @returns 返回拼接后的字符串
 * @example
 * const users = [{name: '张三'}, {name: '李四'}, {name: '王五'}];
 * arrToKey(users, 'name')    // '张三,李四,王五'
 * arrToKey(users, 'name', '-') // '张三-李四-王五'
 */
export const arrToKey = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T = 'id' as keyof T,
    join: string = ','
): string => {
    if (!isArray<T>(arr)) {
        return '';
    }
    return arr.map((obj) => obj[field]).join(join);
};

/**
 * 获取数组值，如果值不是数组则返回空数组
 * @param value - 要检查的值
 * @returns 如果是数组则返回原数组，否则返回空数组
 * @example
 * getArrValue([1, 2, 3]) // [1, 2, 3]
 * getArrValue('not array') // []
 * getArrValue(null)        // []
 */
export const getArrValue = <T>(value: unknown): T[] => {
    return isArray<T>(value) ? value : [];
};

/**
 * 根据指定字段值获取二维数组中对应元素的另一个字段值
 * @param arr - 要搜索的二维数组
 * @param field - 要匹配的字段名（用于查找）
 * @param key - 要获取值的字段名
 * @param value - 要匹配的字段值
 * @returns 返回匹配元素的指定字段值，未找到则返回空字符串
 * @example
 * const users = [{id: 1, name: '张三', age: 20}, {id: 2, name: '李四', age: 30}];
 * arrKeyValue(users, 'id', 'name', 1) // '张三'
 * arrKeyValue(users, 'id', 'age', 2)  // 30
 */
export const arrKeyValue = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: keyof T,
    value: unknown
): unknown => {
    if (!isArray<T>(arr) || value === undefined || value === null) {
        return '';
    }
    const index = arrIndex(arr, field, value);
    return index !== -1 ? (arr[index][key] ?? '') : '';
};

/**
 * 根据指定字段值获取二维数组中的完整对象
 * @param arr - 要搜索的二维数组
 * @param field - 要匹配的字段名
 * @param key - 要匹配的字段值
 * @returns 返回匹配的元素对象，未找到则返回空对象
 * @example
 * const users = [{id: 1, name: '张三'}, {id: 2, name: '李四'}];
 * getArrItem(users, 'id', 1) // {id: 1, name: '张三'}
 * getArrItem(users, 'name', '李四') // {id: 2, name: '李四'}
 */
export const getArrItem = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T,
    key: unknown
): T | Record<string, never> => {
    if (!isArray<T>(arr) || key === undefined || key === null) {
        return {};
    }
    const index = arrIndex(arr, field, key);
    return index !== -1 ? arr[index] : {};
};

const arrCompare = <T extends Record<string, unknown>>(key: keyof T, order: 'asc' | 'desc' = 'asc') => {
    return function innerSort(a: T, b: T): number {
        const hasA = Object.prototype.hasOwnProperty.call(a, key);
        const hasB = Object.prototype.hasOwnProperty.call(b, key);
        if (!hasA || !hasB) {
            return 0;
        }
        
        const varA = isString(a[key]) ? (a[key] as string).toUpperCase() : a[key];
        const varB = isString(b[key]) ? (b[key] as string).toUpperCase() : b[key];
        
        if (varA < varB) {
            return order === 'desc' ? 1 : -1;
        }
        if (varA > varB) {
            return order === 'desc' ? -1 : 1;
        }
        return 0;
    };
};

/**
 * 对二维数组按指定字段进行排序
 * @param arr - 要排序的二维数组
 * @param field - 排序依据的字段名，默认为 'id'
 * @param order - 排序顺序，'asc' 为升序，'desc' 为降序，默认为升序
 * @returns 返回排序后的新数组
 * @example
 * const users = [{id: 3, name: '张三'}, {id: 1, name: '李四'}, {id: 2, name: '王五'}];
 * arrKeySort(users, 'id')         // [{id: 1}, {id: 2}, {id: 3}]
 * arrKeySort(users, 'id', 'desc') // [{id: 3}, {id: 2}, {id: 1}]
 */
export const arrKeySort = <T extends Record<string, unknown>>(
    arr: unknown,
    field: keyof T = 'id' as keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] => {
    if (!isArray<T>(arr)) {
        return [];
    }
    return [...arr].sort(arrCompare(field, order));
};

/**
 * 不区分大小写的一维数组查询
 * @param arr - 要查询的字符串数组
 * @param val - 要查找的字符串
 * @returns 返回找到的元素索引，未找到则返回 -1
 * @example
 * indexQf(['Hello', 'World', 'Test'], 'hello') // 0
 * indexQf(['ABC', 'DEF'], 'xyz')      // -1
 */
export const indexQf = (arr: unknown, val: string): number => {
    if (!isArray<string>(arr) || !isString(val)) {
        return -1;
    }
    const lowerVal = val.toLowerCase();
    return arr.findIndex((item) => isString(item) && item.toLowerCase() === lowerVal);
};

/**
 * 递归获取树形数组的最深层子级数据
 * @param arr - 树形数组
 * @param parameter - 配置参数
 * @param parameter.index - 起始索引，默认为 0
 * @param parameter.children - 子数组字段名，默认为 'children'
 * @param parameter.key - 要获取的字段名，为空时返回整个子对象
 * @returns 返回最深层的数据，未找到返回 null
 * @example
 * const tree = [{
 *   id: 1,
 *   children: [{ id: 2, children: [{ id: 3, name: '深层节点' }] }]
 * }];
 * recursionChildren(tree)              // {id: 3, name: '深层节点'}
 * recursionChildren(tree, {key: 'name'}) // '深层节点'
 */
export const recursionChildren = <T extends Record<string, unknown>>(
    arr: unknown,
    parameter: {
        index?: number;
        children?: string;
        key?: string;
    } = {}
): T | unknown | null => {
    if (!isArray<T>(arr) || arr.length === 0) {
        return null;
    }
    
    const { index = 0, children = 'children', key = '' } = parameter;
    const item = arr[index];
    
    if (!item) {
        return null;
    }
    
    const childrenArr = item[children] as unknown;
    if (isArray<T>(childrenArr) && childrenArr.length > 0) {
        return recursionChildren(childrenArr, { ...parameter, index: 0 });
    }
    
    return key ? item[key] : item;
};
