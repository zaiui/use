/**
 * @fileoverview 文件模块入口
 * @description 提供文件操作功能
 * @module file
 */

import * as fileUtils from './file';

/**
 * 文件操作工具集合接口
 */
export interface FileUtils {
    fileSize: typeof fileUtils.fileSize;
    isFileSize: typeof fileUtils.isFileSize;
    fileInfo: typeof fileUtils.fileInfo;
    base64ToFile: typeof fileUtils.base64ToFile;
    isFileFormat: typeof fileUtils.isFileFormat;
    fileType: typeof fileUtils.fileType;
    downloadFile: typeof fileUtils.downloadFile;
}

/**
 * 获取文件操作工具集合
 * @returns 文件操作工具集合对象
 */
export function useFile(): FileUtils {
    return fileUtils;
}

// 直接导出原始函数
export * from './file';

// 导出工具集合
export default useFile();
