import { useCallback } from 'react';
import { Button } from './ui/button';

interface UploaderProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  selectedFiles?: FileList | null;
  className?: string;
}

export default function Uploader({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxFiles,
  selectedFiles,
  className = '',
}: UploaderProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(e.dataTransfer.files);
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
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
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  点击选择文件
                </span>{' '}
                或拖拽文件 </div>
             到此处
              <p className="text-xs text-gray-500">
                支持 {multiple ? '批量选择' : ''}，PNG、JPG、GIF 格式
                {maxFiles && `，最多 ${maxFiles} 个文件`}
              </p>
            </div>
          </label>
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
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full"
            >
              继续添加文件
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
