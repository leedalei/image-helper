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
import { EditorSettings as EditorSettingsType } from '../store/useStore';

interface EditorSettingsProps {
  settings: EditorSettingsType;
  onApply?: (settings: EditorSettingsType) => void;
  onReset?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChangeSavePath?: (path: string) => void;
}

/**
 * 编辑设置面板组件
 * 
 * 实现尺寸调整、水印、旋转等设置
 * 需求：20.1-20.9, 21.1-21.11, 22.1-22.6
 */
export default function EditorSettings({
  settings,
  onApply,
  onReset,
  open,
  onOpenChange,
  onChangeSavePath
}: EditorSettingsProps) {
  // 内部维护表单状态
  const [localSettings, setLocalSettings] = useState<EditorSettingsType>(settings);

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

        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑设置</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4">
            {/* 尺寸调整 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                尺寸调整
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">宽度</label>
                  <Input
                    type="number"
                    placeholder="自动"
                    value={localSettings.targetWidth || ''}
                    onChange={(e) => {
                      const newWidth = Number(e.target.value) || 0;
                      setLocalSettings(prev => ({ ...prev, targetWidth: newWidth }));
                    }}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500">高度</label>
                  <Input
                    type="number"
                    placeholder="自动"
                    value={localSettings.targetHeight || ''}
                    onChange={(e) => {
                      const newHeight = Number(e.target.value) || 0;
                      setLocalSettings(prev => ({ ...prev, targetHeight: newHeight }));
                    }}
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
            </div>

            {/* 旋转设置 */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">
                旋转角度
              </label>
              <div className="flex items-center gap-2">
                <Select 
                  value={String(localSettings.rotationAngle)} 
                  onValueChange={(value) => setLocalSettings(prev => ({ ...prev, rotationAngle: Number(value) }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="选择角度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">不旋转</SelectItem>
                    <SelectItem value="90">顺时针 90°</SelectItem>
                    <SelectItem value="180">180°</SelectItem>
                    <SelectItem value="270">逆时针 90°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 水印设置 */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">
                水印设置
              </label>
              
              {/* 水印类型 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">水印类型</span>
                <Select 
                  value={localSettings.watermarkType} 
                  onValueChange={(value: 'none' | 'image' | 'text') => setLocalSettings(prev => ({ ...prev, watermarkType: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无水印</SelectItem>
                    <SelectItem value="text">文本水印</SelectItem>
                    <SelectItem value="image">图片水印</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 文本水印设置 */}
              {localSettings.watermarkType === 'text' && (
                <div className="space-y-3 pl-2 border-l-2 border-blue-200">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">水印文本</label>
                    <Input
                      type="text"
                      placeholder="输入水印文本"
                      value={localSettings.watermarkText}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, watermarkText: e.target.value }))}
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-500">透明度</label>
                      <span className="text-xs text-blue-600">{localSettings.watermarkOpacity}%</span>
                    </div>
                    <Slider
                      value={[localSettings.watermarkOpacity]}
                      onValueChange={(value) => setLocalSettings(prev => ({ ...prev, watermarkOpacity: value[0] }))}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">位置</span>
                    <Select 
                      value={localSettings.watermarkPosition} 
                      onValueChange={(value: any) => setLocalSettings(prev => ({ ...prev, watermarkPosition: value }))}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue placeholder="选择位置" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">左上</SelectItem>
                        <SelectItem value="top-right">右上</SelectItem>
                        <SelectItem value="bottom-left">左下</SelectItem>
                        <SelectItem value="bottom-right">右下</SelectItem>
                        <SelectItem value="center">居中</SelectItem>
                        <SelectItem value="tile">平铺</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {localSettings.watermarkPosition === 'tile' && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">密度</span>
                      <Select 
                        value={localSettings.watermarkDensity} 
                        onValueChange={(value: any) => setLocalSettings(prev => ({ ...prev, watermarkDensity: value }))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="选择密度" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sparse">稀疏</SelectItem>
                          <SelectItem value="medium">适中</SelectItem>
                          <SelectItem value="dense">密集</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">字体大小</label>
                      <Input
                        type="number"
                        value={localSettings.watermarkFontSize}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, watermarkFontSize: Number(e.target.value) || 24 }))}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500">字体颜色</label>
                      <Input
                        type="color"
                        value={localSettings.watermarkFontColor}
                        onChange={(e) => setLocalSettings(prev => ({ ...prev, watermarkFontColor: e.target.value }))}
                        className="h-8 p-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">字体样式</span>
                    <Select 
                      value={localSettings.watermarkFontStyle} 
                      onValueChange={(value: any) => setLocalSettings(prev => ({ ...prev, watermarkFontStyle: value }))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="选择样式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">正常</SelectItem>
                        <SelectItem value="bold">粗体</SelectItem>
                        <SelectItem value="italic">斜体</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* 图片水印设置 - 暂不支持 */}
              {localSettings.watermarkType === 'image' && (
                <div className="p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                  图片水印功能暂未实现，请使用文本水印。
                </div>
              )}
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

            {/* 操作按钮 */}
            <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-200">
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
