import { useState, useRef, useEffect } from 'react';

interface DraggableDividerProps {
  onPositionChange?: (position: number) => void;
  defaultPosition?: number; // 0-100, 默认50
}

export default function DraggableDivider({
  onPositionChange,
  defaultPosition = 50,
}: DraggableDividerProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡，避免与图片拖拽冲突
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setPosition(clampedPercentage);
    onPositionChange?.(clampedPercentage);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* 分隔线 */}
      <div
        className={`draggable-divider absolute top-0 bottom-0 w-1 bg-gray-300 hover:bg-gray-400 transition-colors cursor-col-resize z-10 ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
      >
        {/* 手柄 */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full shadow-md flex items-center justify-center transition-all ${
            isDragging ? 'border-blue-500 shadow-lg scale-110' : 'hover:border-gray-400'
          }`}
        >
          <div className="flex space-x-1">
            <div className="w-0.5 h-3 bg-gray-400"></div>
            <div className="w-0.5 h-3 bg-gray-400"></div>
            <div className="w-0.5 h-3 bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
