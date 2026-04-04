# Checklist: Phase 009 — Agent-Improver Self-Test

## P0 — Hard Blockers

### Pre-Flight
- [x] All 8 .cjs scripts parse without errors
- [x] `scan-integration.cjs --agent=agent-improver` produces valid JSON with `status: "complete"`
- [x] `generate-profile.cjs --agent=.opencode/agent/agent-improver.md` produces valid JSON with `id: "agent-improver"`
- [x] `score-candidate.cjs --candidate=.opencode/agent/agent-improver.md --dynamic` produces `evaluationMode: "dynamic-5d"` with 5 dimensions

### Loop Execution
- [x] Runtime directories created under `improvement/`
- [x] At least 1 iteration completes: candidate generated, scored, reduced
- [x] No `infra_failure` status in any script output
- [x] Append-only ledger (`agent-improvement-state.jsonl`) has at least 1 scored record

### Evidence
- [x] Dashboard (`agent-improvement-dashboard.md`) exists and shows dimensional progress
- [x] Registry (`experiment-registry.json`) exists with valid JSON
- [x] Integration report (`integration-report.json`) exists and shows agent-improver surfaces
- [x] Dynamic profile (`dynamic-profile.json`) exists and contains derived checks

## P1 — Required

### Integration Scanner Observations
- [x] Scanner discovers canonical `.opencode/agent/agent-improver.md`
- [x] Scanner discovers mirrors in `.claude/agents/`, `.agents/agents/`, `.codex/agents/`
- [x] Scanner discovers command references in `improve/agent.md`
- [x] Scanner discovers skill references in `sk-agent-improver/SKILL.md`
- [x] Scanner discovers YAML workflow references

### Profile Generator Observations
- [x] Profile extracts ALWAYS/NEVER rules from Operating Rules section
- [x] Profile extracts output checklist items from Self-Validation Protocol
- [x] All 5 dimension scores are numeric and between 0-100

### Self-Referential Observations
- [x] Tautological scoring behavior documented
- [x] Plateau speed documented (how many iterations before stop)
- [x] Benchmark behavior without static fixtures documented

### Parent Updates
- [x] Root spec.md Phase 9 entry added to phase map
- [x] Root implementation-summary.md Phase 9 section added
- [x] Root changelog.md Phase 9 entry added

## P2 — Optional

- [x] Compare agent-improver scores to known scores for other agents (handover=100, debug=100)
- [x] Document recommendations for Phase 010 improvements based on findings
