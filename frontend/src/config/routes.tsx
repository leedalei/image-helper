import { lazy } from 'react';
import { ImageIcon, FolderArchive, Info } from 'lucide-react';

// 使用 React.lazy 进行代码分割
const ImageEditor = lazy(() => import('@/pages/editor'));
const ImageCompressor = lazy(() => import('@/pages/compressor'));
const About = lazy(() => import('@/pages/about'));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  showInNav: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: '/edit',
    element: ImageEditor,
    title: '图片编辑',
    icon: ImageIcon,
    showInNav: true,
  },
  {
    path: '/compress',
    element: ImageCompressor,
    title: '图片压缩',
    icon: FolderArchive,
    showInNav: true,
  },
  {
    path: '/about',
    element: About,
    title: '关于',
    icon: Info,
    showInNav: true,
  },
];

// 导航菜单项（仅显示在导航中的路由）
export const navRoutes = routes.filter(route => route.showInNav);

// 默认路由
export const defaultPath = '/compress';
