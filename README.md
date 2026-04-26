# React Interview Review

一个面向前端 / 全栈面试复习的 React 练习项目。项目基于 `React + TypeScript + Vite` 构建，使用 `Tailwind CSS` 做响应式页面，使用 `Redux Toolkit` 与 `Zustand` 做状态管理示例，同时沉淀 React、Next.js、JavaScript、Nest.js 和专项面试题库。

## Features

- React 高频题复习：组件、Hooks、渲染机制、性能优化、受控组件等。
- JavaScript 中高级专题：执行上下文、闭包、this、原型链、事件循环、Promise、内存泄漏、模块化、浏览器运行时和手写题。
- Next.js 高频题知识库：SSR、SSG、ISR、CSR、App Router、RSC、缓存、SEO 等。
- 状态管理对比：同一类 todo/filter 需求分别用 Redux Toolkit 和 Zustand 实现。
- 碳元素专题：整理外部文档中的前端高频追问题，补充详细答案和代码示例。
- Nest.js 高级全栈专题：面向高级全栈岗位，覆盖 DI、认证、数据库、缓存、队列、微服务、测试、部署和系统设计。
- 响应式 UI：桌面端侧边栏导航，移动端顶部导航，题卡与代码块适配小屏。
- 工程化约束：Biome、Husky、lint-staged、Vitest。

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Redux
- Zustand
- Biome
- Husky + lint-staged
- Vitest + React Testing Library

## Getting Started

安装依赖：

```bash
npm install
```

启动本地开发服务器：

```bash
npm run dev
```

默认访问：

```txt
http://127.0.0.1:5173/
```

## Scripts

```bash
npm run dev
```

启动 Vite 开发服务器。

```bash
npm run build
```

执行 TypeScript 类型检查并构建生产包。

```bash
npm run preview
```

本地预览生产构建结果。

```bash
npm run check
```

使用 Biome 检查代码格式与 lint。

```bash
npm run check:fix
```

使用 Biome 自动修复可修复问题。

```bash
npm test
```

运行 Vitest 单元测试。

```bash
npm run test:watch
```

以 watch 模式运行测试。

## Project Structure

```txt
src/
  content/
    carbonQuestions.ts       # 碳元素专题题库
    carbonEnhancements.ts    # 碳元素题目增强答案
    interviewData.ts         # 首页模块与一周复习节奏
    jsQuestions.ts           # JavaScript 中高级专题题库
    nestQuestions.ts         # Nest.js 高级全栈专题题库
  features/
    carbon/                  # 碳元素页面
    js-lab/                  # JavaScript 题库与手写函数实验台
    nest/                    # Nest.js 专题页面
    react-demos/             # React 高频 demo
    state/                   # Redux Toolkit / Zustand 对比 demo
  test/
    setup.ts                 # 测试环境配置
  App.tsx
  main.tsx
  styles.css
docs/
  interview-cheatsheet.md    # 面试速查笔记
  week-plan.md               # 一周冲刺计划
```

## Review Modules

### React

覆盖 JSX、props/state、受控与非受控组件、Hooks、闭包旧值、依赖数组、渲染机制、`React.memo`、`useMemo`、`useCallback` 和性能优化。

### JavaScript

覆盖执行机制、作用域链、闭包、this、原型链、异步任务、事件循环、Promise 组合、垃圾回收、内存泄漏、模块化、浏览器安全和常见手写题。

手写函数包括：

- `debounce`
- `throttle`
- `deepClone`
- `promiseAll`
- `promiseRace`
- `promiseAllSettled`
- `promiseAny`
- `limitConcurrency`
- `retry`
- `withTimeout`
- `myNew`
- `myBind`
- `myInstanceof`
- `flatten`
- `groupBy`

### State Management

通过 Redux Toolkit 与 Zustand 对比同类状态需求，重点复习：

- slice / store 设计
- selector
- 派生状态
- 不可变更新
- 局部状态与全局状态边界
- Redux vs Zustand 面试表达

### Next.js

以知识库形式复习 App Router、Pages Router、SSR、SSG、ISR、CSR、RSC、Server Actions、缓存策略、SEO 和首屏优化。

### Nest.js

面向高级全栈工程师，覆盖模块化架构、依赖注入、请求生命周期、Guard、Pipe、Interceptor、Exception Filter、认证授权、数据库事务、缓存、队列、微服务、测试、部署和系统设计。

## Quality Gates

提交前会通过 Husky + lint-staged 执行 Biome 检查。建议在推送前手动运行：

```bash
npm run check
npm test
npm run build
```

## One Week Sprint

当前复习节奏：

- Day 1：项目搭建与 React 基础
- Day 2：Hooks 高频
- Day 3：渲染机制与性能
- Day 4：Redux Toolkit 与 Zustand
- Day 5：JavaScript 中高级
- Day 6：Next.js 高频
- Day 7：模拟面试与查漏补缺

## Repository

GitHub: [FrankFungcode/react-review](https://github.com/FrankFungcode/react-review)
