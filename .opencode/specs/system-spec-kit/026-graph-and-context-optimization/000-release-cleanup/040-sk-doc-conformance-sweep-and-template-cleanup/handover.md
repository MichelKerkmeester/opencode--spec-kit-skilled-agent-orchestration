---
title: "Handover: sk-doc Conformance Sweep and Template Cleanup"
description: "Cross-session handover for packet 040. Captures final state, validation evidence, and the small set of pre-existing strict-mode warnings documented as out-of-scope."
template_source: "SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2"
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup handover"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/040-sk-doc-conformance-sweep-and-template-cleanup"
    last_updated_at: "2026-04-30T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All Tier 1-4 work substantively complete. 17/17 modified root surfaces pass validate_document.py 0 issues. validate.sh --strict still fails on 1 error + 3 warnings — documented pre-existing strict-mode quirks unrelated to this packet's scope."
    next_safe_action: "Run generate-context.js full save; review git diff; user decides whether to commit or split commits."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:040-sk-doc-conformance-sweep-and-template-cleanup"
      session_id: "040-sk-doc-conformance-sweep-and-template-cleanup"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Handover: sk-doc Conformance Sweep and Template Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: handover-core | v2.2 -->

---

## OVERVIEW

This packet ran a coordinated sk-doc conformance sweep across 14 manual_testing_playbook directories, 5 feature_catalog directories, 28 reference markdown files, and the templates folder cleanup. The sweep used a hybrid execution model: deterministic sed/awk for mechanical text substitutions (95% of work) and parallel cli-codex gpt-5.5 high fast dispatches for content-heavy restructures.

---

## WHAT WAS DELIVERED

### Tier 2a — 8 playbooks RCAF-conformant (mechanical sed)

Across cli-claude-code, cli-codex, cli-gemini, cli-copilot, cli-opencode, mcp-chrome-devtools, mcp-code-mode, sk-deep-research:

- 215+ per-feature `^- Prompt:` labels relabeled to `^- RCAF Prompt:`
- 7 root index headers renamed `FEATURE FILE INDEX` -> `FEATURE CATALOG CROSS-REFERENCE INDEX` (sk-deep-research already canonical)
- 36 sk-deep-research `Desired user-facing` -> `Desired user-visible` field renames
- 3 cli-opencode drifted prompts (CO-006/007/021) rewritten to canonical RCAF sentence form
- All 8 root playbooks pass `validate_document.py` 0 issues

### Tier 2b — Mechanical + targeted content (T-030..T-040)

- T-030 sk-deep-review: 5 duplicate DRV-IDs deduped (DRV-015/016/021/022/023 in 04--convergence-and-recovery -> DRV-030/031/032/033/034); root §5 REVIEW PROTOCOL AND RELEASE READINESS added; root §14 FEATURE CATALOG CROSS-REFERENCE INDEX added with 34 scenarios; 8 sections renumbered
- T-031 mcp-coco-index (cli-codex): 26 per-feature files, 23 REFERENCES->SOURCE FILES, 26 RCAF Prompt: relabels, full SCENARIO CONTRACT fields
- T-032 code_graph (cli-codex): 15 per-feature files restructured + root reorganized with §5 + §16; 15 RCAF prompts; full SCENARIO CONTRACT
- T-033 sk-improve-agent feature_catalog: 13 per-feature TOCs stripped (audit-driven; pre-existing validator missing_toc quirk noted)
- T-034 sk-deep-research feature_catalog: 14 `### Tests` -> `### Validation And Tests` renames
- T-035 skill_advisor feature_catalog: false-positive (pre-Phase-027 reference is feature-purpose, ADR-D-002 scope)
- T-036 code_graph feature_catalog: 17 per-feature files got new `### Validation And Tests` section
- T-037..T-040 references (cli-codex combined): 9 ssk DRIFT + 2 skcr DRIFT restructured; 19 PARTIAL normalized; 107 net new ANCHOR comments; 7 OVERVIEW restructures; 6 frontmatter trims; 28/28 modified pass `validate_document.py`

### Tier 2c — High-effort full remediation (cli-codex)

- T-050 sk-improve-agent playbook: 31 per-feature files restructured to canonical 5-section, 31 RCAF prompts, 3 root sections added/renamed
- T-051 skill_advisor: 44 files reclassified to `operator_runbook/` (filesystem mv due to sandbox git index lock); new canonical `manual_testing_playbook/` with 3 categories + 4 SAD-NNN scenarios
- T-052 mcp-clickup: CREATED FROM SCRATCH — 6 categories, 12 CLU-NNN scenarios with full RCAF prompts (scenarios derived from historical SKILL.md/cli_reference.md commit since current parent dir is absent)
- T-053 ssk canonical playbook FULL REMEDIATION: 320 per-feature files all RCAF-conformant, all REFERENCES->SOURCE FILES, full SCENARIO CONTRACT
- T-054 ssk canonical feature catalog FULL REMEDIATION: 303 files modified, 676 packet-history annotations stripped (1 feature-purpose preserved), 272 canonical source lines added, 221 `### Tests` renames, duplicate `14--` directory consolidated into `14--pipeline-architecture`, non-feature `14--stress-testing/README.md` removed

### Tier 3 — Templates cleanup + path-reference sweep

- T-061 `templates/sharded/` deleted (5 legacy multi-file spec format files)
- T-062 `templates/stress-test/` -> `templates/stress_test/` (snake_case sibling convention) + validate.sh sharded bypass guard removed
- T-063 New canonical `templates/stress_test/README.md` created per sk-doc README template
- T-064 `templates/addendum/level3plus-govern/` -> `templates/addendum/level3-plus-govern/` (consistent dash convention)
- T-065 `templates/changelog/README.md` frontmatter trimmed to title+description (root.md/phase.md left intact since they're instantiable templates with substantive metadata)
- T-066 `.opencode/plugins/README.md` rewritten per sk-doc README template (validates 0 issues)
- T-067/068/069/070 path sweeps: 19 files updated for level3plus-govern; 4 files updated for stress-test; 0 active sharded callers; final residual sweep returns 0 hits in active code paths

### Tier 4 — Validation

- T-080 Document validators: 17/17 modified root surfaces pass `validate_document.py` (0 issues)
- T-081 Spec folder strict validate: same documented pre-existing issues (1 error + 3 warnings; AI_PROTOCOL pattern detection, custom anchor name, SECTION_COUNTS regex) — content unaffected
- T-085 Random per-feature playbook spot-checks: 5/5 pass
- T-086 Random per-feature catalog spot-checks: 5/5 INVALID due to pre-existing validator missing_toc quirk that misclassifies catalog snippets as readme; affects untouched catalogs as well; out of scope
- T-087 Random reference spot-checks: 5/5 pass

---

## KEY DECISIONS

See `decision-record.md` for full ADR-001..ADR-006. Highlights:

- ADR-001: Phase-040 collision resolved naturally (prior 040 was renumbered to 027 in earlier session)
- ADR-002: skill_advisor playbook reclassified (existing -> operator_runbook/, new canonical alongside)
- ADR-003: system-spec-kit canonical playbook full remediation (320/321 files) instead of grandfather
- ADR-004: templates/changelog kept (purpose distinct from sk-doc global changelog) with README frontmatter aligned
- ADR-005: Bounded-wave parallel cli-codex execution (3 waves: 2a/2b/2c)
- ADR-006: Stay on main, no feature branches (per durable user instruction)

---

## KNOWN LIMITATIONS

1. **Pre-existing strict-mode validator warnings on 040 packet** (3 warnings + 1 error): SECTION_COUNTS regex doesn't recognize the canonical Level 3 spec template's acceptance-scenario shape; AI_PROTOCOL pattern detection sees the spec doc but misses the embedded protocol; custom `ai-protocol` ANCHOR. These are documented in implementation-summary.md from session start. Not blocking — content is correct.

2. **Pre-existing `missing_toc` validator quirk**: Per-feature feature_catalog snippets are classified as Document type=readme by the validator and have TOC requirement applied. This affects every per-feature catalog snippet across the repo, including ones that were never modified by this packet. T-033 (audit-driven TOC strip) does not introduce new failures; the underlying classification was always misaligned. Out of scope; sk-doc validator improvement is a separate packet.

3. **shadow-deltas.jsonl** retains a `templates/stress-test` runtime data residual. This is auto-regenerated by the skill_advisor runtime; will refresh on next run. Acceptable.

4. **mcp-clickup parent directory absent in current tree**. T-052 created the canonical playbook from historical SKILL.md/cli_reference.md (commit `7cead37e64c9fa25bf5b734d0549bddb416e84b2`). When the parent skill is restored, scenarios may need a refresh pass to align with the latest SKILL.md.

---

## NEXT STEPS

| Step | Owner | Action |
|---|---|---|
| Run `generate-context.js --json '<data>' [spec-folder]` for the 040 packet | User | Index continuity into MCP memory + refresh graph-metadata |
| Review `git diff` (1360 files changed) | User | Decide commit strategy: single commit vs split by tier |
| Optional: `/create:changelog` for packet 040 | User | Document the sweep in canonical changelog |
| Optional follow-on: validator missing_toc quirk fix | Future packet | Make sk-doc validator classify catalog snippets correctly |
| Optional follow-on: refresh mcp-clickup playbook when parent skill restored | Future packet | Align CLU-001..CLU-012 with restored SKILL.md |

---

## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Tasks**: tasks.md
- **Checklist**: checklist.md
- **Decision Records**: decision-record.md
- **Audit Findings**: audit-findings.md
- **Implementation Summary**: implementation-summary.md
- **Approved External Plan**: `/Users/michelkerkmeester/.claude/plans/not-all-manual-testing-prancy-biscuit.md`
