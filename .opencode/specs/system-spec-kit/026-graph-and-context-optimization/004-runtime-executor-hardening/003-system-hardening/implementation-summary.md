---
title: "...ec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/003-system-hardening/implementation-summary]"
description: "Placeholder implementation summary for 019-system-hardening. Filled after 001-initial-research converges and implementation children ship."
trigger_phrases:
  - "019 implementation summary"
  - "system hardening summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/003-system-hardening"
    last_updated_at: "2026-04-18T17:15:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Umbrella packet scaffolded"
    next_safe_action: "Dispatch 001-initial-research research wave"
    key_files: ["implementation-summary.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: System Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

> **Placeholder.** This document is scaffolded at charter time and will be filled after the 001 research wave converges and implementation children (`019/002-*`, `019/003-*`, ...) ship. See `spec.md §4 Requirements REQ-002` for the research-first gating rule.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-system-hardening |
| **Completed** | TBD (filled after children ship) |
| **Level** | 3 |
| **Scope** | Umbrella packet coordinating 6 Tier 1 research/review iterations and their subsequent implementation children |
| **Research Child** | `001-initial-research/` (now coordinates 6 Level 2 sub-packets `001-006/` per ADR-003 of 001) |
| **Implementation Children** | TBD (cluster-per-child per ADR-002; created after research convergence) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Scaffold-time artifacts: umbrella packet `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and this placeholder `implementation-summary.md`. Nested research child at `001-initial-research/` carries the six Tier 1 dispatch blocks in `001-initial-research/plan.md §4.1`. Source document: `../scratch/deep-review-research-suggestions.md`.

Post-convergence this section will summarize the research verdict, the final cluster-to-child mapping, and the cross-cluster coordination patterns that emerged.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD. This section will summarize the research dispatch sequence, the skill-owned command usage, and the convergence cadence per Tier 1 item.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Research-first ordering (ADR-001) | Prevents speculative implementation when research could invalidate scope |
| Cluster-per-child layout (ADR-002) | Matches shipping reality; fixes cluster by file/test/invariant, not by research question |

Additional decisions recorded after research convergence will be appended here.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/003-system-hardening --strict` | TBD (pending charter approval + child packet scaffold) |
| 001 research convergence | TBD |
| Implementation-child completeness | TBD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Placeholder document.** Until 001 research converges, this summary is intentionally empty. Do not remove this notice until the verification table is filled.
2. **Cluster boundaries unknown at charter time.** The final implementation-child layout depends on findings registry output and cannot be predeclared.
3. **Tier 2 / Tier 3 scope excluded.** `../scratch/deep-review-research-suggestions.md` lists Tier 2 and Tier 3 candidates that are deliberately out of scope for 019 unless promoted by Tier 1 findings.
<!-- /ANCHOR:limitations -->

---

## Sub-phase summaries

### 001-initial-research

**Status:** Research coordination complete. Six Tier 1 research/review iterations dispatched and converged. Dispatch waves: Wave 1 (SSK-RR-2 + DR-1), Wave 2 (RR-1 + RR-2), Wave 3 (SSK-RR-1 + SSK-DR-1). Executor: `cli-codex gpt-5.4 high fast`.

**Consolidated outcome:** 40 total findings across 2 P0 + 8 P1 + 6 P2 + 5 validator rules + 19 residuals. P0 #1: packets 007/008/009/010 missing root `spec.md`. P0 #2: `save_lineage` runtime writeback bug in `workflow.ts`. Six remediation children scaffolded: 002–007. Implementation waves: Wave impl 1 (002+005 parallel), Wave impl 2 (003+007 parallel), Wave impl 3 (004), Wave impl 4 (006).

**Sub-sub-phases merged (6 total):** 001-canonical-save-invariants (SSK-RR-2, 9 research iters, P0 save-lineage + 007-010 spec.md bugs), 002-delta-review-015 (DR-1, 9 review iters, 242 findings classified), 003-q4-nfkc-robustness (RR-1, Wave 2 scaffold), 004-description-regen-strategy (RR-2, 5 iters, field-level merge policy), 005-routing-accuracy (SSK-RR-1, 8 iters, Gate 3 F1 68.6%→83.3%), 006-template-validator-audit (SSK-DR-1, 6 iters, 1 P1 + 3 P2).

---

### 002-canonical-save-hardening

**Status:** COMPLETE (2026-04-18). Executor: `cli-codex gpt-5.4 high fast`.

**Wave A — Save-lineage runtime parity:** `refreshGraphMetadata()` now accepts `GraphMetadataRefreshOptions`; canonical-save workflow passes `{ now, saveLineage: 'same_pass' }` — `derived.save_lineage` now persists. Closes P0 #2 from research.

**Wave B — Packet-root remediation:** Coordination-parent `spec.md` files added for packets 007, 008, 009, 010. `generate-context.js` refreshed their `description.json` and `graph-metadata.json`; all four now have non-empty `derived.source_docs` and `save_lineage: "same_pass"`. Closes P0 #1 from research.

**Wave C — Validator rollout:** 5 new canonical-save validator rules: `CANONICAL_SAVE_ROOT_SPEC_REQUIRED`, `CANONICAL_SAVE_SOURCE_DOCS_REQUIRED`, `CANONICAL_SAVE_LINEAGE_REQUIRED`, `CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED`, `CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS`. Wired into `validate.sh` via CommonJS helper. 026 recursive canonical-save pack passes with 007-010 grandfathering window.

---

### 003-nfkc-unification-hardening

**Status:** Implementation complete (targeted adversarial tests pass). Full-suite completion intentionally unclaimed (workspace baseline red on unrelated suites).

**HP1:** Canonical Unicode fold utility at `shared/unicode-normalization.ts` with NFKC normalization, hidden-character stripping, combining-mark stripping, high-risk confusable fold table. Gate 3, recovered-payload provenance, and trigger-phrase sanitization refactored to use shared fold.

**HP2:** Instruction contamination + suspicious-prefix detection moved to post-canonicalization paths (fullwidth, zero-width, combining-mark, confusable variants evaluated after folding).

**HP3:** Fold table expanded for Greek omicron/rho and adjacent high-risk Greek/Cyrillic role-word lookalikes.

**HP4:** Semantic validation for pending compact-prime payloads wired into Claude/Gemini/Copilot session-prime readers.

**HP5:** Compact-cache provenance contract metadata with `sanitizerVersion` + Node/ICU/Unicode runtime fingerprints; required at reader emission boundaries.

**HP6:** Shared adversarial Unicode round-trip corpus RT1-RT10 covering Gate 3, shared provenance, trigger phrases, and hook-state validation.

---

### 004-routing-accuracy-hardening

**Status:** COMPLETE (2026-04-19). Final corpus advisor accuracy: 60.0%. Gate 3 F1: 97.66%. Joint TT 115 / FT 5 / FF 1.

**Wave A:** Advisor command-surface normalization in `skill_advisor.py` — `command-memory-save`, `command-spec-kit-resume`, `command-spec-kit-deep-research`, `command-spec-kit-deep-review` normalize to owning skills. Guard logic preserves quoted command references.

**Wave B:** Gate 3 routing in `gate-3-classifier.ts` extended with deep-loop write markers including `/spec_kit:deep-research`, `/spec_kit:deep-review`, `:auto` paired with `spec_kit`, natural-language deep-loop markers, `autoresearch`, `convergence`.

**Wave C:** Broader resume/context markers + narrow mixed-tail write exception + negation/prompt-only/read-only deep-loop guards added (FF reduced from 22 to 1).

---

### 005-description-regen-contract

**Status:** COMPLETE (2026-04-19). Targeted vitest: 117/117 pass. Sweep of all 28 rich `description.json` files in `system-spec-kit` verified.

**What shipped:** Dedicated description schema with explicit field classes (canonical-derived, canonical-authored, tracking, known authored optional, reserved-key passthrough). Unified `mergeDescription()` helper routing both schema-valid write lane and 018 R4 schema-error repair lane through same field-level policy. `PerFolderDescription` extended to model preserved authored optional fields directly in live folder-discovery surface.

**Key files:** `mcp_server/lib/description/description-schema.ts`, `mcp_server/lib/description/description-merge.ts`, `mcp_server/lib/search/folder-discovery.ts`, `mcp_server/lib/description/repair.ts`.

---

### 006-residual-015-backlog

**Status:** COMPLETE (2026-04-19). Closes 19 residual findings from delta review `019-system-hardening-pt-01` across 6 clusters.

**C1 DB boundary hardening:** `core/config.ts` canonicalizes symlink targets before allowed-root checks; refreshes exported database path bindings after late environment overrides.

**C2 Advisor degraded-state visibility:** `skill_advisor.py` + `skill_advisor_runtime.py` surface malformed source metadata and skipped cache records as degraded health.

**C3 Resume minimal contract:** `handlers/session-resume.ts` returns compact minimal payload (graph/search readiness, cached summary, structural context, session quality, graph operations, hints) omitting full memory recovery fields.

**C4 Review graph semantics:** `handlers/coverage-graph/query.ts` separates `coverage_gaps` from `uncovered_questions`; `status.ts` fails closed when scoped signals or momentum cannot be computed.

**C5 Documentation parity:** MCP-code-mode README, folder routing, troubleshooting, env vars, sk-code-full-stack, and cli-copilot docs updated to match current MCP surface.

**C6 Hygiene:** `save-quality-gate.ts` ignores whitespace-only trigger phrases; `hooks/claude/session-prime.ts` emits visible startup-brief warning on brief-path regression.

---

### 007-template-validator-contract-alignment

**Status:** COMPLETE (2026-04-19). Validator regression passes.

**Rank 1 registry canonicalization:** `scripts/lib/validator-registry.json` stores rule IDs, aliases, paths, severities, descriptions, strict-only flags, authored/runtime categories. `validator-registry.ts` typed loader added. `validate.sh` reads all canonical names/severities/paths/help from registry via `validator_registry_query()` / `emit_rule_script()`.

**Rank 2 frontmatter semantics:** `check-frontmatter.sh` rejects empty `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`. `spec-doc-structure.ts` treats empty continuity fields as missing. Grandfathering: `frontmatter-grandfather-allowlist.json` bounded cutoff for legacy exceptions.

**Rank 3 anchor parity:** `check-anchors.sh` rejects duplicate opening anchor IDs (matching `preflight.ts`).

**Rank 4 reporting split:** `rules/README.md` + `validate.sh --help` group rules into `authored_template` and `operational_runtime`.

**Rank 5 template repair:** `templates/level_3/decision-record.md` fixed (stale comment terminator removed from frontmatter description).
