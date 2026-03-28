---
title: "Checklist: 013 — Agent Alignment"
description: "Verification Date: 2026-03-25"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 013 — Agent Alignment

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim completion until resolved |
| **[P1]** | Required | Must complete or document why it did not |
| **[P2]** | Optional | Can defer with explanation |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Canonical packet files were read before rewriting [EVIDENCE: spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md were reviewed before the lineage rewrite.]
- [x] CHK-002 [P0] Live runtime lineage was checked across base, ChatGPT, Claude, Codex, and Gemini [EVIDENCE: runtime-facing agent families were cross-checked across `.opencode/agent/`, `.opencode/agent/chatgpt/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`.]
- [x] CHK-003 [P1] Gemini runtime-facing and storage-facing paths were both verified [EVIDENCE: packet docs record both `.gemini/agents/` runtime usage and `.agents` storage via the symlinked Gemini path.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The packet now documents two source families instead of one [EVIDENCE: spec.md distinguishes runtime-facing agent directories from storage-facing lineage surfaces.]
- [x] CHK-011 [P0] The packet now documents Codex as downstream from the ChatGPT family [EVIDENCE: spec.md and implementation-summary.md describe Codex under the ChatGPT-aligned runtime family instead of as an isolated root family.]
- [x] CHK-012 [P0] The packet uses deep-research naming consistently [EVIDENCE: the packet documents deep-research naming instead of stale research naming for runtime-facing agent docs.]
- [x] CHK-013 [P1] Runtime path guidance is internally consistent [EVIDENCE: packet docs present runtime-facing paths before storage details and keep the lineage narrative aligned across spec.md and plan.md.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Family counts verified — 10 files each for base, ChatGPT, Claude, Codex, and Gemini runtime paths [EVIDENCE: `find .opencode/agent -maxdepth 1 -name '*.md' | wc -l` = 10 across all 5 runtimes (context, debug, deep-research, deep-review, handover, orchestrate, review, speckit, ultra-think, write).]
- [x] CHK-021 [P0] Gemini symlink verified — `.gemini/agents/*.md` resolves through `.gemini -> .agents` [EVIDENCE: the packet documents the live symlinked Gemini runtime path explicitly.]
- [x] CHK-022 [P1] Stale research naming removed from canonical packet docs [EVIDENCE: canonical packet docs now use deep-research naming consistently.]
- [x] CHK-023 [P1] Strict spec validation executed [EVIDENCE: `validate.sh --strict` exits with 0 errors, 2 non-blocking warnings (custom Pass 2 section headers). SPEC_DOC_INTEGRITY passes. Run on 2026-03-25 after Pass 3 fixes.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Only the scoped live runtime agent docs were modified as part of this reconciliation [EVIDENCE: changes are limited to the intended delegation/write surfaces]
- [x] CHK-031 [P0] No secrets or runtime config were introduced [EVIDENCE: the reconciliation stayed within documentation packets and runtime-facing path descriptions only.]
- [x] CHK-032 [P1] The packet does not over-claim fresh runtime sync work [EVIDENCE: the packet frames the work as lineage/documentation reconciliation rather than a new runtime implementation rollout.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` tell one consistent lineage story [EVIDENCE: numbering corrected to 013; writer-surface limitation documented]
- [x] CHK-041 [P1] Codex and Gemini lineage are documented explicitly [EVIDENCE: packet docs call out Codex and Gemini explicitly in the runtime lineage narrative.]
- [x] CHK-042 [P1] Runtime-facing paths are documented before storage details [EVIDENCE: the packet orders runtime-facing paths ahead of storage-path explanation across the canonical docs.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Write scope stayed inside the canonical `013` packet plus the intended scoped runtime-facing docs [EVIDENCE: the reconciliation stayed inside the canonical `013` packet and the intended runtime-facing agent-doc surfaces.]
- [x] CHK-051 [P1] No temporary files were added outside the packet [EVIDENCE: no extra scratch or temporary artifacts were introduced outside the packet scope.]
- [x] CHK-052 [P2] Findings saved to `memory/` [EVIDENCE: memory context saved via generate-context.js on 2026-03-25, indexed as memory #10]
<!-- /ANCHOR:file-org -->

---

### Content Alignment (Pass 2 — 2026-03-25)

- [x] CHK-060 [P0] @explore removed from all orchestrate LEAF lists and NDP examples (5 runtimes) [EVIDENCE: grep confirms 0 matches for @explore across all agent dirs]
- [x] CHK-061 [P0] @deep-review added to orchestrate LEAF lists (5 runtimes) [EVIDENCE: grep confirms @deep-review present in all 5 orchestrate files]
- [x] CHK-062 [P0] Dead sk-code path replaced with sk-code--review in orchestrate resource tables (5 runtimes) [EVIDENCE: grep confirms 0 matches for `.opencode/skill/sk-code/` across all agent dirs]
- [x] CHK-063 [P1] Live memory routing surface present in orchestrate suggestion tables (5 runtimes) [EVIDENCE: `/memory:search`, `/memory:manage`, `/memory:manage shared`, `/memory:learn`, and `/memory:save` are represented in the active routing tables.]
- [x] CHK-064 [P1] `/memory:manage shared` added to speckit command tables (5 runtimes) [EVIDENCE: grep confirms `/memory:manage shared` in speckit and orchestrate agents]
- [x] CHK-065 [P1] Codex speckit /memory:learn label corrected to "Constitutional memory manager" [EVIDENCE: .codex/agents/speckit.toml updated]
- [x] CHK-066 [P0] Canonical claim-adjudication packet ported to all 5 deep-review agents [EVIDENCE: copilot verified 0 matches for stale claimId/skepticCheck/refereeDecision across all 5 files]
- [x] CHK-067 [P0] Canonical review JSONL schema ported to all 5 deep-review agents [EVIDENCE: copilot verified findingsSummary/findingsNew/findingsRefined present, old severityCounts absent]
- [x] CHK-068 [P1] Codex deep-review 5-dimension scorecard replaced with 4-dimension canonical taxonomy [EVIDENCE: copilot replaced Correctness/Security/Patterns/Maintainability/Performance with correctness/security/traceability/maintainability]

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items (Pass 1) | 8 | 8/8 |
| P1 Items (Pass 1) | 8 | 8/8 |
| P0 Items (Pass 2) | 4 | 4/4 |
| P1 Items (Pass 2) | 5 | 5/5 |
| P2 Items | 1 | 1/1 |
<!-- /ANCHOR:summary -->

---
