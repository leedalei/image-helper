# 大雷的图片压缩器 (Image Helper)

一个功能强大的图片处理桌面应用，基于 Wails3 构建，提供高效的图片压缩和编辑能力。

![GitHub release](https://img.shields.io/github/v/release/leedalei/image-helper)
![GitHub tag](https://img.shields.io/github/v/tag/leedalei/image-helper)
![GitHub stars](https://img.shields.io/github/stars/leedalei/image-helper)
![GitHub issues](https://img.shields.io/github/issues/leedalei/image-helper)

## ✨ 特性

### 图片压缩
- 🎨 **实时预览**：压缩前后对比，可拖拽分隔线调整显示比例
- ⚡ **高效压缩**：支持质量调整（1-100）、格式转换
- 📦 **批量处理**：一键压缩多张图片，自动保存到 ZIP 文件
- 🔧 **灵活配置**：渐进式编码、优化编码、保持宽高比等选项

### 图片编辑
- 📐 **尺寸调整**：自定义宽高，支持保持宽高比
- 💧 **水印添加**：支持图片水印和文本水印
  - 透明度控制（0-100%）
  - 位置选择（左上、右上、左下、右下、居中、平铺）
  - 平铺密度控制（稀疏、适中、密集）
  - 文本水印支持字体大小、颜色、样式设置
- 🔄 **图片旋转**：支持 90°、180°、270° 及自定义角度旋转
- 📦 **批量编辑**：批量处理多张图片，自动保存到 ZIP 文件

### 通用功能
- 🖥️ **跨平台**：支持 macOS、Linux、Windows
- 📱 **响应式设计**：适配不同屏幕尺寸
- 🎛️ **状态保持**：页面切换时保持当前状态
- 📁 **多格式支持**：JPEG、PNG、WebP、GIF、BMP、TIFF

## 🚀 技术栈

### 后端
- **Go 1.21+** - 现代化的后端语言
- **Wails v3** - 跨平台桌面应用开发框架
- **disintegration/imaging** - 图片处理库（缩放、旋转、裁剪）
- **image/draw** - 水印添加

### 前端
- **React 19** - 最新版本的 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite 7** - 快速的构建工具
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **Zustand** - 轻量级状态管理
- **React Router** - 前端路由
- **shadcn/ui** - 高质量 UI 组件库
- **Radix UI** - 无障碍的基础组件
- **Lucide React** - 精美的图标库
- **Sonner** - Toast 通知组件

### 开发工具
- **pnpm** - 高效的包管理器
- **PostCSS** - CSS 转换工具
- **Babel** - JavaScript 编译器

## 📋 系统要求

- **Node.js**: 22.x 或更高版本
- **pnpm**: 10.x 或更高版本
- **Go**: 1.21 或更高版本
- **Wails CLI**: v3

## 🛠️ 安装

### 下载预构建版本

前往 [GitHub Releases](https://github.com/leedalei/image-helper/releases) 下载适用于您操作系统的二进制文件。

支持的平台：
- macOS (Intel): `image-helper-darwin-amd64`
- macOS (Apple Silicon): `image-helper-darwin-arm64`
- Linux (x64): `image-helper-linux-amd64`
- Linux (ARM64): `image-helper-linux-arm64`
- Windows (x64): `image-helper-windows-amd64.exe`


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

## 📖 使用说明

### 图片压缩

1. **选择图片**
   - 启动应用后，点击"图片压缩"菜单
   - 点击选择文件按钮或拖拽图片到上传区域
   - 支持多选，可一次选择多张图片

2. **配置压缩参数**
   - 点击设置按钮（⚡图标）打开设置面板
   - **质量**：1-100，数值越高质量越好，文件越大
   - **输出格式**：原始格式、JPEG、PNG、WebP
   - **保持宽高比**：调整尺寸时保持原始比例
   - **渐进式编码**：JPEG 格式专用，支持渐进式加载
   - **优化编码**：优化输出文件大小
   - **批量保存路径**：设置批量压缩后 ZIP 文件的保存位置

3. **预览和压缩**
   - 选中图片后自动显示压缩预览
   - 拖动中间分隔线对比原图和压缩后效果
   - 使用工具栏进行缩放（0.5x-3x）和旋转（90°增量）
   - 单张图片：点击"保存"直接保存
   - 多张图片：点击"开始压缩"批量处理并自动保存到 ZIP

4. **管理图片列表**
   - 点击缩略图切换当前预览图片
   - 点击"+"按钮添加更多图片
   - 点击缩略图右上角"×"删除图片

### 图片编辑

1. **选择图片**
   - 点击"图片编辑"菜单
   - 选择要编辑的图片（支持多选）

2. **配置编辑参数**
   - 点击设置按钮打开编辑设置面板
   
   **尺寸调整**：
   - 输入目标宽度和高度
   - 启用"保持宽高比"自动计算另一维度
   
   **水印设置**：
   - 选择水印类型：无、图片水印、文本水印
   - 图片水印：选择水印图片文件
   - 文本水印：输入水印文字，设置字体大小、颜色、样式
   - 通用设置：透明度、位置、平铺密度
   
   **旋转设置**：
   - 选择预设角度（90°、180°、270°）
   - 或输入自定义角度（0-360°）

3. **预览和编辑**
   - 左侧显示原图，右侧显示编辑预览
   - 修改参数后自动更新预览
   - 原图和预览图支持独立缩放
   - 预览图支持旋转操作

4. **保存结果**
   - 单张图片：点击"保存当前"
   - 多张图片：点击"开始编辑"批量处理
   - 批量编辑自动保存到 ZIP 文件，文件名添加"_edited"后缀

### 快捷操作

- **缩放**：鼠标滚轮或点击放大/缩小按钮
- **旋转**：点击旋转按钮（逆时针/顺时针 90°）
- **对比**：拖动分隔线调整原图/压缩图显示比例


## 🏃 开发指南

### 环境准备

1. **安装 Go**
```bash
# macOS
brew install go

# 或从官网下载: https://golang.org/dl/
```

2. **安装 Node.js 和 pnpm**
```bash
# 使用 nvm 安装 Node.js
nvm install 22
nvm use 22

# 安装 pnpm
npm install -g pnpm
```

3. **安装 Wails CLI**
```bash
go install github.com/wailsapp/wails/v3/cmd/wails3@latest
```

### 开发模式

**全栈开发**（推荐）：
```bash
# 在项目根目录运行
wails3 dev
```
这将启动应用程序并启用前后端的实时热重载。

**仅前端开发**：
```bash
cd frontend
pnpm install
pnpm run dev
```

### 项目结构

```
image-helper/
├── .github/              # GitHub Actions 工作流
│   └── workflows/
│       └── release.yml   # 自动发布工作流
├── .kiro/                # Kiro 规范文档
│   └── specs/
│       └── image-compressor/
│           ├── requirements.md  # 需求文档
│           ├── design.md        # 设计文档
│           └── tasks.md         # 任务列表
├── build/                # 构建配置和资源
│   ├── appicon.png      # 应用图标
│   └── config.yml       # 构建配置
├── compressor/           # 图片压缩服务
│   ├── compressor.go    # 压缩器实现
│   ├── service.go       # 服务层
│   └── types.go         # 类型定义
├── editor/               # 图片编辑服务
│   ├── editor.go        # 编辑器实现
│   ├── service.go       # 服务层
│   └── types.go         # 类型定义
├── frontend/             # 前端源码
│   ├── src/
│   │   ├── components/  # React 组件
│   │   │   ├── ui/      # shadcn/ui 基础组件
│   │   │   ├── CompressorSettings.tsx  # 压缩设置面板
│   │   │   ├── EditorSettings.tsx      # 编辑设置面板
│   │   │   ├── ImageComparison.tsx     # 图片对比组件
│   │   │   ├── ImageEditPreview.tsx    # 编辑预览组件
│   │   │   ├── Navigation.tsx          # 导航组件
│   │   │   ├── Uploader.tsx            # 文件上传组件
│   │   │   └── ...
│   │   ├── pages/       # 页面组件
│   │   │   ├── compressor/  # 图片压缩页面
│   │   │   ├── editor/      # 图片编辑页面
│   │   │   ├── about/       # 关于页面
│   │   │   └── settings/    # 设置页面
│   │   ├── lib/         # 工具库
│   │   │   ├── utils.ts        # 通用工具函数
│   │   │   ├── toast.ts        # Toast 通知
│   │   │   └── errorHandler.ts # 错误处理
│   │   ├── store/       # 状态管理
│   │   │   └── useStore.ts
│   │   ├── config/      # 配置
│   │   │   └── routes.tsx
│   │   └── main.tsx     # 应用入口
│   ├── public/          # 静态资源
│   └── package.json     # 依赖配置
├── main.go              # Go 应用入口
├── go.mod               # Go 模块定义
├── go.sum               # Go 依赖锁定
└── README.md            # 项目文档
```


### 添加新功能

1. **后端服务**
   - 在 `compressor/` 或 `editor/` 目录添加新方法
   - 在 `types.go` 中定义数据结构
   - 在 `service.go` 中实现服务逻辑
   - 运行 `wails3 generate bindings` 生成前端绑定

2. **前端组件**
   - 在 `frontend/src/components/` 添加新组件
   - 使用 shadcn/ui 组件库保持 UI 一致性
   - 使用 Zustand 管理组件状态

3. **新页面**
   - 在 `frontend/src/pages/` 创建页面目录
   - 在 `frontend/src/config/routes.tsx` 添加路由配置
   - 在 `Navigation.tsx` 添加菜单项

### 代码风格

- **Go**：遵循 Go 官方代码规范，使用 `gofmt` 格式化
- **TypeScript**：使用 ESLint 和 Prettier 进行代码格式化
- **React**：遵循 React Hooks 最佳实践
- **CSS**：使用 Tailwind CSS 进行样式开发

### 验证构建

**后端验证**：
```bash
go build -o /dev/null .
```

**前端验证**：
```bash
cd frontend
pnpm build
```

## 🔨 构建

### 构建当前平台

```bash
wails3 build
```

### 跨平台构建

```bash
# macOS (Intel)
wails3 build -platform darwin/amd64

# macOS (Apple Silicon)
wails3 build -platform darwin/arm64

# Linux (x64)
wails3 build -platform linux/amd64

# Linux (ARM64)
wails3 build -platform linux/arm64

# Windows (x64)
wails3 build -platform windows/amd64
```

## 🚀 发布

项目使用 GitHub Actions 自动构建和发布：

1. **创建新标签**：
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

2. **自动化流程**：
   - GitHub Actions 检测到新标签
   - 并行构建所有平台版本
   - 创建 GitHub Release
   - 上传所有构建产物

### 版本号规范

遵循语义化版本（Semantic Versioning）：
- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

示例：
- `v1.0.0` - 首次正式发布
- `v1.1.0` - 添加新功能
- `v1.1.1` - 修复 bug

访问 [Releases](https://github.com/leedalei/image-helper/releases) 查看发布历史。

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
- [disintegration/imaging](https://github.com/disintegration/imaging) - Go 图片处理库

## 📞 支持

如果您遇到问题或有疑问，请在 [GitHub Issues](https://github.com/leedalei/image-helper/issues) 中提出。

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
