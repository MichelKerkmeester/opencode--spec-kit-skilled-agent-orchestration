<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->
---
title: "Resource Map: 059 @code Sub-Agent [template:resource-map.md]"
description: "Lean path catalog for packet 059-agent-implement-code; pairs with implementation-summary.md."
trigger_phrases:
  - "059 resource map"
  - "059 files touched"
  - "code agent path catalog"
importance_tier: "normal"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T20:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map authored post-merge"
    next_safe_action: "Refresh map on next material file change"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: 059 @code Sub-Agent

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 119
- **By category**: READMEs=5, Documents=2, Commands=0, Agents=17, Skills=2, Specs=99, Scripts=0, Tests=0, Config=0, Meta=3 (note: 91 of the 99 Specs entries are research artifacts auto-emitted by 4 deep-research streams; only 8 are authored spec docs)
- **Missing on disk**: 0
- **Scope**: All files created, updated, or analyzed during packet `059-agent-implement-code` Phase 1 (spec scaffolding) + Phase 2 (4 deep-research streams) + Phase 3 (agent authoring + 4-runtime mirror + sibling sync + bloat-fix sweep + CP-026 playbook) and merged in commit `12f4d9f2cc` on `main`.
- **Generated**: 2026-05-01T20:30:00-07:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agent/README.txt` | Updated | OK | Added `code` row to inventory list |
| `.claude/agents/README.txt` | Updated | OK | Added `code` row |
| `.gemini/agents/README.txt` | Updated | OK | Added `code` row |
| `.codex/agents/README.txt` | Updated | OK | Added `code` row |

<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Long-form markdown artifacts that are not READMEs.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | Added CP-026 description block + index row |

<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:agents -->
## 4. Agents

> `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`. Includes runtime mirrors for `@code` (4 surfaces) plus bloat-fix touches across `context.md` and `deep-research.md` per the conservative cli-codex bloat scan.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agent/code.md` | Created | OK | NEW — 522 lines, mirrors `@review` §0-§13 from coder POV (source of truth) |
| `.claude/agents/code.md` | Created | OK | Mirror with `.claude/agents/*.md` Path Convention |
| `.gemini/agents/code.md` | Created | OK | Mirror with `.gemini/agents/*.md` Path Convention |
| `.codex/agents/code.toml` | Created | OK | Toml-wrapped (`sandbox_mode=workspace-write`, `model=gpt-5.4`, `model_reasoning_effort=high`) |
| `.opencode/agent/orchestrate.md` | Updated | OK | §2 routing-table row 6 swapped `@general` → `@code`; LEAF list updated; Agent Files extended |
| `.opencode/agent/context.md` | Updated | OK | Bloat-fix: deleted 3 stale orchestrator section refs (Section 7/10/16) |
| `.claude/agents/context.md` | Updated | OK | Bloat-fix mirror |
| `.gemini/agents/context.md` | Updated | OK | Bloat-fix mirror |
| `.codex/agents/context.toml` | Updated | OK | Bloat-fix mirror |
| `.opencode/agent/deep-research.md` | Updated | OK | Bloat-fix: tool-table "Strategy update" → "research/research.md update when progressiveSynthesis is true"; write-safety bullet → "Strategy: Reducer-owned; do not edit directly" |
| `.claude/agents/deep-research.md` | Updated | OK | Bloat-fix mirror |
| `.gemini/agents/deep-research.md` | Updated | OK | Bloat-fix mirror |
| `.codex/agents/deep-research.toml` | Updated | OK | Bloat-fix mirror |
| `.opencode/agent/review.md` | Analyzed | OK | Structural template for `@code` body (§0-§13); cited heavily in `research/synthesis.md` and stream-04 |
| `.opencode/agent/write.md` | Analyzed | OK | Closest write-capable LEAF analog; cited by stream-04 + ADR-2 rationale |
| `.opencode/agent/debug.md` | Analyzed | OK | 5-phase methodology referenced for Builder/Critic/Verifier counter-evidence questions |
| `.opencode/agent/improve-agent.md` | Cited | OK | Skills-table pattern precedent (stream-03 finding) |

<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> `.opencode/skill/**`. Per category-precedence rule, markdown inside `.opencode/skill/**` belongs here even when it looks like a general doc; the playbook root `manual_testing_playbook.md` is treated as a Document above only because it acts as the per-skill index page.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/004-code-vs-general-agent-perf-comparison.md` | Created | OK | NEW — CP-026 perf-comparison scenario (`@code` vs `@general` via copilot) |
| `.opencode/skill/sk-code/SKILL.md` | Cited | OK | Stack detection delegated here per ADR-4; Iron Law canonical source line 62 |

<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` — spec folders, phase children, packet docs, research, scratch. Spec-folder JSON metadata (`description.json`, `graph-metadata.json`) lives here per category-precedence rule (Specs > Config). Glob suffixes used where every file under the glob received the same Action.

### Authored spec docs (Level 3 + cross-cutting)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/skilled-agent-orchestration/059-agent-implement-code/spec.md` | Created | OK | Level 3 spec |
| `specs/skilled-agent-orchestration/059-agent-implement-code/plan.md` | Created | OK | Canonical SUMMARY/QUALITY GATES/ARCHITECTURE/IMPLEMENTATION PHASES/TESTING/DEPENDENCIES/ROLLBACK + AI Execution Protocol |
| `specs/skilled-agent-orchestration/059-agent-implement-code/tasks.md` | Created | OK | T001–T039 across canonical Setup/Implementation/Verification phases |
| `specs/skilled-agent-orchestration/059-agent-implement-code/checklist.md` | Created | OK | 8-section canonical structure with [P0] tags + [EVIDENCE: …] markers |
| `specs/skilled-agent-orchestration/059-agent-implement-code/decision-record.md` | Created | OK | ADR-1 to ADR-10; ADR-3 finalized post-research as convention-floor |
| `specs/skilled-agent-orchestration/059-agent-implement-code/implementation-summary.md` | Created | OK | 6-section canonical structure with smoke-test prompts |
| `specs/skilled-agent-orchestration/059-agent-implement-code/handover.md` | Created | OK | Phase 2 + Phase 3 narrative + final commit reference |
| `specs/skilled-agent-orchestration/059-agent-implement-code/resource-map.md` | Created | OK | THIS FILE — the optional path ledger |

### Spec metadata (per Specs > Config precedence)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/skilled-agent-orchestration/059-agent-implement-code/description.json` | Created | OK | Auto-generated metadata |
| `specs/skilled-agent-orchestration/059-agent-implement-code/graph-metadata.json` | Created | OK | Graph + status surfaces |
| `specs/skilled-agent-orchestration/022-mcp-coco-integration/graph-metadata.json` | Updated | OK | Parent registers child 059 (`children_ids`, `derived.last_active_child_id`) |
| `specs/skilled-agent-orchestration/022-mcp-coco-integration/context-index.md` | Created | OK | Phase-parent transition note |

### Cross-stream synthesis

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md` | Created | OK | Reconciles 4 streams; finalizes ADR-3 + canonical `code.md` skeleton |

### Per-stream research artifacts (4 streams × ~22 paths each = 87 entries)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/research.md` | Created | OK | Stream-01 cited evidence; oh-my-opencode-slim patterns |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/deep-research-{config.json,state.jsonl,strategy.md,dashboard.md}` | Created | OK | Stream-01 packet state |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/{iterations,deltas,prompts}/**` | Created | OK | 4 iter narratives + 4 delta JSONLs + 4 prompt-pack files |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/findings-registry.json` | Created | OK | Reducer-owned findings index |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/research.md` | Created | OK | Stream-02 cited evidence; opencode-swarm-main patterns |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/deep-research-{config.json,state.jsonl,strategy.md}` | Created | OK | Stream-02 packet state |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/{iterations,deltas,prompts}/**` | Created | OK | 5 iter narratives + 5 delta JSONLs + 5 prompt-pack files |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/findings-registry.json` | Created | OK | |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/research.md` | Created | OK | Stream-03 cited evidence; nested `research/` due to reducer specFolder requirement |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/{deep-research-config.json,deep-research-state.jsonl,deep-research-strategy.md,findings-registry.json,iterations,deltas,prompts}/**` | Created | OK | Stream-03 nested packet state + 5 iter triples |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/research.md` | Created | OK | Stream-04 cited evidence; 721 lines including drop-in `code.md` body proposal |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-{config.json,state.jsonl,strategy.md}` | Created | OK | Stream-04 packet state |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/{iterations,deltas,prompts}/**` | Created | OK | 8 iter narratives + 8 delta JSONLs + 8 prompt-pack files |
| `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/findings-registry.json` | Created | OK | |

<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:meta -->
## 10. Meta

> Repository-wide governance artifacts. `Meta` takes precedence over `READMEs` for the root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `AGENTS.md` | Updated | OK | §5 Agent Definitions adds `@code` entry; canonical source |
| `AGENTS_Barter.md` | Updated | OK | Symlink to separate Barter repo (`Barter/coder/AGENTS.md`); same `@code` description ported |
| `README.md` | Updated | OK | 10→11 specialist agents (4 places) + new `**Code**` entry in §🤖 Agent Network + footer date 2026-05-01 |

<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Path conventions:**
- All paths repo-relative. The `specs/` prefix is the symlink to `.opencode/specs/`; either resolves to the same files. Git operations work on the `.opencode/specs/...` form (the `specs/...` form errors with "beyond a symbolic link").
- Glob suffixes (`/**`) used in §6 Specs for stream packet state because every file in those subtrees received `Created` action with the same provenance (deep-research workflow auto-emit).

**Action and Status:** entries reflect state at commit `12f4d9f2cc` (2026-05-01). Subsequent edits to any of these files are NOT tracked here — re-author or amend the map at next commit if needed.

**Categories deliberately omitted (zero entries):**
- §3 Commands (no `.opencode/command/**` files modified)
- §7 Scripts (no `.sh`/`.js`/`.ts`/`.py` runtime scripts modified)
- §8 Tests (CP-026 sandbox lives in `/tmp/`, not the repo; no in-repo test files added)
- §9 Config (all spec-folder JSON metadata lives under §6 Specs per precedence rule)

Per template instruction, omitted categories are NOT renumbered — §1, §2, §4, §5, §6, §10 keep their original numbers so cross-packet anchor links remain stable.

**Cross-references:**
- `implementation-summary.md` — narrative of what changed and why (the *why* lives there, not here)
- `decision-record.md` — ADR-1 to ADR-10 with full rationale
- `research/synthesis.md` — Phase 2 cross-stream synthesis (canonical evidence record)
- `handover.md` — session continuity + Phase 3 final-pass commands

**Reference reading:**
- `.opencode/skill/system-spec-kit/templates/manifest/resource-map.md.tmpl` (canonical template)
- `.opencode/skill/system-spec-kit/templates/README.md` (template architecture)

<!-- /ANCHOR:author-instructions -->
