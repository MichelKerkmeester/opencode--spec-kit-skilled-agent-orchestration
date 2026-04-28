---
title: "Implementation Plan: Tier 2 Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Four-section plan grouped by Tier 2 source review: D (Copilot hook current-turn), E (plugin-loader doc drift), F (Copilot hook routing + cleanup), G (006/008 state hygiene). H deferred."
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/004-tier2-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 5
trigger_phrases:
  - "004-tier2-remediation"
  - "validator hygiene"
importance_tier: "normal"
contextType: "planning"
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Tier 2 Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, JSON, markdown |
| **Framework** | MCP server + OpenCode plugin bridge |
| **Storage** | None (config + doc edits) |
| **Testing** | Vitest, spec validator |

### Overview
15 actionable findings across 4 source review packets. Sections grouped by source; D and F both touch Copilot hook surface so cross-cite when relevant. Most findings are doc/config edits + verification — no large algorithm changes. The longest individual fix is REQ-005 (custom-instructions cleanup contract).

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source review reports exist + verdicts captured. Evidence: spec.md §1 metadata.
- [x] H deferral documented. Evidence: spec.md §3 Out of Scope.

### Definition of Done
- [ ] All 15 findings closed with file:line evidence in tasks.md / checklist.md.
- [ ] Each touched source packet's strict validator exits 0 (008/007, 009/005, 009/002, 006/008, this sub-phase).
- [ ] No regressions in existing focused test suites.

---

<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Tactical doc/config remediation, no architectural changes. Cross-cutting: the Copilot hook surface (D + F) is the only area where multiple findings overlap — coordinate REQ-001 (current-turn semantics) and REQ-004 (hook routing) so they don't conflict.

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Section D — 008/007 Copilot hook current-turn (REQ-001, REQ-002, REQ-009)

1. **REQ-001 decision**: investigate Copilot transport. If current-turn injection is technically achievable, implement it. Otherwise, accept one-turn-late as Copilot-specific limitation and update 008/007/spec.md to document the asymmetry vs Claude/Gemini/Codex (which inject current-turn). Recommend default: accept + document.
2. **REQ-002 checklist resolve**: open 008/007/checklist.md. For each `[ ]` item that the implementation-summary claims complete, mark `[x]` with file:line evidence. For items genuinely pending, leave `[ ]` and note in handover.
3. **REQ-009 verify** `@path` large-prompt behavior in `mcp_server/lib/deep-loop/executor-config.ts` and `buildCopilotPromptArg`. If untested, add a vitest fixture exercising the @path wrapper mode.

### Phase 2: Section E — 009/005 plugin-loader doc drift (REQ-003, REQ-010)

1. **REQ-003 path correction**: in 009/005/spec.md, decision-record.md, `implementation-summary.md`, replace stale `.opencode/plugin-helpers/` references with live `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/` paths. Preserve aliases only where explicit.
2. **REQ-010 P2 advisories**: read 009/005 review-report §3 finding registry; close each P2 with file:line citation in checklist.

### Phase 3: Section F — 009/002 Copilot hook routing + cleanup (REQ-004, REQ-005, REQ-011)

1. **REQ-004 routing**: investigate why `userPromptSubmitted` no longer routes through Spec Kit writer in current `.github/hooks/superset-notify.json` (or sibling). If unintentional, restore. If intentional (e.g., Superset migration), document the new transport in 009/002/decision-record.md with rationale.
2. **REQ-005 cleanup contract**: open the custom-instructions writer (`mcp_server/lib/hook/copilot/custom-instructions-writer.ts` or sibling). Add explicit cleanup contract: scope custom-instructions to project root (default), document per-session lifecycle, OR add deletion-on-session-end logic. Update spec.md to make the contract explicit.
3. **REQ-011 P2 advisories**: managed-block diagnostics improvements + cross-release cleanup story. Author or update relevant doc.

### Phase 4: Section G — 006/008 state hygiene (REQ-006, REQ-007, REQ-008, REQ-012, REQ-013)

1. **REQ-006 lifecycle state**: open 006/008/spec.md. Rewrite "planned to start" framing to reflect the completed 10-iter run (convergence 0.93, 0 P0, 1 P1, 17 P2). Move forward-looking text to a "next-iteration" section if applicable.
2. **REQ-007 metadata path drift**: open `006/008/description.json` and `006/008/graph-metadata.json`. Replace any `010-*` packet references with current `006-*` paths. Update spec.md frontmatter `packet_pointer` accordingly.
3. **REQ-008 sibling 007 contradictions**: open `006/007/{tasks,checklist,implementation-summary}.md`. The implementation-summary says complete; tasks/checklist still pending. Resolve by aligning to evidence: if 006/008's loop ran successfully and its findings reference 007 as complete, mark 007's pending tasks complete with backfilled evidence.
4. **REQ-012 acceptance criteria**: add explicit acceptance criteria to 006/008/spec.md so future loop reruns have a scope-readiness gate.
5. **REQ-013 research artifacts**: align research/log artifact references in spec.md with what's actually present in `006/008/research/`.

### Phase 5: Section H — DEFERRED (no work in this sub-phase)

Author `__tier2-h-deferred.md` at this sub-phase root documenting:
- The P0: canonical PolyForm-NC text was substituted for actual gitignored `external/LICENSE`.
- Why it can't be auto-remediated: cannot read a file that's gitignored without human providing it.
- Required human action: physically verify the actual shipped `external/LICENSE` matches PolyForm-NC OR confirm the project shipped without that file.
- Sibling impact: 002-005 packets were unblocked by the audit conclusion; if audit is invalid, they need re-audit.

---

<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validator | Each touched packet (008/007, 009/005, 009/002, 006/008) + this sub-phase | `validate.sh --strict` |
| Vitest | Existing focused suites of touched packets | Vitest |
| Manual | REQ-001 + REQ-004 require human eval of Copilot transport behavior | Manual smoke test |

---

<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Tier 2 D/E/F/G review reports | Green | All findings sourced from reports. |
| Existing focused test suites of touched packets | Green | Ensures no regression. |
| H human verification | NOT a blocker for THIS sub-phase | Tracked separately. |

---

<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Section D/E/F/G changes are isolated to specific files; revert per-section.
- REQ-005 (custom-instructions cleanup) has the most blast radius; make this its own commit.

<!-- /ANCHOR:rollback -->
