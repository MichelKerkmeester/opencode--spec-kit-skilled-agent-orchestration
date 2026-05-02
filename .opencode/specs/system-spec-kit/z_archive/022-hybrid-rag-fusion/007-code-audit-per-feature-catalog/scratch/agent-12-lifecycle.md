## Agent 12 - Mutation/lifecycle validation perfection

- Scope executed: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts` and `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts`.
- Boundary respected: no edits under `.opencode/specs/**` other than this required scratch note; no changes in `feature_catalog/**` or `manual_testing_playbook/**`.

### Problem

The ingest start handler rejected traversal only after calling `path.normalize()` and `path.resolve()`. Inputs that still contained raw `..` segments but normalized back inside an allowed base path, such as `/tmp/safe/../escaped.md`, could bypass the explicit traversal-segment guard because normalization removed the `..` marker before validation.

### Implementation

- Added `hasTraversalSegment(inputPath)` in `memory-ingest.ts`.
- The helper splits the original trimmed input on both `/` and `\\` and rejects any segment equal to `..` before normalization or resolution.
- Kept the existing allowed-base containment and realpath logic unchanged so the fix remains minimal and targeted.
- Left the post-resolve defensive check in place.

### Tests

- Added regression `T005a-I4a` in `handler-memory-ingest-edge.vitest.ts`.
- The new case asserts `/tmp/safe/../escaped.md` returns `E_VALIDATION`, includes the traversal-segment reason, and does not enqueue or create an ingest job.
- Existing ingest handler tests still pass unchanged.

### Verification

- `npm exec vitest run tests/handler-memory-ingest.vitest.ts tests/handler-memory-ingest-edge.vitest.ts` (run from `.opencode/skill/system-spec-kit/mcp_server`) -> pass, 21 tests.
- `python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server` -> pass, 0 findings.

### Documentation review

- Reviewed `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md` for direct lifecycle/doc drift.
- No update was required because the fix changes ingest-path input validation behavior in the handler layer and does not alter storage/checkpoint/recovery contracts documented there.

### Copilot delegation note

- `copilot` was installed and invoked with model `gpt-5.3-codex` after setting `~/.copilot/config.json` `reasoning_effort` to `xhigh`.
- The non-interactive run completed partial analysis but timed out while exploring adjacent files, so the final code/test changes were completed locally.
