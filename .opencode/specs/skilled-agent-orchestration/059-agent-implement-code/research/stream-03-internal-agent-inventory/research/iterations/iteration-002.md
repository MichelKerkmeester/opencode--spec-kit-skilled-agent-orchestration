# Iteration 2: Write-Capable Safety Guarantees

## Focus

This iteration focused on Q4: how existing write-capable internal agents bound their writes beyond raw permission grants. The goal was to inventory `@write`, `@debug`, `@deep-research`, `@improve-agent`, and `@improve-prompt`, then check whether the observed boundaries are enforced by frontmatter, workflow scripts, validation hooks, or prose-only governance.

## Actions Taken

- Read iteration 1 first to avoid repeating the caller-restriction inventory.
- Read `.opencode/agent/write.md`, `.opencode/agent/debug.md`, `.opencode/agent/deep-research.md`, `.opencode/agent/improve-agent.md`, and `.opencode/agent/improve-prompt.md` end-to-end.
- Read AGENTS.md agent routing and Distributed Governance Rule lines around exclusive write ownership.
- Searched system-spec-kit scripts and shared code for post-write validation hooks, scope-lock enforcement, path allowlists, and exact `allowed_paths`-style fields.
- Read `@orchestrate` spec-doc governance rules, the implement/deep-research YAML validation hooks, `validate.sh`, and the `scaffold-debug-delegation.sh` helper for concrete script-level boundaries.

## Findings

1. None of the inspected agent frontmatter uses `allowed_paths`, `allowedPaths`, `allowed_path`, or a similar path allowlist field. Write-capable agents expose broad tool permissions such as `write: allow` and `edit: allow`, while bounds are expressed in body prose or command workflow context. Evidence: `.opencode/agent/write.md:6`, `.opencode/agent/write.md:8`, `.opencode/agent/write.md:9`, `.opencode/agent/write.md:16`; `.opencode/agent/debug.md:6`, `.opencode/agent/debug.md:8`, `.opencode/agent/debug.md:9`, `.opencode/agent/debug.md:16`; `.opencode/agent/deep-research.md:6`, `.opencode/agent/deep-research.md:8`, `.opencode/agent/deep-research.md:9`, `.opencode/agent/deep-research.md:18`; `.opencode/agent/improve-agent.md:6`, `.opencode/agent/improve-agent.md:8`, `.opencode/agent/improve-agent.md:9`, `.opencode/agent/improve-agent.md:16`. Focused grep for `allowed_paths|allowedPaths|allowed_path` returned no matches in `.opencode/agent`, `.opencode/command`, or `system-spec-kit` script/shared surfaces.

2. `@write` is the closest analog for a general write-capable specialist, but its strongest path boundary is body prose: it must not create or write docs inside `specs/[###-name]/`; spec-folder docs stay with the main agent under distributed governance. Evidence: `.opencode/agent/write.md:30`. It is also LEAF-only via body rules and `permission.task: deny`, but that prevents nested dispatch rather than narrowing filesystem writes. Evidence: `.opencode/agent/write.md:16`, `.opencode/agent/write.md:34`, `.opencode/agent/write.md:36`, `.opencode/agent/write.md:37`.

3. `@write` bounds output quality through mandatory template and validation gates, not through a machine path allowlist. It must load the template before proceeding, copy the skeleton, run `validate_document.py`, and deliver only after validation/DQI criteria are met. Evidence: `.opencode/agent/write.md:46`, `.opencode/agent/write.md:48`, `.opencode/agent/write.md:51`, `.opencode/agent/write.md:58`, `.opencode/agent/write.md:63`, `.opencode/agent/write.md:67`, `.opencode/agent/write.md:71`. Its completion gate requires re-reading created files, running DQI extraction, placeholder scanning, and template alignment checks. Evidence: `.opencode/agent/write.md:299`, `.opencode/agent/write.md:303`, `.opencode/agent/write.md:307`, `.opencode/agent/write.md:311`, `.opencode/agent/write.md:327`, `.opencode/agent/write.md:329`.

4. `@debug` has raw write/edit permissions but does not itself mention `debug-delegation.md` exclusive ownership in frontmatter or body. Its frontmatter grants write/edit and denies task; the body describes root-cause workflow, direct execution, and verification, not a file-path ownership rule. Evidence: `.opencode/agent/debug.md:6`, `.opencode/agent/debug.md:8`, `.opencode/agent/debug.md:9`, `.opencode/agent/debug.md:16`, `.opencode/agent/debug.md:34`, `.opencode/agent/debug.md:36`, `.opencode/agent/debug.md:238`, `.opencode/agent/debug.md:249`, `.opencode/agent/debug.md:396`, `.opencode/agent/debug.md:400`. The exclusive `debug-delegation.md` rule appears in AGENTS.md and orchestrator governance. Evidence: `AGENTS.md:333`, `AGENTS.md:342`, `.opencode/agent/orchestrate.md:361`, `.opencode/agent/orchestrate.md:362`.

5. There is a concrete script-level guard for creating `debug-delegation.md`: `scaffold-debug-delegation.sh` requires `--spec-folder`, rejects targets outside `specs/` or `.opencode/specs/`, resolves the canonical absolute path, uses a template contract, and writes versioned files with noclobber so existing debug handoffs are not overwritten. Evidence: `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:34`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:35`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:36`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:87`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:89`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:92`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:114`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:120`, `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:126`.

6. `@deep-research` has the clearest agent-local write boundary: it explicitly says it may write only the resolved local-owner research packet for the target spec. Its write set is then decomposed into iteration files, JSONL append, reducer-owned strategy/registry/dashboard, and conditional `research/research.md` edits when `progressiveSynthesis` is true. Evidence: `.opencode/agent/deep-research.md:34`, `.opencode/agent/deep-research.md:52`, `.opencode/agent/deep-research.md:58`, `.opencode/agent/deep-research.md:59`, `.opencode/agent/deep-research.md:60`, `.opencode/agent/deep-research.md:61`, `.opencode/agent/deep-research.md:207`, `.opencode/agent/deep-research.md:208`, `.opencode/agent/deep-research.md:212`, `.opencode/agent/deep-research.md:291`, `.opencode/agent/deep-research.md:297`, `.opencode/agent/deep-research.md:298`.

7. `@deep-research` has append/write-mode discipline in prose: JSONL is append-only, iteration files are create-new, strategy is not a primary write target, and config/state mutation patterns are forbidden. Evidence: `.opencode/agent/deep-research.md:162`, `.opencode/agent/deep-research.md:167`, `.opencode/agent/deep-research.md:170`, `.opencode/agent/deep-research.md:171`, `.opencode/agent/deep-research.md:308`, `.opencode/agent/deep-research.md:310`, `.opencode/agent/deep-research.md:312`, `.opencode/agent/deep-research.md:329`, `.opencode/agent/deep-research.md:333`, `.opencode/agent/deep-research.md:334`.

8. Deep-research validation exists, but it is targeted at authored `spec.md` mutation, not a general filesystem sandbox. AGENTS.md exempts workflow-owned deep-research packet markdown from the generic authored-doc governance and says `/spec_kit:deep-research` must run targeted strict validation after every `spec.md` mutation. The deep-research YAML implements that with a `SPECKIT_RULES=... validate.sh {spec_folder} --strict` command. Evidence: `AGENTS.md:342`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:356`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:357`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:359`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:360`.

9. `@improve-agent` is write-capable but bounded as a proposal-only mutator: it must write one candidate under a packet-local candidate/runtime area, never edit the canonical target or runtime mirrors, never score/promote/benchmark, and return structured metadata. Evidence: `.opencode/agent/improve-agent.md:24`, `.opencode/agent/improve-agent.md:26`, `.opencode/agent/improve-agent.md:36`, `.opencode/agent/improve-agent.md:38`, `.opencode/agent/improve-agent.md:40`, `.opencode/agent/improve-agent.md:80`, `.opencode/agent/improve-agent.md:99`, `.opencode/agent/improve-agent.md:106`, `.opencode/agent/improve-agent.md:107`, `.opencode/agent/improve-agent.md:123`, `.opencode/agent/improve-agent.md:137`, `.opencode/agent/improve-agent.md:138`.

10. `@improve-agent` also separates write authority from journal/state authority: journal emission is orchestrator-only, and the command workflow records/scans/scores candidates outside the agent. Evidence: `.opencode/agent/improve-agent.md:155`, `.opencode/agent/improve-agent.md:157`, `.opencode/agent/improve-agent.md:160`, `.opencode/agent/improve-agent.md:167`; `.opencode/command/improve/agent.md:188`, `.opencode/command/improve/agent.md:197`; `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:153`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:154`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:158`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:164`.

11. `@improve-prompt` is the counterexample: it avoids write-bound complexity by denying write, edit, bash, memory, webfetch, chrome_devtools, task, and patch in frontmatter. Its body repeats that it is LEAF-only and read-only, never edits files, and only returns a structured prompt package. Evidence: `.opencode/agent/improve-prompt.md:6`, `.opencode/agent/improve-prompt.md:8`, `.opencode/agent/improve-prompt.md:9`, `.opencode/agent/improve-prompt.md:10`, `.opencode/agent/improve-prompt.md:16`, `.opencode/agent/improve-prompt.md:24`, `.opencode/agent/improve-prompt.md:26`, `.opencode/agent/improve-prompt.md:96`, `.opencode/agent/improve-prompt.md:99`, `.opencode/agent/improve-prompt.md:208`, `.opencode/agent/improve-prompt.md:210`.

12. `validate.sh` is a spec-folder structural/documentation validator, not a scope-lock or allowed-path validator. Its help advertises folder validation, strict warnings-as-errors, recursive phase validation, and exits 0/1/2; environment `SPECKIT_RULES` can narrow rule selection. Evidence: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:3`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:5`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:95`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:99`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:101`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:104`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:155`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:157`. Focused grep for `scope-lock`, `SCOPE LOCK`, `scope is FROZEN`, and `spec.md.*FROZEN` under `.opencode/agent`, `.opencode/command`, and system-spec-kit script/shared code returned only `AGENTS.md:36`.

13. AGENTS.md Distributed Governance Rule specifies template usage, post-write `validate.sh --strict`, `/memory:save`, deep-research/debug exclusive ownership, and optional `resource-map.md`; it does not specify machine-readable `allowed_paths`. It explicitly says this is "a workflow-required gate, not a runtime hook." Evidence: `AGENTS.md:340`, `AGENTS.md:342`.

## Questions Answered

- Q4 is answered with high confidence for the inspected surfaces: existing write-capable agents are bounded by a mix of raw tool permissions, body-level path/scope prose, command-owned workflow steps, validation-after-write, append/create-new discipline, and a few concrete helper-script checks. There is no general `allowed_paths` frontmatter field, no universal runtime write allowlist, and no code-level scope-lock implementation found for "spec.md scope is FROZEN."

## Questions Remaining

- Q1 remains open: how current agents pick up skills beyond explicit body prose and advisor routing.
- Q2 remains open: how `sk-code` performs stack-agnostic detection.
- Q5 remains open: `task: deny` and LEAF rules are visible across this pass, but runtime implementation of task permission still needs a focused dispatch-contract inventory.

## Sources Consulted

- `.opencode/agent/write.md:6`
- `.opencode/agent/write.md:8`
- `.opencode/agent/write.md:9`
- `.opencode/agent/write.md:16`
- `.opencode/agent/write.md:30`
- `.opencode/agent/write.md:34`
- `.opencode/agent/write.md:36`
- `.opencode/agent/write.md:37`
- `.opencode/agent/write.md:46`
- `.opencode/agent/write.md:48`
- `.opencode/agent/write.md:58`
- `.opencode/agent/write.md:63`
- `.opencode/agent/write.md:299`
- `.opencode/agent/write.md:303`
- `.opencode/agent/write.md:307`
- `.opencode/agent/write.md:311`
- `.opencode/agent/write.md:327`
- `.opencode/agent/debug.md:6`
- `.opencode/agent/debug.md:8`
- `.opencode/agent/debug.md:9`
- `.opencode/agent/debug.md:16`
- `.opencode/agent/debug.md:34`
- `.opencode/agent/debug.md:238`
- `.opencode/agent/debug.md:249`
- `.opencode/agent/debug.md:396`
- `.opencode/agent/debug.md:400`
- `.opencode/agent/deep-research.md:34`
- `.opencode/agent/deep-research.md:52`
- `.opencode/agent/deep-research.md:58`
- `.opencode/agent/deep-research.md:59`
- `.opencode/agent/deep-research.md:61`
- `.opencode/agent/deep-research.md:162`
- `.opencode/agent/deep-research.md:170`
- `.opencode/agent/deep-research.md:207`
- `.opencode/agent/deep-research.md:212`
- `.opencode/agent/deep-research.md:291`
- `.opencode/agent/deep-research.md:297`
- `.opencode/agent/deep-research.md:298`
- `.opencode/agent/deep-research.md:308`
- `.opencode/agent/deep-research.md:310`
- `.opencode/agent/deep-research.md:312`
- `.opencode/agent/deep-research.md:333`
- `.opencode/agent/deep-research.md:334`
- `.opencode/agent/improve-agent.md:24`
- `.opencode/agent/improve-agent.md:26`
- `.opencode/agent/improve-agent.md:38`
- `.opencode/agent/improve-agent.md:40`
- `.opencode/agent/improve-agent.md:80`
- `.opencode/agent/improve-agent.md:106`
- `.opencode/agent/improve-agent.md:107`
- `.opencode/agent/improve-agent.md:123`
- `.opencode/agent/improve-agent.md:137`
- `.opencode/agent/improve-agent.md:138`
- `.opencode/agent/improve-agent.md:155`
- `.opencode/agent/improve-prompt.md:6`
- `.opencode/agent/improve-prompt.md:8`
- `.opencode/agent/improve-prompt.md:9`
- `.opencode/agent/improve-prompt.md:16`
- `.opencode/agent/improve-prompt.md:24`
- `.opencode/agent/improve-prompt.md:26`
- `.opencode/agent/improve-prompt.md:99`
- `.opencode/agent/orchestrate.md:334`
- `.opencode/agent/orchestrate.md:338`
- `.opencode/agent/orchestrate.md:344`
- `.opencode/agent/orchestrate.md:355`
- `.opencode/agent/orchestrate.md:357`
- `.opencode/agent/orchestrate.md:358`
- `.opencode/agent/orchestrate.md:361`
- `.opencode/agent/orchestrate.md:362`
- `.opencode/agent/orchestrate.md:376`
- `.opencode/agent/orchestrate.md:379`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:34`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:87`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:89`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:92`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:114`
- `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh:120`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:95`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:99`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:104`
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:155`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:144`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:145`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:354`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:355`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:356`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:359`
- `.opencode/command/improve/agent.md:188`
- `.opencode/command/improve/agent.md:197`
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150`
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:154`
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:158`
- `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:164`
- `AGENTS.md:36`
- `AGENTS.md:333`
- `AGENTS.md:340`
- `AGENTS.md:342`

## Reflection

What worked: Reading the write-capable agents end-to-end made the actual pattern clear: frontmatter grants capability, while the body and command workflows constrain intent and process.

What did not work: Broad validation searches were noisy because `validate.sh` is referenced by many command workflows and fixtures. The useful signal came only after narrowing to exact governance surfaces and exact `scope-lock` / `allowed_paths` terms.

What I would do differently: I would start future write-safety inventories by separating four layers up front: frontmatter permissions, agent body rules, command workflow steps, and standalone helper scripts. Mixing them early makes prose governance look more enforceable than it is.

## Recommended Next Focus

Focus Q5 next: map LEAF and nesting enforcement across `permission.task: deny`, orchestrator prompt contracts, command-owned agents, and any loader/runtime code that interprets `task` permissions. For `.opencode/agent/code.md`, adopt the existing bounded-write pattern only with clear labels: `permission.task: deny`, explicit body path boundaries, "read before write" gates, packet-local or task-scope write set, post-write validation commands, and a statement that these are workflow/prose guarantees unless a harness-level allowed-path validator is added.

## Ruled Out

- Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter.
- A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code.
- Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only.
