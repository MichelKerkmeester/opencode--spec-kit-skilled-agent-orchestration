---
title: "Deep Research Prompts — Technical Investigations"
description: "Paste-ready /spec_kit:deep-research :auto prompts for 'how does X actually work' investigations. Use when you need grounded understanding of an unfamiliar subsystem before modifying it."
importance_tier: "normal"
contextType: "research-prompts"
---

# Technical Investigations

Use when you need to deeply understand how an existing subsystem works before
touching it. These produce `research/research.md` with architecture, data flow,
dependency map, and known failure modes — grounded in file:line evidence.

Each scenario is paste-ready. Replace `__PLACEHOLDERS__` before running.

---

## Scenario DR-TI-01 — Single-subsystem data flow mapping

**When:** You need to understand how data flows through one named subsystem (e.g., the skill advisor, the code graph, the freshness signal) end-to-end.

**Expected output:** `research/research.md` with
- Ingress / egress boundary map
- Data shape at each transformation point
- Handler / transformer list with file:line
- Failure modes actually reachable in production
- 3-5 open questions for follow-up research

**Paste this into any CLI:**

```
/spec_kit:deep-research :auto "Map the end-to-end data flow through __SUBSYSTEM_NAME__ in this repo. Start from the input boundary (caller/request), trace through every transformer and handler, document the output shape, and enumerate failure modes that are actually reachable in production (not theoretical). Cite file:line for every assertion. Fixtures and test doubles are not production code and should be flagged if they diverge from real behavior. Focus dimensions: data_flow_mapping, failure_mode_enumeration, boundary_contracts, transformer_inventory. Convergence: 0.10 ratio, stuck threshold 3 iters." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM_SLUG__-data-flow/
```

**Fail modes to watch:**
- Research summary says "it uses X" without file:line → underspecified
- More than 3 iterations with 0 new findings but no synthesis → stuck, increase `--max-iterations` or change executor

---

## Scenario DR-TI-02 — Handler behavior under edge conditions

**When:** You suspect a specific handler has undocumented edge-case behavior (e.g., what happens on empty input, corrupt SQLite, concurrent invocations).

**Paste this:**

```
/spec_kit:deep-research :auto "Audit the edge-case behavior of __HANDLER_FILE__ at __FUNCTION_NAME__. For each documented and undocumented edge case, report: (a) input pattern, (b) observed output/side-effect, (c) the code path that handles it with file:line, (d) any differences between documented contract and actual behavior. Enumerate at least these edge cases: empty input, oversized input, malformed input, concurrent invocation, corrupt underlying store, partial write recovery, timeout recovery. Flag P0 for silent data loss, P1 for undocumented fail-open/fail-closed divergence, P2 for minor inconsistencies. Convergence: 0.08 (tighter — edge cases should converge fast)." --max-iterations=8 --convergence=0.08 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__HANDLER__-edge-cases/
```

---

## Scenario DR-TI-03 — Contract drift between spec and implementation

**When:** You suspect a spec document claims behavior the code doesn't actually implement (or vice versa).

**Paste this:**

```
/spec_kit:deep-research :auto "Compare the claims in __SPEC_DOC_PATH__ against the actual implementation of __IMPLEMENTATION_FILES_GLOB__. For every claim in the spec (requirements, acceptance scenarios, ADR consequences), produce one of: CONFIRMED (code matches), DRIFTED (code does the opposite or incompatible), UNREACHABLE (claim has no code path), EXTRA (code implements behavior not mentioned in spec). Evidence required at file:line granularity for every verdict. P0: any DRIFTED on a documented P0/P1 requirement. P1: DRIFTED on P2 or UNREACHABLE on P0/P1. P2: EXTRA behavior or stale code comments." --max-iterations=12 --convergence=0.08 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__FEATURE__-contract-drift/
```

**Example filled-in:**
```
/spec_kit:deep-research :auto "Compare the claims in .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/003-hook-parity-remediation/spec.md against the actual implementation of .opencode/skill/system-spec-kit/mcp_server/hooks/codex/**/*.ts. ..." --max-iterations=12 ...
```

---

## Scenario DR-TI-04 — Historical evolution trace

**When:** You need to understand how a subsystem reached its current state through N commits, including rejected-then-reverted decisions.

**Paste this:**

```
/spec_kit:deep-research :auto "Trace the evolution of __SUBSYSTEM_PATH__ through git history. Identify: (a) the original introduction commit with one-line rationale, (b) every major refactor with before/after shape and rationale from the commit message and any linked spec folder, (c) reverts / rollbacks with root-cause summary, (d) dead-code paths that were added and never removed (file:line), (e) the current 'why this exists' narrative tied to recent commits. Use `git log --oneline -p -- __PATH__` and `git log -S 'term'` as primary evidence sources. Flag P0 for any unresolved TODO/FIXME tied to a production risk, P1 for orphaned code, P2 for stale comments." --max-iterations=10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-evolution/
```

---

## Scenario DR-TI-05 — Test coverage gap audit

**When:** You need to know what behaviors are actually exercised by tests vs only reached via production.

**Paste this:**

```
/spec_kit:deep-research :auto "Audit test coverage for __PRODUCTION_CODE_PATH__. For every exported function and every conditional branch in that file(s): (a) identify the test(s) that exercise it by file:line, (b) flag branches reached only from production, never from tests (P0 for critical paths, P1 for error paths, P2 for trivial branches), (c) flag tests that mock away the interesting behavior (these are false-green), (d) propose the minimum-count test additions that would close the most critical gaps. Run `vitest run --coverage` if available; otherwise trace call graphs statically. Every finding must cite both the production code line AND the claimed test (or 'no test')." --max-iterations=8 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__TARGET__-test-coverage-gaps/
```

---

## Scenario DR-TI-06 — Runtime behavior vs compiled artifact drift

**When:** You suspect the TypeScript source and the compiled `dist/` are out of sync, or the hook/plugin runtime behavior differs from what source inspection suggests.

**Paste this:**

```
/spec_kit:deep-research :auto "Verify source-vs-runtime parity for __COMPILED_MODULE__. Compare: (a) the TypeScript source at __SOURCE_PATH__, (b) the compiled output at __DIST_PATH__, (c) the observable runtime behavior via smoke commands (paste below). Enumerate divergences. Cite source file:line AND dist file:line for every finding. Smoke commands:\n\n__PASTE_SMOKE_COMMANDS__\n\nP0: runtime does something dist/source would suggest is impossible. P1: source says feature exists but dist or runtime lacks it. P2: minor output formatting differences." --max-iterations=7 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__MODULE__-runtime-parity/
```

---

## Scenario DR-TI-07 — Dependency risk scan

**When:** You need to know what external packages, binaries, or runtime services a subsystem depends on and what happens when each fails.

**Paste this:**

```
/spec_kit:deep-research :auto "Catalog all external dependencies for __SUBSYSTEM_PATH__. Categories: (a) npm/pip packages with version pin, (b) system binaries called via child_process, (c) network services (APIs, databases, filesystems), (d) filesystem paths read or written, (e) environment variables consumed. For each: document failure behavior (what the code does when that dependency is unavailable), cite file:line for the actual handling logic, flag 'no handling' cases. P0: unhandled failure of a critical dependency. P1: fail-open on a security-relevant dependency. P2: missing env var with silent default." --max-iterations=8 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --spec-folder=specs/__TRACK__/__PACKET__/research-__SUBSYSTEM__-dependency-risk/
```

---

## Results Log

Append runs here as you complete them. Format:

```markdown
## YYYY-MM-DD — <topic>

Scenario: DR-TI-__
Command: `/spec_kit:deep-research :auto "..."`
Spec folder: specs/.../
Executor: cli-codex gpt-5.4 high fast
Iterations: N / max
Verdict: PASS | CONDITIONAL | FAIL
Findings: P0=N P1=N P2=N
Surprises: [what you didn't expect to find]
Follow-ups: [new spec folders / implementation tasks to queue]
Link: research/research.md (commit SHA)
```
