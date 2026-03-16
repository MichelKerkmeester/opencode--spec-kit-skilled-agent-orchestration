---
title: "Tasks: 017 — Agent Alignment"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 017 — Agent Alignment

<!-- ANCHOR:notation -->
## Phase 0: Spec Setup + Diff Analysis

- [x] T001: Create spec.md
- [x] T002: Create plan.md
- [x] T003: Create tasks.md
- [x] T004: Read all 9 canonical agent files, catalog frontmatter and body structure
- [x] T005: Read all 9 Claude agent files, identify frontmatter to preserve
- [x] T006: Read all 9 Gemini agent files, identify frontmatter to preserve

<!-- /ANCHOR:notation -->
## Phase 1: Claude Runtime Sync (`.claude/agents/`)

- [x] T007: Sync `context.md` — preserved `tools: [Read, Grep, Glob]`, `model: sonnet`
- [x] T008: Sync `debug.md` — preserved `tools: [Read, Write, Edit, Bash, Grep, Glob]`, `model: opus`
- [x] T009: Sync `handover.md` — preserved `tools: [Read, Write, Edit, Bash, Grep, Glob]`, `model: sonnet`
- [x] T010: Sync `orchestrate.md` — preserved `tools: [Read, Task]`, `model: opus`
- [x] T011: Sync `research.md` — preserved `tools: [Read, Write, Edit, Bash, Grep, Glob, WebFetch]`, `model: opus`
- [x] T012: Sync `review.md` — preserved `tools: [Read, Bash, Grep, Glob]`, `model: opus`, `permissionMode: plan`
- [x] T013: Sync `speckit.md` — preserved `tools: [Read, Write, Edit, Bash, Grep, Glob]`, `model: sonnet`
- [x] T014: Sync `ultra-think.md` — preserved `tools: [Read, Grep, Glob, WebFetch, Task]`, `model: opus`
- [x] T015: Sync `write.md` — preserved `tools: [Read, Write, Edit, Bash, Grep, Glob, WebFetch]`, `model: sonnet`

## Phase 2: Gemini Runtime Sync (`.gemini/agents/`)

- [x] T016: Sync `context.md` — preserved `kind: local`, `model: gemini-3.1-pro-preview`, `max_turns: 10`, `timeout_mins: 5`
- [x] T017: Sync `debug.md` — preserved `max_turns: 20`, `timeout_mins: 15`
- [x] T018: Sync `handover.md` — preserved `max_turns: 10`, `timeout_mins: 5`
- [x] T019: Sync `orchestrate.md` — preserved `max_turns: 25`, `timeout_mins: 15`
- [x] T020: Sync `research.md` — preserved `max_turns: 20`, `timeout_mins: 15`, `google_web_search` tool
- [x] T021: Sync `review.md` — preserved `max_turns: 15`, `timeout_mins: 5`
- [x] T022: Sync `speckit.md` — preserved `max_turns: 20`, `timeout_mins: 10`
- [x] T023: Sync `ultra-think.md` — preserved `max_turns: 30`, `timeout_mins: 20`
- [x] T024: Sync `write.md` — preserved `max_turns: 15`, `timeout_mins: 10`, `google_web_search` tool

## Phase 3: Verification

- [x] T025: Verify body content parity (canonical vs Claude vs Gemini) for context, orchestrate, speckit — PASS
- [x] T026: Verify frontmatter integrity — Claude has `tools:`/`model:`, Gemini has `kind:`/`model:`/`max_turns:`/`timeout_mins:` — PASS
- [x] T027: Spot-check ChatGPT and Codex (speckit) still in sync — PASS
- [x] T028: File size sanity check — all within acceptable variance (max 7.6% for orchestrate) — PASS

## Phase 4: Documentation

- [x] T029: Create checklist.md
- [x] T030: Create implementation-summary.md
- [x] T031: Update parent epic status — added 015-018 rows to 001-hybrid-rag-fusion-epic/spec.md dashboard (2026-03-16)

---

## Frontmatter Preservation Rules

**Body content sync rule:** Copy everything after the closing `---` of YAML frontmatter from canonical `.opencode/agent/X.md`. Only adapt frontmatter and path convention directives.

### Claude (`.claude/agents/`)
- `tools:` — explicit list of allowed tools (e.g., `[Read, Grep, Glob]`)
- `model:` — `sonnet` or `opus`
- `mcpServers:` — includes `code_mode` (not in canonical)
- Path directive: `Use only .claude/agents/*.md as the canonical runtime path reference`

### Gemini (`.gemini/agents/`)
- `kind: local`
- `model: gemini-3.1-pro-preview`
- `temperature:` — same values as canonical
- `max_turns:` — Gemini-specific (10–30)
- `timeout_mins:` — Gemini-specific (5–20)
- `tools:` — Gemini-style names (`read_file`, `grep_search`, `list_directory`, etc.)
- Path directive: `Use only .gemini/agents/*.md as the canonical runtime path reference`
