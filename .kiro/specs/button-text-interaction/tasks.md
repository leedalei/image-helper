# 实现计划: 按钮文案和交互调整

## 概述

本实现计划将按钮文案和交互逻辑的调整分为两个主要任务，分别针对编辑页面和压缩页面进行修改，包括进度条的条件显示逻辑。

## 任务

- [x] 1. 修改图片编辑页面按钮逻辑
  - [x] 1.1 添加单图模式判断变量 `isSingleImageMode`
    - 在组件中添加 `const isSingleImageMode = imageFiles.length < 2;`
    - _需求: 2.1, 2.2, 2.3_
  - [x] 1.2 修改主操作按钮文案和点击处理
    - 将按钮文案从固定的"开始编辑"改为动态的 `isSingleImageMode ? '保存' : '批量编辑'`
    - 将按钮点击处理从 `handleStartEditing` 改为 `isSingleImageMode ? handleSaveCurrent : handleStartEditing`
    - _需求: 1.1, 2.1, 2.4, 2.5_
  - [x] 1.3 条件渲染下拉按钮
    - 使用 `{!isSingleImageMode && (...)}` 包裹 DropdownMenu 组件
    - _需求: 2.2, 2.6_
  - [x] 1.4 条件渲染进度条
    - 使用 `{!isSingleImageMode && (...)}` 包裹进度条组件
    - _需求: 2.3_

- [x] 2. 修改图片压缩页面按钮逻辑
  - [x] 2.1 添加单图模式判断变量 `isSingleImageMode`
    - 在组件中添加 `const isSingleImageMode = imageFiles.length < 2;`
    - _需求: 3.1, 3.2, 3.3_
  - [x] 2.2 修改主操作按钮文案和点击处理
    - 将按钮文案从固定的"开始压缩"改为动态的 `isSingleImageMode ? '保存' : '开始压缩'`
    - 将按钮点击处理从 `handleStartCompression` 改为 `isSingleImageMode ? handleSaveCurrent : handleStartCompression`
    - _需求: 3.1, 3.4, 3.5_
  - [x] 2.3 条件渲染下拉按钮
    - 使用 `{!isSingleImageMode && (...)}` 包裹 DropdownMenu 组件
    - _需求: 3.2, 3.6_
  - [x] 2.4 条件渲染进度条
    - 使用 `{!isSingleImageMode && (...)}` 包裹进度条组件
    - _需求: 3.3_

- [ ] 3. Checkpoint - 验证功能
  - 手动测试编辑页面单图/多图模式的按钮显示和行为
  - 手动测试压缩页面单图/多图模式的按钮显示和行为
  - 验证单图模式下不显示进度条
  - 确保保存功能正常工作，不检查保存目录配置
  - _需求: 4.1, 4.2, 4.3_

## 备注

- 本次修改为纯 UI 逻辑调整，不涉及后端修改
- 现有的 `handleSaveCurrent` 函数已符合需求，无需修改
- 修改集中在两个文件：`frontend/src/pages/editor/index.tsx` 和 `frontend/src/pages/compressor/index.tsx`
