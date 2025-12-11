## 项目结构
这个项目是一个`wails3`的桌面端项目
外层为`Go`编写
前端为`React` + `TypeScript` + `pnpm` + `zustand` + `react-router-dom` + `shadcn-ui` 编写

## 环境
`node`: 22.x
`pnpm`: 10.x
`go`: 1.25.x

## 注意事项
如果是前端内容：
- 请在`frontend`目录下进行处理，不要影响到外层的Go结构
- 请使用`tailwindcss` + `shadcn-ui`进行ui开发
- 请使用`zustand`进行状态管理
- 请使用`react-router-dom`进行路由管理，注意项目使用的是配置式路由