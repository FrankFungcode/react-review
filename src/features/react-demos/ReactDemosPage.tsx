import { RotateCcw, Shuffle } from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import type { InterviewSection } from "../../content/interviewData";

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

const cardClass =
  "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const inputClass =
  "min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-extrabold text-white transition hover:bg-emerald-800";
const iconButtonClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-900 transition hover:bg-slate-300";

export function ReactDemosPage({ section }: { section?: InterviewSection }) {
  return (
    <section className="py-3 sm:py-6">
      <div className="mb-5 max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          react
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          {section?.title}
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          {section?.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ControlledInputDemo />
        <KeyBehaviorDemo />
        <RenderMemoDemo />
      </div>

      <div className="mt-5 grid gap-4">
        {section?.questions.map((question) => (
          <article
            className={`${cardClass} p-4 sm:p-5`}
            key={question.question}
          >
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
    </section>
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
        <input
          className={inputClass}
          defaultValue="一次性读取"
          ref={uncontrolledRef}
        />
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
          className={iconButtonClass}
          onClick={() => setItems([...items].reverse())}
          title="反转列表"
          type="button"
        >
          <Shuffle aria-hidden="true" size={18} />
        </button>
        <button
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
        <button
          className={primaryButtonClass}
          onClick={() => setCount(count + 1)}
          type="button"
        >
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
