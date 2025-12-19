import { useCallback, useState } from 'react';
import { Button } from './ui/button';
// @ts-ignore - Wails 绑定
import { Compressor } from '../../../frontend/bindings/changeme/compressor';
import { Upload } from 'lucide-react';
const { ReadImageFile, OpenFileDialog, OpenDirectoryDialog } = Compressor;

interface UploaderProps {
  onFileSelect: (files: FileList | null) => void;
  onFilePathsSelect?: (paths: string[]) => void; // Wails 环境下使用
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  selectedFiles?: FileList | null;
  className?: string;
  onTriggerFileSelect?: () => void; // 添加回调函数
}

export default function Uploader({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxFiles,
  selectedFiles,
  className = '',
}: UploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 拖拽暂时不支持，需要通过对话框选择
    alert('请使用文件选择对话框选择文件');
  }, [onFileSelect]);

  const handleFileSelect = async () => {
    try {
      setIsLoading(true);

      // 使用后端对话框选择文件（多选）
      const filePaths = await OpenFileDialog();
      if (!filePaths || (Array.isArray(filePaths) && filePaths.length === 0)) {
        // 用户取消选择
        setIsLoading(false);
        return;
      }

      // 如果返回的是单个路径，转换为数组
      const paths = Array.isArray(filePaths) ? filePaths : [filePaths];

      try {
        // 读取所有选择的文件
        const files: File[] = [];
        for (const filePath of paths) {
          try {
            const base64Data = await ReadImageFile(filePath);
            const fileName = filePath.split('/').pop() || 'image.jpg';

            // 尝试从文件扩展名判断 MIME 类型
            const extension = fileName.split('.').pop()?.toLowerCase();
            const mimeType = getMimeTypeFromExtension(extension || '');

            // 将 base64 转换为 Blob
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            // 创建 File 对象
            const file = new File([blob], fileName, { type: mimeType });
            files.push(file);
          } catch (error) {
            console.error(`读取文件失败: ${filePath}`, error);
          }
        }

        // 创建 FileList 对象
        if (files.length > 0) {
          const dt = new DataTransfer();
          files.forEach(file => dt.items.add(file));
          onFileSelect(dt.files);
        } else {
          alert('没有成功读取任何文件');
        }
      } catch (error) {
        console.error('读取文件失败:', error);
        alert('读取文件失败，请重试');
      }
    } catch (error) {
      console.error('文件选择失败:', error);
      alert('文件选择失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = async () => {
    try {
      setIsLoading(true);

      // 使用后端对话框选择文件夹
      const folderPath = await OpenDirectoryDialog();
      if (!folderPath) {
        // 用户取消选择
        setIsLoading(false);
        return;
      }

      // TODO: 这里需要后端支持读取文件夹中的所有图片文件
      // 目前提示
      alert('文件夹选择功能需要后端支持扫描文件夹中的图片文件');

      setIsLoading(false);
    } catch (error) {
      console.error('文件夹选择失败:', error);
      alert('文件夹选择失败，请重试');
      setIsLoading(false);
    }
  };

  const getMimeTypeFromExtension = (ext: string): string => {
    const lowerExt = ext.toLowerCase();
    switch (lowerExt) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {!selectedFiles || selectedFiles.length === 0 ? (
        // 上传区域
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={!isLoading ? handleFileSelect : undefined}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isLoading
              ? 'border-gray-200 cursor-wait'
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }`}
        >
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-2">正在读取文件...</p>
              </div>
            ) : (
              <>
                
                <div className="space-y-2">
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="ghost"
                    >
                      <Upload size={36}/>
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    支持 {multiple ? '批量选择' : ''}，PNG、JPG、GIF 格式
                    {maxFiles && `，最多 ${maxFiles} 个文件`}
                  </p>
                  <p className="text-xs text-gray-400">
                    或拖拽文件到此处
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // 已选择文件展示
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              已选择 {selectedFiles.length} 个文件
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFileSelect(null)}
            >
              清除
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Array.from(selectedFiles).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {file.type.startsWith('image/') && (
                  <div className="ml-3 flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={!isLoading ? handleFileSelect : undefined}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '读取中...' : '继续添加文件'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
