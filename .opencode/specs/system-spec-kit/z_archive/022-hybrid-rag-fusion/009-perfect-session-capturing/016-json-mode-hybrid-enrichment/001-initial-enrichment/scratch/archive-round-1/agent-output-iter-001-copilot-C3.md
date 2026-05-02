# Iteration 001 — C3 Integration Verifier: Template Wiring Analysis

## Field Wiring Matrix

| Field | JSON Payload Source | Enrichment Source | Auto-detect Source | SessionData Key | Wired? |
|-------|-------------------|------------------|-------------------|----------------|--------|
| `HEAD_REF` | `git.headRef` | `enriched.headRef` | `getGitSnapshot().headRef` | `HEAD_REF` | Mostly |
| `COMMIT_REF` | `git.commitRef` | `enriched.commitRef` | `getGitSnapshot().commitRef` | `COMMIT_REF` | Mostly |
| `REPOSITORY_STATE` | `git.repositoryState` | `enriched.repositoryState` | `getGitSnapshot().repositoryState` | `REPOSITORY_STATE` | Mostly |
| `IS_DETACHED_HEAD` | `git.isDetachedHead` | `enriched.isDetachedHead` | `getGitSnapshot().isDetachedHead` | `IS_DETACHED_HEAD` | Mostly |
| `SESSION_STATUS` | `session.status` | None | `determineSessionStatus()` | `SESSION_STATUS` | Yes |
| `COMPLETION_PERCENT` | `session.completionPercent` | None | `estimateCompletionPercent()` | `COMPLETION_PERCENT` | Yes |
| `LAST_ACTION` | `session.lastAction` | None | `buildProjectStateSnapshot().lastAction` | `LAST_ACTION` | Yes |
| `NEXT_ACTION` | `session.nextAction` | None | `buildProjectStateSnapshot().nextAction` | `NEXT_ACTION` | Yes |
| `BLOCKERS` | `session.blockers` | None | `buildProjectStateSnapshot().blockers` | `BLOCKERS` | Yes |

## Finding 1: Empty-string git payloads can clobber extractor fallback
- **Severity**: MEDIUM
- **Location**: `workflow.ts:1178-1184`, `collect-session-data.ts:969-978`
- **Evidence**: Enrichment uses nullish coalescing: `gitPayload?.headRef ?? gitContext.headRef`. An empty string is not nullish, so it overwrites extractor output. Later mapping treats empty `gitMeta` as absent, but falls back to top-level `data.headRef`, which enrichment already set to `''`.
- **Risk**: `HEAD_REF`, `COMMIT_REF`, and especially `REPOSITORY_STATE` can end up blank even when git auto-detect had usable values. Template hides the Git Ref row or emits `repository_state: ""`.
- **Recommendation**: Normalize blank strings before coalescing, or use a "first non-empty string" helper in both enrichment and final SessionData mapping.

## Finding 2: `IS_DETACHED_HEAD` renders as `Yes`/`No`, not canonical boolean
- **Severity**: MEDIUM
- **Location**: `template-renderer.ts:167-169`, `context_template.md:754`
- **Evidence**: Renderer logic: `return value ? 'Yes' : 'No'`. Template uses `is_detached_head: {{IS_DETACHED_HEAD}}`. Test asserts `is_detached_head: No`.
- **Risk**: Human-readable output is fine, but machine consumers expecting `true`/`false` may misread this YAML/frontmatter field.
- **Recommendation**: If machine-consumed, render canonical booleans for YAML fields.

## Summary
- Fields verified: **9**
- Wiring issues: **2**
- Key insight: End-to-end wiring is present and SessionData reaches the template directly, but the git chain is only robust for non-empty payload strings, and boolean rendering is humanized rather than canonical.
