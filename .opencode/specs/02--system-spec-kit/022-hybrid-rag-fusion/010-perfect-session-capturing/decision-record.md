---
title: "Decision Record: Perfect Session Capturing [template:level_3/decision-record.md]"
description: "Close spec 010 truthfully: formalize phased-parent validation support, retain a current same-day five-CLI proof artifact, and avoid fake closure."
trigger_phrases:
  - "decision"
  - "perfect session capturing"
  - "truth reconciliation"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: CLOSE VALIDATION AND PROOF GAPS WITHOUT WIDENING RUNTIME SCOPE

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-17 |
| **Deciders** | Michel Kerkmeester, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

By the time this pass started, the executable surface was already strong, but the parent folder still read like a closure pass. Two different issues were being blurred together:

- the parent strict validator still warned because phased-parent addenda were not yet understood by the current base-template comparator; and
- live CLI proof had not yet been retained in one same-day artifact covering every supported CLI.

At the same time, the remaining child phases were not uniform: phase `004` still had a narrow real implementation gap, while phases `005`, `010`, and `011` were largely documentation and status drift.

### Constraints

- Keep sanctioned phased-parent structure in place.
- Do not widen runtime contracts or invent live-proof claims beyond retained evidence.
- Treat child completion evidence and parent closure readiness as separate questions until the final parent gates pass.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: formalize phased-parent and child addenda support in `template-structure.js`, reconcile child docs only to shipped evidence we can prove locally, retain one current same-day proof artifact for each supported CLI, and only then publish parent closure.

**How it works**: the parent pack now cites the clean validator result instead of a preserved blocker, targeted child phases are backfilled from current tests and code, a current same-day five-CLI artifact is retained in `research/live-cli-proof-2026-03-17.json`, and the supporting-doc plus scratch-tooling surfaces are verified separately from canonical closure claims.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Formalize phased addenda support and retain a current same-day five-CLI proof artifact before closing** | Preserves trust, keeps sanctioned phased structure intact, and makes the final parent state fully auditable | Requires touching validator logic plus proof storage | 10/10 |
| Delete or flatten the phase-map content to quiet validation | Would reduce current warning noise | Hides the real comparator limitation and misrepresents sanctioned phased-parent structure | 2/10 |
| Mark the parent complete because tests are green without fresh live proof | Feels simpler in the short term | Conflates executable coverage with unresolved proof obligations | 1/10 |

**Why this one**: the purpose of this pass is auditable closure, not cosmetic closure.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Parent and child docs now align with current shipped behavior and rerun-backed evidence.
- Support docs and retained shell launchers no longer drift from the documented verification baseline.
- Reviewers can see exactly why the parent is complete and which retained artifact backs the live CLI proof claim.

**What it costs**:
- The parent pack must be revisited if future edits invalidate the phased-addenda support or the retained live-proof artifact goes stale.
- Future closure claims still need fresh reruns and retained proof instead of narrative carry-over.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers mistake green suites for closure without retained proof | H | Keep the parent summary and checklist explicit about the retained five-CLI artifact |
| Future edits quietly reintroduce stale counts | M | Tie every published count to a rerun-backed command |
| Scratch helpers are mistaken for canonical evidence | M | Keep authority rules explicit and validate retained launchers separately |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent pack still overstated closure and several child phases were under-documented |
| 2 | **Beyond Local Maxima?** | PASS | We compared formalized addenda support against deleting sanctioned phase-map content or overclaiming proof |
| 3 | **Sufficient?** | PASS | Targeted doc reconciliation, validator support, fresh reruns, and retained proof resolve the drift without widening scope |
| 4 | **Fits Goal?** | PASS | The goal is truthful final closure, not cosmetic greenwashing |
| 5 | **Open Horizons?** | PASS | The retained proof path and comparator tests leave a clear maintenance trail for future edits |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Rewrite the parent pack around the final closure model.
- Backfill the drifting child phases from shipped code and current reruns.
- Refresh support docs, metadata, retained proof, and scratch-tooling verification to the same March 17, 2026 baseline.

**How to roll back**: revert only the affected docs and metadata, rerun the same command set, and reapply the minimum truthful reconciliation.

```bash
./.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing --strict --recursive
```

```bash
./.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing --strict
```

```bash
python3 ./.opencode/skill/sk-doc/scripts/extract_structure.py .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/decision-record.md
```
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
