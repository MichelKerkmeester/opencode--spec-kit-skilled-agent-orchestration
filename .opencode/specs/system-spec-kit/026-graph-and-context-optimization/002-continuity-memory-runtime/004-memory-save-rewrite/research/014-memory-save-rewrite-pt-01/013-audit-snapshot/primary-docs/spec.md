---
title: "...y-memory-runtime/004-memory-save-rewrite/research/014-memory-save-rewrite-pt-01/013-audit-snapshot/primary-docs/spec]"
description: "Audit the system-spec-kit tree to verify the v3.4.0.0 claim that standalone [spec]/memory/*.md files are retired, and enumerate every code path, doc, or template that still writes, reads, or assumes that directory."
trigger_phrases:
  - "memory folder deprecation audit"
  - "memory-folder cleanup"
  - "v3.4.0.0 memory retirement"
  - "spec folder memory directory"
  - "generate-context memory write"
  - "memory file corpus audit"
  - "system-spec-kit memory audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-memory-folder-deprecation-audit"
    last_updated_at: "2026-04-14T19:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Authored Level 2 audit spec for memory folder deprecation"
    next_safe_action: "Run /spec_kit:deep-review:auto with cli-codex executor"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts"
      - ".opencode/skill/system-spec-kit/scripts/core/file-writer.ts"
      - ".opencode/command/memory/save.md"
      - ".opencode/command/memory/search.md"
      - ".opencode/skill/system-spec-kit/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-memory-folder-audit-init"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Is [spec]/memory/*.md still supposed to exist as an indexed artifact post-v3.4.0.0, or is the runtime in a half-migrated state?"
      - "Does the database still depend on memory/*.md as the primary file path for memory_index entries?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: [spec]/memory/ Folder Deprecation Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planning |
| **Created** | 2026-04-14 |
| **Branch** | `026-013-memory-folder-deprecation-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `v3.4.0.0` release changelog asserts that the `[spec]/memory/*.md` corpus is retired and that continuity now lives inside canonical spec docs (`decision-record.md`, `implementation-summary.md`, `handover.md`, plus the `_memory.continuity` YAML block). The `.opencode/command/memory/save.md` APPENDIX A currently reinforces this by stating *"Standalone `memory/*.md` files are retired and the runtime rejects them."*

**But live evidence contradicts the claim.** During a Step 11.5 verification loop on 2026-04-14, the `/memory:save` runtime wrote 14 new `[spec]/memory/YYYY-MM-DD__topic.md` files to `012-spec-kit-commands/memory/` via `generate-context.js` → `workflow.ts` Step 9. Each was indexed as a memory #N in the vector index. The runtime is still the primary producer of `memory/*.md` artifacts; the "retired" claim describes intent, not reality.

### Purpose

This packet audits **every active file in `system-spec-kit` and related command cards** to produce a complete inventory of `[spec]/memory/` references, classified by whether they are:

- **Stale write path (P0)**: Runtime code that creates `[spec]/memory/*.md` files
- **Stale read/expectation (P0)**: Code or doc that assumes `[spec]/memory/*.md` exists
- **Stale doc claim (P1)**: Documentation that claims deprecation when runtime contradicts it, or vice versa
- **Comment/copy drift (P2)**: Cosmetic references (e.g., code comments mentioning "the new memory file")
- **Valid reference (non-finding)**: `.opencode/command/memory/*.md` command card filenames, MCP tool names (`memory_save`, `memory_context`, etc.), `_memory.continuity` frontmatter keys, historical changelog text

The audit's output drives a follow-up decision: reconcile the runtime with the deprecation claim (rip out `memory/*.md` write path entirely) OR walk back the "retired" doc language to match the current runtime (legacy compat mode). Either resolution requires the complete inventory this audit produces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (Audit Target)

- **`.opencode/skill/system-spec-kit/scripts/`** — all TypeScript sources that orchestrate `/memory:save` (workflow.ts, memory-indexer.ts, file-writer.ts, subfolder-utils.ts, topic-extractor.ts, etc.) and their compiled `dist/` outputs
- **`.opencode/skill/system-spec-kit/mcp_server/`** — MCP handlers (`memory-index.ts`, `memory-save.ts`, etc.), discovery modules, routing prototypes, index schemas
- **`.opencode/skill/system-spec-kit/SKILL.md` + `README.md`** — operator-facing docs
- **`.opencode/skill/system-spec-kit/templates/`** — any template that references a `memory/` subfolder
- **`.opencode/skill/system-spec-kit/references/`** — all reference docs
- **`.opencode/command/memory/save.md`, `search.md`, `manage.md`, `learn.md`** — command cards (audit their behavioral description, not the filenames themselves)
- **`.opencode/skill/system-spec-kit/scripts/tests/`** — vitest tests that fixture or assert `[spec]/memory/*.md` behavior
- **Runtime config files** — any `package.json`, `tsconfig.json`, or schema that references memory file paths

### Out of Scope

- `.opencode/command/memory/` as a **folder-name namespace** (the command cards live there — that's a different "memory" concept)
- MCP tool names in the `memory_*` namespace (`memory_save`, `memory_search`, `memory_context`, `memory_index_scan`, `memory_stats`, etc.)
- `_memory.continuity` frontmatter keys inside canonical spec docs (these are explicitly preserved per v3.4.0.0)
- Historical changelog entries under `.opencode/changelog/` and `.claude/changelog/` (point-in-time records — don't edit history)
- `z_archive/`, `z_future/`, `/iterations/` directories (frozen artifacts)
- Any `[spec]/memory/*.md` files **themselves** as content (the files may be deleted as part of follow-up remediation — this packet only **inventories** them)
- Agents in `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` (this packet scopes to system-spec-kit skill + memory commands, not the broader agent tree)
- Unrelated skills (cli-codex, sk-doc, skill-advisor, etc.)

### Files to Inventory (Expected Surfaces)

| Category | Path prefix | Reason |
|---|---|---|
| Save runtime | `.opencode/skill/system-spec-kit/scripts/core/` | Creates memory/*.md files |
| Save runtime dist | `.opencode/skill/system-spec-kit/scripts/dist/core/` | Compiled outputs |
| MCP handlers | `.opencode/skill/system-spec-kit/mcp_server/handlers/` | Indexes memory/*.md, discovery helpers |
| MCP lib | `.opencode/skill/system-spec-kit/mcp_server/lib/` | Storage, routing, discovery |
| Command cards | `.opencode/command/memory/` | Operator-facing prompts for save/search/learn/manage |
| Skill docs | `.opencode/skill/system-spec-kit/{SKILL.md,README.md}` | Canonical skill description |
| Skill references | `.opencode/skill/system-spec-kit/references/` | Workflow guides, debugging, templates, memory save_workflow.md |
| Templates | `.opencode/skill/system-spec-kit/templates/` | Level-N and support templates |
| Tests | `.opencode/skill/system-spec-kit/scripts/tests/` | Fixture, assertion coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a complete inventory of every runtime code path in system-spec-kit that writes `[spec]/memory/*.md` files | `review/review-report.md` lists each write site with file path + line number + call chain (e.g., `workflow.ts:NNN writeFilesAtomically → file-writer.ts:MMM`); zero false positives (no MCP tool names, no frontmatter keys) |
| REQ-002 | Produce a complete inventory of every read path (code that globs, opens, or expects `[spec]/memory/*.md` to exist) | Each read site documented with path + line + context (indexing read vs search retrieval vs template load); handles both direct fs reads and indirect paths via `memory_index_scan` discovery helpers |
| REQ-003 | Produce a complete inventory of every doc/template that claims deprecation **or** still instructs writing memory/*.md | Each doc site listed with path + line + exact quoted text; flagged as either "matches runtime" or "contradicts runtime" |
| REQ-004 | Classify every finding into P0 (write path), P0 (read path), P1 (doc claim mismatch), P2 (comment drift), or non-finding | Classification rule is explicit; every non-finding in the raw grep sweep is justified (e.g., "MCP tool name — out of scope per spec.md §3") |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | For each P0 finding, propose a remediation: `delete`, `migrate-to-canonical-doc`, `keep-with-justified-compat-comment` | Each remediation names the specific file change required (delete this function, replace this write with a content-router call, add this comment). No hand-wave "investigate later" |
| REQ-006 | For each P1 doc mismatch, propose either a doc correction or a runtime change | If runtime is the source of truth, doc gets corrected; if doc intent is correct, runtime path gets marked for removal (routes REQ-005 work items) |
| REQ-007 | Verify whether the vector index DB (`memory_index` table) depends on `memory/*.md` file paths as primary keys, or can tolerate canonical-doc-only records | Dashboard captures: (a) current rows pointing at `memory/*.md`, (b) current rows pointing at `spec.md`/`plan.md`/etc., (c) whether FK/constraint forces the legacy path |
| REQ-008 | Confirm whether `/spec_kit:resume` and the retrieval pipeline (`memory_search`, `memory_context`) can serve continuity recovery with canonical docs alone, or require `memory/*.md` entries | Answer with evidence: quoted code path in `resume-ladder.ts` + `memory_search` query shape |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deep-review converges (dimensions NFR score → 0 across iterations) OR reaches 10 iterations with explicit unresolved-items list
- **SC-002**: `review/review-report.md` includes inventory tables for write paths, read paths, doc claims, and classification; each row has path + line + severity + proposed remediation
- **SC-003**: Zero false positives — every "non-finding" is explicitly justified per the out-of-scope list in §3
- **SC-004**: The final report answers the core question unambiguously: *"Is `[spec]/memory/*.md` truly retired in the runtime, or is the system in a half-migrated state?"* — with quoted evidence
- **SC-005**: If half-migrated: the report proposes ONE of two paths (runtime cleanup OR doc walk-back) with the specific file/LOC estimates for each
- **SC-006**: If the audit surfaces new risks (e.g., DB rows pointing at deleted memory/*.md, search pipeline regression on canonical-doc-only retrieval), those risks are elevated to open questions in the report

### Acceptance Scenarios

1. **Given** the audit converges on 5 iterations, **when** the report is synthesized, **then** it lists ≥1 P0 write site (at minimum `workflow.ts` Step 9 path) and explains the gap between doc claim and runtime behavior.
2. **Given** the audit finds the DB schema has a FK on `memory_index.filePath` tied to memory/*.md paths, **when** REQ-007 is answered, **then** the report flags a P0 migration-blocker and recommends a schema change before any runtime deletion.
3. **Given** the audit finds that `/spec_kit:resume` reads handover.md first and `memory/*.md` never, **when** REQ-008 is answered, **then** the report recommends that memory/*.md write path can be removed without touching resume behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Audit misses indirect memory/*.md dependencies (e.g., tests, CI, post-save hooks) | Follow-up cleanup leaves hidden regressions | Include test fixtures + telemetry/monitoring paths in audit scope; require every finding to cite a real code/doc quote |
| Risk | Audit returns false positives (MCP tool names, frontmatter keys) | Report becomes noise | Explicit out-of-scope list in §3 + classification rule in REQ-004; iteration cleanup enforces justification |
| Risk | Deep-review CLI executor (cli-codex gpt-5.4-high) returns rate-limit errors mid-run | Incomplete iterations | Fallback to cli-copilot configured at workflow level; partial results still produce an inventory, iteration state is externalized so resumable |
| Risk | Convergence never reached because the audit surface is too large | All 10 iterations consumed, report still partial | 10-iteration cap is acceptable; final report explicitly lists any uncovered areas |
| Dependency | `/spec_kit:deep-review:auto` command + `@deep-review` agent | Required for the audit loop | Already present in this runtime |
| Dependency | cli-codex runtime + gpt-5.4-high model + fast-mode flag | Per-iteration executor | cli-codex skill mounted; if unavailable, fall back to cli-copilot |
| Dependency | Grep / Glob over the system-spec-kit tree | Core tool for reference discovery | Ripgrep available via Grep tool |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit completes in ≤ 10 iterations OR surfaces convergence early (3–5 iterations is expected for a focused grep-based audit)
- **NFR-P02**: Each iteration completes in ≤ 5 minutes under cli-codex gpt-5.4-high fast mode

### Integrity
- **NFR-I01**: Every finding cites a file path + line number + quoted text
- **NFR-I02**: Every non-finding is explicitly justified per §3 out-of-scope rules
- **NFR-I03**: The final `review-report.md` is self-contained — a reader who has never seen this session can read it and act on it
- **NFR-I04**: Audit does not modify the code or docs being audited — it is read-only (writes only go to `review/iterations/*.md` and `review/review-report.md`)

### Reliability
- **NFR-R01**: Iteration state externalized to `review/deep-review-state.jsonl` and `review/deep-review-strategy.md` so interruptions are resumable
- **NFR-R02**: If cli-codex fails mid-iteration, the dispatcher falls back to cli-copilot without losing iteration context

### Quality
- **NFR-Q01**: Findings classified into P0/P1/P2/non-finding — no "unknown severity"
- **NFR-Q02**: Each P0/P1 finding comes with a concrete remediation recommendation
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Boundary cases
- String `memory/` appears in import paths like `from '../memory/save.md'` — VALID (command namespace, not folder ref)
- String `memory/` in `generate-context.js --output [spec]/memory/*.md` — STALE write path (P0)
- String `memory/*.md` in a code comment describing deprecated behavior — DOC DRIFT (P1) unless comment is explicitly labeled as legacy/historical
- `_memory` (underscore prefix) — distinct from `memory/` folder — non-finding per §3

### State transitions
- Code currently writes memory/*.md AND indexes it → REQ-001 finding + REQ-007 DB migration risk
- Doc says "retired" but runtime writes → REQ-003 P1 finding + REQ-006 reconciliation path
- Doc correctly describes runtime but writes to memory/*.md → only REQ-001 P0, no doc mismatch

### Ambiguous patterns
- `memory_*` (with underscore) in MCP tool names — VALID per §3 out-of-scope
- `[spec]/memory/` used in a template example — STALE if the template is recommending use, VALID if shown as "legacy format being deprecated"
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Audit-only; read-only; narrow to system-spec-kit tree |
| Risk | 12/25 | Findings may surface DB migration blockers; audit itself is low risk |
| Research | 15/20 | Requires close reading of 30+ TS/MD files, classification discipline, and DB/runtime understanding |
| **Total** | **37/70** | **Level 2** — Audit packet with deep-review iteration loop |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Is the vector-index DB's `memory_index.filePath` column tolerant of canonical-doc paths (e.g., `specs/.../spec.md`) or is it keyed on `memory/*.md`-shaped paths?
- Does `/spec_kit:resume`'s recovery ladder ever fall through to `[spec]/memory/*.md` content, or does it stop at canonical docs + `_memory.continuity`?
- Are there tests that assert the **existence** of `[spec]/memory/*.md` files after save — and if so, are they correct per v3.4.0.0 or stale?

<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC — Memory Folder Deprecation Audit
- Read-only audit; findings drive follow-up remediation packet
- Deep-review loop, 10 iterations max, cli-codex gpt-5.4-high fast mode (cli-copilot fallback)
- Converges when inventory is complete and every finding has severity + remediation
-->
