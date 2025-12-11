import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Uploader from '../../components/Uploader';
import ImageComparison from '../../components/ImageComparison';
import CompressorSettings from '../../components/CompressorSettings';

function ImageCompressor() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('original');

  const currentFile = selectedFiles?.[0] || null;
  const originalImageUrl = useMemo(() => {
    if (!currentFile) return null;
    return URL.createObjectURL(currentFile);
  }, [currentFile]);

  // 模拟压缩函数
  const compressImage = (
    file: File,
    targetQuality: number,
    targetFormat: string
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);

        // 模拟压缩（实际项目中这里会使用 canvas.toBlob）
        const mimeType =
          targetFormat === 'original'
            ? file.type
            : `image/${targetFormat === 'jpeg' ? 'jpeg' : targetFormat}`;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            }
          },
          mimeType,
          targetQuality / 100
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const compressedImageUrl = useMemo(() => {
    if (!compressedBlob) return null;
    return URL.createObjectURL(compressedBlob);
  }, [compressedBlob]);

  // 当文件或设置变化时，重新压缩
  useMemo(() => {
    if (currentFile) {
      compressImage(currentFile, quality, format).then((blob) => {
        setCompressedBlob(blob);
      });
    }
  }, [currentFile, quality, format]);

  const handleDownload = () => {
    if (!compressedBlob || !currentFile) return;

    const link = document.createElement('a');
    link.href = compressedImageUrl!;
    const extension = format === 'original'
      ? currentFile.name.split('.').pop()
      : format;
    link.download = `${currentFile.name.split('.')[0]}_compressed.${extension}`;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const compressionRatio = compressedBlob
    ? Math.round((1 - compressedBlob.size / currentFile!.size) * 100)
    : 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">图片压缩</h1>
          <p className="text-gray-600 mt-1">
            实时预览压缩效果，拖拽分割线查看对比
          </p>
        </div>

        {!currentFile ? (
          // 文件选择器
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>选择图片</CardTitle>
              </CardHeader>
              <CardContent>
                <Uploader
                  onFileSelect={setSelectedFiles}
                  accept="image/*"
                  selectedFiles={selectedFiles}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          // 图片对比预览
          <div className="space-y-6">
            {/* 文件信息 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{currentFile.name}</p>
                    <p className="text-sm text-gray-500">
                      原大小: {formatFileSize(currentFile.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">压缩后</p>
                      <p className="font-semibold text-gray-900">
                        {compressedBlob ? formatFileSize(compressedBlob.size) : '-'}
                      </p>
                    </div>
                    {compressedBlob && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">节省</p>
                        <p className="font-semibold text-green-600">
                          {compressionRatio}%
                        </p>
                      </div>
                    )}
                    <Button variant="outline" onClick={() => setSelectedFiles(null)}>
                      重新选择
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 图片对比区域 */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                  <ImageComparison
                    originalUrl={originalImageUrl}
                    compressedUrl={compressedImageUrl}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4">
              <Button onClick={handleDownload} className="px-8">
                下载压缩后的图片
              </Button>
              <Button variant="outline" onClick={() => setSelectedFiles(null)}>
                压缩其他图片
              </Button>
            </div>
          </div>
        )}

        {/* 悬浮设置面板 */}
        {currentFile && (
          <CompressorSettings
            quality={quality}
            format={format}
            onQualityChange={setQuality}
            onFormatChange={setFormat}
          />
        )}
      </div>
    </div>
  );
}

export default ImageCompressor;
