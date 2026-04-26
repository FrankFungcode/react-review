export type CarbonQuestion = {
  category: "Next.js" | "React" | "状态管理" | "工程化" | "AI 通信" | "安全与 SDD";
  question: string;
  shortAnswer: string;
  detail: string;
  talkingPoints?: string[];
  codeExample?: string;
};

export const carbonCategories: CarbonQuestion["category"][] = [
  "Next.js",
  "React",
  "状态管理",
  "工程化",
  "AI 通信",
  "安全与 SDD",
];

export const carbonQuestions: CarbonQuestion[] = [
  {
    category: "Next.js",
    question: "Page Router 和 App Router 在 middleware 上有什么区别？底层实现有什么区别？",
    shortAnswer:
      "middleware 文件位置和能力基本一致，都会在请求进入路由前运行；区别主要在后续路由匹配、渲染管线和数据缓存模型。",
    detail:
      "Page Router 进入的是 pages 目录的传统路由和 SSR/SSG 数据函数模型；App Router 进入的是基于 segment tree、layout、RSC payload、streaming 和缓存策略的路由管线。middleware 本身运行在 Edge Runtime，适合鉴权、重写、重定向、国际化，不适合做重业务逻辑。",
    talkingPoints: [
      "middleware 先于页面渲染执行，可以读取 request、cookie、headers。",
      "App Router 后续会进入服务端组件树和 route segment 缓存模型。",
      "不要在 middleware 里做数据库重查询或复杂计算。",
    ],
    codeExample: `// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};`,
  },
  {
    category: "Next.js",
    question: "现在用了 App Router，RSC 给你带来了什么优化？",
    shortAnswer:
      "RSC 可以减少客户端 JS、让数据获取更靠近服务端、支持流式渲染，并降低客户端 hydration 成本。",
    detail:
      "Server Component 默认在服务端执行，可以直接访问服务端资源，不需要把不参与交互的组件打进客户端 bundle。页面可以把静态展示、数据读取、SEO 内容留在服务端，把真正需要 useState/onClick 的部分下沉到 Client Component。",
    talkingPoints: [
      "减少 bundle size 和 hydration 范围。",
      "更容易把数据获取和组件组合放在一起。",
      "配合 Suspense/streaming 改善首屏可见速度。",
    ],
  },
  {
    category: "Next.js",
    question: "动态路由有哪几种实现方式？",
    shortAnswer: "常见有单段动态路由、catch-all、optional catch-all，以及查询参数驱动的动态渲染。",
    detail:
      "Page Router 使用 `[id].tsx`、`[...slug].tsx`、`[[...slug]].tsx`；App Router 使用同样的目录语义，例如 `app/blog/[slug]/page.tsx`。如果动态路径可枚举，可以配合 `generateStaticParams` 做静态生成。",
    codeExample: `// app/products/[id]/page.tsx
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <h1>Product {params.id}</h1>;
}`,
  },
  {
    category: "Next.js",
    question: "Next.js 有哪些缓存策略？",
    shortAnswer:
      "App Router 里常见缓存包括 request memoization、Data Cache、Full Route Cache、Router Cache 和 revalidate。",
    detail:
      "面试时不要只说浏览器缓存。Next.js 会对服务端 fetch、页面结果、客户端路由缓存分别处理。可用 `cache: 'no-store'` 强制动态，用 `next: { revalidate }` 做时间再验证，用 tag/path 做手动失效。",
    codeExample: `await fetch("https://api.example.com/posts", {
  next: { revalidate: 60 },
});

await fetch("https://api.example.com/me", {
  cache: "no-store",
});`,
  },
  {
    category: "Next.js",
    question: "Next.js 路由重写用过吗？做过什么场景？",
    shortAnswer:
      "rewrites 可以让用户访问路径和真实资源路径解耦，常用于代理 API、灰度迁移、旧 URL 兼容和多语言路径。",
    detail:
      "rewrites 不会改变浏览器地址栏，redirects 会改变地址栏。面试里可以举例：前端访问 `/api/proxy/*`，实际转发到后端网关；或旧站 `/news/:id` 平滑映射到新站 `/articles/:id`。",
    codeExample: `// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://backend.example.com/:path*",
      },
    ];
  },
};`,
  },
  {
    category: "Next.js",
    question: "针对 Page Speed 和 SEO，可以做哪些优化？H1 和 H3 可以直接跨越吗？",
    shortAnswer:
      "SEO 需要内容可抓取、语义结构清晰、性能好、metadata 完整；标题层级最好按语义递进，不建议为了样式从 H1 直接跳到 H3。",
    detail:
      "Page Speed 重点看 LCP、INP、CLS。SEO 除了 SSR/SSG，还要做 title/description、canonical、sitemap、robots、结构化数据、图片 alt、语义化 heading。H1 到 H3 不是浏览器错误，但会削弱文档结构，可用 CSS 调样式而不是乱用 heading。",
    talkingPoints: [
      "优化 LCP 图片和关键 CSS。",
      "保持一个页面主 H1。",
      "用 Lighthouse/Search Console 验证。",
    ],
  },
  {
    category: "Next.js",
    question: "针对 SEO，一个网站可以做哪些事情？",
    shortAnswer:
      "从技术 SEO、内容 SEO、结构化数据和性能四个方向做：可抓取、可理解、加载快、内容有价值。",
    detail:
      "技术侧包括 SSR/SSG、metadata、canonical、sitemap、robots、语义化标签、结构化数据、国际化 hreflang。内容侧包括关键词、标题摘要、内链、面包屑、图片 alt。性能侧关注 Core Web Vitals。",
  },
  {
    category: "Next.js",
    question: "Next.js 首屏优化会做哪些调整？",
    shortAnswer:
      "优先优化 LCP、减少客户端 JS、合理拆分 Client Component、使用 streaming/Suspense、图片优化和缓存。",
    detail:
      "App Router 里尽量让展示型内容保持 Server Component；首屏关键数据在服务端取，非关键区域用 Suspense 延迟；图片用 next/image 并设置尺寸和 priority；减少第三方脚本阻塞。",
  },
  {
    category: "React",
    question: "UI 响应式优化怎么做？媒体查询和业务断点怎么选？",
    shortAnswer:
      "基础布局用设计系统断点，复杂业务用内容驱动断点，核心目标是避免拥挤、溢出和低效操作。",
    detail:
      "不要只按设备名写样式。先确定组件在不同宽度下的信息优先级：导航是否折叠、表格是否改卡片、筛选是否抽屉化。Tailwind 可以用 `sm/md/lg/xl` 处理通用断点，业务组件可用容器宽度或局部 grid 规则。",
  },
  {
    category: "React",
    question: "React 18 的 Fiber 能说一下吗？",
    shortAnswer:
      "Fiber 是 React 的可中断工作单元和树结构，让渲染可以被拆分、暂停、恢复和按优先级调度。",
    detail:
      "旧 reconciler 递归遍历一旦开始不容易中断。Fiber 把组件树表示成链表式节点，每个 fiber 记录 type、props、state、effect、child/sibling/return 等信息。这样 React 可以在 render 阶段分片工作，在 commit 阶段一次性提交副作用。",
  },
  {
    category: "React",
    question: "时间切片是怎么实现的？用了什么 API？",
    shortAnswer: "React 通过 Scheduler 按优先级调度任务，并在浏览器空闲或时间片用尽时让出主线程。",
    detail:
      "实现上 React Scheduler 会维护任务队列，现代环境常借助 MessageChannel 等机制安排回调，并根据 deadline 判断是否继续工作。它不是直接依赖 requestIdleCallback，因为兼容性和调度稳定性不够。",
  },
  {
    category: "React",
    question: "React 18 的并发渲染和状态撕裂是什么？",
    shortAnswer: "并发渲染允许渲染可中断；状态撕裂是同一 UI 在并发过程中读到不一致外部状态的问题。",
    detail:
      "React 内部 state 可以由调度保证一致性，但外部 store 如果订阅方式不规范，可能出现组件 A 读新值、组件 B 读旧值。React 18 提供 `useSyncExternalStore` 作为外部 store 的标准订阅协议。",
    codeExample: `const value = useSyncExternalStore(
  store.subscribe,
  store.getSnapshot,
  store.getServerSnapshot,
);`,
  },
  {
    category: "状态管理",
    question: "做 React 用过哪些状态管理工具？怎么选？",
    shortAnswer:
      "常见有 React state、Context、Redux Toolkit、Zustand、TanStack Query。按状态性质选择，而不是统一塞进一个库。",
    detail:
      "局部交互状态放组件；低频跨层级配置用 Context；复杂客户端业务状态用 Redux/Zustand；服务端缓存状态优先 TanStack Query/SWR。面试要强调 server state 和 client state 的区别。",
  },
  {
    category: "状态管理",
    question: "Zustand 是单例 store，业务组件怎么做多实例？",
    shortAnswer:
      "不要直接共享全局 hook，而是在组件边界创建 vanilla store，并通过 Context 注入不同实例。",
    detail:
      "全局 `create()` 适合应用级单例。如果一个业务组件要在同页出现多份且状态隔离，可以用 `createStore` 生成 store 实例，再用 Provider 把实例传给子树。",
    codeExample: `import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

type CounterStore = { count: number; inc: () => void };
const StoreContext = createContext<ReturnType<typeof createCounterStore> | null>(null);

function createCounterStore() {
  return createStore<CounterStore>((set) => ({
    count: 0,
    inc: () => set((state) => ({ count: state.count + 1 })),
  }));
}

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCounterStore>>();
  storeRef.current ??= createCounterStore();
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
}

export function useCounter<T>(selector: (state: CounterStore) => T) {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Missing CounterProvider");
  return useStore(store, selector);
}`,
  },
  {
    category: "React",
    question: "useCallback 为什么不能滥用？",
    shortAnswer:
      "useCallback 本身也有成本，只有在稳定函数引用能减少子组件渲染或避免 effect 重跑时才有价值。",
    detail:
      "如果子组件没有 React.memo，或者函数没有作为依赖传入 memo/effect，useCallback 往往只是增加心智负担。它还可能因为依赖数组变化频繁而失去缓存意义。",
    talkingPoints: [
      "先定位性能问题。",
      "关注引用稳定性是否真的被消费。",
      "避免为了“看起来优化”到处包。",
    ],
  },
  {
    category: "React",
    question: "A 组件销毁、B 组件挂载时，它们的 useEffect 执行时机是什么？",
    shortAnswer:
      "commit 完成后，React 会先执行旧 effect 的 cleanup，再执行新 effect 的回调；layout effect 更早，在浏览器绘制前处理。",
    detail:
      "切换 A 到 B 时，DOM 提交后，A 的 passive effect cleanup 会在 passive effect flush 阶段执行，随后 B 的 passive effect callback 执行。`useLayoutEffect` 的 cleanup/create 在 commit 阶段同步处理，会阻塞绘制。",
  },
  {
    category: "工程化",
    question: "monorepo + pnpm 遇到幽灵依赖怎么避免和修复？",
    shortAnswer:
      "幽灵依赖是包使用了自己没声明的依赖。pnpm 的非扁平 node_modules 更容易暴露它，修复方式是显式声明依赖。",
    detail:
      "在 monorepo 中，每个 package 都要在自己的 package.json 写清 dependencies/devDependencies。不要依赖根目录或兄弟包偶然安装的依赖。可以用 pnpm workspace、lint 规则、CI install/build 来提前发现。",
    codeExample: `# 检查依赖归属
pnpm why lodash

# 在具体包中补依赖
pnpm --filter @app/web add lodash`,
  },
  {
    category: "AI 通信",
    question: "AI 项目前后端通信用 SSE 还是 WebSocket？",
    shortAnswer:
      "LLM 单向流式输出优先 SSE；需要双向实时协作、多人状态同步或低延迟双向消息时用 WebSocket。",
    detail:
      "SSE 基于 HTTP，天然支持文本流、自动重连、服务端到客户端推送，适合聊天回答流。WebSocket 是全双工，适合白板、游戏、实时协作。很多 AI Chat 场景用 POST 创建任务，再用 SSE 接收 token。",
  },
  {
    category: "AI 通信",
    question: "SSE 过程中如何做中断和重连？",
    shortAnswer:
      "中断用 AbortController 或关闭 EventSource；重连要带上 conversationId/messageId/lastEventId，让后端支持续传或幂等恢复。",
    detail:
      "浏览器原生 EventSource 支持自动重连和 Last-Event-ID，但只支持 GET。若用 fetch 读取 ReadableStream，可以用 AbortController 精准中断，并在应用层维护 offset 或 event id。",
    codeExample: `const controller = new AbortController();

async function stream() {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    body: JSON.stringify({ prompt, lastEventId }),
    signal: controller.signal,
  });

  const reader = res.body?.getReader();
  while (reader) {
    const { value, done } = await reader.read();
    if (done) break;
    appendChunk(new TextDecoder().decode(value));
  }
}

function stop() {
  controller.abort();
}`,
  },
  {
    category: "AI 通信",
    question: "后端吐字粒度不均匀，如何保证界面打字效果均匀？",
    shortAnswer: "把网络接收和 UI 展示解耦：先进入缓冲队列，再用固定节奏消费字符或词。",
    detail:
      "后端可能一次返回一句话，也可能返回一个词。前端不要每来一块就直接 setState 展示，可以维护 buffer，用 requestAnimationFrame 或 setInterval 按固定速率取出若干字符；流结束后加速清空剩余内容。",
    codeExample: `const buffer: string[] = [];
let visible = "";

function onChunk(chunk: string) {
  buffer.push(...chunk);
}

setInterval(() => {
  const next = buffer.splice(0, 2).join("");
  if (next) {
    visible += next;
    render(visible);
  }
}, 32);`,
  },
  {
    category: "安全与 SDD",
    question: "后端给 Markdown，前端能直接用 dangerouslySetInnerHTML 塞进 DOM 吗？",
    shortAnswer:
      "不能直接塞。Markdown 必须先解析，再经过白名单 sanitize，代码高亮也要避免注入 HTML。",
    detail:
      "`dangerouslySetInnerHTML` 本身不是问题，问题是内容是否可信。用户输入或模型输出都应视为不可信。推荐 markdown parser + DOMPurify/rehype-sanitize，并限制链接协议、图片来源和 HTML 标签。",
    codeExample: `import DOMPurify from "dompurify";
import { marked } from "marked";

const html = marked.parse(markdown);
const safeHtml = DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
});

return <article dangerouslySetInnerHTML={{ __html: safeHtml }} />;`,
  },
  {
    category: "安全与 SDD",
    question: "SDD 模式开发中生成的 MD 文档会带到项目里吗？",
    shortAnswer:
      "会带进项目，但要经过筛选和结构化沉淀：稳定的需求、设计决策、接口约定、验收标准应该入仓；临时推理、草稿、敏感信息和一次性对话上下文不应该直接提交。",
    detail:
      "我会把 SDD 生成的 Markdown 当成工程资产，而不是聊天记录。它的价值是让需求来源、技术取舍、边界条件和验收标准可追踪，方便后续评审、回归测试、交接和排查问题。落到项目里时，一般会分成 specs、ADR、API contract、test plan、runbook 几类：需求和用户故事放 specs；关键技术选择放 ADR；前后端字段、错误码、状态流转放 API 或 contract；验收场景放 test plan；部署、监控、回滚放 runbook。真正写代码时，PR 也会引用对应文档，保证实现没有偏离规格。需要注意的是，不是所有 AI 生成内容都适合入仓：模型的推理过程、未确认方案、包含账号/token/客户数据的内容、已经过期的临时草稿，都要删除或脱敏。我的原则是：文档要能服务团队协作和长期维护，而不是把噪音搬进仓库。",
    talkingPoints: [
      "回答时先表态：会带，但不是原样全量带，而是清洗后沉淀。",
      "说明文档分类：specs 管需求，ADR 管决策，contract 管接口，test plan 管验收。",
      "强调和研发流程结合：需求评审、PR、测试用例、回归和新人交接都能引用这些文档。",
      "补充风险控制：去掉敏感信息、临时推理、过期草稿，避免文档和代码长期不一致。",
      "最后落到收益：减少口口相传，让上下文可追踪、可复盘、可审计。",
    ],
    codeExample: `docs/
  specs/
    chat-streaming.md          # 需求、用户故事、边界条件
  adr/
    0003-use-sse-for-llm.md    # 为什么选 SSE，而不是 WebSocket
  contracts/
    chat-api.md                # 请求字段、响应事件、错误码
  test-plans/
    chat-streaming.md          # 验收场景、异常重连、回归清单
  runbooks/
    chat-service.md            # 发布、监控、降级、回滚

# PR 描述里引用
Spec: docs/specs/chat-streaming.md
ADR: docs/adr/0003-use-sse-for-llm.md
Test Plan: docs/test-plans/chat-streaming.md`,
  },
];
