---
title: "Implementation Plan: CLI Skill Prompt-Quality Integration via Mirror Cards"
description: "This packet introduces a two-tier prompt-quality architecture."
trigger_phrases:
  - "cli skill improved prompting"
  - "skilled agent orchestration"
  - "cli skill prompt quality integration via"
  - "cli skill improved prompting plan"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Implementation Plan: CLI Skill Prompt-Quality [skilled-agent-orchestration/043-cli-skill-improved-prompting/plan]"
description: "Add a canonical prompt-quality card, four local CLI mirrors, a shared improve-prompt escalation agent, and matching command/skill contracts without breaking the current same-skill routing invariant."
trigger_phrases:
  - "043 plan"
  - "prompt quality integration"
  - "mirror card plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/043-cli-skill-improved-prompting"
    last_updated_at: "2026-04-11T19:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented the planned mirror-card and escalation-agent architecture"
    next_safe_action: "Keep command, runtime, and README parity aligned before release"
    blockers: []
    key_files:
      - ".opencode/skill/cli-claude-code/SKILL.md"
      - ".opencode/skill/cli-codex/SKILL.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-gemini/SKILL.md"
    session_dedup:
      fingerprint: "sha256:043-cli-skill-improved-prompting"
      session_id: "043-cli-skill-improved-prompting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Land the drift check as a shell script rather than a fixture"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Skill Prompt-Quality Integration via Mirror Cards

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, markdown assets, markdown command docs, markdown agent docs, TOML Codex agent definition |
| **Framework** | OpenCode skill routing + runtime agent mirror pattern |
| **Storage** | Repo-local markdown assets only; no database or service change |
| **Testing** | Grep/path validation, strict packet validation, guard-safe path checks, command/skill contract review, optional smoke dispatches |

### Overview

This packet introduces a two-tier prompt-quality architecture. The fast path keeps every CLI skill self-contained by loading a small local mirror card in the `ALWAYS` resource set. The deep path uses a new `@improve-prompt` agent so the full `sk-improve-prompt` methodology loads only when prompt complexity or compliance signals justify the overhead.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The target spec folder is fixed: `.opencode/specs/skilled-agent-orchestration/043-cli-skill-improved-prompting/`.
- [x] The current command, skill, and runtime surfaces have been inspected.
- [x] The `_guard_in_skill()` + same-skill markdown discovery constraint is documented as a hard architecture rule.
- [x] Active runtime directories are confirmed: `.opencode/agent/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`.

### Definition of Done

- [ ] Canonical card and four mirrors are created and consistent.
- [ ] All four CLI skills route the local card through `ALWAYS` loading and document pre-dispatch prompt-quality rules.
- [ ] CLI prompt templates are framework-tagged.
- [ ] `sk-improve-prompt` documents the agent-consumption contract and fast-path asset.
- [ ] `@improve-prompt` exists across all active runtime directories.
- [ ] `/improve:prompt` documents and supports inline versus agent dispatch.
- [ ] Verification proves guard-safe paths, mirror presence, framework tags, and runtime parity.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical-source plus local mirrors, backed by an isolated escalation agent.

### Key Components

- **Canonical card**: new prompt-quality card under the `sk-improve-prompt` asset surface
- **Local mirrors**: four new prompt-quality cards under the CLI skill asset surfaces
- **CLI skill rule layer**: `cli-*` skill docs updated to resource domains, `ALWAYS`, and pre-dispatch rules
- **Prompt template metadata**: framework tags inside the CLI prompt-template assets
- **Full-methodology contract**: `sk-improve-prompt` skill definition
- **Escalation runtime surface**: `@improve-prompt` across all active runtime directories
- **Shared command surface**: `.opencode/command/improve/prompt.md`

### Data Flow

```text
Caller requests CLI dispatch
  -> CLI skill Smart Routing loads local prompt-quality card from assets/
  -> skill applies task-to-framework map + CLEAR 5-question pre-check
  -> if routine: build dispatch prompt and continue with existing CLI workflow
  -> if escalated: call @improve-prompt with raw task payload
  -> agent loads full sk-improve-prompt references in fresh context
  -> agent returns structured enhancement block
  -> caller uses enhanced prompt for CLI invocation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canonical Source and Contract Foundation

- [ ] Create the canonical prompt-quality card in the `sk-improve-prompt` asset surface.
- [ ] Update the `sk-improve-prompt` skill definition with:
  - reference to the canonical card
  - agent invocation contract
  - fast-path asset description
  - trigger-language update
  - version bump from `1.2.0.0` to `1.3.0.0`
- [ ] Decide whether the optional drift fixture lands in this packet or is documented as deferred.

### Phase 2: CLI Fast-Path Integration

- [ ] Create four mirror cards inside the CLI skill trees.
- [ ] Update each CLI skill definition to add the local card to the resource domain description and `LOADING_LEVELS["ALWAYS"]`.
- [ ] Add the pre-dispatch prompt-quality rule to each CLI skill's rules section.
- [ ] Add `Framework:` tags to every existing template block in each CLI prompt-template asset.

### Phase 3: Deep-Path Agent Integration

- [ ] Create the canonical OpenCode runtime definition for `@improve-prompt`.
- [ ] Mirror the same behavior into the Claude runtime agent surface.
- [ ] Mirror the same behavior into the Codex runtime agent surface.
- [ ] Mirror the same behavior into the Gemini runtime agent surface.
- [ ] Keep the contract leaf-only and read-only, with no nested delegation.

### Phase 4: Command Routing and Verification

- [ ] Update `.opencode/command/improve/prompt.md` to support inline and agent dispatch modes.
- [ ] Preserve inline mode as the default for ordinary interactive work.
- [ ] Auto-route to agent mode when complexity or explicit isolation signals demand it.
- [ ] Run static and semantic checks from the packet verification plan.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static presence | Card, mirror, and agent file creation | `find`, `ls`, `grep` |
| Guard-safety | No `..` routable card paths in CLI skill docs | `grep`, python scratch check |
| Metadata parity | Framework tags and sync footers exist where expected | `grep` |
| Command contract | `/improve:prompt` documents inline and agent modes consistently | `grep`, `sed`, manual read |
| Runtime parity | New agent exists in all active runtime directories and matches the documented contract | `find`, `sed`, manual read |
| Packet validation | Spec docs stay template-compliant | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <packet>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Framework and CLEAR references inside `sk-improve-prompt/references/` | Internal | Green | Framework table and CLEAR checklist lose their source material |
| DEPTH methodology reference inside `sk-improve-prompt/references/` | Internal | Green | DEPTH and CLEAR condensation lose their source material |
| `_guard_in_skill()` self-containment behavior in CLI skills | Internal | Green | Cross-skill card routing becomes invalid |
| `/improve:prompt` current command contract | Internal | Yellow | Agent mode cannot be claimed until the command doc is updated |
| Active runtime mirror directories | Internal | Green | Agent parity must cover `.gemini/agents/` because it already exists here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The mirror-card pattern proves confusing, too heavy, or incompatible with the current skill-loading model.
- **Procedure**:
  1. Remove the local prompt-quality-card entries from each CLI skill's `ALWAYS` loading block.
  2. Revert the local mirror cards and framework tags.
  3. Revert the `@improve-prompt` runtime mirrors if the agent contract is the issue.
  4. Restore `/improve:prompt` to inline-only behavior if command routing is unstable.
  5. Keep the canonical card and packet docs only if they still help future design work; otherwise revert the packet-linked skill changes as one unit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (canonical source + contract)
    -> Phase 2 (CLI mirrors + skill rules)
    -> Phase 3 (runtime mirrors + escalation agent)
    -> Phase 4 (command routing + verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phases 2, 3, 4 |
| Phase 2 | Phase 1 | Phase 4 |
| Phase 3 | Phase 1 | Phase 4 |
| Phase 4 | Phases 2 and 3 | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 | Medium | 1 focused session |
| Phase 2 | High | 2 focused sessions |
| Phase 3 | Medium | 1-2 focused sessions |
| Phase 4 | Medium | 1 focused session |
| **Total** | | **5-6 focused sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
                +---------------------------+
                |  Phase 1: Canonical Card  |
                |  + skill contract update  |
                +-------------+-------------+
                              |
               +--------------+--------------+
               |                             |
 +-------------v-------------+   +-----------v-----------+
 | Phase 2: CLI Fast Path    |   | Phase 3: Deep Path    |
 | mirrors + skill rules     |   | runtime agents        |
 +-------------+-------------+   +-----------+-----------+
               |                             |
               +--------------+--------------+
                              |
                +-------------v-------------+
                | Phase 4: Command Routing  |
                | + verification            |
                +---------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Canonical card | Existing framework/CLEAR references | Shared source of truth | CLI mirrors, agent contract |
| CLI mirrors | Canonical card | Fast-path guidance per CLI skill | Command/verification closeout |
| Runtime agent mirrors | Canonical card + skill contract | Shared deep-path escalation surface | Command/verification closeout |
| `/improve:prompt` update | Runtime agent mirror contract | Shared command path | Packet verification |
| Drift fixture decision | Canonical card + mirrors | Either a landed fixture or a documented deferral | Final packet scope sign-off |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Canonical card + `sk-improve-prompt` contract update** - 0.5 to 1 session - CRITICAL
2. **CLI mirror cards + skill-definition ALWAYS loading updates** - 1 to 2 sessions - CRITICAL
3. **Runtime `@improve-prompt` mirrors** - 0.5 to 1 session - CRITICAL
4. **`/improve:prompt` dispatch-mode update** - 0.5 to 1 session - CRITICAL
5. **Verification and packet closeout** - 0.5 to 1 session - CRITICAL

**Total Critical Path**: 3 to 6 focused sessions, depending on how much parity cleanup is needed after the first pass.

**Parallel Opportunities**:
- CLI mirror cards and runtime agent mirrors can be drafted in parallel after the canonical card exists.
- Framework-tagging across the four CLI prompt-template files can run in parallel once the task-to-framework map is locked.
- The drift fixture decision can be delayed until the end of implementation if it does not block the main behavior change.
<!-- /ANCHOR:critical-path -->
