# 需求文档

## 简介

本需求文档描述了图片编辑器和图片压缩器中按钮文案和交互逻辑的调整。主要涉及根据图片列表数量动态调整按钮显示和行为，以提供更直观的用户体验。

## 术语表

- **Editor_Page**: 图片编辑页面，提供图片编辑功能
- **Compressor_Page**: 图片压缩页面，提供图片压缩功能
- **Image_List**: 用户上传的待处理图片列表
- **Action_Button**: 主操作按钮（开始编辑/开始压缩/保存）
- **Dropdown_Button**: 主操作按钮右侧的下拉菜单按钮
- **Progress_Bar**: 批量处理时显示的进度条
- **Save_Current**: 保存当前选中图片的功能，弹出文件保存对话框
- **Batch_Edit**: 批量编辑功能，对所有图片应用编辑设置并保存
- **Batch_Compress**: 批量压缩功能，对所有图片应用压缩设置并保存

## 需求

### 需求 1: 图片编辑页面按钮文案调整

**用户故事:** 作为用户，我希望编辑按钮显示"批量编辑"而不是"开始编辑"，以便按钮文案更好地反映其批量处理的性质。

#### 验收标准

1. WHEN Editor_Page 显示且 Image_List 中有图片时, THE Action_Button SHALL 显示"批量编辑"作为文案

### 需求 2: 图片编辑页面单图模式

**用户故事:** 作为用户，我希望在编辑单张图片时有简化的界面，以便我可以快速保存而无需不必要的批量选项。

#### 验收标准

1. WHEN Image_List 包含少于2张图片时, THE Action_Button SHALL 显示"保存"作为文案
2. WHEN Image_List 包含少于2张图片时, THE Dropdown_Button SHALL 隐藏
3. WHEN Image_List 包含少于2张图片时, THE Progress_Bar SHALL 不显示
4. WHEN Image_List 包含少于2张图片 AND 用户点击 Action_Button 时, THE Editor_Page SHALL 执行 Save_Current 逻辑
5. WHEN Image_List 包含2张或更多图片时, THE Action_Button SHALL 显示"批量编辑"作为文案
6. WHEN Image_List 包含2张或更多图片时, THE Dropdown_Button SHALL 可见

### 需求 3: 图片压缩页面单图模式

**用户故事:** 作为用户，我希望在压缩单张图片时有简化的界面，以便我可以快速保存而无需不必要的批量选项。

#### 验收标准

1. WHEN Image_List 包含少于2张图片时, THE Action_Button SHALL 显示"保存"作为文案
2. WHEN Image_List 包含少于2张图片时, THE Dropdown_Button SHALL 隐藏
3. WHEN Image_List 包含少于2张图片时, THE Progress_Bar SHALL 不显示
4. WHEN Image_List 包含少于2张图片 AND 用户点击 Action_Button 时, THE Compressor_Page SHALL 执行 Save_Current 逻辑
5. WHEN Image_List 包含2张或更多图片时, THE Action_Button SHALL 显示"开始压缩"作为文案
6. WHEN Image_List 包含2张或更多图片时, THE Dropdown_Button SHALL 可见

### 需求 4: 保存当前功能行为

**用户故事:** 作为用户，我希望保存当前功能无需配置批量保存目录即可工作，以便我可以更方便地保存单张图片。

#### 验收标准

1. WHEN Save_Current 功能被触发时, THE 系统 SHALL 不验证批量保存目录是否已配置
2. WHEN Save_Current 功能被触发时, THE 系统 SHALL 打开文件保存对话框供用户选择保存位置
3. WHEN Save_Current 功能被触发时, THE 系统 SHALL 在保存前将当前编辑或压缩设置应用到选中的图片
