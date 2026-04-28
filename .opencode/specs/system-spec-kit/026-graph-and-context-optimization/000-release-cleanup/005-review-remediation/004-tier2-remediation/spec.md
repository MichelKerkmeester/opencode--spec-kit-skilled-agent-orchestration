---
title: "Feature Specification: Tier 2 Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Close 8 P1 + 7 P2 findings from the Tier 2 deep-review program (D 008/007, E 009/005, F 009/002, G 006/008). Tier 2 H (006/001 license audit P0) is deferred to human verification — cannot auto-remediate canonical-text substitution gap."
trigger_phrases:
  - "004-tier2-remediation"
  - "tier 2 review remediation"
  - "copilot hook current turn"
  - "plugin loader doc drift"
  - "deep research review state hygiene"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-tier2-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Tier 2 Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `005-review-remediation` |
| **Source reviews** | D 008/007 hook-surface, E 009/005 plugin-loader, F 009/002 copilot-hook-parity, G 006/008 deep-research-review (all CONDITIONAL) |
| **Source verdicts** | 4 × CONDITIONAL = 8 P1 + 7 P2 = 15 actionable findings |
| **Tier 2 H scope** | DEFERRED — license audit P0 needs human verification of actual `external/LICENSE`; documented as Out of Scope §3 |

---

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tier 2 deep-review program reviewed 5 packets (D-H). Four returned CONDITIONAL with actionable findings; one (H 006/001 clean-room license audit) returned FAIL with a P0 that requires human verification of the actual gitignored `external/LICENSE` file. This sub-phase closes the 15 findings from D/E/F/G; H is tracked separately as a human-action gate.

The four review verdicts:

1. **D — 008/007 skill-advisor hook surface (CONDITIONAL, P1=2 P2=1)**: Copilot advisor brief is one prompt LATE — written into custom-instructions Copilot reads on the NEXT prompt, not current-turn equivalent like Claude/Gemini/Codex. Plus release-claim vs pending-checklist mismatch.
2. **E — 009/005 OpenCode plugin loader (CONDITIONAL, P1=1 P2=2)**: Loader code sound; canonical packet evidence claims helpers in `.opencode/plugin-helpers/` while live code uses `mcp_server/plugin_bridges/`. Doc traceability drift only.
3. **F — 009/002 Copilot hook parity (CONDITIONAL, P1=2 P2=2)**: Live Copilot hook config no longer routes `userPromptSubmitted` through Spec Kit writer; global custom-instructions block has no cleanup or scoping contract across sessions.
4. **G — 006/008 deep-research-review (CONDITIONAL, P1=3 P2=2)**: Packet ALREADY ran a 10-iter loop (convergence 0.93, 0 P0, 1 P1, 17 P2) — state hygiene contradictions: lifecycle state contradicts "start premise" framing, metadata path drift `010→006`, sibling 007 contradictions.

### Purpose
Close the 15 actionable Tier 2 findings to move D/E/F/G from CONDITIONAL toward PASS. H is intentionally deferred — see §3 Out of Scope.

---

<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (D 008/007 hook-surface)
- Fix Copilot advisor brief one-turn-late behavior so it satisfies same-current-turn semantics, OR explicitly accept one-turn-late as a documented Copilot-specific limitation in spec.md.
- Reconcile release-claim vs pending-checklist mismatch (mark checklist items complete with file:line evidence).
- Verify `buildCopilotPromptArg` large-prompt `@path` behavior (P2 advisory).

### In Scope (E 009/005 plugin-loader)
- Update canonical packet evidence (spec.md / decision-record.md / implementation-summary.md) from stale `.opencode/plugin-helpers/` to live `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/` paths.
- Close any related P2 advisories (typically test-fixture or doc consistency).

### In Scope (F 009/002 copilot-hook)
- Restore Copilot hook config routing for `userPromptSubmitted` through Spec Kit writer, OR document the new transport.
- Add cleanup/scoping contract for the global home-level custom-instructions block (per-session lifecycle, deletion on session end, OR scoped to project root).
- Close P2 advisories (managed-block diagnostics + cleanup story across releases).

### In Scope (G 006/008 deep-research-review)
- Reconcile lifecycle state: packet has a completed 10-iter run; spec.md should reflect "complete" not "planned to start".
- Refresh metadata path drift `010→006` in description.json + graph-metadata.json + spec.md frontmatter.
- Resolve sibling 007 contradictory completion signals (either tasks/checklist mark complete or impl summary marks pending — pick one).

### Out of Scope (Tier 2 H deferred)
- **H 006/001 clean-room license audit P0**: the audit substituted canonical PolyForm-NC text for the gitignored actual `external/LICENSE` then marked complete. Cannot auto-remediate — needs human to physically verify the actual shipped license file (or confirm it doesn't exist on disk and the project shipped without it). Tracked in `__tier2-h-deferred.md` at this sub-phase root.

### Files to Change

| File | Change Type | Source finding |
|------|-------------|----------------|
| `mcp_server/skill_advisor/lib/hook/copilot/` (or wrapper) | Modify | D-P1-001 (current-turn semantic fix) |
| 008-skill-advisor/007-skill-advisor-hook-surface/checklist.md | Modify | D-P1-002 (mark items + evidence) |
| 008-skill-advisor/007-skill-advisor-hook-surface/spec.md | Modify | D-P1-001 (document Copilot limitation if accepting) |
| `mcp_server/lib/deep-loop/executor-config.ts` (or related) | Verify | D-P2-001 (`@path` behavior) |
| 009-hook-parity/005-opencode-plugin-loader-remediation/spec.md | Modify | E-P1-001 (path correction) |
| 009-hook-parity/005-opencode-plugin-loader-remediation/decision-record.md | Modify | E-P1-001 |
| 009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md | Modify | E-P1-001 |
| `.github/hooks/superset-notify.json` (or sibling) | Modify | F-P1-001 (Copilot hook routing) |
| `mcp_server/lib/hook/copilot/custom-instructions-writer.ts` (or sibling) | Modify | F-P1-002 (cleanup/scoping contract) |
| 006-graph-impact-and-affordance-uplift/008-deep-research-review/spec.md | Modify | G-P1-001 (lifecycle state) |
| `006-graph-impact-and-affordance-uplift/008-deep-research-review/description.json` | Modify | G-P1-002 (metadata path) |
| `006-graph-impact-and-affordance-uplift/008-deep-research-review/graph-metadata.json` | Modify | G-P1-002 |
| `006-graph-impact-and-affordance-uplift/007-review-remediation/{tasks,checklist,implementation-summary}.md` | Modify | G-P1-003 (sibling contradiction resolve) |
| `__tier2-h-deferred.md` (this sub-phase root) | Create | H-P0 documentation |

---

<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none in this sub-phase; H P0 deferred to human)

### P1 — Required

| ID | Requirement | Source |
|----|-------------|--------|
| REQ-001 | Copilot advisor brief either delivers current-turn equivalent OR spec.md explicitly accepts one-turn-late as a documented Copilot limitation. | D-P1-001 |
| REQ-002 | 008/007 release-claim vs pending-checklist mismatch resolved (checklist marked with evidence OR release status downgraded). | D-P1-002 |
| REQ-003 | 009/005 plugin-loader docs use live `mcp_server/plugin_bridges/` path; stale `.opencode/plugin-helpers/` references removed or marked legacy alias. | E-P1-001 |
| REQ-004 | Copilot hook config routes `userPromptSubmitted` through Spec Kit writer OR new transport documented. | F-P1-001 |
| REQ-005 | Global custom-instructions block has explicit cleanup/scoping contract (per-session lifecycle, deletion on session end, OR scoped to project root). | F-P1-002 |
| REQ-006 | 006/008 deep-research-review spec.md reflects completed-loop status (convergence 0.93). | G-P1-001 |
| REQ-007 | 006/008 metadata path drift `010→006` corrected in description.json + graph-metadata.json + spec.md frontmatter. | G-P1-002 |
| REQ-008 | 006/007 sibling contradictions resolved (pick: complete OR pending; align tasks/checklist/implementation-summary). | G-P1-003 |

### P2 — Required (advisories from reviews)

| ID | Requirement | Source |
|----|-------------|--------|
| REQ-009 | `buildCopilotPromptArg` large-prompt `@path` behavior verified or test-covered. | D-P2-001 |
| REQ-010 | 009/005 P2 advisories closed (typically test-fixture / doc consistency). | E-P2-001, E-P2-002 |
| REQ-011 | 009/002 managed-block diagnostics improved (cleanup story across releases documented). | F-P2-001, F-P2-002 |
| REQ-012 | 006/008 acceptance criteria added to spec.md (scope-readiness gate). | G-P2-001 |
| REQ-013 | 006/008 research artifacts (logs) referenced consistently with the artifact contract. | G-P2-002 |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 actionable Tier 2 findings (D/E/F/G) closed or explicitly deferred with sign-off in implementation-summary.md.
- **SC-002**: H P0 documented in `__tier2-h-deferred.md` with required human-verification steps.
- **SC-003**: Strict packet validator passes for this sub-phase AND for each touched source packet (008/007, 009/005, 009/002, 006/008).
- **SC-004**: No regressions in existing focused test suites of touched packets.

### Acceptance Scenarios

1. **Given** D 008/007 is reviewed, when the packet is replayed, then Copilot next-prompt semantics and checklist evidence are documented.
2. **Given** E 009/005 is reviewed, when canonical docs are searched, then stale plugin-helper paths are absent from non-review docs.
3. **Given** F 009/002 is reviewed, when Copilot hooks run, then repo-local wrappers execute before optional Superset notification.
4. **Given** G 006/008 is reviewed, when the spec is opened, then it reflects the completed 10-iteration loop and convergence 0.93.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | REQ-001 (Copilot current-turn) may not be technically achievable given Copilot's transport — write-then-read-next-prompt is fundamental. | High | If can't achieve current-turn parity, EXPLICITLY accept the one-turn-late behavior as a documented Copilot-specific limitation and update spec.md plus 4-runtime parity claims to call out the asymmetry. |
| Risk | REQ-004 (Copilot hook routing) may have been intentionally re-routed for a separate reason — overriding could break a downstream concern. | Medium | Verify routing change rationale before reverting; if intentional, document the new contract. |
| Dependency | None blocking — all 5 Tier 2 reviews are final reports. | — | — |

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- For REQ-001: do we ship Copilot with one-turn-late advisor (accept the asymmetry) or invest in a current-turn workaround? Default: accept + document, since the one-turn-late behavior is a Copilot transport limitation.
- For REQ-005: scope custom-instructions to project root, or per-session cleanup on every termination? Default: project-root scope, since per-session cleanup adds risk of losing user-relevant content.
- For REQ-008 (006/007 sibling contradictions): treat as complete (since 006/008 confirms the loop ran) or pending? Default: align with 006/008 evidence — mark 007 complete with backfilled evidence.

---

<!-- /ANCHOR:questions -->
### Related Documents

- **Tier 2 D review report**: `../../../008-skill-advisor/007-skill-advisor-hook-surface/review/007-skill-advisor-hook-surface-tier2-pt-01/review-report.md`
- **Tier 2 E review report**: `../../../009-hook-parity/005-opencode-plugin-loader-remediation/review/005-opencode-plugin-loader-remediation-tier2-pt-01/review-report.md`
- **Tier 2 F review report**: `../../../009-hook-parity/002-copilot-hook-parity-remediation/review/002-copilot-hook-parity-remediation-tier2-pt-01/review-report.md`
- **Tier 2 G review report**: `../../../006-graph-impact-and-affordance-uplift/008-deep-research-review/review/008-deep-research-review-tier2-pt-01/review-report.md`
- **Tier 2 H deferred** (P0 needs human action): `../../../006-graph-impact-and-affordance-uplift/001-clean-room-license-audit/review/001-clean-room-license-audit-tier2-pt-01/review-report.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
