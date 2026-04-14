---
title: "Decision Record: Structural Overlap Formula"
description: "Record the corrected structural overlap metric for M7 verification and explain why raw shared-line percentages diverge from behavioral parity in the start-command surfaces."
trigger_phrases:
  - "decision record"
  - "structural overlap"
  - "line similarity"
  - "m7 remediation"
  - "spec kit commands"
importance_tier: "important"
contextType: "architecture"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: level_3/decision-record.md | adapted for packet 012 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
    last_updated_at: "2026-04-14T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded corrected structural overlap formula for M7 remediation"
    next_safe_action: "Sync checklist and task evidence for M7 and M8"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/start.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/checklist.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-spec-kit-commands-m7-m8-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Unified diff overlap percentages were misleading because additions and removals were both counted"
---
# Decision Record: Structural Overlap Formula

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Structural Overlap Formula

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-14 |
| **Deciders** | Codex remediation pass for packet 012 |

---

<!-- ANCHOR:adr-001-context -->
### Context

M7 originally measured structural overlap with `diff -u <new> <sibling> | grep -c '^[+-]'` divided by the new-file line count. That formula double-counts change volume because unified diff emits both removals and additions, so new files that differ meaningfully but still follow the same house structure can report negative overlap percentages. That made CHK-040 hard to interpret and blocked remediation evidence from saying anything useful about real parity.

We still needed a lightweight, file-local measurement that fits the packet's verification workflow and does not depend on semantic review tooling. The replacement metric had to stay readable, be reproducible from plain text files, and preserve the distinction between structural similarity and behavior-specific divergence.

### Constraints

- The metric must be computable from repo files without introducing new tooling requirements.
- The packet still needs a comparable measurement across `start.md` and both new start YAML assets.
- The recorded result must explain intentional divergence rather than hiding it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: shared-line similarity measured as `common_lines / max(total_lines)` using exact line matches with duplicate counts preserved.

**How it works**: For each new file and its nearest sibling, count the multiset intersection of exact lines, then divide by the larger file's total line count. This removes the negative-percentage failure mode from unified diff while still penalizing files that share only a small structural core.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared-line similarity** | Easy to reproduce, never negative, comparable across Markdown and YAML, keeps exact-line discipline | Still underweights semantic parity when setup variables or step payloads legitimately differ | 8/10 |
| Unified diff additions/removals over new-file size | Already used in packet evidence, cheap to run | Double-counts edits, produces negative overlap, obscures useful interpretation | 3/10 |
| Semantic or AST-aware similarity | Better reflects behavioral parity | Too heavy for packet-local verification and not available uniformly for Markdown + YAML | 6/10 |

**Why this one**: It fixes the broken math without pretending that the start-command surfaces are more similar than they are. It also keeps the evidence transparent for later reviewers.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Overlap percentages are readable and reproducible instead of going negative.
- CHK-040 can distinguish "formula was wrong" from "files still diverge materially."

**What it costs**:
- Exact shared-line counts still undersell parity when two files deliberately use different variables or domain-specific prose. Mitigation: keep qualitative parity checks alongside the metric.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers treat low percentages as proof of bad structure | M | Pair the metric with key-order, section-order, and step-ID parity checks in checklist evidence |
| Future reviewers reuse the raw number without context | M | Record the formula, measurements, and divergence rationale in this ADR |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | CHK-040 was blocked by a mathematically misleading formula |
| 2 | **Beyond Local Maxima?** | PASS | We compared the current diff formula, a lighter exact-line alternative, and a heavier semantic alternative |
| 3 | **Sufficient?** | PASS | Exact shared-line similarity is enough for packet-local reporting when paired with qualitative parity checks |
| 4 | **Fits Goal?** | PASS | The decision stays inside M7 remediation and does not expand into runtime changes |
| 5 | **Open Horizons?** | PASS | A later packet can still adopt richer structural metrics without invalidating this evidence |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- M7 overlap evidence now uses the corrected shared-line similarity metric for packet 012.
- The remediation report records both the measured percentages and the reason the YAML surfaces remain intentionally low-overlap.

**Measured results**:

| Pair | Common lines | Max total lines | Corrected overlap |
|------|--------------|-----------------|-------------------|
| `start.md` vs `deep-research.md` | 159 | 340 | 46.76% |
| `spec_kit_start_auto.yaml` vs `spec_kit_deep-research_auto.yaml` | 112 | 722 | 15.51% |
| `spec_kit_start_confirm.yaml` vs `spec_kit_deep-research_confirm.yaml` | 145 | 897 | 16.16% |

**Divergence rationale**:
- `start.md` now matches the sibling command-card skeleton more closely after the added `REFERENCE` section, but it still owns a different setup contract and output schema than deep research.
- The start YAMLs intentionally diverge because intake workflows bind folder-state, level recommendation, and manual relationships, while deep-research YAMLs manage iteration loops, locks, convergence, and synthesis. Structural parity is therefore better evidenced by shared top-level key order, required step naming, and vocabulary conventions than by raw shared-line percentage alone.

**How to roll back**: Delete this ADR and restore checklist/task evidence to the earlier diff-based wording if the packet later standardizes on a different structural metric.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
