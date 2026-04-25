---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2"
title: "Checklist: Graph Impact and Affordance Uplift (012)"
description: "Phase-level verification checklist. Each sub-phase carries its own detailed checklist."
importance_tier: "important"
contextType: "implementation"
---
# Checklist: Graph Impact and Affordance Uplift (012)

<!-- SPECKIT_LEVEL: 3 -->

---

## P0 — License Posture (must complete before any code lands)

- [ ] Sub-phase 001 ADR records license assessment with explicit decision
- [ ] Clean-room rule articulated and signed off
- [ ] Allow-list of pattern-only adaptations published in 001 decision-record.md
- [ ] No External Project source code, schema text, or implementation logic copied into Public

---

## P1 — Ownership Boundaries (per pt-02 §13)

- [ ] Code Graph stays exclusive owner of structural code facts (002, 003)
- [ ] Memory does NOT store code/process/tool facts (005)
- [ ] Skill Advisor does NOT add a new scoring lane (004)
- [ ] Skill Advisor does NOT add new compiler entity_kinds (004)
- [ ] Cross-owner evidence flows only as translated summaries

---

## P1 — Safety Semantics

- [ ] `detect_changes` returns `status: blocked` when graph stale (002)
- [ ] `detect_changes` never returns `"no affected symbols"` on stale state (002)
- [ ] `blast_radius` enrichment surfaces ambiguity candidates instead of silent default-picking (003)
- [ ] Affordance-normalizer enforces allowlist before evidence reaches scorer (004)
- [ ] Recommendation payload preserves existing privacy guarantees (004)

---

## P2 — Display & Schema Discipline

- [ ] Memory trust badges read existing `causal-edges.ts:82-94` columns only — no schema change (005)
- [ ] Edge `reason`/`step` use existing JSON metadata column — no SQLite migration (003)
- [ ] No new relation types introduced in Memory (005)
- [ ] No new entity_kinds introduced in Skill Graph compiler (004)

---

## Phase-Level Verification

- [ ] Each sub-phase passes `validate.sh --strict`
- [ ] `backfill-research-metadata.js --apply` runs cleanly
- [ ] 026 root `graph-metadata.json` `children_ids` includes `010-graph-impact-and-affordance-uplift`
- [ ] `merged-phase-map.md` updated with 012 entry
- [ ] sk-doc DQI scoring on all umbrella docs (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE)
- [ ] Per-packet feature_catalog entries created in categories 03, 06, 11, 13, 14
- [ ] Per-packet manual_testing_playbook entries created in same categories
- [ ] `/spec_kit:deep-review:auto` pass on the completed phase, P0/P1 findings remediated

---

## Out of Scope (pt-02 explicit deferrals)

- [N/A] Route/tool/shape contract safety (pt-02 Packet 5) — deferred until Public has route extraction substrate
- [N/A] Mutating `rename` tool — explicitly rejected by pt-02
- [N/A] Memory↔CodeGraph evidence bridge — pt-02 narrows to "later, separate design"

---

## References

- spec.md §6 (risks)
- pt-02 §12 (risk plan), §13 (ownership contracts)
- per-sub-phase `checklist.md` files
