## Focus

Audit Q1 concurrency and race-condition surfaces across Stop-hook state, `/memory:save`, `generate-context`, and deep-research packet locking.

## Actions Taken

1. Used `view` + `rg` on `mcp_server/hooks/claude/hook-state.ts` and `mcp_server/hooks/claude/session-stop.ts`; confirmed temp-file rename protects against torn JSON, but the Stop-hook still does unlocked read-modify-write with no session generation/CAS.
2. Used `view` on `tests/_support/hooks/replay-harness.ts`, `tests/hook-session-stop-replay.vitest.ts`, and `tests/hook-stop-token-tracking.vitest.ts`; confirmed replay coverage is serial/idempotency-focused and does not exercise parallel Stop invocations or hard-kill recovery.
3. Used `view` + `rg` on `handlers/save/atomic-index-memory.ts`, `handlers/save/spec-folder-mutex.ts`, and `handlers/memory-save.ts`; confirmed "atomic" covers pending-file promotion plus DB work, but serialization is only in-process and the validator runs after promotion against the live file.
4. Used `view` on `lib/validation/spec-doc-structure.ts`; confirmed the `POST_SAVE_FINGERPRINT` rule rereads the promoted file and, on mismatch, writes `snapshotContent` back to disk.
5. Used `view` + `rg` on `scripts/memory/generate-context.ts` and `scripts/core/workflow.ts`; traced the global workflow lock, the `.savePFD.lock` folder lock, and both timeout/stale-lock fail-open paths.
6. Used `view` on `shared/review-research-paths.cjs` and `command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; confirmed packet selection happens before `step_acquire_lock`, so the advisory lock cannot serialize `pt-{NN}` allocation.
7. Used `view` on `.claude/skills/sk-deep-research/scripts/reduce-state.cjs`; confirmed reducer-owned registry/strategy/dashboard writes are plain overwrite writes with no temp-file promotion or lock.

## Findings

### P0

- `FIND-iter002-post-save-rollback-clobber` | Severity: `P0` | File:line: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:10-27`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1597-1603`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3118-3124`, `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:981-1014` | Description: `/memory:save` serializes canonical saves with an in-memory `Map`, not a cross-process lock. After the pending file is already promoted, the validator rereads the live target and, on fingerprint mismatch, restores `snapshotContent`, which is the pre-merge document, not the competing writer's result. | Repro / observed behavior: run two separate Node processes saving different routed updates to the same `implementation-summary.md`; if process B overwrites the file before process A reaches `validateCanonicalPreparedSave()`, A hits `currentFingerprint !== expectedFingerprint` and executes `fs.writeFileSync(targetPath, postSavePlan.snapshotContent, 'utf8')` at `spec-doc-structure.ts:999`. | Why it matters: one accepted concurrent write can erase another and the target document can regress past both writers, which is direct state loss.

### P1

- `FIND-iter002-stop-hook-last-writer-wins` | Severity: `P1` | File:line: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:313-321`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:421-423`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:477-498`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:949-956`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:424-441` | Description: the Stop-hook still does an unlocked load/parse/patch/update flow. `updateState()` reloads state and atomically renames the JSON file, but there is no session mutex, sequence number, or compare-and-swap guard around the merge. | Repro / observed behavior: two Stop invocations for the same Claude session both build patches from overlapping state generations; whichever process renames last wins for `lastSpecFolder`, `sessionSummary`, and `producerMetadata`, even though both writes were individually "atomic". | Why it matters: callers can observe the wrong autosave packet target or lose the latest session summary/producer metadata even when neither writer crashes.

- `FIND-iter002-stop-hook-offset-metric-drift` | Severity: `P1` | File:line: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:321-338`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-379`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:401-409`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:953-956` | Description: concurrent Stop-hooks share the same initial `lastTranscriptOffset`, parse the same transcript suffix, and then overwrite metric fields rather than reconciling them. Only `lastTranscriptOffset` is merged with `Math.max(...)`; token counts are last-writer-wins. | Repro / observed behavior: two Stop-hooks start from the same `startOffset`; one parses a larger suffix or later transcript generation, but a stale saver can still overwrite `estimatedPromptTokens` / `estimatedCompletionTokens` while `lastTranscriptOffset` stays advanced. | Why it matters: cache-warning and token-cost surfaces can show a regressed metric snapshot that no longer matches the stored transcript cursor.

- `FIND-iter002-save-pfd-live-lock-eviction` | Severity: `P1` | File:line: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:462-468`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:471-505`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:511-523`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1345-1411` | Description: `.savePFD.lock` is treated as stale after 5 seconds based on `mtime` alone. Unlike the global workflow lock, the folder lock never checks the recorded PID, so a healthy long-running writer can have its lock deleted by a contender. | Repro / observed behavior: if the holder stays in the `withSavePfdLock(...)` section longer than 5 seconds, another process reaches `isSavePfdLockStale()`, unlinks the live lock at `workflow.ts:494`, and enters the same critical section. The guarded block itself already logs `"memorySequence lost-update detected"` and can continue after three failed retries. | Why it matters: continuity metadata (`description.json` / PFD sequence tracking) can diverge or silently drop one writer's update under legitimate load, not just after crashes.

- `FIND-iter002-generate-context-lock-fail-open` | Severity: `P1` | File:line: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:401-428`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:439-459`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:664-665` | Description: the top-level cross-process workflow lock times out after ~30 seconds and explicitly proceeds without the filesystem lock. `generate-context.ts` installs signal handlers, but a slow healthy writer is not protected once a waiter hits the timeout path. | Repro / observed behavior: process A holds the workflow lock for >30s; process B logs `proceeding without fs lock` and enters `runWorkflow()` anyway because the in-process queue only serializes calls inside one process. | Why it matters: two independent `generate-context` runs can overlap on the same spec folder instead of blocking, which turns later file writes into a race instead of an ordered queue.

- `FIND-iter002-lock-after-allocation` | Severity: `P1` | File:line: `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:31-42`, `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:66-100`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:124-170` | Description: deep-research chooses `{phaseSlug}-pt-{NN}` by counting directories before any lock is acquired, and the advisory lock file lives inside the already-chosen `{artifact_dir}`. The lock can serialize activity inside a packet, but it cannot serialize packet selection itself. | Repro / observed behavior: two initializers or a resumer plus initializer can both call `resolveArtifactRoot(...)` before `step_acquire_lock`; both decisions are made from directory count, not from an authoritative active-lineage pointer. This is the concurrency consequence of the already-logged `FIND-iter001-reducer-path-drift`, not a re-file of that bug. | Why it matters: active lineage can split or collide before advisory locking starts, so a resumer can land on a sibling packet or attach to the wrong packet generation.

### P2

- `FIND-iter002-stop-hook-tests-miss-parallelism` | Severity: `P2` | File:line: `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/replay-harness.ts:86-112`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:17-18`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:56-99`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:118-226`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:23-109` | Description: the replay and token tests are sequential and prove idempotent replays plus injected temp-write failure, but they never drive two Stop-hooks in parallel. | Repro / observed behavior: `describe.sequential(...)` forces serial runs, `sandbox.run()` is called one-after-another, and the failure injection only mocks `.tmp-*` write errors rather than racing two writers or simulating `kill -9` between temp write and rename. | Why it matters: the suite cannot detect the live session races above, so the "atomic write" claim is stronger than the tests actually prove.

- `FIND-iter002-reducer-derived-overwrite` | Severity: `P2` | File:line: `.claude/skills/sk-deep-research/scripts/reduce-state.cjs:23-26`, `.claude/skills/sk-deep-research/scripts/reduce-state.cjs:823-875` | Description: reducer-owned outputs (`findings-registry.json`, `deep-research-strategy.md`, `deep-research-dashboard.md`) are plain `writeFileSync()` overwrites with no temp-file promotion and no reducer lock. | Repro / observed behavior: concurrent reducer invocations both read the same JSONL, derive state, and then the last `writeUtf8(...)` wins for all three files. | Why it matters: JSONL remains the source of truth, but live steering artifacts can jump backward or flicker until recomputed, which degrades observability rather than corrupting canonical evidence.

## Questions Answered

Q1 is **partially answered**.

Covered:
1. Stop-hook persisted-state writes and missing generation/CAS protection.
2. Replay/test coverage gaps for parallel Stop-hook paths.
3. `/memory:save` pending-file promotion, in-process-only mutexing, and post-save fingerprint rollback behavior.
4. `generate-context` / workflow lock fallback behavior and folder-lock stale-lock handling.
5. Deep-research packet-allocation vs advisory-lock ordering.
6. Reducer overwrite behavior for derived research artifacts.

Not fully covered this iteration:
1. The command-engine implementation behind declarative `append_to_jsonl` steps in the deep-research YAML is not surfaced in this repository slice, so I could not prove whether framework-owned JSONL appends use `O_APPEND`, rewrite files, or buffer writes internally.
2. The actual OS-level implementation of `step_acquire_lock` is specified in YAML but not materialized here, so I could confirm the lock ordering contract but not inspect the concrete syscall wrapper.

## Questions Remaining

1. **Q2 `/memory:save` planner-first routing table drift** - compare live handler routing, response-builder output, and operator docs for mismatches in default behavior and fallback wording.
2. **Q3 Gates A-F enforcement** - trace the Gate D regression suites and handler code to identify code/doc drift in continuity-read gating.
3. **Q4 D1-D8 remediation landing status** - verify that packet-002 fixes are implemented in runtime code, not only encoded in reviewers/tests/docs.
4. **Q5 Cache-warning hook transcript identity + replay coverage** - trace transcript fingerprint/producer metadata invariants and identify identity drift not yet tested.
5. **Q6 Reducer / state rehydration schema agreement** - compare hook-state, thin continuity, and reducer expectations for schema/version drift and recovery behavior.
6. **Q7 JSONL audit events vs live emitters** - enumerate live event types from hook/save/runtime code and compare them with documented audit events.

## Next Focus

Audit **Q2** next by tracing planner-first routing and fallback behavior through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`, and `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`.
