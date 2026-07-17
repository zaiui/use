/**
 * @fileoverview 验证模块入口
 * @description 提供全面的数据验证功能
 * @module validate
 */

import * as validateUtils from './validate';

/**
 * 验证工具集合接口
 */
export interface ValidateUtils {
    isUrl: typeof validateUtils.isUrl;
    isEmail: typeof validateUtils.isEmail;
    isPhone: typeof validateUtils.isPhone;
    isLowerCase: typeof validateUtils.isLowerCase;
    isUpperCase: typeof validateUtils.isUpperCase;
    isAlphabets: typeof validateUtils.isAlphabets;
    isIdCard: typeof validateUtils.isIdCard;
    isName: typeof validateUtils.isName;
    isNum: typeof validateUtils.isNum;
    isNumord: typeof validateUtils.isNumord;
    isEmpty: typeof validateUtils.isEmpty;
    isValidLicensePlate: typeof validateUtils.isValidLicensePlate;
    isNumberReg: typeof validateUtils.isNumberReg;
    formValidate: typeof validateUtils.formValidate;
}

/**
 * 获取验证工具集合
 * @returns 验证工具集合对象
 */
export function useValidate(): ValidateUtils {
    return validateUtils;
}

// 直接导出原始函数
export * from './validate';

// 导出工具集合
export default useValidate();
