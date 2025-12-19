import { useState, useRef, useEffect } from 'react';
import DraggableDivider from './DraggableDivider';
import { Badge } from './ui/badge';

interface ImageComparisonProps {
  originalUrl: string | null;
  compressedUrl: string | null;
  scale?: number;
  rotation?: number;
  onScaleChange?: (scale: number) => void;
  onRotationChange?: (rotation: number) => void;
}

export default function ImageComparison({
  originalUrl,
  compressedUrl,
  scale = 1,
  rotation = 0,
  onScaleChange,
  onRotationChange,
}: ImageComparisonProps) {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 滚轮缩放处理
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, scale * delta));
    onScaleChange?.(newScale);
  };

  // 鼠标按下开始拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    // 检查是否点击在分隔线上，如果是则不触发图片拖拽
    const target = e.target as HTMLElement;
    if (target.closest('.draggable-divider') || e.target === containerRef.current?.querySelector('.draggable-divider')) {
      return;
    }

    if (e.button === 0) { // 只响应左键
      setIsDragging(true);
      setDragStart({ x: e.clientX - positionX, y: e.clientY - positionY });
    }
  };

  // 鼠标移动处理拖拽
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // 允许任意拖拽，移除边界限制
      setPositionX(newX);
      setPositionY(newY);
    }
  };

  // 鼠标释放结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 双击重置缩放和位置
  const handleDoubleClick = () => {
    onScaleChange?.(1);
    setPositionX(0);
    setPositionY(0);
  };

  // 添加全局鼠标事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // 允许任意拖拽，移除边界限制
        setPositionX(newX);
        setPositionY(newY);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
    >
      {/* 原图（左侧） */}
      {originalUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{
            clipPath: `inset(0 ${100 - dividerPosition}% 0 0)`,
          }}
        >
          <div
            style={{
              transform: `translate(${positionX}px, ${positionY}px) scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="outline">原图</Badge>
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
          <div
            style={{
              transform: `translate(${positionX}px, ${positionY}px) scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <img
              src={compressedUrl}
              alt="Compressed"
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="default">压缩后</Badge>
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <DraggableDivider onPositionChange={setDividerPosition} defaultPosition={50} />
    </div>
  );
}
