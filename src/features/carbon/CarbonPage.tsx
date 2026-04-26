import { carbonEnhancements } from "../../content/carbonEnhancements";
import type { CarbonQuestion } from "../../content/carbonQuestions";
import {
  carbonCategories,
  carbonQuestions,
} from "../../content/carbonQuestions";

const cardClass =
  "rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/60";

export function CarbonPage() {
  return (
    <section className="py-3 sm:py-6">
      <div className="mb-6 max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-normal text-emerald-700">
          carbon interview
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-normal text-slate-950 sm:text-3xl">
          碳元素面试题
        </h1>
        <p className="mt-2 text-base leading-7 text-slate-600">
          基于文档中的 22 个问题整理，覆盖 Next.js、React、状态管理、工程化、AI
          通信、安全与 SDD。 每题都按面试口述口径补充答案，关键题附代码示例。
        </p>
      </div>

      <div className="grid gap-6">
        {carbonCategories.map((category) => {
          const questions = carbonQuestions.filter(
            (item) => item.category === category,
          );
          return (
            <section className="grid gap-4" key={category}>
              <div>
                <p className="text-sm font-extrabold text-emerald-700">
                  {category}
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-950">
                  {category} 高频追问
                </h2>
              </div>
              <div className="grid gap-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    index={carbonQuestions.indexOf(question) + 1 || index + 1}
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

function QuestionCard({
  question,
  index,
}: {
  question: CarbonQuestion;
  index: number;
}) {
  const enhancement = carbonEnhancements[index];

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
        {enhancement && (
          <div className="rounded-lg bg-emerald-50 p-3">
            <strong className="text-sm text-emerald-950">深挖回答</strong>
            <p className="mt-2 leading-7 text-slate-700">
              {enhancement.deepDive}
            </p>
          </div>
        )}
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
        {enhancement && (
          <div className="rounded-lg bg-slate-50 p-3">
            <strong className="text-sm text-slate-900">代码示例解析</strong>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {enhancement.codeExplanation.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {(enhancement?.codeExample ?? question.codeExample) && (
        <pre className="overflow-x-auto border-t border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
          <code>{enhancement?.codeExample ?? question.codeExample}</code>
        </pre>
      )}
    </article>
  );
}
