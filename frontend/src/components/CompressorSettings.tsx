import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Bolt } from 'lucide-react';

interface CompressorSettingsType {
  quality: number;
  format: string;
  targetWidth: number;
  targetHeight: number;
  keepAspectRatio: boolean;
  progressive: boolean;
  optimize: boolean;
  batchSavePath: string;
}

interface CompressorSettingsProps {
  settings: CompressorSettingsType;
  onApply?: (settings: CompressorSettingsType) => void;
  onReset?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChangeSavePath?: (path: string) => void;
}

export default function CompressorSettings({
  settings,
  onApply,
  onReset,
  open,
  onOpenChange,
  onChangeSavePath
}: CompressorSettingsProps) {

  // 内部维护表单状态
  const [localSettings, setLocalSettings] = useState<CompressorSettingsType>(settings);

  // 当 props 变化时更新本地状态
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => { onOpenChange?.(open); }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-20 rounded-full shadow-lg"
          >
            <Bolt />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>压缩设置</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4 overflow-y-auto">
            {/* 压缩质量 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  压缩质量
                </label>
                <span className="text-sm font-semibold text-blue-600">
                  {localSettings.quality}%
                </span>
              </div>
              <Slider
                value={[localSettings.quality]}
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, quality: value[0] }))}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>文件更小</span>
                <span>质量更高</span>
              </div>
            </div>

            {/* 目标尺寸 */}
            {/* <div className="space-y-3 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">
                目标尺寸
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">宽度</label>
                  <Input
                    type="number"
                    placeholder="自动"
                    value={localSettings.targetWidth || ''}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, targetWidth: Number(e.target.value) || 0 }))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">高度</label>
                  <Input
                    type="number"
                    placeholder="自动"
                    value={localSettings.targetHeight || ''}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, targetHeight: Number(e.target.value) || 0 }))}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">保持宽高比</span>
                <Switch
                  checked={localSettings.keepAspectRatio}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, keepAspectRatio: checked }))}
                />
              </div>
            </div> */}

            {/* 保存格式 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                保存格式
              </label>
              <Select value={localSettings.format} onValueChange={(value) => setLocalSettings(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">保持原格式</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 高级选项 */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">
                高级选项
              </label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-gray-700">渐进式编码</span>
                  <p className="text-xs text-gray-500">提高加载体验</p>
                </div>
                <Switch
                  checked={localSettings.progressive}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, progressive: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-gray-700">优化编码</span>
                  <p className="text-xs text-gray-500">更好的压缩效果</p>
                </div>
                <Switch
                  checked={localSettings.optimize}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, optimize: checked }))}
                />
              </div>
            </div>

            {/* 批量保存路径 */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2">
                批量保存路径
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={localSettings.batchSavePath || ''}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, batchSavePath: e.target.value }))}
                    placeholder="选择保存目录"
                    className="flex-1 text-sm"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onChangeSavePath) {
                        onChangeSavePath(localSettings.batchSavePath);
                      }
                    }}
                    className="shrink-0"
                  >
                    更改
                  </Button>
                </div>
              </div>
            </div>

            {/* 格式说明 */}
            <div className="p-3 bg-gray-50 rounded-lg text-xs">
              <p className="text-gray-600 mb-2 font-medium">格式说明：</p>
              <ul className="text-gray-500 space-y-1">
                <li>• <strong>JPEG:</strong> 适合照片，有损压缩</li>
                <li>• <strong>PNG:</strong> 支持透明，无损压缩</li>
                <li>• <strong>WebP:</strong> 现代格式，高压缩率</li>
              </ul>
            </div>

            {/* 压缩预估 */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-900 mb-1">
                压缩预估
              </p>
              <p className="text-xs text-blue-700">
                质量 {localSettings.quality}% 预计可压缩至原大小的{' '}
                <span className="font-semibold">
                  {Math.max(20, Math.min(95, 100 - localSettings.quality / 2))}%
                </span>
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 justify-end mt-2 ">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onReset?.();
                    onOpenChange?.(false);
                  }}
                  className="flex-1"
                >
                  重置
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onApply?.(localSettings);
                    onOpenChange?.(false);
                  }}
                  className="flex-1"
                >
                  应用
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
