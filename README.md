# 大雷的图片压缩器 (Image Helper)

一个功能强大的图片处理桌面应用，基于 Wails3 构建，提供高效的图片压缩和处理能力。

![GitHub release](https://img.shields.io/github/v/release/leedalei/image-helper)
![GitHub tag](https://img.shields.io/github/v/tag/leedalei/image-helper)
![GitHub stars](https://img.shields.io/github/stars/leedalei/image-helper)
![GitHub issues](https://img.shields.io/github/issues/leedalei/image-helper)

## ✨ 特性

- 🎨 **现代化 UI**：基于 React 19 + shadcn-ui 构建的优雅界面
- ⚡ **高性能**：使用 Wails3 原生桌面应用框架
- 🔧 **实时预览**：支持图片压缩前后对比
- 📦 **多格式支持**：支持多种图片格式的压缩
- 🖥️ **跨平台**：支持 macOS、Linux、Windows
- 🎛️ **可配置**：灵活的质量和尺寸设置
- 📱 **响应式设计**：适配不同屏幕尺寸

## 🚀 技术栈

### 后端
- **Go 1.21+** - 现代化的后端语言
- **Wails v3** - 跨平台桌面应用开发框架

### 前端
- **React 19** - 最新版本的 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite 7** - 快速的构建工具
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **Linaria** - 零运行时 CSS-in-JS 库
- **Zustand** - 轻量级状态管理
- **React Router** - 前端路由
- **shadcn/ui** - 高质量 UI 组件库
- **Radix UI** - 无障碍的基础组件
- **Lucide React** - 精美的图标库

### 开发工具
- **pnpm** - 高效的包管理器
- **PostCSS** - CSS 转换工具
- **Babel** - JavaScript 编译器

## 📋 系统要求

- **Node.js**: 22.x 或更高版本
- **pnpm**: 10.x 或更高版本
- **Go**: 1.21 或更高版本

## 🛠️ 安装

### 下载预构建版本

前往 [GitHub Releases](https://github.com/leedalei/image-helper/releases) 下载适用于您操作系统的二进制文件。

支持的平台：
- macOS (Intel/Apple Silicon)
- Linux (x64/ARM64)
- Windows (x64)

### 从源码构建

1. **克隆仓库**
```bash
git clone https://github.com/leedalei/image-helper.git
cd image-helper
```

2. **安装前端依赖**
```bash
cd frontend
pnpm install
```

3. **构建前端**
```bash
pnpm run build
```

4. **返回根目录并构建应用**
```bash
cd ..
wails3 build
```

构建完成后，可执行文件将位于 `bin/` 目录中。

## 🏃 开发

### 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

### 全栈开发

使用 Wails3 的开发模式，可以同时运行前端和后端：

```bash
# 在项目根目录运行
wails3 dev
```

这将启动应用程序并启用前后端的实时热重载。

## 📦 项目结构

```
image-helper/
├── .github/              # GitHub Actions 工作流
│   └── workflows/
├── build/                # 构建配置和资源
│   ├── appicon.png      # 应用图标
│   └── config.yml       # 构建配置
├── compressor/           # Go 后端服务
│   ├── compressor.go    # 压缩器实现
│   ├── service.go       # 服务层
│   └── types.go         # 类型定义
├── frontend/             # 前端源码
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── pages/       # 页面组件
│   │   ├── lib/         # 工具库
│   │   └── main.tsx     # 应用入口
│   ├── public/          # 静态资源
│   └── package.json     # 依赖配置
├── main.go              # Go 应用入口
└── README.md            # 项目文档
```

## 🔨 构建

### 构建所有平台

```bash
wails3 build
```

### 跨平台构建

使用 Go 的构建标签：

```bash
# macOS (Intel)
GOOS=darwin GOARCH=amd64 go build -o bin/image-helper-mac-amd64

# macOS (Apple Silicon)
GOOS=darwin GOARCH=arm64 go build -o bin/image-helper-mac-arm64

# Linux (x64)
GOOS=linux GOARCH=amd64 go build -o bin/image-helper-linux-amd64

# Windows
GOOS=windows GOARCH=amd64 go build -o bin/image-helper-windows-amd64.exe
```

## 🚀 发布

项目使用 GitHub Actions 自动构建和发布：

1. 创建新标签：
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

2. GitHub Actions 将自动：
   - 构建所有平台的二进制文件
   - 创建 GitHub Release
   - 上传所有构建的资产

访问 [Releases](https://github.com/leedalei/image-helper/releases) 查看发布历史。

## 📝 开发指南

### 添加新功能

1. 前端组件位于 `frontend/src/components/`
2. 页面位于 `frontend/src/pages/`
3. 后端服务位于 `compressor/` 目录
4. 使用 Zustand 管理状态（位于各组件中）

### 代码风格

- 前端使用 ESLint 和 Prettier 进行代码格式化
- 使用 TypeScript 确保类型安全
- 遵循 React Hooks 最佳实践
- 使用 Tailwind CSS 进行样式开发

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Wails](https://wails.io/) - 跨平台桌面应用开发框架
- [React](https://reactjs.org/) - 用户界面库
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📞 支持

如果您遇到问题或有疑问，请在 [GitHub Issues](https://github.com/leedalei/image-helper/issues) 中提出。

---

⭐ 如果这个项目对您有帮助，请给它一个星标！