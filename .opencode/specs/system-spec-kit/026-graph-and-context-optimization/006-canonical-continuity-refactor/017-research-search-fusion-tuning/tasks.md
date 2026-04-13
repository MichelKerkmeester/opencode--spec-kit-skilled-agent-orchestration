---
title: "Research: Search Fusion & Reranking Configuration Tuning - Tasks"
status: planned
---

# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [x] F1: Wire continuity intent through Stage 3 MMR - `stage3-rerank.ts` now reads `adaptiveFusionIntent ?? detectedIntent`, and `stage3-rerank-regression.vitest.ts` proves Stage 3 uses the continuity lambda even when the public intent remains `understand`.
- [x] F2: Decide: should `/spec_kit:resume` go through `handleMemorySearch`? Or is file-based recovery correct by design? Evidence: `spec.md` now records the intentional direct ladder (`handover.md -> _memory.continuity -> spec docs`), matching `memory-context.ts` resume mode and `memory-context.resume-gate-d.vitest.ts`.
- [x] F3: Fix docs that describe continuity-aware Stage 3 behavior that doesn't execute yet across the architecture, search, config README, and root README surfaces. Evidence: after F1, `ARCHITECTURE.md`, `.opencode/command/memory/search.md`, `mcp_server/configs/README.md`, and `README.md` already matched the shipped Stage 3 continuity behavior, so no further edits were required.
- [x] F4: Mark all 001-004 sub-phase checklists complete and update status: planned -> complete. Evidence: the four child `spec.md` and `checklist.md` files now carry `status: complete`, and each previously open checklist item now has explicit packet evidence.
- [ ] F5: Update `.codex/agents/deep-review.toml` `developer_instructions` to match the canonical deep-review iteration schema. Blocked: this sandbox denies writes inside `.codex/agents`, so the canonical sync could be read and prepared but not applied in this run.
- [ ] F6: Update `.codex/agents/context.toml` `developer_instructions` to match the canonical context continuity ladder. Blocked: this sandbox denies writes inside `.codex/agents`, so the canonical sync could be read and prepared but not applied in this run.
