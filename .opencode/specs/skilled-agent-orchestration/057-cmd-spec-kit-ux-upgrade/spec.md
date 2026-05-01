---
title: "Feature Specification: spec-kit UX comparison vs external SPAR-Kit"
description: "Run a 10-iteration deep-research loop comparing the external SPAR-Kit project (Specify → Plan → Act → Retain) against our internal system-spec-kit surface (SKILL.md, templates, command/spec_kit, command/memory, command/create, agent) and produce a ranked list of adoptable UX/orchestration patterns."
trigger_phrases:
  - "057 spec kit ux"
  - "spar-kit comparison"
  - "spec kit ux upgrade"
  - "system-spec-kit improvements"
  - "external spec kit research"
importance_tier: "high"
contextType: "research"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade"
    last_updated_at: "2026-05-01T07:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Bootstrap research packet"
    next_safe_action: "Run deep-research auto cli-codex gpt-5_5 high fast 10 iters"
    blockers: []
    key_files:
      - "spec.md"
      - "external/README.md"
      - ".opencode/skill/system-spec-kit/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: spec-kit UX comparison vs external SPAR-Kit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` (no feature branch — per-user policy) |
| **Run Type** | Deep research (cli-codex / gpt-5.5 / high / fast / 10 iterations) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our internal `system-spec-kit` surface area has accumulated UX friction over 56 packets of evolution: mode/flag overlap (`:auto` vs `:confirm` vs `:with-phases` vs `:with-research`), 99 templates with core/level naming drift (e.g. `spec-core.md` vs `spec-level1.md`, addendum `-prefix`/`-suffix`/`-guidance` fragments), 16 commands with asymmetric mode coverage (memory commands lack `:auto`/`:confirm`), 47 MCP tools without a unified entry point, and dense argument matrices on `/create:*` commands. The external project SPAR-Kit (jed-tech, npm `@spar-kit/install`, Beta1) ships a similar problem space — Specify → Plan → Act → Retain — with a much smaller, declarative surface (managed-block instructions, asset-policy installer, persona-driven UX, 60-line AGENTS.md cap, multi-agent target configs). It plausibly contains portable patterns we can adopt to simplify our own surface without losing capability.

### Purpose
Run a 10-iteration deep-research loop comparing the external project to our internal artifacts and produce a ranked, evidence-backed list of UX/orchestration patterns we should adopt-as-is, adapt, take inspiration from, or reject — with concrete file-level recommendations and named follow-on packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Comparison along **6 axes**, each producing 2-4 ranked findings:
1. **Installer & multi-target distribution** — SPAR-Kit's npm `@spar-kit/install` with `--claude/--cursor/--codex` target configs vs our manual skill installation.
2. **Instruction-file management** — SPAR's managed-block policy (`<!-- spar-kit:start/end -->` boundaries, 60-line cap warning) vs our hand-edited `AGENTS.md`/`CLAUDE.md`/`CLAUDE.md` siblings (Barter + fs-enterprises).
3. **Command/skill granularity** — SPAR's 4 phases (Specify/Plan/Act/Retain) as independent skills vs our 6 `/spec_kit:*` commands + 4 `/memory:*` + 6 `/create:*` + flag suffixes.
4. **Template architecture** — SPAR's two minimal templates (`spec.md`, `plan.md`) with declarative asset policies (`replace`, `seed_if_missing`, `managed_block`, `replace_managed_children`) vs our 99-file core + addendum + level + cross-cutting tree.
5. **Tool-discovery UX** — SPAR's `.spar-kit/.local/tools.yaml` (seeded once, never overwritten, agent reads to discover commands) vs our skill-advisor + MCP routing + 47-tool surface.
6. **Personas & UX tone in skill prompts** — SPAR's 5 personas (Vera/Pete/Tess/Maya/Max) and explicit "creative, suggestive, teammate-like" tone in `spar-specify`, "Key Follow-Up vs Optional Follow-up" 7-question split in `spar-plan` vs our skill prompt patterns.

### Out of Scope
- **Implementing any discovered patterns** — each adoption candidate lands in its own follow-on packet (058+); this packet only produces the research output.
- **Rewriting `external/`** — read-only reference content; never modify.
- **Changing skill-advisor scoring** — separate skill (doctor:skill-advisor) owns that.
- **Touching production behavior of any current command** — research-only run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `057-cmd-spec-kit-ux-upgrade/spec.md` | Create | This file |
| `057-cmd-spec-kit-ux-upgrade/description.json` | Create | Memory-search registration |
| `057-cmd-spec-kit-ux-upgrade/graph-metadata.json` | Create | Graph-traversal registration |
| `057-cmd-spec-kit-ux-upgrade/research/*` | Create (by deep-research) | State JSONL, iterations, deltas, prompts, dashboard, final research.md |
| `skilled-agent-orchestration/graph-metadata.json` | Modify | Bump `last_active_child_id` to `057-cmd-spec-kit-ux-upgrade` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/research.md` synthesized with the canonical 17-section template | File exists, all 17 sections populated, no placeholder text |
| REQ-002 | 10-20 ranked, evidence-backed recommendations | Each cites at least one path in external/ AND one path in internal surface |
| REQ-003 | Each recommendation tagged with adoption verdict | Tag ∈ {`adopt-as-is`, `adapt`, `inspired-by`, `reject-with-rationale`} |
| REQ-004 | Convergence detection passes OR iteration 10 produces final synthesis | `findings-registry.json` shows `status: CONVERGED` or `iterationsCompleted: 10` with synthesized output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each recommendation names the follow-on packet that would land it | Packet name in `058-*` to `06X-*` form, scope sketched in 1-2 sentences |
| REQ-006 | Findings cover all 6 axes from §3 In Scope | At least 1 finding per axis; missing axes flagged in research.md "gaps" section |
<!-- /ANCHOR:requirements -->

---

## 4A. ACCEPTANCE SCENARIOS

1. **Given** all ten iteration files exist, when synthesis runs, then `research/research.md` contains the canonical 17-section structure.
2. **Given** the six research axes in scope, when findings are indexed, then every axis has at least one cited finding.
3. **Given** a detailed finding, when it is accepted into the synthesis, then it cites at least one external SPAR-Kit path and one internal system-spec-kit path.
4. **Given** synthesis is complete, when state is updated, then `research/deep-research-state.jsonl` receives one `synthesis_complete` event.
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ≥10 ranked recommendations, each tagged and cited
- **SC-002**: All 6 in-scope axes have at least 1 finding (gaps explicitly flagged)
- **SC-003**: Each iteration's `iter-NNN.jsonl` delta cites concrete file paths (not generic patterns)
- **SC-004**: `findings-registry.json` reaches CONVERGED status, OR iteration 10 produces a final synthesis with `terminalStop: max-iterations`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex CLI / gpt-5.5 availability | High — run halts if unsupported | If gpt-5.5 errors at dispatch, fall back to gpt-5.4 (memory-confirmed working) |
| Risk | Low-signal output (generic findings, no concrete paths) | Med | Touch `.deep-research-pause` after iter-001, edit `deep-research-strategy.md` to add concrete file targets, resume |
| Risk | Codex sandbox can't read `.opencode/specs/` paths | High | Pre-verify with `codex exec --sandbox workspace-write echo test`; switch to `cli-claude-code` or `native` if blocked |
| Risk | External SPAR-Kit content over-indexed (research becomes "SPAR-Kit summary" not "comparison") | Med | Strategy.md keeps explicit "for each finding, cite BOTH surfaces" requirement |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes in <15 minutes (executor-timeout default 900s)
- **NFR-P02**: Total run completes in <2.5 hours (10 × 15min + reducer overhead)

### Security
- **NFR-S01**: Codex sandbox = `workspace-write` (no network, no destructive writes outside workspace)
- **NFR-S02**: Research output contains no API keys, no internal credentials, no PII

### Reliability
- **NFR-R01**: Lock file (`.deep-research.lock`) prevents concurrent runs against this packet
- **NFR-R02**: State is append-only JSONL — partial failure doesn't corrupt prior iterations
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty external/ subdirectory (already verified non-empty: 21 entries) → not a concern
- spec.md missing anchors → deep-research seeds `<!-- DR-SEED:* -->` markers (this file ships them)
- description.json/graph-metadata.json out of sync → optional regenerate via `generate-context.js` post-run

### Error Scenarios
- gpt-5.5 not available in Codex CLI → halt, retry with gpt-5.4 (per memory: gpt-5.4 high fast was used in 026/049)
- Codex stdin-pipe truncation on long prompts → research command shards prompts; observe `prompts/iter-NNN.md` size
- Convergence false-positive (delta < 0.05 with low-signal) → manual review at iter-3 / iter-6 checkpoint, abort if findings list is generic

### State Transitions
- Mid-run resume after pause → drop `.deep-research-pause`, run continues from last iteration
- Generation bump (resumed in fresh session) → continuity files survive; `generation` increments in registry
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Research-only; 3 files written by hand + research/ tree by command |
| Risk | 8/25 | Low — read-only research, no production code touched |
| Research | 18/20 | High — 10 iterations of cross-codebase pattern extraction is the entire deliverable |
| **Total** | **38/70** | **Level 2** (research-heavy but low blast radius) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- DR-SEED:OPEN_QUESTIONS -->
- [Question 1] What is the smallest viable subset of SPAR-Kit's managed-block policy we could adopt without breaking the AGENTS.md sync triad (Public + Barter + fs-enterprises)?
- [Question 2] Does collapsing `:auto`/`:confirm`/`:with-phases`/`:with-research` into a 2-axis matrix (mode × scope) break any existing skill-advisor or hook contracts?
- [Question 3] Could our 99-template tree compress to a SPAR-style declarative manifest with on-demand composition, given that `compose.sh` already materializes per-level outputs?
<!-- /DR-SEED:OPEN_QUESTIONS -->
<!-- /ANCHOR:questions -->

---

## 11. RESEARCH CONTEXT

<!-- DR-SEED:RESEARCH_CONTEXT -->
**External surface (read-only)**: `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/`
- Root docs: `README.md`, `ROADMAP.md`, `technicalBrief.md`, `BETA1-RELEASE-CHECKLIST.md`, `AGENTS.md`
- Installer: `install-root/`, `lib/cli.mjs`, `lib/install-engine.mjs`, `bin/spar-kit.mjs`
- Skills: `install-root/skills/{spar-init, spar-specify, spar-plan, spar-act, spar-retain}/SKILL.md`
- Targets: `install-root/targets/*.json` (per-agent install configs)
- Templates: `templates/{spec.md, plan.md}`
- Personas/research: `Research/Personas/Personas.md`, `specs/`

**Internal surface**:
- Skill: `.opencode/skill/system-spec-kit/SKILL.md` (991 lines)
- Templates: `.opencode/skill/system-spec-kit/templates/` (99 files: `core/`, `addendum/{level2-verify, level3-arch, level3-plus-govern, phase}/`, `level_{1,2,3,3+}/`, `examples/`, cross-cutting `handover.md` / `research.md` / `resource-map.md` / `context-index.md` / `debug-delegation.md` / `phase_parent/`)
- Commands:
  - `.opencode/command/spec_kit/{plan, implement, deep-research, deep-review, resume, complete}.md` + `assets/*.yaml` (12 mode-specific YAMLs)
  - `.opencode/command/memory/{search, learn, manage, save}.md` (no `:auto`/`:confirm` modes — inline workflows)
  - `.opencode/command/create/{agent, sk-skill, folder_readme, feature-catalog, testing-playbook, changelog}.md` + `assets/*.yaml`
- Agents: `.opencode/agent/{orchestrate, context, deep-research, deep-review, debug, review, improve-agent, improve-prompt, ultra-think, write}.md`
- Helpers: `system-spec-kit/scripts/spec/validate.sh`, `scripts/dist/memory/generate-context.js`, `mcp_server/skill_advisor/`, `templates/compose.sh`

**Comparison axes** (from §3 In Scope): installer/distribution, instruction-file management, command/skill granularity, template architecture, tool-discovery UX, personas & UX tone.

**Output requirements**:
- 10-20 ranked findings, each tagged `adopt-as-is` / `adapt` / `inspired-by` / `reject-with-rationale`
- Cite ≥1 path per surface per finding
- Name a follow-on packet (`058-*` to `06X-*`) for each adoption candidate
- Cover all 6 axes; flag gaps explicitly
<!-- /DR-SEED:RESEARCH_CONTEXT -->
