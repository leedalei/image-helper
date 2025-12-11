import { lazy } from 'react';

// 使用 React.lazy 进行代码分割
const ImageEditor = lazy(() => import('@/pages/editor'));
const ImageCompressor = lazy(() => import('@/pages/compressor'));
const FormatConverter = lazy(() => import('@/pages/format-converter'));
const Settings = lazy(() => import('@/pages/settings'));
const About = lazy(() => import('@/pages/about'));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/edit',
    element: ImageEditor,
    title: '图片编辑',
  },
  {
    path: '/compress',
    element: ImageCompressor,
    title: '图片压缩',
  },
  {
    path: '/convert',
    element: FormatConverter,
    title: '格式转换',
  },
  {
    path: '/settings',
    element: Settings,
    title: '设置',
  },
  {
    path: '/about',
    element: About,
    title: '关于',
  },
];

// 默认路由
export const defaultPath = '/edit';
