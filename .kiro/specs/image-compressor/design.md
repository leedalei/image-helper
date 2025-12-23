# 设计文档

## 概述

大雷的图片压缩器是一个基于 Wails3 框架构建的跨平台桌面应用，采用 Go 后端和 React/TypeScript 前端的架构。应用提供图片压缩和编辑两大核心功能，通过导航菜单访问不同的功能模块。

### 核心功能
- **图片压缩**：支持多种格式的图片压缩，提供质量调整、格式转换等功能
- **图片编辑**：支持尺寸调整、水印添加、图片旋转等编辑操作
- **批量处理**：支持批量压缩和编辑，自动保存到ZIP文件
- **实时预览**：提供压缩/编辑前后的对比预览

### 技术栈
- **后端**：Go 1.21+, Wails v3
- **前端**：React 19, TypeScript, Vite 7, Tailwind CSS 4, Zustand, shadcn/ui, Radix UI, Lucide React
- **图片处理**：
  - `github.com/disintegration/imaging` - 图片缩放、旋转、裁剪、调整等
  - Go 标准库 `image/draw` - 水印添加
  - Go 标准库 `image/jpeg`, `image/png` 等 - 格式编解码

## 架构

### 整体架构

应用采用典型的桌面应用架构，分为三层：

```
┌─────────────────────────────────────────┐
│           前端层 (React/TS)              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │图片压缩 │  │图片编辑 │  │  关于   │ │
│  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────┘
                  ↕ (Wails Bridge)
┌─────────────────────────────────────────┐
│          服务层 (Go Services)            │
│  ┌──────────────┐  ┌──────────────────┐│
│  │Compressor    │  │Image Editor      ││
│  │Service       │  │Service           ││
│  └──────────────┘  └──────────────────┘│
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         核心层 (Go Image Processing)     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌─────┐│
│  │Encode│  │Decode│  │Resize│  │Water││
│  │      │  │      │  │      │  │mark ││
│  └──────┘  └──────┘  └──────┘  └─────┘│
└─────────────────────────────────────────┘
```

### 前后端通信

前后端通过 Wails Bridge 进行通信：
- 前端调用后端服务的导出方法
- 图片数据使用 Base64 编码传输
- 后端返回 JSON 格式的结果

## 组件和接口

### 前端组件

#### 1. 导航组件 (Navigation)

**职责**：
- 渲染顶部导航菜单
- 处理路由切换
- 高亮当前活动菜单项

**接口**：
```typescript
interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}
```

#### 2. 图片压缩组件 (ImageCompressor)

**职责**：
- 文件选择和加载
- 压缩参数配置
- 实时预览
- 批量压缩处理
- 结果保存

**状态管理**：
```typescript
interface CompressorState {
  selectedFiles: FileList | null;
  imageFiles: ImageFile[];
  selectedIndex: number;
  settings: CompressionSettings;
  currentPreview: PreviewData | null;
  isCompressionStarted: boolean;
}

interface ImageFile {
  file: File;
  originalImageData: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface CompressionSettings {
  quality: number;
  format: string;
  keepAspectRatio: boolean;
  progressive: boolean;
  optimize: boolean;
  batchSavePath: string;
}
```

#### 3. 图片编辑组件 (ImageEditor)

**职责**：
- 文件选择和加载
- 编辑参数配置（尺寸、水印、旋转）
- 实时预览
- 批量编辑处理
- 结果保存

**状态管理**：
```typescript
interface EditorState {
  selectedFiles: FileList | null;
  imageFiles: ImageFile[];
  selectedIndex: number;
  settings: EditorSettings;
  currentPreview: PreviewData | null;
  isEditingStarted: boolean;
}

interface EditorSettings {
  // 尺寸调整
  targetWidth: number;
  targetHeight: number;
  keepAspectRatio: boolean;
  
  // 水印
  watermarkType: 'none' | 'image' | 'text';
  watermarkImage: string | null;
  watermarkText: string;
  watermarkOpacity: number;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'tile';
  watermarkDensity: 'sparse' | 'medium' | 'dense';
  watermarkFontSize: number;
  watermarkFontColor: string;
  watermarkFontStyle: 'normal' | 'bold' | 'italic';
  
  // 旋转
  rotationAngle: number;
  
  // 批量保存
  batchSavePath: string;
}
```

#### 4. 图片对比预览组件 (ImageComparison)

**用于图片压缩功能**

**职责**：
- 在单个容器中显示原始图片和压缩后图片
- 提供可拖拽的分隔线来调整显示比例
- 支持缩放和旋转
- 同步两侧图片的变换

**接口**：
```typescript
interface ImageComparisonProps {
  originalUrl: string | null;
  compressedUrl: string | null;
  scale: number;
  rotation: number;
  onScaleChange: (scale: number) => void;
  onRotationChange: (rotation: number) => void;
}
```

#### 5. 图片编辑预览组件 (ImageEditPreview)

**用于图片编辑功能**

**职责**：
- 左右两个独立容器分别显示原始图片和编辑后图片
- 支持缩放和旋转
- 同步两侧图片的变换
- 实时显示水印效果

**接口**：
```typescript
interface ImageEditPreviewProps {
  originalUrl: string | null;
  editedUrl: string | null;
  scale: number;
  rotation: number;
  onScaleChange: (scale: number) => void;
  onRotationChange: (rotation: number) => void;
}
```

#### 6. 设置面板组件 (SettingsPanel)

**职责**：
- 显示和编辑压缩/编辑参数
- 参数验证
- 应用和重置设置

**接口**：
```typescript
interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: CompressionSettings | EditorSettings;
  onApply: (settings: any) => void;
  onReset: () => void;
}
```

#### 7. 关于页面组件 (AboutPage)

**职责**：
- 显示应用信息
- 显示Banner图片
- 显示版本信息

**接口**：
```typescript
interface AboutPageProps {
  appName: string;
  version: string;
  description: string;
  developer: string;
  license: string;
}
```

### 后端服务

#### 1. Compressor Service

**职责**：
- 图片压缩处理
- 格式转换
- 批量压缩
- 文件保存

**接口**：
```go
type CompressorService interface {
    // 获取图片信息
    GetImageInfo(data []byte) (*ImageInfo, error)
    
    // 压缩单张图片
    Compress(data []byte, options CompressionOptions) (*CompressionResult, error)
    
    // 批量压缩
    BatchCompress(req BatchCompressionRequest) (*BatchCompressionResponse, error)
    
    // 保存图片到本地
    Save(result *CompressionResult, options SaveOptions) (string, error)
    
    // 批量保存到ZIP文件
    BatchSaveToZip(results []*CompressionResult, options BatchSaveOptions) (string, error)
}
```

#### 2. Image Editor Service

**职责**：
- 图片尺寸调整
- 水印添加
- 图片旋转
- 批量编辑
- 文件保存

**接口**：
```go
type ImageEditorService interface {
    // 调整图片尺寸
    Resize(data []byte, width, height int, keepAspectRatio bool) ([]byte, error)
    
    // 添加图片水印
    AddImageWatermark(data []byte, watermark []byte, options WatermarkOptions) ([]byte, error)
    
    // 添加文本水印
    AddTextWatermark(data []byte, text string, options TextWatermarkOptions) ([]byte, error)
    
    // 旋转图片
    Rotate(data []byte, angle int) ([]byte, error)
    
    // 批量编辑
    BatchEdit(req BatchEditRequest) (*BatchEditResponse, error)
    
    // 保存编辑结果
    Save(result *EditResult, options SaveOptions) (string, error)
    
    // 批量保存到ZIP
    BatchSaveToZip(results []*EditResult, options BatchSaveOptions) (string, error)
}
```

## 数据模型

### 图片处理实现细节

#### 使用的库

1. **disintegration/imaging**
   - 用途：图片缩放、旋转、裁剪、亮度/对比度调整
   - 优势：纯Go实现、API简洁、性能良好、无C依赖
   - 安装：`go get -u github.com/disintegration/imaging`

2. **Go 标准库 image/draw**
   - 用途：水印添加（图片和文本）
   - 优势：标准库、无需额外依赖

3. **Go 标准库 image/jpeg, image/png 等**
   - 用途：图片格式编解码
   - 优势：标准库、支持主流格式

#### 核心操作实现

**图片缩放**：
```go
import "github.com/disintegration/imaging"

// 使用Lanczos滤镜进行高质量缩放
resized := imaging.Resize(img, width, height, imaging.Lanczos)

// 保持宽高比缩放
resized := imaging.Resize(img, width, 0, imaging.Lanczos) // 高度自动计算
```

**图片旋转**：
```go
// 旋转指定角度
rotated := imaging.Rotate(img, angle, color.Transparent)
```

**图片水印**：
```go
import "image/draw"

// 图片水印
draw.Draw(dst, bounds, watermarkImg, image.Point{}, draw.Over)

// 文本水印（需要使用golang.org/x/image/font）
// 在指定位置绘制文本
```

**图片压缩**：
```go
import "image/jpeg"

// JPEG压缩
jpeg.Encode(output, img, &jpeg.Options{Quality: quality})
```

### 压缩相关

```go
// 图片格式
type ImageFormat string

const (
    FormatJPEG ImageFormat = "jpeg"
    FormatPNG  ImageFormat = "png"
    FormatWebP ImageFormat = "webp"
    FormatGIF  ImageFormat = "gif"
    FormatBMP  ImageFormat = "bmp"
    FormatTIFF ImageFormat = "tiff"
)

// 压缩选项
type CompressionOptions struct {
    Quality         int         `json:"quality"`          // 质量 (1-100)
    Format          ImageFormat `json:"format"`           // 目标格式
    KeepAspectRatio bool        `json:"keepAspectRatio"`  // 保持宽高比
    Progressive     bool        `json:"progressive"`      // 渐进式编码
    Optimize        bool        `json:"optimize"`         // 优化编码
}

// 压缩结果
type CompressionResult struct {
    Data             []byte      `json:"-"`                // 压缩后的数据
    OriginalSize     int64       `json:"originalSize"`     // 原始大小
    CompressedSize   int64       `json:"compressedSize"`   // 压缩后大小
    CompressionRatio float64     `json:"compressionRatio"` // 压缩率
    OutputFormat     ImageFormat `json:"outputFormat"`     // 输出格式
    Width            int         `json:"width"`            // 宽度
    Height           int         `json:"height"`           // 高度
}
```

### 编辑相关

```go
// 水印位置
type WatermarkPosition string

const (
    PositionTopLeft     WatermarkPosition = "top-left"
    PositionTopRight    WatermarkPosition = "top-right"
    PositionBottomLeft  WatermarkPosition = "bottom-left"
    PositionBottomRight WatermarkPosition = "bottom-right"
    PositionCenter      WatermarkPosition = "center"
    PositionTile        WatermarkPosition = "tile"
)

// 水印密度
type WatermarkDensity string

const (
    DensitySparse WatermarkDensity = "sparse"
    DensityMedium WatermarkDensity = "medium"
    DensityDense  WatermarkDensity = "dense"
)

// 水印选项
type WatermarkOptions struct {
    Opacity  float64           `json:"opacity"`  // 透明度 (0-1)
    Position WatermarkPosition `json:"position"` // 位置
    Density  WatermarkDensity  `json:"density"`  // 密度（仅平铺时）
}

// 文本水印选项
type TextWatermarkOptions struct {
    WatermarkOptions
    Text      string `json:"text"`      // 文本内容
    FontSize  int    `json:"fontSize"`  // 字体大小
    FontColor string `json:"fontColor"` // 字体颜色
    FontStyle string `json:"fontStyle"` // 字体样式
}

// 编辑结果
type EditResult struct {
    Data       []byte      `json:"-"`          // 编辑后的数据
    Width      int         `json:"width"`      // 宽度
    Height     int         `json:"height"`     // 高度
    Format     ImageFormat `json:"format"`     // 格式
    Operations []string    `json:"operations"` // 应用的操作列表
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 核心压缩属性

**属性 1：Base64编码往返一致性**
*对于任何*有效的图片数据，将其编码为Base64然后解码回二进制，应该产生相同的数据。
**验证：需求 15.1, 15.2, 15.3, 15.4**

**属性 2：压缩保持图片可读性**
*对于任何*有效的图片文件，压缩后的结果应该仍然是一个可以被解码的有效图片。
**验证：需求 6.3, 6.4, 6.5**

**属性 3：质量参数影响文件大小**
*对于任何*图片和两个不同的质量参数q1 < q2，使用q1压缩的文件大小应该小于或等于使用q2压缩的文件大小。
**验证：需求 4.1, 6.4**

**属性 4：格式转换保持内容**
*对于任何*图片，转换格式后的图片应该保持相同的视觉内容（尺寸可能不同，但内容应该相同）。
**验证：需求 6.5, 13.8**

**属性 5：批量压缩结果数量一致**
*对于任何*N张图片的批量压缩请求，成功数量 + 失败数量应该等于N。
**验证：需求 7.1, 7.4, 7.5**

### 文件管理属性

**属性 6：文件选择多选支持**
*对于任何*多个图片文件的选择操作，所有选中的文件都应该被加载到应用中。
**验证：需求 2.3, 2.5**

**属性 7：文件格式过滤**
*对于任何*非图片格式的文件，文件选择对话框应该拒绝选择。
**验证：需求 2.4, 13.1-13.6**

**属性 8：图片列表删除一致性**
*对于任何*包含N张图片的列表，删除一张图片后列表应该包含N-1张图片。
**验证：需求 10.4**

**属性 9：删除后自动选择**
*对于任何*非空图片列表，删除当前选中的图片后，应该自动选中相邻的图片（如果存在）。
**验证：需求 10.5**

**属性 10：空列表返回选择界面**
*对于任何*图片列表，当所有图片都被删除后，应该返回到文件选择界面。
**验证：需求 10.6**

### 状态管理属性

**属性 11：状态转换有效性**
*对于任何*图片，其状态只能按照以下顺序转换：pending → processing → (completed | error)。
**验证：需求 12.1, 12.2, 12.3, 12.4**

**属性 12：参数修改重置状态**
*对于任何*已压缩的图片列表，修改压缩参数后，所有图片的状态应该被重置为pending。
**验证：需求 4.7**

**属性 13：预览不影响压缩状态**
*对于任何*图片，进行预览压缩操作不应该改变其压缩状态。
**验证：需求 5.7**

### 预览和显示属性

**属性 14：预览自动更新**
*对于任何*选中的图片，修改压缩参数后，预览应该自动使用新参数重新生成。
**验证：需求 5.6**

**属性 15：压缩预览同步变换**
*对于任何*缩放或旋转操作，在图片压缩功能中，分隔线两侧的图片应该同步应用相同的变换。
**验证：需求 11.6, 11.7**

**属性 15.1：编辑预览同步变换**
*对于任何*缩放或旋转操作，在图片编辑功能中，左右两个容器中的图片应该同步应用相同的变换。
**验证：需求 23.7, 23.8, 23.9**

**属性 16：压缩率计算正确性**
*对于任何*压缩结果，压缩率应该等于 (1 - 压缩后大小 / 原始大小) × 100。
**验证：需求 5.4**

### 保存和导出属性

**属性 17：保存文件名后缀**
*对于任何*保存的压缩图片，文件名应该包含"_compressed"后缀。
**验证：需求 8.3, 9.4**

**属性 18：ZIP文件包含所有图片**
*对于任何*N张图片的批量保存，生成的ZIP文件应该包含N个图片文件。
**验证：需求 9.3**

**属性 19：ZIP文件名唯一性**
*对于任何*两次批量保存操作，生成的ZIP文件名应该不同（使用时间戳）。
**验证：需求 9.2**

### 图片编辑属性

**属性 20：尺寸调整保持宽高比**
*对于任何*图片，当启用保持宽高比选项时，调整宽度后的高度应该等于 原始高度 × (新宽度 / 原始宽度)。
**验证：需求 20.6, 20.7**

**属性 21：旋转角度累加**
*对于任何*图片，连续旋转两次90度应该等于旋转一次180度。
**验证：需求 22.3, 22.4, 22.5**

**属性 22：水印透明度范围**
*对于任何*水印配置，透明度值应该在0到100之间。
**验证：需求 21.4**

**属性 23：水印预览实时更新**
*对于任何*水印参数的修改，预览图片应该实时显示更新后的水印效果。
**验证：需求 23.4, 23.5, 23.6**

**属性 24：批量编辑结果数量一致**
*对于任何*N张图片的批量编辑请求，成功数量 + 失败数量应该等于N。
**验证：需求 24.4, 24.5, 24.6**

**属性 25：编辑保存文件名后缀**
*对于任何*保存的编辑图片，文件名应该包含"_edited"后缀。
**验证：需求 25.6**

### 导航和路由属性

**属性 26：菜单导航路由一致性**
*对于任何*菜单项点击，应用应该导航到对应的页面路由。
**验证：需求 1.5, 1.6, 1.7**

**属性 27：页面切换状态保持**
*对于任何*页面切换操作，原页面的状态应该被保留。
**验证：需求 1.8**

**属性 28：当前菜单高亮**
*对于任何*时刻，导航菜单中应该有且仅有一个菜单项被高亮显示。
**验证：需求 1.9**

### 错误处理属性

**属性 29：错误不中断批量操作**
*对于任何*批量操作，单个图片的失败不应该阻止其他图片的处理。
**验证：需求 16.6**

**属性 30：错误状态正确标记**
*对于任何*处理失败的图片，其状态应该被标记为error。
**验证：需求 12.4, 16.3**

## 错误处理

### 前端错误处理

1. **文件读取错误**
   - 捕获文件读取异常
   - 显示用户友好的错误提示
   - 记录错误日志

2. **网络通信错误**
   - 捕获Wails Bridge通信异常
   - 重试机制（可选）
   - 显示错误提示

3. **UI状态错误**
   - 验证用户输入
   - 防止无效操作
   - 提供即时反馈

### 后端错误处理

1. **图片解码错误**
   - 验证图片格式
   - 返回详细错误信息
   - 记录错误日志

2. **处理失败错误**
   - 捕获处理异常
   - 返回错误状态
   - 不影响其他图片处理

3. **文件系统错误**
   - 检查文件权限
   - 验证路径有效性
   - 返回错误信息

### 错误恢复策略

1. **批量操作**：单个失败不影响整体
2. **状态回滚**：失败时恢复到之前状态
3. **用户通知**：清晰的错误提示和建议

## 测试策略

### 单元测试

**前端单元测试**：
- 组件渲染测试
- 状态管理测试
- 用户交互测试
- 工具函数测试

**后端单元测试**：
- 服务方法测试
- 图片处理函数测试
- 数据转换测试
- 错误处理测试

### 属性测试

使用属性测试框架（如Go的testing/quick或TypeScript的fast-check）验证正确性属性：

**压缩属性测试**：
- 测试Base64编码往返一致性（属性1）
- 测试质量参数对文件大小的影响（属性3）
- 测试批量操作结果数量一致性（属性5）

**编辑属性测试**：
- 测试尺寸调整保持宽高比（属性20）
- 测试旋转角度累加（属性21）
- 测试批量编辑结果数量一致性（属性24）

**状态管理属性测试**：
- 测试状态转换有效性（属性11）
- 测试参数修改重置状态（属性12）

**文件管理属性测试**：
- 测试文件选择多选支持（属性6）
- 测试图片列表删除一致性（属性8）

### 集成测试

- 前后端通信测试
- 完整工作流测试
- 批量操作测试
- 文件保存和读取测试

### 端到端测试

- 用户场景测试
- 跨平台兼容性测试
- 性能测试

### 测试配置

**属性测试配置**：
- 每个属性测试至少运行100次迭代
- 使用随机生成的测试数据
- 每个测试标注对应的设计属性编号

**测试标注格式**：
```
// Feature: image-compressor, Property 1: Base64编码往返一致性
```

### 测试覆盖目标

- 单元测试覆盖率：>80%
- 属性测试覆盖所有核心属性
- 集成测试覆盖主要工作流
- 端到端测试覆盖关键用户场景

## 部署和发布

### GitHub Actions CI/CD

应用使用 GitHub Actions 实现自动化构建和发布流程。

#### 工作流配置

**触发条件**：
- 推送标签（tag）时触发发布流程
- 格式：`v*.*.*`（如 v1.0.0）

**构建流程**：

1. **环境准备**
   - 设置 Go 环境（1.21+）
   - 设置 Node.js 环境（22.x）
   - 安装 pnpm
   - 安装 Wails CLI

2. **前端构建**
   ```yaml
   - name: Build Frontend
     run: |
       cd frontend
       pnpm install
       pnpm run build
   ```

3. **跨平台构建**
   - macOS (Intel): `darwin/amd64`
   - macOS (Apple Silicon): `darwin/arm64`
   - Linux (x64): `linux/amd64`
   - Linux (ARM64): `linux/arm64`
   - Windows (x64): `windows/amd64`

4. **构建命令**
   ```yaml
   - name: Build Application
     run: |
       wails3 build -platform $PLATFORM
   ```

5. **创建 Release**
   - 自动创建 GitHub Release
   - 上传所有平台的二进制文件
   - 生成 Release Notes

#### 发布流程

**手动触发发布**：
```bash
# 创建标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 推送标签到远程
git push origin v1.0.0
```

**自动化流程**：
1. GitHub Actions 检测到新标签
2. 触发构建工作流
3. 并行构建所有平台版本
4. 运行测试套件
5. 创建 GitHub Release
6. 上传构建产物

#### 版本管理

**版本号格式**：遵循语义化版本（Semantic Versioning）
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

**示例**：
- `v1.0.0` - 首次正式发布
- `v1.1.0` - 添加新功能
- `v1.1.1` - 修复 bug

#### 构建产物

**命名规范**：
- macOS Intel: `image-helper-darwin-amd64`
- macOS ARM: `image-helper-darwin-arm64`
- Linux x64: `image-helper-linux-amd64`
- Linux ARM64: `image-helper-linux-arm64`
- Windows: `image-helper-windows-amd64.exe`

**发布内容**：
- 所有平台的可执行文件
- Release Notes（自动生成）
- 版本信息和更新日志

### 本地构建与验证

**开发模式验证**：
验证项目是否正常运行（后端），在项目根目录下，只需要执行以下命令：
```bash
go build -o /dev/null .
```
**注意**：不要单独执行 `go build ./xx` 来验证某个模块。

验证项目是否正常运行（前端），在`frontend`目录下，只需要执行以下命令：
```bash
pnpm build
```

**生产构建**：
```bash
# 构建当前平台
wails3 build

# 指定平台构建
wails3 build -platform darwin/amd64
wails3 build -platform windows/amd64
```

### 配置文件

**构建配置**：`build/config.yml`
- 应用名称和描述
- 图标配置
- 窗口默认尺寸
- 平台特定配置

**前端配置**：`frontend/vite.config.js`
- 构建优化
- 资源处理
- 开发服务器配置

