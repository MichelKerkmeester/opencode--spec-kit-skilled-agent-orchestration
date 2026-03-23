---
title: "Plan: 012 — Agent Alignment"
description: "Reconciliation plan for updating the 012 packet and the scoped runtime-facing agent docs to the live multi-runtime lineage model."
---
<!-- SPECKIT_LEVEL: 2 -->
# Plan: 012 — Agent Alignment
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This pass rewrites the `013-agents-alignment` packet so it matches the current runtime lineage instead of preserving the obsolete "single canonical source copied to every runtime" story. It also fixes the scoped runtime-facing drift in Gemini delegation guidance and the write-agent projections.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Canonical packet files reviewed
- [x] Live runtime family paths reviewed
- [x] Known stale naming and path-convention drift identified

### Definition of Done
- [x] Packet documents dual-source lineage accurately
- [x] Packet uses `deep-research.md` naming consistently
- [x] Packet documents Codex and Gemini runtime lineage clearly
- [x] Scoped runtime-facing agent docs match the reconciled lineage story
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Source Families

1. Base markdown family: `.opencode/agent/*.md`
2. ChatGPT markdown family: `.opencode/agent/chatgpt/*.md`

### Runtime Targets

- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml` generated from ChatGPT markdown
- Gemini runtime: `.gemini/agents/*.md`, backed by `.agents/agents/*.md`

### Path Guidance

Document runtime-facing paths first, then note storage details only where they matter for understanding the live repo.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. PHASES

### Phase 1: Audit Live Lineage
- Confirm file counts for base, ChatGPT, Claude, Codex, and Gemini runtime families.
- Confirm `.gemini -> .agents` symlink behavior.
- Confirm live naming uses `deep-research.md`.

### Phase 2: Rewrite the Packet
- Reframe `spec.md` away from the old single-source sync story.
- Rewrite `tasks.md`, `checklist.md`, and `implementation-summary.md` so they describe truth reconciliation rather than historical sync work.
- Normalize runtime path-convention wording.

### Phase 2b: Scoped Runtime-Doc Closeout
- Fix `.gemini/workflows/delegate_agent.md` so Gemini resolves runtime agents from `.gemini/agents/` first and never references the removed `.opencode/agent/claude/` path.
- Reconcile the write-agent projections so Claude, Gemini, ChatGPT, and Codex keep the documented catalog/playbook modes and nested `references/**/*.md` routing aligned with the authoring families.

### Phase 3: Verify
- Grep the packet for stale `research.md` naming and single-source language.
- Run strict spec validation.
- Re-read canonical docs for internal consistency.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tooling |
|-----------|-------|---------|
| File-count verification | Base and runtime families | `find`, `wc -l` |
| Path verification | Gemini runtime-facing and storage-facing paths | `ls -ld .gemini .agents`, `find -L .gemini/agents` |
| Stale-string verification | Canonical packet only | `rg` |
| Spec validation | `013-agents-alignment` folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Role |
|------------|--------|------|
| `.opencode/agent/*.md` | Available | Base markdown family |
| `.opencode/agent/chatgpt/*.md` | Available | ChatGPT markdown family |
| `.claude/agents/*.md` | Available | Runtime path verification |
| `.codex/agents/*.toml` | Available | Codex downstream verification |
| `.gemini/agents/*.md` and `.agents/agents/*.md` | Available | Gemini runtime/storage verification |
| `.gemini/workflows/delegate_agent.md` | Available | Scoped delegation-path closeout |
| `.claude/agents/write.md`, `.opencode/agent/chatgpt/write.md`, `.codex/agents/write.toml`, `.gemini/agents/write.md` | Available | Scoped writer-surface closeout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- If the packet regresses into mixed lineage language, revert only the canonical `012` docs and re-apply the rewrite from live runtime evidence.
- Do not revert unrelated live runtime agent files as part of packet rollback because this pass closes only the scoped delegation/write surfaces, not a bulk runtime sync.
<!-- /ANCHOR:rollback -->

---
