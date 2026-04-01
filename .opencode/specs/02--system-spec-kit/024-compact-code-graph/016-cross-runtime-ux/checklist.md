---
title: "Checklist: Cross-Runtime UX & Documentation [024/016]"
description: "8 items across P2/P3 for phase 016."
---
# Checklist: Phase 016 — Cross-Runtime UX & Documentation

## Phase Status

**PARTIAL (11/14 items complete; 3 deferred)**

## Completed / In Scope

## P2

- [x] Near-exact seed tier added (±5 lines, graduated confidence 0.95 - distance*0.02)
- [ ] CocoIndex score propagation via blended confidence formula — DEFERRED: requires CocoIndex API changes
- [x] Composite index (file_path, start_line) added to code_nodes
- [x] Intent pre-classifier annotates structural vs semantic vs hybrid metadata — classifyQueryIntent() in query-intent-classifier.ts feeds `queryIntentMetadata` / `queryIntentRouting`
- [x] Auto-reindex triggers on git branch switch (HEAD hash change)
- [x] Auto-reindex on session start via first-call priming
- [x] Recovery documentation consolidated (single source of truth in root CLAUDE.md) [F018]
- [x] Seed-resolver DB failures return error — no silent placeholder anchors [F014]
- [x] Spec/settings SessionStart scope aligned (matchers match registration) [F030] — spec updated: single unscoped entry + in-script branching is the correct design
- [x] Parent checklist PARTIAL items downgraded for phases 005/006/008/011/012

## P3

- [x] CODEX.md updated with Session Start Protocol
- [x] AGENTS.md updated with code graph auto-trigger for Copilot CLI
- [x] OpenCode context.md updated with code graph integration
- [x] GEMINI.md updated with session start protocol (shared via AGENTS.md symlink)
- [x] CLAUDE.md updated with universal Code Search Protocol

## Deferred / Out of Scope for This Phase

- [ ] Intent metadata drives backend selection/routing — DEFERRED: current implementation annotates `queryIntentMetadata` / `queryIntentRouting` but does not yet route queries to different backends from that metadata
- [ ] All instruction files verified to load on their respective runtimes — DEFERRED: requires manual verification
