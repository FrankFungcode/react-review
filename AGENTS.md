# Project Agent Instructions

本项目采用 OpenSpec 风格的 spec-driven development。除非用户明确要求只做临时探索或简单问答，否则在实现非平凡需求前先检查 `openspec/`。

## OpenSpec Workflow

- 先读 `openspec/specs/`，理解长期能力规格。
- 新功能、重构、行为变更先创建 `openspec/changes/<change-id>/`。
- 每个 change 使用短横线命名，例如 `add-search-filter`。
- 每个 change 至少包含：
  - `proposal.md`: Why, What Changes, Capabilities, Impact。
  - `design.md`: Context, Goals / Non-Goals, Decisions, Risks / Trade-offs。
  - `tasks.md`: 按依赖排序的 `- [ ]` 任务。
  - `specs/<capability>/spec.md`: requirement deltas。
- 实现阶段严格按 `tasks.md` 执行；完成任务后更新勾选状态。
- 变更完成并验证后，用 OpenSpec archive 流程把 change 沉淀进长期 specs。

## Project Quality Gates

- 代码变更后运行 `npm run check`。
- 涉及逻辑或状态变更时运行 `npm run test`。
- 涉及页面、构建、依赖、路由或 bundle 时运行 `npm run build`。

## Existing Skills

- 使用 `vercel-composition-patterns` 检查组件组合、Provider 边界、props 设计。
- 使用 `vercel-react-best-practices` 检查 React 性能、bundle、render 和状态更新。
- 使用 `web-design-guidelines` 检查 UI、可访问性和交互质量。
- OpenSpec 管理“要做什么”和“为什么”，skills 辅助“怎么审”和“怎么实现得更好”。
