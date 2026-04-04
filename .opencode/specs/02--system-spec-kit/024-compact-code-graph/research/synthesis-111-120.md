# Research Synthesis: Iterations 111-120 — OpenCode Prompt-Schema Regression

## Scope

Ten iterations investigating why the packet-030 OpenCode plugin:

- sometimes stops showing the expected startup digest, and
- still triggers `Invalid prompt: The messages do not match the ModelMessage[] schema.`

The work focused on the current local plugin implementation, the external `opencode-lcm` reference, and older in-repo OpenCode plugin patterns.

## Key Findings

### 1. The most suspicious seam is `experimental.chat.messages.transform`

The local plugin only mutates `ModelMessage[]` in one place: it pushes a synthetic object literal into `anchor.parts` during `experimental.chat.messages.transform`. The `system` and `compaction` hooks only append strings. That makes `messages.transform` the most likely source of the schema failure.

### 2. `opencode-lcm` is safer because it centralizes schema-aware mutation

The external reference also mutates `messages`, but it does not build parts inline in the hook body. It delegates to a store path that imports SDK `Part` types and owns filtering, dedupe, and synthetic-part creation. The lesson is not "messages.transform is safe by default." The lesson is "if you mutate messages, do it through a schema-aware path."

### 3. The current tests are too weak for this boundary

Our Vitest coverage only checks that one synthetic object gets pushed and marked with metadata. It does not validate the transformed payload against the real OpenCode contract, so a live `ModelMessage[]` failure can slip past green tests.

### 4. The startup-digest symptom is probably secondary

The best explanation is that `system.transform` can still run, but the final prompt assembly later fails because the mutated `messages` payload is invalid. That makes the startup digest look flaky or absent even though the real defect is a later-stage prompt-schema rejection.

### 5. We already have a lower-risk OpenCode pattern in the repo

The archived working-memory plugin uses `messages.transform` conservatively by mutating existing `tool` parts in place rather than appending brand-new synthetic parts. That is a better fallback direction than the current ad hoc synthetic-part builder.

## Consolidated Recommendations

### Immediate

1. Disable `experimental.chat.messages.transform`
2. Keep `experimental.chat.system.transform` and `experimental.session.compacting`
3. Restart OpenCode and confirm the invalid-prompt error disappears
4. Confirm the startup digest becomes stable again

### Near-term

5. Add a runtime-contract test for transformed messages
6. Add per-hook diagnostics in the plugin status tool
7. Do not re-enable synthetic message parts until there is stronger schema validation

### Medium-term

8. If current-turn message enrichment must return, prefer:
   - mutation of existing host-owned parts, or
   - a true SDK-aligned builder/helper

9. Keep the subprocess bridge architecture; it solved a different and earlier ABI problem correctly

## Practical Decision

The best next implementation move is not a broad rewrite. It is a narrow rollback of the risky hook surface:

- remove or gate `messages.transform`
- prove OpenCode stability
- only then reintroduce richer message-time context if packet 030 still needs it
