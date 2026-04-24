---
title: "...mization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/001-canonical-save-invariants/plan]"
description: "Dispatch plan for the SSK-RR-2 deep-research iteration. Contains the canonical /spec_kit:deep-research :auto invocation + handoff criteria + output routing."
trigger_phrases:
  - "ssk-rr-2 dispatch plan"
  - "canonical save research plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/001-canonical-save-invariants"
    last_updated_at: "2026-04-18T17:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Dispatch plan scaffolded"
    next_safe_action: "Invoke /spec_kit:deep-research :auto"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Canonical-Save Pipeline Invariant Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown |
| **Framework** | sk-deep-research (canonical skill) |
| **Storage** | `026/research/019-system-hardening/001-initial-research/001-canonical-save-invariants/` (via `resolveArtifactRoot`) |
| **Testing** | `validate.sh --strict --no-recursive` post-convergence |

### Overview

Dispatch a single `/spec_kit:deep-research :auto` iteration on the canonical-save pipeline invariant research topic, with executor `cli-codex gpt-5.4 high fast`. The canonical workflow handles iteration scheduling, convergence detection, state persistence, and code-graph integration. This packet owns no iteration logic — only the dispatch + post-convergence verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent packet 019/001 charter approved
- [x] Scope + iteration budget captured in spec.md
- [ ] Parent packet 019/001 refactored for sub-packet coordination (in progress)

### Definition of Done

- [ ] `/spec_kit:deep-research :auto` converges
- [ ] the research.md output contains all required sections (Invariant Catalogue, Observed Divergences, Proposed Assertions, H-56-1 Verification)
- [ ] Code-graph convergence signal aligned with inline newInfoRatio stop vote
- [ ] Findings propagated to parent `019/001/implementation-summary.md §Findings Registry`
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Record scratch-doc SHA at dispatch time in parent `019/001/implementation-summary.md §Dispatch Log`.
- Confirm cli-codex availability.
- Ensure parent packet has scaffolded all 6 sub-packets before Wave 1 dispatch (parallel dispatch within wave OK; cli-codex has no concurrency cap).

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | Use canonical `/spec_kit:deep-research :auto` | Gate 4 HARD-block |
| AI-DISPATCH-002 | Do not touch iteration files or state JSONL directly | Canonical reducer owns them |
| AI-ESCALATE-001 | P0 findings trigger immediate parent continuity block update | REQ-003 |

### Status Reporting Format

- Start: dispatch timestamp + executor config
- Work: iteration count + convergence signal (read the deep-research-dashboard output)
- End: convergence verdict + finding count breakdown (P0/P1/P2)

### Blocked Task Protocol

1. If iteration exceeds budget without convergence, request extension OR accept partial convergence.
2. If canonical-save pipeline itself fails during research, record as P0 and halt Wave 2.
3. If executor fails, fall back to native per phase 017 ADR.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical sk-deep-research single-packet dispatch.

### Key Components

- **Dispatch command** (§4.1 below)
- **Canonical workflow YAML**: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Executor**: cli-codex via `executor-config.ts`
- **Output tree**: resolved via `resolveArtifactRoot(packetId, 'research')`
- **Convergence**: inline newInfoRatio + MAD noise floor + graph convergence signal
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold packet.
- [ ] Generate description.json + graph-metadata.json via `generate-context.js`.
- [ ] Parent packet 019/001 updated to reference this sub-packet.

### Phase 2: Implementation

- [ ] Dispatch `/spec_kit:deep-research :auto` with full executor config.
- [ ] Monitor dashboard for convergence signal.
- [ ] Record P0 findings immediately if surfaced.

### Phase 3: Verification

- [ ] Run `validate.sh --strict --no-recursive` on this packet.
- [ ] Read final the research.md output; confirm all required sections present.
- [ ] Propagate findings to parent registry.
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-research :auto "Canonical-save pipeline invariant research for system-spec-kit. Enumerate every state write performed by /memory:save across four layers: frontmatter _memory.continuity, description.json, graph-metadata.json.derived.*, memory vector index. Derive cross-layer invariants (e.g., description.json.lastUpdated == max(frontmatter last_updated_at)). Observe actual invariant holding across the 26 active 026-tree packets. Classify divergences as expected, benign, latent, or real. Verify H-56-1 fix scope (workflow.ts:1259 dead-code guard + :1333 plan-only gate). Propose validator assertions with migration notes for packet-local drift." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | This packet | `validate.sh --strict --no-recursive` |
| Convergence check | Iteration stream | `deep-research-state.jsonl` + the deep-research-dashboard output |
| Code-graph check | Per-iteration graph events | `deep_loop_graph_convergence` MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `/spec_kit:deep-research :auto` | Internal | Green |
| cli-codex executor | External | Green |
| Parent packet 019/001 | Internal | In progress (sub-packet refactor pending) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Iteration budget exhausted without convergence, or P0 finding halts Wave 2.
- **Procedure**: Preserve iteration evidence. Mark packet convergence as PARTIAL in `implementation-summary.md`. Parent packet decides whether to extend budget or defer.
<!-- /ANCHOR:rollback -->
