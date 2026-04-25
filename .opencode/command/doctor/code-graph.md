---
description: Diagnose + optionally fix code-graph index health (stale + missed + bloat). Diagnostic-only via :auto/:confirm; apply mode via :apply/:apply-confirm consumes 007 research outputs (gold battery, staleness model, exclude-rule confidence tiers).
argument-hint: "[:auto|:confirm|:apply|:apply-confirm] [--scope=stale|missed|bloat|all|excludes] [--tier-floor=high|medium|low|all]"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, mcp__cocoindex_code__search, mcp__spec_kit_memory__code_graph_status, mcp__spec_kit_memory__code_graph_query, mcp__spec_kit_memory__code_graph_context, mcp__spec_kit_memory__code_graph_scan, mcp__spec_kit_memory__detect_changes, mcp__spec_kit_memory__memory_context, mcp__spec_kit_memory__memory_search
---

> **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **Ownership:** Markdown owns setup (resolves all inputs). YAML owns execution. Setup values resolved here are passed to the YAML workflow.
>
> **YOUR FIRST ACTION:**
> 1. Run the unified setup phase in this Markdown entrypoint and resolve: `execution_mode`, `scope`, `tier_floor` (apply modes only)
> 2. Load the corresponding YAML file from `assets/` only after all setup values are resolved:
>    - Auto (diagnostic): `doctor_code-graph_auto.yaml`
>    - Confirm (diagnostic): `doctor_code-graph_confirm.yaml`
>    - Apply (autonomous mutate): `doctor_code-graph_apply.yaml`
>    - Apply-Confirm (interactive mutate): `doctor_code-graph_apply-confirm.yaml`
> 3. Execute the YAML workflow step by step using those resolved values
>
> All content below is reference context for the YAML workflow. Do not treat reference sections as direct instructions to execute.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** workflow execution happens through the YAML — this document is setup + reference only
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound: `execution_mode`, `scope`
- **DIAGNOSTIC MODE (:auto, :confirm) IS READ-ONLY**: zero mutations to repo files; report goes to packet-local scratch only
- **APPLY MODE (:apply, :apply-confirm) MUTATES `.opencode/code-graph.config.json`**: pre-apply snapshot + post-verify gold-battery + auto-rollback on regression in autonomous mode; user-approval gates in confirm mode
- **APPLY MODE consumes 007 research outputs** at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/` (exclude-rule-confidence.json, staleness-model.md, code-graph-gold-queries.json, recovery-playbook.md)

> **Format:** `/doctor:code-graph [:auto|:confirm] [flags]`
> Examples: `/doctor:code-graph:auto` | `/doctor:code-graph:confirm --scope=bloat` | `/doctor:code-graph --scope=stale`

## GATE 3 STATUS: EXEMPT

| Aspect | Value |
| ------ | ----- |
| Location | Diagnostic report under packet-local scratch only |
| Reason | Phase A is read-only; no spec folder packet is mutated |
| Alternative | Operator reads the diagnostic report and decides next steps; Phase B (apply mode) future packet will follow doctor_skill-advisor mutation patterns |

---

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. No mode suffix prompts the user to choose execution mode (Q0 in setup); `:auto` and `:confirm` suffixes skip that question.

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response when no mode suffix is given. No mutating tool calls before asking. Lightweight read-only discovery is allowed (file count, code_graph_status), then ask ALL questions immediately and wait.

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"          → execution_mode = "AUTONOMOUS",       intent = "DIAGNOSE", yaml = "doctor_code-graph_auto.yaml"
   ├─ ":confirm"       → execution_mode = "INTERACTIVE",      intent = "DIAGNOSE", yaml = "doctor_code-graph_confirm.yaml"
   ├─ ":apply"         → execution_mode = "AUTONOMOUS",       intent = "APPLY",    yaml = "doctor_code-graph_apply.yaml"
   ├─ ":apply-confirm" → execution_mode = "INTERACTIVE",      intent = "APPLY",    yaml = "doctor_code-graph_apply-confirm.yaml"
   └─ No suffix        → execution_mode = "ASK"               intent = "ASK"       (include Q0)

2. PARSE flags from $ARGUMENTS:
   ├─ --scope=X       → scope = X (diagnose default "all": all|stale|missed|bloat; apply default "excludes": excludes|all)
   ├─ --tier-floor=X  → tier_floor = X (apply mode only; values: high|medium|low|all)
   └─ Defaults: scope="all" (diagnose) or "excludes" (apply); tier_floor="high" (apply autonomous) or ASK (apply confirm)

3. Lightweight discovery (read-only):
   - code_graph_status({})
   - File count: $ find . -type f \( -name '*.ts' -o -name '*.js' -o -name '*.py' \) | wc -l
   - Store: indexed_count, file_count, last_scan_at

4. ASK with SINGLE prompt (include only applicable questions):

   Q0. Execution Mode (if no suffix):
     A) Autonomous - run all phases without approval gates
     B) Interactive - pause at the proposal gate

   Q1. Scope (always ask if not flagged):
     A) all (default) - stale + missed + bloat detection
     B) stale - only files modified after last scan
     C) missed - only files on disk not in index
     D) bloat - only bloat-dir detection

   Reply format: "A, A" or "B, all"

5. WAIT for user response (DO NOT PROCEED)

6. Parse and store: execution_mode | scope

7. SET STATUS: PASSED

DO NOT proceed until user explicitly answers
NEVER write to source files (Phase A is diagnostic-only)
NEVER split questions into multiple prompts
```

**Phase Output:**
- `execution_mode` | `scope` | `indexed_count` | `file_count` | `last_scan_at`

---

# Doctor Code Graph

Diagnostic-first command for code graph index health: produces a markdown report listing stale + missed + bloat-dir candidates without modifying any source files. Phase A release; Phase B (apply mode) gated on the resilience-research packet.

```yaml
role: Diagnostic Operator running code-graph health audit
purpose: Audit index health, surface stale + missed + bloat findings, produce report
action: Run 3-phase workflow from discovery through proposal-as-report

operating_mode:
  workflow: sequential_3_phase_diagnostic_only
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: one_pre_proposal_gate_in_confirm_mode
  tracking: phase_by_phase
  validation: read_only_assertion
```

---

## 1. PURPOSE

Deliver a guided diagnostic over the code-graph index without requiring users to know the internal scanner architecture. Phase A produces a markdown report with stale/missed/bloat findings and proposed exclude-rule recommendations. The operator reads the report and decides whether to act manually. Phase B (apply mode) — which would write a `code-graph-config.json` and trigger re-scan — is deferred until the resilience-research packet (007-code-graph-resilience-research) produces the verification battery, staleness model, recovery playbook, and exclude-rule confidence tiers.

---

## 2. USER INPUT

```text
$ARGUMENTS
```

---

## 3. CONTRACT

**Inputs:** `$ARGUMENTS` — Optional mode suffix and `--scope=` flag (no positional args required)
**Outputs:** Markdown diagnostic report at `<packet_scratch>/code-graph-diagnostic-<timestamp>.md` + `STATUS=<OK|FAIL|CANCELLED>`

---

## 4. WORKFLOW OVERVIEW

| Phase | Name      | Purpose                                          | Diagnostic | Apply |
| ----- | --------- | ------------------------------------------------ | :--------: | :---: |
| 0     | Discovery | code_graph_status + detect_changes + load 007 assets | ✓        | ✓     |
| 1     | Analysis  | stale + missed + bloat sets; per-pattern safety verdicts | ✓    | ✓     |
| 2     | Proposal  | exclude-rule + language-filter recommendations; report | ✓     | ✓     |
| 3     | Apply     | snapshot config + atomic write `.opencode/code-graph.config.json` | — | ✓ |
| 4     | Verify    | re-scan + run gold battery; pass-rate vs pass_policy floor | — | ✓ |
| 5     | Rollback or Finalize | restore snapshot if verify failed (auto in `:apply`, user-choice in `:apply-confirm`) | — | ✓ |

---

## 5. KEY BEHAVIORS

### Autonomous Mode (`:auto`)

- Executes all 3 phases without user approval gates
- Self-validates at each phase boundary (Discovery → Analysis → Proposal)
- Writes diagnostic report to packet-local scratch
- Returns STATUS=OK with the report path

### Interactive Mode (`:confirm`)

- Pauses at one approval gate: `pre_phase_2 (Proposal)` after Analysis completes
- User reviews the analysis (stale + missed + bloat counts) before the proposal report is generated
- Approval options at the gate: `A) Generate full report`, `B) Filter to specific findings`, `C) Abort without report`

### Read-Only Invariant

- Phase A NEVER mutates any file outside `<packet_scratch>/`
- `mutation_boundaries.allowed_targets` in both YAMLs is the empty list `[]`
- After running, `git status -- <repo>` shows no diffs outside packet scratch

---

## 6. INSTRUCTIONS

After all setup phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/doctor/assets/doctor_code-graph_auto.yaml`
- **INTERACTIVE**: `.opencode/command/doctor/assets/doctor_code-graph_confirm.yaml`

The YAML contains the full 3-phase workflow with discovery, analysis, and proposal-as-report steps. Phase A only.

---

## 7. OUTPUT FORMATS

**Success (auto mode):**
```
Code Graph Diagnostic Complete - All 3 phases executed.
Files indexed: [N] | Files on disk: [M] | Stale: [P] | Missed: [Q] | Bloat dirs: [R]
Report written to: <packet_scratch>/code-graph-diagnostic-<timestamp>.md
No source files modified.
STATUS=OK
```

**Success (confirm mode):**
```
Code Graph Diagnostic Complete (Interactive)
Approved at proposal gate: [A|B|C]
Report written to: <packet_scratch>/code-graph-diagnostic-<timestamp>.md
STATUS=OK
```

**Failure:**
```
Code Graph Diagnostic Failed
Error: [description] | Phase: [number]
STATUS=FAIL ERROR="[message]"
```

---

## 8. REFERENCE

**Full details in YAML prompts:** Phase activities, MCP tool invocation patterns, bloat-dir detection rules, report format.

### See also
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/spec.md` — packet specification
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/spec.md` — research packet that gates Phase B
- `.opencode/command/doctor/skill-advisor.md` — sibling doctor command (5-phase mutation pattern; pattern source for Phase B)
- `.opencode/install_guides/SET-UP - Code Graph.md` — user-facing setup guide

### Default bloat-dir patterns

| Pattern | Tier (proposed) | Rationale |
| ------- | --------------- | --------- |
| `node_modules/` | high | npm vendor deps; never canonical source |
| `__pycache__/` | high | Python compiled cache |
| `.git/` | high | Git internals |
| `dist/` | medium | Build output; sometimes legitimately indexed |
| `build/` | medium | Build output |
| `.opencode/skill/system-spec-kit/mcp_server/dist/` | medium | TypeScript compiled output |
| `.opencode/skill/system-spec-kit/mcp_server/node_modules/` | high | nested vendor |
| `.venv/` | high | Python virtualenv |
| `tmp/` | high | scratch / temp files |
| `.DS_Store` | high | macOS metadata |

(Final tier definitions come from the resilience-research packet 007.)

---

## 9. EXAMPLES

```
/doctor:code-graph                        # Default - asks all setup questions
/doctor:code-graph:auto                   # Run full diagnostic without prompts
/doctor:code-graph:confirm                # Interactive with one approval gate
/doctor:code-graph:auto --scope=stale     # Only stale-file detection
/doctor:code-graph:auto --scope=bloat     # Only bloat-dir detection
/doctor:code-graph:confirm --scope=all    # Full diagnostic with approval gate
```

---

## 10. RELATED COMMANDS

| Command | Relationship |
| ------- | ------------ |
| `/doctor:skill-advisor` | Sibling doctor command (5-phase pattern source) |
| `/doctor:mcp_install` | Sibling doctor command (infrastructure setup) |
| `/doctor:mcp_debug` | Sibling doctor command (diagnostic-only, like this one) |
| `/spec_kit:deep-research:auto` | Run the resilience-research loop to unblock Phase B |
| `/memory:save` | Refresh canonical continuity after running diagnostic |

---

## 11. COMMAND CHAIN

```
[/doctor:code-graph:auto] → review report → [manual exclude-rule editing if desired]
                                                   ↓
                                          [/spec_kit:deep-research:auto on 007 packet]
                                                   ↓
                                          [Phase B doctor command future release]
```

Phase A ships with Phase B explicitly deferred until research outputs stabilize.

---

## 12. NEXT STEPS

| Condition | Suggested Command | Reason |
| --------- | ----------------- | ------ |
| Diagnostic complete, want to act on findings | Manual edit of scanner config + `code_graph_scan` | Phase B not yet released |
| Want to unblock Phase B | `/spec_kit:deep-research:auto specs/.../007-code-graph-resilience-research/` | Run the research loop |
| Want broader audit | `/spec_kit:deep-review:auto specs/.../006-code-graph-doctor-command/` | Iterative review pass |
| New scan completed | Re-run `/doctor:code-graph:auto` | Refresh diagnostic |

**ALWAYS** end with: "What would you like to do next?"
