import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SidebarItem {
  title: string;
  path: string;
  icon?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: '图片编辑',
    path: '/edit',
  },
  {
    title: '图片压缩',
    path: '/compress',
  },
  {
    title: '格式转换',
    path: '/convert',
  },
  {
    title: '设置',
    path: '/settings',
  },
  {
    title: '关于',
    path: '/about',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">Image Helper</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500 text-center">
          Image Helper v1.0.0
        </p>
      </div>
    </div>
  );
}
