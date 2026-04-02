## [v0.12.0] - 2026-04-01

This phase implemented the structured-save quality remediation work for the memory pipeline, then received a structural doc-alignment pass on 2026-04-02. The code changes are in place across the existing save pipeline, but the phase packet still leaves fresh runtime score evidence and final validator capture open, so these notes describe implemented behavior without claiming full rerun closure.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/012-memory-save-quality-pipeline` (Level 3)

---

## Saving Memories (4)

These changes repair the part of the save pipeline that was dropping useful context before it could become a readable memory.

### Structured save requests now keep the details they were given

**Problem:** Structured save requests arrived with the right information, but not in the shape the rest of the save pipeline expected.

**Fix:** The workflow now routes JSON and STDIN payloads through the existing normalization path before extraction begins.

### JSON-only saves can now tell a readable story

**Problem:** Structured saves without a transcript did not have enough narrative material for the extractor chain to explain what happened.

**Fix:** The extractor stack now synthesizes a minimal structured conversation when prompts are absent so JSON-only saves no longer collapse into a thin placeholder.

### Titles and summaries now reflect the actual work

**Problem:** Even strong session summaries could still end up as generic titles and generic opening text.

**Fix:** The collection path now derives title and summary fields from the structured session data instead of relying on boilerplate.

### Decision and file lists are easier to trust

**Problem:** Decision strings could repeat themselves and file lists could become noisy enough to bury the important references.

**Fix:** The phase reduced repeated decisions and tightened key-file shaping so saved memories stay easier to scan later.

---

## Safeguards (2)

### Related sibling phases no longer look like contamination by default

**Problem:** Structured saves often mention nearby child phases from the same workstream. The quality validator could treat those valid references as foreign contamination and unfairly drag scores down.

**Fix:** The validator now relaxes this check only for structured same-parent sibling references, without turning it into a broad cross-spec bypass.

### Structured saves now have a bounded quality floor instead of a cliff

**Problem:** A structured save could show strong signal in most areas and still receive a near-zero quality outcome.

**Fix:** The scorer now applies a damped, capped quality floor for structured input so obviously useful saves are not graded like empty output.

---

## Verification State (2)

### Structural packet alignment is complete

**Problem:** The Level 3 phase docs needed anchor and template cleanup before strict recursive validation could succeed.

**Fix:** The phase artifacts were aligned to the current template contract on 2026-04-02.

### Fresh runtime evidence is still tracked in the phase packet

**Problem:** The implementation landed before the phase completed its fresh structured-save reruns and final validator snapshot.

**Fix:** The changelog now reflects that truth directly. The phase tasks, checklist, and implementation summary still leave runtime score outcomes, transcript-mode regression evidence, and final closure artifacts marked pending.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Structured-save remediation themes implemented | `0/6` | `6/6` |
| Core modules tracked in implementation summary | `0` | `6` |
| Structural phase docs aligned to current template | `0/4` | `4/4` |
| Fresh runtime reruns and final validator capture | `0/5` | `Pending in phase docs` |

This phase changed the save pipeline behavior and the packet structure, but it still carries open rerun evidence in the phase checklist.

---

<details>
<summary>Technical Details: Files Changed (10 total)</summary>

### Source (6 files)

| File | Changes |
| ---- | ------- |
| `scripts/core/workflow.ts` | Routed structured payloads through the save workflow with the right normalization and metadata handling. |
| `scripts/extractors/conversation-extractor.ts` | Added the structured message synthesis path for transcript-free saves. |
| `scripts/extractors/collect-session-data.ts` | Derived title and summary output from structured session data. |
| `scripts/extractors/decision-extractor.ts` | Reduced repetition in plain decision-string output. |
| `scripts/lib/validate-memory-quality.ts` | Added structured sibling-phase contamination handling. |
| `scripts/core/quality-scorer.ts` | Added the bounded structured quality floor behavior. |

### Tests (0 files)

No new test files were recorded in the implementation summary for this phase. The packet still tracks fresh runtime score scenarios and transcript-regression reruns as pending follow-up evidence.

### Documentation (4 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/012-memory-save-quality-pipeline/plan.md` | Records the implementation sequence and the still-open verification gate. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/012-memory-save-quality-pipeline/tasks.md` | Leaves runtime evidence capture and final closure tasks open instead of overclaiming completion. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/012-memory-save-quality-pipeline/implementation-summary.md` | Syncs the phase summary to the actual code scope and pending rerun state. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/changelog/changelog-012-memory-save-quality-pipeline.md` | Updates the release notes to match the implemented work and the still-open verification evidence. |

</details>

---

## Upgrade

No migration required.

Structured saves now pass through a better normalization, synthesis, and quality path. The phase packet still expects fresh runtime evidence before it can claim final rerun closure.
