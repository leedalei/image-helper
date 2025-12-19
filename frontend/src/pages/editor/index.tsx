import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload } from 'lucide-react';

function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRotate = () => {
    // TODO: 实现旋转功能
    console.log('Rotate image');
  };

  const handleResize = () => {
    // TODO: 实现调整大小功能
    console.log('Resize image');
  };

  const handleCrop = () => {
    // TODO: 实现裁剪功能
    console.log('Crop image');
  };

  const handleFlip = () => {
    // TODO: 实现翻转功能
    console.log('Flip image');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">图片编辑</h1>
          <p className="text-gray-600 mt-1">
            上传并编辑您的图片
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 图片上传区域 */}
          <Card>
            <CardHeader>
              <CardTitle>上传图片</CardTitle>
              <CardDescription>
                选择要编辑的图片文件
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload />
                    <div className="text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        点击上传
                      </span>{' '}
                      或拖拽图片到此处
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 编辑工具栏 */}
          <Card>
            <CardHeader>
              <CardTitle>编辑工具</CardTitle>
              <CardDescription>
                选择编辑操作
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleRotate}
                  disabled={!selectedImage}
                  className="h-20 flex-col"
                >
                  <span className="text-2xl mb-1">🔄</span>
                  旋转
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResize}
                  disabled={!selectedImage}
                  className="h-20 flex-col"
                >
                  <span className="text-2xl mb-1">📏</span>
                  调整大小
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCrop}
                  disabled={!selectedImage}
                  className="h-20 flex-col"
                >
                  <span className="text-2xl mb-1">✂️</span>
                  裁剪
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFlip}
                  disabled={!selectedImage}
                  className="h-20 flex-col"
                >
                  <span className="text-2xl mb-1">↔️</span>
                  翻转
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 图片预览 */}
          {previewUrl && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>预览</CardTitle>
                <CardDescription>
                  编辑后的图片预览
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 flex justify-center space-x-3">
                  <Button>保存更改</Button>
                  <Button variant="outline">重置</Button>
                  <Button variant="secondary">下载</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageEditor;
