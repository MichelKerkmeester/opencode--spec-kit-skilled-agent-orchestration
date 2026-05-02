---
title: "Decision Record: command-md-yaml-alignment"
description: "ADR record for the command Markdown and YAML alignment audit boundary and YAML safety policy."
trigger_phrases:
  - "command md yaml decisions"
  - "packet 006 adr"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment"
    last_updated_at: "2026-05-02T06:53:47Z"
    last_updated_by: "codex"
    recent_action: "Authored audit boundary and YAML safety ADRs"
    next_safe_action: "Execute command/YAML audit with per-hit classification"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/"
    session_dedup:
      fingerprint: "sha256:0060060060060060060060060060060060060060060060060060060060060003"
      session_id: "2026-05-02-006-command-md-yaml-alignment"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: command-md-yaml-alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Packet 005 Audit Boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-02 |
| **Deciders** | Codex and user-supplied packet brief |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 006 is the second half of the AI-facing surface cleanup that packet 005 started. The risk is stale public-facing command prose and workflow instructions that still point to deleted scripts, deleted folders, or the old architecture label.

### Constraints

- The banned user-facing prose boundary is identical to packet 005: `compose.sh`, `wrap-all-templates`, `templates/level_N/`, `templates/core/`, `templates/addendum/`, `templates/phase_parent/`, and the old "CORE + ADDENDUM v2.2" architecture name.
- Literal `templates/manifest/` directory references remain allowed when they point to the current concrete template location.
- Non-template runtime terms such as YAML workflow `manifest` fields, `kind`, and command capability semantics are allowed when they describe actual command execution behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use packet 005's audit boundary for command Markdown and YAML assets, with explicit exemptions for current runtime workflow terminology.

**How it works**: Grep first, read surrounding context, classify each hit, and delete or rewrite only stale content. Legitimate concrete directory references and runtime workflow metadata stay in place and are documented in the implementation summary when they would otherwise look suspicious.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use packet 005 boundary** | Consistent with the just-completed cleanup and scoped to known stale terms. | Requires careful exemptions for runtime YAML terminology. | 9/10 |
| Broaden to all template language | Might catch additional wording drift. | Higher false-positive rate and outside the packet brief. | 5/10 |
| Only grep deleted paths | Fast and low-risk. | Misses stale public architecture language and banned vocabulary leaks. | 6/10 |

**Why this one**: The packet is explicitly a continuation of 005, so using the same boundary keeps the cleanup coherent without expanding scope.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Command docs and YAML workflows align with the same public-surface rules as the skill references.
- Future auditors get a documented distinction between stale template terminology and legitimate runtime workflow terminology.

**What it costs**:
- Some grep hits require manual classification. Mitigation: record exemptions in implementation summary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legitimate runtime terminology is removed by mistake. | M | Read context and preserve actual YAML command semantics. |
| Stale wording survives because it does not match the exact grep. | M | Read files with hits and add current feature mentions during the sweep. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet 006 targets the remaining command/YAML surfaces not covered by packet 005. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives include broader and narrower boundaries. |
| 3 | **Sufficient?** | PASS | The chosen boundary covers all named stale deleted artifacts and public vocabulary risks. |
| 4 | **Fits Goal?** | PASS | It directly matches the user-supplied audit brief. |
| 5 | **Open Horizons?** | PASS | Exemption notes reduce future re-audit churn. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command Markdown and YAML assets are audited against the packet 005 stale-term boundary.
- Runtime workflow terminology exemptions are documented when encountered.

**How to roll back**: Revert the affected file hunks and rerun Gate A plus the relevant YAML or Markdown validation gate.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Validate Every YAML Modification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-02 |
| **Deciders** | Codex and user-supplied packet brief |

---

<!-- ANCHOR:adr-002-context -->
### Context

The YAML files are not passive documentation. They define command workflows, so a malformed scalar, indentation change, or step-order mutation could break command execution.

### Constraints

- Every YAML modification must pass PyYAML parse or an equivalent parser before final verification.
- Step IDs and ordering must remain stable.
- Round-trip changes should preserve structure; edits should target prose text and command strings only.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Validate each edited YAML file immediately and all 12 YAML files during final verification.

**How it works**: After each YAML patch, run `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" <YAML_FILE>`. If parsing fails, repair or revert the specific edit before moving to the next asset.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Immediate per-file parse** | Catches syntax defects at the source and keeps failures small. | Adds command overhead. | 10/10 |
| Parse only at the end | Faster during editing. | Harder to isolate the breaking hunk. | 5/10 |
| Rely on workflow-invariance only | Validates higher-level behavior. | May fail later and less clearly than a parser. | 4/10 |

**Why this one**: YAML syntax failures are cheap to catch early and expensive to debug after several files change.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- YAML edits have immediate syntax evidence.
- Workflow-invariance failures can focus on semantics rather than parse errors.

**What it costs**:
- More verification steps. Mitigation: keep parse commands focused and record pass counts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| PyYAML is unavailable locally. | M | Use an equivalent parser and document the substitution. |
| A parseable YAML edit still changes workflow meaning. | H | Preserve IDs/order and run workflow-invariance vitest. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | YAML assets drive command runtime workflows. |
| 2 | **Beyond Local Maxima?** | PASS | Compared immediate parse, final-only parse, and test-only validation. |
| 3 | **Sufficient?** | PASS | Parse checks plus workflow invariance cover syntax and structural regression. |
| 4 | **Fits Goal?** | PASS | The packet explicitly requires YAML parse validation after edits. |
| 5 | **Open Horizons?** | PASS | This policy is reusable for future command asset audits. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Edited YAML files receive immediate parse checks.
- Final Gate C parses all 12 command YAML assets.

**How to roll back**: Revert the failed YAML hunk, rerun the single-file parse, then rerun Gate C after all edits.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
