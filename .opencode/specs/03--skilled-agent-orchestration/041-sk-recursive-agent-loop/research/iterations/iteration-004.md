# Iteration 4: Deeper Experiment Contract Inside `autoagent-main`

## Focus
Deepen the external analysis beyond the first summary: how `autoagent-main` treats ledger state, rejected runs, simplicity tie-breaks, and invalid experiment outcomes.

## Findings
1. `autoagent-main` expects a local experiment ledger, not just git history. `results.tsv`, `run.log`, and `jobs/` are runtime artifacts, and `program.md` requires an initialized baseline plus repeatable reruns from the same commit to measure variance. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/.gitignore:13] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:33] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:138]
2. A discarded run is still a useful run. `program.md` explicitly says to mine rejected iterations for newly solved tasks, regressions, missing capabilities, and verifier mismatch signals before selecting the next change. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:171]
3. The simplicity tie-break is concrete rather than aesthetic. Equal `passed` should prefer fewer components, fewer special cases, simpler prompts, simpler tool interfaces, and less brittle logic, while "small gains with ugly complexity" are explicitly suspect. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:109]
4. The loop isolates infrastructure failures from harness failures. The ledger schema includes crash tracking, but infra failures are supposed to be repaired and rerun instead of being treated as real regressions in the mutation target. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:127] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:136] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204]

## Ruled Out
- Treating keep/discard as a stateless "best score wins" rule is too shallow; the loop is designed to preserve evidence from rejected runs and to separate infra noise from actual harness changes. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:204]

## Dead Ends
- The snapshot still does not expose the exact git rollback mechanic for rejected runs. The policy outcome is explicit, but the concrete reset/revert procedure remains implicit in this import. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:145] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:162]

## Sources Consulted
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/.gitignore:13
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:33
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:89
- .opencode/specs/03--skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:160

## Assessment
- New information ratio: 0.57
- Questions addressed: What capabilities are missing if we want a reliable `sk-agent-improver` rather than a one-off research packet? What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration strengthened the evaluator-first recommendation.

## Reflection
- What worked and why: A second pass over `program.md` uncovered the parts that matter most for translation: variance-aware ledgering, evidence-preserving rejection, and explicit simplicity rules.
- What did not work and why: The imported snapshot still lacks a real `results.tsv` sample, so some ledger details remain inferred from policy rather than observed from populated data.
- What I would do differently: If a live branch becomes available, validate the discard/rollback workflow against actual run history next.

## Recommended Next Focus
Map those contract details onto our own runtime topology so we can decide which surfaces should be mutable, fixed, or treated as derived copies.
