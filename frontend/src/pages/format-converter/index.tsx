import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const formats = [
  { value: 'jpeg', label: 'JPEG', extension: '.jpg' },
  { value: 'png', label: 'PNG', extension: '.png' },
  { value: 'webp', label: 'WebP', extension: '.webp' },
  { value: 'gif', label: 'GIF', extension: '.gif' },
  { value: 'bmp', label: 'BMP', extension: '.bmp' },
  { value: 'tiff', label: 'TIFF', extension: '.tiff' },
];

function FormatConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [convertedImage, setConvertedImage] = useState<{
    url: string;
    format: string;
    size: number;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedImage(null);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    // TODO: 实现实际格式转换逻辑
    // 这里只是模拟转换结果
    const url = URL.createObjectURL(selectedFile);
    setConvertedImage({
      url,
      format: targetFormat.toUpperCase(),
      size: selectedFile.size * 0.8, // 模拟转换后的大小
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.href = convertedImage.url;
    link.download = `${selectedFile?.name.split('.')[0]}.${targetFormat}`;
    link.click();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">格式转换</h1>
          <p className="text-gray-600 mt-1">
            在不同图片格式之间进行转换
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 文件上传和格式选择 */}
          <Card>
            <CardHeader>
              <CardTitle>上传图片</CardTitle>
              <CardDescription>
                选择要转换格式的图片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="convert-upload"
                />
                <label htmlFor="convert-upload" className="cursor-pointer">
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
                        点击上传
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">原始文件</h3>
                  <p className="text-sm text-gray-600 mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标格式
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {formats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleConvert}
                disabled={!selectedFile}
                className="w-full"
              >
                开始转换
              </Button>
            </CardContent>
          </Card>

          {/* 转换结果 */}
          <Card>
            <CardHeader>
              <CardTitle>转换结果</CardTitle>
              <CardDescription>
                转换后的图片预览
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!convertedImage ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">请上传图片并选择目标格式</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={convertedImage.url}
                      alt="Converted"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">转换后</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      格式: {convertedImage.format}
                    </p>
                    <p className="text-sm text-gray-500">
                      大小: {formatFileSize(convertedImage.size)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={handleDownload} className="w-full">
                      下载转换后的图片
                    </Button>
                    <Button variant="outline" className="w-full">
                      转换为其他格式
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 格式说明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>支持的格式</CardTitle>
            <CardDescription>各图片格式的特点</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formats.map((format) => (
                <div key={format.value} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {format.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{format.extension}</p>
                  <p className="text-xs text-gray-500">
                    {format.value === 'jpeg' && '有损压缩，适合照片'}
                    {format.value === 'png' && '无损压缩，支持透明度'}
                    {format.value === 'webp' && '现代格式，高压缩率'}
                    {format.value === 'gif' && '支持动画'}
                    {format.value === 'bmp' && 'Windows位图格式'}
                    {format.value === 'tiff' && '高质量无损格式'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FormatConverter;
