import { useState } from 'react';
import DraggableDivider from './DraggableDivider';

interface ImageComparisonProps {
  originalUrl: string | null;
  compressedUrl: string | null;
}

export default function ImageComparison({
  originalUrl,
  compressedUrl,
}: ImageComparisonProps) {
  const [dividerPosition, setDividerPosition] = useState(50);

  return (
    <div className="relative w-full h-full">
      {/* 原图（左侧） */}
      {originalUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{
            clipPath: `inset(0 ${100 - dividerPosition}% 0 0)`,
          }}
        >
          <img
            src={originalUrl}
            alt="Original"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded">
            原图
          </div>
        </div>
      )}

      {/* 压缩图（右侧） */}
      {compressedUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{
            clipPath: `inset(0 0 0 ${dividerPosition}%)`,
          }}
        >
          <img
            src={compressedUrl}
            alt="Compressed"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-sm rounded">
            压缩后
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <DraggableDivider onPositionChange={setDividerPosition} defaultPosition={50} />
    </div>
  );
}
