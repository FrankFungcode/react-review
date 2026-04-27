import {
  Atom,
  BookOpen,
  Brain,
  Code2,
  Layers3,
  Library,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Server,
} from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { type InterviewSection, interviewSections, weeklyPlan } from "./content/interviewData";
import {
  QuestionSearchEmptyState,
  QuestionSearchPanel,
} from "./features/question-search/QuestionSearchPanel";
import { questionMatchesSearch, useQuestionSearchQuery } from "./features/question-search/search";

const ReactDemosPage = lazy(() =>
  import("./features/react-demos/ReactDemosPage").then((module) => ({
    default: module.ReactDemosPage,
  })),
);
const JsLabPage = lazy(() =>
  import("./features/js-lab/JsLabPage").then((module) => ({ default: module.JsLabPage })),
);
const StatePage = lazy(() =>
  import("./features/state/StatePage").then((module) => ({ default: module.StatePage })),
);
const CarbonPage = lazy(() =>
  import("./features/carbon/CarbonPage").then((module) => ({ default: module.CarbonPage })),
);
const NestPage = lazy(() =>
  import("./features/nest/NestPage").then((module) => ({ default: module.NestPage })),
);
const SsePage = lazy(() =>
  import("./features/sse/SsePage").then((module) => ({ default: module.SsePage })),
);

const pageIds = ["overview", "react", "next", "js", "state", "carbon", "nest", "sse"] as const;
type PageId = (typeof pageIds)[number];

const navItems: Array<{ id: PageId; label: string; icon: typeof BookOpen }> = [
  { id: "overview", label: "总览", icon: BookOpen },
  { id: "react", label: "React", icon: Brain },
  { id: "next", label: "Next.js", icon: Route },
  { id: "js", label: "JavaScript", icon: Code2 },
  { id: "state", label: "状态管理", icon: Layers3 },
  { id: "carbon", label: "碳元素", icon: Atom },
  { id: "nest", label: "Nest.js", icon: Server },
  { id: "sse", label: "SSE 流式渲染", icon: MessageSquareText },
];

const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const eyebrowClass = "text-xs font-extrabold uppercase tracking-normal text-emerald-700";
const sidebarStorageKey = "react-review-sidebar-collapsed";
const tooltipClass =
  "pointer-events-none absolute left-full top-1/2 z-30 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 lg:block";

function isPageId(value: string | null): value is PageId {
  return pageIds.includes(value as PageId);
}

function getPageFromLocation() {
  if (typeof window === "undefined") {
    return "overview";
  }

  const pageParam = new URL(window.location.href).searchParams.get("page");
  return isPageId(pageParam) ? pageParam : "overview";
}

function getPageHref(pageId: PageId) {
  if (typeof window === "undefined") {
    return pageId === "overview" ? "/" : `/?page=${pageId}`;
  }

  const url = new URL(window.location.href);
  if (pageId === "overview") {
    url.searchParams.delete("page");
  } else {
    url.searchParams.set("page", pageId);
  }
  url.hash = "";
  return `${url.pathname}${url.search}`;
}

export function App() {
  const [page, setPage] = useState<PageId>(getPageFromLocation);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(sidebarStorageKey) === "true";
  });
  const activeSection = useMemo(
    () => interviewSections.find((section) => section.id === page),
    [page],
  );
  const sidebarToggleLabel = isSidebarCollapsed ? "展开侧边栏" : "折叠侧边栏";

  useEffect(() => {
    function syncPageFromHistory() {
      setPage(getPageFromLocation());
    }

    window.addEventListener("popstate", syncPageFromHistory);
    return () => window.removeEventListener("popstate", syncPageFromHistory);
  }, []);

  function toggleSidebar() {
    setIsSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(sidebarStorageKey, String(next));
      return next;
    });
  }

  function navigateToPage(nextPage: PageId) {
    setPage(nextPage);
    window.history.pushState({}, "", getPageHref(nextPage));
  }

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-800 transition-all duration-200 lg:grid ${
        isSidebarCollapsed
          ? "lg:grid-cols-[80px_minmax(0,1fr)]"
          : "lg:grid-cols-[260px_minmax(0,1fr)]"
      }`}
    >
      <aside
        className={`sticky top-0 z-20 overflow-visible border-b border-slate-700 bg-slate-900 px-4 py-4 text-white transition-all duration-200 lg:h-screen lg:border-b-0 lg:py-6 ${
          isSidebarCollapsed ? "lg:px-3" : "lg:px-5"
        }`}
        aria-label="复习导航"
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 lg:mx-0 lg:mb-7 ${
            isSidebarCollapsed ? "lg:flex-col lg:justify-start" : ""
          }`}
        >
          <div
            className={`flex min-w-0 items-center gap-3 ${
              isSidebarCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <Library aria-hidden="true" className="h-7 w-7 shrink-0 text-sky-300" />
            <div className={`min-w-0 ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
              <strong className="block truncate text-base font-extrabold">React Review</strong>
              <span className="mt-0.5 block text-sm text-slate-300">1 周面试冲刺</span>
            </div>
          </div>
          <div className="group relative hidden lg:block">
            <button
              aria-expanded={!isSidebarCollapsed}
              aria-label={sidebarToggleLabel}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white focus:outline-none"
              onClick={toggleSidebar}
              title={sidebarToggleLabel}
              type="button"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />
              ) : (
                <PanelLeftClose aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
            {isSidebarCollapsed && <span className={tooltipClass}>{sidebarToggleLabel}</span>}
          </div>
        </div>

        <nav className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-0 lg:grid-cols-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <div className="group relative" key={item.id}>
                <a
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors sm:justify-start ${
                    isSidebarCollapsed ? "lg:justify-center lg:px-0" : "lg:justify-start"
                  } ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white"
                  }`}
                  href={getPageHref(item.id)}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                      return;
                    }
                    event.preventDefault();
                    navigateToPage(item.id);
                  }}
                  title={item.label}
                >
                  <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                  <span className={`truncate ${isSidebarCollapsed ? "lg:hidden" : ""}`}>
                    {item.label}
                  </span>
                </a>
                {isSidebarCollapsed && <span className={tooltipClass}>{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Suspense fallback={<PageFallback />}>
          {page === "overview" && <Overview />}
          {page === "react" && <ReactDemosPage section={activeSection} />}
          {page === "next" && activeSection && <QuestionBank section={activeSection} />}
          {page === "js" && <JsLabPage />}
          {page === "state" && <StatePage section={activeSection} />}
          {page === "carbon" && <CarbonPage />}
          {page === "nest" && <NestPage />}
          {page === "sse" && <SsePage />}
        </Suspense>
      </main>
    </div>
  );
}

function PageFallback() {
  return (
    <output className={`${cardClass} block p-4 font-bold text-slate-700 sm:p-5`}>Loading…</output>
  );
}

function Overview() {
  return (
    <>
      <section className="border-b border-slate-200 pb-8 pt-3 sm:pb-10 sm:pt-8 lg:pb-12 lg:pt-12">
        <p className={eyebrowClass}>React + TypeScript + Vite</p>
        <h1 className="mt-3 max-w-5xl text-3xl font-extrabold leading-tight tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
          把高频题变成可以点、可以讲、可以复盘的面试训练场。
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
          这个项目覆盖 React、Next.js、JavaScript
          与状态管理。每个模块都按“短答案、展开解释、追问、demo” 组织，方便你从刷题切换到口述表达。
        </p>
      </section>

      <section className="py-7 sm:py-8">
        <SectionHeading eyebrow="7 days" title="一周冲刺节奏" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {weeklyPlan.map((day) => (
            <article className={`${cardClass} p-4 sm:p-5`} key={day.day}>
              <span className="text-sm font-extrabold text-emerald-700">{day.day}</span>
              <h3 className="mt-2 text-base font-extrabold text-slate-900">{day.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{day.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-7 sm:py-8">
        <SectionHeading eyebrow="modules" title="复习模块" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {interviewSections
            .filter((section) => section.id !== "overview")
            .map((section) => (
              <article className={`${cardClass} p-4 sm:p-5`} key={section.id}>
                <h3 className="text-lg font-extrabold text-slate-900">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                  {section.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          <article className={`${cardClass} p-4 sm:p-5`}>
            <h3 className="text-lg font-extrabold text-slate-900">碳元素面试题</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              基于外部文档整理的 22 个追问题，覆盖 Next.js、React、工程化、AI 通信和安全。
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>Next.js 深水区</li>
              <li>React 18 原理</li>
              <li>SSE 与 XSS</li>
              <li>Zustand 多实例</li>
            </ul>
          </article>
          <article className={`${cardClass} p-4 sm:p-5`}>
            <h3 className="text-lg font-extrabold text-slate-900">Nest.js 高级全栈</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              面向高级全栈岗位，覆盖 Nest 核心、数据库、鉴权、缓存、微服务、测试、部署和系统设计。
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>DI 与请求链路</li>
              <li>事务与权限</li>
              <li>缓存与队列</li>
              <li>全栈系统设计</li>
            </ul>
          </article>
          <article className={`${cardClass} p-4 sm:p-5`}>
            <h3 className="text-lg font-extrabold text-slate-900">SSE 流式渲染</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              面向 AI Chat 面试，覆盖 SSE 协议、前后端流式实现、断线重连、停止生成、Markdown
              安全渲染和部署网关问题。
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              <li>AI token streaming</li>
              <li>fetch stream 与 AbortController</li>
              <li>重连去重与心跳</li>
              <li>安全部署与成本统计</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 max-w-3xl">
      <p className={eyebrowClass}>{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
        {title}
      </h1>
      {description && <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>}
    </div>
  );
}

function QuestionBank({ section }: { section: InterviewSection }) {
  const [query, setQuery] = useQuestionSearchQuery();
  const filteredQuestions = useMemo(
    () =>
      section.questions.filter((question) =>
        questionMatchesSearch(
          [question.question, question.shortAnswer, question.detail, question.followUp],
          query,
        ),
      ),
    [query, section.questions],
  );

  return (
    <section className="py-3 sm:py-6">
      <SectionHeading
        eyebrow={section.id}
        title={section.title}
        description={section.description}
      />
      <QuestionSearchPanel
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredQuestions.length}
        totalCount={section.questions.length}
      />
      <div className="grid gap-4">
        {filteredQuestions.map((question) => (
          <article className={`${cardClass} p-4 sm:p-5`} key={question.question}>
            <h2 className="text-lg font-extrabold leading-7 text-slate-900 sm:text-xl">
              {question.question}
            </h2>
            <p className="mt-3 border-l-4 border-sky-500 pl-3 font-bold leading-7 text-slate-800">
              {question.shortAnswer}
            </p>
            <p className="mt-3 leading-7 text-slate-600">{question.detail}</p>
            <div className="mt-4 grid gap-1 border-t border-slate-200 pt-4 text-slate-600">
              <strong className="text-slate-800">常见追问</strong>
              <span className="leading-7">{question.followUp}</span>
            </div>
          </article>
        ))}
      </div>
      {query.trim() && filteredQuestions.length === 0 && <QuestionSearchEmptyState query={query} />}
    </section>
  );
}
