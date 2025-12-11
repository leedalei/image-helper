import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧固定 Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* 右侧可滚动内容区 */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
