---
title: "Implementation Plan: Context Agent Model Optimization [011-context-model-optimization/plan]"
description: "Optimize the @context agent's model selection to reduce API cost (66.7% savings) and Copilot premium request consumption (67% reduction) while maintaining acceptable context ret..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "context"
  - "agent"
  - "model"
  - "011"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Context Agent Model Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML frontmatter + Markdown agent definitions |
| **Framework** | OpenCode Agent System + Claude Code Agents |
| **Storage** | None |
| **Testing** | Manual quality verification via test dispatches |

### Overview
Optimize the @context agent's model selection to reduce API cost (66.7% savings) and Copilot premium request consumption (67% reduction) while maintaining acceptable context retrieval quality. The investigation analyzed three options and recommends **Option A (full Haiku)** based on reasoning-demand analysis, with Option C (hybrid) as fallback if thorough mode quality degrades.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Recommended option implemented in both agent files
- [ ] Test dispatches validate Context Package quality per mode
- [ ] Rollback procedure documented and verified

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Current Model Topology

```
Orchestrator (Opus 4.6)
    └─► @context (Sonnet 4.5)           ← TARGET FOR CHANGE
            ├─► @explore (built-in "explore" subagent, model inherited)
            └─► @research (Opus 4.6, via general subagent)
```

### Option Analysis

#### Option A: Full Haiku (RECOMMENDED)

```
Orchestrator (Opus 4.6)
    └─► @context (Haiku 4.5)            ← CHANGED
            ├─► @explore (built-in)
            └─► @research (Opus 4.6)
```

| Dimension | Assessment | Evidence |
|-----------|------------|----------|
| **Cost savings** | 66.7% per invocation, ~$918/month at 100/day | [SOURCE: Anthropic pricing — Haiku $1/$5 vs Sonnet $3/$15 per MTok] |
| **Copilot savings** | 67% fewer premium requests (0.33x vs 1.0x) | [SOURCE: GitHub Copilot premium request multipliers] |
| **Latency** | Improved — Haiku is fastest tier | [SOURCE: Anthropic model comparison — "Fastest"] |
| **Quick mode risk** | Very Low — 2-4 mechanical tool calls, 15-line output | [SOURCE: .claude/agents/context.md:94] |
| **Medium mode risk** | Low — structured synthesis follows well-defined template | [SOURCE: .claude/agents/context.md:95] |
| **Thorough mode risk** | Medium — gap detection and cross-referencing require analytical depth | [SOURCE: .claude/agents/context.md:96] |

**Why Recommended**:
1. Haiku 4.5 is "near-frontier intelligence" — significantly more capable than Haiku 3.5
2. @context's value is in its WORKFLOW (439 lines of detailed instructions), not raw reasoning power. A capable model following a detailed workflow produces consistent results.
3. The Context Package format is heavily templated — 6 mandatory sections with defined size limits per mode. This reduces synthesis to structured fill-in-the-blanks with evidence.
4. The majority of invocations are expected to be quick/medium (based on orchestrator dispatch heuristics) where Haiku is almost certainly sufficient
5. Rollback is trivial — change one line in agent frontmatter

#### Option B: Sonnet + Haiku Sub-agents (NOT RECOMMENDED)

```
Orchestrator (Opus 4.6)
    └─► @context (Sonnet 4.5)           ← NO CHANGE
            ├─► @explore (Haiku 4.5)    ← CHANGED
            └─► @research (Opus 4.6)    ← NO CHANGE (keep for deep investigation)
```

| Dimension | Assessment | Evidence |
|-----------|------------|----------|
| **Cost savings** | Minimal (~5-15% overall) | Sub-agents rarely dispatched: quick=0, medium=0-1, thorough=0-2 |
| **Complexity** | Higher — requires model parameter on every dispatch | Adds dispatch logic to agent instructions |
| **Quality preservation** | High — synthesis stays at Sonnet level | @context itself unchanged |

**Why NOT Recommended**:
- **Cost savings are minimal**: The bulk of @context's cost is the agent ITSELF, not its sub-agents. Sub-agents are dispatched 0-2 times per invocation and only in medium/thorough modes. Switching them to Haiku saves ~5-15% at most.
- **Backwards optimization**: The "mini orchestrator" pattern optimizes the wrong layer. @context IS the expensive part; @explore is already lightweight (built-in subagent, no custom prompt).
- **Added complexity for marginal benefit**: Requires modifying dispatch instructions and maintaining model parameters in agent body.

#### Option C: Hybrid — Mode-Based Model Selection (FALLBACK)

```
Orchestrator (Opus 4.6)
    ├─► @context quick/medium (Haiku 4.5)    ← Model set at dispatch
    └─► @context thorough    (Sonnet 4.5)    ← Model set at dispatch
```

| Dimension | Assessment | Evidence |
|-----------|------------|----------|
| **Cost savings** | ~47-53% (66.7% on majority of invocations) | Estimated 60-80% quick/medium at Haiku, 20-40% thorough at Sonnet |
| **Quality preservation** | High — thorough mode stays Sonnet | Complex reasoning preserved where needed |
| **Complexity** | Medium — orchestrator specifies model per dispatch | Requires orchestrator changes |

**Implementation for Claude Code:**
- Orchestrator sets `model: "haiku"` on Task dispatch for quick/medium
- Orchestrator sets `model: "sonnet"` on Task dispatch for thorough
- Agent frontmatter: `model: haiku` (default to cheaper option)

**Implementation for Copilot:**
- Agent frontmatter is static — can't dynamically select model
- Would require two agent files (`context.md` + `context-thorough.md`)
- Increases maintenance burden

**When to use**: Only if Option A produces measurably degraded Context Packages in thorough mode after trial period. Note: Option C requires its own design work (orchestrator changes for Claude Code, dual agent files for Copilot) — it is a **future optimization spec**, not an instant fallback. The real fallback is reverting to Sonnet (2 lines, 30 seconds).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Validation (prerequisite — must pass before any implementation)
- [ ] Verify `github-copilot/claude-haiku-4.5` is a valid model string (test in Copilot)
- [ ] Verify @explore model inheritance behavior in Claude Code (confirm built-in subagent inherits parent model)
- [ ] Document current @context quality baseline (save 3-5 example Context Packages from each mode)
- [ ] Confirm Task tool `model` parameter behavior with a test dispatch
- [ ] **Controlled comparison**: Run 5 identical exploration queries on both Sonnet and Haiku (same prompts, same codebase state)
  - Compare Context Package outputs: pattern quality, gap detection, evidence density, file selection precision
  - Include at least 1 quick, 2 medium, and 2 thorough mode queries
  - **Go/No-Go**: If >=4 of 5 queries produce equivalent or acceptable results → proceed to Phase 2. If not → stop and reconsider (revert to Sonnet, evaluate Option C as separate future spec)

### Phase 2: Core Implementation (Option A)
- [ ] Update `.opencode/agent/context.md` frontmatter: `model: github-copilot/claude-haiku-4.5`
- [ ] Update `.claude/agents/context.md` frontmatter: `model: haiku`
- [ ] No changes to agent body content — instructions remain identical

### Phase 3: Verification
- [ ] Test quick mode: dispatch @context with file existence check → verify Context Package structure
- [ ] Test medium mode: dispatch @context with pre-implementation scan → verify pattern analysis quality
- [ ] Test thorough mode: dispatch @context with comprehensive exploration → verify gap detection and cross-referencing
- [ ] Compare against baseline Context Packages from Phase 1

### Phase 3.5: Rollback Decision
- [ ] If quality is acceptable across all modes → keep Option A (done)
- [ ] If quality degrades across all modes → revert to Sonnet (instant rollback, 2 lines)
- [ ] If thorough mode specifically degrades but quick/medium is fine → revert to Sonnet now; consider Option C (hybrid) as separate future spec
- [ ] Document decision rationale

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Functional | Context Package structure per mode | Manual dispatch via orchestrator |
| Quality | Gap detection accuracy in thorough mode | Compare against Sonnet baseline |
| Regression | Verify quick/medium output quality | Side-by-side comparison |

### Quality Metrics

#### Structural Metrics (necessary but not sufficient)

| Metric | Threshold | How to Measure |
|--------|-----------|----------------|
| Context Package structure | All 6 sections present | Manual inspection |
| Evidence citations | Every finding has `file:line` or memory ID | Manual inspection |
| Output size compliance | Within mode limits (quick: 15 lines, medium: 60, thorough: 120) | Token count |

#### Substantive Metrics (critical — a Context Package can pass all structural checks while being shallow)

| Metric | Threshold | How to Measure |
|--------|-----------|----------------|
| Pattern precision | Agent finds the most relevant files, not just any files matching a broad pattern | Compare Haiku's file selections against Sonnet baseline and expert expectation |
| Coverage | For a known query, Context Package includes the files an expert would expect | Annotate 3-5 queries with expected file lists; measure hit rate |
| Gap detection accuracy | Thorough mode identifies >=80% of known gaps vs Sonnet baseline | Compare against expert-annotated baseline with known blind spots |
| Tool call parameter quality | Glob/Grep patterns are precise and targeted, not overly broad | Manual review of tool call logs from controlled comparison |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `github-copilot/claude-haiku-4.5` model string | External | Yellow (unverified) | Can't implement Copilot change; Claude Code still works |
| Claude Code Task `model` parameter | Internal | Green (confirmed) | N/A — already verified |
| Anthropic API pricing stability | External | Green (current rates) | Cost projections may shift |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Context Packages show measurable quality degradation (poor tool call patterns, missing files, weak gap detection, unstructured output)
- **Procedure (instant rollback)**:
  1. Revert `.opencode/agent/context.md` frontmatter to `model: github-copilot/claude-sonnet-4.5`
  2. Revert `.claude/agents/context.md` frontmatter to `model: sonnet`
  3. Total rollback effort: ~30 seconds (2 line changes)
- **Future optimization**: If thorough mode specifically degrades but quick/medium is fine, consider Option C (hybrid) as a **separate future spec** — it requires orchestrator changes and dual agent files, so it is NOT an instant fallback

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Validation) ──► Go/No-Go ──► Phase 2 (Core) ──► Phase 3 (Verify) ──► Phase 3.5 (Decision)
       │                    │                                                        │
       │                    └─► STOP (revert)                                   ┌────┴────┐
       │                                                                        │         │
  Controlled                                                              Keep A    Revert to
  Comparison                                                            (complete)   Sonnet
  (5 queries)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Validation | None | Go/No-Go decision |
| Go/No-Go | Validation (controlled comparison results) | Core |
| Core | Go/No-Go PASS | Verify |
| Verify | Core | Decision |
| Decision | Verify | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Validation (incl. controlled comparison) | Medium | ~45 min (verify strings, capture baselines, run 5 comparison queries, evaluate) |
| Core Implementation | Low | ~5 min (2 line changes) |
| Verification | Medium | ~30 min (3 test dispatches + comparison) |
| **Total** | | **~80 min** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline Context Packages saved (3-5 per mode)
- [ ] Copilot model string verified
- [ ] @explore inheritance behavior verified
- [ ] Controlled comparison passed (>=4/5 acceptable)
- [ ] Git branch created for easy revert

### Rollback Procedure (instant — the real fallback)
1. Revert model line in both agent files (2 lines total)
2. Verify @context dispatches return to Sonnet quality
3. Document failure mode for future reference

### Option C (future optimization — NOT an instant fallback)
If thorough mode specifically degrades but quick/medium is acceptable, consider Option C as a separate spec. It requires orchestrator changes (Claude Code) and dual agent files (Copilot) — not deployable from current docs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — configuration change only

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Phase 1       │────►│    Go/No-Go      │────►│    Phase 2       │────►│    Phase 3       │────►│   Phase 3.5      │
│   Validation     │     │    Decision      │     │ Core (Option A)  │     │   Verification   │     │    Decision      │
└─────────────────┘     └────────┬────────┘     └─────────────────┘     └─────────────────┘     └────────┬────────┘
                                 │                                                                        │
                          ┌──────┴──────┐                                                         ┌───────┴───────┐
                          │             │                                                         │               │
                        PASS          FAIL                                                   Keep A          Revert to
                     (proceed)     (stop, stay                                              (complete)        Sonnet
                                  on Sonnet)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Copilot model string verification | None | Verified model string | Controlled comparison |
| @explore inheritance verification | None | Confirmed behavior | Controlled comparison |
| Sonnet baseline capture | None | 3-5 Context Packages per mode | Controlled comparison |
| Controlled comparison (5 queries) | Baselines, model string | Quality comparison data | Go/No-Go decision |
| Go/No-Go decision | Controlled comparison | PASS or FAIL | Phase 2 (if PASS) |
| Frontmatter update (Copilot) | Go/No-Go PASS | Updated .opencode/agent/context.md | Verification |
| Frontmatter update (Claude Code) | Go/No-Go PASS | Updated .claude/agents/context.md | Verification |
| Quick mode test | Frontmatter updates | Quality assessment | Decision |
| Medium mode test | Frontmatter updates | Quality assessment | Decision |
| Thorough mode test | Frontmatter updates | Quality assessment | Decision |
| Rollback decision | All tests | Keep A or revert to Sonnet | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Verify Copilot model string + @explore inheritance** - ~5 min - CRITICAL (blocks comparison)
2. **Capture Sonnet baselines** - ~10 min - CRITICAL (blocks comparison)
3. **Controlled comparison (5 queries)** - ~25 min - CRITICAL (validates core assumption)
4. **Go/No-Go decision** - ~5 min - CRITICAL (gates all implementation)
5. **Update frontmatter** - ~2 min - CRITICAL
6. **Thorough mode test** - ~10 min - CRITICAL (highest quality risk)
7. **Rollback decision** - ~5 min - CRITICAL

**Total Critical Path**: ~62 min

**Parallel Opportunities**:
- Copilot model verification, @explore inheritance check, and baseline capture can run simultaneously
- Quick and medium mode tests can run in parallel (both low risk)
- Claude Code frontmatter update can proceed independently of Copilot verification

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Validation Complete | Baselines saved, model strings verified, @explore inheritance confirmed | Phase 1 (pre-comparison) |
| M1.5 | Go/No-Go Passed | Controlled comparison shows >=4/5 acceptable results | Phase 1 (post-comparison) |
| M2 | Model Switched | Both agent files updated to Haiku | Phase 2 end |
| M3 | Quality Verified | All 3 modes pass structural AND substantive quality checks | Phase 3 end |
| M4 | Decision Made | Option A accepted or reverted to Sonnet | Phase 3.5 end |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Full Haiku for @context (Chosen)

**Status**: Proposed

**Context**: @context is the highest-frequency agent, running on Sonnet for all modes. The majority of invocations are expected to be quick/medium (low-moderate reasoning) based on orchestrator dispatch heuristics. Haiku 4.5 offers "near-frontier intelligence" at 3x lower cost.

**Decision**: Switch @context to Haiku 4.5 across both platforms, contingent on passing controlled comparison (Phase 1). Agent instructions unchanged — the 439-line definition serves as a cognitive scaffold that reduces ~30-40% of reasoning burden (sequencing, formatting, budgeting), though genuine reasoning work remains in pattern selection, gap detection, and result prioritization.

**Consequences**:
- 66.7% cost reduction, 67% fewer Copilot premium requests
- Tool use quality across all modes is the primary risk — empirical validation required before committing
- Instant rollback to Sonnet (2 lines, 30 seconds) if quality degrades

**Alternatives Rejected**:
- **Option B (Sonnet + Haiku sub-agents)**: Wrong optimization layer — sub-agents are <15% of cost
- **Option C (Hybrid)**: Future optimization if thorough mode specifically degrades — requires its own design work, not an instant fallback

See `decision-record.md` for full ADR with Five Checks evaluation.

---

## APPENDIX: COST ANALYSIS DETAIL

> **Billing context note**: The cost model below uses direct Anthropic API pricing for illustration. The actual billing impact depends on which platform is primary:
> - **Copilot**: Premium request savings (67% reduction, 0.33x vs 1.0x multiplier) — the most relevant metric if Copilot is the primary platform
> - **Claude Code**: Subscription-based (Pro/Teams) — model tier may not directly affect per-token billing; savings manifest as reduced usage against rate limits
> - **Direct API**: Per-token pricing as shown below — only relevant if using direct Anthropic API access
>
> The $918/month figure assumes direct API pricing at 100 invocations/day and may not apply to subscription-based usage.

### Per-Invocation Cost Comparison (Direct API pricing)

| Mode | Input Tokens | Output Tokens | Haiku Cost | Sonnet Cost | Savings |
|------|-------------|---------------|------------|-------------|---------|
| Quick | ~10,000* | ~1,000 | $0.015 | $0.045 | 66.7% |
| Medium | ~12,000* | ~2,000 | $0.022 | $0.066 | 66.7% |
| Thorough | ~15,000* | ~4,000 | $0.035 | $0.105 | 66.7% |

*\*Input token estimates include the 439-line agent definition (~8,000-10,000 tokens sent as system prompt on every invocation). The savings ratio (66.7%) is unaffected but per-invocation absolute costs are higher than originally estimated.*

### Monthly Projection (100 invocations/day, Direct API only)

| Metric | Haiku | Sonnet | Delta |
|--------|-------|--------|-------|
| Monthly API cost (direct) | ~$660 | ~$1,980 | -$1,320 (66.7%) |
| Copilot premium requests | ~990 (0.33x × 3000) | ~3,000 (1.0x × 3000) | -67% |

### Copilot Premium Request Multipliers

| Model | Multiplier | Relative Cost |
|-------|-----------|---------------|
| Haiku 4.5 | 0.33x | Cheapest option |
| Sonnet 4.5 | 1.0x | Standard |
| Opus 4.6 | 3.0x | Most expensive |

---

## APPENDIX: REASONING DEMAND ANALYSIS

### @context Operations Classified

| Operation | Type | Reasoning Level | Haiku Suitability |
|-----------|------|----------------|-------------------|
| memory_match_triggers() | Tool call | Minimal | High |
| memory_context() | Tool call | Minimal | High |
| Glob pattern selection | Decision | Low-Medium | High |
| Grep pattern selection | Decision | Low-Medium | High |
| Read file selection | Decision | Medium | High |
| Result filtering | Analysis | Medium | Medium-High |
| Gap detection | Analysis | High | Medium |
| Dispatch decision (@explore vs @research) | Judgment | High | Medium |
| Context Package synthesis | Composition | Medium-High | Medium-High |
| Output compression (CWB) | Judgment | Medium | Medium-High |
| Recommendation formulation | Judgment | High | Medium |

### Key Insight

@context's detailed 439-line agent definition functions as a **cognitive scaffold** — it specifies exactly:
- When to check memory (always first)
- What tool sequence to follow per mode
- When to dispatch and which agent to use
- What output format to produce (6 mandatory sections)
- Size limits per mode and per section

This scaffolding reduces ~30-40% of cognitive load (sequencing, formatting, budgeting). The model doesn't need to *decide* what workflow to follow — it needs to *follow instructions well* and *synthesize findings coherently*. Haiku 4.5's "near-frontier intelligence" combined with strong instruction-following should be sufficient for this structured workflow.

**However**, genuine reasoning work remains that the scaffold does NOT reduce:
- **Glob/Grep pattern quality** — choosing `src/**/*auth*` vs `lib/auth/**` requires codebase understanding, not just instruction-following
- **Gap detection** — inferring what SHOULD exist from what DOES exist is analytical reasoning the scaffold cannot template
- **Result filtering** — when Glob returns 40 files and the agent must pick 2-3 to Read, that selection is judgment-based
- **Dispatch decisions** — whether to dispatch @explore vs @research when results are ambiguous requires situational assessment

This means the real risk is **tool use quality across all modes**, not just thorough mode. If Haiku constructs worse glob patterns, the degradation is multiplicative — worse file discovery → worse grep scope → worse file selection → worse Context Packages. This is why **empirical validation (Phase 1 controlled comparison) is a prerequisite**, not an afterthought.

The highest-risk area remains **thorough mode's gap detection** — identifying what's MISSING from findings requires understanding the *absence* of expected patterns, which is a harder reasoning task. But even quick/medium modes depend on pattern quality that must be verified empirically.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones, critical path
- Architecture decision records
-->
