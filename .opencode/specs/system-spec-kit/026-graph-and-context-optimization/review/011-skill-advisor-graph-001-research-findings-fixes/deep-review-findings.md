# Deep Review Findings: 001-research-findings-fixes

**Verdict:** FAIL

**Severity summary:** 2 P0, 2 P1, 2 P2

This review covered every `.md` and `.json` file in the packet and cross-checked the packet against the live implementation under `.opencode/skill/skill-advisor/scripts/`, current graph metadata, strict spec validation, and the existing skill-advisor validation/health/regression commands.

## Iteration Log

### Iteration 1 — Correctness

- Verified the packet's substantive implementation claims against live code:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py:81-149` shows the ghost-candidate guard logic in `_apply_graph_boosts()` and `_apply_family_affinity()`.
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1592-1600` shows `_graph_boost_count` plus the post-calibration graph penalty.
  - `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:41`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:124-165`, and `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:324-455` show `prerequisite_for`, self-edge validation, cycle detection, and compiled `signals`.
- **No new correctness defect** found in the underlying implementation described by this packet.

### Iteration 2 — Completeness

- **P1-F1:** Packet completion is overstated. `spec.md` marks the packet `Complete`, but the success criteria remain unchecked and the packet itself says only 2 of 5 P1 items landed.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:43`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:150-157`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:29`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:48-55`

### Iteration 3 — Consistency

- **P2-F2:** The task ledger mixes completed and deferred states on the same item. `T014` is checked complete while also marked deferred/partial, which makes the execution ledger unreliable.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:65`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:90`

### Iteration 4 — Evidence Quality

- **P2-F1:** Some evidence entries are not reproducible, and one byte-count claim has already drifted from the artifact on disk. `T023` uses `this session` as evidence, while multiple docs hard-code `3957 bytes` for `skill-graph.json`; the current artifact is 3958 bytes.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:77-81`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:66-69`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:71-72`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:90-91`

### Iteration 5 — Path Accuracy

- **P0-F1:** The packet still points follow-up work at non-existent skill-advisor paths outside `skill-advisor/scripts/`. This breaks the packet's execution surface and violates the current repository layout.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:133-142`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:82-91`  
  **Validated against live paths:** `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, `.opencode/skill/skill-advisor/scripts/skill-graph.json`, `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

### Iteration 6 — Template Compliance

- **P0-F2:** The packet fails strict Level 2 spec validation because the docs do not follow the required section/anchor contract. The current files use custom headings instead of the active template structure.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:28`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:53`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:129`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:29`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:46`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:183`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:41`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:52`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:64`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:27`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:79`

### Iteration 7 — Cross-Reference Integrity

- **P1-F2:** Cross-reference metadata is stale: `graph-metadata.json` only lists `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` as source docs even though `decision-record.md` and `implementation-summary.md` now exist and contain review-relevant state.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/graph-metadata.json:169-174`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/decision-record.md:1-19`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:1-19`

### Iteration 8 — Metadata Quality

- **P1-F2 (continued):** Packet metadata was not refreshed after later docs were written. `description.json` stops at `16:00`, `graph-metadata.json` still says `planned`, and `graph-metadata.json` has `last_save_at` earlier than `created_at`, which is chronologically impossible.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/description.json:12`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:43`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/decision-record.md:14`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:14`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/graph-metadata.json:44`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/graph-metadata.json:166-167`

### Iteration 9 — Scope Alignment

- **P1-F1 (continued):** The packet's readiness narrative is still aimed at "production-ready" closure even though the packet explicitly defers P1-2, P1-4, and P1-5 and leaves the research-verdict success criterion open.  
  **Evidence:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:40`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:66`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:68-69`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:80`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:157`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:48-55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:97-99`

### Iteration 10 — Actionability

- The packet is **not currently actionable as a canonical handoff artifact** because the P0 items above will send the next implementer to dead paths and the packet itself fails strict template validation.
- No additional unique finding beyond **P0-F1** and **P0-F2**.

## Deduplicated Findings

### P0

#### P0-F1 — Broken skill-advisor paths in the packet

The packet still references legacy top-level skill-advisor artifact paths that do not exist on disk. This is a release-blocking packet defect because the key execution surfaces point at dead files instead of the current `skill-advisor/scripts/` locations.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:133-142`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:82-91`

**Remediation**
- Replace every `skill-advisor/<artifact>` reference with `skill-advisor/scripts/<artifact>` where applicable.
- Re-scan the packet for inline bare references to `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.json`, and `skill_advisor_regression_cases.jsonl`.

#### P0-F2 — Level 2 packet is not template-compliant

Strict packet validation fails because required anchors and section headers are missing across the packet. This blocks the packet from being treated as a valid Level 2 spec bundle.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:28`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:53`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:129`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:29`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:46`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/plan.md:183`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:41`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:52`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:64`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:27`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:79`

**Remediation**
- Rework the packet to match the active Level 2 templates and rerun strict validation until it passes cleanly.

### P1

#### P1-F1 — Completion/readiness state is internally inconsistent

The packet says `Complete`, but the packet's own success criteria are still unchecked and three P1 items remain deferred. This overstates readiness and muddies whether follow-up work still exists.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:43`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/spec.md:150-157`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:29`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:48-55`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:17`

**Remediation**
- Mark the packet as in-progress/conditional until the deferred P1 items are either moved out of scope into a follow-on packet or completed here.

#### P1-F2 — Packet metadata is stale and contradictory

The packet's search/index metadata does not reflect the latest docs or latest state. Tooling that trusts `description.json` and `graph-metadata.json` will get the wrong status and an incomplete source-doc set.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/description.json:12`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/graph-metadata.json:44`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/graph-metadata.json:166-174`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/decision-record.md:14`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:14`

**Remediation**
- Refresh packet metadata with the canonical save/index flow so status, timestamps, source docs, and derived fields all reflect the current packet contents.

### P2

#### P2-F1 — Evidence entries are weak and partially stale

Several evidence strings are not reproducible enough for an audit trail, and one numeric evidence value has drifted. This does not invalidate the implementation, but it weakens the packet as a review artifact.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:77-81`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:66-69`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:71-72`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/implementation-summary.md:90-91`

**Remediation**
- Replace vague evidence strings with command/file-backed evidence and avoid hard-coding unstable byte counts unless the artifact is locked.

#### P2-F2 — Task completion notation is noisy

The task/checklist pair uses inconsistent completion semantics for partially delivered work, which makes it harder to tell whether an item is done, deferred, or partially accepted.

**Evidence**
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/tasks.md:65`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes/checklist.md:90`

**Remediation**
- Reserve `[x]` for fully complete items and move partial/deferred work to unchecked items with explicit follow-up notes.
