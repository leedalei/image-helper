/**
 * Toast 通知工具函数
 * 
 * 提供统一的用户反馈通知接口
 * 需求：14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7
 */
import { toast as sonnerToast } from 'sonner';

/**
 * Toast 通知类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

/**
 * Toast 配置选项
 */
export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 显示成功通知
 * @param message 通知消息
 * @param options 配置选项
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
  return sonnerToast.success(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 显示错误通知
 * @param message 通知消息
 * @param options 配置选项
 */
export const showError = (message: string, options?: ToastOptions) => {
  return sonnerToast.error(message, {
    duration: options?.duration ?? 5000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 显示信息通知
 * @param message 通知消息
 * @param options 配置选项
 */
export const showInfo = (message: string, options?: ToastOptions) => {
  return sonnerToast.info(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 显示警告通知
 * @param message 通知消息
 * @param options 配置选项
 */
export const showWarning = (message: string, options?: ToastOptions) => {
  return sonnerToast.warning(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 显示加载通知
 * @param message 通知消息
 * @returns toast ID，用于后续更新或关闭
 */
export const showLoading = (message: string) => {
  return sonnerToast.loading(message);
};

/**
 * 关闭指定的通知
 * @param toastId toast ID
 */
export const dismissToast = (toastId: string | number) => {
  sonnerToast.dismiss(toastId);
};

/**
 * 关闭所有通知
 */
export const dismissAllToasts = () => {
  sonnerToast.dismiss();
};

// ============ 业务相关的通知函数 ============

/**
 * 设置已更新通知
 * 需求：14.1
 */
export const notifySettingsUpdated = () => {
  showSuccess('设置已更新');
};

/**
 * 设置已重置通知
 * 需求：14.2
 */
export const notifySettingsReset = () => {
  showSuccess('设置已重置');
};

/**
 * 保存路径已更新通知
 * 需求：14.3
 */
export const notifySavePathUpdated = () => {
  showSuccess('保存路径已更新');
};

/**
 * 批量压缩完成通知
 * 需求：14.4
 * @param successCount 成功数量
 * @param failedCount 失败数量
 */
export const notifyBatchCompressionComplete = (successCount: number, failedCount: number) => {
  if (failedCount === 0) {
    showSuccess(`批量压缩完成！成功处理 ${successCount} 张图片`);
  } else {
    showWarning(`批量压缩完成！成功: ${successCount}, 失败: ${failedCount}`);
  }
};

/**
 * 批量编辑完成通知
 * 需求：14.4
 * @param successCount 成功数量
 * @param failedCount 失败数量
 */
export const notifyBatchEditComplete = (successCount: number, failedCount: number) => {
  if (failedCount === 0) {
    showSuccess(`批量编辑完成！成功处理 ${successCount} 张图片`);
  } else {
    showWarning(`批量编辑完成！成功: ${successCount}, 失败: ${failedCount}`);
  }
};

/**
 * 图片保存成功通知
 * 需求：14.5
 * @param filePath 保存路径
 */
export const notifyImageSaved = (filePath: string) => {
  showSuccess(`图片已保存到: ${filePath}`);
};

/**
 * ZIP文件保存成功通知
 * @param filePath 保存路径
 */
export const notifyZipSaved = (filePath: string) => {
  showSuccess(`ZIP文件已保存到: ${filePath}`);
};

/**
 * 操作失败通知
 * 需求：14.6
 * @param message 错误消息
 */
export const notifyOperationFailed = (message: string) => {
  showError(message);
};

/**
 * 未配置保存目录通知
 * 需求：14.7
 */
export const notifySavePathRequired = () => {
  showError('请先在设置中配置保存目录');
};

/**
 * 文件读取失败通知
 * 需求：16.1
 * @param filename 文件名（可选）
 */
export const notifyFileReadError = (filename?: string) => {
  const message = filename 
    ? `读取文件失败: ${filename}` 
    : '读取文件失败，请重试';
  showError(message);
};

/**
 * 图片解码失败通知
 * 需求：16.2
 * @param filename 文件名（可选）
 */
export const notifyImageDecodeError = (filename?: string) => {
  const message = filename 
    ? `图片解码失败: ${filename}` 
    : '图片解码失败，请检查文件格式';
  showError(message);
};

/**
 * 压缩处理失败通知
 * 需求：16.3
 */
export const notifyCompressionError = () => {
  showError('压缩处理失败，请重试');
};

/**
 * 编辑处理失败通知
 */
export const notifyEditError = () => {
  showError('编辑处理失败，请重试');
};

/**
 * 文件保存失败通知
 * 需求：16.4
 */
export const notifySaveError = () => {
  showError('保存失败，请重试');
};

/**
 * 网络通信错误通知
 */
export const notifyNetworkError = () => {
  showError('网络通信错误，请检查连接后重试');
};

/**
 * 文件选择失败通知
 */
export const notifyFileSelectError = () => {
  showError('文件选择失败，请重试');
};

/**
 * 选择保存路径失败通知
 */
export const notifySelectPathError = () => {
  showError('选择保存路径失败，请重试');
};

/**
 * 没有可保存的数据通知
 */
export const notifyNoDataToSave = () => {
  showError('没有可保存的数据');
};

/**
 * 请先选择图片通知
 */
export const notifySelectImageFirst = () => {
  showInfo('请先选择图片');
};

/**
 * 配置保存目录提示
 */
export const notifyConfigureSavePath = () => {
  showInfo('请在设置中配置保存目录');
};

// 导出默认的 toast 对象，以便直接使用
export { sonnerToast as toast };
