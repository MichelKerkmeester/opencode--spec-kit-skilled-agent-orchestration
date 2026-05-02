---
title: "Feature Specification: cli-opencode Skill Creation [skilled-agent-orchestration/047-cli-opencode-creation/spec]"
description: "Add a fifth sibling CLI orchestrator skill (cli-opencode) that lets external AI assistants invoke the OpenCode CLI binary, plus the changelog bucket, skill-advisor scoring updates, sibling graph-metadata edges, and README touch-ups required to keep the four existing cli-* siblings consistent."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
trigger_phrases:
  - "cli-opencode skill creation"
  - "047-cli-opencode-creation"
  - "opencode cli orchestrator skill"
  - "opencode run cli skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/047-cli-opencode-creation"
    last_updated_at: "2026-04-26T05:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted Level 3 spec from sibling-skill exploration"
    next_safe_action: "Review the decision-record ADRs, then dispatch /spec_kit:implement when approved"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0470000000000000000000000000000000000000000000000000000000000001"
      session_id: "047-cli-opencode-creation"
      parent_session_id: "skilled-agent-orchestration"
    completion_pct: 0
    open_questions:
      - "Self-invocation guard signal — env var name vs process ancestry probe"
      - "TOKEN_BOOSTS weight for the noisy 'opencode' token"
    answered_questions: []
---
# Feature Specification: cli-opencode Skill Creation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

Add `cli-opencode` as a fifth sibling under `.opencode/skill/cli-*/` so external AI assistants (and detached OpenCode sessions) can invoke the OpenCode CLI the same way they already invoke Claude Code, Codex, Copilot, and Gemini. The skill ships nine files matching the canonical cli-* blueprint (3 root + 2 assets + 4 references), gets registered with the skill advisor through filesystem walking + sibling-edge updates + an optional TOKEN_BOOSTS entry, opens a new flat changelog bucket via `/create:changelog`, and touches eight specific lines in `.opencode/skill/README.md` plus two specific lines in `.opencode/README.md`. The hardest decisions land in the decision-record: the self-invocation guard signal (avoiding cycles when the orchestrator already IS opencode), the token-boost weight for the noisy "opencode" token (the framework name appears throughout the repo), and the three valid use cases that justify the skill's existence in a repo where opencode IS the host runtime.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 047 |
| **Folder** | 047-cli-opencode-creation |
| **Track** | skilled-agent-orchestration |
| **Level** | 3 |
| **Created** | 2026-04-26 |
| **Status** | Draft |
| **Sibling skills (existing)** | cli-claude-code, cli-codex, cli-copilot, cli-gemini |
| **Upstream reference** | 046-cli-codex-tone-of-voice (most recent cli-* sibling spec) |
| **Target binary** | `/Users/michelkerkmeester/.superset/bin/opencode` (v1.3.17 confirmed) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The framework already ships four cli-* orchestrator skills (`cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`) that let any AI assistant delegate work to an external AI binary. The OpenCode CLI is the one widely-used assistant binary on the operator's machine that has no skill — so when an external runtime (Claude Code, Codex, raw shell, another LLM) wants to dispatch work that needs the full Spec-Kit + plugin + MCP context this repo provides, there is no canonical skill that documents the right binary flags, model selection, prompt format, agent dispatch, and self-invocation guard. The advisor cannot route to a non-existent skill, the four existing siblings have no peer edges to bind against, the changelog system has no bucket for OpenCode CLI release notes, and both READMEs claim "four CLI skills" rather than five.

### Purpose

Land the fifth sibling without breaking sibling symmetry, advisor scoring, or the carry-forward pattern of incremental skill releases. Specifically:

1. Give external AI runtimes a documented dispatch path into OpenCode that includes the full plugin/skill/MCP runtime — not just the bare model the way `cli-claude-code` invokes raw Claude.
2. Give OpenCode itself a way to spawn parallel detached sessions (different session ID, optional `--share` URL) for parallel research, ablation, or worker farms.
3. Bring the advisor scoring tables and graph metadata to peer parity so the new skill is discoverable by the same explicit/lexical/derived/graph lanes that already route the other four.
4. Open the changelog bucket so the first release (v1.0.0.0) can ship the same week as the skill itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In scope (3 streams)

1. **Skill creation** — nine new files under `.opencode/skill/cli-opencode/` matching the universal cli-* blueprint exactly (3 root + 2 assets + 4 references). No scripts/ folder, no constitutional/ folder.
2. **Advisor + sibling graph integration** — add cli-opencode to the four existing cli-* graph-metadata.json sibling lists (weight 0.5 each), add an optional TOKEN_BOOSTS entry in `lib/scorer/lanes/explicit.ts:15`, run `init-skill-graph.sh` to validate + export the JSON fallback + reindex the SQLite catalog. Optionally invoke `/doctor:skill-advisor` for the full re-tune pass.
3. **Changelog + READMEs** — open a new flat `.opencode/changelog/cli-opencode/` bucket (auto-created by `/create:changelog`) with a v1.0.0.0 changelog file initial release file, then patch the 8 specific edit points in `.opencode/skill/README.md` and the 2 in `.opencode/README.md` so skill counts, tables, tree diagrams, and feature tables include the new sibling.

### Out of scope (deferred)

- A `/doctor:cli-opencode` operator command (sibling skills do not have one; can be added later if needed).
- A constitutional/ rule for OpenCode-specific guardrails (sibling skills do not have one; can be added later if a real rule emerges).
- Hooking cli-opencode into deep-research or deep-review executor configs as a fifth `--executor` choice (separate spec — would touch the loop machinery, not the skill).
- A test corpus expansion for the advisor regression suite (existing fixtures cover four cli-* skills; adding a fifth is a follow-up packet once real telemetry confirms routing accuracy).
- Implementation of the cli-opencode skill itself — this packet is plan-only. Implementation runs after approval via `/spec_kit:implement`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional

- **REQ-001 (Skill folder layout):** `.opencode/skill/cli-opencode/` matches the universal cli-* blueprint — 3 root files (SKILL document, README, graph-metadata file), 2 asset files (assets prompt_quality_card, assets prompt_templates), 4 reference files (references cli_reference, references integration_patterns, references agent_delegation, references opencode_tools).
- **REQ-002 (SKILL.md frontmatter):** `name: cli-opencode`, `description` in the 80–150 char band, `allowed-tools: [Bash, Read, Glob, Grep]`, `version: 1.0.0`. Inline `<!-- Keywords: ... -->` line directly after frontmatter.
- **REQ-003 (SKILL.md body):** Eight anchored sections in canonical order — `## 1. WHEN TO USE`, `## 2. SMART ROUTING`, `## 3. HOW IT WORKS`, `## 4. RULES`, `## 5. REFERENCES`, `## 6. SUCCESS CRITERIA`, `## 7. INTEGRATION POINTS`, `## 8. RELATED RESOURCES`. Each section opens with the standard ANCHOR open/close marker pair. Length target ~550 lines.
- **REQ-004 (Self-invocation guard):** Section 1 ("When NOT to use") and Section 2 (smart-router pseudocode) MUST detect when the orchestrator is already running inside OpenCode and refuse to dispatch — analog of cli-claude-code's `$CLAUDECODE` env detection. Detection signal selected per ADR-001.
- **REQ-005 (graph-metadata.json):** schema_version=2, `skill_id: "cli-opencode"`, `family: "cli"`, `category: "cli-orchestrator"`, sibling edges (weight 0.5) to all four existing cli-* skills, domains include `["cli", "delegation", "cross-ai", "spec-kit-runtime", "parallel-sessions"]`, intent_signals include `["opencode cli", "opencode run", "delegate to opencode"]`, derived block populated post-daemon-reindex with trigger_phrases / key_topics / key_files / entities / source_docs.
- **REQ-006 (Sibling parity edges):** All four existing cli-* graph-metadata.json files (`cli-claude-code/graph-metadata.json`, `cli-codex/graph-metadata.json`, `cli-copilot/graph-metadata.json`, `cli-gemini/graph-metadata.json`) MUST add a sibling edge to cli-opencode with weight 0.5 and context `"CLI orchestrator peer"`.
- **REQ-007 (Optional TOKEN_BOOSTS entry):** `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:15` MAY gain `opencode: [['cli-opencode', W]]` with W decided in ADR-003. Skip if W cannot be set without false-positive risk on the noisy "opencode" token (which appears throughout the repo as the framework name).
- **REQ-008 (Skill-graph reindex):** After step 1+2, run `bash .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` to validate every graph-metadata.json, regenerate `skill-graph.json` fallback, and reindex `skill-graph.sqlite` via daemon-watcher events.
- **REQ-009 (Doctor pass):** Run `/doctor:skill-advisor:auto` to retune scoring tables and confirm the new skill is discoverable across all five scoring lanes (explicit, lexical, derived, semantic, graph) with no regression on the existing four cli-* siblings.
- **REQ-010 (Changelog bucket + initial release):** `/create:changelog cli-opencode --bump=major --release` creates the cli-opencode v1.0.0.0 changelog file using the sk-doc compact format (this is a single-skill initial release, <10 changes). The release notes follow the canonical changelog template and publish a GitHub release if the operator confirms.
- **REQ-011 (`.opencode/skill/README.md` edits):** Eight specific patches at line 44 (count), line 54 (stats), line 57 (CLI count + list), line 134 ("five CLI skills"), insert after line 151 (table row), insert after line 201 (tree entry), insert after line 257 (signals row), insert after line 509 (related docs link).
- **REQ-012 (`.opencode/README.md` edits):** Two specific patches at line 57 (count) and insert after line 141 (SKILLS OVERVIEW row).
- **REQ-013 (Validation gate):** `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/ --strict` passes 0/0 against this packet. The skill itself does not have a strict validator, but `python3 skill_graph_compiler.py --validate-only` MUST pass.

### Non-functional

- **NFR-001 (Sibling symmetry):** No metric in the cli-* family becomes asymmetric. If cli-codex has token boost 0.9 and a readOnlyRouteAllowed rule, cli-opencode's choices are documented in the decision-record and cross-checked.
- **NFR-002 (Routing accuracy):** Existing four cli-* skill regression tests still pass at their current accuracy bar (per the skill-advisor baseline 80.5% full-corpus, 77.5% holdout). No new regressions on Python-correct prompts.
- **NFR-003 (Effort budget):** Implementation should fit a 4–6 hour autonomous run. Spec packet creation (this work) fits a 2-hour pass.
- **NFR-004 (Backwards compatibility):** No existing skill changes its public surface. Sibling edge additions are additive. TOKEN_BOOSTS addition is additive.
- **NFR-005 (Documentation freshness):** After implementation lands, the two READMEs reflect the new "five CLI skills" reality immediately — counts, tables, tree, related-docs link all aligned.
<!-- /ANCHOR:requirements -->

---

### 4.1 Acceptance Scenarios

#### Scenario 1: External Claude Code session delegates a spec workflow into OpenCode

**Given** an operator is running inside `claude --print` (Claude Code CLI session, no OpenCode runtime in the ancestry),
**When** they ask "use cli-opencode to run the deep-research loop on this spec packet" and the advisor scores cli-opencode as the top match,
**Then** the skill instructions invoke `opencode run --model anthropic/claude-opus-4-7 --agent deep-research --variant high --format json --dir /repo "<prompt>"`, the resulting OpenCode session loads the full plugin + skill + MCP runtime, and a structured JSON event stream is parsed by the calling Claude Code session.

#### Scenario 2: OpenCode-internal session spawns a parallel detached worker

**Given** the operator is already inside an OpenCode TUI / web session,
**When** they ask cli-opencode to "spawn a parallel detached session for the ablation suite",
**Then** the smart router DETECTS the in-OpenCode runtime via the ADR-001 signal AND chooses the parallel-session use case (not the cross-AI delegate path), invoking `opencode run --share --port 4096 --dir /repo "<ablation prompt>"`. The original session continues; the new one runs detached with a publishable share URL.

#### Scenario 3: Self-invocation circular dispatch is refused

**Given** the operator is inside OpenCode and asks cli-opencode to "delegate this exact prompt to OpenCode",
**When** the smart router evaluates the prompt,
**Then** the router refuses with a message naming the cycle ("you are already inside OpenCode; use a sibling cli-* skill or a fresh shell session to dispatch a different model") and does NOT invoke `opencode run`. The cycle is broken at the routing layer, not at runtime.

#### Scenario 4: Advisor surfaces cli-opencode for a clearly-targeted prompt

**Given** the prompt "delegate to opencode CLI for parallel research",
**When** the advisor runs all five scoring lanes,
**Then** cli-opencode is the top recommendation with confidence ≥ 0.80 and uncertainty ≤ 0.35, AND none of the four existing cli-* siblings get a confidence above 0.50 on the same prompt.

#### Scenario 5: Changelog and READMEs reflect the new sibling

**Given** the implementation is complete,
**When** an operator reads `.opencode/skill/README.md` and `.opencode/README.md`,
**Then** the skill counts say "21 skill folders" / "Skills | 21", the CLI Orchestrator Skills table has 5 rows, the folder-tree diagram includes `cli-opencode/`, and the cli-opencode v1.0.0.0 changelog file is published with the canonical compact format.

---


#### Scenario 6: Sibling-edge symmetry holds after registration

**Given** the implementation lands and `bash init-skill-graph.sh` rebuilds the skill graph,
**When** an operator inspects `skill-graph.json` adjacency block,
**Then** every cli-* skill (cli-claude-code, cli-codex, cli-copilot, cli-gemini, cli-opencode) lists every other cli-* skill as a sibling at weight 0.5 with context "CLI orchestrator peer", AND no asymmetric edge exists (every A→B implies B→A at the same weight).

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 13 functional requirements (REQ-001 through REQ-013) verified against the implemented skill.
- All 5 acceptance scenarios pass against the live skill + runtime.
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/047-cli-opencode-creation/ --strict` exits 0 with 0 errors / 0 warnings.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py --validate-only` exits 0.
- `bash .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` completes without health failures.
- `/doctor:skill-advisor:auto` retune produces a non-empty diff across cli-opencode entries and a "no regression" report on the existing four cli-* siblings.
- Changelog v1.0.0.0.md published; GitHub release optional but the tag exists.
- Both READMEs verified manually against the 10 specific edit points listed in REQ-011 + REQ-012.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Self-invocation cycle when orchestrator IS opencode | High | High | ADR-001 selects a deterministic detection signal; smart router refuses with explicit error message |
| Noisy "opencode" token false-positives the advisor | Medium | Medium | ADR-003 picks a conservative TOKEN_BOOSTS weight or skips it entirely; fall back to derived/lexical lanes |
| Sibling edges pull cli-opencode above an actually-better sibling | Medium | Low | NFR-002 holds — regression suite must show no drop on existing prompts |
| README counts drift again next time another skill is added | Medium | Low | Document the 10 edit points in `decision-record.md` so the next sibling spec can copy the checklist |
| Initial v1.0.0.0 release notes diverge from sk-doc template | Low | Low | Use `/create:changelog` workflow which loads the template automatically |
| `init-skill-graph.sh` fails because graph-metadata schema drifted | Low | Medium | Validate-only step runs first; fail fast before SQLite write |
| OpenCode CLI flags change between v1.3.17 and v1.4 | Low | Medium | cli_reference cites the version checked; pin the version range in the SKILL.md prerequisites |

### Dependencies

- **Upstream:** None — sibling skills already exist and are stable.
- **Tooling:** `/create:changelog`, `/doctor:skill-advisor`, `init-skill-graph.sh`, `skill_graph_compiler.py`, sk-doc changelog template.
- **External binary:** `opencode` v1.3.17+ at `/Users/michelkerkmeester/.superset/bin/opencode`.
- **Reference packets:** 046-cli-codex-tone-of-voice (most recent cli-* sibling, copy structural patterns).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001 (Sibling symmetry):** Every metric chosen for cli-opencode is justified against the existing four siblings. If a choice diverges (e.g. token boost weight differs from cli-codex's 0.9), the divergence has an ADR.
- **NFR-002 (Routing accuracy):** No regression on the advisor's baseline 80.5% full-corpus / 77.5% holdout accuracy. The five-lane fusion (explicit + lexical + derived + semantic + graph) must score cli-opencode at confidence ≥ 0.80 for at least 5 hand-curated golden prompts.
- **NFR-003 (Effort budget):** ~600 LOC for the skill (8 documents at the cli-* sibling LOC range) + ~50 LOC delta for sibling edges + ~30 LOC for advisor wiring + 10 README patches. Budget 4–6 hours of autonomous implementation, 2 hours of spec authoring (this packet).
- **NFR-004 (Backwards compatibility):** Additive only. No existing public surface mutated. Existing four cli-* skills continue to score at or above their current routing confidence.
- **NFR-005 (Documentation freshness):** Both READMEs reflect the new sibling on the same commit as the skill files. No "5 cli skills mentioned but only 4 exist on disk" interim state.
- **NFR-006 (Validation hygiene):** Strict spec validation passes 0/0; skill_graph_compiler validate-only passes; `/doctor:skill-advisor:auto` retune does not surface new P0 findings.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Operator inside OpenCode TUI**: ADR-001's detection signal must fire reliably from within `opencode` itself (TUI mode). Smart-router refuses self-invocation.
- **Operator inside OpenCode acp/serve mode**: Same detection signal fires; refuse identically.
- **Operator inside Claude Code with opencode plugin loaded**: This is NOT a self-invocation. cli-opencode dispatches normally because the runtime is Claude Code, not OpenCode. ADR-001 signal must NOT trip on plugin-only contexts.
- **`opencode` binary not installed**: SKILL.md Section 1 prerequisite check + Section 3 error-handling table covers a missing-binary error path.
- **`opencode` v1.4 with different flags**: cli_reference.md cites v1.3.17 baseline; document a "version drift" failure mode in references cli_reference.
- **`/create:changelog` finds an existing `cli-opencode/` bucket on a re-run**: Idempotent — the workflow detects the bucket and increments to v1.0.0.1 or refuses depending on operator confirmation.
- **`init-skill-graph.sh` fails because cli-opencode/graph-metadata.json is malformed**: Validate-only step catches it before SQLite write; fix-and-retry loop in tasks.md.
- **Sibling-edge round-trip miss**: One of the four existing cli-* graph-metadata.json files is not updated. `skill_graph_compiler.py` does NOT enforce edge symmetry today (per Agent B finding), so the asymmetric edge would survive validation. Mitigation: tasks.md lists all four files explicitly + checklist line CHK-027 verifies symmetric round-trip.
- **TOKEN_BOOSTS weight is too high → cli-opencode dominates "opencode" token across the repo**: ADR-003 selects a conservative weight (likely 0.4–0.6) to balance discoverability vs. noise. Fallback: skip TOKEN_BOOSTS entirely.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Domain count | 1.0 | 3 streams (skill + advisor + docs/changelog) |
| File count | 1.0 | ~17 files modified or created (9 new + 4 edited graph-metadata + 2 READMEs + 1 advisor file + 1 changelog file) |
| LOC estimate | 0.5 | ~600 LOC for skill files + ~100 LOC delta elsewhere |
| Parallel opportunity | 0.5 | Streams A + B can run in parallel; C waits on the other two |
| Task type | 1.0 | Cross-cutting: net-new skill + advisor scoring tuning + sibling graph maintenance + multi-file doc patches |
| **Composite score** | **~0.80** | Level 3 confirmed |

Level 3 is required because (1) decision-record is mandatory (5 ADRs identified), (2) three streams touch six subsystem boundaries (skill folder, scorer, sibling graph, changelog, two READMEs), and (3) self-invocation is a genuine architectural choice with cycle risk that needs documented rationale.
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Severity | Risk | Mitigation |
|---------|------|-----------|
| HIGH | Self-invocation cycle | ADR-001 detection signal + smart-router refusal |
| HIGH | Sibling-edge asymmetry survives validation | Explicit task entries for all 4 sibling files + checklist round-trip verification |
| MEDIUM | "opencode" token false-positives | ADR-003 conservative weight or skip TOKEN_BOOSTS |
| MEDIUM | OpenCode CLI version drift | Pin v1.3.17 in cli_reference.md; document drift fallback |
| LOW | README count drift on next sibling | Document the 10 edit points in decision-record |
| LOW | Initial release notes divergence | Use sk-doc template via `/create:changelog` |

---

## 11. USER STORIES

- **As an external Claude Code operator** who needs the full Spec-Kit + plugin + MCP runtime, I want to dispatch a one-shot OpenCode session via `cli-opencode` so I can run a deep-research loop with the project's plugins active, without leaving my Claude Code session.
- **As an OpenCode operator** running a long-form orchestration, I want to spawn a parallel detached OpenCode session via `cli-opencode` so I can run an ablation suite or a worker farm without blocking my main session, and optionally publish a `--share` URL for inspection.
- **As a Codex/Copilot/Gemini operator** dispatching from a non-Anthropic CLI, I want a documented path through cli-opencode so the cross-AI orchestration story includes OpenCode as a peer on equal footing with the other four sibling skills.
- **As the framework maintainer**, I want the advisor to score cli-opencode correctly across all five scoring lanes so it competes fairly with the other four cli-* siblings and the regression suite catches drift.
- **As a downstream operator reading the READMEs**, I want the skill counts, tables, and tree diagrams to reflect five CLI skills consistently so the docs are not lying about what's on disk.

---


<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

1. **Self-invocation guard signal** — ADR-001 lists three candidates (env var lookup, process ancestry probe via `ps`, `~/.opencode/state/` lock file). Implementation should pick one based on reliability + cost. Open until ADR-001 lands.
2. **TOKEN_BOOSTS weight for "opencode"** — ADR-003 sketches the trade-off. The repo uses "opencode" as the framework name throughout, so a high weight will false-positive. A conservative 0.4–0.6 may underperform vs. cli-codex's 0.9 on the analogous "codex" token. Pin the value during implementation against telemetry.
3. **`/doctor:skill-advisor` invocation timing** — run before or after the changelog publish? Order matters because the doctor pass may rewrite graph-metadata derived blocks. Spec assumes: skill files → sibling edges → init-skill-graph → doctor → changelog → READMEs.
4. **Should cli-opencode get a hook_contract reference** like cli-codex has? OpenCode hooks are first-class — answer is "probably yes" but the exact contents depend on which OpenCode hook surface (SessionStart? UserPromptSubmit? Plugin lifecycle?) is most commonly delegated to. Defer to the SKILL.md authoring task.
5. **Should cli-opencode appear as a fifth `--executor` choice** in the deep-research / deep-review loops? Out of scope for this packet (declared in §3 Out of scope) but should be tracked as a follow-up packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md` — implementation plan + 7 phases
- `tasks.md` — 28 atomic tasks across 3 phases
- `checklist.md` — P0/P1/P2 verification gates
- `decision-record.md` — 5 ADRs covering the architectural choices
- `046-cli-codex-tone-of-voice/` — most recent cli-* sibling spec (patterns to copy)
- `.opencode/skill/cli-claude-code/SKILL.md` — closest functional analog (also routes via env-var detection)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts:8-74` — TOKEN_BOOSTS table (REQ-007 patch site)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/init-skill-graph.sh` — REQ-008 reindex command
- `.opencode/command/create/changelog.md` — REQ-010 changelog workflow
- `.opencode/skill/sk-doc/assets/documentation/changelog_template.md` — canonical changelog format
