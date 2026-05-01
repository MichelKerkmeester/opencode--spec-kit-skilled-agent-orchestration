# Focus

Repair-path design for template consolidation:

1. Identify the minimum changes needed for `compose.sh` output to become byte-equivalent to checked-in `templates/level_N/`.
2. Design a resolver API that can be consumed by shell (`create.sh` / `copy_template`) and JS/TS validators without preserving hardcoded physical `level_N` reads forever.

# Actions Taken

1. Read iteration 3 first and reused its determinism result: generation is deterministic against itself, but not byte-equivalent to committed rendered templates.
2. Recreated an isolated temp copy under `/tmp/template-experiment/system-spec-kit` and ran `bash scripts/templates/compose.sh 2 3`.
3. Compared fresh composed `level_2/spec.md` and `level_3/spec.md` against checked-in templates with `diff -u`.
4. Ran `wrap-all-templates.sh` against the temp output to test whether the wrapper is a parity repair step.
5. Inspected `compose.sh`, `wrap-all-templates.{sh,ts}`, `template-utils.sh`, `template-structure.js`, `spec-core.md`, Level 2 and Level 3 addenda, and committed Level 1/2/3/3+ spec contracts.
6. Counted rendered template deletion surface: 25 checked-in `level_*/*.md` files, 4,087 LOC; excluding READMEs, 21 generated runtime docs, 3,561 LOC.

# Findings

## Byte Diff Results

Fresh `compose.sh` output versus committed `level_2/spec.md` differs by 25 diff lines. The only observed drift in the compose-only comparison is the missing legacy `_memory.continuity` frontmatter block.

```diff
-_memory:
-  continuity:
-    packet_pointer: "system-spec-kit/templates/level_2"
-    last_updated_at: "2026-04-11T00:00:00Z"
-    last_updated_by: "template-author"
-    recent_action: "Initialized Level 2 template"
-    next_safe_action: "Replace continuity placeholders"
```

Fresh `compose.sh` output versus committed `level_3/spec.md` differs by 40 diff lines. The drift categories are:

| Category | Evidence | Repair owner |
| --- | --- | --- |
| Legacy continuity frontmatter missing | Same `_memory.continuity` block removed from generated output. | Composer normalization. |
| Metadata anchor lost | Committed has `<!-- ANCHOR:metadata -->` before `## 1. METADATA`; generated dynamic Level 3 composition starts extraction at `## 1.` and drops the preceding anchor line. | Composer extraction/assembly. |
| Metadata level not normalized | Committed has `| **Level** | 3 |`; generated has `| **Level** | [1/2/3/3+] |`. | Composer normalization, but with file-level parity rules. |

Across all runtime rendered docs, compose-only drift is mostly the legacy frontmatter block:

| Group | Count / LOC | Main drift |
| --- | ---: | --- |
| Checked-in `templates/level_*/*.md` including README | 25 files / 4,087 LOC | Deletion target if fully consolidated. |
| Generated runtime docs excluding README | 21 files / 3,561 LOC | Generator output surface. |
| Most non-spec docs | 25 diff lines each | Missing `_memory.continuity`. |
| `level_3/decision-record.md` | 33 diff lines | Missing `_memory.continuity` plus malformed generated description. |
| `level_3+/spec.md` | 92 diff lines | Missing `_memory.continuity`, metadata drift, missing committed L3+ anchors. |

The `wrap-all-templates.sh` wrapper is not a safe byte-equivalence repair. After compose plus wrap:

| File | Result |
| --- | --- |
| `level_2/spec.md` | Adds `<!-- ANCHOR:open-questions-10 -->`, which is not in the committed file. |
| `level_3/spec.md` | Adds generated anchors such as `executive-summary-1`, `metadata-2`, `edge-cases-9`, and `related-documents-14`, while committed Level 3 uses a smaller legacy anchor contract: `metadata`, core section anchors, and a broad `questions` anchor spanning sections 7-12. |
| `level_3+/spec.md` | Adds even more generated numeric anchors and does not recreate the committed broad `questions` anchor contract. |

So the repair path should not be "compose, then wrap" unless the wrapper learns to preserve existing open anchor spans instead of only checking the prior two lines.

## Minimum Byte-Equivalence Repair Plan

The smallest repair path is composer-first, not a TypeScript rewrite and not bulk-editing every rendered file.

### Repair 1: inject legacy continuity frontmatter

Add a `inject_continuity_frontmatter(level, content)` step in `compose.sh` after title suffix normalization or immediately before `write_file` comparison/write.

Why composer normalization wins:

- Adding `_memory.continuity` to every source fragment would duplicate level-specific rendered state across `core/` and `addendum/`.
- The committed contract already differs by level: Level 1 uses `packet_pointer: "000-feature-name"` and "Initialize continuity block"; Levels 2/3/3+ use `system-spec-kit/templates/level_N` and "Initialized Level N template".
- A single composer function can reproduce the legacy block exactly while keeping source templates clean.

Pseudo-shape:

```bash
continuity_block_for_level() {
  case "$1" in
    1) packet_pointer="000-feature-name"; recent_action="Initialize continuity block"; next_action="Replace template defaults on first save" ;;
    2) packet_pointer="system-spec-kit/templates/level_2"; recent_action="Initialized Level 2 template"; next_action="Replace continuity placeholders" ;;
    3) packet_pointer="system-spec-kit/templates/level_3"; recent_action="Initialized Level 3 template"; next_action="Replace continuity placeholders" ;;
    "3+") packet_pointer="system-spec-kit/templates/level_3+"; recent_action="Initialized Level 3 plus template"; next_action="Replace continuity placeholders" ;;
  esac
}
```

Then insert the block into the leading YAML frontmatter before the closing `---`, only if `_memory:` is absent. This keeps the transform idempotent.

### Repair 2: fix Level 3 and 3+ dynamic spec anchor assembly

Do not rely on `wrap-all-templates.sh` for parity. Encode the committed anchor contract in the dynamic spec assembly:

- Preserve `<!-- ANCHOR:metadata -->` before `## 1. METADATA`.
- Preserve `<!-- /ANCHOR:metadata -->` after the metadata table. This already comes from `core_body`; only the opening anchor is lost.
- Insert `<!-- ANCHOR:questions -->` before the dynamic L3/L3+ suffix starts at section 7.
- Place `<!-- /ANCHOR:questions -->` after open questions or the final generated spec body exactly as committed.
- For Level 3+, keep explicit committed anchors for governance-only sections: `approval-workflow`, `compliance-checkpoints`, `stakeholder-matrix`, `change-log`. These can be added to `addendum/level3-plus-govern/spec-level3plus-suffix.md` because they are true source semantics, not output-only metadata.

### Repair 3: preserve the weird metadata-level contract first

`update_metadata_level()` currently only matches `[1/2/3]`, while current sources use `[1/2/3/3+]`. The committed contract is non-canonical:

| File | Committed value |
| --- | --- |
| `level_1/spec.md` | `1` |
| `level_2/spec.md` | `[1/2/3/3+]` |
| `level_3/spec.md` | `3` |
| `level_3+/spec.md` | `3+` |
| `implementation-summary.md` all levels | `[1/2/3/3+]` |

For byte equivalence, do not globally "fix" the placeholder yet. Add a spec-only normalization map that reproduces the committed values. A later template-contract version can intentionally normalize Level 2, but doing that in the parity phase would change the checked-in contract.

### Repair 4: repair `decision-record.md` source metadata

Generated `level_3/decision-record.md` currently has:

```yaml
description: "not \"A decision was required regarding the selection of an appropriate approach.\" -->"
```

The committed rendered file has:

```yaml
description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."
```

This should be repaired in `addendum/level3-arch/decision-record.md`, because the source metadata itself is malformed. This is a source repair, not a composer normalization rule.

### Repair 5: define README policy outside the runtime resolver

`compose.sh` generates 21 runtime docs. Checked-in level directories contain 25 files because each level also has a `README.md`. These READMEs are documentation, not creation-time templates. Keep them checked in or generate them with a separate docs step; do not make `create.sh` depend on them.

# Resolver API Design

The resolver should hide whether templates come from checked-in `level_N/` dirs, a generated cache, or a future source-only generation path.

## TypeScript API

```ts
type TemplateLevel = '1' | '2' | '3' | '3+';
type TemplateFormat = 'path' | 'content';

interface ResolveTemplateOptions {
  templatesRoot?: string;
  cacheRoot?: string;
  format?: TemplateFormat;
  strict?: boolean;
  allowCheckedInFallback?: boolean;
}

interface ResolvedTemplate {
  level: TemplateLevel;
  name: string;
  path: string;
  content?: string;
  source: 'generated-cache' | 'checked-in';
  sourceHash: string | null;
  generatedAt: string | null;
}

async function resolveTemplate(
  level: TemplateLevel | number,
  name: string,
  options: ResolveTemplateOptions = {}
): Promise<ResolvedTemplate>;
```

Semantics:

- Normalize `3+` and numeric `4` to Level `3+`; normalize unknown or low values to Level `1` only where current behavior already falls back.
- Compute `sourceHash` over `scripts/templates/compose.sh`, `scripts/wrap-all-templates.*` only if still part of generation, resolver version, `templates/core/**`, and `templates/addendum/**`.
- Ensure cache at `${cacheRoot}/${sourceHash}/templates/level_N`.
- Generate into `${cacheRoot}/.tmp-${pid}-${sourceHash}/templates`, verify required files and golden parity, then atomically promote to `${cacheRoot}/${sourceHash}`.
- Return a file path by default; optionally return content for validators that already read strings.
- Use an in-process `Map<string, Promise<ResolvedTemplate>>` so multiple validators do not generate the same cache concurrently.
- Use a file lock or atomic `mkdir` lock for cross-process cache generation.
- If cache generation or parity verification fails and `allowCheckedInFallback` is true, return checked-in `templates/level_N/name`. If strict mode is true, fail closed.

## Shell API

Shell should call the resolver once per level, not once per file.

```bash
ensure_template_level_dir() {
  local level="$1"
  node "$SPECKIT_ROOT/scripts/templates/resolve-template.mjs" \
    --level "$level" \
    --name "." \
    --format path
}

get_template_path() {
  local level="$1"
  local name="$2"
  node "$SPECKIT_ROOT/scripts/templates/resolve-template.mjs" \
    --level "$level" \
    --name "$name" \
    --format path
}
```

`create.sh` should use `ensure_template_level_dir "$level"` before loops. `copy_template` can continue to copy a path, but its fallback behavior must change:

- Canonical level docs missing from the generated/cache dir should be hard errors.
- Root cross-cutting templates may still fall back to `templates/<name>` when explicitly allowed.
- Silent `touch "$dest_path"` for missing canonical docs should be removed or limited to noncanonical optional files.

## Cache Location

Default:

```text
${SPECKIT_TEMPLATE_CACHE_DIR:-${TMPDIR:-/tmp}/speckit-template-cache}/${sourceHash}/templates/level_N
```

Reasoning:

- Keeps generated artifacts out of the repo by default.
- Avoids dirty working trees during `create.sh`.
- Preserves a `templates/level_N/file.md` relative layout inside the cache, which keeps frontmatter title suffixes stable if `compose.sh` accepts an output template root.

# Questions Answered

Q3: The primary implementation choice remains "extend `compose.sh` first." The new reason is stronger: the exact byte drift is mostly frontmatter and assembly normalization, not a need for a new renderer. A TS rewrite before parity would clone current shell quirks and probably add another drift source.

Q5: Backward compatibility should preserve checked-in `level_N/` as fallback until parity is proven. Existing spec folders are already copied artifacts, so they do not depend on future template storage. The risky compatibility part is parser tolerance: old generated templates and old spec folders may contain `_memory.continuity` frontmatter. The resolver and template pipeline should keep producing or tolerating that legacy block until a separate migration removes it intentionally.

Q6: Hash determinism is not enough. The hash cache must include a golden parity check against all 21 runtime docs before it can replace checked-in paths.

Q8: Updated risk register:

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Generator drift | High | High | Golden byte-equivalence tests for all 21 runtime docs before consumer migration. |
| Silent empty files | High | Medium | Make canonical template misses hard errors in `copy_template`; restrict empty-file fallback. |
| Cache invalidation bugs | Medium | Medium | Source hash over composer, resolver, core, addendum, and wrapper if used; atomic generation. |
| Path-contract breakage | High | Medium | Resolver returns paths with `templates/level_N` relative layout; checked-in fallback stays during migration. |
| Legacy continuity mismatch | Medium | High | Composer injects exact legacy `_memory.continuity`; parsers continue tolerating old blocks. |
| Wrapper over-anchoring | Medium | High | Do not run wrapper in parity cache until it understands open anchor spans. |

Q10: Refactor ordering:

1. Phase 1 - Byte-equivalence repair: add composer continuity injection, dynamic spec anchor fixes, metadata parity map, decision-record source metadata repair, and all-doc golden diff tests.
2. Phase 2 - Resolver API: add TS resolver plus shell wrapper, hash cache, atomic generation, strict required-file validation, and checked-in fallback.
3. Phase 3 - Consumer migration: migrate `template-utils.sh`, `create.sh`, `template-structure.js`, staleness checks, validators, and tests to resolver reads.
4. Phase 4 - Optional deletion: delete checked-in `level_N` runtime docs only after CI proves generated parity and one compatibility period has passed. Keep or separately generate level READMEs.

# Questions Remaining

- Q1: Full elimination remains blocked. Current recommendation is PARTIAL until byte-equivalence repair and resolver migration land.
- Q2: Minimum source-of-truth set is nearly clear: `core/`, `addendum/`, `compose.sh`, resolver/cache code, and maybe generated README docs. It still needs a precise policy for the four level READMEs.
- Q4: Validator migration needs a concrete file-by-file migration map after the resolver module exists.
- Q7: Per-level hot-path performance after resolver caching still needs measurement. Iteration 3 measured raw per-level compose at 0.07s to 0.15s, but resolver startup and lock overhead are still unknown.
- Q9: Recommendation remains PARTIAL, not CONSOLIDATE.

# Next Focus

Consumer migration map and parity test design: identify every caller that currently reads `templates/level_N` directly, classify whether it needs path or content resolution, and define the golden test suite that gates Phase 1.
