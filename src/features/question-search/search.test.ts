import { describe, expect, it } from "vitest";
import {
  filterGroupedQuestions,
  normalizeSearchQuery,
  questionMatchesSearch,
  readSearchQueryFromUrl,
  setSearchQueryInUrl,
} from "./search";

describe("question search helpers", () => {
  it("normalizes query whitespace and casing", () => {
    expect(normalizeSearchQuery("  React Hooks  ")).toBe("react hooks");
  });

  it("matches question-like fields case-insensitively", () => {
    expect(questionMatchesSearch(["React", ["useMemo", "Fiber"]], "fiber")).toBe(true);
    expect(questionMatchesSearch(["React", ["useMemo", "Fiber"]], "zustand")).toBe(false);
    expect(questionMatchesSearch(["React"], "   ")).toBe(true);
  });

  it("filters grouped questions and removes empty groups", () => {
    const groups = [
      { category: "React", questions: [{ title: "Hooks" }, { title: "Fiber" }] },
      { category: "Node", questions: [{ title: "Streams" }] },
    ];

    expect(filterGroupedQuestions(groups, "stream", (question) => [question.title])).toEqual([
      { category: "Node", questions: [{ title: "Streams" }] },
    ]);
  });

  it("restores and writes the q query param without losing page state", () => {
    const url = "http://localhost/?page=sse&q=token#top";

    expect(readSearchQueryFromUrl(url)).toBe("token");
    expect(setSearchQueryInUrl(url, "  hooks  ")).toBe("/?page=sse&q=hooks#top");
    expect(setSearchQueryInUrl(url, "")).toBe("/?page=sse#top");
  });
});
