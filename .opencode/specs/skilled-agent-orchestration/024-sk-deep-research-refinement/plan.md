---
title: "Implementation Plan: sk-deep-research Refinement [skilled-agent-orchestration/024-sk-deep-research-refinement/plan]"
description: "This plan uses the existing /spec_kit:deep-research:auto system to run autonomous research rounds that investigate improvements to itself. The research targets 3 external refere..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "deep"
  - "research"
  - "refinement"
  - "024"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/024-sk-deep-research-refinement"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: sk-deep-research Refinement via Self-Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown protocols, YAML workflows, JSONL state files |
| **Framework** | SpecKit deep-research loop (3-layer: Command → YAML → LEAF Agent) |
| **Storage** | JSONL append-only log, strategy.md, iteration-NNN.md files |
| **Testing** | Manual validation via convergence metrics + proposal quality review |

### Overview

This plan uses the existing `/spec_kit:deep-research:auto` system to run autonomous research rounds that investigate improvements to itself. The research targets 3 external reference repos (Artificial-General-Research, pi-autoresearch, autoresearch-opencode), validates 18 existing v2 proposals from spec 023, discovers new improvements, and produces implementation-ready v3 proposals with file-level specificity. The output is a refined improvement document, NOT code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md created)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (3 external repos, spec 023 proposals)
- [x] Prior research available (14-iteration cycle from spec 023)
- [x] Deep-research system v1 operational

### Definition of Done
- [ ] Deep research converges naturally (composite score > 0.60)
- [ ] All 18 v2 proposals validated with status
- [ ] v3 improvement-proposals.md created with file-level change lists
- [ ] Cross-runtime consistency audit complete
- [ ] research/research.md synthesized from all iterations
- [ ] Memory saved via generate-context.js
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Meta-research loop: the deep-research system investigates itself using its own protocols.

### Key Components
- **Orchestrator**: `/spec_kit:deep-research:auto` command + auto YAML workflow
- **Research Agent**: `@deep-research` LEAF agent (dispatched per iteration)
- **State Files**: config.json, state.jsonl, strategy.md (in `scratch/`)
- **External Sources**: 3 GitHub repos accessed via WebFetch
- **Output**: research/research.md + v3 improvement-proposals.md

### Data Flow
```
/spec_kit:deep-research:auto
  → Init: Create config.json + state.jsonl + strategy.md
  → Loop: Dispatch @deep-research per iteration
    → Agent reads state → focuses on research question
    → Agent fetches external repo code / analyzes local files
    → Agent writes iteration-NNN.md + appends JSONL + updates strategy
  → Convergence check (3-signal composite)
  → Synthesis: Compile research/research.md from all iterations
  → Save: generate-context.js → memory/
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research Preparation (Pre-dispatch setup)

Before invoking `/spec_kit:deep-research:auto`, prepare the research context:

- [ ] **1.1** Define research questions (see §4.1 below)
- [ ] **1.2** Create research-ideas.md with seeded directions from spec 023 proposals
- [ ] **1.3** Set research parameters: `maxIterations: 15`, `convergenceThreshold: 0.02`, `progressiveSynthesis: true`
- [ ] **1.4** Verify spec folder structure ready at `024-sk-deep-research-refinement/scratch/`

### Phase 2: Deep Research Execution (Autonomous)

Invoke `/spec_kit:deep-research:auto` with the prepared context:

- [ ] **2.1** Launch: `/spec_kit:deep-research:auto "Investigate improvements to sk-deep-research system"` targeting this spec folder
- [ ] **2.2** Monitor convergence (expected 8-15 iterations)
- [ ] **2.3** Verify research/research.md produced with synthesized findings

### Phase 3: Post-Research Synthesis (Manual review)

After deep-research converges, synthesize findings into actionable outputs:

- [ ] **3.1** Review research/research.md for completeness and quality
- [ ] **3.2** Create v3 improvement-proposals.md with validated proposals
- [ ] **3.3** Cross-runtime consistency audit (compare agent definitions)
- [ ] **3.4** Update spec 024 with final findings

### Phase 4: Verification

- [ ] **4.1** All 18 v2 proposals have validation status
- [ ] **4.2** New proposals discovered (target: 3+)
- [ ] **4.3** File-level change lists present for all P1/P2 proposals
- [ ] **4.4** Memory saved via generate-context.js
<!-- /ANCHOR:phases -->

---

### 4.1 Research Questions for Deep Research

These questions seed the strategy.md for the autonomous research loop:

**Core Questions (must answer):**

| # | Question | Target Source |
|---|----------|---------------|
| RQ1 | What error recovery patterns do AGR/pi-autoresearch/autoresearch-opencode implement at CODE level (not just docs)? | All 3 repos — actual source files |
| RQ2 | How has each repo's convergence/stopping logic evolved since spec 023's analysis (2026-03-18)? | Git history of all 3 repos |
| RQ3 | Which of our 18 v2 proposals are confirmed by actual running code in the reference repos? | Cross-reference proposals vs repo source |
| RQ4 | What improvements do the reference repos implement that we DON'T have in our 18 proposals? | Gap analysis across all 3 repos |
| RQ5 | Where do our 4 runtime agent definitions (Claude/Codex/OpenCode/ChatGPT) diverge in behavior? | Local file comparison |

**Exploration Questions (discover if possible):**

| # | Question | Target Source |
|---|----------|---------------|
| RQ6 | What do GitHub issues/PRs in the 3 repos reveal about real-world failure modes we haven't addressed? | GitHub issues/PRs |
| RQ7 | Are there convergence detection approaches from outside the autoresearch domain (ML training, optimization) applicable to our research loops? | Web research |
| RQ8 | What would a "v2 deep-research" look like if we started from scratch with current knowledge? | Synthesis of all findings |

### 4.2 Research Configuration

```json
{
  "specFolder": ".opencode/specs/03--commands-and-skills/024-sk-deep-research-refinement",
  "topic": "Investigate improvements to sk-deep-research: validate 18 v2 proposals, analyze 3 reference repos (AGR, pi-autoresearch, autoresearch-opencode) at code level, discover new improvements, produce v3 proposals with file-level change lists",
  "maxIterations": 15,
  "convergenceThreshold": 0.02,
  "minIterations": 5,
  "progressiveSynthesis": true,
  "stuckRecovery": {
    "maxConsecutiveNoProgress": 3,
    "recoveryStrategy": "widen_scope"
  }
}
```

### 4.3 External Repository URLs

| Repository | URL | Focus Area |
|-----------|-----|------------|
| Artificial-General-Research (AGR) | `https://github.com/JoaquinMulet/Artificial-General-Research` | Strategy persistence, error tiers, stuck detection |
| pi-autoresearch | `https://github.com/davebcn87/pi-autoresearch` | JSONL state, MAD convergence, segment model |
| autoresearch-opencode | `https://github.com/dabiggm0e/autoresearch-opencode` | Ideas backlog, context injection, sentinel pause |

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | Research loop converges naturally (not max-iterations) | Check JSONL composite score > 0.60 |
| Quality | Each iteration produces cited findings | Review iteration-NNN.md for [SOURCE:] tags |
| Completeness | All 18 proposals validated | Review v3 proposals for validation status |
| Consistency | Cross-runtime agent alignment | Diff agent definition files |
| Manual | Review research/research.md for coherence | Human review of synthesized output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-deep-research v1 | Internal | Green | Cannot run research — blocker |
| Spec 023 improvement-proposals.md | Internal | Green | Missing baseline — significant |
| GitHub repo: AGR | External | Green | Reduced reference coverage |
| GitHub repo: pi-autoresearch | External | Green | Reduced reference coverage |
| GitHub repo: autoresearch-opencode | External | Green | Reduced reference coverage |
| WebFetch tool availability | Internal | Green | Cannot access external repos |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research produces no actionable findings after 15 iterations, or system errors prevent completion
- **Procedure**:
  1. Preserve all scratch/ files (append-only state is inherently safe)
  2. Manually review iteration files for partial findings
  3. Fall back to spec 023's v2 proposals as the baseline
  4. Document failure mode in implementation-summary.md for system improvement
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preparation) ──► Phase 2 (Deep Research :auto) ──► Phase 3 (Synthesis) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 - Preparation | Spec 023 proposals, spec folder | Phase 2 |
| 2 - Deep Research | Phase 1, external repo access | Phase 3 |
| 3 - Synthesis | Phase 2 research/research.md output | Phase 4 |
| 4 - Verification | Phase 3 v3 proposals | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preparation | Low | Seed research questions + config |
| Deep Research | Med (autonomous) | 8-15 iterations, ~45 min autonomous |
| Synthesis | Med | v3 proposals + cross-runtime audit |
| Verification | Low | Checklist review |
| **Total** | | **Autonomous research + synthesis review** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Spec folder created with empty scratch/
- [x] Spec 023 proposals loaded as reference
- [ ] Research questions seeded in strategy.md

### Rollback Procedure
1. Stop research loop (delete research/.deep-research-pause sentinel if needed)
2. Preserve all scratch/ iteration files and JSONL
3. Manually synthesize findings from available iterations
4. Fall back to spec 023 v2 proposals

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — research outputs are additive, no destructive changes
<!-- /ANCHOR:enhanced-rollback -->
