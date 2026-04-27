## Why

Question-bank pages are useful for browsing, but users need a faster way to locate specific interview topics across long category sections. Adding URL-backed search is a low-risk pilot for the OpenSpec workflow because it touches product behavior, UI state, performance, and validation without changing the underlying content model.

## What Changes

- Add keyword search controls to question-bank pages.
- Filter visible questions by query while preserving category grouping.
- Store the search query in the URL so refresh and shared links restore the same view.
- Keep large-list rendering efficient by reusing grouped data and filtering derived data only when inputs change.

## Capabilities

### New Capabilities

- `question-search`: Search and URL restoration behavior for question-bank pages.

### Modified Capabilities

- `question-bank`: Question-bank pages gain shareable interactive filtering requirements.

## Impact

- Affected areas: React page state, URL query handling, question-bank rendering, user-facing search UI, and related tests.
- No new runtime dependencies are expected.
- Existing question content and navigation modules remain compatible.
