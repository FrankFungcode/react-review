import { useCallback, useEffect, useState } from "react";

export const questionSearchParam = "q";

export type SearchableField = string | number | null | undefined | SearchableField[];

export function normalizeSearchQuery(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function flattenSearchFields(fields: SearchableField[]): string {
  const values: Array<string | number> = [];

  function collect(field: SearchableField) {
    if (Array.isArray(field)) {
      field.forEach(collect);
      return;
    }

    if (field !== null && field !== undefined) {
      values.push(field);
    }
  }

  fields.forEach(collect);

  return values.join(" ").toLocaleLowerCase();
}

export function questionMatchesSearch(fields: SearchableField[], query: string) {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  return flattenSearchFields(fields).includes(normalizedQuery);
}

export function readSearchQueryFromUrl(url: string | URL, param = questionSearchParam) {
  return new URL(url, "http://localhost").searchParams.get(param) ?? "";
}

export function setSearchQueryInUrl(url: string | URL, query: string, param = questionSearchParam) {
  const nextUrl = new URL(url, "http://localhost");
  const normalizedQuery = query.trim();

  if (normalizedQuery) {
    nextUrl.searchParams.set(param, normalizedQuery);
  } else {
    nextUrl.searchParams.delete(param);
  }

  return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
}

export function filterGroupedQuestions<TGroup extends { questions: unknown[] }>(
  groups: TGroup[],
  query: string,
  getFields: (question: TGroup["questions"][number]) => SearchableField[],
) {
  return groups
    .map((group) => ({
      ...group,
      questions: group.questions.filter((question) =>
        questionMatchesSearch(getFields(question), query),
      ),
    }))
    .filter((group) => group.questions.length > 0);
}

export function useQuestionSearchQuery() {
  const [query, setQuery] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return readSearchQueryFromUrl(window.location.href);
  });

  useEffect(() => {
    function syncQueryFromHistory() {
      setQuery(readSearchQueryFromUrl(window.location.href));
    }

    window.addEventListener("popstate", syncQueryFromHistory);
    return () => window.removeEventListener("popstate", syncQueryFromHistory);
  }, []);

  const updateQuery = useCallback((nextQuery: string) => {
    setQuery(nextQuery);

    if (typeof window === "undefined") {
      return;
    }

    window.history.replaceState({}, "", setSearchQueryInUrl(window.location.href, nextQuery));
  }, []);

  return [query, updateQuery] as const;
}
