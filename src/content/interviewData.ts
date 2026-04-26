export type Question = {
  question: string;
  shortAnswer: string;
  detail: string;
  followUp: string;
};

export type InterviewSection = {
  id: "overview" | "react" | "next" | "js" | "state";
  title: string;
  description: string;
  focus: string[];
  questions: Question[];
};

export const weeklyPlan = [
  { day: "Day 1", title: "项目搭建与 React 基础", output: "题卡、表单 demo、key 行为 demo" },
  { day: "Day 2", title: "Hooks 高频", output: "hooks 对比 demo、依赖数组复盘" },
  { day: "Day 3", title: "渲染机制与性能", output: "re-render 可视化、性能清单" },
  { day: "Day 4", title: "Redux Toolkit 与 Zustand", output: "同需求双实现、面试对比" },
  {
    day: "Day 5",
    title: "JavaScript 中高级",
    output: "执行上下文、闭包、this、原型、Promise、内存泄漏、手写题",
  },
  { day: "Day 6", title: "Next.js 高频", output: "渲染模式、RSC、缓存笔记" },
  { day: "Day 7", title: "模拟面试", output: "口述复盘与 cheatsheet" },
];

export const interviewSections: InterviewSection[] = [
  {
    id: "react",
    title: "React 高频题",
    description: "围绕组件、Hooks、渲染、性能优化和工程实践组织，可配合右侧 demo 口述。",
    focus: ["Hooks 闭包", "依赖数组", "组件重渲染", "受控组件", "性能优化"],
    questions: [
      {
        question: "React 组件为什么会重新渲染？",
        shortAnswer: "自身 state、父组件渲染、context 变化、外部 store 订阅变化都会触发。",
        detail:
          "面试表达时要区分触发 render 和真实 DOM 更新。React 会先执行组件函数生成新的虚拟树，再通过 diff 决定是否更新 DOM。",
        followUp: "React.memo 为什么有时没效果？props 引用每次都变时如何处理？",
      },
      {
        question: "useEffect 依赖数组应该怎么写？",
        shortAnswer: "effect 里用到的响应式值都应该放进依赖数组。",
        detail:
          "依赖数组不是调度开关，而是描述 effect 和外部值之间的同步关系。缺依赖会造成闭包读取旧值，多依赖通常提示逻辑需要拆分。",
        followUp: "如何避免无限请求？cleanup 在什么时候执行？",
      },
      {
        question: "受控组件和非受控组件有什么区别？",
        shortAnswer: "受控组件由 React state 驱动，非受控组件由 DOM 自己保存值。",
        detail:
          "表单校验、联动和回显更适合受控组件；简单文件上传、一次性读取可以使用 ref 读取非受控值。",
        followUp: "大型表单为什么可能选择非受控或混合方案？",
      },
      {
        question: "key 的作用是什么？",
        shortAnswer: "key 帮助 React 在同级列表中识别元素身份，影响复用、移动和销毁。",
        detail:
          "稳定 key 可以保留正确的组件状态。用 index 作为 key 在排序、插入、删除时容易让状态错位。",
        followUp: "为什么列表重排后 input 的值会串行？",
      },
    ],
  },
  {
    id: "next",
    title: "Next.js 高频题",
    description: "不创建额外 Next 项目，集中复习渲染模式、路由、缓存和服务端组件。",
    focus: ["SSR/SSG/ISR/CSR", "App Router", "RSC", "数据缓存", "SEO"],
    questions: [
      {
        question: "SSR、SSG、ISR、CSR 怎么区分？",
        shortAnswer: "SSR 请求时生成，SSG 构建时生成，ISR 后台增量更新，CSR 在浏览器取数渲染。",
        detail:
          "选择依据是数据新鲜度、SEO 需求和页面个性化程度。商品详情常用 ISR，用户后台常用 CSR 或 SSR。",
        followUp: "电商首页、个人中心、文章详情分别怎么选？",
      },
      {
        question: "Server Component 和 Client Component 区别是什么？",
        shortAnswer:
          "Server Component 在服务端执行，不能用浏览器交互 hooks；Client Component 才能使用事件和本地状态。",
        detail:
          "App Router 默认是服务端组件。需要 useState、useEffect、onClick 或浏览器 API 时，加 use client 边界。",
        followUp: "为什么不要把整个页面都标成 use client？",
      },
      {
        question: "Next.js 为什么适合 SEO？",
        shortAnswer: "它能提前生成或服务端返回完整 HTML，让搜索引擎更容易抓取关键内容。",
        detail: "SEO 不只靠 SSR，还包括 metadata、语义化结构、性能指标、sitemap 和结构化数据。",
        followUp: "纯 CSR 页面为什么首屏内容可能不利于 SEO？",
      },
      {
        question: "App Router 的缓存要注意什么？",
        shortAnswer: "fetch、route segment 和 revalidate 都可能参与缓存，需要明确数据是否可缓存。",
        detail: "面试里重点讲清楚默认缓存、按请求动态渲染、revalidate 更新和手动失效的边界。",
        followUp: "什么情况下应该使用 no-store？",
      },
    ],
  },
  {
    id: "js",
    title: "JavaScript 高频题",
    description: "用可运行函数验证闭包、原型、Promise、事件循环和常见手写题。",
    focus: ["闭包", "原型链", "this", "Promise", "手写函数"],
    questions: [
      {
        question: "事件循环如何解释 Promise 和 setTimeout 的顺序？",
        shortAnswer: "同步代码先执行，微任务队列清空后，再进入下一个宏任务。",
        detail:
          "Promise then、queueMicrotask 属于微任务；setTimeout、setInterval、I/O 回调通常按宏任务理解。",
        followUp: "async/await 后面的代码属于同步还是微任务？",
      },
      {
        question: "闭包是什么？",
        shortAnswer: "函数可以记住并访问其词法作用域中的变量，即使外层函数已经执行结束。",
        detail: "闭包常用于封装私有状态、函数工厂、缓存，也会导致旧值读取和内存占用问题。",
        followUp: "React hooks 中的闭包陷阱怎么产生？",
      },
      {
        question: "原型链查找规则是什么？",
        shortAnswer: "先查对象自身属性，找不到再沿着 [[Prototype]] 逐级向上查找。",
        detail: "构造函数的 prototype 会成为实例的原型，class 本质上仍建立在原型机制之上。",
        followUp: "instanceof 是如何判断的？",
      },
    ],
  },
  {
    id: "state",
    title: "状态管理高频题",
    description: "同一个 todo/filter 需求分别用 Redux Toolkit 和 Zustand 实现，并沉淀对比口径。",
    focus: ["Redux Toolkit", "Zustand", "Context 对比", "异步状态", "selector"],
    questions: [
      {
        question: "什么时候需要状态管理库？",
        shortAnswer: "当状态跨页面/跨层级共享、更新路径复杂、需要调试和约束时，状态管理库更合适。",
        detail:
          "局部 UI 状态留在组件内，全局业务状态再提升到 store。不要为了简单弹窗或 input 过早引入全局状态。",
        followUp: "Context 能不能替代 Redux？",
      },
      {
        question: "Redux Toolkit 和 Zustand 怎么选？",
        shortAnswer:
          "Redux Toolkit 更规范、生态强、适合复杂协作；Zustand 更轻、更直接，适合中小规模状态。",
        detail:
          "Redux 的优势是可预测、DevTools、middleware 和团队约束；Zustand 的优势是样板少、使用心智简单。",
        followUp: "异步请求和派生状态分别怎么组织？",
      },
    ],
  },
];
