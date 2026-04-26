export type CarbonEnhancement = {
  deepDive: string;
  codeExample: string;
  codeExplanation: string[];
};

export const carbonEnhancements: Record<number, CarbonEnhancement> = {
  1: {
    deepDive:
      "更深入地讲，middleware 是请求级别的拦截层，不属于某一个页面组件。Page Router 和 App Router 都会先经过 next.config、headers/redirects/rewrites、middleware、路由匹配这类请求管线；真正不同的是命中路由后的执行模型。Page Router 更像传统页面函数模型，页面组件和 getServerSideProps/getStaticProps 绑定；App Router 则把 URL 拆成 route segment，再组合 layout、template、page、loading、error，并生成 RSC payload。面试时可以把答案拆成三层：middleware 入口能力差异不大，路由树和渲染模型不同，App Router 额外引入 RSC、streaming 和缓存语义。",
    codeExample: `// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = request.cookies.get("locale")?.value ?? "zh-CN";

  if (pathname === "/") {
    return NextResponse.rewrite(new URL(\`/\${locale}/home\`, request.url));
  }

  if (pathname.startsWith("/admin") && !request.cookies.get("token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}`,
    codeExplanation: [
      "`rewrite` 保持浏览器地址不变，但内部改写到新的资源路径，适合国际化、代理和灰度。",
      "`redirect` 会改变地址栏，适合登录态缺失、旧地址迁移这类显式跳转。",
      "middleware 适合轻量请求决策；命中 App Router 后才进入 RSC/segment/layout 的渲染管线。",
    ],
  },
  2: {
    deepDive:
      "RSC 最大的价值不是“服务端也能写组件”这么简单，而是重新划分了前后端边界。以前很多展示型组件虽然没有交互，也会被打进客户端 bundle 并参与 hydration；RSC 让这些组件只在服务端执行，客户端拿到的是可合并的 RSC payload。这样可以减少 JS 体积、降低 hydration 工作量，并且把数据库、内部 API、权限判断这类逻辑留在服务端。面试时也要讲限制：Server Component 不能用 useState/useEffect/onClick，不能直接访问 window；需要交互时要把边界下沉到小的 Client Component。",
    codeExample: `// app/products/page.tsx - Server Component
import AddToCart from "./AddToCart";

export default async function ProductsPage() {
  const products = await getProductsFromDatabase();

  return (
    <section>
      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
          <AddToCart productId={product.id} />
        </article>
      ))}
    </section>
  );
}

// app/products/AddToCart.tsx - Client Component
"use client";
export default function AddToCart({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>加入购物车</button>;
}`,
    codeExplanation: [
      "`ProductsPage` 默认是 Server Component，可以直接在服务端取数，不进入客户端 bundle。",
      "`AddToCart` 需要点击事件，所以单独声明 `use client`，让交互边界尽量小。",
      "这种拆分同时兼顾 SEO、首屏 HTML、bundle size 和交互能力。",
    ],
  },
  3: {
    deepDive:
      "动态路由要区分路径动态和渲染动态。路径动态指 `[id]`、`[...slug]` 这类文件系统路由；渲染动态指页面是否每次请求都重新计算。App Router 中如果动态参数可以提前枚举，配合 generateStaticParams 可以静态化；如果依赖 cookie、headers、searchParams 或 no-store fetch，就会变成动态渲染。面试回答时最好顺带说明 catch-all 和 optional catch-all 的区别：前者至少要有一段，后者没有参数也能匹配。",
    codeExample: `// app/docs/[...slug]/page.tsx
export default function DocsPage({ params }: { params: { slug: string[] } }) {
  return <div>当前文档路径：{params.slug.join("/")}</div>;
}

// /docs/react/hooks -> ["react", "hooks"]

// app/shop/[[...filters]]/page.tsx
export default function ShopPage({ params }: { params: { filters?: string[] } }) {
  return <div>筛选条件：{params.filters?.join(",") ?? "全部"}</div>;
}

// /shop 和 /shop/phone/apple 都能匹配`,
    codeExplanation: [
      "`[...slug]` 是 catch-all，适合文档、CMS、多级分类。",
      "`[[...filters]]` 是 optional catch-all，根路径也能命中。",
      "静态还是动态渲染不只看文件名，还要看数据获取、cookie、headers 和缓存配置。",
    ],
  },
  4: {
    deepDive:
      "Next.js 缓存要按层次回答：同一次服务端渲染里的 request memoization；跨请求持久的 Data Cache；整条路由结果的 Full Route Cache；浏览器内 RSC payload 的 Router Cache；以及 CDN/浏览器 HTTP 缓存。App Router 的难点是默认缓存语义比 Page Router 更强，尤其是 fetch 默认可能进入 Data Cache。实际项目里我会先判断数据性质：公共且可延迟更新的数据用 revalidate；用户私有数据用 no-store；运营内容用 tag/path 失效；纯静态页面交给 Full Route Cache。",
    codeExample: `// 公共列表：允许 60 秒内复用
const posts = await fetch("https://api.example.com/posts", {
  next: { revalidate: 60, tags: ["posts"] },
}).then((res) => res.json());

// 用户信息：每次请求都动态读取
const me = await fetch("https://api.example.com/me", {
  cache: "no-store",
}).then((res) => res.json());

// Server Action 中手动失效
import { revalidateTag } from "next/cache";
revalidateTag("posts");`,
    codeExplanation: [
      "`revalidate: 60` 适合允许短暂陈旧的公共数据。",
      "`cache: 'no-store'` 适合登录用户、权限、余额等强个性化数据。",
      "`revalidateTag` 适合发布文章、更新商品后主动让相关缓存失效。",
    ],
  },
  5: {
    deepDive:
      "路由重写的核心价值是隔离外部 URL 和内部实现。比如后端域名不能暴露、BFF 迁移、旧站 URL 兼容、A/B 测试、国际化路径，都可以用 rewrites。回答时要把 rewrites、redirects、proxy 区分开：rewrite 是内部改写，用户无感；redirect 是显式跳转；代理只是 rewrite 的常见用途之一。还要提醒：rewrite 不等于安全边界，鉴权仍要在后端或 middleware 做。",
    codeExample: `// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/legacy-product/:id",
        destination: "/products/:id",
      },
      {
        source: "/api/gateway/:path*",
        destination: "https://api.example.com/:path*",
      },
    ];
  },
};`,
    codeExplanation: [
      "第一个 rewrite 用于旧 URL 兼容，地址栏仍显示 `/legacy-product/1`。",
      "第二个 rewrite 把前端同源路径转到后端网关，能减少跨域配置复杂度。",
      "敏感接口仍必须由服务端鉴权，不能因为路径被隐藏就认为安全。",
    ],
  },
  6: {
    deepDive:
      "Page Speed 和 SEO 可以合并讲，但最好分开落点。Page Speed 关注用户体验和 Core Web Vitals：LCP 看最大内容渲染速度，INP 看交互响应，CLS 看布局稳定性。SEO 关注搜索引擎能否抓取和理解页面：HTML 是否完整、标题层级是否合理、metadata 是否准确、链接结构是否清晰。H1 到 H3 跳级不是语法错误，但在可访问性和语义上不理想，应该用 CSS 控制视觉大小，而不是用 heading 标签控制样式。",
    codeExample: `<main>
  <h1>React 面试复习</h1>
  <section>
    <h2>Hooks 高频题</h2>
    <article>
      <h3>useEffect 依赖数组怎么写？</h3>
    </article>
  </section>
</main>`,
    codeExplanation: [
      "H1 表达页面主主题，通常一个页面一个主 H1。",
      "H2 表达主要章节，H3 表达章节下的问题或子主题。",
      "如果 H2 视觉上要小，可以用 CSS/Tailwind 调字号，不要跳过语义层级。",
    ],
  },
  7: {
    deepDive:
      "SEO 不只是 SSR。技术 SEO 解决抓取和理解问题，内容 SEO 解决页面是否值得排名，性能 SEO 解决用户体验指标。Next.js 项目里常见动作包括：用 App Router metadata API 生成 title/description/openGraph；用 sitemap.ts 和 robots.ts 暴露抓取规则；用结构化数据告诉搜索引擎页面类型；保证链接是可爬的 a 标签；图片加 alt；多语言站点加 hreflang；同时避免把关键内容放到只有客户端请求后才出现的位置。",
    codeExample: `// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: \`https://example.com/blog/\${params.slug}\`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}`,
    codeExplanation: [
      "`generateMetadata` 可以根据动态文章生成 SEO 信息。",
      "`canonical` 避免同一内容多个 URL 造成权重分散。",
      "Open Graph 服务于社交分享，但也能提升内容结构完整度。",
    ],
  },
  8: {
    deepDive:
      "首屏优化要先量化瓶颈，再选择手段。如果 LCP 慢，优先看首屏图片、字体、服务端响应和关键数据；如果 JS 执行慢，减少 Client Component、拆分大依赖、延迟非关键脚本；如果布局抖动，给图片和广告位预留尺寸。App Router 的优势是可以把非交互部分留在 Server Component，把慢模块用 Suspense 分块流式输出。面试时可以说：我会先 Lighthouse/Web Vitals 定位，再按 LCP、JS、数据、资源、缓存逐项处理。",
    codeExample: `import Image from "next/image";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Image
        src="/hero.png"
        alt="产品主视觉"
        width={1200}
        height={630}
        priority
      />
      <Suspense fallback={<div>推荐内容加载中...</div>}>
        <Recommendations />
      </Suspense>
    </>
  );
}`,
    codeExplanation: [
      "`priority` 适合首屏 LCP 图片，告诉 Next.js 优先加载。",
      "明确 width/height 可以减少 CLS。",
      "非首屏或较慢模块放进 Suspense，避免阻塞主内容呈现。",
    ],
  },
  9: {
    deepDive:
      "响应式优化不是简单写媒体查询，而是重新安排信息优先级。比如桌面端表格可以展示 8 列，移动端可能要改成卡片；桌面侧边栏可以固定，移动端要变顶部导航或抽屉；复杂筛选在移动端可以收起。业务断点的选择应该看内容什么时候开始拥挤，而不是死记设备宽度。Tailwind 的断点适合大多数布局，局部组件可以用 grid 的 auto-fit/minmax 或容器查询思路增强弹性。",
    codeExample: `<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {cards.map((card) => (
    <article className="rounded-lg border bg-white p-4" key={card.id}>
      <h3 className="text-base font-bold sm:text-lg">{card.title}</h3>
      <p className="mt-2 text-sm leading-6">{card.desc}</p>
    </article>
  ))}
</section>`,
    codeExplanation: [
      "手机端默认单列，保证阅读和点击空间。",
      "`sm:grid-cols-2` 让平板开始两列，`xl:grid-cols-4` 让宽屏提高信息密度。",
      "字号和间距也按断点调整，避免只改列数导致视觉拥挤。",
    ],
  },
  10: {
    deepDive:
      "Fiber 可以从数据结构、调度能力和阶段划分三方面讲。数据结构上，一个 fiber 节点代表一个工作单元，包含 child、sibling、return 指针，能把递归树遍历变成可暂停的链式遍历。调度上，React 可以根据任务优先级决定先处理输入响应还是低优先级更新。阶段上，render 阶段可以被中断和重做，commit 阶段必须同步完成，因为它会真正改 DOM 和执行副作用。",
    codeExample: `type SimpleFiber = {
  type: string;
  child: SimpleFiber | null;
  sibling: SimpleFiber | null;
  return: SimpleFiber | null;
  pendingProps: unknown;
  memoizedProps: unknown;
};`,
    codeExplanation: [
      "`child/sibling/return` 让 React 可以从任意工作单元继续遍历。",
      "`pendingProps` 是本次待处理输入，`memoizedProps` 是上次提交后的结果。",
      "真实 Fiber 更复杂，还包含 lanes、flags、stateNode、updateQueue 等字段。",
    ],
  },
  11: {
    deepDive:
      "时间切片的本质是合作式调度：React 在 render 阶段处理一小段工作，然后检查当前帧是否还有时间。如果时间不够，就把控制权还给浏览器，让浏览器先处理输入、动画和绘制，之后再继续未完成的 fiber 工作。React Scheduler 会维护不同优先级的任务，例如用户输入优先级高于普通数据刷新。它通常使用 MessageChannel 安排宏任务式回调，而不是完全依赖 requestIdleCallback。",
    codeExample: `function workLoop(deadline: IdleDeadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  } else {
    commitRoot();
  }
}`,
    codeExplanation: [
      "示例是简化版模型，用 `deadline.timeRemaining()` 判断是否继续工作。",
      "真实 React Scheduler 不直接等同于 requestIdleCallback，会自己管理优先级和过期时间。",
      "render 阶段可中断，commit 阶段不可中断。",
    ],
  },
  12: {
    deepDive:
      "并发渲染不等于多线程，它是在主线程上让渲染任务可暂停、可丢弃、可重做。状态撕裂通常发生在外部 store：一次并发渲染中，不同组件读到 store 的不同快照，页面就会出现不一致。React 18 的 useSyncExternalStore 要求外部 store 提供 subscribe 和 getSnapshot，React 会用快照一致性来避免 tearing。Redux、Zustand 等库的新版本也会围绕这个协议做适配。",
    codeExample: `function useOnlineStatus() {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener("online", listener);
      window.addEventListener("offline", listener);
      return () => {
        window.removeEventListener("online", listener);
        window.removeEventListener("offline", listener);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}`,
    codeExplanation: [
      "`subscribe` 告诉 React 外部数据什么时候变化。",
      "`getSnapshot` 必须返回当前稳定快照，避免同一次渲染读到前后不一致的数据。",
      "`getServerSnapshot` 用于 SSR，保证服务端和客户端 hydration 有初始值。",
    ],
  },
  13: {
    deepDive:
      "状态管理选择要先分类：组件状态、跨组件 UI 状态、客户端业务状态、服务端缓存状态、URL 状态。React state 适合局部交互；Context 适合主题、语言、权限这类低频全局值；Redux Toolkit 适合复杂业务流、团队协作和强约束；Zustand 适合轻量全局状态；TanStack Query/SWR 适合请求缓存、重试、失效和同步服务端数据。不要把服务端缓存状态硬塞到 Redux，也不要为了一个弹窗引入全局 store。",
    codeExample: `// server state: 交给 TanStack Query/SWR
const { data, isLoading } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});

// client UI state: 留在组件或轻量 store
const [isOpen, setIsOpen] = useState(false);`,
    codeExplanation: [
      "接口数据有缓存、重试、失效、后台刷新需求，更像 server state。",
      "弹窗开关、输入框值、tab 激活态通常是 UI state，不需要全局化。",
      "面试回答要强调按状态性质分层，而不是背库名。",
    ],
  },
  14: {
    deepDive:
      "Zustand 默认用 create 创建全局 hook，所以天然像单例。多实例场景包括：一个页面多个独立表单、多个画布、多个业务小组件互不影响。做法是使用 zustand/vanilla 的 createStore，在组件 Provider 内用 useRef 保证每个组件实例只创建一次 store，再用 Context 把 store 传下去。这样同一个业务组件挂载两份时，各自有自己的 store 实例，同时仍然能享受 selector 精准订阅。",
    codeExample: `function Widget({ id }: { id: string }) {
  return (
    <WidgetStoreProvider initialId={id}>
      <WidgetEditor />
      <WidgetPreview />
    </WidgetStoreProvider>
  );
}

function Page() {
  return (
    <>
      <Widget id="left" />
      <Widget id="right" />
    </>
  );
}`,
    codeExplanation: [
      "`left` 和 `right` 各自创建一份 store，状态互不污染。",
      "Provider 内部用 `useRef` 保存 store，避免每次 render 都重建。",
      "子组件通过自定义 hook + selector 读取状态，仍能避免无关重渲染。",
    ],
  },
  15: {
    deepDive:
      "useCallback 的常见误区是把它当成性能优化默认选项。实际上它只是缓存函数引用，函数本身仍会被创建，React 还要比较依赖数组并保存缓存。如果子组件不 memo，稳定引用并不能阻止子组件渲染；如果依赖每次都变，缓存也没有意义。真正适合 useCallback 的场景是：函数传给 React.memo 子组件、函数作为 useEffect/useMemo 依赖、函数传入第三方 hook 且引用变化会触发额外订阅。",
    codeExample: `const Row = React.memo(function Row({ onSelect }: { onSelect: () => void }) {
  return <button onClick={onSelect}>选择</button>;
});

function List({ id }: { id: string }) {
  const handleSelect = useCallback(() => {
    reportSelect(id);
  }, [id]);

  return <Row onSelect={handleSelect} />;
}`,
    codeExplanation: [
      "`Row` 使用了 `React.memo`，所以稳定的 `onSelect` 引用才有意义。",
      "`id` 变化时回调必须更新，否则会闭包旧 id。",
      "如果 `Row` 没有 memo，这里的 useCallback 对减少渲染帮助很有限。",
    ],
  },
  16: {
    deepDive:
      "useEffect 时机要区分 layout effect 和 passive effect。React 完成 DOM mutation 后，会同步处理 useLayoutEffect 的 cleanup 和 create，这发生在浏览器绘制前；useEffect 属于 passive effect，会在绘制后异步 flush。A 卸载、B 挂载时，React 会在同一次 commit 中处理 DOM 更新；随后旧组件的 effect cleanup 会先执行，再执行新组件的 effect callback。StrictMode 开发环境还会额外模拟挂载、清理、再挂载，用来发现副作用不幂等的问题。",
    codeExample: `function A() {
  useEffect(() => {
    console.log("A effect create");
    return () => console.log("A effect cleanup");
  }, []);
  return <div>A</div>;
}

function B() {
  useEffect(() => {
    console.log("B effect create");
    return () => console.log("B effect cleanup");
  }, []);
  return <div>B</div>;
}`,
    codeExplanation: [
      "从 A 切到 B 时，生产环境通常会看到 A cleanup，然后 B create。",
      "`useLayoutEffect` 比 `useEffect` 更早，会在绘制前同步执行。",
      "开发环境 StrictMode 的额外执行不代表生产行为，但能暴露副作用清理问题。",
    ],
  },
  17: {
    deepDive:
      "幽灵依赖的根因是代码 import 了某个包，但当前 package.json 没声明它，只是因为根目录或其他包安装后恰好能解析到。npm/yarn 传统扁平 node_modules 容易掩盖这个问题；pnpm 使用内容寻址和更严格的符号链接结构，反而能更早暴露。修复方式不是调 node-linker 逃避，而是让每个 workspace package 显式声明自己使用的依赖，并在 CI 中用 clean install + build/test 验证。",
    codeExample: `// packages/web/src/page.ts
import dayjs from "dayjs";

// packages/web/package.json
{
  "dependencies": {
    "dayjs": "^1.11.0"
  }
}`,
    codeExplanation: [
      "只要 `packages/web` 代码 import 了 dayjs，就应该在自己的 dependencies 中声明。",
      "不要依赖根 package.json 或其他 workspace 的间接依赖。",
      "CI 中删除 node_modules 后重新 pnpm install，可以更容易发现幽灵依赖。",
    ],
  },
  18: {
    deepDive:
      "AI 通信选型要看消息方向和交互模型。普通 LLM 对话多是客户端发起一次请求，服务端持续吐 token，这是典型单向流，SSE 简单、稳定、穿透代理友好。WebSocket 适合双向实时：多人协作、实时控制、语音状态、用户不断打断并追加指令等。还有一种常见架构是 HTTP POST 创建会话或消息，返回 messageId，然后用 SSE 订阅这条消息的生成过程。",
    codeExample: `// 客户端：POST 创建消息，再订阅 SSE
const { messageId } = await fetch("/api/messages", {
  method: "POST",
  body: JSON.stringify({ prompt }),
}).then((res) => res.json());

const events = new EventSource(\`/api/messages/\${messageId}/events\`);
events.onmessage = (event) => {
  appendToken(JSON.parse(event.data).text);
};`,
    codeExplanation: [
      "POST 负责提交复杂请求体和鉴权逻辑。",
      "EventSource 负责接收服务端持续推送的生成结果。",
      "如果需要客户端在同一连接中频繁发送控制消息，WebSocket 会更自然。",
    ],
  },
  19: {
    deepDive:
      "SSE 中断要区分用户主动停止、网络异常、页面切后台和服务端异常。主动停止时前端 abort，并通知后端取消生成，避免模型继续消耗资源；网络异常时前端重连要带 lastEventId 或 offset，后端根据 messageId 返回未消费部分；服务端也应该给每个事件编号，必要时持久化已生成片段。若使用原生 EventSource，可以利用 Last-Event-ID；若使用 fetch stream，则要自己维护重连协议。",
    codeExample: `let lastEventId = "";

function connect(messageId: string) {
  const source = new EventSource(\`/api/messages/\${messageId}/events\`, {
    withCredentials: true,
  });

  source.addEventListener("token", (event) => {
    lastEventId = event.lastEventId;
    appendToken((event as MessageEvent).data);
  });

  source.onerror = () => {
    source.close();
    setTimeout(() => connect(messageId), 1000);
  };

  return () => source.close();
}`,
    codeExplanation: [
      "服务端发送事件时应带 `id:`，浏览器会把它变成 `lastEventId`。",
      "重连时后端可根据 Last-Event-ID 跳过已接收 token。",
      "生产环境还要做退避重试、最大重试次数和用户主动停止。",
    ],
  },
  20: {
    deepDive:
      "打字机效果的关键是不要把网络 chunk 等同于 UI chunk。网络层负责尽快接收并缓存，展示层按稳定节奏消费。可以按字符、词、标点做分片：中文按字符更自然，英文可按单词或短片段。为了体验，开始阶段可以稍快，长文本中段匀速，流结束后快速 flush。还要注意 React setState 频率，最好批量更新，避免每个字符都触发一次昂贵渲染。",
    codeExample: `const queue: string[] = [];
let timer: number | undefined;

function enqueue(chunk: string) {
  queue.push(...Array.from(chunk));
  timer ??= window.setInterval(flush, 32);
}

function flush() {
  const next = queue.splice(0, 2).join("");
  setText((text) => text + next);

  if (queue.length === 0) {
    clearInterval(timer);
    timer = undefined;
  }
}`,
    codeExplanation: [
      "`Array.from` 比 `split('')` 更适合处理 Unicode 字符。",
      "`splice(0, 2)` 控制每一帧显示速度，让大 chunk 也能匀速出现。",
      "队列清空后清理 timer，避免空转。",
    ],
  },
  21: {
    deepDive:
      "Markdown/XSS 的核心原则是：模型输出、用户输入、后端返回内容都默认不可信。Markdown 可以包含链接、图片、HTML 标签，甚至构造 javascript: URL 或事件属性。如果直接 dangerouslySetInnerHTML，就可能执行恶意脚本。正确做法是 markdown parser 负责语法转换，sanitize 负责白名单过滤，代码高亮只处理文本节点，链接协议限制为 http/https/mailto 等安全协议。更严格的场景还可以用 CSP 限制脚本来源。",
    codeExample: `import DOMPurify from "dompurify";
import { marked } from "marked";

marked.use({
  mangle: false,
  headerIds: false,
});

const unsafeHtml = marked.parse(markdown);
const safeHtml = DOMPurify.sanitize(unsafeHtml, {
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
});

return <div dangerouslySetInnerHTML={{ __html: safeHtml }} />;`,
    codeExplanation: [
      "`marked.parse` 只负责把 Markdown 转 HTML，不负责安全。",
      "`DOMPurify.sanitize` 用白名单删除危险标签、属性和协议。",
      "即使用了 sanitize，也建议配合 CSP、链接 rel=noopener、图片域名白名单。",
    ],
  },
};
