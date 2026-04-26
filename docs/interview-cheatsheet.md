# React 面试复习 Cheatsheet

## React

- 重新渲染：state、props、context、外部 store 订阅变化都会触发组件函数重新执行，但 DOM 是否更新取决于 diff。
- Hooks：依赖数组描述 effect 和响应式值的同步关系，缺依赖容易出现闭包旧值。
- key：稳定 key 代表同级列表中的身份，index key 在插入、删除、排序时容易造成状态错位。
- 性能：先定位重渲染来源，再考虑 `React.memo`、`useMemo`、`useCallback`、虚拟列表、懒加载。

## Next.js

- SSR：请求时生成 HTML，适合个性化和强实时 SEO 页面。
- SSG：构建时生成 HTML，适合内容稳定页面。
- ISR：静态页面按时间或事件增量更新，适合商品详情、文章详情。
- RSC：服务端组件默认在服务端执行，不能使用浏览器事件和本地交互 hooks。
- `use client`：只在需要交互的边界使用，避免把大量可服务端渲染内容推到客户端。

## JavaScript

- 闭包：函数保留词法作用域变量，可用于私有状态和函数工厂，也会造成旧值读取。
- 原型链：属性查找先查自身，再沿 `[[Prototype]]` 向上查找。
- 事件循环：同步代码先执行，微任务清空后再进入下一个宏任务。
- Promise：状态一旦确定不可逆，then 回调进入微任务队列。

## 状态管理

- Redux Toolkit：适合复杂业务状态、团队协作、调试、middleware 和异步流程。
- Zustand：适合轻量全局状态，API 少，selector 心智更直接。
- Context：适合低频变化的跨层级值，例如主题、语言、权限上下文；高频业务更新要注意渲染影响。
