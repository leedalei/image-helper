import { useState, useRef, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, RotateCcwSquare, RotateCwSquare } from 'lucide-react';

interface ImageEditPreviewProps {
  originalUrl: string | null;
  editedUrl: string | null;
  originalScale?: number;
  previewScale?: number;
  rotation?: number;
  onOriginalScaleChange?: (scale: number) => void;
  onPreviewScaleChange?: (scale: number) => void;
  onPreviewRotate?: (isClockwise: boolean) => void;
}

/**
 * 图片编辑预览组件
 * 
 * 左右两个独立容器分别显示原始图片和编辑后图片
 * 支持独立缩放和旋转
 * 需求：22.7, 22.8, 22.9, 22.10, 22.11, 22.12, 22.13, 22.14, 22.15, 22.16
 */
export default function ImageEditPreview({
  originalUrl,
  editedUrl,
  originalScale = 1,
  previewScale = 1,
  rotation = 0,
  onOriginalScaleChange,
  onPreviewScaleChange,
  onPreviewRotate,
}: ImageEditPreviewProps) {
  // 原图拖拽状态
  const [originalPositionX, setOriginalPositionX] = useState(0);
  const [originalPositionY, setOriginalPositionY] = useState(0);
  const [isOriginalDragging, setIsOriginalDragging] = useState(false);
  const [originalDragStart, setOriginalDragStart] = useState({ x: 0, y: 0 });

  // 预览图拖拽状态
  const [previewPositionX, setPreviewPositionX] = useState(0);
  const [previewPositionY, setPreviewPositionY] = useState(0);
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [previewDragStart, setPreviewDragStart] = useState({ x: 0, y: 0 });

  const originalContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // 原图滚轮缩放处理
  const handleOriginalWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, originalScale * delta));
    onOriginalScaleChange?.(newScale);
  };

  // 预览图滚轮缩放处理
  const handlePreviewWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(3, previewScale * delta));
    onPreviewScaleChange?.(newScale);
  };

  // 原图鼠标按下开始拖拽
  const handleOriginalMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsOriginalDragging(true);
      setOriginalDragStart({ x: e.clientX - originalPositionX, y: e.clientY - originalPositionY });
    }
  };

  // 预览图鼠标按下开始拖拽
  const handlePreviewMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPreviewDragging(true);
      setPreviewDragStart({ x: e.clientX - previewPositionX, y: e.clientY - previewPositionY });
    }
  };

  // 原图双击重置
  const handleOriginalDoubleClick = () => {
    onOriginalScaleChange?.(1);
    setOriginalPositionX(0);
    setOriginalPositionY(0);
  };

  // 预览图双击重置
  const handlePreviewDoubleClick = () => {
    onPreviewScaleChange?.(1);
    setPreviewPositionX(0);
    setPreviewPositionY(0);
  };

  // 原图放大
  const handleOriginalZoomIn = () => {
    const newScale = Math.min(originalScale + 0.1, 3);
    onOriginalScaleChange?.(newScale);
  };

  // 原图缩小
  const handleOriginalZoomOut = () => {
    const newScale = Math.max(originalScale - 0.1, 0.5);
    onOriginalScaleChange?.(newScale);
  };

  // 预览图放大
  const handlePreviewZoomIn = () => {
    const newScale = Math.min(previewScale + 0.1, 3);
    onPreviewScaleChange?.(newScale);
  };

  // 预览图缩小
  const handlePreviewZoomOut = () => {
    const newScale = Math.max(previewScale - 0.1, 0.5);
    onPreviewScaleChange?.(newScale);
  };

  // 预览图逆时针旋转
  const handlePreviewRotateCcw = () => {
    onPreviewRotate?.(false);
  };

  // 预览图顺时针旋转
  const handlePreviewRotateCw = () => {
    onPreviewRotate?.(true);
  };

  // 添加全局鼠标事件监听器
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isOriginalDragging) {
        const newX = e.clientX - originalDragStart.x;
        const newY = e.clientY - originalDragStart.y;
        setOriginalPositionX(newX);
        setOriginalPositionY(newY);
      }
      if (isPreviewDragging) {
        const newX = e.clientX - previewDragStart.x;
        const newY = e.clientY - previewDragStart.y;
        setPreviewPositionX(newX);
        setPreviewPositionY(newY);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsOriginalDragging(false);
      setIsPreviewDragging(false);
    };

    if (isOriginalDragging || isPreviewDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isOriginalDragging, isPreviewDragging, originalDragStart, previewDragStart]);

  const originalImageStyle = {
    transform: `translate(${originalPositionX}px, ${originalPositionY}px) scale(${originalScale})`,
    transformOrigin: 'center center',
  };

  const previewImageStyle = {
    transform: `translate(${previewPositionX}px, ${previewPositionY}px) scale(${previewScale}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
  };

  return (
    <div className="relative w-full h-full flex">
      {/* 左侧：原图 */}
      <div
        ref={originalContainerRef}
        className="flex-1 flex items-center justify-center bg-gray-100 border-r border-gray-300 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleOriginalWheel}
        onMouseDown={handleOriginalMouseDown}
        onDoubleClick={handleOriginalDoubleClick}
      >
        {originalUrl ? (
          <div style={originalImageStyle}>
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-gray-400">无原图</div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline">原图</Badge>
        </div>
        
        {/* 原图悬浮操作栏：仅包含放大、缩小按钮 */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg px-2 py-1 flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="放大" onClick={handleOriginalZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="缩小" onClick={handleOriginalZoomOut}>
            <ZoomOut size={16} />
          </Button>
        </div>
      </div>

      {/* 右侧：编辑后 */}
      <div
        ref={previewContainerRef}
        className="flex-1 flex items-center justify-center bg-gray-100 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handlePreviewWheel}
        onMouseDown={handlePreviewMouseDown}
        onDoubleClick={handlePreviewDoubleClick}
      >
        {editedUrl ? (
          <div style={previewImageStyle}>
            <img
              src={editedUrl}
              alt="Edited"
              className="max-w-full max-h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="text-gray-400">编辑预览</div>
        )}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="default">编辑后</Badge>
        </div>
        
        {/* 预览图悬浮操作栏：包含放大、缩小、向左旋转、向右旋转按钮 */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg px-2 py-1 flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="放大" onClick={handlePreviewZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="缩小" onClick={handlePreviewZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="逆时针旋转90°" onClick={handlePreviewRotateCcw}>
            <RotateCcwSquare size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="顺时针旋转90°" onClick={handlePreviewRotateCw}>
            <RotateCwSquare size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
