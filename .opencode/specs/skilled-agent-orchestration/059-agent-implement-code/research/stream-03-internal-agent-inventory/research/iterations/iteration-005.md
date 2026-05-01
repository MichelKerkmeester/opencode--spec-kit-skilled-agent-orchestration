# Iteration 5: sk-code Stack Detection Mechanism

## Focus

This iteration focused on Q2: how `sk-code` detects application stacks, where the marker-file probing logic lives, what happens for unsupported stacks such as OpenCode harness code, generic Node.js, React Native, and Swift, and whether a future `@code` agent can reuse the mechanism without hardcoding its own stack assumptions.

## Actions Taken

- Read iterations 1-4 first to avoid repeating the caller-restriction, write-safety, LEAF, and skill-loading inventories.
- Read `.opencode/skill/sk-code/SKILL.md` end-to-end with line numbers.
- Listed `.opencode/skill/sk-code/` and `.opencode/skill/sk-code/references/` to identify router docs, scripts, assets, and stack-aware resource folders.
- Read `.opencode/skill/sk-code/references/router/stack_detection.md` and `.opencode/skill/sk-code/references/router/resource_loading.md`.
- Searched `sk-code`, agents, commands, and root `AGENTS.md` for `detect_stack`, `route_code_resources`, `stack_detection`, `UNKNOWN_FALLBACK`, and `sk-code` invocation patterns.
- Read `sk-code` README, `@review`, `@orchestrate`, and `/spec_kit:implement` references for canonical invocation and overlay-selection precedent.

## Findings

1. `sk-code` is explicitly an umbrella skill whose first step is stack detection, then intent classification, then stack-aware resource loading. Its frontmatter says it detects stack first for Webflow, React/Next.js, and Go, while Node.js, React Native, Swift, and other stacks fall through to UNKNOWN disambiguation. Evidence: `.opencode/skill/sk-code/SKILL.md:2`, `.opencode/skill/sk-code/SKILL.md:3`, `.opencode/skill/sk-code/SKILL.md:12`, `.opencode/skill/sk-code/SKILL.md:14`, `.opencode/skill/sk-code/SKILL.md:75`, `.opencode/skill/sk-code/SKILL.md:77`.

2. The primary detection policy is ordered and first-match-wins. WEBFLOW is checked first because Webflow projects often have `package.json` for build tooling and must not misroute to NEXTJS. Evidence: `.opencode/skill/sk-code/SKILL.md:77`, `.opencode/skill/sk-code/SKILL.md:79`, `.opencode/skill/sk-code/references/router/stack_detection.md:16`, `.opencode/skill/sk-code/references/router/stack_detection.md:20`.

3. The marker order in `SKILL.md` is: WEBFLOW, GO, NEXTJS, then UNKNOWN. WEBFLOW markers include `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-`, motion.dev / GSAP / Lenis / HLS / Swiper / FilePond signals, and `wrangler.toml`. GO is `go.mod`. NEXTJS is `next.config.js|mjs|ts` or `package.json` containing `"next"` or `"react"`. Evidence: `.opencode/skill/sk-code/SKILL.md:81`, `.opencode/skill/sk-code/SKILL.md:88`, `.opencode/skill/sk-code/SKILL.md:90`, `.opencode/skill/sk-code/SKILL.md:95`, `.opencode/skill/sk-code/SKILL.md:97`, `.opencode/skill/sk-code/references/router/stack_detection.md:38`, `.opencode/skill/sk-code/references/router/stack_detection.md:57`.

4. `sk-code` does not implement OpenCode harness detection as an application stack. Root `AGENTS.md` says OpenCode markers belong to the OpenCode stack, but `sk-code` itself says OpenCode harness/system code under `.opencode/` should use the sibling `sk-code-opencode`; it is intentionally not subsumed. Evidence: `AGENTS.md:24`, `.opencode/skill/sk-code/SKILL.md:40`, `.opencode/skill/sk-code/SKILL.md:43`, `.opencode/skill/sk-code/SKILL.md:621`, `.opencode/skill/sk-code/SKILL.md:631`.

5. The detector is not a standalone executable router script. The `.opencode/skill/sk-code/` inventory contains `SKILL.md`, `README.md`, router docs under `references/router/`, stack resource folders under `references/{webflow,nextjs,go}`, assets under `assets/{webflow,nextjs,go,universal}`, and only three scripts: `minify-webflow.mjs`, `verify-minification.mjs`, and `test-minified-runtime.mjs`. Those scripts are Webflow build/verification utilities, not stack detection. Evidence: `.opencode/skill/sk-code/SKILL.md:544`, `.opencode/skill/sk-code/SKILL.md:550`, `.opencode/skill/sk-code/README.md:37`, `.opencode/skill/sk-code/README.md:82`.

6. The closest thing to executable detection logic is Python-style pseudocode embedded in `SKILL.md`. It defines `detect_stack(cwd)`, `score_intents`, `select_intents`, and `route_code_resources`, but there is no checked-in `.py`, `.js`, or JSON marker table that an agent can call directly. Evidence: `.opencode/skill/sk-code/SKILL.md:132`, `.opencode/skill/sk-code/SKILL.md:134`, `.opencode/skill/sk-code/SKILL.md:270`, `.opencode/skill/sk-code/SKILL.md:282`, `.opencode/skill/sk-code/SKILL.md:303`, `.opencode/skill/sk-code/references/router/resource_loading.md:31`.

7. After detection, `route_code_resources()` returns a structured routing result: `stack`, selected `intents`, `verification_commands`, and loaded resource paths. For UNKNOWN or non-routable stacks, it returns no verification commands, only universal resources, and a fallback checklist. Evidence: `.opencode/skill/sk-code/SKILL.md:303`, `.opencode/skill/sk-code/SKILL.md:306`, `.opencode/skill/sk-code/SKILL.md:318`, `.opencode/skill/sk-code/SKILL.md:329`, `.opencode/skill/sk-code/SKILL.md:347`, `.opencode/skill/sk-code/SKILL.md:352`.

8. Stack-aware resources are explicit and folder-based. WEBFLOW routes to live content under `references/webflow/`, `assets/webflow/`, and Webflow scripts; NEXTJS routes to stub content under `references/nextjs/` and `assets/nextjs/`; GO routes to stub content under `references/go/` and `assets/go/`; all stacks also load universal core resources. Evidence: `.opencode/skill/sk-code/SKILL.md:101`, `.opencode/skill/sk-code/SKILL.md:105`, `.opencode/skill/sk-code/SKILL.md:111`, `.opencode/skill/sk-code/SKILL.md:122`, `.opencode/skill/sk-code/SKILL.md:143`, `.opencode/skill/sk-code/SKILL.md:147`, `.opencode/skill/sk-code/references/router/stack_detection.md:79`, `.opencode/skill/sk-code/references/router/stack_detection.md:96`.

9. UNKNOWN behavior is well specified. Node.js without React/Next, React Native/Expo, Swift/Package.swift, and no-marker repos return UNKNOWN; the router surfaces four disambiguation questions and skips stack-specific resource loading. Evidence: `.opencode/skill/sk-code/SKILL.md:244`, `.opencode/skill/sk-code/SKILL.md:249`, `.opencode/skill/sk-code/SKILL.md:322`, `.opencode/skill/sk-code/SKILL.md:330`, `.opencode/skill/sk-code/references/router/stack_detection.md:73`, `.opencode/skill/sk-code/references/router/stack_detection.md:75`, `.opencode/skill/sk-code/references/router/resource_loading.md:112`, `.opencode/skill/sk-code/references/router/resource_loading.md:142`.

10. Multi-marker conflict resolution is documented, but it is not a runtime validator. The reference says monorepos with `go.mod` plus `package.json` route to GO by first match, and users can override with prompt hints such as "in the next.js frontend". Evidence: `.opencode/skill/sk-code/references/router/stack_detection.md:69`, `.opencode/skill/sk-code/references/router/stack_detection.md:75`, `.opencode/skill/sk-code/README.md:101`, `.opencode/skill/sk-code/README.md:105`.

11. There is one internal inconsistency worth preserving for design work: `SKILL.md`'s Python-style pseudocode only treats `wrangler.toml` as WEBFLOW when no `next.config.*` exists, while the marker table, router reference, and quick shell command treat `wrangler.toml` as a WEBFLOW marker under first-match semantics. Evidence: `.opencode/skill/sk-code/SKILL.md:88`, `.opencode/skill/sk-code/SKILL.md:274`, `.opencode/skill/sk-code/SKILL.md:663`, `.opencode/skill/sk-code/SKILL.md:665`, `.opencode/skill/sk-code/references/router/stack_detection.md:46`, `.opencode/skill/sk-code/references/router/stack_detection.md:63`.

12. The canonical invocation pattern for a future `@code` is body/prose skill use: load `sk-code` by reading `SKILL.md`, then apply its detection/resource-loading protocol. Existing `@review` precedent says load `sk-code` baseline first, detect stack/codebase, then load exactly one overlay; `@orchestrate` routes implementation/testing to a general agent with `sk-code-*` auto-detected skills; the `sk-code` README says manual invocation is `Read .opencode/skill/sk-code/SKILL.md`. Evidence: `.opencode/agent/review.md:31`, `.opencode/agent/review.md:47`, `.opencode/agent/review.md:79`, `.opencode/agent/review.md:82`, `.opencode/agent/orchestrate.md:93`, `.opencode/agent/orchestrate.md:100`, `.opencode/agent/orchestrate.md:309`, `.opencode/agent/orchestrate.md:315`, `.opencode/skill/sk-code/README.md:11`, `.opencode/skill/sk-code/README.md:18`.

## Questions Answered

- Q2 is answered with high confidence for the checked-in repo state. `sk-code` detects WEBFLOW, GO, and NEXTJS through ordered marker-file/prose/pseudocode rules in `SKILL.md` and `references/router/stack_detection.md`. It does not expose a callable router script or structured JSON marker table. Unsupported stacks, including generic Node.js, React Native/Expo, Swift, and OpenCode harness code, are not owned by this skill and must route to UNKNOWN disambiguation or a sibling skill such as `sk-code-opencode`.

## Questions Remaining

- No original Q1-Q5 question remains unanswered at the stream level.
- A synthesis question remains for iteration 6: what exact `@code` contract should be written now that skill loading, caller restriction, write safety, LEAF, and stack detection are all characterized?
- One local cleanup/design caveat remains: decide whether to normalize the `wrangler.toml` conflict in `SKILL.md` before treating that pseudocode as canonical implementation.

## Sources Consulted

- `.opencode/skill/sk-code/SKILL.md:3`
- `.opencode/skill/sk-code/SKILL.md:12`
- `.opencode/skill/sk-code/SKILL.md:43`
- `.opencode/skill/sk-code/SKILL.md:77`
- `.opencode/skill/sk-code/SKILL.md:79`
- `.opencode/skill/sk-code/SKILL.md:81`
- `.opencode/skill/sk-code/SKILL.md:88`
- `.opencode/skill/sk-code/SKILL.md:95`
- `.opencode/skill/sk-code/SKILL.md:101`
- `.opencode/skill/sk-code/SKILL.md:105`
- `.opencode/skill/sk-code/SKILL.md:111`
- `.opencode/skill/sk-code/SKILL.md:147`
- `.opencode/skill/sk-code/SKILL.md:244`
- `.opencode/skill/sk-code/SKILL.md:270`
- `.opencode/skill/sk-code/SKILL.md:274`
- `.opencode/skill/sk-code/SKILL.md:303`
- `.opencode/skill/sk-code/SKILL.md:322`
- `.opencode/skill/sk-code/SKILL.md:347`
- `.opencode/skill/sk-code/SKILL.md:631`
- `.opencode/skill/sk-code/SKILL.md:663`
- `.opencode/skill/sk-code/references/router/stack_detection.md:16`
- `.opencode/skill/sk-code/references/router/stack_detection.md:20`
- `.opencode/skill/sk-code/references/router/stack_detection.md:38`
- `.opencode/skill/sk-code/references/router/stack_detection.md:57`
- `.opencode/skill/sk-code/references/router/stack_detection.md:69`
- `.opencode/skill/sk-code/references/router/stack_detection.md:75`
- `.opencode/skill/sk-code/references/router/stack_detection.md:79`
- `.opencode/skill/sk-code/references/router/resource_loading.md:31`
- `.opencode/skill/sk-code/references/router/resource_loading.md:67`
- `.opencode/skill/sk-code/references/router/resource_loading.md:112`
- `.opencode/skill/sk-code/references/router/resource_loading.md:137`
- `.opencode/skill/sk-code/README.md:11`
- `.opencode/skill/sk-code/README.md:18`
- `.opencode/skill/sk-code/README.md:22`
- `.opencode/skill/sk-code/README.md:33`
- `.opencode/skill/sk-code/README.md:37`
- `.opencode/skill/sk-code/README.md:82`
- `.opencode/skill/sk-code/README.md:101`
- `.opencode/agent/review.md:31`
- `.opencode/agent/review.md:47`
- `.opencode/agent/review.md:79`
- `.opencode/agent/orchestrate.md:93`
- `.opencode/agent/orchestrate.md:100`
- `.opencode/agent/orchestrate.md:309`
- `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:214`
- `AGENTS.md:24`
- `AGENTS.md:174`

## Reflection

- What worked and why: Reading `SKILL.md` with the router references separated the actual contract from the repo-level summary. The repo summary mentions more stacks, but `sk-code` itself only owns WEBFLOW, NEXTJS, and GO.
- What did not work and why: Treating the pseudocode as executable would overstate the evidence. The detector is authoritative documentation for the active model to apply, not a script a future agent can import today.
- What I would do differently: I would add a small tested router module before making `@code` depend on this mechanically. Until then, `@code` should load `sk-code` and apply the documented rules with explicit uncertainty on edge cases.

## Recommended Next Focus

Iteration 6 should synthesize the `@code` design contract from Q1-Q5: body-level skill binding to `sk-code`, no claimed caller-restriction enforcement, `permission.task: deny` for LEAF behavior, bounded write prose plus verification gates, and stack detection delegated to `sk-code` by reference rather than duplicated inside the agent. If implementation is next, the lowest-risk improvement is a tiny, tested `sk-code` stack detector shared by `SKILL.md`, advisor diagnostics, and future `@code`.

## Ruled Out / Dead Ends

- A standalone executable `sk-code` stack-router script.
- A structured JSON marker table for stack detection.
- OpenCode harness/system code as an `sk-code` application stack; it belongs to `sk-code-opencode`.
- Swift, React Native/Expo, and generic Node.js ownership by `sk-code`; they route to UNKNOWN.
