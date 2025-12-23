# 需求文档

## 简介

大雷的图片压缩器是一个基于 Wails3 构建的跨平台桌面应用，提供高效的图片压缩和处理能力。该应用支持多种图片格式，提供实时预览、批量处理和灵活的压缩配置选项。应用采用模块化设计，通过菜单导航访问不同的图片处理功能。

## 术语表

- **System**: 图片压缩器应用系统
- **Compressor_Service**: 后端图片压缩服务
- **Image_Editor_Service**: 后端图片编辑服务
- **UI**: 用户界面
- **Image_File**: 待处理的图片文件
- **Compression_Options**: 压缩配置选项
- **Preview**: 压缩前后对比预览
- **Batch_Operation**: 批量操作
- **Navigation_Menu**: 应用导航菜单
- **Image_Editor**: 图片编辑模块

## 需求

### 需求 1：应用导航

**用户故事：** 作为用户，我想要通过菜单导航访问不同的图片处理功能，以便使用应用的各项能力。

#### 验收标准

1. WHEN 应用启动，THEN THE UI SHALL 显示导航菜单
2. WHEN 导航菜单显示，THEN THE UI SHALL 包含"图片编辑"菜单项
3. WHEN 导航菜单显示，THEN THE UI SHALL 包含"图片压缩"菜单项
4. WHEN 导航菜单显示，THEN THE UI SHALL 包含"关于"菜单项
5. WHEN 用户点击"图片编辑"菜单项，THEN THE System SHALL 导航到图片编辑功能页面
6. WHEN 用户点击"图片压缩"菜单项，THEN THE System SHALL 导航到图片压缩功能页面
7. WHEN 用户点击"关于"菜单项，THEN THE System SHALL 导航到关于页面
8. WHEN 用户在不同功能页面间切换，THEN THE System SHALL 保持当前页面的状态
9. WHEN 导航菜单显示，THEN THE UI SHALL 高亮显示当前活动的菜单项

### 需求 2：图片文件选择

**用户故事：** 作为用户，我想要选择一张或多张图片文件，以便对它们进行压缩处理。

#### 验收标准

1. WHEN 用户进入图片压缩页面，THEN THE UI SHALL 显示文件选择界面
2. WHEN 用户点击选择文件按钮，THEN THE System SHALL 打开文件选择对话框
3. WHEN 用户在文件对话框中选择图片文件，THEN THE System SHALL 支持多选功能
4. WHEN 用户选择文件，THEN THE System SHALL 仅允许选择图片格式文件（jpg、jpeg、png、webp、gif、bmp、tiff）
5. WHEN 用户完成文件选择，THEN THE System SHALL 将所有选中的文件加载到应用中
6. WHEN 用户已加载图片后，THEN THE System SHALL 提供添加更多图片的功能

### 需求 3：图片信息读取

**用户故事：** 作为用户，我想要查看图片的基本信息，以便了解图片的属性。

#### 验收标准

1. WHEN 图片文件被加载，THEN THE Compressor_Service SHALL 读取图片的宽度和高度
2. WHEN 图片文件被加载，THEN THE Compressor_Service SHALL 识别图片的格式类型
3. WHEN 图片文件被加载，THEN THE Compressor_Service SHALL 计算图片的文件大小
4. WHEN 图片信息被读取，THEN THE UI SHALL 显示图片文件名
5. WHEN 图片信息被读取，THEN THE UI SHALL 显示图片文件大小

### 需求 4：压缩参数配置

**用户故事：** 作为用户，我想要配置压缩参数，以便根据需求调整压缩效果。

#### 验收标准

1. WHEN 用户打开设置面板，THEN THE UI SHALL 显示质量参数设置（1-100）
2. WHEN 用户打开设置面板，THEN THE UI SHALL 显示输出格式选择（原始格式、JPEG、PNG、WebP）
3. WHEN 用户打开设置面板，THEN THE UI SHALL 显示保持宽高比选项
4. WHEN 用户打开设置面板，THEN THE UI SHALL 显示渐进式编码选项（仅JPEG）
5. WHEN 用户打开设置面板，THEN THE UI SHALL 显示优化编码选项
6. WHEN 用户打开设置面板，THEN THE UI SHALL 显示批量保存路径配置
7. WHEN 用户修改任何压缩参数，THEN THE System SHALL 将所有未压缩图片状态重置为待处理
8. WHEN 用户点击重置按钮，THEN THE System SHALL 恢复所有参数到默认值

### 需求 5：实时预览压缩

**用户故事：** 作为用户，我想要在压缩前预览压缩效果，以便评估压缩参数是否合适。

#### 验收标准

1. WHEN 用户选中一张图片，THEN THE Compressor_Service SHALL 使用当前配置参数进行预览压缩
2. WHEN 预览压缩完成，THEN THE UI SHALL 显示原始图片和压缩后图片的对比视图
3. WHEN 预览压缩完成，THEN THE UI SHALL 显示压缩前后的文件大小
4. WHEN 预览压缩完成，THEN THE UI SHALL 显示压缩率百分比
5. WHEN 预览压缩完成，THEN THE UI SHALL 显示压缩后的图片尺寸
6. WHEN 用户修改压缩参数，THEN THE System SHALL 自动重新生成当前选中图片的预览
7. WHEN 预览压缩进行中，THEN THE System SHALL NOT 更新图片的压缩状态

### 需求 6：图片压缩处理

**用户故事：** 作为用户，我想要压缩图片，以便减小文件大小。

#### 验收标准

1. WHEN 用户点击开始压缩按钮，THEN THE System SHALL 检查是否配置了保存目录
2. IF 未配置保存目录，THEN THE System SHALL 提示用户配置保存目录
3. WHEN 开始压缩，THEN THE Compressor_Service SHALL 使用配置的参数压缩所有图片
4. WHEN 压缩单张图片时，THEN THE Compressor_Service SHALL 根据质量参数调整图片质量
5. WHEN 压缩单张图片时，THEN THE Compressor_Service SHALL 根据格式参数转换图片格式
7. WHEN 压缩进行中，THEN THE UI SHALL 更新图片状态为处理中
8. WHEN 压缩完成，THEN THE UI SHALL 更新图片状态为已完成
9. IF 压缩失败，THEN THE UI SHALL 更新图片状态为错误

### 需求 7：批量压缩

**用户故事：** 作为用户，我想要批量压缩多张图片，以便提高处理效率。

#### 验收标准

1. WHEN 用户选择多张图片并点击开始压缩，THEN THE Compressor_Service SHALL 批量处理所有图片
2. WHEN 批量压缩进行中，THEN THE UI SHALL 显示整体压缩进度
3. WHEN 批量压缩进行中，THEN THE UI SHALL 显示已完成数量和总数量
4. WHEN 批量压缩完成，THEN THE System SHALL 统计成功和失败的数量
5. WHEN 批量压缩完成，THEN THE System SHALL 显示压缩结果统计信息

### 需求 8：图片保存

**用户故事：** 作为用户，我想要保存压缩后的图片，以便使用压缩结果。

#### 验收标准

1. WHEN 用户点击保存当前按钮，THEN THE System SHALL 打开文件保存对话框
2. WHEN 保存对话框打开，THEN THE System SHALL 根据输出格式设置默认文件扩展名
3. WHEN 保存对话框打开，THEN THE System SHALL 在原文件名后添加"_compressed"后缀
4. WHEN 用户选择保存位置并确认，THEN THE Compressor_Service SHALL 将压缩后的图片保存到指定位置
5. WHEN 保存成功，THEN THE UI SHALL 显示保存成功提示和文件路径
6. IF 保存失败，THEN THE UI SHALL 显示错误提示

### 需求 9：批量保存到ZIP

**用户故事：** 作为用户，我想要将批量压缩的图片保存到ZIP文件，以便方便管理和分发。

#### 验收标准

1. WHEN 批量压缩完成，THEN THE System SHALL 自动创建ZIP文件
2. WHEN 创建ZIP文件，THEN THE System SHALL 使用时间戳生成唯一的ZIP文件名
3. WHEN 创建ZIP文件，THEN THE System SHALL 将所有压缩后的图片添加到ZIP中
4. WHEN 添加图片到ZIP，THEN THE System SHALL 为每张图片生成带"_compressed"后缀的文件名
5. WHEN 添加图片到ZIP，THEN THE System SHALL 根据输出格式设置正确的文件扩展名
6. WHEN ZIP文件创建完成，THEN THE System SHALL 将ZIP保存到配置的批量保存路径
7. WHEN ZIP保存成功，THEN THE UI SHALL 显示ZIP文件保存路径

### 需求 10：图片列表管理

**用户故事：** 作为用户，我想要管理已加载的图片列表，以便控制要处理的图片。

#### 验收标准

1. WHEN 图片被加载，THEN THE UI SHALL 在图片列表中显示缩略图
2. WHEN 用户点击缩略图，THEN THE System SHALL 选中该图片并显示预览
3. WHEN 图片被选中，THEN THE UI SHALL 高亮显示该缩略图
4. WHEN 用户点击删除按钮，THEN THE System SHALL 从列表中移除该图片
5. WHEN 图片被删除且为当前选中图片，THEN THE System SHALL 自动选中相邻图片
6. WHEN 所有图片被删除，THEN THE System SHALL 返回到文件选择界面
7. WHEN 图片列表超出可视区域，THEN THE UI SHALL 提供横向滚动功能

### 需求 11：图片对比预览

**用户故事：** 作为用户，我想要对比查看原始图片和压缩后图片，以便评估压缩质量。

#### 验收标准

1. WHEN 预览数据可用，THEN THE UI SHALL 并排显示原始图片和压缩后图片
2. WHEN 用户拖动分隔线，THEN THE UI SHALL 调整原始图片和压缩后图片的显示比例
3. WHEN 用户点击放大按钮，THEN THE UI SHALL 增加图片显示比例（最大3倍）
4. WHEN 用户点击缩小按钮，THEN THE UI SHALL 减小图片显示比例（最小0.5倍）
5. WHEN 用户点击旋转按钮，THEN THE UI SHALL 旋转图片90度
6. WHEN 图片被旋转，THEN THE UI SHALL 同时旋转原始图片和压缩后图片
7. WHEN 图片被缩放或旋转，THEN THE UI SHALL 同步应用到原始图片和压缩后图片

### 需求 12：压缩状态管理

**用户故事：** 作为用户，我想要了解每张图片的压缩状态，以便跟踪处理进度。

#### 验收标准

1. WHEN 图片被加载，THEN THE System SHALL 设置图片状态为待处理
2. WHEN 图片开始压缩，THEN THE System SHALL 设置图片状态为处理中
3. WHEN 图片压缩完成，THEN THE System SHALL 设置图片状态为已完成
4. IF 图片压缩失败，THEN THE System SHALL 设置图片状态为错误
5. WHEN 图片状态为待处理，THEN THE UI SHALL 在缩略图上显示"等待"标识
6. WHEN 图片状态为处理中，THEN THE UI SHALL 在缩略图上显示加载动画
7. WHEN 图片状态为已完成，THEN THE UI SHALL 在缩略图上显示完成标识
8. WHEN 图片状态为错误，THEN THE UI SHALL 在缩略图上显示错误标识

### 需求 13：文件格式支持

**用户故事：** 作为用户，我想要处理多种图片格式，以便满足不同的使用场景。

#### 验收标准

1. WHEN 用户选择文件，THEN THE System SHALL 支持JPEG格式（.jpg、.jpeg）
2. WHEN 用户选择文件，THEN THE System SHALL 支持PNG格式（.png）
3. WHEN 用户选择文件，THEN THE System SHALL 支持WebP格式（.webp）
4. WHEN 用户选择文件，THEN THE System SHALL 支持GIF格式（.gif）
5. WHEN 用户选择文件，THEN THE System SHALL 支持BMP格式（.bmp）
6. WHEN 用户选择文件，THEN THE System SHALL 支持TIFF格式（.tiff）
7. WHEN 输出格式设置为"原始格式"，THEN THE Compressor_Service SHALL 保持输入文件的格式
8. WHEN 输出格式设置为特定格式，THEN THE Compressor_Service SHALL 转换图片到指定格式

### 需求 14：用户反馈

**用户故事：** 作为用户，我想要获得操作反馈，以便了解操作是否成功。

#### 验收标准

1. WHEN 设置被更新，THEN THE UI SHALL 显示"设置已更新"提示
2. WHEN 设置被重置，THEN THE UI SHALL 显示"设置已重置"提示
3. WHEN 保存路径被更新，THEN THE UI SHALL 显示"保存路径已更新"提示
4. WHEN 批量压缩完成，THEN THE UI SHALL 显示成功和失败数量统计
5. WHEN 图片保存成功，THEN THE UI SHALL 显示保存路径
6. WHEN 操作失败，THEN THE UI SHALL 显示错误提示信息
7. WHEN 未配置保存目录时尝试压缩，THEN THE UI SHALL 提示用户配置保存目录

### 需求 15：数据编码

**用户故事：** 作为系统，我需要在前后端之间传输图片数据，以便进行处理。

#### 验收标准

1. WHEN 前端读取图片文件，THEN THE System SHALL 将图片转换为Base64编码
2. WHEN 前端调用后端压缩接口，THEN THE System SHALL 传输Base64编码的图片数据
3. WHEN 后端接收Base64数据，THEN THE Compressor_Service SHALL 解码为二进制数据
4. WHEN 后端完成压缩，THEN THE Compressor_Service SHALL 将结果编码为Base64
5. WHEN 前端接收压缩结果，THEN THE System SHALL 将Base64数据转换为Blob对象
6. WHEN 前端显示图片，THEN THE System SHALL 使用Blob创建对象URL

### 需求 16：错误处理

**用户故事：** 作为系统，我需要妥善处理错误情况，以便提供稳定的用户体验。

#### 验收标准

1. WHEN 文件读取失败，THEN THE System SHALL 记录错误并显示提示
2. WHEN 图片解码失败，THEN THE Compressor_Service SHALL 返回错误信息
3. WHEN 压缩处理失败，THEN THE System SHALL 更新图片状态为错误
4. WHEN 文件保存失败，THEN THE System SHALL 显示错误提示
5. WHEN 对话框操作被取消，THEN THE System SHALL 正常返回不执行后续操作
6. WHEN 批量操作中部分失败，THEN THE System SHALL 继续处理其他图片
7. WHEN 批量操作完成，THEN THE System SHALL 报告成功和失败的数量
7. WHEN 批量操作完成，THEN THE System SHALL 报告成功和失败的数量




### 需求 17：图片编辑服务

**用户故事：** 作为系统，我需要提供图片编辑服务，以便处理各种图片编辑操作。

#### 验收标准

1. WHEN 接收到尺寸调整请求，THEN THE Image_Editor_Service SHALL 根据目标尺寸调整图片大小
2. WHEN 接收到保持宽高比的尺寸调整请求，THEN THE Image_Editor_Service SHALL 在调整尺寸时保持原始宽高比
3. WHEN 接收到图片水印请求，THEN THE Image_Editor_Service SHALL 在图片上添加图片水印
4. WHEN 接收到文本水印请求，THEN THE Image_Editor_Service SHALL 在图片上添加文本水印
5. WHEN 添加水印时，THEN THE Image_Editor_Service SHALL 根据透明度参数设置水印透明度
6. WHEN 添加水印时，THEN THE Image_Editor_Service SHALL 根据位置参数放置水印（左上、右上、左下、右下、居中、平铺）
7. WHEN 添加水印时，THEN THE Image_Editor_Service SHALL 根据密度参数控制平铺水印的间距
8. WHEN 接收到旋转请求，THEN THE Image_Editor_Service SHALL 根据角度参数旋转图片
9. WHEN 接收到批量编辑请求，THEN THE Image_Editor_Service SHALL 批量处理所有图片
10. WHEN 编辑完成，THEN THE Image_Editor_Service SHALL 返回编辑后的图片数据和统计信息
11. IF 编辑失败，THEN THE Image_Editor_Service SHALL 返回错误信息

### 需求 18：图片编辑功能 - 文件选择

**用户故事：** 作为用户，我想要在图片编辑功能中选择图片文件，以便对它们进行编辑处理。

#### 验收标准

1. WHEN 用户进入图片编辑页面，THEN THE UI SHALL 显示文件选择界面
2. WHEN 用户点击选择文件按钮，THEN THE System SHALL 打开文件选择对话框
3. WHEN 用户在文件对话框中选择图片文件，THEN THE System SHALL 支持多选功能
4. WHEN 用户选择文件，THEN THE System SHALL 仅允许选择图片格式文件（jpg、jpeg、png、webp、gif、bmp、tiff）
5. WHEN 用户完成文件选择，THEN THE System SHALL 将所有选中的文件加载到应用中
6. WHEN 用户已加载图片后，THEN THE System SHALL 提供添加更多图片的功能

### 需求 19：图片编辑功能 - 操作界面

**用户故事：** 作为用户，我想要在图片编辑页面查看图片列表和操作进度，以便管理编辑任务。

#### 验收标准

1. WHEN 图片被加载到编辑页面，THEN THE UI SHALL 在图片列表中显示缩略图
2. WHEN 用户点击缩略图，THEN THE System SHALL 选中该图片并显示预览
3. WHEN 图片被选中，THEN THE UI SHALL 高亮显示该缩略图
4. WHEN 用户点击删除按钮，THEN THE System SHALL 从列表中移除该图片
5. WHEN 图片被删除且为当前选中图片，THEN THE System SHALL 自动选中相邻图片
6. WHEN 所有图片被删除，THEN THE System SHALL 返回到文件选择界面
7. WHEN 图片列表超出可视区域，THEN THE UI SHALL 提供横向滚动功能
8. WHEN 编辑操作进行中，THEN THE UI SHALL 显示整体操作进度
9. WHEN 编辑操作进行中，THEN THE UI SHALL 显示已完成数量和总数量
10. WHEN 图片信息被读取，THEN THE UI SHALL 显示图片文件名和文件大小

### 需求 20：图片编辑功能 - 尺寸调整

**用户故事：** 作为用户，我想要调整图片尺寸，以便满足不同的使用需求。

#### 验收标准

1. WHEN 用户打开编辑设置面板，THEN THE UI SHALL 显示目标宽度设置
2. WHEN 用户打开编辑设置面板，THEN THE UI SHALL 显示目标高度设置
3. WHEN 用户打开编辑设置面板，THEN THE UI SHALL 显示保持宽高比选项
4. WHEN 用户输入目标宽度，THEN THE System SHALL 验证输入为正整数
5. WHEN 用户输入目标高度，THEN THE System SHALL 验证输入为正整数
6. WHEN 保持宽高比选项启用且用户修改宽度，THEN THE System SHALL 自动计算并更新高度
7. WHEN 保持宽高比选项启用且用户修改高度，THEN THE System SHALL 自动计算并更新宽度
8. WHEN 用户应用尺寸调整，THEN THE System SHALL 按照设置的尺寸调整图片
9. WHEN 尺寸调整完成，THEN THE UI SHALL 在预览区域显示调整后的图片

### 需求 20：图片编辑功能 - 水印添加

**用户故事：** 作为用户，我想要为图片添加水印，以便保护图片版权或添加标识。

#### 验收标准

1. WHEN 用户打开水印设置面板，THEN THE UI SHALL 显示水印类型选择（图片水印、文本水印）
2. WHEN 用户选择图片水印，THEN THE System SHALL 提供图片文件选择功能
3. WHEN 用户选择文本水印，THEN THE UI SHALL 显示文本输入框
4. WHEN 用户配置水印，THEN THE UI SHALL 显示透明度设置（0-100）
5. WHEN 用户配置水印，THEN THE UI SHALL 显示密度设置（稀疏、适中、密集）
6. WHEN 用户配置水印，THEN THE UI SHALL 显示水印位置设置（左上、右上、左下、右下、居中、平铺）
7. WHEN 用户选择文本水印，THEN THE UI SHALL 显示字体大小设置
8. WHEN 用户选择文本水印，THEN THE UI SHALL 显示字体颜色设置
9. WHEN 用户选择文本水印，THEN THE UI SHALL 显示字体样式设置（正常、粗体、斜体）
10. WHEN 用户应用水印，THEN THE System SHALL 根据配置在图片上添加水印
11. WHEN 水印添加完成，THEN THE UI SHALL 在预览区域显示带水印的图片

### 需求 21：图片编辑功能 - 图片旋转

**用户故事：** 作为用户，我想要旋转图片，以便调整图片方向。

#### 验收标准

1. WHEN 用户打开编辑设置面板，THEN THE UI SHALL 显示旋转角度选项（90度、180度、270度、自定义）
2. WHEN 用户选择自定义旋转，THEN THE UI SHALL 显示角度输入框（0-360度）
3. WHEN 用户点击顺时针旋转按钮，THEN THE System SHALL 将图片顺时针旋转90度
4. WHEN 用户点击逆时针旋转按钮，THEN THE System SHALL 将图片逆时针旋转90度
5. WHEN 用户应用旋转，THEN THE System SHALL 按照设置的角度旋转图片
6. WHEN 旋转完成，THEN THE UI SHALL 在预览区域显示旋转后的图片

### 需求 22：图片编辑功能 - 预览对比

**用户故事：** 作为用户，我想要对比查看原始图片和编辑后图片，以便评估编辑效果。

#### 验收标准

1. WHEN 用户选中一张图片，THEN THE UI SHALL 在左侧显示原始图片
2. WHEN 用户选中一张图片，THEN THE UI SHALL 在右侧显示编辑后的预览图片
3. WHEN 用户修改编辑参数，THEN THE System SHALL 自动更新右侧预览图片
4. WHEN 用户添加或修改水印，THEN THE System SHALL 在右侧预览图片中显示水印效果
5. WHEN 用户调整水印透明度，THEN THE System SHALL 在预览中实时更新水印透明度
6. WHEN 用户调整水印位置，THEN THE System SHALL 在预览中实时更新水印位置
7. WHEN 预览区域显示，THEN THE UI SHALL 在左侧原图框内显示独立的悬浮操作栏
8. WHEN 预览区域显示，THEN THE UI SHALL 在右侧预览图框内显示独立的悬浮操作栏
9. WHEN 原图悬浮操作栏显示，THEN THE UI SHALL 仅包含放大和缩小按钮
10. WHEN 预览图悬浮操作栏显示，THEN THE UI SHALL 包含放大、缩小、向左旋转、向右旋转按钮
11. WHEN 用户点击预览图的旋转按钮，THEN THE System SHALL 实时更新编辑设置中的旋转角度
12. WHEN 用户在预览图上使用缩放操作改变尺寸，THEN THE System SHALL 实时更新编辑设置中的宽度和高度
13. WHEN 用户在原图区域使用鼠标滚轮，THEN THE UI SHALL 仅缩放原图显示比例
14. WHEN 用户在预览图区域使用鼠标滚轮，THEN THE UI SHALL 仅缩放预览图显示比例
15. WHEN 原图和预览图分别缩放，THEN THE System SHALL 独立保存两者的缩放比例
16. WHEN 预览区域显示，THEN THE UI SHALL 提供缩放控制（最大3倍，最小0.5倍）

### 需求 23：图片编辑功能 - 批量处理

**用户故事：** 作为用户，我想要批量编辑多张图片，以便提高处理效率。

#### 验收标准

1. WHEN 用户选择多张图片并点击开始编辑按钮，THEN THE System SHALL 批量处理所有图片
2. WHEN 批量编辑进行中，THEN THE UI SHALL 显示整体编辑进度
3. WHEN 批量编辑进行中，THEN THE UI SHALL 显示已完成数量和总数量
4. WHEN 批量编辑进行中，THEN THE UI SHALL 更新每张图片的状态（待处理、处理中、已完成、错误）
5. WHEN 批量编辑完成，THEN THE System SHALL 统计成功和失败的数量
6. WHEN 批量编辑完成，THEN THE System SHALL 显示编辑结果统计信息

### 需求 24：图片编辑功能 - 批量保存

**用户故事：** 作为用户，我想要批量保存编辑后的图片，以便使用编辑结果。

#### 验收标准

1. WHEN 用户点击开始编辑按钮，THEN THE System SHALL 检查是否配置了保存目录
2. IF 未配置保存目录，THEN THE System SHALL 提示用户配置保存目录
3. WHEN 批量编辑完成，THEN THE System SHALL 自动创建ZIP文件
4. WHEN 创建ZIP文件，THEN THE System SHALL 使用时间戳生成唯一的ZIP文件名
5. WHEN 创建ZIP文件，THEN THE System SHALL 将所有编辑后的图片添加到ZIP中
6. WHEN 添加图片到ZIP，THEN THE System SHALL 为每张图片生成带"_edited"后缀的文件名
7. WHEN 添加图片到ZIP，THEN THE System SHALL 保持原始图片格式
8. WHEN ZIP文件创建完成，THEN THE System SHALL 将ZIP保存到配置的批量保存路径
9. WHEN ZIP保存成功，THEN THE UI SHALL 显示ZIP文件保存路径
10. WHEN 用户点击保存当前按钮，THEN THE System SHALL 打开文件保存对话框保存单张图片

### 需求 25：图片编辑功能 - 编辑状态管理

**用户故事：** 作为用户，我想要了解每张图片的编辑状态，以便跟踪处理进度。

#### 验收标准

1. WHEN 图片被加载，THEN THE System SHALL 设置图片状态为待处理
2. WHEN 图片开始编辑，THEN THE System SHALL 设置图片状态为处理中
3. WHEN 图片编辑完成，THEN THE System SHALL 设置图片状态为已完成
4. IF 图片编辑失败，THEN THE System SHALL 设置图片状态为错误
5. WHEN 图片状态为待处理，THEN THE UI SHALL 在缩略图上显示"等待"标识
6. WHEN 图片状态为处理中，THEN THE UI SHALL 在缩略图上显示加载动画
7. WHEN 图片状态为已完成，THEN THE UI SHALL 在缩略图上显示完成标识
8. WHEN 图片状态为错误，THEN THE UI SHALL 在缩略图上显示错误标识

### 需求 26：关于页面

**用户故事：** 作为用户，我想要查看应用的相关信息，以便了解应用版本和详情。

#### 验收标准

1. WHEN 用户进入关于页面，THEN THE UI SHALL 显示顶部Banner图片
2. WHEN 顶部Banner显示，THEN THE UI SHALL 设置Banner宽度为100%
3. WHEN 顶部Banner显示，THEN THE UI SHALL 设置Banner高度为400px
4. WHEN 用户进入关于页面，THEN THE UI SHALL 在底部显示应用版本信息
5. WHEN 用户进入关于页面，THEN THE UI SHALL 在底部显示应用名称
6. WHEN 用户进入关于页面，THEN THE UI SHALL 在底部显示应用描述
7. WHEN 用户进入关于页面，THEN THE UI SHALL 在底部显示开发者信息
8. WHEN 用户进入关于页面，THEN THE UI SHALL 在底部显示许可证信息
