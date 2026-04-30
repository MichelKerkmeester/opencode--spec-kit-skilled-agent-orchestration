## Deep Research Iteration 4 (013 — Automation Reality Supplemental, continuation of 012)

You are deep-research agent dispatched for iteration 4 of 5. Iters 1-3 completed.

### State summary

- Segment: 1 | Iteration: 4 of 5
- Read prior iters: iteration-001.md, iteration-002.md, iteration-003.md to avoid duplicate ground
- Read 012's research-report.md at `specs/system-spec-kit/026-graph-and-context-optimization/012-automation-self-management-deep-research/research/research-report.md` for the 4 P1 aspirational findings
- Next focus: Adversarial Hunter→Skeptic→Referee on 012's 4 P1 findings + NEW gap hunt

### Iteration 4 focus

**Adversarial Hunter→Skeptic→Referee on 012's 4 P1 aspirational findings + NEW gap hunt** (RQ4 + RQ5)

#### Part A: Adversarial 4-P1 retest

For EACH of 012's 4 P1 aspirational findings, run a hostile re-test:

##### P1-1: Code-graph watcher overclaim
- 012 cited: `.opencode/skill/system-spec-kit/mcp_server/README.md:515-518` claims real-time watching; no watcher under `code_graph/`
- Hunter (challenge): Is there a chokidar/fs.watch path 012 missed under `mcp_server/`? Check `lib/`, `core/`, `handlers/`. Is there a test fixture that exercises a watcher? Is there a documented-but-disabled feature flag?
- Skeptic (counter-evidence): If a watcher path exists, does it auto-fire OR is it only available behind a feature flag?
- Referee verdict: validated (still P1) / demoted (P2 with rationale) / promoted (P0) / reclassified (half-automated with new evidence)

##### P1-2: Memory retention sweep missing
- 012 cited: `scope-governance.ts:225-333` persists `delete_after` metadata; no sweep path
- Hunter: Is there a session-manager cron sweep? Cleanup interval in `session-manager.ts`? CLI tool `memory_bulk_delete` that fires it? Database trigger? Background task?
- Skeptic: If a sweep path exists, does it actually read `delete_after`? Or is it a different cleanup mechanism?
- Referee verdict: validated/demoted/promoted/reclassified

##### P1-3: Copilot hook docs conflict
- 012 cited: `references/config/hook_system.md:22` (stale `.claude/settings.local.json` wrapper) vs `hooks/copilot/README.md:27-34` (forbids that shape)
- Hunter: Is one runtime-resolved at install time? Are both correct in different runtime versions? Is the hook_system.md doc deprecated?
- Skeptic: Does the conflict actually mis-configure operators in practice, or do install scripts handle the divergence?
- Referee verdict: validated/demoted/promoted/reclassified

##### P1-4: Codex hook readiness mismatch
- 012 cited: docs require `[features].codex_hooks=true` + `hooks.json`; repo uses `.codex/settings.json` without flag
- Hunter: Is `settings.json` equivalent to `hooks.json` in current Codex CLI? Is the flag deprecated? Is there a codex CLI version detection that picks the right shape?
- Skeptic: Where does Codex actually load hooks from at startup? Cite the codex-cli source if accessible, OR cite the CLI command flag ref.
- Referee verdict: validated/demoted/promoted/reclassified

#### Part B: NEW gap hunt

Hunt for gaps in surfaces 012 didn't reach:

- `session-manager.ts` cleanup intervals — does it run any timer-driven cleanup? Auto vs manual?
- Freshness checks — does any handler proactively detect/remediate stale state without operator input?
- `skill_graph_validate` and `skill_graph_scan` auto-fire — daemon-driven? Manual?
- `memory_drift_why` — auto-fires on detected drift? Or only on operator query?
- `memory_get_learning_history` — wired into any feedback loop, or pure read?
- `advisor_status` freshness checks — auto vs manual
- `code_graph_context` auto-fire — used by other handlers automatically?
- `memory_health` — surfaced via any diagnostic auto-run?

### Source files to read (representative)

- `specs/system-spec-kit/026-graph-and-context-optimization/012-automation-self-management-deep-research/research/research-report.md` (012's findings)
- `.opencode/skill/system-spec-kit/mcp_server/lib/session-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/` (entire dir for watcher hunt)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill_graph_*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-{drift-why,get-learning-history,health}.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code_graph_context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` (for P1-3 retest)
- `.opencode/skill/system-spec-kit/references/config/hook_system.md` (for P1-3 retest)
- `.codex/settings.json`, `.codex/hooks.json` (for P1-4 retest)

### Constraints

- READ ONLY. No source code mutations.
- For each adversarial retest, cite NEW file:line evidence (not already in 012's findings) OR explicitly state "no new evidence; 012's classification stands".
- For each NEW gap finding, file:line citation MANDATORY.

### Output contract — write EXACTLY these files

#### 1. `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/iterations/iteration-004.md`

```markdown
# Iteration 4: Adversarial 4-P1 Retest + NEW Gap Hunt

## Status
[converged | thought | insight | error | timeout]

## Focus
Adversarial Hunter→Skeptic→Referee on 012's 4 P1 findings + NEW gap hunt

## Sources read
- file:line — what was found

## Part A: Adversarial 4-P1 retest

### P1-1: Code-graph watcher overclaim
- Hunter findings: ...
- Skeptic counter-evidence: ...
- Referee verdict: [validated / demoted / promoted / reclassified] — rationale ...
- NEW evidence cited: file:line

### P1-2: Memory retention sweep missing
- Hunter findings: ...
- Skeptic counter-evidence: ...
- Referee verdict: ...
- NEW evidence cited: file:line

### P1-3: Copilot hook docs conflict
- Hunter findings: ...
- Skeptic counter-evidence: ...
- Referee verdict: ...
- NEW evidence cited: file:line

### P1-4: Codex hook readiness mismatch
- Hunter findings: ...
- Skeptic counter-evidence: ...
- Referee verdict: ...
- NEW evidence cited: file:line

## Part B: NEW gap-findings

| ID | Surface | Class | Severity | File:line | Summary |
|----|---------|-------|----------|-----------|---------|
| NEW-013-001 | session-manager cleanup interval | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... |

## newInfoRatio estimate
[0.0 - 1.0]

## Next focus
Iteration 5 — synthesis + sequenced remediation backlog
```

#### 2. `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/deltas/iter-004.jsonl`

```jsonl
{"type":"iteration","run":4,"focus":"Adversarial 4-P1 retest + NEW gap hunt","status":"insight","findingsCount":<N>,"newInfoRatio":<0.0-1.0>,"timestamp":"<ISO 8601 NOW>"}
{"type":"adversarial_verdict","run":4,"id":"P1-1","verdict":"<validated|demoted|promoted|reclassified>","newEvidence":"<file:line>","rationale":"<short>"}
... (one record per P1 finding + per NEW gap)
```

#### 3. Append ONE line to `specs/system-spec-kit/026-graph-and-context-optimization/013-automation-reality-supplemental-research/research/deep-research-state.jsonl`

```jsonl
{"event":"iteration_complete","at":"<ISO 8601 NOW>","iter":4,"focus":"Adversarial 4-P1 retest + NEW gap hunt","newInfoRatio":<0.0-1.0>,"status":"insight"}
```

Output ONLY the file writes. Do not narrate. Do not summarize. Just write the three files and exit.
