---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: memory terminology rename across system-spec-kit (six conflated concept layers, ~270 references, Anthropic Claude Memory clash, Q1-Q7 from spec.md §12)
- Started: 2026-04-26T07:04:00.000Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: e3fb01be-3a22-481a-be85-76d57a297857
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q8 concept-layer mapping | layer-mapping | 0.85 | 7 | complete |
| 2 | Q9 alias-window scoping | alias-windowing | 0.71 | 9 | complete |
| 3 | Q4 parser-fallback + Q5 glossary precedent | migration-and-governance | 0.65 | 8 | complete |
| 4 | Q6 Anthropic positioning callout + Q7 FSRS / cognitive-science loanwords | operator-facing-disambiguation-and-cognitive-vocabulary-carve-out | 0.65 | 9 | complete |
| 5 | Q10 OSS precedent + Q3 final synthesis | ecosystem-validation-and-scope-freeze | 0.45 | 9 | complete |
| 6 | Cross-validation + risk audit + convergence assessment | consolidation | 0.30 | 7 | insight |
| 7 | Implementation PR sequencing plan | implementation-sequencing | 0.20 | 8 | insight |
| 8 | Glossary content draft preview (§0 + §6) | glossary-content-prep | 0.15 | 2 | insight |
| 9 | Edge case content drafts | edge-case-content-prep | 0.15 | 5 | insight |
| 10 | Final synthesis prep + STOP verdict | synthesis-prep | 0.15 | 3 | insight |

- iterationsCompleted: 10
- keyFindings: 139
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
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

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.15 -> 0.15 -> 0.15
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.15
- coverageBySources: {"code":61,"developers.llamaindex.ai":1,"github.com":1,"other":98,"platform.claude.com":1,"reference.langchain.com":1}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
**Synthesis phase** — workflow reducer compiles `research.md` from iter-1..iter-10 deliverables; emits `resource-map.md` from converged deltas; writes the generated-findings fence into spec.md; runs strict-validation. After synthesis, the implementation phase opens PR1 per iter-7's sequencing plan.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
