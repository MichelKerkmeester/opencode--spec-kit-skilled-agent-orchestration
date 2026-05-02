---
title: "De [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/014-stateless-quality-gates/decision-record]"
description: "The shipped Phase 014 contract bundles hard-block stateless rules, structured stdin/json input, and narrow source-aware contamination severity."
trigger_phrases:
  - "stateless quality gates decisions"
  - "gate a tiering decision"
  - "stdin decision"
  - "contamination filter source-aware decision"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/014-stateless-quality-gates"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Stateless Quality Gate Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bundle Stateless Saves Around Hard Blocks, Structured Input, And Source-Aware Severity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-18 |
| **Deciders** | Phase 014 author |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 014 had three coupled failures in the stateless save path. Gate A in `workflow.ts` treated every V1-V11 validation failure as fatal for non-file sources, even though V10 file-count divergence is diagnostic rather than unsafe. The only practical workaround was writing curated JSON to `/tmp/save-context-data.json`, which bypassed stateless mode but added manual scaffolding. Claude Code sessions were also capped by the tool-title-with-path contamination rule even when they were faithfully describing real tool activity.

### Constraints

- V8 and V9 foreign-spec contamination must remain hard-blocks.
- Structured JSON input must reuse the existing `runWorkflow({ collectedData })` path instead of introducing temp files or a parallel save pipeline.
- The contamination exception must stay narrow enough that Codex, Copilot, Gemini, and future sources do not silently lose high-severity protection.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: treat the stateless fix as one bundled contract: keep hard safety rules blocking, route curated stdin/json payloads through file-mode semantics, and downgrade the tool-title-with-path contamination rule only for Claude Code captures.

**How it works**: `validate-memory-quality.ts` exports `HARD_BLOCK_RULES`, and `workflow.ts` aborts only when a failed stateless rule is in that set. `generate-context.ts` accepts `--stdin` and `--json`, validates the target spec folder, sets `_source = 'file'`, and passes curated payloads through `runWorkflow({ collectedData })` without a temp file. `contamination-filter.ts` keeps its current denylist API but accepts `captureSource`, allowing Claude Code tool-title-with-path matches to drop from high to low severity while all other sources retain the original behavior.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bundled hard-block + structured-input + source-aware policy (chosen)** | Removes the false-positive trap without weakening the real safety rails; avoids temp files; keeps source-specific behavior explicit | The contract spans three files and needs clear documentation to stay coherent | 9/10 |
| Disable Gate A entirely for stateless mode | Smallest code change | Weakens V1/V3/V8/V9/V11 safety guarantees | 2/10 |
| Keep the `/tmp/save-context-data.json` workaround | No new CLI parsing | Leaves the user flow clunky and undocumented as a real product path | 3/10 |
| Downgrade tool-title-with-path globally | Simple contamination change | Weakens non-Claude contamination detection for the sake of one source | 3/10 |

**Why this one**: the three issues were coupled in practice. Solving only one of them would still leave users choosing between false aborts, temp-file scaffolding, or uneven contamination behavior.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Legitimate stateless Claude Code saves with V10-only failures now succeed.
- Curated automation can use `--stdin` and `--json` without the `/tmp` workaround.
- Source-aware contamination policy stays narrow: Claude Code gets the exception, other sources keep the old severity.

**What it costs**:
- The hard-block allowlist and source-policy rules now need one authoritative owner. Mitigation: keep the bundled contract documented here and revalidate it with the targeted phase-014 lane.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| New rules are added without updating the hard-block ownership model | High | Keep `HARD_BLOCK_RULES` explicit and cover it in workflow regression tests |
| Soft-warning V10 saves write successfully but are not always semantically indexed | Medium | Keep the parent audit explicit that saved and indexed are not yet identical guarantees |
| Claude-only severity branching becomes overfit as more CLI sources mature | Medium | Track follow-up work in the parent research pack toward typed source capabilities |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The old stateless path forced users into false aborts or temp-file scaffolding |
| 2 | **Beyond Local Maxima?** | PASS | We compared policy split, workaround retention, and global severity downgrade options |
| 3 | **Sufficient?** | PASS | The bundled contract fixes the real user path without redesigning the whole save pipeline |
| 4 | **Fits Goal?** | PASS | It directly improves stateless saves while preserving hard safety rules |
| 5 | **Open Horizons?** | PASS | The same contract can later evolve toward typed source capabilities and clearer block-on-index semantics |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts`: export `HARD_BLOCK_RULES` so the stateless abort contract is explicit.
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`: split hard-block and soft-warning stateless behavior, and pass `captureSource` into contamination filtering.
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`: support `--stdin` and `--json`, resolve the authoritative target, and hand curated payloads to `runWorkflow({ collectedData })`.
- `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts`: accept optional `captureSource` and narrow the tool-title-with-path downgrade to Claude Code captures.

**How to roll back**: restore the old Gate A abort line in `workflow.ts`, remove `HARD_BLOCK_RULES` from `validate-memory-quality.ts`, remove `--stdin` / `--json` handling from `generate-context.ts`, and drop the `captureSource` option from `contamination-filter.ts`, then rerun the targeted phase-014 lane plus the broader scripts baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Phase 014): one bundled ADR keeps the template clean while preserving the three shipped stateless-save decisions.
Written in active voice per HVR rules.
-->
