import { useMemo } from "react";
import type { NestQuestion } from "../../content/nestQuestions";
import { nestCategories, nestQuestions } from "../../content/nestQuestions";
import {
  QuestionSearchEmptyState,
  QuestionSearchPanel,
} from "../question-search/QuestionSearchPanel";
import {
  type SearchableField,
  filterGroupedQuestions,
  useQuestionSearchQuery,
} from "../question-search/search";

const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const nestQuestionGroups = nestCategories.map((category, categoryIndex) => ({
  category,
  id: getNestCategoryId(categoryIndex),
  questions: nestQuestions
    .map((question, index) => ({ index: index + 1, question }))
    .filter(({ question }) => question.category === category),
}));

export function NestPage() {
  const [query, setQuery] = useQuestionSearchQuery();
  const filteredQuestionGroups = useMemo(
    () =>
      filterGroupedQuestions(nestQuestionGroups, query, ({ question }) =>
        getNestSearchFields(question),
      ),
    [query],
  );
  const totalQuestionCount = nestQuestions.length;
  const filteredQuestionCount = filteredQuestionGroups.reduce(
    (total, group) => total + group.questions.length,
    0,
  );

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
          nest.js senior full-stack
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          Nest.js 高级全栈面试专题
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          覆盖 TypeScript、Node.js、Nest
          核心机制、数据库、鉴权、缓存、微服务、全栈协作、安全、测试、部署和系统设计。
          每道题都按高级全栈工程师视角回答，强调架构取舍、线上经验和可落地实践。
        </p>
      </div>

      <QuestionSearchPanel
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredQuestionCount}
        totalCount={totalQuestionCount}
      />

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {filteredQuestionGroups.map(({ category, id, questions }) => (
          <button
            aria-label={`跳转到 ${category}`}
            className={`${cardClass} cursor-pointer p-4 text-left transition hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100`}
            key={category}
            onClick={() => scrollToCategory(id)}
            type="button"
          >
            <p className="text-sm font-extrabold text-emerald-700">{category}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{questions.length} 道高级题</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredQuestionGroups.map(({ category, id, questions }) => {
          return (
            <section className="grid scroll-mt-24 gap-4 lg:scroll-mt-8" id={id} key={category}>
              <div>
                <p className="text-sm font-extrabold text-emerald-700">{category}</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-950">{category} 面试题</h2>
              </div>
              <div className="grid gap-4">
                {questions.map(({ index, question }) => (
                  <QuestionCard index={index} key={question.question} question={question} />
                ))}
              </div>
            </section>
          );
        })}
        {query.trim() && filteredQuestionCount === 0 && <QuestionSearchEmptyState query={query} />}
      </div>
    </section>
  );
}

function getNestSearchFields(question: NestQuestion): SearchableField[] {
  return [
    question.category,
    question.question,
    question.answer,
    question.seniorPerspective,
    question.talkingPoints,
    question.codeExplanation,
    question.codeExample,
  ];
}

function getNestCategoryId(index: number) {
  return `nest-category-${index}`;
}

function QuestionCard({ question, index }: { question: NestQuestion; index: number }) {
  return (
    <article className={`${cardClass} overflow-hidden`}>
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
          <strong className="text-sm text-slate-900">高级答案</strong>
          <p className="mt-1 font-medium leading-7 text-slate-700">{question.answer}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <strong className="text-sm text-emerald-950">高级全栈视角</strong>
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
