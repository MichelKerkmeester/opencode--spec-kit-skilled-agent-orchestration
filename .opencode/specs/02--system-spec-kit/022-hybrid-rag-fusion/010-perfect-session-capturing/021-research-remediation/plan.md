<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/plan.md -->
<!-- anchor:plan:start -->

# Plan: Research Remediation — Wave 1

<!-- anchor:approach:start -->
## 1. APPROACH

Sequential execution of 5 Codex 5.3 agents via `codex exec`, each with exclusive file ownership and build verification gate.

**Execution protocol**: Agent N → npm run build → verify → Agent N+1 → ... → Agent 5 → full test suite
<!-- anchor:approach:end -->

<!-- anchor:phases:start -->
## 2. PHASES

### Phase 1: Agent 1 — Source Integrity (8 items)
- Session-ID-first transcript resolution in claude-code-capture.ts
- Source provenance persistence through pipeline
- Error surfacing in data-loader.ts
- Session-scoped prompts in opencode-capture.ts

### Phase 2: Agent 2 — Detection & Quality Gates (9 items)
- Git-status Priority 2.7 signal in folder-detector.ts
- V10 same-spec wrong-session validator
- Contamination score penalty in both scorers
- Quality gate enforcement in workflow

### Phase 3: Agent 3 — Data Flow & Types (10 items)
- Decision dedup fix (2-line change)
- Metadata preservation through normalization
- Type canonicalization into session-types.ts
- Blocker content validation

### Phase 4: Agent 4 — Signal Extraction (6 items)
- Trigger input sanitization
- Weighted embedding input
- Stopword list merge
- Observation type expansion

### Phase 5: Agent 5 — Workflow Integration & Tests (8 items)
- key_files filesystem fallback
- Tree-thinning input fix
- Template-to-workflow field wiring
- E2E test addition
<!-- anchor:phases:end -->

<!-- anchor:verification:start -->
## 3. VERIFICATION

- [ ] `npm run build` passes after each agent
- [ ] `npx vitest run` passes after Agent 5
- [ ] No `Math.random` in session-extractor.ts
- [ ] `mtime` is fallback, not primary sort
- [ ] folder-detector.ts has Priority 2.7 git-status signal
- [ ] decision-extractor.ts has dedup guard
- [ ] workflow.ts passes hadContamination to both scorers
- [ ] memory-indexer.ts uses weighted embedding input
<!-- anchor:verification:end -->

<!-- anchor:dependencies:start -->
## 4. DEPENDENCIES

Sequential agent chain: Agent 1 → 2 → 3 → 4 → 5
<!-- anchor:dependencies:end -->

<!-- anchor:effort:start -->
## 5. EFFORT ESTIMATE

41 items across 5 agents. Mix of TRIVIAL (3), SMALL (12), LOW (6), MEDIUM (16), per-item estimates in tasks.md.
<!-- anchor:effort:end -->

<!-- anchor:risks:start -->
## 6. RISKS

See spec.md §6 for risk matrix.
<!-- anchor:risks:end -->

<!-- anchor:dod:start -->
## 7. DEFINITION OF DONE

- [ ] All 41 items implemented
- [ ] Build passes
- [ ] Tests pass
- [ ] Grep verification checks pass
- [ ] Implementation summary written
<!-- anchor:dod:end -->

<!-- anchor:plan:end -->
