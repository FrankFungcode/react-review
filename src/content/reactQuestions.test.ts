import { describe, expect, it } from "vitest";
import { filterGroupedQuestions } from "../features/question-search/search";
import { reactQuestionGroups, reactQuestions } from "./reactQuestions";

function filterReactQuestions(query: string) {
  return filterGroupedQuestions(reactQuestionGroups, query, ({ index, question }) => [
    index,
    question.category,
    question.question,
    question.shortAnswer,
    question.detail,
    question.talkingPoints,
    question.followUp,
    question.codeExample,
  ]);
}

describe("react question bank", () => {
  it("contains the planned high-frequency React question set", () => {
    expect(reactQuestions.length).toBeGreaterThanOrEqual(30);
    expect(reactQuestionGroups).toHaveLength(7);
    expect(reactQuestionGroups.every((group) => group.questions.length > 0)).toBe(true);
  });

  it("matches category, talking points, follow-up, and code fields", () => {
    expect(filterReactQuestions("React Compiler")).toEqual(
      expect.arrayContaining([expect.objectContaining({ category: "性能优化与 React Compiler" })]),
    );

    expect(filterReactQuestions("乐观更新失败")).toEqual(
      expect.arrayContaining([expect.objectContaining({ category: "React 18/19 新特性" })]),
    );

    expect(filterReactQuestions("useSyncExternalStore")).toEqual(
      expect.arrayContaining([expect.objectContaining({ category: "状态管理与数据流" })]),
    );
  });

  it("keeps React 19 answers runtime-aware", () => {
    const react19Question = reactQuestions.find((question) =>
      question.question.includes("useActionState"),
    );

    expect(react19Question?.detail).toContain("React 18.3.1");
  });
});
