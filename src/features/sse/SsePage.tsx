import type { SseQuestion } from "../../content/sseQuestions";
import { sseCategories, sseQuestions } from "../../content/sseQuestions";

const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const deferredCardClass = "[contain-intrinsic-size:1px_720px] [content-visibility:auto]";
const sseQuestionGroups = sseCategories.map((category, categoryIndex) => ({
  category,
  id: getSseCategoryId(categoryIndex),
  questions: sseQuestions
    .map((question, index) => ({ index: index + 1, question }))
    .filter(({ question }) => question.category === category),
}));

export function SsePage() {
  function scrollToCategory(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section className="py-3 sm:py-6">
      <div className="mb-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          ai streaming interview
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          SSE 流式渲染面试专题
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          面向 AI Chat 和中高级全栈面试，覆盖 SSE 协议基础、WebSocket
          选型、前端消费流、后端推流、LLM token
          streaming、断线恢复、性能体验、安全部署和综合系统设计。
        </p>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sseQuestionGroups.map(({ category, id, questions }) => (
          <button
            aria-label={`跳转到 ${category}`}
            className={`${cardClass} cursor-pointer p-4 text-left transition hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100`}
            key={category}
            onClick={() => scrollToCategory(id)}
            type="button"
          >
            <p className="text-sm font-extrabold text-emerald-700">{category}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{questions.length} 道高频题</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {sseQuestionGroups.map(({ category, id, questions }) => {
          return (
            <section className="grid scroll-mt-24 gap-4 lg:scroll-mt-8" id={id} key={category}>
              <div>
                <p className="text-sm font-extrabold text-emerald-700">{category}</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-950">{category} 高频题</h2>
              </div>
              <div className="grid gap-4">
                {questions.map(({ index, question }) => (
                  <QuestionCard index={index} key={question.question} question={question} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function getSseCategoryId(index: number) {
  return `sse-category-${index}`;
}

function QuestionCard({ question, index }: { question: SseQuestion; index: number }) {
  return (
    <article className={`${cardClass} ${deferredCardClass} overflow-hidden`}>
      <div className="grid gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-900">
            Q{index}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {question.category}
          </span>
        </div>
        <h3 className="text-lg font-extrabold leading-7 text-slate-950 sm:text-xl">
          {question.question}
        </h3>
        <div className="border-l-4 border-sky-500 pl-3">
          <strong className="text-sm text-slate-900">答案</strong>
          <p className="mt-1 font-medium leading-7 text-slate-700">{question.answer}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <strong className="text-sm text-emerald-950">高级视角</strong>
          <p className="mt-2 leading-7 text-slate-700">{question.seniorPerspective}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <strong className="text-sm text-slate-900">面试表达要点</strong>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {question.talkingPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        {question.codeExplanation && (
          <div className="rounded-lg bg-slate-50 p-3">
            <strong className="text-sm text-slate-900">代码示例解析</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {question.codeExplanation.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {question.codeExample && (
        <pre className="overflow-x-auto border-t border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <code>{question.codeExample}</code>
        </pre>
      )}
    </article>
  );
}
