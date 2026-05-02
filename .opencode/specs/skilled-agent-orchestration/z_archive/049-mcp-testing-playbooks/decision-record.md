---
title: "Decision Record: MCP Testing Playbooks for Four Skills"
description: "Architecture decisions for spec 049: filename casing, CCC disposition, flat Level-3 packet, CM-first sequencing, real-env smoke runs."
trigger_phrases:
  - "049 decisions"
  - "mcp playbook decisions"
  - "ADR-001 filename casing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Recorded ADR-001..ADR-005 from plan-mode review"
    next_safe_action: "Author research.md with Phase-1 inventory"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---

# Decision Record: MCP Testing Playbooks for Four Skills

This document captures architectural decisions made during plan-mode design (2026-04-26) for spec 049. Each ADR follows the standard format: Status, Context, Decision, Consequences, Alternatives Rejected.

---

## ADR-001: Root playbook filename casing — adopt observed-precedent lowercase

**Status**: Accepted (2026-04-26, confirmed by user)

**Context**: The sk-doc standards reference at `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` (lines 26, 75) prescribes `MANUAL_TESTING_PLAYBOOK.md` (uppercase). The root playbook template's contract section also references `MANUAL_TESTING_PLAYBOOK.md`. However, all 5 in-tree playbooks use lowercase `manual_testing_playbook.md`:

- `.opencode/skill/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`

This is a doc-vs-practice divergence that has persisted across multiple shipped playbooks.

**Decision**: Adopt lowercase `manual_testing_playbook.md` for all 3 new playbooks (CM, BDG, CU) created in spec 049. Standardizing on the observed precedent preserves link compatibility with the existing CCC playbook's per-feature relative links (which reference `manual_testing_playbook.md`) and avoids creating the first divergent name.

**Consequences**:
- + Consistent naming across all 7 future in-tree playbooks (5 existing + 3 new from spec 049, with CCC unchanged from existing)
- + No need to rename or update relative links in the existing CCC playbook
- + Aligns with what new operators will see when copying from precedent
- − Standards reference doc remains divergent until a follow-on cleanup updates it
- − Future contributors reading the standards-doc may apply uppercase incorrectly

**Mitigation**: Track standards-reference reconciliation as a follow-on task (out of scope for spec 049). When that cleanup runs, also update the snippet template's section 9 reference to lowercase.

**Alternatives Rejected**:

- *Adopt uppercase per standards doc*: Would diverge from every shipped example, require renaming the existing CCC playbook (breaks links from per-feature files), and create a 1-of-7 inconsistency
- *Punt on the question and use whatever the validator accepts*: Validator accepts either; lack of decision creates ambiguity for future maintainers

---

## ADR-002: mcp-coco-index disposition — audit only, no rewrite

**Status**: Accepted (2026-04-26)

**Context**: The existing `mcp-coco-index/manual_testing_playbook/` package (23 scenarios, 7 categories) is current and in-spec. Phase-1 exploration found no broken IDs, no missing 5-section per-feature files, and no contract violations. The user's literal request was "create a testing_playbook for every MCP skill" including CCC, but mechanically rewriting an existing healthy playbook risks: (a) breaking the 23 existing per-feature file links, (b) renumbering frozen IDs that may be referenced from external evidence logs, (c) freshening prose without functional gain.

**Decision**: Treat CCC as **audit-only**. Read the existing root + per-feature files, diff against the Phase-1 test-data inventory captured in research.md (concurrent `refresh_index` race, daemon socket health, env-var precedence, voyage_code_3 reset cycle, doctor.sh / ensure_ready.sh wrappers, COCOINDEX_CODE_ROOT_PATH override). If 0 confirmed gaps: mark complete with explicit `[]` in research.md. If 1-3 confirmed gaps: append per-feature files at the next free numeric slot in the matching existing category — do not renumber, do not rewrite the root.

**Consequences**:
- + Preserves 23 existing IDs and their per-feature files unchanged
- + Saves ~2-3 hours of authoring effort for content that already exists
- + Honest scope: spec 049 is "3 new playbooks + 1 audit," not "4 new playbooks"
- − If audit identifies many gaps (>3), need a follow-on decision about whether to do a deeper refresh
- − Operator-facing experience for CCC stays unchanged; no "freshness" signal in last-updated timestamp

**Mitigation**: research.md gap inventory is dated and explicit; future maintainers can compare against later inventories to track surface drift.

**Alternatives Rejected**:

- *Refresh CCC playbook in full*: Rewriting prose without ID changes adds churn without functional gain; risk of subtle introduction of contract drift
- *Skip CCC entirely*: User asked for "every MCP skill"; an explicit audit decision satisfies the spirit of the request without unnecessary file churn
- *Create a parallel "CCC v2" playbook*: Confuses operators about which one is canonical; no precedent for versioned playbook coexistence

---

## ADR-003: Spec 049 packet shape — flat Level-3, no phase folders

**Status**: Accepted (2026-04-26)

**Context**: Spec 049 covers 4 MCP skills. The system-spec-kit phase-folder pattern (`001-mcp-chrome-devtools/spec.md`, `002-mcp-clickup/spec.md`, etc.) exists for cases where each phase has its own architectural decisions, dependencies, and risk surface — like specs 022, 023, 026, 037 in spec-kit history. Spec 049 is "apply the same uniform sk-doc playbook contract to 4 skills." Same template, same gates, same validator, no inter-phase architectural divergence.

**Decision**: Use a flat Level-3 spec packet. Single spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research.md at the spec root. Tasks.md is partitioned into 6 phases (Scaffold, CM, BDG, CU, CCC audit, Verify) by H2 header, not by sub-folders.

**Consequences**:
- + 4× scaffold cost saved (would otherwise need 4 sub-spec.md, 4 sub-plan.md, 4 sub-tasks.md...)
- + Single decision-record covers the cross-cutting ADRs (filename casing, CCC disposition) that apply to all 4 skills
- + Easier to validate (one strict-validate pass for the spec packet)
- − Less isolation between skill workstreams; if one skill's authoring fails catastrophically it could block the spec
- − Larger spec files (more content per file)

**Mitigation**: Phase tags in tasks.md provide logical separation. Per-skill authoring failures isolate to that skill's playbook folder; spec docs unaffected.

**Alternatives Rejected**:

- *Phased spec with 4 sub-folders*: 4× scaffold cost for zero isolation gain since no architectural divergence between skills
- *4 separate spec packets (049, 050, 051, 052)*: Loses the cross-cutting decision context; future maintainers can't see why all 4 chose lowercase filename together

---

## ADR-004: Authoring sequence — CM first, then BDG and CU in parallel, then CCC audit

**Status**: Accepted (2026-04-26)

**Context**: Authoring order matters because BDG and CU per-feature files cross-reference CM scenarios. Specifically:
- BDG-014..BDG-018 (MCP parallel-instance scenarios) reference CM-005..CM-007 (manual-namespace contract)
- BDG-014..BDG-018 also reference CM-014 (ClickUp-via-CM) for the cross-skill integration pattern
- CU-017..CU-019 (MCP bulk operations) reference CM-011 (sequential chain) and CM-012 (Promise.all parallel)

If CM is authored last (the original draft proposed BDG → CU → CM → CCC), the BDG and CU per-feature files would either reference IDs that don't exist yet (broken on first commit) or use placeholder text that requires a second pass.

**Decision**: CM first → freeze CM-001..CM-026 IDs → BDG and CU in parallel (no inter-dependency) → CCC audit (parallel-safe with BDG/CU). Once CM IDs are stable, BDG and CU author independently and reference CM scenarios by stable ID.

**Consequences**:
- + No broken cross-references on first commit
- + BDG and CU can be authored in parallel safely
- + CCC audit runs anytime after Phase 1 (no dependency on CM/BDG/CU)
- − Caller of spec 049 must wait for CM (~2-3 hours) before starting BDG/CU
- − If CM scope expands during authoring, IDs may shift — but freeze rule (T021) catches this

**Mitigation**: Plan agent validated this sequence. T021 explicitly freezes CM-001..CM-026 before T030 (BDG start).

**Alternatives Rejected**:

- *BDG → CU → CM → CCC* (original draft): Inverts the cross-reference dependency direction; would force broken links or placeholder cleanup
- *All 3 skills authored in parallel*: ID coordination would be brittle; first-commit cross-refs likely broken

---

## ADR-005: V7 smoke run scope — all 4 against real environments

**Status**: Accepted (2026-04-26, confirmed by user)

**Context**: The playbook contract requires every scenario to be runnable end-to-end ("EXECUTION POLICY: every scenario MUST be executed for real — not mocked, not stubbed"). V7 smoke runs validate that at least one scenario per playbook actually works in a real environment. The four candidates:
- CM-001 (local list_tools) — local only, no network
- BDG-001 (install/version + session start) — needs Chrome/Chromium installed
- CU-001 (install/version + auth) — needs ClickUp API token + workspace
- CCC-001 (project initialization) — local, runs against existing index

Two alternative scopes were considered: (a) all 4 against real env, (b) only the 2 local-safe ones (CM + CCC).

**Decision**: All 4 against real environments. CM-001 local; BDG-001 against installed Chrome; CU-001 against live ClickUp workspace using throwaway test data; CCC-001 against the project's existing CocoIndex index.

**Consequences**:
- + Strongest evidence that the playbook contract is real (commands actually work)
- + Catches credential/install issues operators would hit on day 1
- − Requires operator to have ClickUp API token + Chrome installed (sandbox blockers if absent → SKIP per execution policy)
- − Risk of accidentally writing to production ClickUp data — mitigated by "test workspace only" rule and create-then-delete pattern
- − BDG smoke generates a real Chrome process (briefly); easy to forget to clean up — handled by `bdg stop` step in scenario

**Mitigation**: Smoke-run instructions in implementation-summary.md will explicitly call out the credential and cleanup requirements before each step; pause for operator confirmation before any network/credential-using command.

**Alternatives Rejected**:

- *Only CM + CCC (local-safe)*: Leaves BDG and CU smoke unexercised; risk of shipping commands that don't actually work
- *No smoke runs at all*: Violates the playbook's EXECUTION POLICY rule; would let bad commands ship to operators
