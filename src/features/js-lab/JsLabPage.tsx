import { Play } from "lucide-react";
import { useState } from "react";
import { type JsQuestion, jsCategories, jsQuestions } from "../../content/jsQuestions";
import {
  deepClone,
  flatten,
  groupBy,
  myBind,
  myInstanceof,
  myNew,
  promiseAll,
  promiseAllSettled,
} from "./handwritten";

const cardClass = "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";
const primaryButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 font-extrabold text-white transition hover:bg-emerald-800";

export function JsLabPage() {
  const [output, setOutput] = useState("点击运行，观察手写函数结果。");

  async function runExamples() {
    function Person(this: { name: string }, name: string) {
      this.name = name;
    }

    function greet(this: { prefix: string }, name: string) {
      return `${this.prefix} ${name}`;
    }

    const original = { user: { name: "React" }, tags: ["hooks"] };
    const cloned = deepClone(original);
    cloned.user.name = "Next.js";
    const promiseResult = await promiseAll([Promise.resolve("microtask"), 42] as const);
    const settled = await promiseAllSettled([
      Promise.resolve("ok"),
      Promise.reject("bad"),
    ] as const);
    const person = myNew<{ name: string }>(Person, "Ada");
    const bound = myBind(greet, { prefix: "Hi" });
    const grouped = groupBy(["Promise", "Closure", "Prototype"], (item) => item[0]);

    setOutput(
      [
        `deepClone 原值=${original.user.name}，克隆值=${cloned.user.name}`,
        `Promise.all=${promiseResult.join(" + ")}`,
        `allSettled=${settled.map((item) => item.status).join("/")}`,
        `[] instanceof Array=${String(myInstanceof([], Array))}`,
        `myNew=${person.name}`,
        `myBind=${bound("JS")}`,
        `flatten=${flatten([1, [2, 3]], 1).join(",")}`,
        `groupBy(P)=${grouped.P.length}`,
      ].join("；"),
    );
  }

  return (
    <section className="py-3 sm:py-6">
      <div className="mb-5 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          javascript
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          JavaScript 中高级面试专题
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          覆盖执行机制、闭包、this、原型、异步、Promise、内存泄漏、模块化、浏览器运行时和高频手写题。
          每道题都按可口述的面试答案组织，并补充深挖解释和代码解析。
        </p>
      </div>

      <article className={`${cardClass} grid max-w-4xl gap-3 p-4 sm:p-5`}>
        <h2 className="text-lg font-extrabold text-slate-900">手写题实验台</h2>
        <button className={primaryButtonClass} onClick={runExamples} type="button">
          <Play aria-hidden="true" size={18} />
          运行示例
        </button>
        <p className="break-words rounded-lg bg-sky-50 p-3 leading-7 text-slate-600">{output}</p>
      </article>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {jsCategories.map((category) => (
          <div className={`${cardClass} p-4`} key={category}>
            <p className="text-sm font-extrabold text-emerald-700">{category}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {jsQuestions.filter((question) => question.category === category).length} 道题
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6">
        {jsCategories.map((category) => {
          const questions = jsQuestions.filter((question) => question.category === category);
          return (
            <section className="grid gap-4" key={category}>
              <div>
                <p className="text-sm font-extrabold text-emerald-700">{category}</p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-950">{category} 高频题</h2>
              </div>
              <div className="grid gap-4">
                {questions.map((question) => (
                  <QuestionCard
                    index={jsQuestions.indexOf(question) + 1}
                    key={question.question}
                    question={question}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function QuestionCard({ question, index }: { question: JsQuestion; index: number }) {
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
          <strong className="text-sm text-slate-900">答案</strong>
          <p className="mt-1 font-medium leading-7 text-slate-700">{question.answer}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <strong className="text-sm text-emerald-950">深挖解释</strong>
          <p className="mt-2 leading-7 text-slate-700">{question.deepDive}</p>
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
