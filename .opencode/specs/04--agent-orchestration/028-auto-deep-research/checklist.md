---
title: "Verification Checklist: Autonomous Deep Research Loop"
description: "Verification Date: 2026-03-18"
trigger_phrases:
  - "autoresearch checklist"
  - "verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Autonomous Deep Research Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md -- Evidence: spec.md created with 9 requirements (REQ-001 through REQ-009)
- [x] CHK-002 [P0] Technical approach defined in plan.md -- Evidence: plan.md created with 5-phase breakdown and dependency graph
- [x] CHK-003 [P1] Dependencies identified and available -- Evidence: orchestrator dispatch, WebFetch, Spec Kit Memory MCP all exist

---

## Artifact Completeness

- [x] CHK-010 [P0] @deep-research agent created at .claude/agents/autoresearch.md -- Evidence: File created with LEAF enforcement, state protocol, iteration workflow
- [x] CHK-011 [P0] /spec_kit:deep-research command created with auto + confirm YAML -- Evidence: autoresearch.md + 2 YAML workflows created
- [x] CHK-012 [P0] sk-deep-research SKILL.md created with 8 sections -- Evidence: SKILL.md created following sk-git pattern
- [x] CHK-013 [P1] All 4 reference docs created -- Evidence: loop-protocol.md, state-format.md, convergence.md, quick_reference.md
- [x] CHK-014 [P1] Both templates created -- Evidence: deep-research-config.json, deep-research-strategy.md

---

## Agent Compliance

- [x] CHK-020 [P0] Agent is LEAF-only (no sub-agent dispatch) -- Evidence: Section 0 ILLEGAL NESTING block present
- [x] CHK-021 [P0] Agent reads state files before acting -- Evidence: Section 1 CORE WORKFLOW step 1 is "Read state"
- [x] CHK-022 [P0] Agent writes findings to files (not context) -- Evidence: Section 4 STATE MANAGEMENT requires file writes
- [x] CHK-023 [P1] Agent has correct tool set -- Evidence: Frontmatter lists Read, Write, Edit, Bash, Grep, Glob, WebFetch
- [x] CHK-024 [P1] Agent uses opus model -- Evidence: Frontmatter specifies model: opus

---

## Command Compliance

- [x] CHK-030 [P0] YAML manages loop lifecycle -- Evidence: phase_loop with convergence check in both YAML files
- [x] CHK-031 [P0] Setup phase consolidates all questions -- Evidence: Single consolidated prompt in command spec
- [x] CHK-032 [P1] TOML registration created -- Evidence: .agents/commands/autoresearch.toml exists
- [x] CHK-033 [P1] Both execution modes work -- Evidence: autoresearch_auto.yaml and autoresearch_confirm.yaml

---

## Registration

- [x] CHK-040 [P0] skill_advisor.py routes "deep research" to sk-deep-research -- Evidence: Keywords added to INTENT_BOOSTERS and PHRASE_SKILL_MAP
- [x] CHK-041 [P1] CLAUDE.md agent routing table updated -- Evidence: @deep-research added to Section 6
- [x] CHK-042 [P1] orchestrate.md agent selection updated -- Evidence: @deep-research added to agent table
- [x] CHK-043 [P1] Skill README catalog updated -- Evidence: sk-deep-research added, count 16 to 17
- [x] CHK-044 [P2] descriptions.json entry added -- Evidence: 028-auto-deep-research entry present

---

## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md -- Evidence: 6 ADRs covering loop engine, LEAF agent, state format, MCP exclusion, namespace separation, iteration cap
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) -- Evidence: All 6 ADRs have Status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale -- Evidence: Each ADR has Alternatives Considered table

---

## Legacy Removal (Phase 5.5)

- [x] CHK-050 [P0] All 9 legacy @research files deleted (6 agent defs, 1 command, 2 YAMLs) -- Evidence: `git rm` confirmed, `ls` returns "No such file" for all paths
- [x] CHK-051 [P0] All orchestrate agents updated (5 runtimes) -- Evidence: routing tables, dispatch templates, agent files tables all reference @deep-research
- [x] CHK-052 [P0] All speckit agents updated (5 runtimes) -- Evidence: permission exceptions reference @deep-research, cross-agent tables updated
- [x] CHK-053 [P1] All deep-research agents updated (5 runtimes) -- Evidence: legacy /spec_kit:research command rows removed from command tables
- [x] CHK-054 [P1] Framework docs updated (CLAUDE.md, AGENTS.md, README.md, .opencode/README.md) -- Evidence: @research entry replaced with @deep-research, /spec_kit:research removed from command lists
- [x] CHK-055 [P1] Spec_kit YAML workflows updated (plan/complete, auto/confirm) -- Evidence: agent_availability references deep-research.md
- [x] CHK-056 [P1] Install guides updated (3 files) -- Evidence: research agent removed from registration tables
- [x] CHK-057 [P1] .codex/config.toml updated -- Evidence: [agents.research] replaced with [agents.deep-research]
- [x] CHK-058 [P0] Zero stale references verified -- Evidence: `grep -r "@research[^-]\|spec_kit:research[^-]"` returns 0 matches (excluding changelog/specs)
- [x] CHK-059 [P1] spec_kit command README.txt updated -- Evidence: all 7 locations updated (trigger phrase, command table, dependencies table, file listing, workflow diagram, agent delegation table, usage example); independent review scored 100/100

---

## v2: Research-Validated Improvements

> 18 proposals from 14-iteration deep research. Source: `scratch/improvement-proposals.md` v2

### Phase 6: P1 Robustness & Convergence

- [ ] CHK-200 [P0] JSONL parser skips malformed lines without crashing -- Evidence: try/catch per line + warning count
- [ ] CHK-201 [P0] JSONL parser applies defaults for missing fields -- Evidence: `status ?? "complete"`, `newInfoRatio ?? 0`
- [ ] CHK-202 [P0] Exhausted approaches use structured BLOCKED format -- Evidence: `### [Category] -- BLOCKED` in strategy template
- [ ] CHK-203 [P1] Positive PRODUCTIVE selection for high-value approach categories -- Evidence: `### [Category] -- PRODUCTIVE` format
- [ ] CHK-204 [P0] State recovery function reconstructs JSONL from iteration files -- Evidence: Parses `## Assessment` sections from iteration-*.md
- [ ] CHK-205 [P1] Iteration template includes `## Reflection` section -- Evidence: Section present in agent output format
- [ ] CHK-206 [P0] 5-tier error recovery documented in agent protocol -- Evidence: All 5 tiers defined in convergence.md and agent definition
- [ ] CHK-207 [P0] Composite convergence uses 3 signals -- Evidence: Rolling avg (0.30) + MAD (0.35) + question entropy (0.35) in convergence.md
- [ ] CHK-208 [P1] Composite convergence degrades gracefully with < 4 iterations -- Evidence: MAD omitted, weights redistributed
- [ ] CHK-209 [P1] Individual convergence signal values exposed in JSONL -- Evidence: Signal values in event record

### Phase 7: P2 Enrichment & User Control

- [ ] CHK-210 [P1] Ideas backlog checked at strategy init -- Evidence: File read step in loop protocol
- [ ] CHK-211 [P1] Ideas backlog checked during stuck recovery -- Evidence: Heuristic references ideas file
- [ ] CHK-212 [P1] Sentinel pause file halts loop cleanly -- Evidence: Check for `.deep-research-pause`, log event, halt with message
- [ ] CHK-213 [P1] Compact state summary generated at dispatch time -- Evidence: 200-token summary template in loop protocol
- [ ] CHK-214 [P1] 3 explicit stuck recovery heuristics documented -- Evidence: Try opposites, combine findings, audit low-value in convergence.md
- [ ] CHK-215 [P1] Segment field present on JSONL records -- Evidence: `"segment":N` in iteration records
- [ ] CHK-216 [P1] Convergence filters by current segment -- Evidence: Rolling averages scoped to segment
- [ ] CHK-217 [P2] Scored branching scores branches by newInfoRatio -- Evidence: Scoring logic in loop protocol
- [ ] CHK-218 [P2] Breakthrough detection flags > 2x wave average -- Evidence: Threshold check in orchestration

### Phase 8: P3 Polish

- [ ] CHK-220 [P2] MAD noise floor computed and logged -- Evidence: Advisory event in JSONL
- [ ] CHK-221 [P2] Progress visualization shows newInfoRatio trend -- Evidence: Markdown summary in strategy.md or progress.md
- [ ] CHK-222 [P2] Git commits per iteration use targeted git add -- Evidence: Only state files staged, not `-A`
- [ ] CHK-223 [P2] Commit messages sanitized -- Evidence: No shell metacharacters in message

### Phase 9: P4 Track

- [ ] CHK-230 [P2] File mutability declarations in config -- Evidence: `fileProtection` map in config schema
- [ ] CHK-231 [P2] Context isolation via `claude -p` dispatch option -- Evidence: Shell invocation in loop protocol
- [ ] CHK-232 [P2] Simplicity criterion defined in assessment -- Evidence: Bonus for consolidation in agent definition

---

## Verification Summary

### v1 + Legacy Removal (Complete)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items (v1) | 11 | 11/11 |
| P1 Items (v1) | 10 | 10/10 |
| P2 Items (v1) | 1 | 1/1 |
| P0 Items (legacy removal) | 4 | 4/4 |
| P1 Items (legacy removal) | 6 | 6/6 |

**Verification Date**: 2026-03-18

### v2 (Pending)

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 13 | 0/13 |
| P2 Items | 7 | 0/7 |

**Status**: Not started -- awaiting implementation of Phase 6-9
