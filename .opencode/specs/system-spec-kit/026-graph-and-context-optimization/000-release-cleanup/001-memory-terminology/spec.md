---
title: "Feature Specification: Memory→Behavioral Phrasing Audit [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology/spec]"
description: "Phrasing pass across user-visible surfaces. Where docs say 'memories' / 'load recent memories' / 'save your memory', replace with concrete behavioral language that names what the system actually loads, saves, and retrieves (spec-doc records, indexed continuity, constitutional rules, packet folders). No command names, no MCP tool names, no SQL tables, no frontmatter keys, no behavior changes — pure phrasing across markdown docs, MCP tool description strings, and runtime output messages."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->"
trigger_phrases:
  - "memory phrasing audit"
  - "load recent memories rephrase"
  - "memory documentation cleanup"
  - "behavioral language pass"
  - "spec doc phrasing"
  - "tool description phrasing"
  - "runtime output specificity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/001-memory-terminology"
    last_updated_at: "2026-04-27T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Retroactively authored Level 3 spec docs (plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) after all 9 PRs shipped across 6 main commits; upgraded template_source_hint from level2-verify to level3-verify to match actual scope (~600 edits, 250+ files, deep-review PASS hasAdvisories=true)"
    next_safe_action: "Validate via scripts/spec/validate.sh --strict; commit + push retroactive docs; packet then in fully ship-ready state"
    blockers: []
    key_files:
      - "spec.md"
      - "phrasing-audit.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:phrasing-audit-shipped-retroactive-docs-2026-04-27"
      session_id: "001-memory-terminology-retroactive-docs-2026-04-27"
      parent_session_id: "001-memory-terminology-phrasing-pivot-2026-04-26"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q: Rename or rephrase? A: Rephrase only (REQ-001 freeze list)."
      - "Q: How to handle cognitive loanwords? A: Preserve verbatim (REQ-007 carve-out)."
      - "Q: Q4 setup-prompt label? A: 'Prior Work Context' (operator's mental model)."
      - "Q: gate-tool-routing.md indexing? A: Manual-fallback mode with anchors + Code References."
      - "Q: skill_id mismatch fix? A: Rename metadata, not folder."
---
# Feature Specification: Memory→Behavioral Phrasing Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-26 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../../spec.md` |
| **Predecessor** | `../001-release-cleanup-playbooks/spec.md` |
| **Successor** | `../002-sk-code-opencode-alignment/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

User-facing prose across READMEs, skill docs, MCP tool descriptions, and runtime output strings overuses the abstract noun "memory / memories" where a concrete behavioral noun would be clearer. Concrete examples that already ship today:

- `SKILL.md:623` — "FSRS v4 power-law model; recent **memories** rank higher" — what's a memory? An indexed spec-doc record. Reader has to guess.
- `references/debugging/troubleshooting.md:237` — "// List recent **memories**" — list what?
- `references/validation/decision_format.md:281` — "Loaded 3 **memories**" — loaded which 3? From where?
- `feature_catalog/feature_catalog.md:905` — "the web of connections between **your memories**" + "memories are linked together" + "memories are isolated" + "your memories" — four abstract uses in one paragraph.
- `tool-schemas.ts:48` (`memory_context` description) — "START HERE for most **memory operations**" — sent to AI agents on every tool list; the agent has to infer what "memory operations" means.

The result: new contributors (and AI agents reading tool descriptions) cannot reliably predict what each tool/doc operates on. The recent deep-research pivot (archived under `research_archive/rename-pivot-2026-04-26-pt-01/`) confirmed the problem but over-scoped the fix to a code+command+key rename. **This packet narrows the fix to phrasing only.**

### Purpose

Replace abstract "memory/memories" prose with concrete behavioral nouns that name *what the system actually loads, saves, and retrieves* — across the three user-visible surface classes (markdown prose, MCP tool descriptions, runtime output strings) — without renaming any command, tool, frontmatter key, table, file, or folder. Behavior, schemas, and APIs stay identical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Three surface classes, all user-visible:

- **(A) Markdown prose** — `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `ENV_REFERENCE.md`, `ARCHITECTURE.md`, `references/**/*.md`, `constitutional/README.md`, `feature_catalog/**/*.md`, `manual_testing_playbook/**/*.md`, slash-command bodies in `.opencode/command/memory/*.md`, agent definitions in `.claude/agents/*.md` and `.opencode/agent/*.md`, `CLAUDE.md`, `AGENTS.md`, `AGENTS_Barter.md`, `AGENTS_example_fs_enterprises.md`. ~30–60 files affected.
- **(B1) MCP tool description strings** — the `description:` fields inside `mcp_server/tool-schemas.ts` (sent to AI agents at tool-list time; functionally documentation that lives in code). 21 tools have description strings; ~10 contain the abstract "memory" noun in user-misleading ways.
- **(B2) Runtime output strings** — formatter messages in `mcp_server/handlers/memory-*.ts` and `mcp_server/lib/.../formatters/*.ts` that produce text the user sees when a tool runs. Example: when `memory_context` returns "Loaded 3 memories", the message should name the 3 spec docs / packets it actually loaded.

### Out of Scope

- **Tool, command, frontmatter, table, file, and folder names** — `memory_search`, `memory_save`, `/memory:save`, `/memory:learn`, `_memory.continuity`, `memory_index` SQL table, `memory-search.ts` handler files, `references/memory/` folder, `scripts/dist/memory/` folder — all stay exactly as-is. The prior research output (archived) recommended a rename; the user explicitly scoped that out.
- Behavior, schema, and retrieval-algorithm changes.
- Parser-fallback infrastructure, deprecation alias matrices, glossary lint validators, pre-commit hooks. The prior research output produced a 4-PR plan optimized for a rename — none of that ships.
- The `.opencode/specs/**/*.md` historical corpus (1,916 files using `_memory:` frontmatter). Frontmatter keys are out of scope, so the corpus is untouched.
- The `mcp_server/lib/cognitive/` subsystem identifiers (Miller's-Law `working_memory` table, FSRS `*_memory_*` constants, Collins-Loftus spreading-activation terms). These are cited cognitive-science literature, not project jargon, and stay verbatim. Doc-strings inside `cognitive/` that reference *spec-kit rows passed in as parameters* (not literature) MAY be re-phrased — see phrasing-audit.md §6.

### Files to Change (by surface)

| Surface | Targets | Rough count | Change type |
|---------|---------|-------------|-------------|
| (A) Skill markdown | SKILL.md, top-level READMEs (4), `references/**/*.md` (20+), `constitutional/README.md`, `feature_catalog/**/*.md` (35+), `manual_testing_playbook/**/*.md`, slash-command bodies (4) | ~60 files; ~150–250 phrase replacements | Modify in place |
| (A) Cross-cutting markdown | CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md | 4 files; ~10–20 replacements | Modify in place (synced triad must commit together; AGENTS_Barter.md is cross-repo symlink) |
| (A) Agent definitions | `.claude/agents/*.md`, `.opencode/agent/*.md` | ~16 files; ~10–20 replacements | Modify in place |
| (B1) Tool descriptions | `mcp_server/tool-schemas.ts` `description:` fields | 1 file; ~21 description strings, ~10 needing edits | Modify in place |
| (B2) Runtime outputs | `mcp_server/handlers/memory-*.ts` formatter messages, `mcp_server/lib/.../formatters/*.ts` | ~5–10 files; format-string edits | Modify in place |

The complete current→proposed phrase grid lives in **phrasing-audit.md** (sibling of this spec). That grid is the implementation phase's working document.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No tool / command / frontmatter / table / file / folder identifiers change. | `git diff` shows zero edits to identifier strings inside `tool-schemas.ts` `name:` fields, `.opencode/command/memory/` folder name and command-frontmatter `name:` fields, `_memory:` YAML keys in any frontmatter, SQL table CREATE statements, handler filenames, `references/memory/` and `scripts/dist/memory/` folder names. |
| REQ-002 | Every MCP tool's `description:` string in `tool-schemas.ts` names the surface it operates on (spec docs / packet / continuity / constitutional rules / etc.) instead of using "memory" as the bare noun. | Reader of any tool's description can correctly answer "what does this tool read or write?" with a concrete file/store/category, not just "memory". |
| REQ-003 | Runtime output messages from MCP tool handlers name specific spec folders, files, or counts when applicable. "Loaded 3 memories" becomes "Loaded 3 spec-doc records: implementation-summary.md from packet A, decision-record.md from packet B, …" or equivalent. | When `memory_context()` / `memory_search()` / `memory_save()` returns successfully, its output contains at least one of: a packet path, a doc filename, an explicit record count + source folder. |
| REQ-004 | All "your memories" / "your memory" / "the memory" / "a memory" abstract phrasings in `.md` prose are replaced with concrete behavioral language. Verified by grep. | `grep -niE "(your|the|a|an|each|every)\s+memor(y\|ies)" .opencode/skill/system-spec-kit/**/*.md CLAUDE.md AGENTS.md` returns zero matches outside cognitive-literature contexts (`cognitive/README.md` Miller's-Law / FSRS quotes are exempt). |
| REQ-005 | One-paragraph Anthropic disambiguation callout ships in (a) the top-level `system-spec-kit/README.md` §1 OVERVIEW and (b) the `mcp_server/README.md` §1 OVERVIEW. The callout names both Anthropic's Claude Memory tool AND the official MCP reference `memory` server (per archived deep-research finding). | Both READMEs contain a sentence beginning "Note:" that names both Anthropic Claude Memory and the MCP reference `memory` server. |
| REQ-006 | The synced top-doc triad rule from MEMORY.md applies — any phrasing edits to `AGENTS.md` co-modify `AGENTS_Barter.md` (cross-repo symlink — commits in BOTH repos) and `AGENTS_example_fs_enterprises.md`. | Commit history shows triad parity for every PR that touches `AGENTS.md` phrasing. |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `mcp_server/lib/cognitive/` doc-strings that reference *spec-kit rows passed as parameters* (not Miller's-Law / FSRS literature) are re-phrased to "spec-doc record" or equivalent. JSDoc only; no code-symbol changes. | ~10 doc-line edits across `fsrs-scheduler.ts`, `prediction-error-gate.ts`, `temporal-contiguity.ts`, `adaptive-ranking.ts`. The cognitive-literature loanwords (`working_memory`, FSRS constants, spreading-activation terms) stay verbatim. |
| REQ-008 | `feature_catalog/feature_catalog.md` (highest-density abstract-memory surface) and `manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` get a focused phrasing pass. | The 4 paragraphs at `feature_catalog/feature_catalog.md:905, 2663, 3362, 4208` each name what's actually being saved/connected/fingerprinted instead of using "your memories". Playbook scenario steps name specific spec docs / packets. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new contributor reading SKILL.md + the four `/memory:*` slash-command bodies + the top-level READMEs can correctly predict what each command writes to and what each MCP tool reads from, without consulting source code.
- **SC-002**: AI agents reading tool descriptions in `tool-schemas.ts` get a concrete behavioral statement per tool (no agent-side ambiguity about "memory operations").
- **SC-003**: Runtime tool outputs include at least one specific reference (packet path, doc filename, or named-source count) whenever they describe what was loaded / saved / retrieved.
- **SC-004**: A reader who already uses Anthropic's Claude Memory tool or the MCP reference `memory` server cannot mistake Spec Kit Memory for either, after reading the top-level README.
- **SC-005**: No identifier in `tool-schemas.ts` `name:` fields, frontmatter keys, SQL tables, command names, or handler filenames is touched. Zero rename PRs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Edits to `feature_catalog/feature_catalog.md:905, 2663, 3362, 4208` are dense; easy to drift into rewriting whole paragraphs and lose the original technical content. | Medium | Use phrasing-audit.md as the working diff target; constrain replacements to the abstract noun, preserve the surrounding sentence structure. |
| Risk | Runtime output edits in `mcp_server/handlers/memory-*.ts` formatter messages may break snapshot tests in `mcp_server/tests/`. | Medium | Run `vitest` on every formatter touch; update snapshots in the same commit; the formatter changes are deterministic so snapshot updates are mechanical. |
| Risk | Synced top-doc triad cross-repo symlink (`AGENTS_Barter.md` → separate Barter repo) — partial commit if author forgets the cross-repo step. | High | Same MEMORY.md sync rule from the archived deep research applies. Commits to `AGENTS.md` MUST be paired with commits to `AGENTS_Barter.md` in the Barter repo. |
| Risk | Cognitive-literature loanwords (`working_memory` SQL table comments, FSRS doc-strings, Collins-Loftus spreading-activation terms) get mistakenly softened; original literature provenance is lost. | Low | REQ-007 explicitly carves these out. The phrasing-audit.md §6 lists every cognitive-subsystem identifier that must NOT be touched. |
| Dependency | Parent 026 phase map slot `000-release-cleanup` and predecessor `001-release-cleanup-playbooks` (closed Phase 5). | Low | This packet consumes slot `002` of `000-release-cleanup`; both prior siblings are immutable. |
<!-- /ANCHOR:risks -->

---

### Acceptance Scenarios

**Given** a new contributor reads SKILL.md once, **when** they encounter the phrase that previously said "recent memories rank higher", **then** they correctly predict the system ranks recent indexed spec-doc records (or the equivalent concrete noun) higher.

**Given** an AI agent lists available MCP tools, **when** it reads `memory_search`'s `description:` string, **then** the description names the corpus searched (indexed spec docs + constitutional rules) rather than "conversation memories".

**Given** an operator runs `memory_context()`, **when** the tool returns successfully, **then** the response message names the actual packets / docs that were loaded (e.g., "Loaded 3 spec-doc records from packets `026-...` and `023-...`") rather than "Loaded 3 memories".

**Given** a reader who knows Anthropic's Claude Memory tool reads `system-spec-kit/README.md`, **when** they reach §1 OVERVIEW, **then** a one-paragraph callout disambiguates Spec Kit Memory from both Anthropic's tool and the MCP reference `memory` server.

**Given** a phrasing-edit PR touches `AGENTS.md`, **when** the PR is reviewed, **then** matching commits exist in `AGENTS_Barter.md` (in the Barter repo) and `AGENTS_example_fs_enterprises.md`.

**Given** a phrasing-edit PR touches `mcp_server/handlers/memory-context.ts` formatter messages, **when** `npm run test` runs, **then** updated snapshot fixtures pass.

**Given** the entire phrasing-audit pass is complete, **when** `git log --oneline` is reviewed, **then** zero commits rename any `memory_*` tool, `/memory:*` command, `_memory:` frontmatter key, `memory_*` SQL table, `memory-*.ts` handler, or `memory/` folder.

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: PR sequencing — do we ship as one big phrasing-audit PR, or split into three (one per surface class: A markdown prose / B1 tool descriptions / B2 runtime outputs)? Splitting trades reviewability for atomicity. Recommend three PRs.
- **Q2**: Should slash-command body text (the `.md` files at `.opencode/command/memory/*.md`) be re-phrased even though the command names stay `/memory:*`? Recommend yes — body text is `(A) markdown prose` per the scope; the *name* in the YAML frontmatter `name:` field stays.
- **Q3**: For `feature_catalog/feature_catalog.md:905, 2663, 3362, 4208` — do we re-phrase in place, or is this catalog auto-generated from another source? Need to verify before edits.
- **Q4**: Runtime output strings (B2) — are any of these already in user-facing telemetry / logging that downstream tools parse? If so, we may need to keep the exact string format and only enrich the human-readable parts. Need a one-pass audit of formatter call sites before editing.

These are implementation-phase questions, not research questions. The phrasing decisions themselves are settled in `phrasing-audit.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **`phrasing-audit.md`** (sibling of this spec) — the concrete current→proposed phrase grid; the implementation phase's working diff target.
- **Archived prior research** (`research_archive/rename-pivot-2026-04-26-pt-01/`) — 10 iterations of `/spec_kit:deep-research` scoped for a code+command+key rename; substrate (6-layer concept model, 21-tool inventory, Anthropic + MCP-registry collision analysis) is still useful but the recommendations (rename, alias matrix, parser-fallback, glossary-lint, 4-PR plan) are out-of-scope per the user's pivot. Kept for reference only.
- **Predecessor**: `../001-release-cleanup-playbooks/spec.md` (closed Phase 5).
- **Companion artifacts** (deferred): plan.md / tasks.md / checklist.md / implementation-summary.md created post-review of phrasing-audit.md.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:nfr -->
