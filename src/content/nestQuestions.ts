export type NestQuestion = {
  category:
    | "TypeScript 与 Node.js"
    | "Nest.js 核心机制"
    | "Nest.js 高级能力"
    | "数据库与 ORM"
    | "鉴权与权限"
    | "API 设计"
    | "缓存与性能"
    | "微服务与消息队列"
    | "文件上传与对象存储"
    | "全栈协作"
    | "安全"
    | "测试"
    | "工程化与部署"
    | "系统设计";
  question: string;
  answer: string;
  seniorPerspective: string;
  talkingPoints: string[];
  codeExample?: string;
  codeExplanation?: string[];
};

export const nestCategories: NestQuestion["category"][] = [
  "TypeScript 与 Node.js",
  "Nest.js 核心机制",
  "Nest.js 高级能力",
  "数据库与 ORM",
  "鉴权与权限",
  "API 设计",
  "缓存与性能",
  "微服务与消息队列",
  "文件上传与对象存储",
  "全栈协作",
  "安全",
  "测试",
  "工程化与部署",
  "系统设计",
];

export const nestQuestions: NestQuestion[] = [
  {
    category: "TypeScript 与 Node.js",
    question: "高级 Nest.js 工程师为什么必须理解 TypeScript 装饰器和 metadata？",
    answer:
      "Nest.js 的控制器、Provider、Guard、Pipe、Interceptor 很多能力都建立在装饰器和 metadata 之上。装饰器本质上是在类、方法、参数上附加声明式信息；Nest 启动时通过反射读取这些信息，构建路由表、依赖关系、参数注入规则和权限规则。高级工程师不能只会用 `@Controller()`、`@Injectable()`，还要知道这些装饰器把什么信息写到了哪里，以及框架如何在运行时消费它。",
    seniorPerspective:
      "在大型项目里，自定义装饰器是沉淀横切规则的关键手段，例如权限标记、审计日志、租户隔离、接口版本、灰度策略。好的装饰器应该只表达元信息，不把复杂业务塞进装饰器本身；真正的执行逻辑交给 Guard、Interceptor 或 Pipe，这样职责更清晰，也更容易测试。",
    talkingPoints: [
      "装饰器负责声明，Guard/Interceptor/Pipe 负责执行。",
      "metadata 让 Nest 可以在运行时扫描路由、参数和依赖。",
      "自定义装饰器适合做权限、审计、租户、版本等横切标记。",
    ],
    codeExample: `import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);`,
    codeExplanation: [
      "`SetMetadata` 把 roles 写到 handler 或 class 上。",
      "后续 Guard 可以通过 Reflector 读取这些 metadata。",
      "装饰器不做鉴权，只声明当前接口需要什么角色。",
    ],
  },
  {
    category: "TypeScript 与 Node.js",
    question: "Node.js Event Loop 对 Nest.js 接口性能有什么影响？",
    answer:
      "Nest.js 运行在 Node.js 之上，所有请求处理最终都会回到事件循环。Node 适合 I/O 密集型服务，例如数据库、Redis、HTTP 调用、消息队列；但 CPU 密集型任务会阻塞事件循环，导致所有请求延迟上升。高级工程师要能区分 I/O 等待和 CPU 阻塞，不能把大 JSON 计算、加密压缩、图片处理、复杂报表直接塞在请求线程里。",
    seniorPerspective:
      "线上排查时，我会看 p95/p99 延迟、event loop lag、CPU profile、慢查询和 GC 情况。如果是 CPU 阻塞，考虑 Worker Threads、独立任务服务或队列异步化；如果是 I/O 慢，优先看连接池、索引、缓存、下游超时和重试策略。",
    talkingPoints: [
      "Node 并不是不能高并发，而是不能让主线程做重 CPU。",
      "接口慢要区分 event loop lag、数据库慢和下游慢。",
      "重任务应通过队列、Worker Threads 或独立服务拆出去。",
    ],
    codeExample: `import { monitorEventLoopDelay } from "node:perf_hooks";

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log("event loop p99(ms)", histogram.percentile(99) / 1e6);
  histogram.reset();
}, 10_000);`,
    codeExplanation: [
      "`monitorEventLoopDelay` 可以观察事件循环延迟。",
      "p99 持续升高通常说明主线程被 CPU、同步 I/O 或 GC 阻塞。",
      "这类指标应接入监控，而不是只靠接口日志猜。",
    ],
  },
  {
    category: "TypeScript 与 Node.js",
    question: "Node.js Stream 在全栈项目里有什么实际价值？",
    answer:
      "Stream 适合处理大文件、导入导出、日志、下载代理、AI 流式响应等场景。它的核心价值是分块处理，避免把完整内容一次性读入内存。比如一个 2GB 文件上传或导出，如果直接 Buffer 全量加载，很容易打爆内存；用 Stream 可以边读边写，并通过 backpressure 控制生产和消费速度。",
    seniorPerspective:
      "高级全栈工程师要能把 Stream 和产品体验结合起来：大文件上传要支持进度、断点续传和失败重试；报表导出要异步生成并通知用户；AI 输出要用 SSE 或 fetch stream 逐步展示。这里不只是 API 会写，而是要理解内存、网络、用户等待时间和服务稳定性。",
    talkingPoints: [
      "Stream 降低内存峰值。",
      "backpressure 防止生产速度压垮消费端。",
      "大文件和 AI 流式输出都离不开流式思维。",
    ],
  },
  {
    category: "Nest.js 核心机制",
    question: "Nest.js 的 Module、Controller、Provider 分别解决什么问题？",
    answer:
      "Module 是组织边界，Controller 是 HTTP/RPC 入口，Provider 是可注入的业务能力。Module 把相关 Provider、Controller 和导出依赖组织起来；Controller 负责协议层，包括路由、参数、状态码；Provider 承载业务逻辑、仓储访问、外部服务调用等可复用能力。高级项目里要避免 Controller 变厚，也要避免 Module 无边界地互相 import。",
    seniorPerspective:
      "我会按业务域拆模块，例如 UserModule、OrderModule、PaymentModule，而不是按技术层拆成 ControllerModule、ServiceModule。模块之间只暴露必要的 Provider，复杂依赖通过领域服务或事件解耦，避免循环依赖。模块边界设计好，后续拆微服务、做权限隔离、做测试都会更顺。",
    talkingPoints: [
      "Controller 只做协议适配，Service 做业务编排。",
      "Module 是边界，不是文件夹装饰。",
      "避免循环依赖和全局模块滥用。",
    ],
  },
  {
    category: "Nest.js 核心机制",
    question: "Middleware、Guard、Pipe、Interceptor、Filter 的执行顺序和职责是什么？",
    answer:
      "典型请求链路是 Middleware 先执行，然后 Guard 判断是否允许进入，Pipe 做参数转换和校验，Controller 执行业务，Interceptor 可以在方法前后包裹处理，Exception Filter 负责捕获异常并统一响应。它们看似都能处理请求，但职责不同：Middleware 更偏底层请求预处理；Guard 做权限；Pipe 做输入质量；Interceptor 做横切增强；Filter 做错误出口。",
    seniorPerspective:
      "高级工程里最重要的是不要混用职责。比如鉴权不要写在 Pipe，响应包装不要写在 Controller，错误格式不要散落在 catch 里。把横切逻辑放在正确的 Nest 机制里，团队协作时才能形成统一约定，也方便全局启用、局部覆盖和单元测试。",
    talkingPoints: [
      "Guard 决定能不能进，Pipe 决定参数是否合格。",
      "Interceptor 适合日志、埋点、响应包装、缓存。",
      "Filter 统一异常出口，避免业务层到处 try/catch。",
    ],
    codeExample: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());`,
    codeExplanation: [
      "全局 Pipe 保证所有 DTO 校验和类型转换一致。",
      "全局 Interceptor 可以统一响应结构和 trace 日志。",
      "全局 Filter 负责把异常转成稳定错误码和错误响应。",
    ],
  },
  {
    category: "Nest.js 核心机制",
    question: "Nest.js DI 容器是怎么工作的？Provider 作用域怎么选？",
    answer:
      "Nest 启动时会扫描模块元数据，把 Provider 注册到 IoC 容器中，并根据构造函数参数类型或 token 解析依赖。默认 Provider 是 singleton，同一个应用生命周期内复用一份实例。Nest 还支持 request scope 和 transient scope，但它们会增加实例创建和依赖解析成本，不应随意使用。",
    seniorPerspective:
      "我默认选择 singleton，把请求级上下文放到 request object、AsyncLocalStorage 或显式参数中。只有当 Provider 必须持有请求独有状态时才考虑 request scope，例如多租户上下文、请求级 Unit of Work。高级工程师要关注 DI 作用域对性能和内存的影响，尤其高 QPS 服务里 request-scoped provider 可能明显增加开销。",
    talkingPoints: [
      "默认 singleton 性能最好。",
      "request scope 适合请求级状态，但成本更高。",
      "token 注入可以解耦接口和实现。",
    ],
    codeExample: `export const PAYMENT_GATEWAY = Symbol("PAYMENT_GATEWAY");

@Module({
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripeGateway,
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentModule {}`,
    codeExplanation: [
      "Symbol token 避免直接依赖具体类名。",
      "未来可以把 `StripeGateway` 替换成其他实现。",
      "这也是做插件化和环境差异实现的基础。",
    ],
  },
  {
    category: "Nest.js 高级能力",
    question: "动态模块 forRoot / forRootAsync 适合解决什么问题？",
    answer:
      "动态模块适合做可配置基础设施模块，例如数据库、Redis、对象存储、SDK、消息队列。`forRoot` 用于同步配置，`forRootAsync` 用于依赖 ConfigService、异步读取密钥或根据环境生成配置。它让模块既能封装内部 Provider，又能把配置入口暴露给业务方。",
    seniorPerspective:
      "大型项目里，我会把三方 SDK、基础设施连接和跨项目复用能力做成动态模块。关键是控制模块的 public API：只导出业务需要的 service/token，不泄露内部实现。`forRootAsync` 里要注意启动失败策略，如果关键配置缺失，应在应用启动期失败，而不是运行到一半才报错。",
    talkingPoints: [
      "动态模块用于配置型、可复用基础设施能力。",
      "forRootAsync 适合依赖 ConfigService 或异步密钥。",
      "只导出稳定 token，隐藏内部 Provider。",
    ],
    codeExample: `@Module({})
export class SmsModule {
  static forRootAsync(): DynamicModule {
    return {
      module: SmsModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: "SMS_CLIENT",
          inject: [ConfigService],
          useFactory: (config: ConfigService) => new SmsClient(config.getOrThrow("SMS_KEY")),
        },
        SmsService,
      ],
      exports: [SmsService],
    };
  }
}`,
    codeExplanation: [
      "`useFactory` 可以读取配置并创建 SDK client。",
      "业务方只依赖 `SmsService`，不需要知道底层 SDK。",
      "`getOrThrow` 让关键配置缺失时启动失败。",
    ],
  },
  {
    category: "Nest.js 高级能力",
    question: "如何用 Interceptor 做统一响应、日志和性能埋点？",
    answer:
      "Interceptor 可以包裹 Controller handler 的执行过程，适合做方法执行前后的横切逻辑。常见场景包括统一响应结构、记录耗时、注入 traceId、缓存响应、转换字段、屏蔽敏感信息等。相比在 Controller 里手写，Interceptor 的优势是统一、可组合、可测试。",
    seniorPerspective:
      "线上系统里我不会只记录普通 access log，而是会把 traceId、用户 id、租户 id、路由、耗时、状态码、错误码都结构化输出，方便链路追踪和问题定位。统一响应也要谨慎：文件下载、SSE、流式响应不应被普通 JSON 包装破坏，所以 Interceptor 要能识别例外场景。",
    talkingPoints: [
      "Interceptor 是 AOP 的核心落点。",
      "日志应结构化，并带 traceId。",
      "响应包装要避开文件、SSE、Stream 等特殊响应。",
    ],
  },
  {
    category: "Nest.js 高级能力",
    question: "自定义参数装饰器在实际业务中怎么用？",
    answer:
      "参数装饰器适合从请求上下文中提取稳定信息，例如当前用户、租户 id、traceId、客户端信息。它能让 Controller 签名更干净，避免每个接口重复 `req.user`、`req.headers`。但装饰器只应该读取上下文，不应该做数据库查询或复杂业务判断。",
    seniorPerspective:
      "我会把认证后的 user payload 放到 request 上，再通过 `@CurrentUser()` 读取。这样 Guard 负责认证，装饰器负责提取，Service 接收明确的 userId 或 tenantId。职责拆清楚后，测试更简单，也避免 Controller 被 request 细节污染。",
    talkingPoints: [
      "参数装饰器用于读取上下文。",
      "认证逻辑留给 Guard。",
      "Service 不应依赖 HTTP request 对象。",
    ],
    codeExample: `export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);`,
    codeExplanation: [
      "`ExecutionContext` 可以切换到 HTTP/RPC/WS 上下文。",
      "这里假设 Guard 已经把 user 写入 request。",
      "业务 Service 最好接收 userId，而不是整个 request。",
    ],
  },
  {
    category: "数据库与 ORM",
    question: "TypeORM 和 Prisma 怎么选？",
    answer:
      "TypeORM 更接近传统 ORM，装饰器实体、Repository、QueryBuilder 灵活度高；Prisma 类型安全和开发体验更好，schema-first、迁移和自动补全很强。选择时要看团队习惯、复杂查询比例、迁移治理、类型安全诉求和生态成熟度。没有绝对更好，关键是项目约束和团队能力匹配。",
    seniorPerspective:
      "如果项目强调类型安全、快速迭代、模型清晰，我倾向 Prisma；如果项目已有复杂 SQL、强依赖 QueryBuilder 或历史 TypeORM 体系，继续 TypeORM 更现实。高级工程师不能只说喜欢哪个库，还要考虑迁移成本、连接池、事务、日志、监控、慢查询分析和团队学习成本。",
    talkingPoints: [
      "Prisma 类型体验强，TypeORM 灵活度高。",
      "复杂报表不应强行 ORM 化，可保留原生 SQL。",
      "选型要考虑团队、历史系统和迁移成本。",
    ],
  },
  {
    category: "数据库与 ORM",
    question: "Nest.js 中如何保证事务一致性？",
    answer:
      "事务要保证一组数据库操作要么全部成功，要么全部回滚。简单场景可以在 Service 方法内使用 ORM 提供的 transaction API；复杂场景要避免跨 Service 随意开启多个事务，最好引入 Unit of Work 或显式传递 transaction manager。事务边界应围绕业务用例，而不是围绕单个 repository 方法。",
    seniorPerspective:
      "高级项目里，事务要和幂等、锁、消息一致性一起考虑。比如创建订单后发消息，如果数据库提交成功但消息发送失败，就会出现不一致。常见做法是 outbox pattern：在同一个事务里写业务表和消息表，再由后台任务可靠投递消息。",
    talkingPoints: [
      "事务边界应该是业务用例。",
      "跨服务一致性不要幻想一个本地事务解决。",
      "订单、支付、库存常结合 outbox、幂等和补偿。",
    ],
    codeExample: `await this.prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: createOrderDto });
  await tx.outbox.create({
    data: { topic: "order.created", payload: JSON.stringify({ orderId: order.id }) },
  });
  return order;
});`,
    codeExplanation: [
      "业务数据和 outbox 消息在同一个事务里提交。",
      "后台 worker 再从 outbox 表投递消息。",
      "这样可以避免数据库成功但消息丢失。",
    ],
  },
  {
    category: "数据库与 ORM",
    question: "如何处理 N+1 查询和大表分页？",
    answer:
      "N+1 查询通常发生在循环里逐条查询关联数据，解决方式包括 join、批量查询、DataLoader 或预加载。大表分页要避免深 offset，因为数据库仍要扫描和丢弃大量记录。更稳定的方式是 cursor pagination，使用递增 id、创建时间或业务排序字段作为游标，并配合合适索引。",
    seniorPerspective:
      "线上接口分页不仅要返回数据，还要保证排序稳定、索引命中、权限过滤正确。列表接口要限制 pageSize，避免导出类需求复用分页接口。对于复杂搜索，我会考虑 ES/OpenSearch；对于后台报表，我会异步生成，不让用户请求直接拖垮主库。",
    talkingPoints: [
      "N+1 用批量查询或 DataLoader。",
      "深分页避免 offset，优先 cursor。",
      "列表、搜索、导出是三类需求，不要混成一个接口。",
    ],
  },
  {
    category: "鉴权与权限",
    question: "JWT + Refresh Token 如何设计才安全？",
    answer:
      "常见设计是 Access Token 短期有效，Refresh Token 长期有效且可撤销。Access Token 用于接口认证，过期后用 Refresh Token 换新；Refresh Token 应存储在 httpOnly secure cookie 或安全存储中，并在服务端保存 hash、设备信息、过期时间和撤销状态。退出登录、改密码、风控命中时要能撤销 refresh token。",
    seniorPerspective:
      "高级系统里，token 设计要考虑盗用检测和多端管理。比如 refresh token rotation：每次刷新都签发新 refresh token，并让旧 token 失效；如果旧 token 再次出现，说明可能被盗用。还要结合 IP、UA、设备 id、风险等级和审计日志，不要只靠 JWT 自包含。",
    talkingPoints: [
      "Access Token 短命，Refresh Token 可撤销。",
      "Refresh Token 服务端存 hash，不存明文。",
      "刷新轮换可以发现 token 重放风险。",
    ],
    codeExample: `@Post("refresh")
async refresh(@Req() req: Request) {
  const token = req.cookies.refreshToken;
  return this.authService.rotateRefreshToken(token);
}`,
    codeExplanation: [
      "Refresh Token 从 httpOnly cookie 读取，减少 XSS 直接窃取风险。",
      "rotate 表示刷新时同时废弃旧 token。",
      "服务端要校验 token hash、设备、过期和撤销状态。",
    ],
  },
  {
    category: "鉴权与权限",
    question: "RBAC 和 ABAC 有什么区别？Nest.js 里怎么落地？",
    answer:
      "RBAC 基于角色授权，例如 admin、editor、viewer；ABAC 基于属性授权，例如用户部门、资源归属、订单状态、租户 id。RBAC 简单稳定，适合后台菜单和通用接口权限；ABAC 更细粒度，适合数据级权限和复杂业务规则。Nest 里通常用装饰器标记权限，用 Guard 读取 metadata 并结合用户上下文判断。",
    seniorPerspective:
      "实际系统经常是 RBAC + ABAC 混合。先用 RBAC 判断有没有访问某类资源的资格，再用 ABAC 判断能不能访问这一条数据。比如客服角色能看订单，但只能看自己负责区域的订单。高级工程师要把接口权限、菜单权限、数据权限分开设计，避免只做前端菜单隐藏造成越权。",
    talkingPoints: [
      "RBAC 管角色能力，ABAC 管上下文条件。",
      "前端菜单权限不是安全边界。",
      "数据权限必须在服务端查询条件或策略里落地。",
    ],
  },
  {
    category: "鉴权与权限",
    question: "如何防止越权访问？",
    answer:
      "越权分水平越权和垂直越权。垂直越权是普通用户访问管理员能力；水平越权是用户 A 访问用户 B 的资源。防护上要在服务端做权限判断，不能依赖前端隐藏按钮。接口层用 Guard 判断角色或权限，数据层查询时必须带 ownerId、tenantId、组织范围等条件。",
    seniorPerspective:
      "我会把权限分成接口级和数据级。接口级由 Guard 快速拒绝；数据级由领域服务或 repository 统一加 scope，避免开发者漏写 where 条件。关键操作还要写审计日志，记录谁在什么时间对什么资源做了什么。",
    talkingPoints: [
      "前端只做体验，后端才是安全边界。",
      "水平越权通常发生在 id 参数直接查询。",
      "多租户系统必须强制 tenant scope。",
    ],
  },
  {
    category: "API 设计",
    question: "DTO 和 Entity 为什么要分开？",
    answer:
      "DTO 是接口契约，Entity/Model 是持久化模型。两者职责不同：DTO 面向输入输出校验和 API 兼容；Entity 面向数据库结构和领域状态。如果直接暴露 Entity，容易泄露内部字段，比如 passwordHash、deletedAt、internalStatus，也会让数据库变更影响外部 API。",
    seniorPerspective:
      "高级项目里，我会为 create、update、query、response 分别设计 DTO，而不是一个对象到处用。Response DTO 还可以隐藏敏感字段、聚合展示字段、保持接口兼容。DTO 是前后端协作契约，Entity 是内部实现，边界越清晰，重构成本越低。",
    talkingPoints: [
      "DTO 是外部契约，Entity 是内部持久化模型。",
      "不要把数据库字段原样暴露给前端。",
      "不同场景使用不同 DTO，避免万能对象。",
    ],
  },
  {
    category: "API 设计",
    question: "如何设计统一响应格式和错误码？",
    answer:
      "统一响应格式能降低前端处理成本，但要兼顾特殊响应。常见结构包括 code、message、data、traceId。错误码要稳定、可搜索、能映射业务语义；HTTP 状态码表达协议层结果，业务 code 表达业务失败原因。异常应通过 Filter 统一转换，避免 Controller 到处手写错误响应。",
    seniorPerspective:
      "我会要求错误响应带 traceId，前端报错截图能直接关联后端日志。错误码应有文档和归属模块，例如 AUTH_001、ORDER_003。对于文件下载、SSE、WebSocket，不能强行套普通 JSON 响应；统一不是僵化，稳定契约才是目标。",
    talkingPoints: [
      "HTTP status 和业务 code 各司其职。",
      "traceId 是线上排障关键字段。",
      "统一响应要排除 Stream、文件、SSE 等特殊场景。",
    ],
  },
  {
    category: "API 设计",
    question: "REST 和 GraphQL 怎么选？",
    answer:
      "REST 简单、缓存友好、生态成熟，适合资源模型清晰的业务；GraphQL 适合前端需要灵活组合数据、多个端对字段需求差异大、后端聚合复杂的场景。GraphQL 的风险是权限、复杂度控制、N+1 查询和缓存治理更复杂，不应为了新潮而引入。",
    seniorPerspective:
      "全栈团队里，我通常默认 REST + OpenAPI，除非有明确的跨端聚合痛点。GraphQL 如果落地，要配 DataLoader、query complexity limit、字段级权限和监控，否则很容易被一个复杂 query 打垮服务。",
    talkingPoints: [
      "REST 默认更稳，GraphQL 解决灵活取数字段组合。",
      "GraphQL 必须治理 N+1 和 query complexity。",
      "不要把 GraphQL 当作免设计 API 的工具。",
    ],
  },
  {
    category: "API 设计",
    question: "接口版本管理和兼容性怎么设计？",
    answer:
      "接口版本管理的核心是让客户端升级有缓冲期。常见方式包括 URL 版本 `/v1/users`、Header 版本、媒体类型版本和字段级兼容。简单业务 URL 版本最直观；企业内部 API 可以用 Header 版本减少路径污染。无论哪种方式，都要遵守向后兼容原则：新增字段通常安全，删除字段、改字段语义、改枚举值都可能破坏旧客户端。",
    seniorPerspective:
      "高级全栈项目里，版本管理不是只改 URL。它还包括 DTO 兼容、错误码兼容、前端灰度、移动端旧版本存活周期、OpenAPI 文档和废弃策略。我会给接口设 deprecation 计划：先新增新字段或新接口，双写/双读一段时间，监控旧版本调用量，再通知下线。",
    talkingPoints: [
      "新增通常兼容，删除和语义变更通常不兼容。",
      "版本策略要结合客户端发布节奏。",
      "废弃接口要有监控、通知和下线窗口。",
    ],
    codeExample: `@Controller({ path: "users", version: "2" })
export class UsersV2Controller {
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findPublicProfile(id);
  }
}`,
    codeExplanation: [
      "Nest 支持 controller 或 handler 级别的版本声明。",
      "V2 可以返回新的响应结构，同时保留 V1 给旧客户端。",
      "真实项目要配合 API 文档和调用量监控决定下线时间。",
    ],
  },
  {
    category: "缓存与性能",
    question: "如何解决缓存穿透、击穿和雪崩？",
    answer:
      "缓存穿透是查询不存在的数据绕过缓存打到数据库，可用空值缓存、布隆过滤器、参数校验解决；缓存击穿是热点 key 过期瞬间大量请求打到数据库，可用互斥锁、逻辑过期、提前刷新解决；缓存雪崩是大量 key 同时失效或 Redis 故障，可用随机过期、分层缓存、限流降级和高可用架构解决。",
    seniorPerspective:
      "高级工程师要把缓存当作一致性和可用性问题，而不是简单 get/set。热点数据要有刷新策略，缓存失败要有降级策略，缓存 key 要有版本和命名规范。对于强一致数据，缓存更新要谨慎，常用 cache aside，并通过消息或版本控制减少脏读窗口。",
    talkingPoints: [
      "穿透、击穿、雪崩是三个不同问题。",
      "热点 key 要互斥重建或逻辑过期。",
      "缓存要有降级、监控和命名规范。",
    ],
    codeExample: `const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

const lock = await redis.set(\`lock:\${key}\`, "1", "NX", "EX", 5);
if (!lock) {
  await sleep(50);
  return this.getProduct(id);
}

try {
  const data = await db.product.findUnique({ where: { id } });
  await redis.set(key, JSON.stringify(data ?? null), "EX", data ? 300 : 30);
  return data;
} finally {
  await redis.del(\`lock:\${key}\`);
}`,
    codeExplanation: [
      "空值短缓存可以缓解穿透。",
      "互斥锁防止热点 key 同时重建。",
      "真实项目要注意锁续期、异常释放和重试上限。",
    ],
  },
  {
    category: "缓存与性能",
    question: "接口性能优化应该从哪些层面入手？",
    answer:
      "接口优化要先定位瓶颈，再分层处理。常见层面包括数据库索引和 SQL、缓存命中率、下游调用耗时、序列化成本、Node event loop lag、网络传输、前端请求方式。不要一上来就加缓存，缓存可能掩盖慢 SQL 和一致性问题。",
    seniorPerspective:
      "我会建立性能画像：路由耗时、DB 耗时、Redis 耗时、外部 HTTP 耗时、队列堆积、错误率、p95/p99。优化动作要能被指标验证。高级岗位更看重闭环：发现问题、定位根因、提出方案、灰度上线、监控验证。",
    talkingPoints: [
      "先观测，再优化。",
      "p95/p99 比平均值更能说明用户体验。",
      "缓存、索引、异步化、批处理是常见手段，但要按瓶颈选择。",
    ],
  },
  {
    category: "缓存与性能",
    question: "如何设计分布式锁？",
    answer:
      "分布式锁常用于防止多个实例同时执行同一段关键逻辑，例如库存扣减、任务调度、缓存重建。Redis 锁通常使用 `SET key value NX PX ttl`，释放时必须校验 value，避免误删别人的锁。锁的 ttl、续期、失败重试、幂等和兜底补偿都要考虑。",
    seniorPerspective:
      "我不会把分布式锁当作万能一致性方案。对于资金、库存这类强一致场景，数据库事务、唯一约束、乐观锁、消息幂等可能比 Redis 锁更可靠。锁只是协调手段，不能替代业务幂等。",
    talkingPoints: [
      "加锁要有唯一 value，释放要校验 owner。",
      "锁超时和业务执行时间要匹配。",
      "关键业务不能只依赖锁，还要做幂等和约束。",
    ],
  },
  {
    category: "微服务与消息队列",
    question: "为什么要用消息队列？",
    answer:
      "消息队列用于解耦、削峰、异步化和提高系统韧性。比如下单后发短信、发邮件、更新积分、推送通知，这些不应该阻塞主流程。队列可以让主流程快速返回，后台消费者慢慢处理。同时在高峰期，队列能吸收流量波峰，保护下游服务。",
    seniorPerspective:
      "引入 MQ 不是免费的，会带来消息丢失、重复消费、顺序、延迟、积压、死信和监控问题。高级工程师要能讲清楚投递语义：至少一次、至多一次、恰好一次通常很难。大多数业务应按至少一次投递设计，然后用幂等消费保证结果正确。",
    talkingPoints: [
      "MQ 解决解耦、削峰、异步化。",
      "重复消费是常态，要做幂等。",
      "必须监控积压、失败率和死信队列。",
    ],
  },
  {
    category: "微服务与消息队列",
    question: "BullMQ 消费如何保证幂等？",
    answer:
      "BullMQ 任务可能因为超时、重试、进程重启被重复消费，所以消费者必须幂等。常见方式是使用业务唯一键、状态机、数据库唯一约束、去重表或 Redis setnx。比如支付回调不能因为消息重复就重复加款，应该用 paymentId 或 callbackId 做唯一约束。",
    seniorPerspective:
      "我会把幂等放在业务落库层，而不是只靠队列 jobId。jobId 可以减少重复入队，但无法覆盖消费者执行到一半失败后重试的情况。对于关键任务，要记录处理状态、失败原因和重试次数，并提供人工补偿入口。",
    talkingPoints: [
      "队列消费者必须假设消息会重复。",
      "幂等应落在数据库唯一约束或业务状态机。",
      "失败任务要可观测、可重试、可人工补偿。",
    ],
    codeExample: `await this.prisma.paymentEvent.create({
  data: { eventId, payload },
});

await this.prisma.order.update({
  where: { id: orderId, status: "PENDING" },
  data: { status: "PAID" },
});`,
    codeExplanation: [
      "`eventId` 可以加唯一索引，重复回调直接失败或忽略。",
      "状态条件 `PENDING` 防止已支付订单被重复更新。",
      "真实项目里还要把两步放进事务。",
    ],
  },
  {
    category: "微服务与消息队列",
    question: "gRPC、Kafka、RabbitMQ、Redis 微服务传输怎么选？",
    answer:
      "gRPC 适合同步、强类型、低延迟的服务间调用；Kafka 适合高吞吐日志流、事件流和数据管道；RabbitMQ 适合业务消息、路由灵活、延迟/死信需求；Redis pub/sub 简单但可靠性弱，更适合轻量通知。选择要看同步还是异步、吞吐、可靠性、顺序、消费组和团队运维能力。",
    seniorPerspective:
      "我会避免为了微服务而微服务。服务拆分前要先有清晰领域边界、独立扩缩容需求或团队边界。传输协议只是手段，真正难的是数据一致性、故障隔离、链路追踪、版本兼容和回滚策略。",
    talkingPoints: [
      "gRPC 偏同步 RPC，MQ 偏异步解耦。",
      "Kafka 强吞吐，RabbitMQ 强业务路由。",
      "拆服务前先确认领域边界和运维能力。",
    ],
  },
  {
    category: "文件上传与对象存储",
    question: "大文件上传如何设计？",
    answer:
      "大文件上传通常使用分片上传、断点续传、秒传和合并校验。前端把文件按固定大小切片，后端为每个切片生成上传地址或接收切片，全部完成后校验 hash 并合并。对象存储场景下，更推荐前端直传对象存储，后端只负责签名、鉴权和记录元数据。",
    seniorPerspective:
      "高级设计要考虑失败恢复、并发控制、文件安全、成本和用户体验。切片大小不能太小，否则请求过多；也不能太大，否则失败重传成本高。上传前要校验权限和配额，上传后要做 MIME/扩展名/病毒扫描，私有文件用签名 URL 控制访问。",
    talkingPoints: [
      "大文件不要经过 Nest 服务全量中转。",
      "后端负责签名、鉴权、元数据和安全校验。",
      "断点续传依赖 uploadId、partNumber 和 hash。",
    ],
  },
  {
    category: "文件上传与对象存储",
    question: "如何防止任意文件上传漏洞？",
    answer:
      "文件上传不能只看后缀名。要限制大小、扩展名、MIME、魔数，上传路径不能由用户直接控制，文件名要重命名，私有文件不应放在公开目录。图片、文档等还要考虑病毒扫描和内容安全。对象存储应使用私有桶和签名 URL。",
    seniorPerspective:
      "线上最危险的是用户上传可执行脚本后被 Web 服务解析执行，或者通过文件名进行路径穿越。我的做法是上传服务与静态服务隔离，文件统一存对象存储，业务只保存 fileId/key，不信任原始文件名。",
    talkingPoints: [
      "后缀名、MIME、魔数都要校验。",
      "文件名重命名，路径不由用户控制。",
      "私有资源使用签名 URL，不直接公开桶。",
    ],
  },
  {
    category: "文件上传与对象存储",
    question: "对象存储签名 URL 怎么设计？",
    answer:
      "签名 URL 的目标是让客户端在有限时间内直接上传或下载对象，同时不暴露服务端密钥。后端先校验用户权限、文件大小、类型和业务归属，再生成带过期时间、对象 key、操作权限的签名 URL。客户端拿到 URL 后直传对象存储，完成后回调或调用后端确认元数据。",
    seniorPerspective:
      "我会把签名 URL 设计成最小权限：只允许写入指定 key，只在短时间内有效，只允许指定 content-type 和大小范围。文件 key 不使用原始文件名，而是按租户、业务、日期、uuid 生成。上传完成后不要立刻信任文件，还要做状态确认、扫描、转码或审核。",
    talkingPoints: [
      "后端签名，客户端直传，服务端不承接大流量文件。",
      "签名要短期、最小权限、绑定业务对象。",
      "上传完成后仍要确认元数据和安全扫描。",
    ],
    codeExample: `const key = \`tenant/\${tenantId}/avatars/\${crypto.randomUUID()}.png\`;
const uploadUrl = await storage.createPresignedPutUrl({
  key,
  expiresIn: 300,
  contentType: "image/png",
});

return { key, uploadUrl };`,
    codeExplanation: [
      "对象 key 由后端生成，避免用户控制路径。",
      "`expiresIn` 限制 URL 有效期，降低泄露风险。",
      "后端返回 key，后续用 key 绑定业务记录。",
    ],
  },
  {
    category: "全栈协作",
    question: "Next.js SSR 请求 Nest.js 时如何处理 Cookie 和登录态？",
    answer:
      "SSR 场景下，请求发生在服务端，浏览器 cookie 不会自动传给后端 API，必须在 Next.js 服务端读取 incoming request 的 cookie，再转发给 Nest.js。Nest.js 负责校验 cookie/session/JWT，返回用户数据。还要注意同域、跨域、secure、sameSite 和代理层 headers。",
    seniorPerspective:
      "全栈项目里，我会统一设计认证边界：浏览器到 Next.js，Next.js 到 Nest.js，Nest.js 到其他服务。SSR 只转发必要 cookie，不把敏感 token 暴露到客户端 JS。BFF 层可以做聚合，但不能绕过后端权限校验。",
    talkingPoints: [
      "SSR 请求需要手动转发 cookie。",
      "BFF 聚合不等于权限边界。",
      "httpOnly cookie 比 localStorage 更适合敏感 token。",
    ],
    codeExample: `const user = await fetch("https://api.example.com/me", {
  headers: {
    cookie: headers().get("cookie") ?? "",
  },
  cache: "no-store",
}).then((res) => res.json());`,
    codeExplanation: [
      "Next.js 服务端读取请求 cookie 并转发给 Nest。",
      "`cache: 'no-store'` 避免用户态接口被缓存。",
      "Nest 仍然要完整校验登录态和权限。",
    ],
  },
  {
    category: "全栈协作",
    question: "BFF 层应该放在 Next.js 还是 Nest.js？",
    answer:
      "BFF 可以在 Next.js route handler，也可以在 Nest.js。如果主要是页面级数据聚合、SSR 适配、前端体验优化，放 Next.js 更近；如果涉及复杂业务规则、权限、事务、审计、复用给多个客户端，应该放 Nest.js。边界原则是：展示聚合靠近前端，业务决策留在后端。",
    seniorPerspective:
      "我会避免把业务规则散落在 Next.js 和 Nest.js 两边。Next.js 可以做轻量聚合和协议转换，但核心业务状态变更必须进 Nest.js 服务层。否则移动端、后台、第三方 API 复用时会出现规则不一致。",
    talkingPoints: [
      "页面聚合可以在 BFF，核心业务规则放后端。",
      "BFF 不应绕过后端鉴权和审计。",
      "多端复用能力优先沉淀在 Nest.js。",
    ],
  },
  {
    category: "全栈协作",
    question: "SSE 和 WebSocket 在 Nest.js 里怎么选？",
    answer:
      "如果是服务端持续向客户端推送文本流，比如 AI 回复、日志输出、任务进度，SSE 更简单；如果需要双向实时通信，比如聊天房间、协作编辑、在线状态、实时控制，WebSocket 更合适。Nest 同时支持 `@Sse()` 和 WebSocket Gateway。",
    seniorPerspective:
      "我会从连接规模、代理兼容、重连、消息方向、鉴权和部署复杂度来选。SSE 基于 HTTP，运维成本较低；WebSocket 长连接状态更多，对网关、负载均衡、心跳、房间管理要求更高。",
    talkingPoints: [
      "单向流优先 SSE，双向实时用 WebSocket。",
      "WebSocket 要处理心跳、房间、断线重连。",
      "AI token streaming 多数情况下 SSE 足够。",
    ],
  },
  {
    category: "安全",
    question: "ValidationPipe 的 whitelist 和 forbidNonWhitelisted 有什么价值？",
    answer:
      "`whitelist` 会移除 DTO 中未声明的字段，`forbidNonWhitelisted` 会直接拒绝包含未知字段的请求。它们能防止用户提交多余字段污染业务对象，例如偷偷传 role、isAdmin、balance 等字段。配合 transform 可以把字符串参数转换成 number、boolean、Date 等类型。",
    seniorPerspective:
      "我会在生产项目全局启用严格 DTO 校验，把输入边界前移。安全不是只靠数据库字段保护，DTO 层就应该阻止非法输入进入业务层。对公开接口尤其要严格，对内部接口也要保持一致，因为内部调用也可能被误用。",
    talkingPoints: [
      "DTO 是第一道输入防线。",
      "未知字段要移除或拒绝。",
      "transform 能减少 Controller 里的手动类型转换。",
    ],
    codeExample: `app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);`,
    codeExplanation: [
      "`whitelist` 只保留 DTO 装饰器声明过的字段。",
      "`forbidNonWhitelisted` 对多余字段直接报错。",
      "`transform` 按 DTO 类型做转换，减少手写 parse。",
    ],
  },
  {
    category: "安全",
    question: "如何防止接口被刷和暴力破解？",
    answer:
      "可以从限流、验证码、账号锁定、IP/设备风控、行为分析、WAF 和审计日志多层防护。Nest 里可以用 throttler 做基础限流，但登录、短信、支付这类高风险接口需要更细粒度策略，例如按 IP、账号、设备、手机号同时限流。",
    seniorPerspective:
      "高级系统不能只做固定 IP 限流，因为攻击者可以换 IP。要结合业务维度：同一手机号一分钟只能发几次验证码，同一账号失败多次要冷却，同一设备异常请求要风控。所有拒绝都应记录审计日志，方便追踪攻击模式。",
    talkingPoints: [
      "限流维度包括 IP、账号、设备、手机号。",
      "登录失败要做冷却和告警。",
      "高风险接口需要风控和审计日志。",
    ],
  },
  {
    category: "安全",
    question: "如何处理日志中的敏感信息？",
    answer:
      "日志不能记录明文密码、token、身份证、银行卡、手机号全量、密钥、cookie 等敏感信息。应该在日志写入前脱敏，并区分业务日志、审计日志和调试日志。生产环境还要控制日志级别，避免把请求体全量打出来。",
    seniorPerspective:
      "我会把脱敏做成统一 logger/interceptor 能力，而不是靠开发者自觉。日志平台也要设置访问权限和保留周期。安全事故里，日志泄露经常被忽视，但它可能比数据库泄露更容易发生。",
    talkingPoints: [
      "敏感字段默认不打，必须打就脱敏。",
      "生产环境不要全量记录 request body。",
      "日志平台本身也要做权限控制。",
    ],
  },
  {
    category: "测试",
    question: "Nest.js 如何 mock Provider 做单元测试？",
    answer:
      "Nest 的 TestingModule 可以在测试中替换 Provider，实现 Service 的隔离测试。比如测试 UserService 时，不连接真实数据库，而是把 PrismaService 或 Repository mock 掉。这样测试更快、更稳定，也能覆盖异常分支。",
    seniorPerspective:
      "我会把单元测试重点放在业务规则、边界条件和错误处理上，而不是为了覆盖率测试 getter/setter。外部依赖全部 mock，集成测试再连接测试数据库验证模块协作。这样测试金字塔更健康。",
    talkingPoints: [
      "单元测试 mock 外部依赖。",
      "集成测试验证模块协作和真实数据库行为。",
      "测试要覆盖失败路径，不只测 happy path。",
    ],
    codeExample: `const moduleRef = await Test.createTestingModule({
  providers: [
    UserService,
    {
      provide: PrismaService,
      useValue: {
        user: { findUnique: vi.fn(), create: vi.fn() },
      },
    },
  ],
}).compile();`,
    codeExplanation: [
      "`useValue` 用 mock 对象替代真实 PrismaService。",
      "测试 UserService 时不会连接真实数据库。",
      "可以断言 mock 方法是否按预期被调用。",
    ],
  },
  {
    category: "测试",
    question: "单元测试、集成测试、E2E 测试边界怎么划分？",
    answer:
      "单元测试验证单个 Service 或函数的业务规则；集成测试验证模块之间、数据库、缓存等协作；E2E 测试从 HTTP 入口验证完整用户流程。三者都需要，但比例不同。单元测试最多，集成测试覆盖关键基础设施，E2E 覆盖核心链路。",
    seniorPerspective:
      "高级工程里测试要服务交付信心，而不是追求形式。支付、权限、订单状态机、数据隔离这类高风险逻辑要重点测。E2E 不宜过多，否则慢且不稳定；但核心链路必须有，例如登录、下单、支付回调、权限拒绝。",
    talkingPoints: [
      "单测快，集成测真实协作，E2E 测完整链路。",
      "高风险业务优先写测试。",
      "测试数据要可控、可清理、可重复。",
    ],
  },
  {
    category: "测试",
    question: "如何测试 Guard、Interceptor 和 Filter？",
    answer:
      "Guard 可以单测 canActivate，mock ExecutionContext 和 Reflector；Interceptor 可以测试 intercept 是否调用 next.handle，以及是否转换响应；Filter 可以构造异常和 response mock，验证输出格式。也可以用 E2E 测试从 HTTP 层验证这些横切能力是否生效。",
    seniorPerspective:
      "我会对复杂横切逻辑做单测，对全局装配做少量 E2E。比如权限 Guard 的策略分支要单测覆盖，登录接口被拒绝则用 E2E 验证。这样既保证逻辑正确，也保证 Nest 注册链路没有漏。",
    talkingPoints: [
      "复杂策略单测，全局装配 E2E。",
      "ExecutionContext 可以 mock。",
      "Filter 要保证错误码、traceId、message 稳定。",
    ],
  },
  {
    category: "工程化与部署",
    question: "Nest.js 多环境配置怎么设计？",
    answer:
      "多环境配置通常通过 ConfigModule 加载环境变量，并用 schema 校验必填项和格式。配置要分层：默认配置、环境变量、密钥管理平台。生产环境不应该依赖提交到仓库的 `.env`，敏感信息应来自 CI/CD Secret、K8s Secret 或云厂商密钥服务。",
    seniorPerspective:
      "我会让关键配置缺失时应用启动失败，而不是运行中才报错。配置项要有文档，命名要稳定，并区分 public config 和 secret。前后端全栈项目还要避免把服务端 secret 注入到客户端 bundle。",
    talkingPoints: [
      "配置必须校验，缺失应启动失败。",
      "secret 不进仓库。",
      "前端 public env 和后端 secret 要严格区分。",
    ],
  },
  {
    category: "工程化与部署",
    question: "如何做优雅关闭和健康检查？",
    answer:
      "优雅关闭指收到 SIGTERM 后停止接收新请求，等待正在处理的请求、数据库连接、队列任务安全结束，再退出进程。健康检查分 liveness 和 readiness：liveness 判断进程是否活着，readiness 判断是否能接流量，例如数据库、Redis、下游依赖是否可用。",
    seniorPerspective:
      "Kubernetes 环境里，如果没有 readiness，服务刚启动但依赖未连接就可能接流量；如果没有优雅关闭，滚动发布时可能中断用户请求或队列任务。高级工程师要把部署生命周期当成应用设计的一部分。",
    talkingPoints: [
      "liveness 管重启，readiness 管接流量。",
      "SIGTERM 后要停止接新请求并等待清理。",
      "队列 worker 要处理当前 job 后再退出。",
    ],
    codeExample: `async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3000);
}`,
    codeExplanation: [
      "`enableShutdownHooks` 让 Nest 响应进程退出信号。",
      "Provider 可以实现 `OnApplicationShutdown` 做资源清理。",
      "健康检查通常配合 TerminusModule 实现。",
    ],
  },
  {
    category: "工程化与部署",
    question: "线上问题如何定位？",
    answer:
      "线上定位要靠可观测性：日志、指标、链路追踪和告警。一次请求最好有 traceId，贯穿网关、Next.js、Nest.js、数据库和下游服务。指标包括 QPS、错误率、延迟、CPU、内存、event loop lag、DB 慢查询、队列积压。日志要结构化，能按 traceId、userId、orderId 搜索。",
    seniorPerspective:
      "高级工程师面对线上事故要有流程：确认影响面，止血降级，保留现场，定位根因，修复验证，复盘改进。不要只会看代码，要能从监控图、日志、慢查询、发布记录和依赖状态综合判断。",
    talkingPoints: [
      "先止血，再根因。",
      "traceId 是串联全链路的关键。",
      "复盘要落到监控、测试、流程或架构改进。",
    ],
  },
  {
    category: "系统设计",
    question: "如何设计一个后台管理系统的权限体系？",
    answer:
      "后台权限体系通常包括用户、角色、权限、菜单、组织、数据范围。接口权限控制能不能调用，菜单权限控制能不能看到，数据权限控制能看到哪些数据。服务端必须做接口和数据权限校验，前端菜单隐藏只负责体验。",
    seniorPerspective:
      "我会用 RBAC 做基础能力授权，再叠加 ABAC 做数据范围。权限变更要有审计日志，超级管理员权限要谨慎。多租户系统要把 tenantId 作为强制 scope，不能只靠前端传参。",
    talkingPoints: [
      "菜单权限、接口权限、数据权限分开。",
      "RBAC + ABAC 混合更贴近真实业务。",
      "权限变更和敏感操作必须审计。",
    ],
  },
  {
    category: "系统设计",
    question: "如何设计订单超时取消系统？",
    answer:
      "订单创建后如果未支付，需要在指定时间后自动取消。常见方案包括延迟队列、定时扫描、数据库过期索引或消息队列延迟消息。核心是幂等和状态机：只有 PENDING 状态才能取消，已支付订单不能被超时任务误取消。",
    seniorPerspective:
      "我会使用延迟队列加兜底扫描。延迟队列负责实时性，兜底扫描处理消息丢失或消费者故障。取消订单时要在事务里更新订单状态、释放库存、写操作日志，并确保重复执行不会产生副作用。",
    talkingPoints: [
      "状态机防止误取消。",
      "延迟队列 + 兜底扫描更可靠。",
      "库存释放、日志、消息通知要考虑一致性。",
    ],
  },
  {
    category: "系统设计",
    question: "如何设计 AI Chat 流式对话系统？",
    answer:
      "系统可以分成会话管理、消息存储、模型调用、流式输出、取消重试、内容安全和计费统计。前端发送 prompt 后，后端创建 message 记录，然后调用模型并通过 SSE 推送 token。生成过程中要支持用户中断、网络重连、失败重试和最终消息落库。",
    seniorPerspective:
      "高级设计要考虑多租户、限流、上下文裁剪、敏感词、模型超时、成本控制和可观测性。SSE 输出只是表层，背后要有任务状态机：created、streaming、completed、failed、cancelled。每个状态变化都要可追踪。",
    talkingPoints: [
      "SSE 适合 LLM 单向流式输出。",
      "消息状态机是可靠性的核心。",
      "要支持中断、重连、限流、内容安全和成本统计。",
    ],
  },
  {
    category: "系统设计",
    question: "如何设计多租户 SaaS 系统？",
    answer:
      "多租户设计首先要确定隔离级别：共享库共享表、共享库独立 schema、独立数据库。共享表成本低但隔离弱，独立库隔离强但运维复杂。应用层所有查询都必须带 tenant scope，认证、权限、缓存、文件、日志、消息也都要包含 tenantId。",
    seniorPerspective:
      "我会根据客户规模和合规要求分层：普通租户共享表，大客户独立库或独立部署。多租户最怕漏加 tenant 条件，所以要在 repository、ORM middleware 或数据库策略层做强约束，而不是依赖开发者每次手写 where。",
    talkingPoints: [
      "先确定隔离级别和成本模型。",
      "tenantId 要贯穿鉴权、查询、缓存、日志和消息。",
      "防止数据串租是最高优先级。",
    ],
  },
  {
    category: "系统设计",
    question: "如何设计审计日志系统？",
    answer:
      "审计日志用于回答谁在什么时间、从哪里、对什么资源、做了什么操作、结果如何。它和普通业务日志不同，审计日志更强调不可抵赖、可检索、可长期保存。典型字段包括 actorId、tenantId、action、resourceType、resourceId、before、after、ip、userAgent、traceId、result。",
    seniorPerspective:
      "我会把审计日志作为安全和合规能力设计，而不是 Controller 里随手打一行 log。关键操作通过 Interceptor 或领域事件统一记录；敏感字段要脱敏；日志写入失败不能影响主流程时可走队列，但对金融等强审计场景要评估一致性要求。审计日志还要支持后台检索和导出。",
    talkingPoints: [
      "审计日志面向合规和追责，普通日志面向排障。",
      "关键操作要统一记录，不靠开发者手写。",
      "敏感字段脱敏，日志本身也要权限控制。",
    ],
    codeExample: `await auditLogService.record({
  actorId: user.id,
  tenantId: user.tenantId,
  action: "ORDER_CANCEL",
  resourceType: "Order",
  resourceId: order.id,
  traceId,
  result: "SUCCESS",
});`,
    codeExplanation: [
      "`actorId` 和 `tenantId` 用于定位操作者和租户边界。",
      "`resourceType/resourceId` 用于追踪具体业务对象。",
      "`traceId` 可以把审计记录和请求链路日志串起来。",
    ],
  },
];
