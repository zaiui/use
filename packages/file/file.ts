/**
 * @fileoverview 文件操作模块
 * @description 提供文件大小格式化、文件信息提取、文件类型判断、文件下载等功能
 * @module file
 * @author ZAIUI
 * @version 1.0.0
 */

import { isBrowser } from '../shared/browser';

/**
 * 获取文件大小的格式化结果
 * @param size - 文件大小（字节）
 * @param obj - 是否返回对象格式，默认为 false（返回字符串）
 * @returns 返回格式化后的文件大小字符串或对象
 * @example
 * fileSize(1024)                   // '1 KB'
 * fileSize(1536)                   // '1.5 KB'
 * fileSize(1048576)               // '1 MB'
 * fileSize(1024, true)            // { size: 1, unit: 'KB' }
 */
export const fileSize = (size: number, obj = false): string | { size: number; unit: string } => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && index < units.length - 1) {
        fileSize /= 1024;
        index++;
    }
    
    if (obj) {
        return { size: Math.round(fileSize * 100) / 100, unit: units[index] };
    }
    return `${Math.round(fileSize * 100) / 100} ${units[index]}`;
};

/**
 * 判断文件是否超过指定大小
 * @param byte - 文件大小（字节）
 * @param maxMB - 最大文件大小（兆字节）
 * @returns 如果文件大小在限制内返回 true，否则返回 false
 * @example
 * isFileSize(1024 * 1024, 2)    // true（1MB < 2MB）
 * isFileSize(3 * 1024 * 1024, 2) // false（3MB > 2MB）
 */
export const isFileSize = (byte: number, maxMB: number): boolean => {
    return byte <= maxMB * 1024 * 1024;
};

/**
 * 获取文件名相关信息
 * @param path - 文件路径或文件名
 * @returns 返回包含文件信息的对象：name（不含扩展名）、suffix（扩展名）、fullName（完整文件名）
 * @example
 * fileInfo('/path/to/document.pdf')  // { name: 'document', suffix: 'pdf', fullName: 'document.pdf' }
 * fileInfo('image.png')               // { name: 'image', suffix: 'png', fullName: 'image.png' }
 */
export const fileInfo = (path: string): { name: string; suffix: string; fullName: string } => {
    const parts = path.split('/');
    const fullName = parts[parts.length - 1] || '';
    const nameParts = fullName.split('.');
    const suffix = nameParts.length > 1 ? nameParts.pop() || '' : '';
    const name = nameParts.join('.');
    return { name, suffix, fullName };
};

/**
 * 将 Base64 字符串转换为 File 对象
 * @param base64 - Base64 编码的字符串（可包含 data URI 前缀）
 * @param options - 配置选项
 * @param options.type - 文件 MIME 类型，默认为 'application/octet-stream'
 * @param options.name - 文件名，默认为 'file'
 * @param options.suffix - 文件扩展名
 * @returns 返回 File 对象
 * @example
 * const file = base64ToFile('data:image/png;base64,...', { name: 'avatar', suffix: 'png' });
 */
export const base64ToFile = (base64: string, options: { type?: string; name?: string; suffix?: string } = {}): File => {
    const { type = 'application/octet-stream', name = 'file', suffix = '' } = options;
    const byteString = atob(base64.split(',')[1] || base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type });
    return new File([blob], suffix ? `${name}.${suffix}` : name, { type });
};

/**
 * 验证文件格式是否匹配
 * @param file - 文件对象，包含 fileType 和 name 属性
 * @param accept - 允许的文件格式列表（逗号分隔）
 * @returns 如果文件格式匹配返回 true，否则返回 false
 * @description 支持通配符匹配（如 image/*）和扩展名匹配
 * @example
 * isFileFormat({ fileType: 'image/png', name: 'test.png' }, 'image/*')     // true
 * isFileFormat({ fileType: 'image/png', name: 'test.png' }, 'image/png')  // true
 * isFileFormat({ fileType: 'image/png', name: 'test.png' }, '.jpg,.png')  // true
 */
export const isFileFormat = (file: { fileType: string; name: string }, accept: string): boolean => {
    const types = accept.split(',').map(t => t.trim());
    return types.some(type => {
        if (type.includes('*')) {
            const [category] = type.split('/');
            return file.fileType.startsWith(category);
        }
        return file.fileType === type || file.name.endsWith(type.replace('.', ''));
    });
};

/**
 * 根据文件扩展名获取文件类型
 * @param name - 文件名或路径
 * @param customTypeMap - 自定义类型映射表
 * @returns 返回文件类型：image、video、audio、document、archive、code 或 unknown
 * @example
 * fileType('photo.jpg')    // 'image'
 * fileType('video.mp4')    // 'video'
 * fileType('script.js')    // 'code'
 * fileType('archive.zip')  // 'archive'
 */
export const fileType = (name: string, customTypeMap: Record<string, string[]> = {}): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string[]> = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
        video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
        audio: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
        document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        archive: ['zip', 'rar', '7z', 'tar', 'gz'],
        code: ['js', 'ts', 'html', 'css', 'json', 'xml', 'yaml', 'yml'],
        ...customTypeMap
    };
    
    for (const [type, exts] of Object.entries(typeMap)) {
        if (exts.includes(ext)) return type;
    }
    return 'unknown';
};

/**
 * 下载文件
 * @param response - 响应对象，包含 data（Blob）和 headers
 * @param fileName - 可选的自定义文件名，默认为 'download'
 * @returns 返回包含 code 和 msg 的结果对象
 * @example
 * const result = await downloadFile({
 *   data: blobData,
 *   headers: { 'content-disposition': 'attachment' }
 * }, 'report.pdf');
 */
export const downloadFile = async (
    response: { data: Blob; headers: Record<string, string> },
    fileName?: string
): Promise<{ code: number; msg: string }> => {
    if (!isBrowser()) {
        return { code: 500, msg: '下载失败' };
    }
    try {
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { code: 200, msg: '下载成功' };
    } catch {
        return { code: 500, msg: '下载失败' };
    }
};
