---
title: Deep Research Strategy — Memory Terminology Rename
description: Session strategy tracking research progress, focus decisions, and outcomes across iterations for the system-spec-kit memory→spec-doc-continuity terminology rename.
---

# Deep Research Strategy — Memory Terminology Rename

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent brain for the deep-research session converging on the spec.md §12 open questions Q1–Q7 (single rename vs per-layer naming, deprecation alias window, SQL table rename scope, `_memory.continuity` migration path, glossary lint rule, Anthropic Claude Memory positioning callout, FSRS-loanword carve-outs).

### Usage

- **Init:** Orchestrator copied this template to `research/002-memory-terminology-pt-01/deep-research-strategy.md` and populated topic + key questions from spec.md §12 + Phase 1 inventory data already in conversation context.
- **Per iteration:** @deep-research reads Next Focus, runs 3–5 research actions (WebFetch + Grep + Read + memory_search), writes iteration-NNN.md. Reducer refreshes machine-owned sections.
- **Mutability:** Mutable. Analyst-owned sections (Topic, Non-goals, Stop conditions, Known Context, Research Boundaries) stable; reducer rewrites Sections 3, 6, 7–11.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Memory terminology rename across system-spec-kit. The word "memory" overloads six distinct concept layers (SQLite + embeddings index, canonical spec-doc markdown, generated metadata, session resume surfaces, hybrid retrieval pipeline, constitutional rules) and creates ~270+ inconsistent references plus a future naming clash with Anthropic's Claude Memory tool. Goal: converge on a precise layer-aware vocabulary, an alias migration plan, and a glossary contract — without changing any behavior, schema, or retrieval algorithm.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Should the new top-level concept name be a single word (e.g., "continuity", "context", "knowledge", "spec-doc") or per-layer naming (e.g., `continuity_*` for retrieval tools, `spec_doc_*` for markdown ops, `metadata_*` for generated files)?
- [ ] Q2: How long should the deprecation alias window run — one release, two, or forever for `_memory.continuity` (since changing it would invalidate every existing implementation-summary doc)?
- [ ] Q3: Do we rename SQL table names (large migration risk, external-tool blast radius) or stop the rename at the public-API surface (tool names, command names, doc strings)?
- [ ] Q4: Does the `_memory.continuity` YAML key get renamed in-frontmatter, or do we add a synonym alias and migrate gradually via parser fallback?
- [ ] Q5: How do we prevent future drift — a glossary doc, a contract doc, a lint rule, or all three?
- [ ] Q6: Is a marketing or positioning callout in our READMEs needed to disambiguate from Anthropic's Claude Memory tool, and if so where?
- [ ] Q7: How does the rename interact with FSRS "memory state" and "working memory" — are these cognitive-science loanwords that should retain "memory" because the literature uses it, or do we pick a non-clashing alternative?
- [ ] Q8 (derived): What is the canonical *concept-layer mapping* — one term per layer — that the rename must preserve as REQ-001 mandates?
- [ ] Q9 (derived): Which legacy `memory_*` MCP tool names have hard-coded external integrations that *must* keep aliases beyond a one-release window?
- [ ] Q10 (derived): Is there an existing precedent in the OSS ecosystem (LangChain, LlamaIndex, MCP servers, Cursor, etc.) for layered "memory" vocabularies we can borrow without re-inventing?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Behavior, schema, or retrieval-algorithm changes (REQ baseline holds: pure rename + alias).
- New feature work in any of the six concept layers.
- Renaming the parent `026-graph-and-context-optimization` phase folder.
- Rewriting historical spec-folder docs in `.opencode/specs/**`; the rename is forward-only.
- Choosing the exact replacement strings during research; the spec wants a *framework* (axes, trade-offs, decision criteria) so the implementation phase can pick names with reviewer sign-off.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- 10 iterations reached (hard cap from config.maxIterations).
- All 10 key questions answered with cited evidence (REQ-001 layer mapping + Q1–Q7 + Q8–Q10 derived).
- Composite convergence STOP: rolling-avg newInfoRatio < 0.05 over 3+ evidence iterations AND graph_decision == STOP_ALLOWED.
- 3 consecutive iterations with newInfoRatio < 0.05 trigger stuck recovery.
- Research charter override: if Q1's framework decision is reached and Q2–Q10 collapse to derivable corollaries, allow early STOP with quality-guard sign-off.

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **5 conditional identifiers listed only by file (not line)** — PR3 author needs paste-ready precision; iter-4 captured exact line numbers -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **5 conditional identifiers listed only by file (not line)** — PR3 author needs paste-ready precision; iter-4 captured exact line numbers
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **5 conditional identifiers listed only by file (not line)** — PR3 author needs paste-ready precision; iter-4 captured exact line numbers

### **A "find new contradiction" pass** — none exist; honest call closed. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A "find new contradiction" pass** — none exist; honest call closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A "find new contradiction" pass** — none exist; honest call closed.

### **Adding `opencode.json` or `.utcp_config.json` to the rename surface** — zero tool-name quotes; configs are alias-neutral. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Adding `opencode.json` or `.utcp_config.json` to the rename surface** — zero tool-name quotes; configs are alias-neutral.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding `opencode.json` or `.utcp_config.json` to the rename surface** — zero tool-name quotes; configs are alias-neutral.

### **Adding the Anthropic-disambiguation callout to every README in the system (1+5+ surfaces)** — finding 3 shows different audiences for whom brand positioning is out of scope. Three targeted surfaces is the right granularity. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Adding the Anthropic-disambiguation callout to every README in the system (1+5+ surfaces)** — finding 3 shows different audiences for whom brand positioning is out of scope. Three targeted surfaces is the right granularity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding the Anthropic-disambiguation callout to every README in the system (1+5+ surfaces)** — finding 3 shows different audiences for whom brand positioning is out of scope. Three targeted surfaces is the right granularity.

### **Adopting an existing glossary or terminology doc as the rename's vocabulary contract** — finding 6 shows zero glossary/terminology/vocabulary docs exist in the repo. The rename must scaffold this artifact greenfield. Any plan that assumes a "drop a section into existing glossary.md" approach is mechanically impossible. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Adopting an existing glossary or terminology doc as the rename's vocabulary contract** — finding 6 shows zero glossary/terminology/vocabulary docs exist in the repo. The rename must scaffold this artifact greenfield. Any plan that assumes a "drop a section into existing glossary.md" approach is mechanically impossible. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adopting an existing glossary or terminology doc as the rename's vocabulary contract** — finding 6 shows zero glossary/terminology/vocabulary docs exist in the repo. The rename must scaffold this artifact greenfield. Any plan that assumes a "drop a section into existing glossary.md" approach is mechanically impossible. (iteration 3)

### **Borrowing LangChain's `Conversation*Memory` flat-suffix pattern** — LangChain itself dissolved this namespace. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Borrowing LangChain's `Conversation*Memory` flat-suffix pattern** — LangChain itself dissolved this namespace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Borrowing LangChain's `Conversation*Memory` flat-suffix pattern** — LangChain itself dissolved this namespace.

### **Borrowing Letta's `core/recall/archival` tier names directly** — Letta retains "memory" suffix because they don't have Anthropic-collision pressure. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Borrowing Letta's `core/recall/archival` tier names directly** — Letta retains "memory" suffix because they don't have Anthropic-collision pressure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Borrowing Letta's `core/recall/archival` tier names directly** — Letta retains "memory" suffix because they don't have Anthropic-collision pressure.

### **Building a TypeScript AST-aware vocabulary linter as the FIRST enforcement mechanism** — finding 7 shows the project has zero current vocabulary enforcement, and the existing `validate.sh` ecosystem is built around regex-based markdown linters (continuity-freshness, evidence-marker, spec-doc-structure). A regex-based `glossary-drift-lint.ts` aligns with existing patterns. AST-aware linting is a future upgrade path, not an MVP requirement. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Building a TypeScript AST-aware vocabulary linter as the FIRST enforcement mechanism** — finding 7 shows the project has zero current vocabulary enforcement, and the existing `validate.sh` ecosystem is built around regex-based markdown linters (continuity-freshness, evidence-marker, spec-doc-structure). A regex-based `glossary-drift-lint.ts` aligns with existing patterns. AST-aware linting is a future upgrade path, not an MVP requirement. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Building a TypeScript AST-aware vocabulary linter as the FIRST enforcement mechanism** — finding 7 shows the project has zero current vocabulary enforcement, and the existing `validate.sh` ecosystem is built around regex-based markdown linters (continuity-freshness, evidence-marker, spec-doc-structure). A regex-based `glossary-drift-lint.ts` aligns with existing patterns. AST-aware linting is a future upgrade path, not an MVP requirement. (iteration 3)

### **Coupling the cognitive-subsystem rename to the L1 SQL-table rename without explicit operator decision** — finding 6 row 9 (`memory_id` FK) and finding 8 multiple parameter-name decisions show ~5 cognitive-subsystem identifiers depend on L1 verdict. Iter-3 already concluded L1 stays `memory_*`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Coupling the cognitive-subsystem rename to the L1 SQL-table rename without explicit operator decision** — finding 6 row 9 (`memory_id` FK) and finding 8 multiple parameter-name decisions show ~5 cognitive-subsystem identifiers depend on L1 verdict. Iter-3 already concluded L1 stays `memory_*`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Coupling the cognitive-subsystem rename to the L1 SQL-table rename without explicit operator decision** — finding 6 row 9 (`memory_id` FK) and finding 8 multiple parameter-name decisions show ~5 cognitive-subsystem identifiers depend on L1 verdict. Iter-3 already concluded L1 stays `memory_*`.

### **Defensive callout in §0 omitting the MCP reference server** — iter-5 #3 explicitly required mentioning BOTH Anthropic Claude Memory AND MCP reference `memory` server -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Defensive callout in §0 omitting the MCP reference server** — iter-5 #3 explicitly required mentioning BOTH Anthropic Claude Memory AND MCP reference `memory` server
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Defensive callout in §0 omitting the MCP reference server** — iter-5 #3 explicitly required mentioning BOTH Anthropic Claude Memory AND MCP reference `memory` server

### **Driving alias decisions from `opencode.json`/`.utcp_config.json` config presence** — finding 2 shows configs quote zero of the 21 tools by name, so configs cannot be a forcing function. (iteration 2) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Driving alias decisions from `opencode.json`/`.utcp_config.json` config presence** — finding 2 shows configs quote zero of the 21 tools by name, so configs cannot be a forcing function. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Driving alias decisions from `opencode.json`/`.utcp_config.json` config presence** — finding 2 shows configs quote zero of the 21 tools by name, so configs cannot be a forcing function. (iteration 2)

### **Editing `AGENTS_Barter.md` in this repo only** — R4 cross-repo symlink violation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Editing `AGENTS_Barter.md` in this repo only** — R4 cross-repo symlink violation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Editing `AGENTS_Barter.md` in this repo only** — R4 cross-repo symlink violation.

### **Forced batch-migration of all 1,916 in-corpus `_memory:` frontmatter files** — parser-fallback dominates; optional `npm run migrate:continuity-key` is a future cleanup. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Forced batch-migration of all 1,916 in-corpus `_memory:` frontmatter files** — parser-fallback dominates; optional `npm run migrate:continuity-key` is a future cleanup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Forced batch-migration of all 1,916 in-corpus `_memory:` frontmatter files** — parser-fallback dominates; optional `npm run migrate:continuity-key` is a future cleanup.

### **Glossary lint with no allowlist** — historical spec docs would all fail; allowlist for `.opencode/specs/**` and the glossary itself is required -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Glossary lint with no allowlist** — historical spec docs would all fail; allowlist for `.opencode/specs/**` and the glossary itself is required
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Glossary lint with no allowlist** — historical spec docs would all fail; allowlist for `.opencode/specs/**` and the glossary itself is required

### **Hard-rename of `_memory.continuity` in-frontmatter as the primary migration path** — finding 4 + finding 5 show the migration corpus is 1,916 files (5.7× the spec.md §3 estimate) and parser-fallback's mechanical work is strictly less than the hard-rename's. Hard-rename remains a SECONDARY option for the optional `npm run migrate:continuity-key` cleanup, but the primary path is parser-fallback. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Hard-rename of `_memory.continuity` in-frontmatter as the primary migration path** — finding 4 + finding 5 show the migration corpus is 1,916 files (5.7× the spec.md §3 estimate) and parser-fallback's mechanical work is strictly less than the hard-rename's. Hard-rename remains a SECONDARY option for the optional `npm run migrate:continuity-key` cleanup, but the primary path is parser-fallback. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hard-rename of `_memory.continuity` in-frontmatter as the primary migration path** — finding 4 + finding 5 show the migration corpus is 1,916 files (5.7× the spec.md §3 estimate) and parser-fallback's mechanical work is strictly less than the hard-rename's. Hard-rename remains a SECONDARY option for the optional `npm run migrate:continuity-key` cleanup, but the primary path is parser-fallback. (iteration 3)

### **Lint allowlist as a single regex** — separate allowlists per rule give clearer per-rule semantics -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Lint allowlist as a single regex** — separate allowlists per rule give clearer per-rule semantics
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lint allowlist as a single regex** — separate allowlists per rule give clearer per-rule semantics

### **Looking for a single canonical layered "memory" taxonomy in the OSS ecosystem** — ecosystem fragments along three orthogonal axes; no single template to copy. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Looking for a single canonical layered "memory" taxonomy in the OSS ecosystem** — ecosystem fragments along three orthogonal axes; no single template to copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a single canonical layered "memory" taxonomy in the OSS ecosystem** — ecosystem fragments along three orthogonal axes; no single template to copy.

### **Looking for cognitive-science vocabulary outside `cognitive/`** — the subsystem is structurally bounded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for cognitive-science vocabulary outside `cognitive/`** — the subsystem is structurally bounded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for cognitive-science vocabulary outside `cognitive/`** — the subsystem is structurally bounded.

### **Parallel PR landing** — linear chain has no parallelism opportunities; each PR depends on the prior. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Parallel PR landing** — linear chain has no parallelism opportunities; each PR depends on the prior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Parallel PR landing** — linear chain has no parallelism opportunities; each PR depends on the prior.

### **Per-layer naming with one new prefix per layer** (Q1's per-layer arm) — finding 7 explains this would inflate the mental load and contradict the practical reality that L2 spec-doc markdown doesn't need a code-prefix at all. Documented as a non-preferred Q1 arm; iteration 2 should sanity-check by enumerating the precise tool list each axis would generate. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Per-layer naming with one new prefix per layer** (Q1's per-layer arm) — finding 7 explains this would inflate the mental load and contradict the practical reality that L2 spec-doc markdown doesn't need a code-prefix at all. Documented as a non-preferred Q1 arm; iteration 2 should sanity-check by enumerating the precise tool list each axis would generate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Per-layer naming with one new prefix per layer** (Q1's per-layer arm) — finding 7 explains this would inflate the mental load and contradict the practical reality that L2 spec-doc markdown doesn't need a code-prefix at all. Documented as a non-preferred Q1 arm; iteration 2 should sanity-check by enumerating the precise tool list each axis would generate.

### **Pre-commit hook hard-failing on `--no-verify`** — Git gives users the bypass; a hard fail is technically impossible. Audit-log warn is the correct posture -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Pre-commit hook hard-failing on `--no-verify`** — Git gives users the bypass; a hard fail is technically impossible. Audit-log warn is the correct posture
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pre-commit hook hard-failing on `--no-verify`** — Git gives users the bypass; a hard fail is technically impossible. Audit-log warn is the correct posture

### **Re-deriving any prior verdict** — all 5 iterations cited primary sources; re-derivation adds no value. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Re-deriving any prior verdict** — all 5 iterations cited primary sources; re-derivation adds no value.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving any prior verdict** — all 5 iterations cited primary sources; re-derivation adds no value.

### **Renaming all `memory`-named identifiers in `cognitive/`** — finding 5 shows the cognitive subsystem self-identifies as the cognitive-science layer. Renaming `working_memory` → `working_continuity` would obscure literature provenance. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Renaming all `memory`-named identifiers in `cognitive/`** — finding 5 shows the cognitive subsystem self-identifies as the cognitive-science layer. Renaming `working_memory` → `working_continuity` would obscure literature provenance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming all `memory`-named identifiers in `cognitive/`** — finding 5 shows the cognitive subsystem self-identifies as the cognitive-science layer. Renaming `working_memory` → `working_continuity` would obscure literature provenance.

### **Renaming SQL tables (Layer 1) under any framing** — iter-1 + iter-2 + iter-5 converge on NO-ACTION. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Renaming SQL tables (Layer 1) under any framing** — iter-1 + iter-2 + iter-5 converge on NO-ACTION.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming SQL tables (Layer 1) under any framing** — iter-1 + iter-2 + iter-5 converge on NO-ACTION.

### **Renaming the SQL table set** (Layer 1) was deprioritized for iteration 1 because finding 1 + finding 6 together show the tables are internal-only. They never appear in `tool-schemas.ts` user-facing identifiers, are mentioned only in `mcp_server/lib/` storage implementation, and have a precedent (V11 `hydra_memory_lineage` → `memory_lineage`) that shows table renames are possible but high-blast-radius. Iteration 1 deliberately defers the Q3 SQL-table decision to iteration 2 with a recommendation: "stop at public-API surface" is the parsimony-favored path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Renaming the SQL table set** (Layer 1) was deprioritized for iteration 1 because finding 1 + finding 6 together show the tables are internal-only. They never appear in `tool-schemas.ts` user-facing identifiers, are mentioned only in `mcp_server/lib/` storage implementation, and have a precedent (V11 `hydra_memory_lineage` → `memory_lineage`) that shows table renames are possible but high-blast-radius. Iteration 1 deliberately defers the Q3 SQL-table decision to iteration 2 with a recommendation: "stop at public-API surface" is the parsimony-favored path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming the SQL table set** (Layer 1) was deprioritized for iteration 1 because finding 1 + finding 6 together show the tables are internal-only. They never appear in `tool-schemas.ts` user-facing identifiers, are mentioned only in `mcp_server/lib/` storage implementation, and have a precedent (V11 `hydra_memory_lineage` → `memory_lineage`) that shows table renames are possible but high-blast-radius. Iteration 1 deliberately defers the Q3 SQL-table decision to iteration 2 with a recommendation: "stop at public-API surface" is the parsimony-favored path.

### **Searching for glossary precedent in `templates/` or `addendum/` template-composition docs** — these folders own template *structure*, not vocabulary contracts. Confirmed by reading SKILL.md §1 Distributed Governance Rule which lists `glossary` zero times among the authored doc types. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Searching for glossary precedent in `templates/` or `addendum/` template-composition docs** — these folders own template *structure*, not vocabulary contracts. Confirmed by reading SKILL.md §1 Distributed Governance Rule which lists `glossary` zero times among the authored doc types.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for glossary precedent in `templates/` or `addendum/` template-composition docs** — these folders own template *structure*, not vocabulary contracts. Confirmed by reading SKILL.md §1 Distributed Governance Rule which lists `glossary` zero times among the authored doc types.

### **Shipping new tool names in PR2 without telemetry** — R2 sequencing violation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Shipping new tool names in PR2 without telemetry** — R2 sequencing violation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shipping new tool names in PR2 without telemetry** — R2 sequencing violation.

### **Single-fixture parser test** — must test BOTH legacy and new forms produce identical output to verify fallback equivalence -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Single-fixture parser test** — must test BOTH legacy and new forms produce identical output to verify fallback equivalence
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Single-fixture parser test** — must test BOTH legacy and new forms produce identical output to verify fallback equivalence

### **Splitting PR1's 6 parser sites across multiple PRs** — R1 atomicity violation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Splitting PR1's 6 parser sites across multiple PRs** — R1 atomicity violation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Splitting PR1's 6 parser sites across multiple PRs** — R1 atomicity violation.

### **Telemetry payload using string union for callContext** without a fallback `'unknown'` value — would lose data when call site can't be resolved -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Telemetry payload using string union for callContext** without a fallback `'unknown'` value — would lose data when call site can't be resolved
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Telemetry payload using string union for callContext** without a fallback `'unknown'` value — would lose data when call site can't be resolved

### **Treating `memory_save` as a T2 because of its a=0 (zero agent-def quotes)** — finding 4 explains save is routed through `/memory:save` slash command, not invoked from agent prose. Top-doc presence (4 hits in triad) + skill-docs intensity (164) + handover hits (4) + the absence of save in agent prose are all consistent with first-class operator-facing tool. T1 assignment confirmed. (iteration 2) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating `memory_save` as a T2 because of its a=0 (zero agent-def quotes)** — finding 4 explains save is routed through `/memory:save` slash command, not invoked from agent prose. Top-doc presence (4 hits in triad) + skill-docs intensity (164) + handover hits (4) + the absence of save in agent prose are all consistent with first-class operator-facing tool. T1 assignment confirmed. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `memory_save` as a T2 because of its a=0 (zero agent-def quotes)** — finding 4 explains save is routed through `/memory:save` slash command, not invoked from agent prose. Top-doc presence (4 hits in triad) + skill-docs intensity (164) + handover hits (4) + the absence of save in agent prose are all consistent with first-class operator-facing tool. T1 assignment confirmed. (iteration 2)

### **Treating Q10 as "validate `continuity_*` against one named precedent"** — survey produced 5 precedents with mixed verdicts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating Q10 as "validate `continuity_*` against one named precedent"** — survey produced 5 precedents with mixed verdicts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating Q10 as "validate `continuity_*` against one named precedent"** — survey produced 5 precedents with mixed verdicts.

### **Treating Q6 as "is there an existing brand-disambiguation paragraph anywhere?"** — finding 1's grep returned zero matches across 8 surfaces; the binary "precedent exists?" framing was the right first move. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating Q6 as "is there an existing brand-disambiguation paragraph anywhere?"** — finding 1's grep returned zero matches across 8 surfaces; the binary "precedent exists?" framing was the right first move.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating Q6 as "is there an existing brand-disambiguation paragraph anywhere?"** — finding 1's grep returned zero matches across 8 surfaces; the binary "precedent exists?" framing was the right first move.

### **Treating Q7 as "rename every `memory` token in `cognitive/`"** — would have produced ~50 rename targets and obscured the literature provenance. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating Q7 as "rename every `memory` token in `cognitive/`"** — would have produced ~50 rename targets and obscured the literature provenance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating Q7 as "rename every `memory` token in `cognitive/`"** — would have produced ~50 rename targets and obscured the literature provenance.

### **Treating the parser-fallback question as "is js-yaml capable of multi-key reads?"** — js-yaml is just a YAML→object parser; "alias support" is purely an application-layer concern. The right framing is "how many literal `'_memory.continuity'` strings are in the TS/JS source?" — answered in finding 1 (5 distinct sites) + finding 3 (one regex-based site). The js-yaml-capability question was a false abstraction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the parser-fallback question as "is js-yaml capable of multi-key reads?"** — js-yaml is just a YAML→object parser; "alias support" is purely an application-layer concern. The right framing is "how many literal `'_memory.continuity'` strings are in the TS/JS source?" — answered in finding 1 (5 distinct sites) + finding 3 (one regex-based site). The js-yaml-capability question was a false abstraction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the parser-fallback question as "is js-yaml capable of multi-key reads?"** — js-yaml is just a YAML→object parser; "alias support" is purely an application-layer concern. The right framing is "how many literal `'_memory.continuity'` strings are in the TS/JS source?" — answered in finding 1 (5 distinct sites) + finding 3 (one regex-based site). The js-yaml-capability question was a false abstraction.

### **Uniform alias window across all 21 tools** — finding 1's bimodal distribution makes a uniform policy strictly dominated. A "1-release window for all" would break runbooks (T1); a "permanent alias for all" would cost 21 deprecation tracks indefinitely. Tier-stratified is unambiguously better. (iteration 2) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Uniform alias window across all 21 tools** — finding 1's bimodal distribution makes a uniform policy strictly dominated. A "1-release window for all" would break runbooks (T1); a "permanent alias for all" would cost 21 deprecation tracks indefinitely. Tier-stratified is unambiguously better. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Uniform alias window across all 21 tools** — finding 1's bimodal distribution makes a uniform policy strictly dominated. A "1-release window for all" would break runbooks (T1); a "permanent alias for all" would cost 21 deprecation tracks indefinitely. Tier-stratified is unambiguously better. (iteration 2)

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Per-layer naming with one new prefix per layer** (Q1's per-layer arm) — finding 7 explains this would inflate the mental load and contradict the practical reality that L2 spec-doc markdown doesn't need a code-prefix at all. Documented as a non-preferred Q1 arm; iteration 2 should sanity-check by enumerating the precise tool list each axis would generate. (iteration 1)
- **Renaming the SQL table set** (Layer 1) was deprioritized for iteration 1 because finding 1 + finding 6 together show the tables are internal-only. They never appear in `tool-schemas.ts` user-facing identifiers, are mentioned only in `mcp_server/lib/` storage implementation, and have a precedent (V11 `hydra_memory_lineage` → `memory_lineage`) that shows table renames are possible but high-blast-radius. Iteration 1 deliberately defers the Q3 SQL-table decision to iteration 2 with a recommendation: "stop at public-API surface" is the parsimony-favored path. (iteration 1)
- **Driving alias decisions from `opencode.json`/`.utcp_config.json` config presence** — finding 2 shows configs quote zero of the 21 tools by name, so configs cannot be a forcing function. (iteration 2) (iteration 2)
- **Treating `memory_save` as a T2 because of its a=0 (zero agent-def quotes)** — finding 4 explains save is routed through `/memory:save` slash command, not invoked from agent prose. Top-doc presence (4 hits in triad) + skill-docs intensity (164) + handover hits (4) + the absence of save in agent prose are all consistent with first-class operator-facing tool. T1 assignment confirmed. (iteration 2) (iteration 2)
- **Uniform alias window across all 21 tools** — finding 1's bimodal distribution makes a uniform policy strictly dominated. A "1-release window for all" would break runbooks (T1); a "permanent alias for all" would cost 21 deprecation tracks indefinitely. Tier-stratified is unambiguously better. (iteration 2) (iteration 2)
- **Adopting an existing glossary or terminology doc as the rename's vocabulary contract** — finding 6 shows zero glossary/terminology/vocabulary docs exist in the repo. The rename must scaffold this artifact greenfield. Any plan that assumes a "drop a section into existing glossary.md" approach is mechanically impossible. (iteration 3) (iteration 3)
- **Building a TypeScript AST-aware vocabulary linter as the FIRST enforcement mechanism** — finding 7 shows the project has zero current vocabulary enforcement, and the existing `validate.sh` ecosystem is built around regex-based markdown linters (continuity-freshness, evidence-marker, spec-doc-structure). A regex-based `glossary-drift-lint.ts` aligns with existing patterns. AST-aware linting is a future upgrade path, not an MVP requirement. (iteration 3) (iteration 3)
- **Hard-rename of `_memory.continuity` in-frontmatter as the primary migration path** — finding 4 + finding 5 show the migration corpus is 1,916 files (5.7× the spec.md §3 estimate) and parser-fallback's mechanical work is strictly less than the hard-rename's. Hard-rename remains a SECONDARY option for the optional `npm run migrate:continuity-key` cleanup, but the primary path is parser-fallback. (iteration 3) (iteration 3)
- **Searching for glossary precedent in `templates/` or `addendum/` template-composition docs** — these folders own template *structure*, not vocabulary contracts. Confirmed by reading SKILL.md §1 Distributed Governance Rule which lists `glossary` zero times among the authored doc types. (iteration 3)
- **Treating the parser-fallback question as "is js-yaml capable of multi-key reads?"** — js-yaml is just a YAML→object parser; "alias support" is purely an application-layer concern. The right framing is "how many literal `'_memory.continuity'` strings are in the TS/JS source?" — answered in finding 1 (5 distinct sites) + finding 3 (one regex-based site). The js-yaml-capability question was a false abstraction. (iteration 3)
- **Adding the Anthropic-disambiguation callout to every README in the system (1+5+ surfaces)** — finding 3 shows different audiences for whom brand positioning is out of scope. Three targeted surfaces is the right granularity. (iteration 4)
- **Coupling the cognitive-subsystem rename to the L1 SQL-table rename without explicit operator decision** — finding 6 row 9 (`memory_id` FK) and finding 8 multiple parameter-name decisions show ~5 cognitive-subsystem identifiers depend on L1 verdict. Iter-3 already concluded L1 stays `memory_*`. (iteration 4)
- **Looking for cognitive-science vocabulary outside `cognitive/`** — the subsystem is structurally bounded. (iteration 4)
- **Renaming all `memory`-named identifiers in `cognitive/`** — finding 5 shows the cognitive subsystem self-identifies as the cognitive-science layer. Renaming `working_memory` → `working_continuity` would obscure literature provenance. (iteration 4)
- **Treating Q6 as "is there an existing brand-disambiguation paragraph anywhere?"** — finding 1's grep returned zero matches across 8 surfaces; the binary "precedent exists?" framing was the right first move. (iteration 4)
- **Treating Q7 as "rename every `memory` token in `cognitive/`"** — would have produced ~50 rename targets and obscured the literature provenance. (iteration 4)
- **Adding `opencode.json` or `.utcp_config.json` to the rename surface** — zero tool-name quotes; configs are alias-neutral. (iteration 5)
- **Borrowing LangChain's `Conversation*Memory` flat-suffix pattern** — LangChain itself dissolved this namespace. (iteration 5)
- **Borrowing Letta's `core/recall/archival` tier names directly** — Letta retains "memory" suffix because they don't have Anthropic-collision pressure. (iteration 5)
- **Forced batch-migration of all 1,916 in-corpus `_memory:` frontmatter files** — parser-fallback dominates; optional `npm run migrate:continuity-key` is a future cleanup. (iteration 5)
- **Looking for a single canonical layered "memory" taxonomy in the OSS ecosystem** — ecosystem fragments along three orthogonal axes; no single template to copy. (iteration 5)
- **Renaming SQL tables (Layer 1) under any framing** — iter-1 + iter-2 + iter-5 converge on NO-ACTION. (iteration 5)
- **Treating Q10 as "validate `continuity_*` against one named precedent"** — survey produced 5 precedents with mixed verdicts. (iteration 5)
- **A "find new contradiction" pass** — none exist; honest call closed. (iteration 6)
- **Re-deriving any prior verdict** — all 5 iterations cited primary sources; re-derivation adds no value. (iteration 6)
- **Editing `AGENTS_Barter.md` in this repo only** — R4 cross-repo symlink violation. (iteration 7)
- **Parallel PR landing** — linear chain has no parallelism opportunities; each PR depends on the prior. (iteration 7)
- **Shipping new tool names in PR2 without telemetry** — R2 sequencing violation. (iteration 7)
- **Splitting PR1's 6 parser sites across multiple PRs** — R1 atomicity violation. (iteration 7)
- **5 conditional identifiers listed only by file (not line)** — PR3 author needs paste-ready precision; iter-4 captured exact line numbers (iteration 8)
- **Defensive callout in §0 omitting the MCP reference server** — iter-5 #3 explicitly required mentioning BOTH Anthropic Claude Memory AND MCP reference `memory` server (iteration 8)
- **Glossary lint with no allowlist** — historical spec docs would all fail; allowlist for `.opencode/specs/**` and the glossary itself is required (iteration 9)
- **Lint allowlist as a single regex** — separate allowlists per rule give clearer per-rule semantics (iteration 9)
- **Pre-commit hook hard-failing on `--no-verify`** — Git gives users the bypass; a hard fail is technically impossible. Audit-log warn is the correct posture (iteration 9)
- **Single-fixture parser test** — must test BOTH legacy and new forms produce identical output to verify fallback equivalence (iteration 9)
- **Telemetry payload using string union for callContext** without a fallback `'unknown'` value — would lose data when call site can't be resolved (iteration 9)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**Synthesis phase** — workflow reducer compiles `research.md` from iter-1..iter-10 deliverables; emits `resource-map.md` from converged deltas; writes the generated-findings fence into spec.md; runs strict-validation. After synthesis, the implementation phase opens PR1 per iter-7's sequencing plan.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

memory_context() at session init returned no directly-matching results for "memory terminology rename system-spec-kit MCP tool naming spec-doc continuity" (`focused` mode, `understand` intent, token budget 3000). Auto-surfaced triggered memories pointed at adjacent prior work but none re-solve the present problem:

- `system-spec-kit/022-hybrid-rag-fusion/016-rewrite-memory-mcp-readme/plan` — prior README rewrite focusing on MCP terminology; relevant for tone/structure precedent.
- `system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/plan` — prior skill-README rewrite; relevant for vocabulary alignment in top-level docs.
- `system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/handover` — prior continuity-refactor work; introduces the term "continuity" that already has internal traction (high relevance for Q1).
- `system-spec-kit/026-graph-and-context-optimization/009-hook-package/...` — adjacent 026 work; not directly relevant.

In-conversation seed corpus (Phase 1 inventory output, ~5000 lines, currently held in orchestrator context):
- **MCP server map**: 9 `memory_*` MCP tools, 8 `memory_*` SQL tables (incl. `vec_memories`, `memory_index`, `memory_fts`, `memory_summaries`, `memory_entities`, `memory_lineage`, `memory_corrections`, `memory_conflicts`), 17 `memory-*.ts` handler files in `mcp_server/handlers/`, plus the `memory_sufficiency` quality module and "working memory" / "memory tier" / "memory state" / "memory lineage" subsystem labels.
- **Skill + slash command map**: SKILL.md / ARCHITECTURE.md / README.md / INSTALL_GUIDE.md / ENV_REFERENCE.md, the `references/memory/` folder, all four `/memory:*` slash commands (`save`, `search`, `learn`, `manage`), the `_memory.continuity` YAML frontmatter key, the `scripts/dist/memory/` folder, and `generate-context.js` (named for context generation but actually the canonical spec-doc continuity writer).
- **Ecosystem precedent**: alternative vocabulary already with internal traction — "continuity", "context preservation", "handover", "session", "checkpoint", "index". Anthropic Claude Memory tool clash currently zero in-codebase but a future risk. ~270+ hard-coded references across CLAUDE.md / AGENTS.md (+ `AGENTS_Barter.md` and `AGENTS_example_fs_enterprises.md` siblings, kept in sync per project rule), `.claude/agents/`, `.opencode/agent/`, four runtimes' configs, `opencode.json`, `.utcp_config.json`, skill-advisor scoring tables.

Iteration 1 should re-derive the inventory table from primary sources (not from this in-context summary) so findings cite real file paths and line numbers.

resource-map.md not present; skipping coverage gate.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7–11
- Canonical pause sentinel: `research/002-memory-terminology-pt-01/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-26T07:04:00.000Z
- Executor: native @deep-research, model opus, reasoningEffort high
<!-- /ANCHOR:research-boundaries -->
