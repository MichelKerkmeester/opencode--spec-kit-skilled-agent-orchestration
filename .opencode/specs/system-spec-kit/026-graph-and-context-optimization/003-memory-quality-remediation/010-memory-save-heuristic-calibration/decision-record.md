---
title: "Decision Record: Memory Save Heuristic Calibration"
description: "Decision record for packet 010 and its schema, validator, sanitizer, and D5 calibration choices."
trigger_phrases:
  - "010 heuristic calibration adr"
  - "memory save calibration decisions"
importance_tier: "important"
contextType: "decision-record"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-remediation/010-memory-save-heuristic-calibration"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Memory Save Heuristic Calibration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bundle the remaining heuristic defects into one packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

### Context

The remaining failures all occur on the same live save path: a structured JSON payload flows through normalization, workflow merge, validation, review, and indexing. Splitting these issues into separate packets would keep the live save path partially broken while one surface waited on another. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:5-18] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:169-195]

### Decision

**We chose**: Implement the remaining schema, sanitizer, validator, D5, and truncation-helper fixes together inside `010-memory-save-heuristic-calibration`.

**Why**: One packet can prove the end-to-end save path is truly repaired, rather than leaving a sequence of partial follow-ons.

### Consequences

- The packet must carry both focused lane tests and one real save verification run.
- Historical rewrite and canary follow-ons remain separate by design.
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Manual trigger phrases are authoritative inputs, not expendable suggestions

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

### Context

The RCA proves the current runtime contradiction: manual DR finding IDs are supplied in the payload, removed by the sanitizer, and then PSR-2 complains that they are missing. Research `REC-006` also warned that the D3 sanitizer should stay narrow and should not grow into a broad semantic blocker. [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:75-113] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:89-108]

### Decision

**We chose**: Distinguish manual phrases from auto-extracted phrases in the sanitizer path. Manual phrases must survive unless they are true contamination such as path fragments, control characters, or prompt/tool leakage.

### Consequences

- Workflow must pass source context into trigger sanitization.
- Tests must cover both manual and auto-extracted cases to prevent future widening.

---

### ADR-003: Freeze one continuation-signal contract for linker and reviewer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-09 |
| **Deciders** | Current packet implementation pass |

### Context

`REC-008` and the RCA both show D5 drift: predecessor discovery and post-save review do not use the same continuation signal set, while `REC-018` never landed the description-aware fallback the research proposed. [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:109-136] [SOURCE: ../../scratch/codex-skipped-research-recommendations.md:25-41] [SOURCE: ../../scratch/codex-root-cause-memory-quality-gates.md:182-208]

### Decision

**We chose**: Reuse one shared continuation-signal contract across predecessor discovery and post-save review, keep the immediate-predecessor-only plus ambiguity-skip behavior from Phase 4, and add description-aware fallback for weak-title saves.

### Consequences

- D5 should quiet on legitimate continuation saves but remain conservative in mixed folders.
- Reviewer and linker regressions can now share one test vocabulary.
