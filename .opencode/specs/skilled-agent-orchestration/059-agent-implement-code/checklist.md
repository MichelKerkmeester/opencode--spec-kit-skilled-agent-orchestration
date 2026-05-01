<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
---
title: "Verification Checklist: @code Sub-Agent [template:level_3/checklist.md]"
description: "QA gates for spec scaffolding, research convergence, agent authoring, sibling-doc sync, and final validation. Mark [x] with evidence per CLAUDE.md COMPLETION VERIFICATION RULE."
trigger_phrases:
  - "code agent checklist"
  - "@code verification"
  - "phase parent validation"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration/059-agent-implement-code"
    last_updated_at: "2026-05-01T18:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Restructured to canonical Verification Protocol / Pre-Implementation / Code Quality / Testing / Security / Documentation / File Organization / Verification Summary headers"
    next_safe_action: "Mark gates [x] with evidence as Phase 3 closes out"
    blockers: []
    key_files:
      - .opencode/skill/system-spec-kit/scripts/spec/validate.sh
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---

# Verification Checklist: @code Sub-Agent

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

Verification Date: 2026-05-01

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark each item `[x]` with **evidence**: file path + line range, command output, or specific verification action. Per CLAUDE.md, all items must be `[x]` before claiming completion.

Per CLAUDE.md COMPLETION VERIFICATION RULE: this checklist must be loaded and ALL items marked `[x]` with evidence BEFORE claiming completion. Skip not allowed for Level 3.

Per memory rule "Stay on main, no feature branches": if `create.sh` auto-branched at any phase, switched back to main and deleted the packet branch (carrying any uncommitted changes; cherry-picking orphan commits if needed).

Per memory rule "Stop over-confirming": no A/B/C menus during execution; obvious next steps proceed without confirmation.

Per memory rule "Legacy code/docs must be DELETED, not archived or commented out": physical `rm -f`/`rm -rf`; never z_archive/.bak/.old/_deprecated; never tombstone or stub-with-redirect.

---

<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Spec scaffolding gates (Phase 1).

- [x] [P0] Spec folder `059-agent-implement-code/` exists at parent path. [EVIDENCE: `specs/skilled-agent-orchestration/059-agent-implement-code/`]
- [x] [P0] All six spec docs present: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md. [EVIDENCE: `ls` confirms all six files at packet root.]
- [x] [P0] description.json exists and is valid JSON. [EVIDENCE: `specs/skilled-agent-orchestration/059-agent-implement-code/description.json` parses cleanly.]
- [x] [P0] graph-metadata.json exists with required fields (status, purpose, children_ids, lastUpdated). [EVIDENCE: `specs/skilled-agent-orchestration/059-agent-implement-code/graph-metadata.json` carries the required keys.]
- [x] [P0] Parent 022 graph-metadata.json registers child: `children_ids` includes `059-agent-implement-code`; `derived.last_active_child_id` set. [EVIDENCE: parent `022-mcp-coco-integration/graph-metadata.json` updated during Phase 1.]
- [x] [P0] Parent 022 description.json reflects child registration. [EVIDENCE: parent `022-mcp-coco-integration/description.json`.]
- [x] [P0] context-index.md at parent level documents phase-parent transition. [EVIDENCE: `022-mcp-coco-integration/context-index.md`.]
- [ ] [P0] `validate.sh --strict` exits 0 on 059 packet. [EVIDENCE: Phase 3 final pass — see Verification Summary below.]
- [x] [P0] If validator complains about parent's heavy docs, option B (rename to sibling `001-cocoindex-install/`) executed OR rationale recorded. [EVIDENCE: Not triggered; parent already cleaned.]

---

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

Agent authoring + routing-table gates (Phase 3, T027–T031).

- [x] [P0] `.opencode/agent/code.md` exists. [EVIDENCE: `ls -la .opencode/agent/code.md` returns the authored file (~120 lines).]
- [x] [P0] code.md frontmatter matches ADR-2: `name: code`, `mode: subagent`, `temperature: 0.1`, `permission.write: allow`, `permission.edit: allow`, `permission.patch: allow`, `permission.bash: allow`, `permission.task: deny`, `permission.webfetch: deny`. [EVIDENCE: `.opencode/agent/code.md:1-20`.]
- [x] [P0] Body §0 ILLEGAL NESTING present. [EVIDENCE: `.opencode/agent/code.md` §0.]
- [x] [P0] Body §0 DISPATCH GATE present per ADR-3 convention-floor (refuses on missing orchestrator-context marker). [EVIDENCE: `.opencode/agent/code.md` §0 callout block.]
- [x] [P0] Body §1 CORE WORKFLOW has 6 steps per ADR-5; VERIFY (step 5) is fail-closed. [EVIDENCE: `.opencode/agent/code.md` §1.]
- [x] [P0] Body §1 includes `Skills Used` table delegating to `sk-code` per ADR-4. [EVIDENCE: `.opencode/agent/code.md` §1 Skills Used.]
- [x] [P0] Body §1 STACK DELEGATION delegates to sk-code; UNKNOWN/ambiguous escalation present. [EVIDENCE: `.opencode/agent/code.md` §1 Stack Delegation Contract.]
- [x] [P0] Body §2 SCOPE BOUNDARIES includes Bash-bypass warning. [EVIDENCE: `.opencode/agent/code.md` §2.]
- [x] [P0] Body §3 ESCALATION & RETURN CONTRACT structured (RETURN format with files | verification | escalation classifier). [EVIDENCE: `.opencode/agent/code.md` §3.]
- [ ] [P0] `.opencode/agent/orchestrate.md` §2 routing table includes `@code` row. [EVIDENCE: Phase 3 T028.]

---

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

Smoke test gates (Phase 3, T032–T033).

- [ ] [P0] Orchestrator dispatch test: `@orchestrate` calls `@code` with trivial task; sk-code auto-loads via body delegation; file edit succeeds; verification summary returned in canonical RETURN format. [EVIDENCE: Smoke-test prompt documented in `implementation-summary.md` §Verification; ready for live execution post-merge.]
- [ ] [P0] Direct-call refusal test: `@code` invoked without orchestrator marker; §0 DISPATCH GATE returns canonical REFUSE message (D3 convention-floor). [EVIDENCE: Smoke-test prompt documented in `implementation-summary.md` §Verification; ready for live execution post-merge.]
- [ ] [P0] Multi-stack edge case: stack-ambiguous task escalates to orchestrator with `UNKNOWN_STACK` (no guess-implement). [EVIDENCE: Documented in `implementation-summary.md` §Verification.]
- [ ] [P0] Verification-failure case: implementation that breaks verification returns `VERIFY_FAIL` summary; no internal retry. [EVIDENCE: Documented in `implementation-summary.md` §Verification (fail-closed contract per ADR-5).]

---

<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

Permission posture + scope-lock gates.

- [x] [P0] `permission.task: deny` set — agent cannot dispatch sub-agents. [EVIDENCE: `.opencode/agent/code.md` frontmatter.]
- [x] [P0] `permission.external_directory: deny` set — agent cannot write outside repo. [EVIDENCE: `.opencode/agent/code.md` frontmatter.]
- [x] [P0] `permission.webfetch: deny` set — agent cannot pull external URLs. [EVIDENCE: `.opencode/agent/code.md` frontmatter.]
- [x] [P0] `permission.chrome_devtools: deny` set — agent cannot drive a browser. [EVIDENCE: `.opencode/agent/code.md` frontmatter.]
- [x] [P0] §2 Scope Boundaries explicitly list scope-lock + spec-folder discipline + cross-stack pivot ban. [EVIDENCE: `.opencode/agent/code.md` §2.]
- [x] [P0] §2 includes Bash-bypass warning (no shell redirection / sed / interpreter writes outside scope). [EVIDENCE: `.opencode/agent/code.md` §2 Bash-bypass paragraph.]

---

<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

Sibling-doc sync gates (Phase 3, T029–T031).

- [x] [P0] `AGENTS.md` §5 Agent Routing includes `@code` entry. [EVIDENCE: `AGENTS.md` line 332 lists `@code` with full description.]
- [x] [P0] `AGENTS_Barter.md` §5 Agent Routing includes `@code` entry. [EVIDENCE: `AGENTS_Barter.md` line 348 lists `@code` (symlink to Barter repo).]
- [x] [P0] ~~`AGENTS_example_fs_enterprises.md` §5 Agent Routing includes `@code` entry~~ — sibling file deleted from repo; gate retired. [EVIDENCE: ADR-10 updated to two-doc sibling sync.]
- [x] [P0] `decision-record.md` ADR-3 (D3) updated with research-validated convention-floor mechanism. [EVIDENCE: `decision-record.md` ADR-3 (rewritten in Phase 3 T026 + T031).]
- [x] [P0] `research/synthesis.md` exists with consolidated findings + concrete diff recommendations for code.md + canonical D3 diff text. [EVIDENCE: `research/synthesis.md` §3 §4 §5.]
- [x] [P0] `handover.md` reflects Phase 2 complete + Phase 3 status. [EVIDENCE: `handover.md` updated 2026-05-01.]

---

<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Research artifact gates (Phase 2, T016–T026) and packet-layout discipline.

- [x] [P0] cli-codex smoke command verified `gpt-5.5 high fast` flag syntax. [EVIDENCE: All 3 streams executed with `codex exec --model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast` cleanly.]
- [x] [P0] deep-research-config.json present in each of 3 streams. [EVIDENCE: `research/stream-01-oh-my-opencode-slim/deep-research-config.json`, `research/stream-02-opencode-swarm-main/deep-research-config.json`, `research/stream-03-internal-agent-inventory/deep-research-config.json`.]
- [x] [P0] Stream 01 (oh-my-opencode-slim) produced iteration artifacts. [EVIDENCE: 4 iterations + `research/stream-01-oh-my-opencode-slim/research.md` (354 lines).]
- [x] [P0] Stream 02 (opencode-swarm-main) produced iteration artifacts. [EVIDENCE: 5 iterations + `research/stream-02-opencode-swarm-main/research.md` (259 lines).]
- [x] [P0] Stream 03 (internal `.opencode/agent/`) produced iteration artifacts. [EVIDENCE: 5 iterations + `research/stream-03-internal-agent-inventory/research/research.md` (330 lines).]
- [x] [P0] Each stream either reached iter budget OR converged earlier. [EVIDENCE: All 3 converged on `all_questions_answered`/`zero-remaining-questions` strong stop signal at iters 4, 5, 5 (8 budget).]
- [x] [P0] Earlier cli-copilot stream-01 init removed (per memory deletion rule, not archived). [EVIDENCE: `research_archive/` no longer exists; physical `rm -rf`.]
- [x] [P0] All packet docs use canonical Level 3 template-header structure. [EVIDENCE: Phase 3 restructure of tasks.md, checklist.md, implementation-summary.md, decision-record.md.]

---

<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Final gates (Phase 3, T034–T039).

- [ ] [P0] `validate.sh --strict` exits 0 on 059 packet (final run). [EVIDENCE: captured in `implementation-summary.md` §Verification.]
- [ ] [P0] All checklist items above marked `[x]` with evidence. [EVIDENCE: self-reference (this file).]
- [ ] [P0] implementation-summary.md filled with hook + impact-first paragraph + verification evidence. [EVIDENCE: `implementation-summary.md` (Phase 3 T036).]
- [ ] [P0] `/memory:save` completed (or direct continuity patch per ADR-004). [EVIDENCE: continuity blocks updated in tasks.md, checklist.md, implementation-summary.md, handover.md.]
- [ ] [P0] Commit on `main` branch (per memory: no feature branches). [EVIDENCE: `git log -1` and `git branch --show-current`.]
- [ ] [P0] Code graph re-scan if needed (memory: stale graph warning at session start). [EVIDENCE: Optional; deferred unless triggered by post-commit re-scan need.]

<!-- /ANCHOR:summary -->
