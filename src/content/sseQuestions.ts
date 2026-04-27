export type SseQuestion = {
  category: SseCategory;
  question: string;
  answer: string;
  seniorPerspective: string;
  talkingPoints: string[];
  codeExample?: string;
  codeExplanation?: string[];
};

export type SseCategory =
  | "基础概念"
  | "SSE vs WebSocket"
  | "前端实现"
  | "后端实现"
  | "LLM 流式场景"
  | "可靠性"
  | "性能与体验"
  | "安全与部署"
  | "综合系统设计";

export const sseCategories: SseCategory[] = [
  "基础概念",
  "SSE vs WebSocket",
  "前端实现",
  "后端实现",
  "LLM 流式场景",
  "可靠性",
  "性能与体验",
  "安全与部署",
  "综合系统设计",
];

const categoryProfiles: Record<
  SseCategory,
  {
    answer: string;
    seniorPerspective: string;
    talkingPoints: string[];
  }
> = {
  基础概念: {
    answer:
      "SSE 是 Server-Sent Events，是浏览器和服务端之间基于 HTTP 的单向流式通信机制。服务端保持响应不断开，并按 text/event-stream 格式持续推送事件。AI Chat 场景里，模型生成的 delta/token 可以被服务端逐段转成 SSE 事件，前端边收边渲染，从而降低首屏等待和提升实时感。",
    seniorPerspective:
      "回答这类题时要把协议和业务体验连起来：SSE 不是为了替代所有实时通信，而是非常适合服务端到客户端的连续文本输出。中高级面试会追问事件格式、连接保持、缓存禁用、代理缓冲和浏览器限制，所以不能只停留在“长连接”三个字。",
    talkingPoints: [
      "SSE 基于 HTTP，核心响应类型是 text/event-stream。",
      "它是服务端到客户端的单向推送，浏览器原生支持 EventSource。",
      "AI 流式输出通常把模型 delta 转成 data/event/id 等字段。",
    ],
  },
  "SSE vs WebSocket": {
    answer:
      "SSE 和 WebSocket 都能做实时体验，但定位不同。SSE 更偏服务端单向推送，建立成本低、基于 HTTP、天然支持断线重连；WebSocket 是全双工连接，更适合聊天室、协作编辑、游戏、实时控制等双向高频通信。AI 文本生成多数是服务端持续输出给客户端，所以 SSE 往往更简单。",
    seniorPerspective:
      "选型不能只说 WebSocket 更强。工程上要看消息方向、代理兼容性、连接规模、鉴权方式、重连成本和运维复杂度。AI Chat 如果只是 prompt 进去、answer 流出来，SSE 足够；如果要做多人协作、语音实时控制或双向状态同步，再考虑 WebSocket。",
    talkingPoints: [
      "单向流式输出优先 SSE，双向实时协作优先 WebSocket。",
      "SSE 走 HTTP，更容易穿过现有网关和日志链路。",
      "WebSocket 能力更强，但心跳、房间、扩容和负载均衡成本更高。",
    ],
  },
  前端实现: {
    answer:
      "前端消费 SSE 有两条路线：原生 EventSource 和 fetch + ReadableStream。EventSource 简单，自动重连，但只支持 GET、自定义 header 能力弱，也不方便 AbortController 控制；AI Chat 常用 fetch 读取 stream，因为它可以带 POST body、Authorization header，并且可以主动取消。",
    seniorPerspective:
      "前端实现的关键不是把文本 append 出来就结束。真实项目要处理 UTF-8 分片、SSE 帧解析、AbortController 停止生成、批量 setState、自动滚动、Markdown 安全渲染、失败提示和重试。React 中每个 token 都 setState 会造成高频渲染，应该 buffer 后按帧或固定间隔刷新。",
    talkingPoints: [
      "EventSource 简单但控制能力有限，fetch stream 更适合 AI Chat。",
      "用 AbortController 支持停止生成和页面卸载取消。",
      "token 应批量刷新，避免每个 chunk 触发一次 React render。",
    ],
  },
  后端实现: {
    answer:
      "后端 SSE 的核心是返回 text/event-stream，并保持连接持续写入事件。Node/Nest 服务需要设置禁用缓存、保持连接、关闭代理缓冲等 header，然后把模型 SDK 返回的 delta 逐段编码成 SSE 帧。连接关闭时要清理资源，并取消正在进行的模型请求。",
    seniorPerspective:
      "后端面试会重点看边界：Nginx/Vercel/Serverless 是否缓冲、超时如何配置、客户端断开如何感知、模型请求如何取消、最终消息如何落库。线上系统还要记录 traceId、latency、token usage 和错误码，不然流式问题很难排查。",
    talkingPoints: [
      "必须设置 text/event-stream、no-cache、keep-alive 等 header。",
      "代理层要关闭 buffering，否则前端会一次性收到内容。",
      "监听 close/aborted，及时取消模型调用和释放资源。",
    ],
  },
  "LLM 流式场景": {
    answer:
      "LLM 流式场景不只是把 token 传给前端。完整链路通常包括创建会话和消息、调用模型、流式推送 delta、处理中断和失败、把最终 assistant message 落库、统计 token 用量，并维护 message 状态机。复杂模型还会有 reasoning、tool call、function call 和最终 answer 的多事件类型。",
    seniorPerspective:
      "高级回答要突出状态机和可恢复性。message 可以有 created、streaming、completed、failed、cancelled 等状态；每个 chunk 最好带 messageId、sequence、event type，方便重连去重和审计。内容安全也要考虑流式中和流式后的不同策略。",
    talkingPoints: [
      "流式输出背后需要消息状态机，而不是临时字符串拼接。",
      "delta、reasoning、tool_call、done、error 可以用不同 event type 表达。",
      "最终内容要服务端落库，并记录 usage、traceId、模型和耗时。",
    ],
  },
  可靠性: {
    answer:
      "SSE 可靠性重点在断线重连、去重、心跳、超时、取消和资源释放。原生 EventSource 支持 Last-Event-ID，服务端可以根据 id 继续发送；fetch stream 方案则需要自己设计 messageId/sequence，并在前端重连时带上 lastSequence。",
    seniorPerspective:
      "真实系统里不要假设长连接永远稳定。移动网络切换、浏览器休眠、网关超时、模型超时都会发生。可靠方案通常是：服务端定期心跳，chunk 带序号，前端幂等追加，服务端保存中间状态或最终状态，失败后允许用户重试或恢复。",
    talkingPoints: [
      "心跳用于保活，也能让代理知道连接仍活跃。",
      "Last-Event-ID 或 sequence 用于断线恢复和去重。",
      "服务端必须感知 close，并停止模型调用避免浪费 token。",
    ],
  },
  性能与体验: {
    answer:
      "流式渲染的性能瓶颈常出现在前端高频更新、Markdown 全量解析、超长消息 DOM 增长和自动滚动。优化思路是 buffer token 后批量刷新，用 requestAnimationFrame 或固定间隔控制 UI 更新频率，对长内容做分段渲染，并在用户手动上滚时暂停自动滚动。",
    seniorPerspective:
      "体验上要追求“快”和“稳”。首 token 延迟要低，但后续输出不能抖；代码块、表格、列表这类未闭合 Markdown 语法要容错；长回答要避免每次都全量 parse + render。性能优化要结合 React Profiler 和真实设备，而不是只靠感觉。",
    talkingPoints: [
      "不要每个 token 都 setState，建议按 16ms/50ms 批量刷新。",
      "自动滚动要尊重用户手动滚动行为。",
      "Markdown 流式渲染要处理未闭合语法和 XSS。",
    ],
  },
  安全与部署: {
    answer:
      "SSE 安全包括鉴权、CSRF、XSS、限流、连接数控制和日志脱敏。部署上要关注 Nginx/CDN/Serverless 对长连接和 buffering 的支持。AI 返回内容如果按 Markdown/HTML 展示，必须 sanitize，不能直接 dangerouslySetInnerHTML。",
    seniorPerspective:
      "中高级面试常问线上坑：Nginx 默认缓冲导致流式失效，Serverless 平台有执行时间限制，Cookie 鉴权可能带来 CSRF，Bearer Token 又要处理泄露风险。生产系统还要限制并发连接、模型调用频率和单次最大 token，防止成本被刷爆。",
    talkingPoints: [
      "Markdown/HTML 输出必须 sanitize，AI 内容不能默认可信。",
      "代理层要关闭缓冲并设置合理超时。",
      "SSE 连接要做鉴权、限流、审计和成本统计。",
    ],
  },
  综合系统设计: {
    answer:
      "设计 AI Chat SSE 系统时，可以从前端、网关、后端、模型层、存储层和可观测性拆解。前端用 fetch stream + AbortController；后端创建 message 后调用模型并推送 SSE；chunk 带 messageId、sequence 和 event type；完成后落库并统计 usage；失败或取消时更新状态并给出可重试入口。",
    seniorPerspective:
      "高级方案要说明取舍：SSE 负责单向流式输出，HTTP API 负责发起和取消；状态机保证消息生命周期稳定；outbox/队列可用于异步审计和计费；traceId 贯穿前后端和模型调用；内容安全既要输入侧过滤，也要输出侧 sanitize。",
    talkingPoints: [
      "前端流式消费、服务端状态机、模型调用和消息落库要形成闭环。",
      "支持停止生成、断线恢复、失败重试和安全渲染。",
      "监控 token usage、首 token 延迟、总耗时、错误率和连接数。",
    ],
  },
};

const questionGroups: Record<SseCategory, string[]> = {
  基础概念: [
    "SSE 是什么？和普通 HTTP 请求有什么区别？",
    "SSE 和 WebSocket 怎么选？",
    "SSE 为什么适合 AI Chat 的流式输出？",
    "SSE 是基于 HTTP 还是独立协议？",
    "SSE 是单向还是双向通信？",
    "SSE 的 Content-Type 应该是什么？",
    "SSE 数据格式为什么要以 data: 开头？",
    "SSE 中 event、data、id、retry 分别有什么作用？",
  ],
  "SSE vs WebSocket": [
    "AI 对话为什么很多场景用 SSE 而不是 WebSocket？",
    "如果需要用户实时打断生成，用 SSE 够不够？",
    "WebSocket 比 SSE 强在哪里？",
    "SSE 在 HTTP/2 下有什么优势？",
    "SSE 经过 CDN、Nginx、网关时有什么坑？",
  ],
  前端实现: [
    "前端如何消费 SSE？",
    "EventSource 和 fetch + ReadableStream 有什么区别？",
    "为什么 AI Chat 场景很多时候不用原生 EventSource？",
    "如何实现打字机效果？",
    "如何避免 token 到达不均匀导致 UI 抖动？",
    "流式内容如何追加到 React state？",
    "React 中频繁 setState 会有什么性能问题？",
    "如何做流式渲染的节流或批量更新？",
    "用户切换页面时如何取消 SSE 请求？",
    "如何处理 Markdown 流式渲染？",
  ],
  后端实现: [
    "Node.js 或 Nest.js 如何返回 SSE？",
    "Nest.js 里 @Sse() 怎么用？",
    "为什么要设置 text/event-stream、no-cache、keep-alive 等 header？",
    "如何防止响应被 Nginx 缓冲？",
    "后端如何把 LLM token 转成 SSE chunk？",
    "如何处理客户端断开连接？",
    "如何在服务端取消正在进行的模型请求？",
    "如何处理模型超时？",
    "如何在流结束时发送 [DONE]？",
    "如何把生成结果最终落库？",
  ],
  "LLM 流式场景": [
    "AI token streaming 的完整链路怎么设计？",
    "前端收到的是 token、delta 还是完整 message？",
    "如何处理 tool call 或 function call 的流式返回？",
    "如何处理 reasoning content 和 answer content 分离？",
    "流式生成过程中如何做敏感词过滤？",
    "内容安全是在流式前、流式中还是流式后做？",
    "如果中途失败，已经输出的内容怎么处理？",
    "如何支持用户点击停止生成？",
    "如何支持断线后恢复？",
    "如何设计 message 状态机？",
  ],
  可靠性: [
    "SSE 连接断了怎么办？",
    "Last-Event-ID 是什么？",
    "如何实现断点续传？",
    "如何设计消息 id？",
    "前端重连时如何避免重复渲染 token？",
    "服务端如何知道客户端已经断开？",
    "长连接太多时如何限流？",
    "SSE 会不会导致服务端连接资源被占满？",
    "如何设置超时和心跳？",
    "心跳包通常怎么发？",
  ],
  性能与体验: [
    "token 每来一个就渲染一次有什么问题？",
    "如何减少 React re-render？",
    "如何实现平滑打字机？",
    "流式 Markdown 怎么避免频繁全量解析？",
    "长回答越来越长时，页面性能怎么优化？",
    "自动滚动到底部怎么做？",
    "用户手动向上滚动时，是否还要自动滚动？",
    "如何处理代码块流式输出？",
    "如何处理表格、列表、Markdown 未闭合语法？",
    "如何做首 token 延迟优化？",
  ],
  安全与部署: [
    "SSE 请求如何鉴权？",
    "Cookie 鉴权和 Bearer Token 哪个更适合？",
    "SSE 会不会有 CSRF 风险？",
    "如何防止 XSS，尤其是 AI 返回 Markdown 或 HTML？",
    "Nginx 反向代理 SSE 要配置什么？",
    "Vercel 或 Serverless 环境适合长 SSE 吗？",
    "SSE 在负载均衡下有什么注意点？",
    "如何做连接数限制？",
    "如何记录流式请求日志？",
    "如何统计 token 用量和费用？",
  ],
  综合系统设计: [
    "设计一个 AI Chat 的 SSE 流式响应系统，要求支持打字机输出、用户停止生成、刷新后恢复、消息落库、失败重试和 Markdown 安全渲染，你会怎么做？",
  ],
};

const codeExamples: Partial<
  Record<SseCategory, { codeExample: string; codeExplanation: string[] }>
> = {
  前端实现: {
    codeExample: `const controller = new AbortController();

const response = await fetch("/api/chat/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
  signal: controller.signal,
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  appendToBuffer(chunk);
}

controller.abort();`,
    codeExplanation: [
      "fetch stream 可以发送 POST body，也能通过 AbortController 主动停止生成。",
      "TextDecoder 的 stream 模式用于处理 UTF-8 分片边界。",
      "真实项目还需要解析 SSE 帧，而不是直接把 chunk 当最终文本。",
    ],
  },
  后端实现: {
    codeExample: `res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
});

for await (const delta of modelStream) {
  res.write(\`event: token\\n\`);
  res.write(\`data: \${JSON.stringify({ delta })}\\n\\n\`);
}

res.write("event: done\\ndata: [DONE]\\n\\n");
res.end();`,
    codeExplanation: [
      "text/event-stream 告诉浏览器这是 SSE 响应。",
      "X-Accel-Buffering: no 用于避免 Nginx 缓冲导致假流式。",
      "每个事件用空行结尾，前端才能识别一帧完整 SSE 消息。",
    ],
  },
  可靠性: {
    codeExample: `res.write("event: ping\\ndata: {}\\n\\n");

res.write(\`id: \${sequence}\\n\`);
res.write("event: token\\n");
res.write(\`data: \${JSON.stringify({ messageId, sequence, delta })}\\n\\n\`);`,
    codeExplanation: [
      "ping 心跳可以降低代理层空闲超时的概率。",
      "id 或 sequence 可用于断线重连后的去重和恢复。",
      "messageId 让前端知道 chunk 属于哪一条 assistant 消息。",
    ],
  },
  性能与体验: {
    codeExample: `const pending = useRef("");
const rafId = useRef<number>();

function pushToken(token: string) {
  pending.current += token;
  if (rafId.current) return;

  rafId.current = requestAnimationFrame(() => {
    setMessage((current) => current + pending.current);
    pending.current = "";
    rafId.current = undefined;
  });
}`,
    codeExplanation: [
      "token 先进入 ref buffer，不立即触发渲染。",
      "requestAnimationFrame 把多次 token 更新合并到一帧里。",
      "这能明显减少 React re-render 和滚动抖动。",
    ],
  },
  安全与部署: {
    codeExample: `import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";

<ReactMarkdown rehypePlugins={[rehypeSanitize]}>
  {assistantMarkdown}
</ReactMarkdown>;`,
    codeExplanation: [
      "AI 输出内容不能默认可信，尤其是 Markdown 中混入 HTML 时。",
      "sanitize 应在渲染 HTML 前执行，避免脚本和危险属性进入 DOM。",
      "不要把模型输出直接 dangerouslySetInnerHTML 到页面上。",
    ],
  },
};

const frontendQuestionCodeExamples: Array<
  | {
      codeExample: string;
      codeExplanation: string[];
    }
  | undefined
> = [
  {
    codeExample: `function useTypewriter(interval = 24) {
  const [text, setText] = useState("");
  const pendingRef = useRef("");
  const timerRef = useRef<number>();

  const enqueue = useCallback((chunk: string) => {
    pendingRef.current += chunk;

    if (timerRef.current) return;

    timerRef.current = window.setInterval(() => {
      const next = pendingRef.current.slice(0, 2);
      pendingRef.current = pendingRef.current.slice(2);

      setText((current) => current + next);

      if (!pendingRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    }, interval);
  }, [interval]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return { text, enqueue };
}`,
    codeExplanation: [
      "网络层收到 chunk 后只调用 enqueue，把内容放进 pendingRef，不立刻每个 token 都 setState。",
      "定时器按固定节奏从 buffer 里取字符追加到 text，这样用户看到的是稳定打字机节奏。",
      "组件卸载时清理定时器，避免页面切换后继续 setState。",
    ],
  },
  {
    codeExample: `const punctuationPause = new Set(["。", "！", "？", ".", "!", "?"]);

function createSmoothDrainer(onFlush: (text: string) => void) {
  let pending = "";
  let running = false;

  function drain() {
    if (!pending) {
      running = false;
      return;
    }

    const size = punctuationPause.has(pending[0]) ? 1 : 3;
    const next = pending.slice(0, size);
    pending = pending.slice(size);
    onFlush(next);

    window.setTimeout(drain, punctuationPause.has(next.at(-1) ?? "") ? 80 : 24);
  }

  return (chunk: string) => {
    pending += chunk;
    if (!running) {
      running = true;
      drain();
    }
  };
}`,
    codeExplanation: [
      "上游 token 可能一阵密集、一阵停顿，所以先进入 pending，再由 UI drainer 平滑吐出。",
      "示例在标点处增加短暂停顿，让中文回答更接近自然阅读节奏。",
      "这种方案把网络到达节奏和视觉展示节奏解耦，能明显减少 UI 抖动。",
    ],
  },
  {
    codeExample: `type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "streaming" | "completed" | "failed";
};

function appendAssistantChunk(messageId: string, chunk: string) {
  setMessages((messages) =>
    messages.map((message) =>
      message.id === messageId
        ? { ...message, content: message.content + chunk }
        : message,
    ),
  );
}`,
    codeExplanation: [
      "追加流式内容时使用函数式 setState，避免闭包里拿到旧 messages。",
      "通过 messageId 定位当前 assistant 消息，而不是默认追加到最后一条，重试和并发对话会更稳。",
      "真实项目可以进一步改成 reducer，把 token、done、error、cancelled 都建模成事件。",
    ],
  },
  {
    codeExample: `// 不推荐：每个 token 都触发一次 React render。
for await (const token of stream) {
  setText((current) => current + token);
}

// 更推荐：先进入 ref buffer，再按帧批量刷新。
const pendingRef = useRef("");
const rafRef = useRef<number>();

function pushToken(token: string) {
  pendingRef.current += token;
  if (rafRef.current) return;

  rafRef.current = requestAnimationFrame(() => {
    setText((current) => current + pendingRef.current);
    pendingRef.current = "";
    rafRef.current = undefined;
  });
}`,
    codeExplanation: [
      "坏例子会让 React、Markdown parser、代码高亮和滚动逻辑被高频触发。",
      "ref buffer 不会触发渲染，requestAnimationFrame 会把同一帧内的多个 token 合并。",
      "面试时要强调：React 18 有自动批处理，但异步流持续到达时仍然需要业务层控频。",
    ],
  },
  {
    codeExample: `function useStreamBatcher(flushInterval = 50) {
  const [content, setContent] = useState("");
  const bufferRef = useRef("");
  const timerRef = useRef<number>();

  const push = useCallback((chunk: string) => {
    bufferRef.current += chunk;

    if (timerRef.current) return;

    timerRef.current = window.setTimeout(() => {
      setContent((current) => current + bufferRef.current);
      bufferRef.current = "";
      timerRef.current = undefined;
    }, flushInterval);
  }, [flushInterval]);

  const flush = useCallback(() => {
    setContent((current) => current + bufferRef.current);
    bufferRef.current = "";
  }, []);

  return { content, push, flush };
}`,
    codeExplanation: [
      "push 可以被网络读取循环高频调用，但真正 setContent 最多每 50ms 一次。",
      "flush 用于 done 事件到达时立刻把剩余 buffer 展示出来，避免尾部内容丢失。",
      "这个 hook 适合放在 ChatMessage 组件里，避免整个页面因为流式 token 反复渲染。",
    ],
  },
  {
    codeExample: `function StreamingAnswer({ prompt }: { prompt: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        setText((current) => current + decoder.decode(value, { stream: true }));
      }
    }

    run().catch((error) => {
      if (error.name !== "AbortError") console.error(error);
    });

    return () => controller.abort();
  }, [prompt]);

  return <article>{text}</article>;
}`,
    codeExplanation: [
      "AbortController 的 signal 传给 fetch，组件卸载或 prompt 变化时调用 abort。",
      "catch 中单独忽略 AbortError，因为用户离开页面或点击停止不一定是异常。",
      "生产环境还要通知服务端取消模型调用，否则只是前端断开，后端可能还在消耗 token。",
    ],
  },
  {
    codeExample: `import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";

function normalizeStreamingMarkdown(markdown: string) {
  const fenceCount = (markdown.match(/\`\`\`/g) ?? []).length;
  return fenceCount % 2 === 1 ? markdown + "\\n\`\`\`" : markdown;
}

function AssistantMarkdown({ content, done }: { content: string; done: boolean }) {
  const safeContent = done ? content : normalizeStreamingMarkdown(content);

  return (
    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
      {safeContent}
    </ReactMarkdown>
  );
}`,
    codeExplanation: [
      "流式 Markdown 经常出现代码块、表格、列表还没闭合的中间态，渲染器要能容错。",
      "示例对未闭合代码块临时补 fence，减少代码块闪烁或整页排版错乱。",
      "AI 输出始终按不可信内容处理，Markdown 转 HTML 前要 sanitize，不能直接 dangerouslySetInnerHTML。",
    ],
  },
];

type QuestionUpgrade = {
  answer: string;
  seniorPerspective: string;
  talkingPoints: string[];
  codeExample?: string;
  codeExplanation?: string[];
};

const questionUpgrades: Record<number, QuestionUpgrade> = {
  1: {
    answer:
      "SSE 是 Server-Sent Events，本质是一条由浏览器发起、服务端保持打开的 HTTP 响应流。普通 HTTP 请求通常是 request-response：服务端一次性返回 JSON/HTML 后连接结束；SSE 则返回 `text/event-stream`，服务端可以持续写入多帧事件。每一帧通常由 `event`、`data`、`id` 等字段组成，并用空行结束。AI Chat 里，服务端可以把模型生成的 delta 持续包装成 SSE 帧，前端边接收边渲染，所以用户能看到“正在生成”的过程，而不是等待完整答案。",
    seniorPerspective:
      "高级回答要强调 SSE 不是魔法长轮询，而是标准 HTTP streaming。真正上线时要同时考虑 header、代理缓冲、连接超时、断线恢复和浏览器连接限制。",
    talkingPoints: [
      "SSE 是 HTTP 响应流，不是独立 TCP 协议。",
      "响应类型必须是 `text/event-stream`，事件以空行作为边界。",
      "普通 HTTP 更适合一次性结果，SSE 更适合服务端持续输出。",
    ],
    codeExample: `res.writeHead(200, {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
});

res.write("event: token\\n");
res.write(\`data: \${JSON.stringify({ delta: "你好" })}\\n\\n\`);`,
    codeExplanation: [
      "`text/event-stream` 告诉客户端这是 SSE 响应。",
      "`event` 表示事件类型，`data` 是 payload，最后的空行表示一帧结束。",
      "`no-transform` 可以降低代理或网关改写响应导致流式失效的概率。",
    ],
  },
  2: {
    answer:
      "选型先看通信方向。SSE 适合服务端单向持续推送，例如 AI 回答、任务进度、日志流、通知流；WebSocket 适合真正双向高频通信，例如多人协作、游戏、实时光标、语音控制。SSE 的优势是基于 HTTP、实现简单、天然适配网关日志和鉴权链路；WebSocket 的优势是全双工、低协议开销、消息模型更灵活。AI 对话多数是用户发起请求后服务端持续输出答案，所以优先 SSE 往往更经济。",
    seniorPerspective:
      "面试里不要只说“WebSocket 更强”。高级判断要能说清楚为什么不选择更复杂的技术：能力够用、链路简单、可观测性好、运维成本低，就是 SSE 的价值。",
    talkingPoints: [
      "单向输出优先 SSE，双向协作优先 WebSocket。",
      "SSE 复用 HTTP 生态，鉴权、日志、网关接入更简单。",
      "WebSocket 能力更强，但心跳、房间、扩容和状态管理成本更高。",
    ],
  },
  3: {
    answer:
      "AI Chat 的典型链路是用户提交 prompt，服务端调用模型，模型逐步返回 token/delta，服务端再把这些增量推给浏览器。这个方向天然是服务端到客户端的单向流，非常契合 SSE。SSE 可以降低 time to first token，让用户尽快看到第一段内容；也能让长回答、代码生成、检索增强生成这类耗时任务拥有更好的反馈。相比 WebSocket，SSE 不需要维护复杂的双向会话协议，HTTP POST 发起任务 + SSE 读取结果就能覆盖大多数场景。",
    seniorPerspective:
      "回答时要把用户体验指标讲出来：首 token 延迟、持续反馈、可取消、可恢复。SSE 的价值不是“更实时”四个字，而是让高延迟模型调用变成可感知、可中断、可观测的过程。",
    talkingPoints: [
      "LLM 输出是天然增量结果，SSE 可以逐段传输。",
      "流式反馈能显著降低用户等待焦虑。",
      "HTTP 发起任务、SSE 返回增量，是 AI Chat 的常见组合。",
    ],
  },
  4: {
    answer:
      "SSE 基于 HTTP，不是独立协议。浏览器仍然发起普通 HTTP 请求，服务端返回状态码和响应头，只是响应体不一次性结束，而是持续输出符合 SSE 格式的文本事件。因为它基于 HTTP，所以可以复用 TLS、Cookie、Header、代理、负载均衡和日志系统；但也会受到 HTTP 连接数、代理 buffering、read timeout、CDN streaming 支持度等因素影响。",
    seniorPerspective:
      "高级视角是把“基于 HTTP”拆成优势和约束两面：它易接入、易调试，但生产环境最容易被中间层缓冲和超时策略破坏。",
    talkingPoints: [
      "SSE 走 HTTP 请求响应模型，只是响应体持续不断。",
      "可以复用现有 HTTP 鉴权、日志、TLS 和网关能力。",
      "必须验证代理/CDN 是否支持真正的 streaming。",
    ],
  },
  5: {
    answer:
      "SSE 是单向通信，只支持服务端向客户端推送事件。客户端如果要提交 prompt、点击停止、切换模型、反馈点赞，一般通过额外 HTTP 接口完成。AI Chat 常见设计是：POST `/messages` 创建生成任务，SSE `/messages/:id/stream` 订阅输出，POST `/messages/:id/cancel` 停止生成。这样把控制面和数据面拆开，协议简单，也更容易做鉴权和审计。",
    seniorPerspective:
      "不要把“单向”理解成能力不足。对 AI 回答这类服务端输出为主的场景，单向反而让系统边界更清楚：HTTP 控制请求负责命令，SSE 负责连续结果。",
    talkingPoints: [
      "SSE 单向：server -> browser。",
      "客户端控制动作走普通 HTTP API。",
      "控制面和流式数据面分离，利于权限、日志和故障定位。",
    ],
  },
  6: {
    answer:
      "SSE 响应的 `Content-Type` 应该是 `text/event-stream`。此外生产环境通常还会设置 `Cache-Control: no-cache, no-transform`、`Connection: keep-alive`、`X-Accel-Buffering: no`。这些 header 的目标不是装饰，而是告诉浏览器和中间代理：这是持续事件流，不要缓存，不要压缩改写，不要攒到响应结束再转发。若 content-type 错误，浏览器的 EventSource 或自定义 parser 都可能无法按 SSE 语义处理。",
    seniorPerspective:
      "面试里可以进一步说明：header 只是第一步，Nginx、CDN、Serverless 平台仍可能有自己的 buffering 和 timeout，需要端到端验证流是否真的逐段到达。",
    talkingPoints: [
      "`Content-Type: text/event-stream` 是 SSE 的核心响应头。",
      "`no-cache` 防缓存，`no-transform` 防代理改写。",
      "`X-Accel-Buffering: no` 常用于避免 Nginx 缓冲。",
    ],
    codeExample: `res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache, no-transform");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");`,
    codeExplanation: [
      "这些 header 应在写入第一段响应体之前设置。",
      "`X-Accel-Buffering` 对 Nginx 反向代理很常见，但还要配合 Nginx 配置。",
      "如果开启 gzip 或代理缓冲，前端可能仍然无法实时收到 chunk。",
    ],
  },
  7: {
    answer:
      "`data:` 是 SSE 协议规定的数据字段。一个 SSE 事件可以包含多行 `data:`，浏览器会把多行数据用换行符合并成一次事件的 `event.data`。事件以空行结束，所以 `data: hello\\n\\n` 才是一帧完整消息。AI 场景里通常把 JSON 字符串放在 data 后面，例如包含 messageId、sequence、delta、finishReason 等字段，前端解析后再更新 UI。",
    seniorPerspective:
      "高级回答要提到边界：服务端不是随便 write 文本就叫 SSE，必须遵守字段和空行分隔；否则遇到半包、代理合并、chunk 拆分时，前端就很容易解析错。",
    talkingPoints: [
      "`data:` 是 payload 字段，可以出现多行。",
      "空行 `\\n\\n` 表示一条事件结束。",
      "AI token 建议用 JSON 承载，而不是裸字符串。",
    ],
    codeExample: `event: token
id: 42
data: {"messageId":"m_1","sequence":42,"delta":"Hello"}

event: done
data: {"finishReason":"stop"}

`,
    codeExplanation: [
      "`event` 让前端区分 token、done、error 等类型。",
      "`id` 可以配合 Last-Event-ID 做断线恢复。",
      "每个事件最后必须有空行，否则客户端不会认为事件完成。",
    ],
  },
  8: {
    answer:
      "`event` 表示事件类型，默认是 message；`data` 是事件数据；`id` 是事件编号，浏览器重连时会通过 Last-Event-ID 告诉服务端最后收到哪一帧；`retry` 是服务端建议的重连间隔。AI Chat 中可以用 `event: token` 发送增量文本，用 `event: reasoning` 发送推理内容，用 `event: tool_call` 发送工具调用，用 `event: done` 表示结束，用 `event: error` 表示失败。",
    seniorPerspective:
      "把 SSE 事件类型设计好，比单纯推字符串更重要。事件语义清晰后，前端状态机、日志、回放、恢复和问题排查都会简单很多。",
    talkingPoints: [
      "`event` 解决多类型消息分发。",
      "`id` 是恢复和去重的关键。",
      "`retry` 只适用于客户端愿意按建议重连的场景。",
    ],
    codeExample: `source.addEventListener("token", (event) => {
  const payload = JSON.parse(event.data);
  appendChunk(payload.messageId, payload.delta);
});

source.addEventListener("done", () => {
  markMessageCompleted();
});`,
    codeExplanation: [
      "命名事件比只监听 message 更清晰。",
      "前端解析 data 后根据 messageId 更新对应消息。",
      "done 事件应显式更新状态，而不是只依赖连接关闭。",
    ],
  },
  9: {
    answer:
      "AI 对话多数场景是一次用户输入触发一次服务端长时间输出，数据方向以服务端到客户端为主。SSE 刚好覆盖这个模型：HTTP 请求进入后，服务端把模型 delta 持续推送出去。相比 WebSocket，SSE 更容易接入现有 API 鉴权、日志、Trace、Nginx 和 CDN，也更容易在浏览器里调试。除非业务需要客户端和服务端在同一连接上高频互发消息，否则 SSE 往往是更简单稳妥的选择。",
    seniorPerspective:
      "中高级答案要补充“成本意识”：WebSocket 能做，但不是所有实时体验都值得引入双向连接、连接状态管理和横向扩容复杂度。",
    talkingPoints: [
      "AI 回答是典型 server-to-client 增量输出。",
      "SSE 更贴近 HTTP API 工作流。",
      "WebSocket 适合双向高频，而不是所有流式输出。",
    ],
  },
  10: {
    answer:
      "够用，但停止生成通常不是通过 SSE 发送客户端到服务端的消息。前端可以用 AbortController 关闭当前 fetch stream，也可以调用取消接口通知后端停止模型请求；后端还要监听连接 close/aborted，主动 abort 上游模型调用。完整设计里，前端取消、连接断开、后端取消模型、消息状态改为 cancelled 这四步都要闭环，否则只是浏览器不看了，服务端仍可能继续消耗 token。",
    seniorPerspective:
      "高级回答要区分“断开输出流”和“取消计算任务”。只 abort 前端连接不一定能取消上游 LLM 请求，服务端必须把取消信号传递到模型 SDK 或任务队列。",
    talkingPoints: [
      "SSE 本身单向，取消动作走 AbortController 或 HTTP API。",
      "服务端要监听 close/aborted。",
      "取消后要更新消息状态并停止计费/资源消耗。",
    ],
    codeExample: `const controller = new AbortController();

await fetch("/api/chat/stream", {
  method: "POST",
  body: JSON.stringify({ prompt }),
  signal: controller.signal,
});

// 用户点击“停止生成”
controller.abort();
await fetch("/api/chat/cancel", { method: "POST" });`,
    codeExplanation: [
      "AbortController 负责断开当前浏览器请求。",
      "cancel 接口负责通知服务端取消模型生成。",
      "生产环境应带 messageId/runId，避免取消错任务。",
    ],
  },
  11: {
    answer:
      "WebSocket 的强项是全双工：客户端和服务端可以在同一条连接上随时互发消息，适合多人协作、在线状态、游戏同步、实时音视频控制、低延迟指令下发等场景。它也更适合自定义复杂会话协议，比如房间、订阅、多主题推送。但代价是连接状态、心跳、重连、鉴权刷新、负载均衡、横向扩容都要自己设计得更完整。",
    seniorPerspective:
      "面试里可以说 WebSocket 是能力上限更高的方案，但 SSE 是很多 AI 文本流的复杂度下限更低的方案。高级工程师应根据场景选最小足够技术。",
    talkingPoints: [
      "WebSocket 是全双工，SSE 是单向。",
      "WebSocket 更适合高频双向互动。",
      "WebSocket 运维和状态管理复杂度更高。",
    ],
  },
  12: {
    answer:
      "HTTP/2 支持多路复用，可以缓解 HTTP/1.1 下同域连接数限制的问题。SSE 在 HTTP/2 中仍然是响应流，但多个请求可以共享底层连接，减少 TCP 连接数量和队头阻塞影响。不过是否真的有收益取决于浏览器、反向代理、CDN 和服务端框架是否完整支持 HTTP/2 streaming。实践中仍要测试代理是否缓冲、是否按 chunk 及时 flush。",
    seniorPerspective:
      "高级回答不要把 HTTP/2 当成银弹。它改善连接复用，但不能自动解决业务恢复、事件去重、代理 buffering 和平台超时。",
    talkingPoints: [
      "HTTP/2 多路复用可减少连接压力。",
      "SSE 语义不变，仍是 text/event-stream。",
      "需要验证中间链路是否支持真正流式转发。",
    ],
  },
  13: {
    answer:
      "最大坑是 buffering 和 timeout。Nginx、CDN、API Gateway 可能把上游响应先缓冲起来，等攒够大小或响应结束后再发给浏览器，结果前端看起来不是流式；也可能因为长时间没有数据触发 idle timeout。解决思路是关闭代理缓冲、禁用不合适的压缩、提高 read timeout、定期发送心跳，并确认部署平台支持 streaming。",
    seniorPerspective:
      "线上排查 SSE 失败时，不能只看后端是否 res.write。要从浏览器 Network、网关日志、Nginx 配置、CDN 行为、服务端 flush 点逐层定位。",
    talkingPoints: [
      "buffering 会把流式变成一次性返回。",
      "idle timeout 会中断长连接。",
      "心跳和代理配置要一起做。",
    ],
    codeExample: `location /api/chat/stream {
  proxy_pass http://app;
  proxy_http_version 1.1;
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 3600s;
  gzip off;
}`,
    codeExplanation: [
      "`proxy_buffering off` 是避免 Nginx 攒响应的关键。",
      "`proxy_read_timeout` 要大于一次生成可能持续的时间。",
      "如果 CDN 仍缓冲，Nginx 配好也无法保证浏览器实时收到。",
    ],
  },
  14: {
    answer:
      "前端消费 SSE 有两种主流方式：EventSource 和 fetch + ReadableStream。EventSource 简单，浏览器原生解析 SSE、支持自动重连和 Last-Event-ID；fetch stream 更灵活，支持 POST body、自定义 header、AbortController，也更适合 AI Chat。无论哪种方式，前端都要处理事件解析、错误状态、done 结束、取消请求、批量更新和安全渲染。",
    seniorPerspective:
      "高级实现不会直接把 chunk 拼到 DOM。它会把网络读取、SSE 解析、消息状态机、UI 批量刷新和 Markdown 安全渲染拆开，便于测试和维护。",
    talkingPoints: [
      "EventSource 简洁，fetch stream 可控。",
      "AI Chat 多数需要 POST 和取消，fetch stream 更常见。",
      "前端要区分网络 chunk 和业务事件。",
    ],
    codeExample: `const response = await fetch("/api/chat/stream", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { value, done } = await reader.read();
  if (done) break;
  parseSseText(decoder.decode(value, { stream: true }));
}`,
    codeExplanation: [
      "fetch stream 读到的是字节 chunk，不一定刚好等于一条 SSE 事件。",
      "TextDecoder 的 stream 模式能处理 UTF-8 字符被拆包的情况。",
      "parseSseText 应维护 buffer，按空行切分完整事件。",
    ],
  },
  15: {
    answer:
      "EventSource 是浏览器封装好的 SSE 客户端，主要用于 GET 请求，自动解析事件并支持重连；fetch + ReadableStream 更底层，需要自己读字节流、解析 SSE 帧和实现重连，但能使用 POST、自定义 Header、AbortController 和更复杂的鉴权。AI Chat 往往需要提交较大的 prompt/context、携带 Authorization、支持停止生成，所以 fetch stream 更常用。",
    seniorPerspective:
      "选 EventSource 还是 fetch，不是单纯 API 喜好，而是产品约束：是否必须 POST、是否要自定义鉴权、是否要取消、是否要接入自定义 parser 和状态机。",
    talkingPoints: [
      "EventSource 简单且自动重连，但控制力弱。",
      "fetch stream 灵活，但要自己解析和恢复。",
      "AI Chat 通常更偏向 fetch stream。",
    ],
  },
  16: {
    answer:
      "很多 AI Chat 不用原生 EventSource，是因为 EventSource 的请求模型偏简单：常见实现是 GET，不能方便地设置自定义 header，也不适合携带复杂 body。AI 对话通常要 POST prompt、历史消息、模型参数和业务上下文，还要支持 AbortController 停止生成。fetch + ReadableStream 虽然需要自己解析流，但能完整控制请求、鉴权、取消、错误和重试。",
    seniorPerspective:
      "高级回答要补一句：如果你的场景只是订阅通知或日志流，EventSource 很好；如果是 AI Chat 这种请求体大、控制复杂、需要取消的场景，fetch stream 更合适。",
    talkingPoints: [
      "EventSource 更适合简单订阅流。",
      "AI Chat 往往需要 POST body 和 Authorization。",
      "fetch stream 需要自研 parser，但工程控制力更强。",
    ],
    codeExample: `// EventSource：简单订阅
const source = new EventSource("/api/notifications");

// fetch stream：更适合 AI Chat
const response = await fetch("/api/chat/stream", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` },
  body: JSON.stringify({ prompt, history }),
  signal: controller.signal,
});`,
    codeExplanation: [
      "EventSource 适合简单 GET 订阅。",
      "fetch 可以携带 body、header 和 abort signal。",
      "这也是 AI Chat 前端常选择 fetch stream 的主要原因。",
    ],
  },
  24: {
    answer:
      "Node.js 或 Nest.js 返回 SSE 的核心步骤是：设置 `text/event-stream` 响应头，关闭缓存和代理缓冲，保持连接打开，然后持续 `write` 符合 SSE 格式的事件。每次写入要以空行结束，服务端在 done/error/cancel 时显式发送结束事件并关闭响应。还要监听客户端断开，停止继续写入并取消上游模型请求。",
    seniorPerspective:
      "高级答案要把后端 SSE 讲成资源生命周期：建立连接、写入事件、处理 backpressure、感知断开、释放资源、记录最终状态。",
    talkingPoints: [
      "后端不是返回 JSON，而是持续写 `text/event-stream`。",
      "每个事件都要按 SSE 格式编码并以空行结束。",
      "close/aborted 事件必须清理模型请求和定时器。",
    ],
    codeExample: `app.post("/api/chat/stream", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  req.on("close", () => {
    // cancel upstream model stream here
  });

  for await (const delta of modelStream(req.body.prompt)) {
    res.write(\`event: token\\ndata: \${JSON.stringify({ delta })}\\n\\n\`);
  }

  res.write("event: done\\ndata: {}\\n\\n");
  res.end();
});`,
    codeExplanation: [
      "响应头必须在第一次 write 之前发送。",
      "`for await` 适合消费模型 SDK 返回的异步流。",
      "`req.on('close')` 用来感知浏览器断开连接。",
    ],
  },
  25: {
    answer:
      "Nest.js 的 `@Sse()` 装饰器可以直接返回 Observable，Nest 会把 Observable 发出的值序列化为 SSE 消息。它适合服务端主动推送通知、进度、简单事件流。AI Chat 场景如果要精细控制 header、POST body、AbortController、模型取消和落库，有时会选择 `@Post()` + `@Res()` 手动写响应；如果用 `@Sse()`，也要确保能处理鉴权、断开、错误和资源清理。",
    seniorPerspective:
      "不要只背 `@Sse()` 用法。高级回答要说明它适合什么、不适合什么，以及什么时候需要退到底层 response 控制。",
    talkingPoints: [
      "`@Sse()` 返回 Observable，适合简单事件推送。",
      "复杂 AI Chat 可能需要手动控制 response。",
      "无论哪种方式，都要处理断开、错误和资源释放。",
    ],
    codeExample: `@Sse("events")
events(): Observable<MessageEvent> {
  return interval(1000).pipe(
    map((count) => ({
      type: "ping",
      data: { count },
    })),
  );
}`,
    codeExplanation: [
      "Observable 每 emit 一次，Nest 会推送一条 SSE 消息。",
      "`type` 对应 SSE 的 event 类型，`data` 是事件内容。",
      "AI 生成流如果需要 POST body，通常还要额外设计创建任务接口。",
    ],
  },
  26: {
    answer:
      "`text/event-stream` 告诉客户端按 SSE 流解析响应；`no-cache` 避免浏览器或代理缓存流式内容；`no-transform` 避免中间层压缩或改写响应；`keep-alive` 表示连接会保持一段时间持续传输。没有这些 header，SSE 可能被当成普通文本、被缓存、被代理缓冲或被提前关闭。它们不能保证所有平台都实时转发，但属于正确 SSE 响应的基础配置。",
    seniorPerspective:
      "上线排障时，header 是第一层检查项；第二层还要看 Nginx/CDN/Serverless 是否有独立 buffering 和 timeout 策略。",
    talkingPoints: [
      "`text/event-stream` 决定客户端解析语义。",
      "`no-cache, no-transform` 是为了保护流式传输。",
      "`keep-alive` 与代理 timeout 配置要一起考虑。",
    ],
  },
  27: {
    answer:
      "防止 Nginx 缓冲需要两层处理：应用响应头加 `X-Accel-Buffering: no`，Nginx location 中配置 `proxy_buffering off`。同时要检查 gzip、proxy_cache、HTTP/2/CDN 行为和 `proxy_read_timeout`。如果 Nginx 缓冲没有关闭，后端即使每个 token 都 `res.write`，浏览器也可能等到缓冲区满或响应结束后才一次性收到。",
    seniorPerspective:
      "面试中可以强调验证方式：在浏览器 Network 看 chunk 到达时间，用 curl `--no-buffer` 测试直连和经 Nginx 两条链路，对比定位缓冲发生在哪一层。",
    talkingPoints: [
      "应用头和 Nginx 配置要同时处理。",
      "gzip/CDN/API Gateway 也可能引入缓冲。",
      "用 curl 和 Network timeline 验证真实流式效果。",
    ],
    codeExample: `res.setHeader("X-Accel-Buffering", "no");

# nginx
location /api/chat/stream {
  proxy_pass http://node_app;
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 3600s;
  gzip off;
}`,
    codeExplanation: [
      "`X-Accel-Buffering: no` 是应用侧提示。",
      "`proxy_buffering off` 是 Nginx 侧真正关闭代理缓冲。",
      "`proxy_read_timeout` 防止长回答过程中被代理断开。",
    ],
  },
  28: {
    answer:
      "后端通常从模型 SDK 拿到异步流，每收到一个 delta/token，就包装成 SSE 事件写给浏览器。不要只发送裸文本，建议带上 `messageId`、`sequence`、`delta`、`eventType`、`createdAt` 等元数据。这样前端可以按序追加、断线后去重恢复，日志也能定位某条消息的第几个 chunk 出错。",
    seniorPerspective:
      "高级实现会把模型供应商的流格式和前端 SSE 协议解耦：服务端做标准化事件模型，前端不直接依赖某个模型厂商的 delta 结构。",
    talkingPoints: [
      "模型 delta 要转换成业务 SSE 事件。",
      "chunk 建议携带 messageId 和 sequence。",
      "服务端负责屏蔽不同模型供应商的格式差异。",
    ],
    codeExample: `let sequence = 0;

for await (const part of llmStream) {
  const delta = part.choices?.[0]?.delta?.content ?? "";
  if (!delta) continue;

  res.write("event: token\\n");
  res.write(
    \`data: \${JSON.stringify({ messageId, sequence: ++sequence, delta })}\\n\\n\`,
  );
}`,
    codeExplanation: [
      "从模型原始事件中提取文本 delta。",
      "sequence 递增后写入 data，用于前端排序和去重。",
      "跳过空 delta，避免前端产生无意义渲染。",
    ],
  },
  29: {
    answer:
      "客户端断开时，Node/Nest 可以通过 request 的 `close`、`aborted` 或 response 的 `close` 事件感知。服务端收到断开信号后要停止写响应、清理心跳 interval、取消上游模型请求、更新消息状态。如果不处理，后端可能继续生成内容并消耗 token，但前端已经不再接收，既浪费资源也会造成状态不一致。",
    seniorPerspective:
      "高级回答要区分主动取消、网络断开、浏览器刷新三种情况。它们在服务端都表现为连接关闭，但业务状态可能分别是 cancelled、interrupted 或 recoverable。",
    talkingPoints: [
      "监听 close/aborted 是 SSE 后端必做项。",
      "断开后停止写入并取消模型流。",
      "业务状态要能表达取消、中断和失败。",
    ],
    codeExample: `const abortController = new AbortController();

req.on("close", () => {
  abortController.abort();
  clearInterval(heartbeatTimer);
  markMessageInterrupted(messageId);
});

const stream = await model.chat({
  messages,
  signal: abortController.signal,
});`,
    codeExplanation: [
      "浏览器断开后触发 close。",
      "AbortController 把取消信号传给上游模型调用。",
      "状态更新不能只依赖前端，服务端也要落状态。",
    ],
  },
  30: {
    answer:
      "服务端取消模型请求通常依赖 AbortController、SDK 提供的 cancel 方法，或任务队列的 cancellation token。用户点击停止时，前端关闭 SSE 并调用取消接口；后端根据 runId/messageId 找到正在执行的模型调用，触发 abort，并把消息状态改为 cancelled。若模型 SDK 不支持取消，也至少要停止继续写入和停止后续落库，但成本控制会差一些。",
    seniorPerspective:
      "中高级面试很关注成本：取消不是 UI 按钮变灰，而是要真的停止上游 token 生成，减少资源和费用。",
    talkingPoints: [
      "取消要从前端传递到后端，再传递到模型 SDK。",
      "runId/messageId 用于定位正在执行的任务。",
      "取消后要处理部分内容是否保留和如何计费。",
    ],
    codeExample: `const running = new Map<string, AbortController>();

function startGeneration(messageId: string) {
  const controller = new AbortController();
  running.set(messageId, controller);
  return controller;
}

app.post("/api/chat/:messageId/cancel", (req, res) => {
  running.get(req.params.messageId)?.abort();
  running.delete(req.params.messageId);
  res.status(204).end();
});`,
    codeExplanation: [
      "Map 只是单实例示例，分布式场景要用共享状态或任务队列。",
      "取消接口必须校验用户是否有权取消该 message。",
      "abort 后还要更新数据库状态，而不是只删内存 Map。",
    ],
  },
  31: {
    answer:
      "模型超时要分层处理：首 token 超时、两段 token 之间的 idle timeout、总生成时长 timeout。首 token 超时说明排队、上下文构建或模型响应太慢；idle timeout 说明流中断或模型卡住；总时长超时用于控制成本和连接资源。超时后服务端应发送 error/timeout 事件或更新状态，前端展示可重试入口，并确保上游请求被取消。",
    seniorPerspective:
      "高级方案会把 timeout 作为 SLA 和成本控制的一部分，而不是简单 `setTimeout`。不同模型、不同套餐、不同租户可以有不同阈值。",
    talkingPoints: [
      "区分首 token、空闲和总时长超时。",
      "超时要取消模型请求并更新消息状态。",
      "前端要能展示失败原因和重试入口。",
    ],
    codeExample: `const timeout = AbortSignal.timeout(60_000);

try {
  const stream = await model.chat({ messages, signal: timeout });
  for await (const chunk of stream) {
    writeToken(chunk);
  }
} catch (error) {
  res.write(
    \`event: error\\ndata: \${JSON.stringify({ code: "MODEL_TIMEOUT" })}\\n\\n\`,
  );
}`,
    codeExplanation: [
      "`AbortSignal.timeout` 可以给上游调用设置硬超时。",
      "超时事件要用结构化错误码，方便前端和日志识别。",
      "实际项目还会维护首 token timer 和 idle timer。",
    ],
  },
  32: {
    answer:
      "流结束时建议发送显式 done 事件，而不是只依赖连接关闭。done 事件可以携带 finishReason、usage、messageId、finalSequence 等信息，前端收到后把消息状态从 streaming 改为 completed，并 flush 剩余 buffer。某些系统会发送 `[DONE]` 字符串，这是约定而非 SSE 协议要求；更推荐使用结构化 JSON，便于扩展。",
    seniorPerspective:
      "显式 done 是状态机稳定性的关键。连接关闭可能代表完成、取消、网络中断或服务端异常，不能单靠 close 判断业务成功。",
    talkingPoints: [
      "done 事件应显式标记正常完成。",
      "可以携带 usage、finishReason 和 finalSequence。",
      "连接关闭不等价于生成成功。",
    ],
    codeExample: `res.write("event: done\\n");
res.write(
  \`data: \${JSON.stringify({
    messageId,
    finishReason: "stop",
    finalSequence: sequence,
    usage,
  })}\\n\\n\`,
);
res.end();`,
    codeExplanation: [
      "done 事件让前端明确进入 completed 状态。",
      "usage 可以在结束时用于费用展示和数据库更新。",
      "finalSequence 能帮助校验是否遗漏 chunk。",
    ],
  },
  33: {
    answer:
      "生成结果落库有两种策略：流式过程中增量落库，或内存聚合后在 done 时一次性落库。增量落库恢复能力更好，刷新或断线后可以继续展示已有内容，但写库频率高；最终落库实现简单，但中途失败时可能丢失部分内容。真实 AI Chat 常用折中方案：内存 buffer 高频追加，按时间或 chunk 数节流保存草稿，done 时写入最终内容、状态、usage 和 finishReason。",
    seniorPerspective:
      "高级回答要讲清楚一致性：前端看到的内容、服务端已保存内容、模型实际生成内容三者可能短暂不一致，需要用 message 状态机和 sequence 对齐。",
    talkingPoints: [
      "最终落库简单，增量落库恢复能力强。",
      "建议节流保存草稿，done 时写最终状态。",
      "落库内容要和 messageId、sequence、usage 关联。",
    ],
    codeExample: `let content = "";
let lastPersistedAt = Date.now();

for await (const delta of llmStream) {
  content += delta;
  writeToken(delta);

  if (Date.now() - lastPersistedAt > 1000) {
    await messages.update(messageId, { content, status: "streaming" });
    lastPersistedAt = Date.now();
  }
}

await messages.update(messageId, {
  content,
  status: "completed",
  usage,
});`,
    codeExplanation: [
      "节流落库避免每个 token 都写数据库。",
      "streaming 状态下保存草稿，刷新后可恢复部分内容。",
      "done 后保存 completed 和 usage，形成最终一致状态。",
    ],
  },
  34: {
    answer:
      "AI token streaming 的完整链路通常包括：前端提交 prompt；后端创建 user message 和 assistant message；后端调用 LLM 并消费模型流；服务端把 delta 标准化为 SSE 事件；前端按 messageId/sequence 追加；生成结束后服务端落库、统计 usage、发送 done；失败或取消时更新状态并提供重试。这个链路里最重要的是状态机和可观测性，而不是单纯把 token 透传给前端。",
    seniorPerspective:
      "高级设计要能回答“中途失败怎么办”“刷新怎么恢复”“如何知道慢在哪”。所以要有 traceId、timeToFirstToken、duration、usage、错误码和 message 状态。",
    talkingPoints: [
      "先创建消息状态，再开始流式生成。",
      "chunk 要标准化成前端稳定协议。",
      "完成、失败、取消都要有明确状态。",
    ],
  },
  35: {
    answer:
      "前端收到的最好不是模型原始 token，而是服务端标准化后的业务事件。底层模型可能返回 token、delta、choice、reasoning、tool_call 等不同结构；服务端应统一成 `token`、`reasoning`、`tool_call`、`done`、`error` 等 SSE 事件。完整 message 是最终聚合结果，delta 是增量片段，token 是更底层的分词单位。前端通常只关心 delta 和事件类型，不应绑定供应商私有字段。",
    seniorPerspective:
      "高级回答要体现边界隔离：前端协议应该稳定，模型供应商可以替换。服务端做适配层，能降低后续换模型或接多模型的成本。",
    talkingPoints: [
      "token 是模型分词层概念，delta 是业务增量片段。",
      "完整 message 是服务端聚合后的最终结果。",
      "前端应消费稳定事件，不直接依赖模型供应商格式。",
    ],
    codeExample: `type StreamEvent =
  | { type: "token"; messageId: string; sequence: number; delta: string }
  | { type: "tool_call"; messageId: string; name: string; argsDelta: string }
  | { type: "done"; messageId: string; usage?: TokenUsage }
  | { type: "error"; messageId: string; code: string };`,
    codeExplanation: [
      "用联合类型表达前端可见的稳定流式协议。",
      "模型原始结构在服务端适配，不泄漏到 UI 层。",
      "不同事件类型可以驱动不同 UI 状态。",
    ],
  },
  36: {
    answer:
      "tool call 或 function call 流式返回时，不能简单当普通文本渲染。模型可能逐步输出工具名称、参数 JSON 片段和调用结束信号。服务端应把它拆成独立事件，比如 `tool_call_start`、`tool_call_delta`、`tool_call_done`，前端先展示“正在调用工具”，等参数完整后再触发工具执行或展示结果。参数 JSON 要累积后校验，不能边流边执行不完整参数。",
    seniorPerspective:
      "高级回答要强调安全：工具调用参数来自模型输出，不可信。执行前要 schema validation、权限校验、限流和审计。",
    talkingPoints: [
      "tool call 应与普通文本事件分离。",
      "参数流要累积完整后再校验执行。",
      "工具执行需要权限、安全和审计边界。",
    ],
    codeExample: `res.write("event: tool_call_delta\\n");
res.write(
  \`data: \${JSON.stringify({
    messageId,
    toolCallId,
    name: "searchDocs",
    argsDelta: "{\\"query\\":\\"SSE",
  })}\\n\\n\`,
);`,
    codeExplanation: [
      "tool call 参数可能是分片 JSON，不能立即 JSON.parse。",
      "toolCallId 用于关联同一次工具调用的多个增量片段。",
      "done 后再校验完整参数并决定是否执行工具。",
    ],
  },
  37: {
    answer:
      "reasoning content 和 answer content 应该用不同事件类型或不同字段分离。推理内容可能需要折叠展示、权限控制，甚至在某些产品中不展示；最终 answer 才是用户主要可见内容。如果把两者混在一个字符串里，前端无法做差异化 UI，落库、审计和安全策略也会变复杂。服务端可发送 `event: reasoning` 和 `event: token`，前端分别存储。",
    seniorPerspective:
      "高级设计要考虑合规和产品策略：有些模型的 reasoning 不适合完整暴露，系统应在协议层就留出控制空间。",
    talkingPoints: [
      "reasoning 和 answer 用不同事件表达。",
      "前端可对 reasoning 折叠、延迟或不展示。",
      "落库和审计也应区分内容类型。",
    ],
  },
  38: {
    answer:
      "流式生成中的敏感词过滤比较难，因为危险内容可能跨 chunk 出现。简单方案是服务端维护滑动窗口，把最近 N 个字符和新 delta 拼起来检测；更严格方案是先延迟少量 token，检测后再释放给前端。对于高风险场景，还需要输入侧审核、模型安全参数、输出侧审核和人工策略结合。流式中检测到风险时，应发送安全中断事件并更新消息状态，而不是继续输出。",
    seniorPerspective:
      "高级回答要承认取舍：越实时，越难完整审核；越严格，延迟越高。系统需要按业务风险选择窗口大小、延迟策略和拦截方式。",
    talkingPoints: [
      "敏感内容可能跨 chunk，需要滑动窗口。",
      "高风险场景可以延迟释放 token 做审核。",
      "拦截时要发送明确事件并更新状态。",
    ],
    codeExample: `let auditWindow = "";

for await (const delta of llmStream) {
  auditWindow = (auditWindow + delta).slice(-500);

  if (containsUnsafeContent(auditWindow)) {
    res.write('event: blocked\\ndata: {"reason":"policy"}\\n\\n');
    await markMessageBlocked(messageId);
    break;
  }

  writeToken(delta);
}`,
    codeExplanation: [
      "滑动窗口可以发现跨 chunk 拼出来的风险内容。",
      "真实审核通常会结合规则、分类模型和业务策略。",
      "blocked 事件让前端能展示明确终止原因。",
    ],
  },
  39: {
    answer:
      "内容安全应同时覆盖流式前、流式中和流式后。流式前审核用户输入、上下文和工具权限；流式中监控模型增量输出，必要时中断；流式后对最终答案做完整审核、sanitize、落库策略和可见性控制。只做流式后审核会导致危险内容已经短暂展示；只做流式中审核又可能漏掉完整语义，所以通常需要多层防护。",
    seniorPerspective:
      "高级答案要把内容安全看成一条链路，而不是一个函数。输入、模型、工具、输出、渲染和日志都可能成为风险点。",
    talkingPoints: [
      "输入侧、输出中、输出后都要有策略。",
      "流式中审核解决即时展示风险。",
      "最终审核适合完整语义判断和落库控制。",
    ],
  },
  40: {
    answer:
      "中途失败时，已经输出的内容要根据业务策略处理。可以保留为 partial，并显示“生成中断，可重试”；也可以标记为 failed，不作为最终答案。服务端要记录失败原因、已生成 content、lastSequence、usage 和 traceId。前端不应假装完成，而应把消息状态从 streaming 改为 failed/interrupted，并提供重试或继续生成入口。",
    seniorPerspective:
      "高级回答要体现状态一致性：用户看到的部分内容、数据库草稿、模型 usage、错误日志必须能对得上，否则排障和重试会很混乱。",
    talkingPoints: [
      "中途失败不是 completed。",
      "可保留 partial 内容，但状态要明确。",
      "记录 lastSequence 和错误码，便于恢复或重试。",
    ],
  },
  41: {
    answer:
      "用户点击停止生成时，前端应立即停止读取流、冻结当前展示内容，并向后端发送取消请求。后端根据 messageId/runId 取消模型调用，停止写 SSE，清理资源，把消息状态改为 cancelled 或 partial_cancelled。产品上可以选择保留已生成内容，也可以提示用户重新生成。关键是停止按钮必须真正影响服务端任务，而不是只隐藏 loading。",
    seniorPerspective:
      "面试中要强调取消链路：UI -> HTTP cancel -> 后端 abort -> 模型停止 -> 状态落库 -> 费用统计。少任何一环都不完整。",
    talkingPoints: [
      "前端 abort 和后端 cancel 都需要。",
      "取消后要清理资源并更新状态。",
      "已生成内容是否保留是产品策略，但状态必须明确。",
    ],
  },
  42: {
    answer:
      "断线后恢复需要服务端有可恢复状态。前端记录最后处理的 sequence，重连时带上 messageId 和 lastSequence；服务端根据已保存的 chunk 或聚合内容，从 lastSequence 之后继续推送，或者返回当前完整内容并让前端校准。若服务端完全不保存中间状态，只靠内存流，就只能提示用户重试，不能真正恢复。",
    seniorPerspective:
      "高级回答要说明恢复能力是架构选择：要恢复就必须付出存储、序号和幂等处理成本；不需要恢复则可以简化，但要明确用户体验。",
    talkingPoints: [
      "恢复依赖 messageId 和递增 sequence。",
      "服务端要保存 chunk 或可重建的聚合内容。",
      "前端重连要去重，避免重复追加。",
    ],
  },
  43: {
    answer:
      "message 状态机可以设计为 `created -> streaming -> completed`，异常分支包括 `failed`、`cancelled`、`interrupted`、`blocked`。创建 assistant message 后先进入 streaming；收到 done 后 completed；模型错误 failed；用户停止 cancelled；网络断开但可恢复 interrupted；安全策略拦截 blocked。状态机能让 UI、落库、重试、计费和审计都有一致依据。",
    seniorPerspective:
      "高级答案要把状态机和业务操作绑定：哪些状态能重试，哪些状态能继续生成，哪些状态参与计费，哪些状态对用户可见。",
    talkingPoints: [
      "不要只用 loading boolean 表示生成状态。",
      "状态机要覆盖成功、失败、取消、中断和安全拦截。",
      "状态决定 UI 展示、重试能力和计费口径。",
    ],
    codeExample: `type MessageStatus =
  | "created"
  | "streaming"
  | "completed"
  | "failed"
  | "cancelled"
  | "interrupted"
  | "blocked";`,
    codeExplanation: [
      "明确状态枚举比多个 boolean 更稳定。",
      "每个状态都应有对应 UI 和后端持久化含义。",
      "重试和恢复逻辑也应基于状态机判断。",
    ],
  },
  44: {
    answer:
      "SSE 连接断了，首先判断是正常 done 后关闭，还是网络/代理/浏览器导致的异常断开。正常完成应已有 done 事件；异常断开时前端可以按退避策略重连，并带上 messageId、lastSequence 或 Last-Event-ID。服务端如果支持恢复，就续传；不支持则返回当前消息状态或提示重试。不要无限快速重连，避免放大故障。",
    seniorPerspective:
      "高级回答要提到重连退避和幂等：断线恢复要避免重复渲染、重复计费、重复创建生成任务。",
    talkingPoints: [
      "区分正常完成和异常断开。",
      "重连要带最后处理位置。",
      "使用退避策略，避免重连风暴。",
    ],
  },
  45: {
    answer:
      "Last-Event-ID 是浏览器 EventSource 的断线恢复机制。服务端发送 SSE 时可以写 `id: 123`，浏览器如果断线重连，会在请求头里带上 `Last-Event-ID: 123`。服务端据此知道客户端最后收到的事件编号，然后从下一个事件继续发送。fetch stream 没有自动 Last-Event-ID，需要前端自己维护 lastSequence 并通过 query/body/header 传回服务端。",
    seniorPerspective:
      "高级回答要说明它只是恢复坐标，不是完整恢复方案。服务端必须保存或能重建后续事件，否则知道 last id 也没法续传。",
    talkingPoints: [
      "`id` 由服务端写入 SSE 帧。",
      "EventSource 重连时自动带 Last-Event-ID。",
      "fetch stream 需要自己实现等价机制。",
    ],
    codeExample: `// server
res.write(\`id: \${sequence}\\n\`);
res.write(\`data: \${JSON.stringify({ sequence, delta })}\\n\\n\`);

// EventSource reconnect request header:
// Last-Event-ID: 42`,
    codeExplanation: [
      "服务端每帧发送 id，浏览器记录最后成功接收的 id。",
      "断线后 EventSource 会把 Last-Event-ID 发回服务端。",
      "服务端需要根据 id 查找后续 chunk。",
    ],
  },
  46: {
    answer:
      "断点续传的关键是每个 chunk 有稳定递增序号，并且服务端保存可恢复数据。前端记录 lastSequence，重连时请求 `?after=lastSequence`；服务端从 sequence 大于 lastSequence 的 chunk 开始补发。如果只保存完整 content，也可以返回完整内容并让前端替换当前消息，但这不是严格的增量续传。续传逻辑必须幂等，重复 chunk 不能导致重复文本。",
    seniorPerspective:
      "是否做断点续传取决于产品价值。长回答、付费模型、弱网移动端更值得做；短回答可以只做失败重试。",
    talkingPoints: [
      "chunk sequence 是断点续传基础。",
      "服务端要保存 chunk 或完整内容。",
      "前端追加必须幂等去重。",
    ],
  },
  47: {
    answer:
      "消息 id 建议在服务端创建 assistant message 时生成，整个生成生命周期保持不变；chunk sequence 在 message 内递增。messageId 用于关联 UI 消息、数据库记录、日志、取消请求和恢复请求；sequence 用于排序、去重和续传。不要只用时间戳或前端临时 id 作为最终消息 id，分布式系统里更推荐数据库 id、UUID、ULID 或雪花 id。",
    seniorPerspective:
      "高级回答要强调 id 设计是系统可观测和可恢复的基础。没有稳定 id，取消、重试、审计和计费都会变得脆弱。",
    talkingPoints: [
      "messageId 全生命周期稳定。",
      "sequence 在 message 内单调递增。",
      "id 要贯穿前端、后端、日志和数据库。",
    ],
  },
  48: {
    answer:
      "前端重连时避免重复渲染的核心是幂等追加。每个 chunk 必须有 sequence，前端维护 lastSequence 或已处理 sequence 集合；收到 chunk 时，如果 sequence 小于等于 lastSequence 就丢弃，如果等于 lastSequence + 1 就追加，如果跳号就触发恢复或重新同步。不要用字符串内容判断重复，因为模型可能连续输出相同字符或重复词。",
    seniorPerspective:
      "高级回答要把 UI 幂等和后端续传配套说明。只做前端去重不能解决缺 chunk，只做后端续传也不能防止重复追加。",
    talkingPoints: [
      "sequence 是去重和排序依据。",
      "重复 chunk 丢弃，跳号 chunk 触发恢复。",
      "不要靠文本内容判断是否重复。",
    ],
    codeExample: `let lastSequence = 0;

function handleChunk(chunk: { sequence: number; delta: string }) {
  if (chunk.sequence <= lastSequence) return;

  if (chunk.sequence !== lastSequence + 1) {
    requestRecovery(lastSequence);
    return;
  }

  appendText(chunk.delta);
  lastSequence = chunk.sequence;
}`,
    codeExplanation: [
      "小于等于 lastSequence 的 chunk 是重复数据。",
      "跳号说明中间丢失，需要恢复而不是继续拼接。",
      "追加成功后再推进 lastSequence。",
    ],
  },
  49: {
    answer:
      "服务端可以监听 Node request 的 `close`、`aborted` 或 response 的 `close` 事件判断客户端断开。断开后应停止写入 SSE、清理心跳定时器、取消模型调用、释放数据库游标或订阅。还要注意 `res.write()` 返回 false 时表示下游消费慢，存在 backpressure，应等待 drain 或降低写入速度，避免内存积压。",
    seniorPerspective:
      "高级回答不要只说监听 close。要进一步讲资源释放和 backpressure，因为长连接场景最怕悄悄积累内存和上游任务。",
    talkingPoints: [
      "close/aborted 用于感知断开。",
      "断开后必须清理上游任务和定时器。",
      "处理 backpressure，避免内存堆积。",
    ],
  },
  50: {
    answer:
      "长连接太多时需要在网关层和应用层限流。网关层可以限制单 IP 连接数、请求速率和连接时长；应用层按 userId、tenantId、模型、套餐限制并发生成数和最大输出 token。超限后可以拒绝、排队或取消旧任务。AI 场景还要把连接数限制和成本预算绑定，否则少量用户可能占满模型额度。",
    seniorPerspective:
      "高级回答要同时讲技术资源和商业成本：SSE 占 socket，LLM 占 token 和并发额度，二者都要限。",
    talkingPoints: [
      "按 IP/user/tenant/model 做多维限流。",
      "限制连接数、生成时长和最大 token。",
      "超限策略可以拒绝、排队或降级。",
    ],
    codeExample: `const activeConnections = new Map<string, number>();
const MAX_CONNECTIONS_PER_USER = 3;

function acquireConnection(userId: string) {
  const count = activeConnections.get(userId) ?? 0;
  if (count >= MAX_CONNECTIONS_PER_USER) {
    throw new Error("TOO_MANY_STREAMS");
  }
  activeConnections.set(userId, count + 1);
}

function releaseConnection(userId: string) {
  activeConnections.set(userId, Math.max((activeConnections.get(userId) ?? 1) - 1, 0));
}`,
    codeExplanation: [
      "这是单实例示例，多实例要放到 Redis 或网关层。",
      "acquire 和 release 必须成对执行，close/error/cancel 都要释放。",
      "AI 场景还应叠加 token 预算和模型并发限制。",
    ],
  },
  51: {
    answer:
      "会。SSE 每条连接都会占用 socket、内存、请求上下文、心跳 timer，AI Chat 还可能绑定一个上游模型流。Node 虽然擅长 I/O 并发，但不是无限连接池；文件描述符、负载均衡连接数、内存、模型并发和数据库连接都可能成为瓶颈。因此生产环境必须设置连接上限、空闲超时、心跳、取消清理和容量监控。",
    seniorPerspective:
      "高级回答要避免“Node 异步所以没问题”的误区。长连接问题往往不是 CPU，而是连接生命周期和上游资源被占住。",
    talkingPoints: [
      "SSE 是长连接，会占用服务端资源。",
      "瓶颈包括 socket、内存、模型并发和代理连接数。",
      "必须监控活跃连接、持续时长和异常断开率。",
    ],
  },
  52: {
    answer:
      "超时通常分为首 token 超时、空闲超时、总生成超时和代理 read timeout。心跳用于避免中间代理认为连接空闲，也能让前端判断连接还活着。常见做法是每 15-30 秒发送一次 `: ping\\n\\n` 注释行或 `event: ping` 事件。超时和心跳要和 Nginx/CDN/平台限制对齐，否则服务端以为还在生成，代理已经断了。",
    seniorPerspective:
      "高级方案会把 timeout 变成可观测指标：TTFT、idle gap、total duration 都应记录，方便定位慢在排队、模型还是代理链路。",
    talkingPoints: [
      "首 token、空闲、总时长是不同 timeout。",
      "心跳用于保活和连接健康感知。",
      "代理 timeout 要大于业务允许的生成时长。",
    ],
    codeExample: `const heartbeat = setInterval(() => {
  res.write(": ping\\n\\n");
}, 25_000);

req.on("close", () => {
  clearInterval(heartbeat);
});`,
    codeExplanation: [
      "SSE 注释行以冒号开头，不会触发普通 message。",
      "25 秒心跳通常能避开很多默认 idle timeout。",
      "连接关闭后必须清理 interval。",
    ],
  },
  53: {
    answer:
      "心跳包通常有两种：注释行 `: ping\\n\\n` 和显式事件 `event: ping\\ndata: {}\\n\\n`。注释行适合纯保活，不打扰业务事件；显式 ping 适合前端展示连接状态或记录延迟。发送频率不宜太高，通常 15-30 秒一次即可。心跳不能替代业务数据的 done/error 事件，它只是说明连接还没闲置到被中间层断开。",
    seniorPerspective:
      "高级回答要说明心跳也有成本：连接数大时，心跳频率过高会产生额外带宽、日志和 CPU 开销。",
    talkingPoints: [
      "注释心跳适合保活，显式 ping 适合监控。",
      "心跳频率要结合代理 timeout 和连接规模。",
      "心跳不代表生成正常完成。",
    ],
  },
  54: {
    answer:
      "token 每来一个就渲染一次会导致 React 高频 render、Markdown 频繁解析、代码高亮重复执行、自动滚动抖动和布局计算增多。模型输出快时，浏览器主线程可能被 UI 更新占满，反而让打字机变卡。更好的做法是网络层持续接收 token，UI 层用 buffer + requestAnimationFrame 或固定间隔批量刷新。",
    seniorPerspective:
      "高级回答要结合 React：React 18 有自动批处理，但持续异步流里的多次状态更新仍可能造成大量 commit，业务层控频依然必要。",
    talkingPoints: [
      "高频 setState 会放大渲染和解析成本。",
      "网络接收和 UI 更新应解耦。",
      "批量刷新能兼顾实时感和性能。",
    ],
  },
  55: {
    answer:
      "减少 React re-render 的策略包括：把 token 暂存在 `useRef` buffer 中，按帧或定时器批量 `setState`；把消息列表和当前流式消息拆成独立组件；稳定的历史消息用 `memo`；长列表做虚拟化；Markdown 和代码高亮延后或降低频率。核心目标是让一个 token 的变化只影响当前消息区域，而不是触发整个页面重渲染。",
    seniorPerspective:
      "高级回答要说明优化顺序：先减少更新频率，再缩小渲染范围，最后考虑 memo/虚拟化/worker，不要一上来滥用 useMemo。",
    talkingPoints: [
      "ref buffer 用于暂存高频 token。",
      "组件拆分能缩小重渲染范围。",
      "重型 Markdown/高亮应节流或延后。",
    ],
  },
  56: {
    answer:
      "平滑打字机的关键是让显示节奏不完全等于网络到达节奏。网络层可能突然收到一大段，也可能短时间没有数据；UI 层可以从 buffer 中按固定字符数或固定时间片取出内容，遇到标点、换行、代码块边界时适当停顿。这样既保留实时感，又避免大段内容突然闪现或输出速度忽快忽慢。",
    seniorPerspective:
      "高级回答可以补充用户体验：打字机不是越快越好，而是要稳定、可读、不卡顿，并且用户滚动查看历史时不能强行拉到底。",
    talkingPoints: [
      "网络节奏和展示节奏要解耦。",
      "标点、换行、代码块可作为自然停顿点。",
      "打字机要配合滚动和批量渲染策略。",
    ],
  },
  57: {
    answer:
      "流式 Markdown 避免频繁全量解析，可以采用降低解析频率、分段渲染和最终态渲染。生成中先按纯文本或轻量 Markdown 展示，按 50-100ms 批量解析；代码块、表格这类结构复杂内容可以等闭合或 done 后再做完整高亮。长回答还可以把历史稳定段落缓存起来，只对新增尾部做处理，避免每个 token 都重新构建整棵 AST。",
    seniorPerspective:
      "高级答案要承认 Markdown 在流式中天然是不完整语法树。渲染器必须容错，不能要求每个中间状态都是合法文档。",
    talkingPoints: [
      "降低 Markdown parse 频率。",
      "未闭合结构先轻量展示，完成后再增强。",
      "长内容要避免每次全量 AST parse。",
    ],
  },
  58: {
    answer:
      "长回答越来越长时，性能压力来自 DOM 增长、Markdown 解析、代码高亮、滚动计算和 React diff。优化可以从限制单条回答最大长度、分段渲染、懒加载历史消息、虚拟化消息列表、延迟代码高亮、Web Worker 解析 Markdown 入手。还可以在生成过程中只渲染当前增量区域，完成后再把内容固化为较少的段落节点。",
    seniorPerspective:
      "高级回答要把性能和产品边界结合：无限长回答不仅慢，也不利于阅读和成本控制，必要时要做最大 token 和分段总结策略。",
    talkingPoints: [
      "长内容会放大 DOM、解析和滚动成本。",
      "分段、虚拟化、延迟高亮是常见优化。",
      "产品上也要限制最大输出长度。",
    ],
  },
  59: {
    answer:
      "自动滚动到底部应有条件触发：只有用户当前接近底部时，内容更新后才自动滚到底；如果用户已经手动向上阅读历史内容，就不应该强制滚动。实现上可以用底部 sentinel ref 调用 `scrollIntoView`，或计算 `scrollHeight - scrollTop - clientHeight` 是否小于阈值。流式输出时滚动也要节流，避免每个 token 都触发 layout。",
    seniorPerspective:
      "高级体验要尊重用户控制权。自动滚动看似小细节，但 AI Chat 里长回答很多，强制滚动会严重打断阅读。",
    talkingPoints: ["接近底部才自动跟随。", "用户上滚后暂停自动滚动。", "滚动动作也应节流。"],
    codeExample: `const nearBottom =
  container.scrollHeight - container.scrollTop - container.clientHeight < 80;

if (nearBottom) {
  bottomRef.current?.scrollIntoView({ block: "end" });
}`,
    codeExplanation: [
      "80px 是常见阈值，可按 UI 调整。",
      "只有 nearBottom 时才自动滚动，避免抢用户阅读位置。",
      "真实项目可配合 requestAnimationFrame 节流滚动。",
    ],
  },
  60: {
    answer:
      "用户手动向上滚动时不应该继续强制自动滚动。正确体验是暂停跟随，显示“回到底部”按钮或新消息提示；用户点击按钮或滚回底部附近后，再恢复自动滚动。实现时可以监听滚动位置，把 `isUserPinnedToBottom` 作为状态，流式内容更新只在 pinned 状态下滚动。",
    seniorPerspective:
      "高级回答要从产品角度解释：AI 回答往往很长，用户可能边生成边回看上下文，系统不能把用户强行拽回底部。",
    talkingPoints: [
      "手动上滚代表用户正在阅读历史。",
      "暂停自动跟随并提供回到底部入口。",
      "重新接近底部后恢复自动滚动。",
    ],
  },
  61: {
    answer:
      "代码块流式输出的难点是 Markdown fence 可能尚未闭合，语法高亮器在不完整代码上可能闪烁或报错。生成中可以先用普通 `<pre>` 展示未闭合代码块，检测到 closing fence 或 done 后再做语法高亮和复制按钮。对于超长代码，还要限制高度、支持横向滚动，并避免每个 token 都重新运行高亮。",
    seniorPerspective:
      "高级实现要把代码块看成独立渲染单元：生成中稳定显示，完成后增强，而不是一边流式一边重型高亮。",
    talkingPoints: [
      "未闭合代码块先按纯文本展示。",
      "done 后再语法高亮和启用复制。",
      "高亮要节流，避免主线程卡顿。",
    ],
  },
  62: {
    answer:
      "表格、列表和 Markdown 未闭合语法在流式过程中很常见。渲染器必须接受中间态不完整，不能因为少一个 `|` 或 fence 就崩溃。产品上可以先按纯文本或简化 Markdown 展示，等段落边界、空行或 done 后再切换成完整结构化渲染。对于表格这类容易重排的内容，过早渲染会导致布局抖动，完成后再增强通常更稳。",
    seniorPerspective:
      "高级回答要体现容错思维：流式 UI 渲染的是“正在生成的文档”，而不是最终合法文档，渲染策略要服务于中间态。",
    talkingPoints: [
      "流式 Markdown 的中间态可能不合法。",
      "先保守展示，完成后增强渲染。",
      "表格和列表要避免频繁重排。",
    ],
  },
  63: {
    answer:
      "首 token 延迟，即 time to first token，受前端网络、后端排队、鉴权、上下文组装、RAG 检索、模型调度、代理 buffering 共同影响。优化要从链路拆解：前端尽早发起请求；后端减少同步阻塞；系统 prompt、用户画像、检索结果尽量缓存；模型选择低延迟版本；服务端尽早 flush header；代理关闭 buffering。监控上要分别记录 request start、model request、first model token、first SSE write、browser first chunk。",
    seniorPerspective:
      "高级回答要能定位慢在哪里，而不是泛泛说“换快模型”。TTFT 是端到端指标，必须拆成可观测的阶段。",
    talkingPoints: [
      "TTFT 由前端、后端、模型和代理共同决定。",
      "优化要拆阶段，不只看模型。",
      "记录 first model token 和 first browser chunk 的差异。",
    ],
    codeExample: `const startedAt = performance.now();
let firstTokenAt: number | undefined;

for await (const delta of llmStream) {
  firstTokenAt ??= performance.now();
  writeToken(delta);
}

logger.info({
  metric: "chat_stream_timing",
  timeToFirstToken: firstTokenAt ? firstTokenAt - startedAt : null,
});`,
    codeExplanation: [
      "先记录服务端视角的首 token 延迟。",
      "还应在前端记录首 chunk 到达时间，比较代理和网络耗时。",
      "有指标后才能判断是检索慢、模型慢还是网关缓冲。",
    ],
  },
  64: {
    answer:
      "SSE 鉴权应在建立流之前完成。可以使用 httpOnly Cookie，也可以使用 Bearer Token；如果是 EventSource，Cookie 更自然，因为自定义 header 不方便；如果是 fetch stream，两种方式都可以。鉴权后还要检查租户、会话、messageId 权限，避免用户订阅别人的流。长连接期间如果 token 过期，要有策略：允许当前流完成、提前刷新 token，或在服务端关闭流并让前端重新认证。",
    seniorPerspective:
      "高级回答要把认证和授权分开：登录态只证明你是谁，messageId/tenantId 权限才证明你能看这条流。",
    talkingPoints: [
      "建流前必须完成认证和授权。",
      "EventSource 更适合 Cookie，fetch stream 更灵活。",
      "要校验用户是否有权访问对应 message/run。",
    ],
  },
  65: {
    answer:
      "同站 Web 应用通常更适合 httpOnly + Secure + SameSite Cookie，因为 token 不暴露给 JavaScript，XSS 后果相对可控；跨端 API、移动端、第三方调用更常用 Bearer Token。SSE 如果用 EventSource，自定义 header 不方便，Cookie 更自然；如果用 fetch stream，可以显式传 Authorization header。无论哪种，都要考虑 CSRF、token 过期、刷新、日志脱敏和跨域 CORS。",
    seniorPerspective:
      "高级回答不要绝对化。Cookie 和 Bearer 的选择取决于客户端类型、跨域需求、XSS/CSRF 风险模型和团队基础设施。",
    talkingPoints: [
      "同站 Web 优先 httpOnly Cookie。",
      "跨端或开放 API 常用 Bearer Token。",
      "EventSource 对自定义 header 不友好，fetch stream 更灵活。",
    ],
  },
  66: {
    answer:
      "SSE 可能有 CSRF 风险，取决于接口是否使用 Cookie 鉴权以及是否产生副作用。原则上 SSE GET 应只读，只负责订阅已有任务；创建生成任务、取消任务等有副作用动作应使用 POST，并校验 CSRF token、Origin/Referer 或 SameSite Cookie。如果一个 GET SSE 接口会自动创建昂贵的模型任务，攻击者就可能诱导用户浏览器发起请求消耗额度。",
    seniorPerspective:
      "高级回答要指出：安全问题不在 SSE 这个协议本身，而在你是否把有副作用的业务动作放进了可被跨站触发的请求里。",
    talkingPoints: [
      "订阅流应尽量只读。",
      "创建/取消任务走 POST 并做 CSRF 防护。",
      "Cookie 鉴权场景要特别关注跨站触发。",
    ],
  },
  67: {
    answer:
      "AI 返回的 Markdown 或 HTML 必须按不可信内容处理。不能把模型输出直接 `dangerouslySetInnerHTML` 到页面，也不能允许任意 HTML、事件属性或 `javascript:` URL。推荐使用 Markdown parser 渲染，并配合 sanitize 白名单过滤；如果允许代码块和链接，要限制协议、target、rel。流式过程中同样要防护，因为恶意内容可能在生成中就已经展示。",
    seniorPerspective:
      "高级回答要把 XSS 和 prompt injection 关联起来：攻击者可以通过提示词诱导模型输出恶意 HTML，所以“内容来自 AI”不等于可信。",
    talkingPoints: [
      "AI 输出是不可信输入。",
      "Markdown 转 HTML 前必须 sanitize。",
      "链接、图片、HTML 标签和事件属性都要限制。",
    ],
    codeExample: `import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";

function SafeMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
      {content}
    </ReactMarkdown>
  );
}`,
    codeExplanation: [
      "ReactMarkdown 负责 Markdown 解析，rehypeSanitize 负责过滤危险 HTML。",
      "不要把模型输出直接传给 dangerouslySetInnerHTML。",
      "生产环境可按业务需要定制 sanitize schema。",
    ],
  },
  68: {
    answer:
      "Nginx 反向代理 SSE 的关键配置是关闭代理缓冲、禁用缓存、调大读超时、避免 gzip 缓冲，并使用 HTTP/1.1 长连接转发。典型配置包括 `proxy_buffering off`、`proxy_cache off`、`proxy_read_timeout 3600s`、`gzip off`。应用层也建议返回 `X-Accel-Buffering: no`。如果前面还有 CDN 或 API Gateway，也要确认它们支持 streaming，否则 Nginx 配置正确也可能被上游缓冲。",
    seniorPerspective: "高级回答要强调端到端验证：SSE 链路上任何一层缓冲，都会让用户看到假流式。",
    talkingPoints: [
      "关闭 buffering 是核心。",
      "调大 read timeout，避免长回答被断开。",
      "CDN/API Gateway 也要确认支持 streaming。",
    ],
    codeExample: `location /api/chat/stream {
  proxy_pass http://backend;
  proxy_http_version 1.1;
  proxy_set_header Connection "";
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 3600s;
  gzip off;
}`,
    codeExplanation: [
      "`proxy_buffering off` 让 Nginx 尽快转发上游 chunk。",
      "`proxy_read_timeout` 要覆盖最长生成时间。",
      "`gzip off` 避免压缩层引入额外缓冲。",
    ],
  },
  69: {
    answer:
      "Vercel 或 Serverless 是否适合长 SSE，要看平台对 streaming、最大执行时长、连接超时和并发的限制。Serverless 擅长短请求和弹性伸缩，但长连接会占用执行实例，可能遇到函数超时、冷启动、平台缓冲或连接中断。短回答、Edge streaming、轻量 AI demo 可以用；长时间生成、高并发企业 Chat 更建议使用常驻 Node 服务、容器、专用后端或支持长连接的平台。",
    seniorPerspective:
      "高级回答要结合平台约束做架构选择，而不是默认所有前端部署平台都适合长连接后端。",
    talkingPoints: [
      "确认平台 streaming 和执行时长限制。",
      "Serverless 长连接可能受超时和并发影响。",
      "高并发长回答建议使用常驻后端服务。",
    ],
  },
  70: {
    answer:
      "SSE 在负载均衡下要注意长连接粘性和恢复能力。一个流式请求建立后通常由某个实例持续负责，滚动发布、实例重启或负载均衡超时都会中断连接。如果只把生成状态放在实例内存里，断线后换实例就无法恢复。因此 message 状态、chunk sequence、取消状态和 usage 最好进入共享存储或任务系统；需要严格续传时，还要能从共享存储补发 chunk。",
    seniorPerspective:
      "高级回答要说明不要依赖 sticky session 解决一切。粘性会话可以降低复杂度，但可恢复和可扩容仍需要共享状态。",
    talkingPoints: [
      "长连接期间请求绑定到某个实例。",
      "滚动发布和实例重启会中断流。",
      "恢复能力依赖共享存储和稳定 messageId。",
    ],
  },
  71: {
    answer:
      "连接数限制可以在网关、负载均衡和应用层一起做。网关限制单 IP 连接数和速率；应用层按 userId、tenantId、套餐、模型限制并发 stream 和最大生成数；模型层限制并发调用和 token 预算。超限策略可以返回 429、排队、降级到非流式或取消旧连接。所有连接在 close、done、error、cancel 时都要释放计数。",
    seniorPerspective:
      "高级回答要把连接限制和业务等级关联：免费用户、付费用户、企业租户的并发和 token 预算通常不同。",
    talkingPoints: [
      "网关层和应用层都要限。",
      "按用户、租户、模型和套餐维度控制。",
      "释放计数必须覆盖所有结束路径。",
    ],
  },
  72: {
    answer:
      "流式请求日志应记录关键生命周期事件，而不是每个 token 都打日志。建议记录 stream_start、first_token、done、error、cancel、client_disconnect，并带上 traceId、userId、tenantId、messageId、model、timeToFirstToken、duration、status、errorCode、usage。prompt 和回答内容可能敏感，应按合规策略脱敏、采样或加密存储。",
    seniorPerspective:
      "高级回答要强调可观测性：SSE 问题经常跨前端、网关、后端、模型供应商，缺少 traceId 和阶段耗时会很难定位。",
    talkingPoints: [
      "记录生命周期事件，不要逐 token 打日志。",
      "traceId 要贯穿前端、后端和模型调用。",
      "敏感内容日志要脱敏或受控存储。",
    ],
    codeExample: `logger.info({
  event: "stream_done",
  traceId,
  userId,
  messageId,
  model,
  timeToFirstToken,
  durationMs: Date.now() - startedAt,
  status: "completed",
  usage,
});`,
    codeExplanation: [
      "结构化日志便于检索和聚合指标。",
      "timeToFirstToken 和 duration 是流式体验核心指标。",
      "usage 用于成本分析，但内容本身要谨慎记录。",
    ],
  },
  73: {
    answer:
      "token 用量和费用优先使用模型供应商返回的 usage。流式模式下 usage 可能在最后的 done 或 final response 才出现，服务端应在完成时更新 message/run 记录。如果供应商不返回实时 usage，可以先基于 tokenizer 估算用于预算控制，最终再用真实 usage 校准。费用统计要绑定 user、tenant、model、messageId、状态和重试次数，并明确 cancelled/failed 是否计费。",
    seniorPerspective:
      "高级回答要把 usage 当成账务数据处理，而不是 UI 附属信息。它影响成本、套餐、风控和客户账单，必须可追溯。",
    talkingPoints: [
      "优先使用供应商真实 usage。",
      "流式完成后更新数据库和账务记录。",
      "取消、失败、重试要有明确计费口径。",
    ],
    codeExample: `res.write(
  \`event: done\\ndata: \${JSON.stringify({
    messageId,
    usage: {
      promptTokens: 1200,
      completionTokens: 380,
      totalTokens: 1580,
    },
  })}\\n\\n\`,
);

await billing.recordUsage({ userId, messageId, model, usage });`,
    codeExplanation: [
      "usage 可以随 done 事件返回给前端。",
      "服务端也要把 usage 写入计费或审计系统。",
      "真实项目要防止重试导致重复计费。",
    ],
  },
  74: {
    answer:
      "我会把 AI Chat SSE 系统拆成创建任务、模型生成、流式传输、状态持久化、恢复重试和安全渲染六层。前端先 POST 创建 user/assistant message，拿到 messageId 后用 fetch stream 读取 SSE；UI 用 buffer + requestAnimationFrame 做平滑输出，用 AbortController 停止生成。后端创建 streaming 状态的 assistant message，调用模型后把 delta 转成带 messageId、sequence、event type 的 SSE 帧；done 时落库 completed 和 usage，失败/取消/安全拦截分别落 failed/cancelled/blocked。刷新恢复时，前端带 lastSequence 查询或重连，服务端从共享存储补发或返回当前完整内容。Markdown 渲染必须 sanitize，链路中记录 traceId、TTFT、duration、usage、错误码和断开原因。",
    seniorPerspective:
      "高级系统设计要讲清楚取舍：SSE 负责单向流式输出，HTTP API 负责创建和取消；状态机保证生命周期一致；共享存储支持恢复；限流和 usage 控制成本；sanitize 和审核控制安全。",
    talkingPoints: [
      "创建、推流、取消、恢复、落库、安全要形成闭环。",
      "每个 chunk 带 messageId 和 sequence，支持去重恢复。",
      "可观测性覆盖 traceId、TTFT、错误、取消和 usage。",
    ],
    codeExample: `POST /api/messages
-> { messageId }

POST /api/messages/:messageId/stream
-> event: token
-> data: { messageId, sequence, delta }
-> event: done
-> data: { messageId, usage }

POST /api/messages/:messageId/cancel
-> cancel upstream model request

GET /api/messages/:messageId?after=42
-> recover missing chunks or return current snapshot`,
    codeExplanation: [
      "创建接口和流式接口分离，便于鉴权、审计和恢复。",
      "stream 事件使用 messageId + sequence，支持幂等追加。",
      "cancel 和 recover 是生产级 AI Chat 体验的重要补充。",
    ],
  },
};

const answerOverrides: Record<string, string> = {
  "SSE 是什么？和普通 HTTP 请求有什么区别？":
    "SSE 是 Server-Sent Events，是服务端通过一条持续打开的 HTTP 响应向浏览器不断推送事件的机制。普通 HTTP 请求通常是一次请求一次响应，响应结束连接就释放；SSE 则保持连接，服务端可以分多次写入 event/data/id 等帧。AI Chat 里它能让用户先看到首批 token，而不是等模型完整生成后才返回。",
  "SSE 和 WebSocket 怎么选？":
    "如果业务主要是服务端单向推送，例如 AI 回复、任务进度、日志流、通知流，优先考虑 SSE，因为它基于 HTTP、实现简单、天然支持重连。若业务需要真正双向实时通信，例如聊天室、多人协作、实时游戏、在线状态同步，则更适合 WebSocket。选型时看消息方向、频率、代理兼容、鉴权方式和运维成本。",
  "SSE 为什么适合 AI Chat 的流式输出？":
    "AI Chat 的核心链路通常是用户发起 prompt 后，服务端持续返回模型生成的 delta/token，这是典型的服务端到客户端单向流。SSE 可以按 token 或句子片段逐步推送，前端边收边渲染，显著降低首 token 等待体感。它比 WebSocket 更轻，HTTP 语义、日志、鉴权和代理链路也更容易复用。",
  "SSE 是基于 HTTP 还是独立协议？":
    "SSE 基于 HTTP，不是独立传输协议。浏览器发起普通 HTTP 请求，服务端返回 `Content-Type: text/event-stream`，并保持响应不断开。也正因为它是 HTTP，SSE 可以复用 Cookie、Header、网关、日志、TLS 和负载均衡能力，但也会受到 HTTP 连接数、代理缓冲和超时策略影响。",
  "SSE 是单向还是双向通信？":
    "SSE 是单向通信，只支持服务端向客户端推送事件。客户端如果要发送消息，需要额外走普通 HTTP 请求，例如 POST `/chat` 发起生成，DELETE/POST `/chat/cancel` 取消生成。AI Chat 里常见设计就是 HTTP 请求负责发起和控制，SSE 负责持续返回生成内容。",
  "SSE 的 Content-Type 应该是什么？":
    "SSE 响应的 `Content-Type` 应该是 `text/event-stream`。同时通常会设置 `Cache-Control: no-cache, no-transform`、`Connection: keep-alive`，在 Nginx 下还会设置 `X-Accel-Buffering: no`。这些 header 的目标是告诉客户端和代理：这不是普通 JSON 响应，不要缓存、不要压缩变形、不要缓冲到结束后再发。",
  "SSE 数据格式为什么要以 data: 开头？":
    "`data:` 是 SSE 协议定义的数据字段，浏览器或前端解析器会把连续的 data 行合并成一次事件的 payload。一个事件通常用空行 `\\n\\n` 结束，例如 `event: token\\ndata: {...}\\n\\n`。如果不按这个格式写，EventSource 或自定义 SSE parser 就无法可靠识别事件边界。",
  "SSE 中 event、data、id、retry 分别有什么作用？":
    "`event` 表示事件类型，例如 token、done、error；`data` 是事件内容；`id` 是事件编号，配合 Last-Event-ID 做断线恢复；`retry` 是服务端建议客户端断线后多久重连。AI 场景里可以用 event 区分 delta、reasoning、tool_call、done，用 id/sequence 做去重和续传。",
  "AI 对话为什么很多场景用 SSE 而不是 WebSocket？":
    "多数 AI 对话是用户发送一次 prompt，服务端持续返回回答，消息方向以服务端到客户端为主，因此 SSE 的能力已经足够。SSE 部署更接近普通 HTTP，便于接入鉴权、日志、网关和监控。WebSocket 虽然能双向通信，但连接状态、心跳、扩容、房间管理和负载均衡复杂度更高。",
  "如果需要用户实时打断生成，用 SSE 够不够？":
    "够用，但取消动作通常不走 SSE 本身。前端可以用 AbortController 断开当前 fetch stream，同时调用一个普通 HTTP 接口通知服务端取消模型请求；服务端也要监听 request close，及时 abort 上游模型调用。SSE 负责输出，HTTP 或连接关闭负责控制，这是 AI Chat 中很常见的组合。",
  "WebSocket 比 SSE 强在哪里？":
    "WebSocket 是全双工通信，客户端和服务端可以在同一条连接上高频互发消息，适合实时协作、聊天室、音视频控制、多人在线状态和游戏同步。它还可以承载更复杂的会话协议。但它的代价是状态管理更重：需要心跳、重连、房间、鉴权刷新、横向扩容和连接迁移策略。",
  "SSE 在 HTTP/2 下有什么优势？":
    "HTTP/2 支持多路复用，可以缓解 HTTP/1.1 下同域连接数限制的问题，多个请求不必各自占用独立 TCP 连接。SSE 在 HTTP/2 上仍然是 HTTP 响应流，能继续复用网关、TLS 和 Header 体系。但是否真正改善，还取决于浏览器、CDN、反向代理和服务端对 HTTP/2 streaming 的支持。",
  "SSE 经过 CDN、Nginx、网关时有什么坑？":
    "最大坑是缓冲和超时：代理可能把响应缓存到一定大小或连接结束后才转发，导致前端看起来不是流式；也可能因为空闲超时断开长连接。Nginx 要关闭 proxy buffering，必要时设置 `X-Accel-Buffering: no`，并调大 read timeout。CDN 和 Serverless 平台也要确认是否支持长时间 streaming。",
  "前端如何消费 SSE？":
    "简单场景可以用 EventSource：监听 message/error/open 事件即可。AI Chat 更常用 fetch + ReadableStream，因为它支持 POST body、自定义 header、AbortController 和更灵活的流解析。无论哪种方式，前端都要解析事件边界、处理 done/error、取消请求，并避免高频 setState。",
  "EventSource 和 fetch + ReadableStream 有什么区别？":
    "EventSource 是浏览器封装好的 SSE 客户端，优点是简单、自动重连、支持 Last-Event-ID；缺点是主要使用 GET，自定义 header 和请求体能力弱，取消和复杂鉴权不够灵活。fetch + ReadableStream 更底层，可以 POST、带 Authorization、用 AbortController 停止，但需要自己解析 chunk 和重连逻辑。",
  "为什么 AI Chat 场景很多时候不用原生 EventSource？":
    "因为 AI Chat 往往需要 POST prompt、携带复杂上下文、带 Authorization header，并支持用户点击停止生成。EventSource 对这些控制不够友好，而 fetch stream 可以把 prompt 放在 body 里，也可以通过 AbortController 取消连接。代价是开发者需要自己处理 SSE 帧解析、错误和重连。",
  "如何实现打字机效果？":
    "不要简单地 token 来一个就 setState 一个。更稳的做法是把收到的 token 放进 buffer，然后用 requestAnimationFrame 或固定 16ms/30ms/50ms 的节奏批量 flush 到 UI。这样既保留流式感，又能避免输出忽快忽慢和 React 高频渲染造成的卡顿。",
  "如何避免 token 到达不均匀导致 UI 抖动？":
    "可以把网络层到达的 token 和 UI 层渲染解耦。网络层尽快读流并追加到 pending buffer；UI 层按固定节奏取出一小段内容渲染，必要时在句号、换行、代码块边界处做更自然的输出。这样即使上游模型一阵快一阵慢，用户看到的输出也更平滑。",
  "流式内容如何追加到 React state？":
    "推荐用 ref 保存临时 buffer，用函数式 setState 追加最终要展示的文本，例如 `setText(prev => prev + chunk)`。不要依赖闭包里的旧 text，也不要每个 token 都 setState。复杂场景可以把消息拆成 messageId、status、content、chunks，并用 reducer 管理状态机。",
  "React 中频繁 setState 会有什么性能问题？":
    "频繁 setState 会导致组件不断重新渲染，Markdown 解析、代码高亮、自动滚动和布局计算都会被重复触发。长回答越长，重新渲染成本越高。优化方式包括批量更新、拆分组件、memo、虚拟化长内容、延迟 Markdown 解析，以及只对增量区域做处理。",
  "如何做流式渲染的节流或批量更新？":
    "可以用 requestAnimationFrame、setTimeout interval 或 scheduler 思路，把多个 token 合并后再更新 UI。常见策略是 16ms 一帧或 50ms 一次 flush；低端设备可以更慢一点。关键是网络读取不要停，UI 更新要控频，避免阻塞主线程和滚动。",
  "用户切换页面时如何取消 SSE 请求？":
    "前端应在组件卸载或路由切换时调用 AbortController.abort，关闭 fetch stream。服务端要监听 close/aborted 事件，停止写响应并取消上游模型请求。否则用户离开页面后，服务端可能还在消耗模型 token，造成资源浪费和费用增加。",
  "如何处理 Markdown 流式渲染？":
    "流式 Markdown 会出现未闭合代码块、表格、列表、链接等中间状态，所以渲染器要能容错。可以先按纯文本或轻量 Markdown 展示，完成后再做完整解析；也可以增量解析但要限制频率。无论哪种方式，AI 输出都不能直接 dangerouslySetInnerHTML，必须 sanitize。",
  "Node.js 或 Nest.js 如何返回 SSE？":
    "Node 层面就是保持 HTTP response 不结束，并持续 `res.write` SSE 格式数据。Nest.js 可以用 `@Sse()` 返回 Observable，也可以在底层 response 上手动写 header 和 chunk。AI Chat 场景中手动控制 response 更灵活，便于处理模型 SDK、取消、错误和 done 事件。",
  "Nest.js 里 @Sse() 怎么用？":
    "`@Sse()` 可以让 Controller 返回一个 Observable，每次 next 一个 `{ data, type, id }` 这样的事件对象，Nest 会按 SSE 格式输出。它适合简单服务端推送。若要对接复杂 LLM stream、AbortController、落库和细粒度错误处理，很多团队会选择直接使用 `@Res()` 手写响应流。",
  "为什么要设置 text/event-stream、no-cache、keep-alive 等 header？":
    "`text/event-stream` 表示 SSE 响应格式；`no-cache` 避免浏览器或代理缓存流；`no-transform` 防止代理压缩或改写内容；`keep-alive` 表示保持连接。它们共同保证客户端能持续收到增量内容，而不是被缓存、压缩、缓冲或提前关闭。",
  "如何防止响应被 Nginx 缓冲？":
    "Nginx 默认可能缓冲上游响应，导致服务端明明分块写了，浏览器却等缓冲满或响应结束才收到。解决方式包括设置 `proxy_buffering off`，或响应头加 `X-Accel-Buffering: no`，并关闭不合适的 gzip buffering。还要确认 CDN、API Gateway 是否也有类似缓冲策略。",
  "后端如何把 LLM token 转成 SSE chunk？":
    '后端读取模型 SDK 返回的 stream，每收到一个 delta 就包装成 SSE 帧，例如 `event: token\\ndata: {"delta":"..."}\\n\\n`。建议同时带 messageId、sequence、createdAt 等元数据，便于前端去重和排查。流结束时发送 done 事件，而不是让前端只靠连接关闭判断完成。',
  "如何处理客户端断开连接？":
    "服务端要监听 request 或 response 的 close/aborted 事件。一旦客户端断开，就停止继续 res.write，取消上游模型调用，清理 timer、订阅和临时 buffer，并把消息状态更新为 cancelled 或 interrupted。否则服务端会继续生成内容但无人消费。",
  "如何在服务端取消正在进行的模型请求？":
    "最好使用模型 SDK 支持的 AbortController 或 cancel API。服务端为每次生成创建一个 controller，客户端点击停止或连接关闭时触发 abort。业务上还要更新 message 状态，记录取消原因，并确保已生成的部分内容是否保留有明确策略。",
  "如何处理模型超时？":
    "模型调用应设置首 token 超时和总生成超时。首 token 超时用于发现上游迟迟无响应，总超时用于限制长回答和成本。超时后服务端发送 error 事件或结束流，更新消息状态为 failed/timeout，并给前端可重试入口。不要让连接无限挂着。",
  "如何在流结束时发送 [DONE]？":
    "可以发送一个明确的 done 事件，例如 `event: done\\ndata: [DONE]\\n\\n`。OpenAI 风格常见 `[DONE]` 哨兵值，但更结构化的做法是发送 JSON：`{ messageId, status: 'completed', usage }`。前端收到 done 后关闭 loading、落定 Markdown、停止自动重试。",
  "如何把生成结果最终落库？":
    "常见做法是生成开始时创建 assistant message，状态为 streaming；流式过程中可以只在内存聚合内容，或定期 checkpoint；完成后把完整内容、usage、模型、耗时写入数据库并改为 completed。失败或取消时写 failed/cancelled，保留已生成内容的策略要产品和后端统一。",
  "AI token streaming 的完整链路怎么设计？":
    "链路通常是：前端 POST prompt，后端创建 user message 和 assistant message，调用模型 stream，逐个 delta 转成 SSE 推给前端，前端增量渲染，完成后后端落库并发送 done。旁路还要有鉴权、限流、内容安全、traceId、usage 统计、取消和失败恢复。",
  "前端收到的是 token、delta 还是完整 message？":
    "更准确地说，前端收到的通常是 delta，也就是本次新增片段；它可能是 token、词片段、句子片段或结构化事件。完整 message 应由前端增量拼接用于展示，并由服务端在完成后落库确认。不要假设每个 chunk 都是完整语义单位。",
  "如何处理 tool call 或 function call 的流式返回？":
    "应把 tool call 当作独立事件类型，而不是混在普通文本里。模型可能分多次返回 tool name、arguments JSON 片段，后端需要累积并校验参数完整性，确认可执行后再调用工具。前端可以展示“正在调用工具”，最终把工具结果作为下一轮上下文继续生成。",
  "如何处理 reasoning content 和 answer content 分离？":
    "如果模型返回 reasoning 和 final answer 两类内容，SSE 事件应明确区分，例如 `event: reasoning` 和 `event: answer`。前端根据产品策略决定是否展示 reasoning。服务端落库时也要分字段保存，避免把内部推理内容误展示给不该看的用户。",
  "流式生成过程中如何做敏感词过滤？":
    "敏感词过滤可以分输入前、输出中、输出后三层。输出中最难，因为违规内容可能跨 chunk 才形成完整词句。工程上可以用滑动窗口缓存最近若干字符做增量检测，发现风险后中断流并发送安全提示；最终内容落库前还要做完整审核。",
  "内容安全是在流式前、流式中还是流式后做？":
    "三者都要做，只是目的不同。流式前审核 prompt，避免明显违规请求进入模型；流式中做增量检测，降低实时输出风险；流式后对完整回答做最终审核和落库策略。高风险业务不能只依赖模型自身安全对齐。",
  "如果中途失败，已经输出的内容怎么处理？":
    "要有明确状态和产品策略。可以保留部分内容并标记 interrupted/failed，也可以丢弃未完成回答。服务端应记录错误原因和已生成文本，前端展示“生成中断，可重试”。重试时要避免重复创建混乱消息，可以基于同一个 messageId 重新生成或创建新版本。",
  "如何支持用户点击停止生成？":
    "前端点击停止时调用 AbortController 断开流，并通知服务端取消生成。服务端收到取消后 abort 模型请求、停止写 SSE、更新 message 状态为 cancelled。前端要停止 loading，并决定保留当前已输出文本还是显示“已停止”。",
  "如何支持断线后恢复？":
    "服务端要能根据 messageId 和 lastSequence 找到已发送或已落库的内容，前端重连时带上最后收到的序号。服务端从下一个序号继续推送，或返回当前完整内容让前端对齐。没有 sequence/id 的流只能粗糙重试，容易重复渲染。",
  "如何设计 message 状态机？":
    "一个实用状态机可以包含 created、queued、streaming、completed、failed、cancelled。创建消息后进入 streaming，收到 done 后 completed，异常后 failed，用户停止后 cancelled。状态机能让前端展示、重试、恢复、审计和计费都有统一依据。",
  "SSE 连接断了怎么办？":
    "前端要区分正常 done、用户取消和异常断开。异常断开时可以按指数退避重连，并携带 messageId、Last-Event-ID 或 lastSequence。服务端如果支持恢复，就续传缺失部分；如果不支持，应返回当前消息状态，让前端提示用户重试。",
  "Last-Event-ID 是什么？":
    "Last-Event-ID 是 EventSource 重连时浏览器自动带上的最后事件 id。服务端每个事件写 `id:` 后，浏览器会记住它；断线重连时通过 Last-Event-ID 告诉服务端从哪里恢复。fetch stream 不会自动处理，需要业务自己传 lastSequence。",
  "如何实现断点续传？":
    "需要服务端给每个 chunk 分配递增 sequence，并保存已生成内容或至少保存可恢复状态。前端记录最后成功渲染的 sequence，重连时带上它。服务端从 sequence + 1 继续发送，前端按 sequence 去重，避免重复追加文本。",
  "如何设计消息 id？":
    "通常 messageId 在服务端创建 assistant message 时生成，整个流生命周期保持不变；chunk sequence 在 message 内递增。messageId 用于定位一条回答，sequence 用于恢复和排序。不要只用时间戳做唯一标识，分布式系统里建议用数据库 id、UUID 或雪花 id。",
  "前端重连时如何避免重复渲染 token？":
    "前端应维护已处理的最大 sequence 或已处理 id 集合。收到 chunk 时，如果 sequence 小于等于 lastSequence 就丢弃；如果大于 lastSequence + 1，说明中间有缺口，应触发恢复或重新同步。不要只靠字符串拼接判断重复，这在相同文本片段时会失效。",
  "服务端如何知道客户端已经断开？":
    "Node/Nest 可以监听 request 的 `close`、`aborted` 或 response 的 `close` 事件。触发后说明客户端连接已断或响应关闭，服务端应停止写入，清理 interval，取消模型 stream。还要处理 res.write 返回 false 时的 backpressure，避免内存堆积。",
  "长连接太多时如何限流？":
    "可以按用户、租户、IP、模型和接口维度限制并发 SSE 连接数，并限制每分钟创建会话次数。超限时直接拒绝或排队。AI 场景还要限制最大输出 token、最大持续时间和总成本预算，否则少量用户就可能占满连接和模型额度。",
  "SSE 会不会导致服务端连接资源被占满？":
    "会。SSE 是长连接，每个连接都会占用服务端 socket、内存、上下文和上游模型资源。虽然 Node 适合 I/O 并发，但连接数过多仍会影响文件描述符、负载均衡、内存和模型成本。因此生产环境必须做连接限制、超时、心跳和资源清理。",
  "如何设置超时和心跳？":
    "通常设置首 token 超时、空闲超时、总生成超时和代理 read timeout。心跳可以每 15 到 30 秒发送一次 `event: ping`，防止中间代理认为连接空闲。超时策略要前后端一致，前端看到 timeout 后给出重试或恢复入口。",
  "心跳包通常怎么发？":
    "心跳可以发注释行 `: ping\\n\\n`，也可以发事件 `event: ping\\ndata: {}\\n\\n`。注释行不会触发普通 message 事件，适合纯保活；显式 ping 事件方便前端监控连接状态。无论哪种，都要避免太频繁，防止浪费带宽。",
  "token 每来一个就渲染一次有什么问题？":
    "这会造成 React 高频 render、Markdown 高频解析、滚动频繁触发和布局抖动。模型输出越快、内容越长，页面越容易卡顿。更好的做法是网络层持续接收，UI 层节流刷新，把多个 token 合并成一批更新。",
  "如何减少 React re-render？":
    "可以把 token 暂存在 ref buffer 中，用 requestAnimationFrame 或定时器批量 setState；把消息列表和当前流式消息拆成独立组件；对稳定部分使用 memo；完成后再做重型 Markdown/代码高亮。核心是减少全页面因一个 token 变化而重渲染。",
  "如何实现平滑打字机？":
    "平滑打字机要控制显示节奏，而不是完全跟随网络到达节奏。可以每帧或每几十毫秒从 buffer 中取固定数量字符，遇到标点和换行适当停顿。这样既保留实时输出，又避免 token burst 造成一大段突然出现。",
  "流式 Markdown 怎么避免频繁全量解析？":
    "可以降低解析频率，只在 buffer flush 时解析；也可以把纯文本展示和最终 Markdown 渲染分阶段处理。对于代码块和表格，未闭合时先按纯文本或临时块展示，完成后再正式高亮。长内容要避免每次 token 都全量 AST parse。",
  "长回答越来越长时，页面性能怎么优化？":
    "长回答会带来 DOM 增长、Markdown 解析变慢和滚动成本增加。可以分段渲染消息、懒加载历史消息、虚拟化消息列表、限制单条回答最大长度，并把代码高亮延迟到生成结束。必要时把解析放到 Web Worker。",
  "自动滚动到底部怎么做？":
    "常见做法是在内容更新后，如果用户当前接近底部，就滚动到末尾；可以用 ref 指向底部锚点并调用 scrollIntoView。要加阈值判断，比如距离底部小于 80px 才自动滚动，避免用户正在阅读上文时被强行拉回底部。",
  "用户手动向上滚动时，是否还要自动滚动？":
    "不应该强制自动滚动。用户手动上滚说明他在阅读历史内容，此时应暂停自动滚动，并显示“回到底部”按钮。只有用户回到底部附近，或点击按钮后，才恢复自动跟随。这个细节非常影响 AI Chat 体验。",
  "如何处理代码块流式输出？":
    "代码块可能先出现 ``` 但还没闭合，流式过程中语法高亮器可能解析失败或闪烁。可以在未闭合时先按普通 pre 文本展示，检测闭合后再高亮；也可以延迟高亮到 done 事件后。复制按钮也应等代码块稳定后再启用。",
  "如何处理表格、列表、Markdown 未闭合语法？":
    "要接受流式 Markdown 的中间态是不完整的。渲染器应容错，不应因为未闭合语法导致页面崩溃。产品上可以先保守展示为文本，done 后再做完整 Markdown 渲染。对于表格这类结构化内容，最好等段落边界稳定后再切换展示。",
  "如何做首 token 延迟优化？":
    "首 token 延迟由前端请求、后端排队、上下文构造、模型响应和代理缓冲共同决定。优化方式包括减少 prompt 预处理耗时、缓存系统提示词和上下文、选择更低延迟模型、提前 flush header、关闭代理缓冲，并监控 time to first token。",
  "SSE 请求如何鉴权？":
    "可以使用 httpOnly Cookie，也可以使用 Bearer Token。Cookie 对浏览器友好，但要考虑 SameSite 和 CSRF；Bearer Token 对跨域 API 更显式，但要注意 token 存储安全。无论哪种，服务端都必须在建立流之前完成鉴权，并在流期间遵守租户和权限边界。",
  "Cookie 鉴权和 Bearer Token 哪个更适合？":
    "如果是同站 Web 应用，httpOnly + secure + SameSite Cookie 通常更安全，避免 token 暴露给 JS。若是跨端 API、移动端或第三方调用，Bearer Token 更通用。SSE 使用 EventSource 时自定义 header 不方便，Cookie 更自然；fetch stream 则两者都可用。",
  "SSE 会不会有 CSRF 风险？":
    "如果 SSE 接口使用 Cookie 鉴权，并且会触发有副作用的行为，就要考虑 CSRF。原则上 SSE GET 应只读，不应创建生成任务；创建任务应走 POST 并校验 CSRF token、Origin/Referer 或 SameSite。AI Chat 推荐 POST 创建任务，SSE 只负责读取流。",
  "如何防止 XSS，尤其是 AI 返回 Markdown 或 HTML？":
    "AI 输出是不可信输入，不能直接插入 HTML。Markdown 渲染要禁用危险 HTML 或使用 sanitize，过滤 script、onerror、javascript: URL 等危险内容。即使模型看似安全，也可能被 prompt injection 诱导输出恶意 HTML，所以输出侧防护必须存在。",
  "Nginx 反向代理 SSE 要配置什么？":
    "关键是关闭 buffering、调大 read timeout、禁用不合适的压缩缓冲，并保留长连接。常见配置包括 `proxy_buffering off`、`proxy_read_timeout 3600s`，响应头加 `X-Accel-Buffering: no`。还要确认 HTTP/2、CDN 和上游框架没有再次缓冲。",
  "Vercel 或 Serverless 环境适合长 SSE 吗？":
    "要看平台是否支持 streaming、最大执行时长和连接超时。Serverless 对短请求友好，但长时间 SSE 可能受超时、冷启动和并发限制影响。AI Chat 如果回答时间较长，最好确认平台文档，必要时使用支持长连接的 Node 服务、Edge streaming 或专门的后端服务。",
  "SSE 在负载均衡下有什么注意点？":
    "SSE 是长连接，请求一旦落到某个实例，流期间通常由该实例持续负责。若要断线恢复，不能只依赖实例内存，需要把 message 状态和 chunk 序号存到共享存储。负载均衡还要配置超时、连接数和健康检查，避免滚动发布中断大量连接。",
  "如何做连接数限制？":
    "可以在网关层和应用层同时限制。应用层按 userId、tenantId、IP 统计当前活跃连接，超过阈值拒绝或踢掉旧连接。还要限制单连接最长时间、最大 token、最大并发生成数。AI 场景下连接限制也是成本控制的一部分。",
  "如何记录流式请求日志？":
    "日志要覆盖开始、首 token、每类错误、取消、完成等关键事件，但不要每个 token 都打日志。建议记录 traceId、userId、messageId、model、timeToFirstToken、duration、status、errorCode、usage。敏感 prompt 和回答内容要脱敏或按合规策略存储。",
  "如何统计 token 用量和费用？":
    "优先使用模型供应商返回的 usage；如果流式中最后才返回 usage，需要在 done 事件后更新数据库。也可以在服务端估算 prompt/completion token 用于实时预算控制。费用统计应绑定 user/tenant/message/model，并处理失败、取消和重试时的计费口径。",
  "设计一个 AI Chat 的 SSE 流式响应系统，要求支持打字机输出、用户停止生成、刷新后恢复、消息落库、失败重试和 Markdown 安全渲染，你会怎么做？":
    "我会把系统拆成发起、生成、推流、恢复和落库五部分。前端 POST 创建对话消息，随后用 fetch stream 读取 SSE；UI 层用 buffer + requestAnimationFrame 实现打字机，并用 AbortController 支持停止。后端创建 assistant message，状态为 streaming，调用模型后把 delta 包装成带 messageId、sequence、event 的 SSE 帧；客户端断开或点击停止时 abort 模型请求。服务端定期或最终落库内容，完成后状态改为 completed，失败为 failed，取消为 cancelled。刷新恢复时前端带 lastSequence 查询或重连，服务端续传或返回当前完整状态。Markdown 渲染必须 sanitize，日志记录 traceId、首 token 延迟、总耗时、usage 和错误码。",
};

function createQuestion(
  category: SseCategory,
  question: string,
  index: number,
  globalIndex: number,
): SseQuestion {
  const profile = categoryProfiles[category];
  const upgrade = questionUpgrades[globalIndex];
  const questionCode =
    category === sseCategories[2] ? frontendQuestionCodeExamples[index - 3] : undefined;
  const code =
    upgrade?.codeExample || upgrade?.codeExplanation
      ? {
          codeExample: upgrade.codeExample,
          codeExplanation: upgrade.codeExplanation,
        }
      : (questionCode ?? (index === 0 ? codeExamples[category] : undefined));

  return {
    category,
    question,
    answer: upgrade?.answer ?? answerOverrides[question] ?? profile.answer,
    seniorPerspective: upgrade?.seniorPerspective ?? profile.seniorPerspective,
    talkingPoints: upgrade?.talkingPoints ?? profile.talkingPoints,
    codeExample: code?.codeExample,
    codeExplanation: code?.codeExplanation,
  };
}

let globalQuestionIndex = 0;

export const sseQuestions: SseQuestion[] = sseCategories.flatMap((category) =>
  questionGroups[category].map((question, index) => {
    globalQuestionIndex += 1;
    return createQuestion(category, question, index, globalQuestionIndex);
  }),
);
