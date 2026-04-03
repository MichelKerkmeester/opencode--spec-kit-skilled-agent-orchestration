## [v0.6.0] - 2026-03-30

This release matters because it turns the final ESM (the modern JavaScript module system) compliance work from something that only looked correct in review into something that behaves safely and predictably in real use. It resolves 18 review findings across bug fixes, security, architecture, performance, testing, and documentation, while keeping all three package builds clean and leaving the same four unrelated pre-existing test failures unchanged.

The work focused on what a user or maintainer actually feels: command-line tools start the right way, saves fail safely when protection is missing, search-related hot paths do less unnecessary work, and the written project record now matches what shipped.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/006-review-remediation/` (Level 2)

---

## Bug Fixes (5)

These fixes corrected behavior that could surprise people at runtime or hide the real cause of a problem.

### Two wrapper scripts still behaved like older Node modules

**Problem:** Two command-line helpers still relied on CommonJS (the older Node.js module system) path behavior. In a codebase that had otherwise moved to ESM (the modern JavaScript module system), that left a couple of weak spots where a script could resolve its location differently from the rest of the package.

**Fix:** Those helpers now resolve their own location the same way as the rest of the ESM code. That makes script startup behavior consistent instead of depending on an older module style.

### Importing one server module could start the server by accident

**Problem:** One server module could start running as soon as it was imported. That turns a normal "load this code so I can use it" action into "load this code and launch a process," which is surprising and hard to debug.

**Fix:** Importing the module is now safe. The server starts only when someone runs it as the program entry point, not when another file merely loads it.

### Supported Node versions were not stated consistently

**Problem:** Different parts of the workspace described different minimum Node.js versions. That made the support promise look broader than it really was and left room for installs that seemed valid until newer module behavior was used.

**Fix:** The release now presents one clear minimum Node.js requirement across the workspace. Contributors and automation get a single runtime promise instead of several slightly different ones.

### The shared package entry could point people to the wrong starting file

**Problem:** The shared package's top-level entry did not line up cleanly with the build output. That made consumers more likely to depend on internal layout details instead of the supported public entry.

**Fix:** The package now opens from the expected top-level entry, while the embeddings feature remains available through a dedicated secondary entry. Consumers get the right default path without needing to guess how the build is laid out.

### Save warnings hid important differences between failure types

**Problem:** When a save operation had trouble writing files, the warning output could collapse different problems into one vague bucket. That made diagnosis harder because a person could see that something went wrong without seeing what kind of failure it actually was.

**Fix:** Save warnings now preserve the real category of the failure. People reading the output can tell the difference between persistence problems and other warning types, which makes follow-up work faster and more reliable.

---

## Security (4)

These changes made trust boundaries clearer and pushed failures in the safer direction.

### Administrative actions did not clearly warn when identity could not be proven

**Problem:** Some shared-memory administration flows could continue without a clear warning that the current connection was not a trusted transport (a connection the system can prove belongs to the right caller). That made an important trust gap too easy to miss.

**Fix:** Those actions now emit an explicit warning when the connection cannot prove identity. The system is more honest about what it can verify today, so risky situations are visible instead of quietly implied to be safe.

### A missing validation layer could let saves continue anyway

**Problem:** If the validation bridge failed to load, save operations could continue without that protection in place. In security work, that is the dangerous direction to fail because the system looks healthy while a safety check is missing.

**Fix:** Saves now fail closed (they stop instead of continuing without the missing check) unless a maintainer deliberately opts into a development bypass. That makes the safe behavior the default.

### Path discovery could drift outside the intended workspace

**Problem:** Path resolution could accept locations that were not clearly anchored to the active Spec Kit workspace. That raised the risk of reading from or acting on files outside the boundary the tool was supposed to respect.

**Fix:** Path discovery now locks itself to the nearest real workspace root before it accepts a candidate location. That keeps file operations inside the intended project boundary.

### Duplicate checks could reveal information across governed boundaries

**Problem:** Duplicate detection did not fully respect governed scope (the allowed tenant, user, agent, or shared-space boundary). In the wrong case, one scope could learn that matching content existed somewhere it should not be able to inspect.

**Fix:** Duplicate checks now stay inside the caller's governed boundary, and cross-boundary details are redacted. The system still catches real duplicates where it should, but it no longer leaks extra metadata while doing so.

---

## Documentation (4)

These changes matter because the written project record now matches the shipped behavior, which makes review, release, and future maintenance easier.

### The main task record no longer reflected the work that was already finished

**Problem:** The task tracker had fallen behind the code. When the written record says work is still open after it has already shipped, reviewers and maintainers have to re-check facts that the repository should already state clearly.

**Fix:** The main task record now reflects the completed work with supporting evidence. Future readers can trust the task list as a real status view instead of a partly stale note.

### The project plan, checklist, and summary told different stories

**Problem:** Key project documents no longer agreed on what was done, what was verified, and what still needed closure. Even when the code is correct, that mismatch slows handoff and review because people have to reconcile conflicting documents.

**Fix:** The main plan, checklist, and implementation summary now tell one consistent story. Readers can move through the documentation set without second-guessing which file is current.

### Stale template material made the current status harder to read

**Problem:** One core spec document still carried leftover template material from earlier drafting. That clutter made it harder to tell which statements were live commitments and which were just scaffolding that should have been removed.

**Fix:** The stale template material was removed, so the current status is now easier to read at a glance. The document foregrounds the active contract instead of old setup text.

### An earlier phase still looked unfinished even though its work was done

**Problem:** A previously completed verification phase still appeared open in the documentation. That weakens confidence because a finished parent release should not depend on a child record that still looks incomplete.

**Fix:** The earlier phase is now properly closed in its own documentation set. That gives the release history a clean chain of evidence from the earlier verification work through the final remediation release.

---

## Architecture (2)

These changes reduced ambiguity in the code structure and made future maintenance easier.

### Similar import fallback behavior was maintained in multiple places

**Problem:** The codebase handled the same kind of degraded import path in several separate places. Repeated fallback logic tends to drift over time because one copy gets fixed while another copy is forgotten.

**Fix:** That behavior now comes from one shared path instead of several near-duplicates. The result is easier to reason about and less likely to diverge later.

### One public API entry looked wider than expected without explanation

**Problem:** One barrel export (a single file that re-exports many public APIs from one place) looked broader than reviewers expected. Without context, a wide public surface can look accidental even when it is intentional.

**Fix:** The release keeps that broad entry on purpose and documents why it exists. The improvement here is clarity: readers can now see that the export surface was reviewed and kept for real consumers, not left wide by accident.

---

## Performance (2)

These fixes reduce unnecessary work on paths that are used often.

### Search-related module loading paid the same setup cost too often

**Problem:** A vector index (the search data structure used for similarity search) was being loaded repeatedly on a path that can run often. Small repeated costs add up when they sit on hot code paths.

**Fix:** The first call now performs the load once, and later calls reuse the result through a lazy loader (a pattern that waits to load something until it is first needed). Frequent search setup does less repeated work as a result.

### Lightweight CLI commands loaded more of the stack than they needed

**Problem:** Very small command-line tasks, including help output, could still pull in heavyweight dependencies. That is like turning on the whole workshop just to read the label on a drawer.

**Fix:** Lightweight commands now stay lightweight. Larger dependencies are only loaded when a command actually needs them, which cuts unnecessary startup work for simple invocations.

---

## Testing (1)

This work made the verification story easier to trust.

### The release record did not show enough direct proof for the review fixes

**Problem:** Reviewers wanted clearer proof that the release really preserved import behavior, admin warning behavior, and save warning behavior after the remediation work landed. Without explicit evidence, readers had to infer correctness from surrounding changes.

**Fix:** The release now includes targeted regression coverage and a clearer final verification summary. That makes the evidence trail explicit, so readers can see what was checked instead of guessing from context.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| Passing main server tests | 8,978 | 8,978 |
| Passing legacy scripts tests | 317 | 317 |
| Clean package builds verified for this phase | 0 | 3 |
| Phase-specific regression test files | 0 | 3 |
| New failures introduced by this release | 0 | 0 |

Three targeted regression test files were added, and the final verification confirmed that the only remaining failures were the same four unrelated failures that already existed before this release work.

---

<details>
<summary>Technical Details: Files Changed (28 total)</summary>

### Source (17 files)

| File | Changes |
| ---- | ------- |
| `mcp_server/scripts/map-ground-truth-ids.ts` | Replaced residual CommonJS path handling with ESM-native path resolution. |
| `mcp_server/scripts/reindex-embeddings.ts` | Replaced residual CommonJS path handling with ESM-native path resolution. |
| `mcp_server/context-server.ts` | Added an entrypoint guard so importing the module does not call `main()`. |
| `shared/package.json` | Pointed the root export at `dist/index.js`, exposed the `./embeddings` subpath, and aligned `engines.node` to `>=20.11.0`. |
| `mcp_server/package.json` | Aligned `engines.node` to `>=20.11.0`. |
| `package.json` | Aligned the root workspace `engines.node` to `>=20.11.0`. |
| `scripts/package.json` | Aligned `engines.node` to `>=20.11.0`. |
| `mcp_server/handlers/shared-memory.ts` | Added trusted-transport warnings for shared-memory admin operations. |
| `mcp_server/handlers/v-rule-bridge.ts` | Switched validation loading to fail closed and kept the `SPECKIT_VRULE_OPTIONAL` bypass for deliberate development use. |
| `mcp_server/handlers/memory-save.ts` | Wired fail-closed validation handling and preserved typed save warnings. |
| `shared/paths.ts` | Added workspace-boundary validation based on nearest workspace-root discovery. |
| `mcp_server/lib/validation/preflight.ts` | Threaded governed scope into duplicate detection and redacted cross-scope metadata. |
| `mcp_server/handlers/save/response-builder.ts` | Preserved dedicated file-persistence warning categories. |
| `scripts/core/workflow.ts` | Consolidated degraded import handling behind `tryImportMcpApi`. |
| `mcp_server/api/index.ts` | Documented the intentionally wide barrel export surface. |
| `mcp_server/lib/search/vector-index-store.ts` | Added a module-level cached lazy loader for vector index imports. |
| `mcp_server/cli.ts` | Deferred heavy imports behind per-command handlers. |

### Tests (3 files)

| File | Changes |
| ---- | ------- |
| `mcp_server/tests/preflight.vitest.ts` | Added regression coverage for governed duplicate preflight behavior. |
| `mcp_server/tests/shared-memory-handlers.vitest.ts` | Added regression coverage for shared-memory admin warning behavior. |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Added regression coverage for typed save-warning behavior. |

### Documentation (8 files)

| File | Changes |
| ---- | ------- |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/tasks.md` | Marked completed remediation work in the parent task record with evidence. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/plan.md` | Synced the parent plan with the shipped state and verified completion items. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/checklist.md` | Closed the parent checklist items with evidence. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md` | Updated the parent release summary to reflect the delivered work. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md` | Removed stale template material and clarified the current project status. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/tasks.md` | Closed the earlier verification phase task record. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/plan.md` | Closed the earlier verification phase plan items. |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/implementation-summary.md` | Added the closing implementation summary for the earlier verification phase. |

</details>

---

## Upgrade

No migration is required for users already on Node `20.11.0` or later.

If a local environment still uses an older Node 20 release, upgrade to `20.11.0` or newer before rebuilding. No schema changes were introduced.
