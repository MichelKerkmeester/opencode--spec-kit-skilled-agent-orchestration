---
title: Post-022 Review and Remediation Plan
status: Complete
---

# Plan — 002-skill-review-post-022

## 1. OVERVIEW

Deep review + remediation of system-spec-kit skill documentation drift caused by 022 root-packet normalization.

## 2. PHASES

### Phase 1: Deep Review (7 iterations)
- Dispatch 7 cli-copilot agents (4 codex 5.3 xhigh, 3 gpt 5.4 high) in waves of 2
- Cover all 4 dimensions: correctness, security, traceability, maintainability
- Produce review-report.md with finding registry

### Phase 2: Remediation (7 workstreams)
- WS-1: SKILL.md core (Gate 3 Option E, spec definition, ADR-001)
- WS-2: Structure references (phase-aware routing, PHASE_LINKS, examples)
- WS-3: Template references (Level 3+ coordination-root contract)
- WS-4: Validation references (metadata-table format, recursive paths, ADR, exemptions)
- WS-5: Security (redaction, governance params, filesystem boundaries)
- WS-6: Workflow references (phase-aware resume, worked examples)
- WS-7: Templates + assets (schema, routing, compliance contract)

### Phase 3: Verification + Rework
- GPT 5.4 review agent verification
- Consistency sweep for stale patterns (Gate 3, ADR filename, YAML phase example)

## 3. ESTIMATED SCOPE

- ~35 markdown files modified
- Documentation-only changes (no runtime code)
- SKILL.md version bump: 2.2.26.0 → 2.2.27.0
