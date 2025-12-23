import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cn } from '../lib/utils';
import { navRoutes } from '../config/routes';
import { useStore } from '../store/useStore';

/**
 * Navigation 组件
 * 
 * 显示应用的导航菜单，包含三个菜单项：图片编辑、图片压缩、关于
 * 实现菜单高亮逻辑，当前活动的菜单项会被高亮显示
 * 
 * 需求：1.1, 1.2, 1.3, 1.4, 1.9
 */
export default function Navigation() {
  const location = useLocation();
  const setCurrentRoute = useStore((state) => state.setCurrentRoute);

  // 当路由变化时，更新 store 中的当前路由
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location.pathname, setCurrentRoute]);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-xl font-bold text-gray-900">大雷图片压缩器</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          const Icon = route.icon;
          
          return (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive ? 'text-blue-700' : 'text-gray-500'
              )} />
              {route.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500 text-center">
          大雷图片压缩器 v1.0.0
        </p>
      </div>
    </div>
  );
}
