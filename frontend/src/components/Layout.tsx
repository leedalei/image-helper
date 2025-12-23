import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧固定导航栏 */}
      <div className="flex-shrink-0">
        <Navigation />
      </div>

      {/* 右侧可滚动内容区 */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
