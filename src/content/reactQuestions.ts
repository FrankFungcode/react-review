export type ReactQuestionCategory =
  | "React 基础与组件模型"
  | "Hooks 与闭包"
  | "渲染机制、Fiber 与并发"
  | "性能优化与 React Compiler"
  | "React 18/19 新特性"
  | "状态管理与数据流"
  | "工程实践、测试与可维护性";

export type ReactQuestion = {
  category: ReactQuestionCategory;
  question: string;
  shortAnswer: string;
  detail: string;
  talkingPoints?: string[];
  followUp?: string;
  codeExample?: string;
};

export const reactQuestionCategories: ReactQuestionCategory[] = [
  "React 基础与组件模型",
  "Hooks 与闭包",
  "渲染机制、Fiber 与并发",
  "性能优化与 React Compiler",
  "React 18/19 新特性",
  "状态管理与数据流",
  "工程实践、测试与可维护性",
];

export const reactQuestions: ReactQuestion[] = [
  {
    category: "React 基础与组件模型",
    question: "React 组件为什么会重新渲染？",
    shortAnswer:
      "常见触发源是自身 state 更新、父组件重新渲染、Context 值变化、外部 store 订阅变化。",
    detail:
      "面试里要区分 render 和 DOM 更新。组件函数重新执行会生成新的 React element tree，React 再通过 diff 判断真实 DOM 是否需要更新。重新渲染不一定等于性能问题，关键看渲染范围、计算成本和提交频率。",
    talkingPoints: [
      "先说触发源，再说 render 与 commit 的区别。",
      "React.memo 只能在 props 浅比较稳定时减少子组件 render。",
      "定位性能问题优先用 React DevTools Profiler。",
    ],
    followUp: "父组件 render 了，子组件一定会更新 DOM 吗？",
  },
  {
    category: "React 基础与组件模型",
    question: "JSX 到真实 DOM 的过程是什么？",
    shortAnswer:
      "JSX 会被编译成 React element，对应组件树经过 render/reconcile 生成 work-in-progress fiber，commit 阶段再更新 DOM。",
    detail:
      "JSX 不是模板字符串，而是描述 UI 的语法糖。函数组件返回 React element，React 根据 element 的 type、key、props 构建或复用 fiber 节点，render 阶段计算变更，commit 阶段一次性执行 DOM mutation、ref 和 effect 生命周期。",
    talkingPoints: [
      "JSX 编译产物是对象描述，不是直接 DOM。",
      "render 阶段可被中断，commit 阶段必须同步完成。",
      "Diff 依赖 type 和 key 判断节点身份。",
    ],
    followUp: "为什么组件函数不能直接产生副作用？",
    codeExample: `const element = <button className="primary">Save</button>;

// Modern JSX transform compiles it into an element description.
const compiled = {
  type: "button",
  props: { className: "primary", children: "Save" },
};`,
  },
  {
    category: "React 基础与组件模型",
    question: "Virtual DOM 和 Diff 的核心价值是什么？",
    shortAnswer:
      "Virtual DOM 提供跨平台 UI 描述和声明式更新模型，Diff 用启发式规则把比较成本控制在可接受范围。",
    detail:
      "Virtual DOM 不一定比手写 DOM 更快，它的价值在于让开发者用状态描述 UI，React 统一调度、批处理和最小化提交。Diff 默认不同 type 直接替换，同层列表依赖 key 判断身份，避免通用树编辑算法的高复杂度。",
    talkingPoints: [
      "不要回答成“Virtual DOM 一定更快”。",
      "强调声明式、跨平台、批处理和可调度。",
      "Diff 是启发式，不是完整最优树编辑。",
    ],
    followUp: "为什么不同 type 的节点会整棵子树重建？",
  },
  {
    category: "React 基础与组件模型",
    question: "key 的作用是什么，为什么不建议用 index？",
    shortAnswer:
      "key 用于在同级列表中标识元素身份，index 在插入、删除、排序时会导致状态错位或不必要复用。",
    detail:
      "React 根据 key 判断旧节点和新节点是否是同一个逻辑实体。稳定 key 能让输入框值、局部 state 和动画状态跟随数据项；index key 跟随位置，列表顺序变化时就可能把 A 的状态复用到 B 上。",
    talkingPoints: [
      "key 只在兄弟节点之间需要唯一。",
      "稳定业务 id 优先于数组下标。",
      "故意改 key 可以强制重置组件状态。",
    ],
    followUp: "什么时候可以安全使用 index 作为 key？",
  },
  {
    category: "React 基础与组件模型",
    question: "受控组件和非受控组件怎么选？",
    shortAnswer:
      "需要校验、联动、回显和可预测状态时用受控；一次性读取、文件上传或超大表单局部优化时可用非受控。",
    detail:
      "受控组件的值由 React state 驱动，任何输入变化都会进入 React 数据流。非受控组件让 DOM 保存当前值，通过 ref 在提交时读取。大型表单常用混合策略：关键字段受控，低频字段或文件输入交给 DOM 或表单库管理。",
    talkingPoints: [
      "受控强调单一数据源。",
      "非受控不是落后方案，而是减少高频输入 render 的工具。",
      "文件 input 通常是非受控。",
    ],
    followUp: "为什么大型表单库常避免每个输入都绑定全局状态？",
  },
  {
    category: "React 基础与组件模型",
    question: "props、state、context 的边界分别是什么？",
    shortAnswer:
      "props 表达父子输入，state 表达组件自身可变状态，context 表达跨层级共享的低频依赖。",
    detail:
      "props 应保持单向数据流，state 应尽量靠近使用它的组件，context 适合主题、语言、登录用户等低频变化值。高频业务数据或复杂派生状态直接塞进 context 容易让订阅者大面积重渲染。",
    talkingPoints: [
      "先把状态放在最近共同父级，而不是默认全局化。",
      "Context 是依赖注入，不是完整状态管理方案。",
      "复杂服务端数据优先考虑查询缓存库。",
    ],
    followUp: "Context 能完全替代 Redux 吗？",
  },
  {
    category: "Hooks 与闭包",
    question: "Hooks 为什么必须按固定顺序调用？",
    shortAnswer:
      "React 依赖 Hooks 的调用顺序把每次调用和内部状态槽位对应起来，条件调用会打乱对应关系。",
    detail:
      "函数组件每次 render 都会重新执行。React 在 fiber 上按顺序保存 hook 链表，如果某次 render 少调用或多调用一个 hook，后续 state/effect 就会对应到错误槽位，所以 Hooks 必须在组件或自定义 Hook 顶层调用。",
    talkingPoints: [
      "不能放在 if、for、普通回调里。",
      "自定义 Hook 也必须遵守相同规则。",
      "eslint-plugin-react-hooks 用静态规则提前发现问题。",
    ],
    followUp: "条件逻辑应该放在 Hook 外面还是 Hook 里面？",
  },
  {
    category: "Hooks 与闭包",
    question: "useEffect 依赖数组应该怎么写？",
    shortAnswer:
      "effect 中读取的响应式值都应进入依赖数组，依赖数组描述同步关系，不是手动调度开关。",
    detail:
      "缺依赖会让 effect 读到旧闭包，多依赖通常提示 effect 职责过宽。正确做法是拆分 effect、把非响应式逻辑移出组件、用函数式更新减少依赖，或把事件逻辑放回事件处理器。",
    talkingPoints: [
      "依赖数组不是“只运行一次”的魔法开关。",
      "cleanup 会在下一次 effect 执行前和卸载时运行。",
      "对象/函数依赖频繁变化时先检查是否真的需要 effect。",
    ],
    followUp: "如何避免 effect 里请求无限循环？",
  },
  {
    category: "Hooks 与闭包",
    question: "useEffect、useLayoutEffect、useInsertionEffect 区别是什么？",
    shortAnswer:
      "useEffect 在浏览器绘制后异步执行，useLayoutEffect 在 DOM 提交后绘制前同步执行，useInsertionEffect 主要给 CSS-in-JS 在样式插入阶段使用。",
    detail:
      "大多数副作用使用 useEffect。需要测量布局并同步修正 UI，才考虑 useLayoutEffect，因为它会阻塞绘制。useInsertionEffect 更底层，适合样式库在 layout effect 前插入样式，业务代码通常不需要。",
    talkingPoints: [
      "默认选 useEffect。",
      "layout effect 适合测量 DOM、同步滚动位置等少数场景。",
      "不要用 layout effect 承载重逻辑。",
    ],
    followUp: "为什么 useLayoutEffect 在 SSR 场景容易有警告？",
  },
  {
    category: "Hooks 与闭包",
    question: "React Hooks 闭包陷阱如何产生，怎么解决？",
    shortAnswer:
      "每次 render 都创建新的词法作用域，异步回调如果捕获旧 render 的变量，就会读到旧值。",
    detail:
      "典型场景是定时器、订阅回调、Promise 回调和事件监听。解决方式包括补齐依赖、使用函数式 setState、把最新值同步到 ref、在 effect 中正确清理并重新订阅。",
    talkingPoints: [
      "闭包陷阱不是 React 特有，但 Hooks 更容易暴露。",
      "函数式更新适合依赖上一次 state 的更新。",
      "ref 保存最新值时不会触发 render。",
    ],
    followUp: "为什么 setInterval 里 count 一直是 0？",
    codeExample: `setCount((current) => current + 1);

const latestValue = useRef(value);
useEffect(() => {
  latestValue.current = value;
}, [value]);`,
  },
  {
    category: "Hooks 与闭包",
    question: "自定义 Hook 如何设计，如何避免隐藏副作用？",
    shortAnswer:
      "自定义 Hook 应封装可复用状态逻辑，输入输出清晰，副作用边界明确，并遵守 Hooks 规则。",
    detail:
      "好的自定义 Hook 像一个小型协议：参数说明依赖什么，返回值说明暴露什么能力，内部 effect 只处理必要同步。不要在 Hook 里偷偷发全局事件、改外部单例或制造难以测试的隐式行为。",
    talkingPoints: [
      "命名以 use 开头，让规则和工具生效。",
      "返回稳定 API 时再考虑 useMemo/useCallback。",
      "订阅类 Hook 要处理 cleanup 和 SSR fallback。",
    ],
    followUp: "一个 Hook 返回对象时如何避免消费者 effect 重跑？",
  },
  {
    category: "渲染机制、Fiber 与并发",
    question: "Fiber 是什么，为什么它让渲染可中断？",
    shortAnswer:
      "Fiber 是 React 的可中断工作单元和树节点结构，使 render 阶段能拆分、暂停、恢复和按优先级调度。",
    detail:
      "旧的递归 reconciler 一旦开始遍历就不容易让出主线程。Fiber 把组件树拆成带 child、sibling、return 指针的节点，每个节点记录 props、state、effect 等信息。React 可以逐个 fiber 执行工作，在合适时机让出主线程。",
    talkingPoints: [
      "Fiber 既是数据结构，也是调度粒度。",
      "render 阶段可中断，commit 阶段不可中断。",
      "并发能力依赖 Fiber 和 Scheduler 协作。",
    ],
    followUp: "为什么可中断发生在 render 阶段，而不是 commit 阶段？",
  },
  {
    category: "渲染机制、Fiber 与并发",
    question: "render 阶段和 commit 阶段有什么区别？",
    shortAnswer:
      "render 阶段计算变更并构建 work-in-progress tree，commit 阶段把变更提交到宿主环境并执行副作用。",
    detail:
      "render 阶段应该保持纯净，可以被暂停、丢弃和重试。commit 阶段会执行 DOM 更新、ref 更新、layout effect 和 passive effect 调度。面试中可以用“算账”和“落账”来区分两阶段。",
    talkingPoints: [
      "render 阶段不要读写 DOM 或发请求。",
      "commit 阶段才有真实 DOM mutation。",
      "StrictMode 开发环境重复调用能暴露不纯 render。",
    ],
    followUp: "为什么在组件函数体里发请求会有风险？",
  },
  {
    category: "渲染机制、Fiber 与并发",
    question: "React 18 自动批处理是什么？",
    shortAnswer: "React 18 会在更多异步边界中批量合并多个 state 更新，减少重复 render。",
    detail:
      "在 React 18 createRoot 下，事件处理、Promise、setTimeout、原生事件等场景里的多个 setState 更可能被合并成一次渲染。需要立即读取 DOM 更新结果时，可以少量使用 flushSync，但不应滥用。",
    talkingPoints: [
      "自动批处理降低重复 render 次数。",
      "不是把所有更新都同步执行。",
      "flushSync 是逃生口，不是默认方案。",
    ],
    followUp: "React 17 和 React 18 在 Promise 回调里的批处理有什么差异？",
  },
  {
    category: "渲染机制、Fiber 与并发",
    question: "并发渲染不等于多线程，应该怎么解释？",
    shortAnswer:
      "React 并发渲染是在主线程上做可中断、可优先级调度的渲染，不是把组件放到多个线程同时执行。",
    detail:
      "并发的价值是让紧急更新优先，比如输入响应优先于大列表筛选。React 可以开始渲染一个版本，在更高优先级更新到来时暂停或丢弃旧工作，再继续新工作。最终 commit 仍然要保持 UI 一致性。",
    talkingPoints: [
      "并发是调度模型，不是多线程模型。",
      "中断的是 render work，不是已经提交的 DOM。",
      "用户输入、动画和页面导航更容易保持响应。",
    ],
    followUp: "什么场景需要 startTransition？",
  },
  {
    category: "性能优化与 React Compiler",
    question: "useMemo、useCallback、React.memo 分别解决什么问题？",
    shortAnswer: "useMemo 缓存计算结果，useCallback 缓存函数引用，React.memo 缓存组件渲染结果。",
    detail:
      "三者都不是默认必须加的性能开关。useMemo 适合昂贵计算或稳定对象引用；useCallback 适合函数引用被 memo 子组件或 effect 依赖消费；React.memo 适合 props 相对稳定且渲染成本较高的纯组件。",
    talkingPoints: [
      "先测量，再优化。",
      "memo 依赖浅比较，引用不稳定会失效。",
      "过度 memo 会增加依赖维护和比较成本。",
    ],
    followUp: "为什么给每个函数都包 useCallback 反而可能变差？",
  },
  {
    category: "性能优化与 React Compiler",
    question: "为什么不能滥用 useCallback/useMemo？",
    shortAnswer:
      "它们本身有创建、依赖比较和心智成本，只有缓存结果被实际消费并能减少成本时才有价值。",
    detail:
      "如果子组件没有 memo，或者计算本身很便宜，memoization 很可能只是增加代码复杂度。更重要的是，错误依赖可能带来旧值 bug。性能优化应该从交互卡顿、重渲染范围和耗时计算定位开始。",
    talkingPoints: [
      "避免“看起来优化”。",
      "关注引用稳定性是否真的影响下游。",
      "依赖数组正确性优先于少一次 render。",
    ],
    followUp: "React Compiler 出现后还需要手写 useMemo 吗？",
  },
  {
    category: "性能优化与 React Compiler",
    question: "React Compiler 对 React.memo/useMemo/useCallback 的影响是什么？",
    shortAnswer:
      "React Compiler 会在构建期自动分析并 memoize 安全的组件和值，但手写 memo 仍可作为精确控制和逃生口。",
    detail:
      "官方文档建议新代码优先依赖 Compiler 做自动 memoization，在需要精确控制时再使用 useMemo/useCallback。Compiler 也会尽量保留已有手动 memo 语义。这个项目当前仍运行 React 18.3.1，Compiler 属于当前生态和面试热点，不代表项目已启用。",
    talkingPoints: [
      "Compiler 是构建期优化，不是运行时 Hook。",
      "它依赖组件和 Hook 保持纯净、遵守 React 规则。",
      "手动 memo 不会立刻消失，但会更偏向特殊场景。",
    ],
    followUp: "什么代码模式会让 Compiler 难以优化？",
  },
  {
    category: "性能优化与 React Compiler",
    question: "大列表、长文本、流式内容如何优化渲染？",
    shortAnswer: "核心是减少渲染范围、降低更新频率、分离紧急与非紧急更新，并对长列表做虚拟化。",
    detail:
      "大列表优先虚拟化，只渲染可视区域。长文本和流式 token 不要每来一个字符就 setState，可以使用 ref buffer 加 requestAnimationFrame 或节流批量提交。搜索筛选可以配合 useDeferredValue 或 transition 保持输入响应。",
    talkingPoints: [
      "虚拟化解决 DOM 数量问题。",
      "批量刷新解决高频 setState 问题。",
      "transition/deferred value 解决响应优先级问题。",
    ],
    followUp: "AI Chat token streaming 为什么容易造成 React 卡顿？",
  },
  {
    category: "React 18/19 新特性",
    question: "useTransition 适合什么场景？",
    shortAnswer:
      "useTransition 适合把非紧急 UI 更新标记为 Transition，让输入、点击等紧急交互先响应。",
    detail:
      "典型场景是 tab 切换、路由跳转、大列表筛选和图表更新。Transition 更新是可中断的，React 可以先处理用户输入，再在后台完成较重渲染。它不是防抖，也不能直接控制受控输入的 value 更新。",
    talkingPoints: [
      "紧急更新：输入框 value、按钮反馈。",
      "非紧急更新：搜索结果、页面内容切换。",
      "isPending 可用于显示轻量 pending 状态。",
    ],
    followUp: "为什么不能把受控输入 setValue 放进 transition？",
  },
  {
    category: "React 18/19 新特性",
    question: "useDeferredValue 和 debounce 有什么区别？",
    shortAnswer: "useDeferredValue 延后渲染某个值的派生 UI，debounce 延后触发某个操作或副作用。",
    detail:
      "useDeferredValue 没有固定时间延迟，它让 React 先用旧值保持界面响应，再在后台渲染新值。debounce 常用于减少请求、日志或计算触发频率。useDeferredValue 不会自动减少网络请求，数据请求仍需单独控制。",
    talkingPoints: [
      "deferred value 是渲染优先级工具。",
      "debounce 是时间窗口工具。",
      "两者可以组合，但解决的问题不同。",
    ],
    followUp: "搜索建议场景应该选哪个？",
  },
  {
    category: "React 18/19 新特性",
    question: "Suspense 解决什么问题，和 loading 状态有什么关系？",
    shortAnswer:
      "Suspense 声明某个子树在等待异步资源时的 fallback 边界，减少手写 loading 状态散落。",
    detail:
      "Suspense 不是普通 Promise 捕获器，而是 React 与支持 Suspense 的数据源、lazy component 或框架集成后的渲染边界。它可以配合 streaming、路由和 Server Components 改善加载体验。",
    talkingPoints: [
      "边界放在哪里决定 fallback 范围。",
      "Transition 可避免已显示内容被 fallback 替换得太突兀。",
      "业务仍需要错误态、空态和重试策略。",
    ],
    followUp: "Suspense 和 Error Boundary 分别负责什么？",
  },
  {
    category: "React 18/19 新特性",
    question: "Error Boundary 能捕获哪些错误，不能捕获哪些？",
    shortAnswer:
      "Error Boundary 捕获子组件渲染、生命周期和构造阶段错误，不能捕获事件处理器、异步回调和服务端渲染错误。",
    detail:
      "Error Boundary 通常用 class component 实现，也可由框架封装。事件处理器里的错误要用 try/catch 或上报逻辑处理；异步请求错误要进入状态或查询库错误通道，再由 UI 展示。",
    talkingPoints: [
      "Error Boundary 是 UI 崩溃隔离边界。",
      "不能替代请求错误处理。",
      "边界粒度要按业务模块放置。",
    ],
    followUp: "为什么一个页面只放最外层 Error Boundary 不够？",
  },
  {
    category: "React 18/19 新特性",
    question: "React 19 Actions、useActionState、useOptimistic 怎么回答？",
    shortAnswer:
      "Actions 把异步提交和状态更新组织成一套交互模型；useActionState 管理 action 返回状态；useOptimistic 管理提交期间的乐观 UI。",
    detail:
      "React 19 强化了表单和异步 action 体验。useActionState 适合把提交结果、错误和 pending 状态跟 action 绑定；useOptimistic 适合先展示用户预期结果，再在服务端确认后收敛。这个项目当前依赖 React 18.3.1，因此这些内容是当前生态面试知识，不代表项目运行时已使用。",
    talkingPoints: [
      "Actions 关注异步交互的状态组织。",
      "optimistic UI 要考虑失败回滚。",
      "React 19 内容要和项目 React 18 runtime 区分。",
    ],
    followUp: "乐观更新失败后应该如何回滚和提示？",
  },
  {
    category: "React 18/19 新特性",
    question: "React Server Components 和 Client Components 区别是什么？",
    shortAnswer:
      "Server Components 在服务端执行并减少客户端 JS，Client Components 才能使用浏览器事件、本地状态和交互 Hooks。",
    detail:
      "RSC 常见于 Next.js App Router 等框架。服务端组件适合数据读取、静态展示和安全访问服务端资源；客户端组件适合 onClick、useState、useEffect、浏览器 API 等交互逻辑。边界设计的关键是让客户端包尽量小。",
    talkingPoints: [
      "RSC 是框架集成能力，不是普通 CSR 项目自动拥有。",
      "不要把整页都标成 client。",
      "服务端组件不能直接使用浏览器交互 Hook。",
    ],
    followUp: "Server Component 能不能把函数 props 传给 Client Component？",
  },
  {
    category: "状态管理与数据流",
    question: "useSyncExternalStore 解决了什么问题？",
    shortAnswer: "它为外部 store 提供标准订阅协议，避免并发渲染中读取外部状态时出现 tearing。",
    detail:
      "React 内部 state 能被调度系统保证一致，但 Redux、Zustand 等外部 store 如果订阅方式不规范，可能在并发渲染中让不同组件读到不同快照。useSyncExternalStore 要求提供 subscribe 和 getSnapshot，让 React 能一致地读取外部状态。",
    talkingPoints: [
      "适合库作者和外部 store 集成。",
      "getSnapshot 返回值需要稳定。",
      "SSR 时可提供 getServerSnapshot。",
    ],
    followUp: "为什么 getSnapshot 每次返回新对象会出问题？",
    codeExample: `const value = useSyncExternalStore(
  store.subscribe,
  store.getSnapshot,
  store.getServerSnapshot,
);`,
  },
  {
    category: "状态管理与数据流",
    question: "Context 为什么可能导致性能问题？",
    shortAnswer:
      "Provider value 变化会让消费该 context 的组件重新渲染，频繁变化的大对象会扩大更新范围。",
    detail:
      "Context 适合低频共享依赖。若把高频业务状态、列表数据和多个不相关字段放到一个 context value，每次变更都会影响所有消费者。优化方式包括拆分 context、稳定 value、selector store 或状态库。",
    talkingPoints: [
      "Context 不是细粒度订阅机制。",
      "Provider value 要避免每次 render 创建无意义新对象。",
      "按变化频率和职责拆分。",
    ],
    followUp: "为什么 useMemo 包 Provider value 不一定解决所有问题？",
  },
  {
    category: "状态管理与数据流",
    question: "Redux/Zustand/Context/TanStack Query 怎么选？",
    shortAnswer:
      "按状态性质选择：Context 管低频依赖，Redux/Zustand 管客户端业务状态，TanStack Query 管服务端缓存状态。",
    detail:
      "Redux Toolkit 适合复杂协作、可追踪更新和中大型项目约束；Zustand 更轻量，适合中小型客户端状态；TanStack Query/SWR 适合请求缓存、重试、失效和同步服务端数据。不要把 server state 当 client state 手动维护。",
    talkingPoints: [
      "先区分 server state 和 client state。",
      "复杂团队协作更看重规范和可调试性。",
      "小范围状态留在组件内。",
    ],
    followUp: "为什么接口数据不建议默认放进 Redux？",
  },
  {
    category: "状态管理与数据流",
    question: "Server State 和 Client State 有什么区别？",
    shortAnswer:
      "Server State 的源头在服务端，涉及缓存、失效和同步；Client State 的源头在浏览器，主要描述本地交互。",
    detail:
      "用户资料、列表数据、权限配置通常属于 server state，需要处理 stale、refetch、pagination、mutation 和错误重试。弹窗开关、当前 tab、表单草稿等属于 client state。混淆两者会导致缓存失效和状态同步复杂化。",
    talkingPoints: [
      "server state 不是简单的全局变量。",
      "mutation 后要考虑失效、乐观更新或回滚。",
      "URL state 是可分享的客户端状态。",
    ],
    followUp: "搜索条件应该放 URL、store 还是本地 state？",
  },
  {
    category: "工程实践、测试与可维护性",
    question: "React 项目如何做组件拆分、测试和可维护性治理？",
    shortAnswer:
      "按业务边界和变化原因拆分组件，用测试覆盖关键交互与状态逻辑，并用 lint/typecheck/CI 约束质量。",
    detail:
      "组件拆分不等于越小越好。展示组件、容器组件、Hook 和数据层边界要服务于可读性和复用。测试上优先覆盖用户行为、状态流转和边界场景。工程治理包括 TypeScript 类型、ESLint/Biome、组件规范、性能 profiling 和可访问性检查。",
    talkingPoints: [
      "以变化原因和职责边界拆分。",
      "测试用户可观察行为，而不是实现细节。",
      "质量门要进入 CI，而不是只靠人工记忆。",
    ],
    followUp: "什么时候应该抽自定义 Hook，什么时候保持在组件里？",
  },
  {
    category: "工程实践、测试与可维护性",
    question: "React 组件设计如何避免 props 膨胀？",
    shortAnswer:
      "优先用组合、children、slot-like API 和小型子组件表达结构，避免大量布尔 props 控制复杂分支。",
    detail:
      "当一个组件出现多个互斥 boolean、样式模式和行为模式时，通常说明抽象过宽。可以把公共结构保留在父组件，把可变部分交给 children 或明确的子组件组合，让调用方更清楚地表达意图。",
    talkingPoints: [
      "布尔 props 多了会形成状态组合爆炸。",
      "组合 API 更适合复杂布局扩展。",
      "设计系统组件要区分基础能力和业务封装。",
    ],
    followUp: "Modal 组件什么时候该暴露 compound components？",
  },
];

export const reactQuestionGroups = reactQuestionCategories.map((category) => ({
  category,
  questions: reactQuestions
    .map((question, index) => ({ index: index + 1, question }))
    .filter(({ question }) => question.category === category),
}));
