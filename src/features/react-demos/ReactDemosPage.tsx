import { RotateCcw, Shuffle } from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import {
  type ReactQuestion,
  reactQuestionGroups,
  reactQuestions,
} from "../../content/reactQuestions";
import {
  QuestionSearchEmptyState,
  QuestionSearchPanel,
} from "../question-search/QuestionSearchPanel";
import {
  type SearchableField,
  filterGroupedQuestions,
  useQuestionSearchQuery,
} from "../question-search/search";

type DemoItem = {
  id: string;
  label: string;
  value: string;
};

const initialItems: DemoItem[] = [
  { id: "react", label: "React", value: "组件状态" },
  { id: "hooks", label: "Hooks", value: "依赖数组" },
  { id: "fiber", label: "Fiber", value: "渲染机制" },
];

const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const inputClass =
  "min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-extrabold text-white transition hover:bg-emerald-800";
const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-900 transition hover:bg-slate-300";

export function ReactDemosPage() {
  const [query, setQuery] = useQuestionSearchQuery();
  const filteredQuestionGroups = useMemo(
    () =>
      filterGroupedQuestions(reactQuestionGroups, query, ({ index, question }) =>
        getReactSearchFields(question, index),
      ),
    [query],
  );
  const filteredQuestionCount = filteredQuestionGroups.reduce(
    (total, group) => total + group.questions.length,
    0,
  );
  const totalQuestionCount = reactQuestions.length;

  return (
    <section className="py-3 sm:py-6">
      <div className="mb-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          react interview
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          React 高频题
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          面向中高级前端面试，按组件模型、Hooks、Fiber、并发、性能、React 18/19
          新特性、状态管理和工程实践整理。React 19 与 Compiler
          内容作为当前生态热点讲解，本项目运行时仍是 React 18.3.1。
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {reactQuestionGroups.map(({ category, questions }) => (
          <article className={`${cardClass} p-4`} key={category}>
            <p className="text-sm font-extrabold text-emerald-700">{category}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950">{questions.length}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">道高频追问</p>
          </article>
        ))}
      </div>

      <QuestionSearchPanel
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredQuestionCount}
        totalCount={totalQuestionCount}
      />

      <div className="grid gap-6">
        {filteredQuestionGroups.map(({ category, questions }) => (
          <section className="grid gap-4" key={category}>
            <div>
              <p className="text-sm font-extrabold text-emerald-700">{category}</p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-950">{category} 高频题</h2>
            </div>
            <div className="grid gap-4">
              {questions.map(({ index, question }) => (
                <ReactQuestionCard index={index} key={question.question} question={question} />
              ))}
            </div>
          </section>
        ))}
        {query.trim() && filteredQuestionCount === 0 && <QuestionSearchEmptyState query={query} />}
      </div>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="mb-4">
          <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
            practice demos
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-950">练习 demo</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ControlledInputDemo />
          <KeyBehaviorDemo />
          <RenderMemoDemo />
        </div>
      </section>
    </section>
  );
}

function getReactSearchFields(question: ReactQuestion, index: number): SearchableField[] {
  return [
    index,
    question.category,
    question.question,
    question.shortAnswer,
    question.detail,
    question.talkingPoints,
    question.followUp,
    question.codeExample,
  ];
}

function ReactQuestionCard({
  question,
  index,
}: {
  question: ReactQuestion;
  index: number;
}) {
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
        <p className="border-l-4 border-sky-500 pl-3 font-bold leading-7 text-slate-800">
          {question.shortAnswer}
        </p>
        <p className="leading-7 text-slate-600">{question.detail}</p>
        {question.talkingPoints && (
          <div className="rounded-lg bg-slate-50 p-3">
            <strong className="text-sm text-slate-900">面试表达要点</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {question.talkingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        {question.followUp && (
          <div className="rounded-lg bg-emerald-50 p-3">
            <strong className="text-sm text-emerald-950">常见追问</strong>
            <p className="mt-2 leading-7 text-slate-700">{question.followUp}</p>
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

function ControlledInputDemo() {
  const [name, setName] = useState("Frank");
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const [snapshot, setSnapshot] = useState("");

  return (
    <article className={`${cardClass} grid content-start gap-3 p-4 sm:p-5`}>
      <h2 className="text-lg font-extrabold text-slate-900">受控 vs 非受控</h2>
      <label className="grid gap-1.5 font-bold text-slate-700">
        受控输入
        <input
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="grid gap-1.5 font-bold text-slate-700">
        非受控输入
        <input className={inputClass} defaultValue="一次性读取" ref={uncontrolledRef} />
      </label>
      <button
        className={primaryButtonClass}
        onClick={() => setSnapshot(uncontrolledRef.current?.value ?? "")}
        type="button"
      >
        读取 DOM 值
      </button>
      <p className="rounded-lg bg-sky-50 p-3 leading-7 text-slate-600">
        React state: {name || "空"}
      </p>
      <p className="rounded-lg bg-sky-50 p-3 leading-7 text-slate-600">
        DOM snapshot: {snapshot || "尚未读取"}
      </p>
    </article>
  );
}

function KeyBehaviorDemo() {
  const [items, setItems] = useState(initialItems);

  return (
    <article className={`${cardClass} grid content-start gap-3 p-4 sm:p-5`}>
      <h2 className="text-lg font-extrabold text-slate-900">稳定 key 行为</h2>
      <div className="flex items-center gap-2">
        <button
          aria-label="反转列表"
          className={iconButtonClass}
          onClick={() => setItems([...items].reverse())}
          title="反转列表"
          type="button"
        >
          <Shuffle aria-hidden="true" size={18} />
        </button>
        <button
          aria-label="重置列表"
          className={iconButtonClass}
          onClick={() => setItems(initialItems)}
          title="重置列表"
          type="button"
        >
          <RotateCcw aria-hidden="true" size={18} />
        </button>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <label
            className="grid items-center gap-2 sm:grid-cols-[80px_minmax(0,1fr)]"
            key={item.id}
          >
            <span className="font-bold text-slate-700">{item.label}</span>
            <input className={inputClass} defaultValue={item.value} />
          </label>
        ))}
      </div>
      <p className="text-sm leading-6 text-slate-600">
        反转后输入框状态仍跟随稳定 id，而不是位置。
      </p>
    </article>
  );
}

function RenderMemoDemo() {
  const [count, setCount] = useState(0);
  const [keyword, setKeyword] = useState("hooks");
  const expensiveResult = useMemo(() => {
    const score = keyword.length * 37 + count;
    return `关键词 ${keyword} 的模拟得分：${score}`;
  }, [keyword, count]);

  return (
    <article className={`${cardClass} grid content-start gap-3 p-4 sm:p-5`}>
      <h2 className="text-lg font-extrabold text-slate-900">memo 与重渲染</h2>
      <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)]">
        <button className={primaryButtonClass} onClick={() => setCount(count + 1)} type="button">
          count {count}
        </button>
        <input
          className={inputClass}
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <MemoChild label={expensiveResult} />
      <p className="text-sm leading-6 text-slate-600">
        useMemo 缓存计算结果，React.memo 缓存子组件渲染。
      </p>
    </article>
  );
}

const MemoChild = memo(function MemoChild({ label }: { label: string }) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <p className="rounded-lg bg-sky-50 p-3 leading-7 text-slate-600">
      {label}，子组件渲染 {renderCount.current} 次
    </p>
  );
});
