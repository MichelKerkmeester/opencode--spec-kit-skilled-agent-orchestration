---
title: "Resource Map: Code-Graph Hook Improvements [013-code-graph-hook-improvements]"
description: "Every file path analyzed, created, updated, or validated while delivering packet 013 code-graph and hook contract remediation."
trigger_phrases:
  - "013 resource map"
  - "code-graph hook improvements ledger"
  - "files touched 013"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements"
    last_updated_at: "2026-04-24T11:27:02+02:00"
    last_updated_by: "codex"
    recent_action: "Authored packet resource map"
    next_safe_action: "Review packet-wide validator residuals"
    blockers:
      - "Packet validator still reports pre-existing spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md issues outside resource-map scope."
    key_files:
      - "resource-map.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.0 -->

A `resource-map.md` is a **lean** companion to `implementation-summary.md`. Where the summary narrates *what was done and why*, the resource map simply lists **every file path touched** during the packet — grouped by category and easy to scan.

It is supported at every documentation level (Level 1 through Level 3+) and is **optional but recommended**. Use it when the set of files spans more than a handful of paths, when audits or reviewers need a quick map of the blast radius, or when a phase child needs to hand a clean path ledger to its successor.

Keep this file **paths-only** — no narrative, no decisions, no test evidence. Those belong in the implementation summary, packet decision log, or checklist.

---

## Summary

- **Total references**: 67
- **By category**: READMEs=1, Documents=2, Commands=0, Agents=0, Skills=0, Specs=31, Scripts=21, Tests=6, Config=6, Meta=0
- **Missing on disk**: 0
- **Scope**: all packet-local docs, evidence reports, related 026 research inputs, implementation target files, validation scripts, and closeout metadata for `026/009/013-code-graph-hook-improvements`
- **Generated**: 2026-04-24T12:10:00+02:00

> Action vocabulary: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> Status vocabulary: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> Omit categories that have zero entries. Keep tables tight — one path per row.

---

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | Cited | OK | Runtime startup reference cited by packet research. |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Operator-facing `graphQualitySummary` note shipped in T-010. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Cited | OK | Hook matrix cited by packet research scope and runtime findings. |

---

## 3. Commands

No command-surface files under `.opencode/command/**` or runtime-specific command folders were authored or cited by this packet.

---

## 4. Agents

No agent definition files under `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, or `.gemini/agents/**` were authored or cited by this packet.

---

## 5. Skills

No standalone skill-package docs outside the implementation/test/doc surfaces already classified below were directly authored or cited by this packet.

---

## 6. Specs

> `.opencode/specs/**` — spec folders, phase children, packet docs, research, review, scratch.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/spec.md` | Analyzed | OK | Scope and requirements input. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/plan.md` | Analyzed | OK | Architecture, phases, and dependency input. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/tasks.md` | Analyzed | OK | Task-to-finding mapping input. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/implementation-summary.md` | Created | OK | Packet closeout and changed-files ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/checklist.md` | Created | OK | Verification closeout doc. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/code-graph-zero-calls-investigation.md` | Analyzed | OK | Packet-local zero-calls incident note cited by research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-001.md` | Created | OK | Applied evidence for blocked query/context regression scaffolds. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-002.md` | Created | OK | Applied evidence for ambiguous CALLS subject baselines. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-003.md` | Created | OK | Applied evidence for seed, startup, and boundedness contract capture. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-004.md` | Created | OK | Applied evidence for operation-aware CALLS resolver. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-005.md` | Created | OK | Applied evidence for selected-candidate metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-006.md` | Created | OK | Applied evidence for wrapper-shadow CALLS regressions. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-007.md` | Created | OK | Applied evidence for blocked/degraded `full_scan` reads. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-008.md` | Created | OK | Applied evidence for CocoIndex seed fidelity. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-009.md` | Created | OK | Applied evidence for null-summary scan clearing. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-010.md` | Created | OK | Applied evidence for graph-quality readers. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-011.md` | Created | OK | Applied evidence for startup payload parity. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-012.md` | Created | OK | Applied evidence for deadline and partial-output metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-013.md` | Created | OK | Applied evidence for sibling `handle*` shadow verification. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-014.md` | Created | OK | Applied evidence for targeted Vitest execution. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-015.md` | Created | OK | Applied evidence for cross-consistency grep checks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/applied/T-016.md` | Created | OK | Applied evidence for strict packet validation. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-code-graph-hook-improvements-pt-02/research.md` | Analyzed | OK | Primary implementation research input. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-pt-02-merged-synthesis.md` | Analyzed | OK | Bucket A merged synthesis input cited by `tasks.md` and `plan.md`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/028-code-graph-hook-improvements-pt-01/research.md` | Analyzed | OK | Prior packet synthesis used as boundary context. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-code-graph-zero-calls-pt-03/research.md` | Analyzed | OK | Zero-calls root-cause research folded into packet tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-009.md` | Cited | OK | Closed freshness boundary referenced by plan and research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-010.md` | Cited | OK | Closed readiness-contract boundary referenced by plan and research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-013.md` | Cited | OK | Historical adjacent fix cited by zero-calls research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md` | Cited | OK | Closed artifact-root boundary referenced by plan and research. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/resource-map.md` | Created | OK | Packet path ledger generated from canonical template. |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts` | Updated | OK | Resolver correctness, selected-candidate metadata, and blocked query contract. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts` | Updated | OK | Blocked context contract, anchor fidelity, and deadline propagation. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/seed-resolver.ts` | Updated | OK | Preserved CocoIndex score/snippet/range/provider fidelity. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Updated | OK | Cleared stale enrichment summaries on null-summary scans. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` | Updated | OK | Added graph-quality readers and summary-clearing helper. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/status.ts` | Updated | OK | Surfaced `graphQualitySummary` on `code_graph_status`. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts` | Updated | OK | Added graph-quality output and startup payload transport. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Updated | OK | Emitted startup payload contract section. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts` | Updated | OK | Emitted startup payload contract section. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts` | Updated | OK | Appended serialized startup payload contract. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts` | Updated | OK | Transported the same startup payload contract for Codex. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts` | Analyzed | OK | Readiness contract evidence cited by pt-02 research. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts` | Cited | OK | Runtime startup reference cited by pt-02 research. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts` | Analyzed | OK | Wrapper-shadow collision surface cited by zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Analyzed | OK | Real implementation target cited by zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Cited | OK | Sibling `handle*` collision cited by zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | Cited | OK | Sibling `handle*` collision cited by zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/index.ts` | Cited | OK | Code-graph wrapper surface cited by zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Analyzed | OK | CALLS extraction boundary checked during zero-calls research. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts` | Analyzed | OK | Parse-health evidence checked during zero-calls research. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Validated | OK | Strict packet validator executed in T-016. |

---

## 8. Tests

> Test files, fixtures, snapshots. Group unit, integration, and vitest/pytest paths here.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-query-handler.vitest.ts` | Updated | OK | Added CALLS ambiguity and blocked-read regressions. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-context-handler.vitest.ts` | Updated | OK | Added blocked-read, seed-fidelity, and partial-output regressions. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/code-graph-scan.vitest.ts` | Updated | OK | Added overwrite-then-clear scan summary regression. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | Updated | OK | Added Claude startup payload contract assertions. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-session-start-hook.vitest.ts` | Updated | OK | Added Codex startup payload contract assertions. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts` | Cited | OK | Builder-level startup payload evidence cited by pt-02 research. |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`, `description.json`, `graph-metadata.json`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/description.json` | Cited | OK | Packet metadata present alongside closeout docs. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/013-code-graph-hook-improvements/graph-metadata.json` | Cited | OK | Packet graph metadata present alongside closeout docs. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-code-graph-hook-improvements-pt-02/findings-registry.json` | Analyzed | OK | Primary finding registry for implementation packet 013. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-014-pt-02-merged-findings.json` | Analyzed | OK | Merged Bucket A findings input cited by `tasks.md`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/028-code-graph-hook-improvements-pt-01/findings-registry.json` | Analyzed | OK | Prior packet finding registry used as boundary context. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/013-code-graph-zero-calls-pt-03/findings-registry.json` | Analyzed | OK | Zero-calls finding registry folded into packet scope. |

---

## 10. Meta

No repository-governance or top-level meta artifacts were authored or cited by this packet.

---

<!--
INSTRUCTIONS FOR AUTHORS

- Paths are **relative to the repo root** (e.g., `.opencode/skill/system-spec-kit/SKILL.md`), not absolute.
- One path per row. Use glob suffixes (`/**`, `/*`) only when every file under the glob received the same Action.
- Action = what this packet did to the file. If the file was only read for context, use `Analyzed` or `Cited`.
- Status = state at the moment this map was written. `MISSING` means referenced but not present on disk (expected deletion or a stale pointer); note which.
- Delete any category whose table is empty. Do not leave placeholder rows.
- For phase-heavy packets, generate one resource-map per phase child OR a single parent-level map that aggregates across children — pick the shape that reads most cleanly, and state the choice in `Scope`.
- Keep this file ≤ ~250 lines of content. If it grows larger, split by sub-scope or promote detail into the implementation summary or packet decision log.

Reference reading:
- `.opencode/skill/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` (level-by-level usage)
- `.opencode/skill/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
-->
