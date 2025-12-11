import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';

interface CompressorSettingsProps {
  quality: number;
  format: string;
  onQualityChange: (quality: number) => void;
  onFormatChange: (format: string) => void;
}

export default function CompressorSettings({
  quality,
  format,
  onQualityChange,
  onFormatChange,
}: CompressorSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 悬浮设置按钮 */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-20 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Button>

      {/* 悬浮设置面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* 设置面板 */}
          <Card className="fixed bottom-20 right-6 z-30 w-80 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">压缩设置</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 压缩质量 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    压缩质量
                  </label>
                  <span className="text-sm font-semibold text-blue-600">
                    {quality}%
                  </span>
                </div>
                <Slider
                  value={[quality]}
                  onValueChange={(value) => onQualityChange(value[0])}
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

              {/* 保存格式 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  保存格式
                </label>
                <Select value={format} onValueChange={onFormatChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">保持原格式</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 格式说明 */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">格式说明：</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• <strong>JPEG:</strong> 适合照片，有损压缩</li>
                  <li>• <strong>PNG:</strong> 支持透明，无损压缩</li>
                  <li>• <strong>WebP:</strong> 现代格式，高压缩率</li>
                  <li>• <strong>AVIF:</strong> 最新格式，极高压缩率</li>
                </ul>
              </div>

              {/* 压缩预估 */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  压缩预估
                </p>
                <p className="text-xs text-blue-700">
                  质量 {quality}% 预计可压缩至原大小的{' '}
                  <span className="font-semibold">
                    {Math.max(20, Math.min(95, 100 - quality / 2))}%
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
