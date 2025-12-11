# Image Helper Frontend

现代化的图片处理应用前端，基于最新的Web技术栈构建。

## 🚀 技术栈

- **React 19** - 包含React Compiler自动优化
- **Vite 7** - 下一代前端构建工具
- **TailwindCSS V4** - 实用优先的CSS框架
- **React Router v6** - 声明式路由
- **Zustand** - 轻量级状态管理
- **shadcn/ui** - 美观且可访问的UI组件
- **Wails** - 桌面应用框架

## 📦 项目结构

```
src/
├── components/          # 可复用组件
│   └── ui/             # shadcn/ui 组件
│       ├── button.jsx  # 按钮组件
│       └── card.jsx    # 卡片组件
├── lib/                # 工具函数
│   └── utils.js        # 通用工具
├── pages/              # 页面组件
│   ├── Home.jsx        # 首页
│   └── About.jsx       # 关于页
├── store/              # 状态管理
│   └── useStore.js     # Zustand store
├── App.jsx             # 主应用组件
├── main.jsx            # 应用入口
└── index.css           # 全局样式
```

## 🛠️ 开发

### 安装依赖

```bash
pnpm install
```

### 开发服务器

```bash
pnpm run dev
```

服务器将在 http://localhost:5173 启动

### 生产构建

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## ✨ 特性

### React Compiler
React 19 内置的React Compiler会自动优化组件，无需额外配置。

### 配置式路由
使用React Router v6实现声明式路由：

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### 状态管理
使用Zustand进行轻量级状态管理：

```jsx
import { useStore } from '../store/useStore';

const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

### UI组件
使用shadcn/ui组件库构建美观的界面：

```jsx
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
```

## 🎨 TailwindCSS V4

项目使用TailwindCSS V4，所有样式都是基于实用类的：

```jsx
<div className="min-h-screen bg-gray-50">
  <nav className="border-b bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 内容 */}
    </div>
  </nav>
</div>
```

## 📝 页面说明

### 首页 (/)
- 展示欢迎信息
- Zustand计数器演示
- React Compiler演示

### 关于页 (/about)
- 技术栈介绍
- 关键特性说明
- 项目架构展示

## 🔧 配置

### Vite配置 (vite.config.js)
- React插件配置
- Wails插件集成

### TailwindCSS配置 (tailwind.config.js)
- 内容路径配置
- 主题扩展

### PostCSS配置 (postcss.config.js)
- TailwindCSS V4插件

## 📦 依赖

### 生产依赖
- `@wailsio/runtime` - Wails运行时
- `react` & `react-dom` - React 19
- `react-router-dom` - React Router v6
- `zustand` - 状态管理
- `@radix-ui/react-slot` - Radix UI Slot组件
- `class-variance-authority` - 类名变体管理
- `clsx` - 条件类名工具
- `tailwind-merge` - Tailwind类名合并

### 开发依赖
- `vite` - Vite 7
- `@vitejs/plugin-react` - React插件
- `@types/react` & `@types/react-dom` - React类型定义
- `autoprefixer` - 自动添加浏览器前缀
- `postcss` - CSS后处理器
- `tailwindcss` - TailwindCSS V4
- `@tailwindcss/postcss` - TailwindCSS V4 PostCSS插件

## 🎯 未来计划

- [ ] 添加更多shadcn/ui组件
- [ ] 集成图片处理功能
- [ ] 添加单元测试
- [ ] 添加E2E测试
- [ ] 性能优化

## 📄 许可证

MIT

---

Built with ❤️ using React 19, Vite 7, and TailwindCSS V4
