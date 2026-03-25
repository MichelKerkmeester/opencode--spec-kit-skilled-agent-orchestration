---
title: Parallel Dispatch Configuration
description: Complexity scoring and agent dispatch configuration for parallel task execution.
---

# Parallel Dispatch Configuration - Agent Parallelization Settings

Configuration for smart parallel sub-agent dispatch based on task complexity scoring.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines when and how to dispatch parallel agents for complex tasks. Use this configuration to determine if a task benefits from parallel exploration vs. direct execution.

This guidance also applies to cross-phase documentation campaigns and shared-space research sweeps. When work spans multiple spec folders or shared-memory contexts, keep each dispatched workstream anchored to one explicit phase or shared-space boundary so evidence and follow-up saves remain attributable.

### Usage

1. Score the task using the 5-dimension complexity model
2. Check score against decision thresholds (<20% = direct, ≥20% + 2 domains = ask user)
3. For Step 6 Planning, use the 4-agent parallel exploration pattern
4. Apply override phrases when user specifies execution preference
5. For campaign-style work, keep each parallel branch scoped to one phase family or one shared-space boundary before recombining results

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:5-dimension-complexity-scoring -->
## 2. 5-DIMENSION COMPLEXITY SCORING

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 0.35   | 1 domain=0.0, 2=0.5, 3+=1.0            |
| File Count           | 0.25   | 1-2 files=0.0, 3-5=0.5, 6+=1.0         |
| LOC Estimate         | 0.15   | <50=0.0, 50-200=0.5, >200=1.0          |
| Parallel Opportunity | 0.20   | Sequential=0.0, Some=0.5, High=1.0     |
| Task Type            | 0.05   | Trivial=0.0, Moderate=0.5, Complex=1.0 |

**Domains:** code, analysis, docs, git, testing, devops

---

<!-- /ANCHOR:5-dimension-complexity-scoring -->
<!-- ANCHOR:decision-thresholds -->
## 3. DECISION THRESHOLDS

| Score            | Action                                |
| ---------------- | ------------------------------------- |
| <20%             | Proceed directly (no parallel agents) |
| ≥20% + 2 domains | ALWAYS ask user (A/B/C options)       |

**Note:** No auto-dispatch - user must approve parallel dispatch (except Step 6 Planning)

---

<!-- /ANCHOR:decision-thresholds -->
<!-- ANCHOR:4-agent-parallel-exploration-step-6-planning -->
## 4. 4-AGENT PARALLEL EXPLORATION (Step 6 Planning)

| Agent                 | Focus                            | Purpose                          |
| --------------------- | -------------------------------- | -------------------------------- |
| Architecture Explorer | Project structure, entry points  | Understand system architecture   |
| Feature Explorer      | Similar features, patterns       | Find reusable patterns           |
| Dependency Explorer   | Imports, modules, affected areas | Identify integration points      |
| Test Explorer         | Test patterns, infrastructure    | Understand verification approach |

**Execution:** All 4 agents spawn in single message using Task tool with `agent_type: explore`.

---

<!-- /ANCHOR:4-agent-parallel-exploration-step-6-planning -->
<!-- ANCHOR:tiered-spec-creation-architecture -->
## 5. TIERED SPEC CREATION ARCHITECTURE

### Workstream Notation

| Prefix | Meaning |
|--------|---------|
| [W-A] | Workstream A (same agent) |
| [W-B] | Workstream B (parallel agent) |
| [SYNC] | Sync point (all must complete) |

### Tiered Creation Flow

```yaml
spec_creation_parallel:
  enabled: true
  auto_dispatch_mode: false

  # Tier 1: Sequential Foundation (~60s)
  tier1:
    agent: spec_core_drafter
    files: [spec.md sections 1-3]
    mode: sequential

  # Tier 2: Parallel Execution (~90s)
  tier2:
    agents:
      - name: plan_agent
        files: [plan.md]
        focus: "Technical approach and phases"
      - name: checklist_agent
        files: [checklist.md]
        focus: "Verification items"
      - name: requirements_agent
        files: [spec.md sections 4-6]
        focus: "Requirements detail"
    mode: parallel

  # Tier 3: Integration (~60s)
  tier3:
    agent: tasks_integrator
    files: [tasks.md]
    mode: sequential
    depends_on: [tier1, tier2]
```

### Workstream File Ownership

| Workstream | Owner | Files | Rules |
|------------|-------|-------|-------|
| W-SPEC | Primary | spec.md | Sequential in tiers |
| W-PLAN | Plan Agent | plan.md | Independent |
| W-CHECK | Checklist Agent | checklist.md | Independent |
| W-TASKS | Tasks Integrator | tasks.md | After SYNC |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-T1 | Tier 1 complete | Primary | Foundation ready |
| SYNC-T2 | Tier 2 complete | All T2 agents | Merge outputs |
| SYNC-T3 | Tier 3 complete | Integrator | Final tasks.md |

---

<!-- /ANCHOR:tiered-spec-creation-architecture -->
<!-- ANCHOR:override-phrases -->
## 6. OVERRIDE PHRASES

| Intent                    | Phrases                                                |
| ------------------------- | ------------------------------------------------------ |
| Direct (skip parallel)    | "proceed directly", "handle directly", "skip parallel" |
| Parallel (force dispatch) | "use parallel", "dispatch agents", "parallelize"       |
| Auto (let system decide)  | "auto-decide", "auto mode", "decide for me"            |

**Session Preference:** Once selected, persists for 1 hour (3600 seconds).

---

<!-- /ANCHOR:override-phrases -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Asset Files
- [template_mapping.md](./template_mapping.md) - Template routing and task mapping
- [level_decision_matrix.md](./level_decision_matrix.md) - Level selection decision matrix
- [complexity_decision_matrix.md](./complexity_decision_matrix.md) - Complexity-based level selection

### Reference Files
- [quick_reference.md](../references/workflows/quick_reference.md) - Commands, checklists, and troubleshooting
- [level_specifications.md](../references/templates/level_specifications.md) - Complete Level 1-3+ requirements

### Scripts
- [compose.sh](../scripts/templates/compose.sh) - Template composition from core + addendum

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
<!-- /ANCHOR:related-resources -->
