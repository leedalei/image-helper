import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

function Settings() {
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [autoSave, setAutoSave] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    // TODO: 实现保存设置逻辑
    console.log('Settings saved:', {
      quality,
      maxWidth,
      maxHeight,
      autoSave,
    });
    alert('设置已保存！');
  };

  const handleReset = () => {
    setQuality(80);
    setMaxWidth(1920);
    setMaxHeight(1080);
    setAutoSave(true);
    alert('设置已重置！');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">设置</h1>
          <p className="text-gray-600 mt-1">
            自定义应用程序的偏好设置
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          {/* 图片质量设置 */}
          <Card>
            <CardHeader>
              <CardTitle>图片质量</CardTitle>
              <CardDescription>
                设置默认的图片质量和尺寸限制
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  默认质量: {quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>低质量</span>
                  <span>高质量</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大宽度 (px)
                  </label>
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    最大高度 (px)
                  </label>
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 偏好设置 */}
          <Card>
            <CardHeader>
              <CardTitle>偏好设置</CardTitle>
              <CardDescription>
                应用程序的行为偏好
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">自动保存</h3>
                  <p className="text-sm text-gray-500">
                    编辑时自动保存更改
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">显示高级选项</h3>
                  <p className="text-sm text-gray-500">
                    显示更多编辑选项
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 快捷键设置 */}
          <Card>
            <CardHeader>
              <CardTitle>快捷键</CardTitle>
              <CardDescription>
                查看和自定义键盘快捷键
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">保存</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                    Ctrl + S
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">撤销</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                    Ctrl + Z
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">重做</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                    Ctrl + Y
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">旋转</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                    R
                  </kbd>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                自定义快捷键
              </Button>
            </CardContent>
          </Card>

          {/* 存储设置 */}
          <Card>
            <CardHeader>
              <CardTitle>存储</CardTitle>
              <CardDescription>
                管理缓存和临时文件
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">缓存使用量</span>
                  <span className="text-sm text-gray-600">24.5 MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  清理缓存
                </Button>
                <Button variant="outline">
                  导出设置
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 关于 */}
          <Card>
            <CardHeader>
              <CardTitle>关于</CardTitle>
              <CardDescription>
                应用程序版本信息
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">版本</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">构建日期</span>
                <span className="text-sm font-medium text-gray-900">2025-12-11</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">许可证</span>
                <span className="text-sm font-medium text-gray-900">MIT</span>
              </div>
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex space-x-3 pb-6">
            <Button onClick={handleSave} className="flex-1">
              保存设置
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              重置为默认
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
