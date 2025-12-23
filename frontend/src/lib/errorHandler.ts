/**
 * 错误处理工具函数
 * 
 * 提供统一的错误处理和用户反馈
 * 需求：16.1, 16.2, 16.3, 16.4, 16.5
 */
import {
  showError,
  notifyFileReadError,
  notifyImageDecodeError,
  notifyCompressionError,
  notifyEditError,
  notifySaveError,
  notifyNetworkError,
  notifyFileSelectError,
  notifySelectPathError,
} from './toast';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  FILE_READ = 'FILE_READ',
  IMAGE_DECODE = 'IMAGE_DECODE',
  COMPRESSION = 'COMPRESSION',
  EDIT = 'EDIT',
  SAVE = 'SAVE',
  NETWORK = 'NETWORK',
  FILE_SELECT = 'FILE_SELECT',
  PATH_SELECT = 'PATH_SELECT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  filename?: string;
}

/**
 * 解析错误类型
 * @param error 原始错误
 * @returns 错误类型
 */
export const parseErrorType = (error: unknown): ErrorType => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('decode') || message.includes('解码')) {
      return ErrorType.IMAGE_DECODE;
    }
    if (message.includes('read') || message.includes('读取')) {
      return ErrorType.FILE_READ;
    }
    if (message.includes('compress') || message.includes('压缩')) {
      return ErrorType.COMPRESSION;
    }
    if (message.includes('edit') || message.includes('编辑')) {
      return ErrorType.EDIT;
    }
    if (message.includes('save') || message.includes('保存') || message.includes('write') || message.includes('写入')) {
      return ErrorType.SAVE;
    }
    if (message.includes('network') || message.includes('网络') || message.includes('fetch') || message.includes('connection')) {
      return ErrorType.NETWORK;
    }
    if (message.includes('select') || message.includes('选择') || message.includes('dialog') || message.includes('对话框')) {
      return ErrorType.FILE_SELECT;
    }
  }
  
  return ErrorType.UNKNOWN;
};

/**
 * 处理错误并显示通知
 * @param error 原始错误
 * @param context 错误上下文（可选）
 * @param filename 相关文件名（可选）
 */
export const handleError = (
  error: unknown,
  context?: string,
  filename?: string
): ErrorInfo => {
  const errorType = parseErrorType(error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // 记录错误到控制台
  console.error(`[${errorType}] ${context || '操作失败'}:`, error);
  
  // 根据错误类型显示对应的通知
  switch (errorType) {
    case ErrorType.FILE_READ:
      notifyFileReadError(filename);
      break;
    case ErrorType.IMAGE_DECODE:
      notifyImageDecodeError(filename);
      break;
    case ErrorType.COMPRESSION:
      notifyCompressionError();
      break;
    case ErrorType.EDIT:
      notifyEditError();
      break;
    case ErrorType.SAVE:
      notifySaveError();
      break;
    case ErrorType.NETWORK:
      notifyNetworkError();
      break;
    case ErrorType.FILE_SELECT:
      notifyFileSelectError();
      break;
    case ErrorType.PATH_SELECT:
      notifySelectPathError();
      break;
    default:
      showError(context || '操作失败，请重试');
  }
  
  return {
    type: errorType,
    message: errorMessage,
    originalError: error,
    filename,
  };
};

/**
 * 处理文件读取错误
 * 需求：16.1
 * @param error 原始错误
 * @param filename 文件名（可选）
 */
export const handleFileReadError = (error: unknown, filename?: string): ErrorInfo => {
  console.error('文件读取失败:', error);
  notifyFileReadError(filename);
  
  return {
    type: ErrorType.FILE_READ,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
    filename,
  };
};

/**
 * 处理图片解码错误
 * 需求：16.2
 * @param error 原始错误
 * @param filename 文件名（可选）
 */
export const handleImageDecodeError = (error: unknown, filename?: string): ErrorInfo => {
  console.error('图片解码失败:', error);
  notifyImageDecodeError(filename);
  
  return {
    type: ErrorType.IMAGE_DECODE,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
    filename,
  };
};

/**
 * 处理压缩错误
 * 需求：16.3
 * @param error 原始错误
 */
export const handleCompressionError = (error: unknown): ErrorInfo => {
  console.error('压缩处理失败:', error);
  notifyCompressionError();
  
  return {
    type: ErrorType.COMPRESSION,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 处理编辑错误
 * @param error 原始错误
 */
export const handleEditError = (error: unknown): ErrorInfo => {
  console.error('编辑处理失败:', error);
  notifyEditError();
  
  return {
    type: ErrorType.EDIT,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 处理保存错误
 * 需求：16.4
 * @param error 原始错误
 */
export const handleSaveError = (error: unknown): ErrorInfo => {
  console.error('保存失败:', error);
  notifySaveError();
  
  return {
    type: ErrorType.SAVE,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 处理网络错误
 * @param error 原始错误
 */
export const handleNetworkError = (error: unknown): ErrorInfo => {
  console.error('网络通信错误:', error);
  notifyNetworkError();
  
  return {
    type: ErrorType.NETWORK,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 处理文件选择错误
 * @param error 原始错误
 */
export const handleFileSelectError = (error: unknown): ErrorInfo => {
  console.error('文件选择失败:', error);
  notifyFileSelectError();
  
  return {
    type: ErrorType.FILE_SELECT,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 处理路径选择错误
 * @param error 原始错误
 */
export const handlePathSelectError = (error: unknown): ErrorInfo => {
  console.error('选择保存路径失败:', error);
  notifySelectPathError();
  
  return {
    type: ErrorType.PATH_SELECT,
    message: error instanceof Error ? error.message : String(error),
    originalError: error,
  };
};

/**
 * 安全执行异步操作
 * @param operation 异步操作函数
 * @param errorContext 错误上下文
 * @returns 操作结果或 null（如果失败）
 */
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  errorContext?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, errorContext);
    return null;
  }
};

/**
 * 检查对话框操作是否被取消
 * 需求：16.5
 * @param result 对话框返回结果
 * @returns 是否被取消
 */
export const isDialogCancelled = (result: unknown): boolean => {
  return result === null || result === undefined || result === '' || 
    (Array.isArray(result) && result.length === 0);
};
