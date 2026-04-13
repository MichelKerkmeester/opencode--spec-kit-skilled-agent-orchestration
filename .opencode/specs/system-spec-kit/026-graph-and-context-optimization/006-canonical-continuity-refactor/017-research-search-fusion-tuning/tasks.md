---
title: "Research: Search Fusion & Reranking Configuration Tuning - Tasks"
status: planned
---

# Tasks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

- [ ] F1: Wire continuity intent through Stage 3 MMR - `stage3-rerank.ts` reads `config.detectedIntent` but should read the fusion intent that stages 1-2 use
- [ ] F2: Decide: should `/spec_kit:resume` go through `handleMemorySearch`? Or is file-based recovery correct by design?
- [ ] F3: Fix docs that describe continuity-aware Stage 3 behavior that doesn't execute yet across the architecture, search, config README, and root README surfaces
- [ ] F4: Mark all 001-004 sub-phase checklists complete and update status: planned -> complete
- [ ] F5: Update `.codex/agents/deep-review.toml` `developer_instructions` to match the canonical deep-review iteration schema
- [ ] F6: Update `.codex/agents/context.toml` `developer_instructions` to match the canonical context continuity ladder
