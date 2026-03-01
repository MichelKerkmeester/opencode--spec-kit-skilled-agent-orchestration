# SpecKit Autonomous Execution Map

**Document Version:** 1.0  
**Source:** spec_kit_complete_auto.yaml (929 lines)  
**Last Updated:** Feb 15, 2026  
**Scope:** 14-Step Workflow with Quality Gates, Checkpoints, and Learning Capture  

---

## EXECUTIVE SUMMARY

This document provides a comprehensive execution map for the SpecKit 14-step autonomous workflow. The workflow implements spec-driven development with mandatory compliance gates, continuous validation, and progressive task tracking. It enforces a strict sequential order (lines 317–329) while supporting optional research and debug integration workflows triggered by confidence thresholds and failure conditions.

**Core Operating Mode** (lines 11–28): Autonomous execution without step-by-step approval. Workflow completes through continuous self-validation at quality gates (pre-execution: line 242–251, planning gate: line 252–267, post-execution: line 268–278).

**Key Features:**
- **Sequential Enforcement:** Step order is mandatory (line 319), skip not allowed (line 319)
- **Phase Gate (Hard Block):** Between Step 7 and Step 8 (line 321, 605–615) — stops workflow until spec/plan/tasks verified
- **Parallel Dispatch:** Enabled for Steps 3, 6, 8, 10 with @context agents (line 160, 496–531)
- **Learning Capture:** PREFLIGHT (Step 9.5, line 652–657) and POSTFLIGHT (Step 11.5, line 787–792) epistemic baseline tracking
- **Memory Checkpoints:** At Step 6.5 (line 569–582), Step 10.5 (line 724–737), Step 13 (line 794–833)
- **Confidence Framework:** Thresholds at 80%+ (proceed), 40–79% (caution), <40% (stop & clarify) (line 294–300)
- **Circuit Breaker:** Fallback to general agent if specialized agents fail 3+ times (line 283–288)

**Documentation Levels:** Auto-selected based on LOC: Level 1 (<100), Level 2 (100–499), Level 3 (≥500) (line 93–111). Each level escalates required documentation (spec.md, plan.md, tasks.md → +checklist.md → +decision-record.md).

**Quality Gates (Hard Blocks):**
1. **Pre-Execution Gate** (line 242–251): Score ≥70 before Step 1
2. **Planning Gate** (line 252–267): Score ≥70 between Step 7 & 8 — blocks implementation if P0 items fail
3. **Post-Execution Gate** (line 268–278): Score ≥70 after Step 12 — blocks completion claims

**Autonomous Execution Principles** (line 875–880): Make informed decisions, self-validate, document reasoning, handle uncertainty conservatively. Completion requires all steps done + implementation validated + docs generated + quality met + context saved.

---

## CRITICAL GATES TABLE

| Gate | Location | Blocking | Threshold | Trigger | Action if Failed |
|------|----------|----------|-----------|---------|-----------------|
| **Pre-Execution** | Before Step 1 | HARD | 70/100 | Workflow start | Block until gates pass (line 251) |
| **Phase Gate** | After Step 7 | HARD | Pass/Fail | spec/plan/tasks checked | Return to incomplete step (line 326) |
| **Planning Gate** | After Step 7 | HARD | 70/100 | Review approval (line 267) | P0 items incomplete block (line 266) |
| **Post-Execution** | After Step 12 | HARD | 70/100 | Completion claim | Require missing items (line 278) |
| **P0 Checklist** | Step 11 | HARD | All [x] | Level 2+ task verification | Cannot proceed (line 753) |
| **Circuit Breaker** | Step 6,8,10 | SOFT | Fail 3x | Agent dispatch failure | Fallback to general (line 286) |

---

## STEP-BY-STEP EXECUTION CHECKLIST

### STEP 1: Request Analysis (15 lines per activity)

**Purpose** (line 358–359): Analyze inputs and define development scope  
**Duration:** ~10–15 minutes | **Deliverable:** Confirmed scope, verified spec folder  
**Validation Criteria:** All user inputs analyzed, scope defined, confidence ≥40%  
**Acceptance Criteria:** Spec folder path confirmed OR auto-created, development scope documented

**Activities:**
- Analyze all user inputs (REQUEST, CONTEXT, ISSUES, STAGING LINK, FILES scope) — line 366–371
- Define development scope for spec folder
- Verify or create spec folder structure (auto-create if empty, line 360)
- Check for existing artifacts
- Establish development scope (scope_policy.default = "specs/**", line 88)

**Confidence Checkpoint** (line 372–378):
- Scoring: Requirements clarity (0.40), Scope definition (0.30), Context availability (0.30)
- Thresholds: ≥80% → proceed; 40–79% → document assumptions; <40% → STOP & ask A/B/C

**Evidence Sources:**
- spec_folder handling: Line 73, 85–87
- Confidence framework: Line 372–378
- Defaults: Line 87

---

### STEP 2: Pre-Work Review (10 lines)

**Purpose** (line 382): Review skills folder and project standards  
**Duration:** ~5 minutes | **Deliverable:** Coding standards summary, architectural patterns extracted  
**Validation Criteria:** AGENTS.md reviewed, coding standards identified  
**Acceptance Criteria:** Project conventions documented, constraints listed

**Activities:**
- Read AGENTS.md for project principles (line 384)
- Check skills folder (.opencode/skill/) for relevant coding standards (line 385)
- Extract coding standards summary (line 386)
- Identify architectural patterns (line 387)
- Document project conventions & constraints (line 388–390)

**Evidence Sources:**
- Phase 2 purpose: Line 382–393
- Required documents: Line 391

---

### STEP 3: Specification (20 lines)

**Purpose** (line 411–412): Create comprehensive feature specification  
**Duration:** ~20–30 minutes | **Deliverable:** spec.md with acceptance criteria, user scenarios  
**Validation Criteria:** All spec sections completed, <40% clarity = marked [NEEDS CLARIFICATION]  
**Acceptance Criteria:** spec.md exists, requirements testable, success criteria measurable

**Activities:**
- Find highest feature number across all sources
- Run create.sh script (line 423) with calculated number
- Estimate complexity & select documentation level using progressive enhancement (line 424–427)
- Load spec.md template & preserve exact structure (line 428)
- Parse user description, extract key concepts, identify actors/actions/data/constraints (line 429–431)
- Make informed guesses for unclear aspects (line 431)
- Fill User Scenarios & Testing section (line 432)
- Generate Functional Requirements (testable, line 433)
- Define Success Criteria (measurable, tech-agnostic, line 434)
- Identify Key Entities if data involved (line 435)
- For Level 2+, include checklist.md (line 436)
- For Level 3, include decision-record.md with Traceability, Risk Matrix, Rollback Plan (line 437)

**Confidence Checkpoint** (line 438–444):
- Evaluate after drafting spec.md content
- Scoring: Requirements completeness (0.35), Acceptance criteria clarity (0.35), Technical feasibility (0.30)
- ≥80% → finalize & proceed; 40–79% → add [NEEDS CLARIFICATION] markers; <40% → STOP & ask

**Parallel Dispatch Note** (line 413–420): May dispatch 2 parallel agents (spec_explorer, requirement_analyzer) via Task tool if complexity detected. Fallback = proceed with inline activities.

**Evidence Sources:**
- Step 3 activities: Line 421–444
- Parallel dispatch: Line 413–420
- Template reference: Line 448

---

### STEP 4: Clarification (10 lines)

**Purpose** (line 451–452): Resolve ambiguities and clarify requirements  
**Duration:** ~10 minutes | **Deliverable:** Resolved ambiguities, updated spec.md  
**Validation Criteria:** Max 3 clarifications prioritized by impact, codebase patterns researched  
**Acceptance Criteria:** All [NEEDS CLARIFICATION] markers resolved, assumptions documented

**Activities:**
- Extract all [NEEDS CLARIFICATION] markers from spec (line 454)
- Limit to max 3 clarifications, prioritize by impact (line 455)
- Make informed guesses for lower-priority items (line 456)
- Research codebase for patterns (line 457)
- Test in browser (if staging URL provided, line 458)
- Resolve ambiguities through systematic investigation (line 459)
- Update spec.md with resolved clarifications (line 460)
- Document all assumptions made (line 461)

**Evidence Sources:**
- Clarification activities: Line 453–462

---

### STEP 5: Quality Checklist (15 lines)

**Purpose** (line 465–466): Generate validation checklist AND use for active verification (Level 2+ requirement)  
**Duration:** ~15 minutes | **Deliverable:** checklist.md with P0/P1/P2 prioritization  
**Validation Criteria:** All checklist items verified, P0 items complete  
**Acceptance Criteria:** checklist.md exists, P0 all [x], P1 either [x] or approved deferral

**Activities:**
- Check documentation level — skip for Level 1, MANDATORY for Level 2+ (line 469–470)
- Load checklist.md template (line 470)
- Generate domain-specific validation items with priorities (P0/P1/P2, line 471)
- Create checklist file at FEATURE_DIR/checklist.md (line 472)
- FOR EACH ITEM: Verify condition → Mark [x] with evidence → If not met: document blocker/deferral (line 473)
- Ensure ALL P0 items complete (HARD BLOCKER, line 474)
- Ensure ALL P1 items complete OR user-approved deferral (line 475)
- Document P2 deferrals with reasons (line 476)

**P0/P1/P2 Handling** (line 477–480):
- P0: BLOCKER — Cannot proceed without completion
- P1: Required — Complete or get user approval to defer
- P2: Optional — Can defer with documented reason

**Evidence Sources:**
- Step 5 activities: Line 467–487
- P0/P1/P2 handling: Line 477–480

---

### STEP 6: Planning (25 lines + Parallel Dispatch)

**Purpose** (line 489–490): Create technical plan with implementation approach  
**Duration:** ~30–45 minutes | **Deliverable:** plan.md with technical approach, dependencies, test strategy  
**Validation Criteria:** Technical approach clear, all dependencies mapped  
**Acceptance Criteria:** plan.md exists, risk identification documented, pattern alignment verified

**Parallel Dispatch Note** (line 492–494, 496–531):
Dispatches 4 parallel agents via Task tool simultaneously:
- **architecture_explorer:** Project structure, entry points, component connections
- **feature_explorer:** Similar features, related patterns
- **dependency_explorer:** Imports, modules, affected areas
- **test_explorer:** Test patterns, testing infrastructure

Verification approach (line 524–529): Read each file → Verify/refute hypotheses → Cross-reference → Build mental model → Resolve conflicts. **Fallback** (line 531): Proceed with inline activities if parallel dispatch fails.

**Activities:**
- Run check-prerequisites.sh --json --paths-only (line 534)
- Load FEATURE_SPEC and AGENTS.md (line 535)
- Load plan.md, preserve exact structure (line 536)
- Fill Technical Context (mark unknowns as NEEDS CLARIFICATION, line 537)
- Fill Constitution Check section (line 538)
- Evaluate gates (line 539)
- Phase 0: Generate research.md to resolve unknowns (line 540)
- Phase 1: Define component structure & interfaces (line 541)
- Generate Testing Strategy with test pyramid (line 542)
- Generate Success Metrics from spec criteria (line 543)
- Import Risk Matrix from spec (line 544)
- Generate Dependencies Tables (line 545)
- Generate Communication & Review sections (line 546)
- Re-evaluate Constitution Check post-design (line 547)
- Generate Phase 2–4 outlines (implementation phases, line 548)

**Confidence Checkpoint** (line 559–566):
- Evaluate after drafting plan.md content
- Scoring: Technical approach clarity (0.30), Risk identification (0.25), Dependency mapping (0.25), Pattern alignment (0.20)
- ≥80% → finalize & proceed with sources cited; 40–79% → flag uncertainties, add RISK markers; <40% → STOP & request research or clarification
- Escalation (line 566): 2 failed attempts OR 10 minutes → present options to user

**Evidence Sources:**
- Parallel dispatch config: Line 492–530
- Planning activities: Line 533–548
- Confidence checkpoint: Line 559–566

---

### STEP 6.5: Checkpoint — Planning Complete (5 lines)

**Purpose** (line 569–571): Save context checkpoint after planning phase complete  
**Duration:** ~2 minutes | **Deliverable:** Memory checkpoint file  
**Validation Criteria:** Context file written to disk  
**Acceptance Criteria:** checkpoint__planning_complete.md exists in memory/

**Activities:**
- Save context checkpoint using system-spec-kit skill (line 574)
- Record progress up to planning milestone for session recovery (line 575)
- Preserve planning decisions, exploration findings, technical approach (line 576)

**Evidence Sources:**
- Checkpoint definition: Line 569–582

---

### STEP 7: Task Breakdown (15 lines)

**Purpose** (line 584–585): Break plan into executable implementation tasks (Level 1+ requirement)  
**Duration:** ~15–20 minutes | **Deliverable:** tasks.md with dependencies, time estimates, phases  
**Validation Criteria:** All tasks documented, dependencies mapped, format valid  
**Acceptance Criteria:** tasks.md exists, task phases defined, estimates realistic

**Activities:**
- Run check-prerequisites.sh --json (line 588)
- Load plan.md for tech stack & architecture (line 589)
- Load spec.md for user stories & priorities (line 590)
- Load optional artifacts (research, line 591)
- Extract user stories with priorities (P0, P1, P2, P3, line 592)
- Generate tasks organized by user story (line 593)
- Create dependency graph for task ordering (line 594)
- Mark parallel-executable tasks with [P] (line 595)
- Define task phases (Setup, Tests, Core, Integration, Polish, line 596)
- Generate time estimates (15–60 min per task, line 597)
- Create tasks.md with proper structure (line 598)
- Validate task format & coverage (line 599)

**Phase Gate Checkpoint** (line 605–615): **HARD BLOCK**
After Step 7 completes, STOP and verify Phase Gate:
1. spec.md exists → If not, return to Step 3
2. plan.md exists → If not, return to Step 6
3. tasks.md exists → If not, this step failed
4. No [NEEDS CLARIFICATION] in spec.md
5. Mark "PHASE GATE: PASSED"
6. **ONLY THEN** proceed to Step 8

**Evidence Sources:**
- Task breakdown activities: Line 587–603
- Phase gate checkpoint: Line 605–615 (HARD BLOCK enforcement)

---

### STEP 8: Analysis (15 lines + Parallel Dispatch)

**Purpose** (line 617–618): Verify consistency across all artifacts  
**Duration:** ~15 minutes | **Deliverable:** Consistency report, coverage verification, gap analysis  
**Validation Criteria:** No critical inconsistencies, all requirements covered, no underspecification  
**Acceptance Criteria:** Consistency verified, gaps identified, alignment confirmed

**Parallel Dispatch Note** (line 619–627):
May dispatch 2 parallel agents via Task tool:
- **consistency_analyzer:** Cross-artifact consistency & requirement coverage
- **gap_detector:** Missing requirements, underspecification, edge cases

Complexity boost = +10 (line 622). Fallback: Proceed with inline activities.

**Activities:**
- Load all artifacts (spec.md, plan.md, tasks.md, line 629)
- Build requirements inventory from spec (line 630)
- Build task coverage mapping from tasks (line 631)
- Run detection passes: Duplication, Ambiguity, Underspecification, Constitution alignment, Coverage, Inconsistency (line 632)
- Assign severity levels (CRITICAL, HIGH, MEDIUM, LOW, line 633)
- Generate consistency report, coverage verification, gap analysis (line 634)
- Suggest remediations (non-destructive, user must approve, line 635)

**Evidence Sources:**
- Analysis activities: Line 628–637
- Parallel dispatch: Line 619–627

---

### STEP 9: Implementation Check (12 lines)

**Purpose** (line 639–640): Verify all prerequisites for implementation  
**Duration:** ~5 minutes | **Deliverable:** Implementation greenlight report  
**Validation Criteria:** All prerequisites verified, no blockers, environment ready  
**Acceptance Criteria:** check-prerequisites.sh passes, blockers = none

**Activities:**
- Run check-prerequisites.sh --json --require-tasks (line 642)
- Verify plan.md & tasks.md exist (line 643)
- Check all checklists status (line 644)
- Verify no blockers exist (line 645)
- Verify environment is ready (line 646)
- Verify dependencies loaded (line 647)
- Generate implementation greenlight report (line 648)

**Checks** (line 649): prerequisites=verified, blockers=none, environment=ready

**Evidence Sources:**
- Step 9 activities: Line 640–650

---

### STEP 9.5: PREFLIGHT Capture (5 lines)

**Purpose** (line 652–657): Capture epistemic baseline before implementation  
**Tool:** task_preflight (MCP call)  
**Parameters:** specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore  
**Duration:** <1 minute | **Deliverable:** PREFLIGHT baseline record  
**Skip Conditions:** <10 LOC change OR user says "skip preflight"

**Activities:**
- Call task_preflight with current scores (0–100 scale)
- Record knowledge, uncertainty, context baseline
- Preserved for post-implementation learning delta calculation (Step 11.5)

**Evidence Sources:**
- PREFLIGHT definition: Line 652–657
- Learning capture framework: Line 6 (learning.md integration)

---

### STEP 10: Development (25 lines + Parallel Dispatch + Debug Integration)

**Purpose** (line 659–660): Execute implementation following task plan  
**Duration:** Varies | **Deliverable:** Code implementation, tests, validated features  
**Validation Criteria:** All tasks [x] in tasks.md, code follows standards, tests pass  
**Acceptance Criteria:** Implementation complete, checklist [x], staging validated

**Parallel Dispatch Note** (line 661–670):
May dispatch 2 parallel agents via Task tool:
- **implementation_agent:** Core implementation tasks from tasks.md
- **test_agent:** Test implementation & validation

Complexity boost = +15. **Warning** (line 669): Development tasks may have dependencies — verify task order. Fallback: Proceed with inline activities.

**Activities:**
- Load tasks.md & parse task structure (line 672)
- Execute implementation phase by phase (line 673)
- Setup first (project structure, dependencies, configuration, line 674)
- Follow TDD approach (tests before code where applicable, line 675)
- Core development (models, services, endpoints, line 676)
- Integration work (database, middleware, logging, line 677)
- Polish & validation (unit tests, optimization, docs, line 678)
- Respect task dependencies (sequential vs parallel, line 679)
- Update task checklist progressively (mark [X] when complete, line 680)
- Validate against acceptance criteria (line 681)
- Log progress after each completed task (line 682)
- Document any deviations from plan (line 683)

**Approach** (line 684): autonomous_implementation_with_checkpoints

**Requirements** (line 685–689):
- Follow coding standards from skills folder (line 686)
- Update task_checklist_progressively (line 687)
- Test before commit (line 688)
- Validate continuously (line 689)

**Confidence Checkpoint Per Task** (line 690–697):
- Evaluate before each significant code change
- Scoring: Implementation clarity (0.35), Pattern alignment (0.30), Risk awareness (0.35)
- ≥80% → implement & mark [x]; 40–79% → implement with extra validation + inline comments; <40% → STOP & don't implement uncertain code

**Debug Integration** (line 698–715):
- Failure tracking enabled (line 699)
- If task fails 3+ times (line 700):
  - With `:auto-debug` flag → auto_dispatch_debug (line 702)
  - Without flag → suggest debug via A/B/C/D prompt (line 704–710)
- Debug dispatch: general-purpose agent, 120s timeout, includes error_message + affected_files + previous_attempts + task_id (line 711–715)

**Completion Checkpoint** (line 717–722): **HARD BLOCK**
Before marking complete: Read tasks.md → Count [ ] vs [x] → ALL must be [x] and code works → THEN mark complete. Failure action: Continue development, do not proceed to Step 11.

**Evidence Sources:**
- Development activities: Line 659–723
- Parallel dispatch: Line 661–670
- Debug integration: Line 698–715
- Confidence checkpoint: Line 690–697

---

### STEP 10.5: Checkpoint — Development Complete (5 lines)

**Purpose** (line 724–726): Save context checkpoint after development phase complete  
**Duration:** ~2 minutes | **Deliverable:** Memory checkpoint file  
**Validation Criteria:** Context file written  
**Acceptance Criteria:** checkpoint__development_complete.md exists in memory/

**Activities:**
- Save context checkpoint using system-spec-kit skill (line 729)
- Record progress up to development milestone (line 730)
- Preserve implementation decisions, code changes, debugging insights (line 731)

**Evidence Sources:**
- Checkpoint definition: Line 724–737

---

### STEP 11: Checklist Verify (12 lines)

**Purpose** (line 739–741): Verify all P0/P1 checklist items complete before claiming completion  
**Duration:** ~10 minutes | **Deliverable:** Checklist verification report with evidence  
**Validation Criteria:** All P0 items [x], P1 items [x] or approved deferral  
**Acceptance Criteria:** P0 = 100% complete, P1 deferrals documented

**Activities:**
- Load checklist.md from spec folder (line 744)
- Verify ALL P0 items marked [x] with evidence (line 745)
- Verify ALL P1 items either [x] or have documented user approval to defer (line 746)
- P2 items may be deferred without approval (line 747)
- Document verification results with evidence format (line 748)

**Evidence Format** (line 749–750):
```
- [x] Task description [EVIDENCE: file.js:45-67 - implementation verified]
```

**P0 Enforcement** (line 751–753):
- Blocking: true
- On incomplete: "P0 ITEMS INCOMPLETE — Cannot proceed. WORKFLOW HALTED."

**P1 Enforcement** (line 754–757):
- Blocking: soft
- Allow deferral: true
- On incomplete: "P1 items incomplete. A) Complete remaining B) Document deferral and proceed"

**Evidence Sources:**
- Step 11 activities: Line 739–759
- P0/P1 enforcement: Line 751–757

---

### STEP 11.5: POSTFLIGHT Capture (5 lines)

**Purpose** (line 787–792): Capture learning delta after implementation  
**Tool:** task_postflight (MCP call)  
**Parameters:** specFolder, taskId, knowledgeScore, uncertaintyScore, contextScore  
**Duration:** <1 minute | **Deliverable:** POSTFLIGHT baseline record  
**Skip Conditions:** <10 LOC change OR no PREFLIGHT captured

**Activities:**
- Call task_postflight with final scores
- Calculates Learning Index = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)
- Records gapsClosed + newGapsDiscovered
- Enables learning pattern analysis across tasks

**Evidence Sources:**
- POSTFLIGHT definition: Line 787–792

---

### STEP 12: Completion (15 lines)

**Purpose** (line 761–762): Generate implementation summary and verify completion  
**Duration:** ~10 minutes | **Deliverable:** implementation-summary.md with verification steps & deviations  
**Validation Criteria:** All tasks completed, features match spec, tests pass, coverage met  
**Acceptance Criteria:** implementation-summary.md exists with all required sections

**Activities:**
- Verify all tasks completed (line 764)
- Check implemented features match specification (line 765)
- Validate tests pass & coverage meets requirements (line 766)
- Confirm implementation follows technical plan (line 767)
- Generate implementation-summary.md (line 768)
- Update all task status to completed (line 769)
- Verify staging if environment provided (line 770)

**Summary Document** (line 771–773):
- Location: [SPEC_FOLDER]/implementation-summary.md
- Required sections: files_modified_created, verification_steps_taken, deviations_from_plan, skill_updates, recommended_next_steps, browser_testing_results

**Verification Summary** (line 774–777):
- Checklist verification required (line 775)
- Must include: total_items_count, p0_status, p1_status, deferred_p2_items, checklist_link

**Completion Checkpoint** (line 780–785): **HARD BLOCK**
Before marking complete: implementation-summary.md exists with all required sections → THEN mark complete. Failure action: Create implementation-summary.md before proceeding.

**Evidence Sources:**
- Step 12 activities: Line 762–785
- Summary sections: Line 773

---

### STEP 13: Save Context (15 lines)

**Purpose** (line 794–795): Save conversation context for documentation and team sharing  
**Duration:** ~5 minutes | **Deliverable:** Memory context file indexed  
**Validation Criteria:** Context file written, indexed, searchable  
**Acceptance Criteria:** [SPEC_FOLDER]/memory/[timestamp]__session.md exists & indexed

**Activities:**
- Invoke system-spec-kit skill (line 797)
- Preserve session metadata & timeline (line 798)
- Preserve full dialogue flow with decisions (line 799)
- Auto-generate workflow flowcharts (line 800)
- Preserve file changes & implementation details (line 801)
- Index memory file for immediate search availability (line 802)

**Memory Creation** (line 803–808): **HARD BLOCK**
- Method: MUST use generate-context.js script (line 805)
- Command: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`
- **Forbidden:** Write/Edit tools on memory/ paths (line 807)
- **Violation recovery:** DELETE manual file → run generate-context.js → verify ANCHORs → index via memory_save (line 808)

**Post-Save Indexing** (line 815–819):
- MCP tool: memory_save (line 816)
- Call semantic memory MCP DIRECTLY — NEVER through Code Mode (line 818)
- When: Immediately after memory file written to disk (line 819)

**Anchor Requirements** (line 821–832): **MANDATORY**
- Minimum anchors: 2 (line 823)
- Pattern: `[context-type]-[keywords]-[spec-number]` (line 824)
- Format: `<!-- ANCHOR:ID --> content <!-- /ANCHOR:ID -->` (line 825)
- Required sections: general (session summary), decision (key decisions) (line 826–828)
- Optional: implementation, files (line 829–830)
- **Benefit:** 93% token savings on anchor-based retrieval (line 832)

**Importance Tier** (line 834–837):
- Assign: important (line 835)
- Rationale: Complete workflow = significant implementation work (line 836)
- Tier reference: constitutional > critical > important > normal > temporary > deprecated (line 837)

**Evidence Sources:**
- Context saving: Line 794–833
- Memory indexing: Line 815–819
- Anchor requirements: Line 821–832

---

### STEP 14: Handover Check (8 lines)

**Purpose** (line 839–840): Offer session handover before workflow completion  
**Duration:** ~2 minutes | **Deliverable:** Handover documentation (optional)  
**Validation Criteria:** User prompted, decision recorded  
**Acceptance Criteria:** Handover offered (action logged)

**Activities:**
- Check if user needs session continuity documentation (line 842)
- Offer to run /spec_kit:handover for comprehensive handover (line 843)

**Options** (line 844–846):
- Run Handover: Execute handover workflow
- Skip: Proceed to termination

**Note** (line 847): Handover is optional but recommended for complex implementations

**Evidence Sources:**
- Handover check: Line 839–848

---

## SUCCESS CRITERIA

**Specification Phase Success** (line 897):
- [x] Requirements defined with acceptance criteria
- [x] Approach planned with dependencies identified
- [x] P0 items understood, P1/P2 prioritized
- [x] All [NEEDS CLARIFICATION] markers resolved

**Implementation Phase Success** (line 898):
- [x] Code follows coding standards (from AGENTS.md/skills/)
- [x] Tests pass (unit + integration + e2e where applicable)
- [x] Browser validated (if staging URL provided)
- [x] Performance acceptable (no regressions)

**Documentation Phase Success** (line 899):
- [x] Spec folder complete (all required files exist)
- [x] implementation-summary.md created with required sections
- [x] Deviations from plan documented
- [x] Context saved & indexed (memory/)

**Quality Phase Success** (line 900):
- [x] Checklist validated (P0 = 100%, P1 ≥75%)
- [x] No regressions in existing functionality
- [x] Functionality preserved & enhanced
- [x] Standards maintained across codebase

---

## EXECUTION SUMMARY TABLE

| Phase | Steps | Duration | Primary Output | Gate | Status |
|-------|-------|----------|---|---|---|
| **Understanding** | 1–5 | 40–60 min | spec.md, checklist.md (L2+) | None | Sequential |
| **Research** | Phase 3 | 30–45 min | research.md (optional) | Triggered <60% confidence | Optional |
| **Planning** | 6–7 | 45–60 min | plan.md, tasks.md | Phase Gate (Hard) | After 7 |
| **Analysis** | 8–9 | 20–25 min | Consistency report, greenlight | Pre-execution (Hard) | Sequential |
| **Learning Capture** | 9.5 | <1 min | PREFLIGHT baseline | None | Before dev |
| **Implementation** | 10 | Variable | Code, tests, validated features | None | Sequential |
| **Checkpoint Dev** | 10.5 | 2 min | Memory checkpoint | None | After dev |
| **Verification** | 11–11.5 | 15–20 min | Checklist verification, POSTFLIGHT | P0 blocker (Hard) | After dev |
| **Completion** | 12 | 10 min | implementation-summary.md | Post-exec (Hard) | After 11 |
| **Context Save** | 13 | 5 min | Memory session file (indexed) | Memory creation (Hard) | After 12 |
| **Handover** | 14 | 2 min | Handover doc (optional) | None | Final |

**Key Metrics:**
- Total workflow duration: 3–5 hours (depending on feature complexity)
- Hard blocks: 5 (Phase Gate, Pre-Exec, Planning, P0 Checklist, Post-Exec)
- Soft blocks: 1 (Circuit breaker on agent failure)
- Parallel dispatch eligible: 4 steps (3, 6, 8, 10)
- Learning captures: 2 (PREFLIGHT 9.5, POSTFLIGHT 11.5)
- Memory checkpoints: 3 (6.5, 10.5, 13)
- Confidence gates: 10+ per step (detailed at Steps 1, 3, 6, 10)
