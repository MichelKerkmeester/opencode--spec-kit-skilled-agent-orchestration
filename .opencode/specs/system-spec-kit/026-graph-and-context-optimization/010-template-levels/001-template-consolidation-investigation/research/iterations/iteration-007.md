# Focus

Resolver API contract finalization and performance budget closure.

This iteration closes Q3 and Q7. The final generator implementation pick is: extend `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` and add a thin resolver wrapper. Do not rewrite the composer in TypeScript and do not introduce a JSON-driven generator for Phase 1-3.

# Actions Taken

1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-006.md` first and carried forward the Phase 1 punch list and 868-folder compatibility count.
2. Read the deep-research quick reference to preserve the LEAF iteration contract.
3. Re-read the iteration 5 consumer map and inspected active call sites in:
   - `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh`
   - `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
   - `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
   - `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh`
   - `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
4. Re-timed `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` in `/tmp/template-experiment/`.
5. Benchmarked shell resolver-style reads from `/tmp/template-experiment/templates/level_3/spec.md`.

# Q3 Final Generator Pick

Use `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` as the generator and add a thin resolver wrapper around its rendered output/cache. The composer already encodes the ANCHOR merge semantics, level addendum order, and shell portability constraints; replacing it with a TypeScript or JSON-driven implementation would duplicate those rules before parity is proven. A JSON manifest is still useful as level metadata, but not as the generator engine: the level rules are four simple manifests and the hard part is byte-equivalent rendering, not declarative configuration.

Rejected options:

| Option | Reason rejected for this packet |
| --- | --- |
| TypeScript rewrite | Higher migration risk, duplicates existing shell merge semantics, and delays Phase 1 byte-equivalence repair. |
| JSON-driven generator | Adds an abstraction around only four level rules while leaving ANCHOR and legacy frontmatter quirks to custom code anyway. |
| Delete `templates/level_N` immediately | Still blocked by Phase 1 byte parity and Phase 2 resolver path/content parity. |

# Resolver API Contract

The resolver is a read API over generated or checked-in rendered templates. It must not recompose on every `create.sh` copy. Its hot path is: validate level/name, check cache metadata, return path or content from a `templates/level_N`-shaped cache.

```ts
export type TemplateLevel = '1' | '2' | '3' | '3+' | 1 | 2 | 3 | 4;

export type TemplateFormat = 'content' | 'path' | 'metadata';

export interface ResolveTemplateOptions {
  /**
   * Root containing core/, addendum/, and optionally rendered level_N dirs.
   * Default: .opencode/skill/system-spec-kit/templates resolved from the package root.
   */
  templatesRoot?: string;

  /**
   * Generated rendered-output root. Must preserve level_1, level_2, level_3,
   * and level_3+ directory names for backward-compatible diagnostics.
   * Default: an internal cache root under the system-spec-kit package cache.
   */
  cacheRoot?: string;

  /**
   * Return shape. `content` reads the template body, `path` returns a file path,
   * and `metadata` returns provenance without reading the full body unless needed
   * for hash validation.
   */
  format?: TemplateFormat;

  /**
   * When true, bypass cache metadata and force recomposition before resolving.
   * Used by parity tests and explicit maintenance commands, not create.sh.
   */
  forceRecompose?: boolean;

  /**
   * Validate source and cache hashes. Off by default on create.sh hot paths;
   * enabled in parity tests, verify mode, and cache rebuild diagnostics.
   */
  verifyHash?: boolean;

  /**
   * Allow checked-in templates/level_N fallback when generated cache is missing.
   * Phase 2 default: true. Phase 3 strict mode: false in CI.
   */
  allowCheckedInFallback?: boolean;

  /**
   * Explicit cache purge before resolving. Equivalent to deleting resolver-owned
   * cache metadata and rendered files for the requested level/template.
   */
  purge?: boolean;
}

export interface ResolvedTemplate {
  level: '1' | '2' | '3' | '3+';
  templateName: string;
  path: string;
  content?: string;
  source: 'generated-cache' | 'checked-in-rendered';
  sourceRoot: string;
  cacheRoot: string;
  mtimeMs: number;
  sha256?: string;
  templateSource: string | null;
  generatedAt?: string;
}

/**
 * Resolve a composed Spec Kit template by documentation level and basename.
 *
 * Error semantics:
 * - Throws TemplateLevelError when `level` is not 1, 2, 3, 3+, or 4.
 * - Throws TemplateNotFoundError when `templateName` is not available for the
 *   normalized level and no allowed fallback contains it.
 * - Throws TemplateSourceMalformedError when required source fragments or
 *   generated cache metadata are malformed enough that byte-equivalent output
 *   cannot be trusted.
 * - Throws TemplateCacheError when cache generation fails or the cache path
 *   escapes the resolver-owned root.
 *
 * Caching:
 * - Single-process callers use an in-memory LRU keyed by
 *   `${templatesRoot}:${cacheRoot}:${normalizedLevel}:${templateName}:${format}`.
 * - Warm hits still perform a cheap file mtime check unless `forceRecompose`
 *   or `purge` is set.
 * - Cold misses compute the generated cache if missing/stale, then read path,
 *   content, or metadata according to `format`.
 *
 * Invalidation:
 * - Recompose when any source fragment mtime is newer than cache metadata.
 * - Recompose or throw when `verifyHash` detects a source/cache hash mismatch.
 * - Recompose when `forceRecompose` is true.
 * - Purge resolver-owned cache entries when `purge` is true.
 *
 * Thread safety:
 * - No cross-process lock is required for Phase 2. The resolver is used by
 *   short-lived CLI/script processes, and a single-process mtime check is enough.
 * - Cache writes should be atomic by writing to a temp file and renaming into
 *   place, but lock contention is out of scope until concurrent writers exist.
 */
export async function resolveTemplate(
  level: TemplateLevel,
  templateName: string,
  options?: ResolveTemplateOptions,
): Promise<ResolvedTemplate>;

export async function getTemplate(
  level: TemplateLevel,
  templateName: string,
  options?: Omit<ResolveTemplateOptions, 'format'>,
): Promise<string>;

export async function getTemplatePath(
  level: TemplateLevel,
  templateName: string,
  options?: Omit<ResolveTemplateOptions, 'format'>,
): Promise<string>;

export async function ensureTemplateLevelDir(
  level: TemplateLevel,
  options?: Omit<ResolveTemplateOptions, 'format'>,
): Promise<string>;

export function purgeTemplateResolverCache(options?: {
  templatesRoot?: string;
  cacheRoot?: string;
  level?: TemplateLevel;
  templateName?: string;
}): Promise<void>;
```

## Shell Wrapper Signature

The shell wrapper must be cheap enough for `create.sh`. The preferred path is to resolve one level directory and keep the existing copy loop. `get_template` is available for one-off content consumers and docs, but `create.sh` should not invoke a Node process once per file.

```bash
# Source:
# .opencode/skill/system-spec-kit/scripts/lib/template-resolver.sh

# Prints a level_N-shaped directory containing rendered templates.
# Usage: dir="$(ensure_template_level_dir "3" "$TEMPLATES_BASE")"
ensure_template_level_dir() {
    local level="$1"
    local templates_base="${2:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"
    local cache_root="${SPECKIT_TEMPLATE_CACHE_ROOT:-}"
}

# Prints the resolved path for one template.
# Usage: path="$(get_template_path "3" "spec.md")"
get_template_path() {
    local level="$1"
    local template_name="$2"
    local templates_base="${3:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"
}

# Prints template content to stdout.
# Usage: get_template "3" "spec.md" > "$FEATURE_DIR/spec.md"
get_template() {
    local level="$1"
    local template_name="$2"
    local templates_base="${3:-$REPO_ROOT/.opencode/skill/system-spec-kit/templates}"
    local path
    path="$(get_template_path "$level" "$template_name" "$templates_base")" || return $?
    cat "$path"
}

# Consumer-facing migration helper preserving the old copy_template call shape.
# Usage: copy_template "spec.md" "$FEATURE_DIR" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE"
copy_template() {
    local template_name="$1"
    local dest_dir="$2"
    local level_templates_dir="$3"
    local base_templates_dir="$4"
    local dest_name="${5:-$template_name}"
    local dest_path="$dest_dir/$dest_name"

    local template_path="$level_templates_dir/$template_name"
    if [[ ! -f "$template_path" ]]; then
        template_path="$(get_template_path "${DOC_LEVEL:-1}" "$template_name" "$base_templates_dir")" || return $?
    fi

    cp "$template_path" "$dest_path"
    printf '%s\n' "$dest_name"
}
```

Shell error semantics:

| Condition | Exit | Stderr |
| --- | ---: | --- |
| Invalid level | 64 | `speckit-template: invalid level: <level>` |
| Template missing for level | 66 | `speckit-template: template not found: <level>/<templateName>` |
| Malformed source/cache | 65 | `speckit-template: malformed template source: <path>` |
| Cache generation failure | 70 | `speckit-template: cache generation failed: <reason>` |

# Exact Consumer Migration Map

These are function-by-function migrations from the iteration 5 consumer map. Phase 2 migrates runtime helpers first; Phase 3 migrates YAML and agent docs after the shell/TS resolver exists.

## 1. `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh::get_level_templates_dir`

Before:

```diff
 get_level_templates_dir() {
     local level="$1"
     local base_dir="$2"
     case "$level" in
-        1) printf '%s\n' "$base_dir/level_1" ;;
-        2) printf '%s\n' "$base_dir/level_2" ;;
-        3) printf '%s\n' "$base_dir/level_3" ;;
-        "3+"|4) printf '%s\n' "$base_dir/level_3+" ;;
-        *) printf '%s\n' "$base_dir/level_1" ;;
+        *) ensure_template_level_dir "$level" "$base_dir" ;;
     esac
 }
```

After:

```bash
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    ensure_template_level_dir "$level" "$base_dir"
}
```

## 2. `.opencode/skill/system-spec-kit/scripts/lib/template-utils.sh::copy_template`

Before:

```bash
template_path="$level_templates_dir/$template_name"
if [[ ! -f "$template_path" ]]; then
    template_path="$base_templates_dir/$template_name"
fi

if [[ -f "$template_path" ]]; then
    cp "$template_path" "$dest_path"
    printf '%s\n' "$dest_name"
else
    touch "$dest_path"
    printf '%s\n' "$dest_name (empty - template not found)"
fi
```

After:

```bash
template_path="$level_templates_dir/$template_name"
if [[ ! -f "$template_path" ]]; then
    template_path="$(get_template_path "${DOC_LEVEL:-1}" "$template_name" "$base_templates_dir")" || return $?
fi

cp "$template_path" "$dest_path"
printf '%s\n' "$dest_name"
```

Canonical docs become hard errors when missing. Fallback remains only for explicit cross-cutting templates such as `.opencode/skill/system-spec-kit/templates/resource-map.md`.

## 3. `.opencode/skill/system-spec-kit/scripts/spec/create.sh` subfolder mode

Before:

```bash
TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")
CREATED_FILES=()

for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
    if [[ -f "$template_file" ]]; then
        template_name=$(basename "$template_file")
        CREATED_FILES+=("$(copy_template "$template_name" "$SUBFOLDER_PATH" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
    fi
done
```

After:

```bash
TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"
DOC_LEVEL_NUM="${DOC_LEVEL/+/}"
LEVEL_TEMPLATES_DIR="$(ensure_template_level_dir "$DOC_LEVEL" "$TEMPLATES_BASE")"
CREATED_FILES=()

for template_file in "$LEVEL_TEMPLATES_DIR"/*.md; do
    if [[ -f "$template_file" ]]; then
        template_name=$(basename "$template_file")
        CREATED_FILES+=("$(copy_template "$template_name" "$SUBFOLDER_PATH" "$LEVEL_TEMPLATES_DIR" "$TEMPLATES_BASE")")
    fi
done
```

## 4. `.opencode/skill/system-spec-kit/scripts/spec/create.sh` main folder mode

Before:

```bash
LEVEL_TEMPLATES_DIR=$(get_level_templates_dir "$DOC_LEVEL" "$TEMPLATES_BASE")

if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
    >&2 echo "[speckit] Warning: Level folder not found at $LEVEL_TEMPLATES_DIR, using base templates"
    LEVEL_TEMPLATES_DIR="$TEMPLATES_BASE"
fi
```

After:

```bash
LEVEL_TEMPLATES_DIR="$(ensure_template_level_dir "$DOC_LEVEL" "$TEMPLATES_BASE")"

if [[ ! -d "$LEVEL_TEMPLATES_DIR" ]]; then
    echo "Error: resolved template level directory missing: $LEVEL_TEMPLATES_DIR" >&2
    exit 70
fi
```

## 5. `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js::resolveTemplatePath`

Before:

```js
function resolveTemplatePath(level, basename, templatesRoot = getTemplatesRoot()) {
  const normalizedLevel = normalizeLevel(level);
  const levelMap = TEMPLATE_PATHS[normalizedLevel] || TEMPLATE_PATHS['1'];
  const relativeTemplatePath = levelMap[basename];

  if (!relativeTemplatePath) {
    return null;
  }

  return path.join(templatesRoot, relativeTemplatePath);
}
```

After:

```js
async function resolveTemplatePath(level, basename, templatesRoot = getTemplatesRoot()) {
  try {
    const resolved = await getTemplatePath(level, basename, { templatesRoot });
    return resolved;
  } catch (error) {
    if (error?.name === 'TemplateNotFoundError') return null;
    throw error;
  }
}
```

## 6. `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js` content readers

Before:

```js
const templatePath = resolveTemplatePath(level, basename, templatesRoot);
const templateContent = fs.readFileSync(templatePath, 'utf8');
```

After:

```js
const templateContent = await getTemplate(level, basename, { templatesRoot });
```

The validator contract keeps the same header and anchor arrays; only the source of the content changes.

## 7. `.opencode/skill/system-spec-kit/scripts/spec/check-template-staleness.sh::get_current_template_version`

Before:

```bash
local template_spec="$TEMPLATE_DIR/level_1/spec.md"
```

After:

```bash
local template_spec
template_spec="$(get_template_path "1" "spec.md" "$TEMPLATE_DIR")" || {
    echo "unknown"
    return
}
```

## 8. `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`

Before:

```yaml
level_3:
  tasks: .opencode/skill/system-spec-kit/templates/level_3/tasks.md
  checklist: .opencode/skill/system-spec-kit/templates/level_3/checklist.md
  implementation_summary: .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md
```

After:

```yaml
level_3:
  tasks: "get_template_path 3 tasks.md"
  checklist: "get_template_path 3 checklist.md"
  implementation_summary: "get_template_path 3 implementation-summary.md"
```

## 9. `.opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts`

Before:

```ts
expect(resolveTemplatePath('3', 'spec.md')).toContain('templates/level_3/spec.md');
```

After:

```ts
const resolved = await resolveTemplate('3', 'spec.md', { format: 'metadata' });
expect(resolved.path).toContain('templates/level_3/spec.md');
expect(resolved.source).toMatch(/generated-cache|checked-in-rendered/);
```

# Performance Budget Closure

## Bench Results

Bench commands ran in `/tmp/template-experiment/` against a copied template tree.

| Probe | Result | Interpretation |
| --- | ---: | --- |
| `bash scripts/templates/compose.sh` run 1 | 0.43s real | Full all-level recomposition. |
| `bash scripts/templates/compose.sh` run 2 | 0.43s real | Stable repeat. |
| `bash scripts/templates/compose.sh` run 3 | 0.43s real | Stable repeat. |
| `cp templates/level_3/*.md <dest>/` | 0.00s by `time -p` | Shell timer resolution too coarse for six files. |
| `cat templates/level_3/spec.md` looped 1000x | 1.70s total | About 1.7ms per shell content read. |
| `test -f` + `cat` looped 1000x | 1.70s total | About 1.7ms per shell mtime/existence plus content read. |
| `shasum -a 256` looped 200x | 2.00s total | About 10ms per shell hash; keep off create.sh hot path. |
| Node in-process purge + stat + read + sha256 looped 200x | 0.019ms per call | In-process cold-ish resolver after OS cache is warm. |
| Node in-process warm stat + mtime hit looped 20000x | 0.002ms per call | LRU hit overhead is negligible. |

The practical budget should use conservative shell numbers, not the best Node in-process microbenchmark. A one-file `get_template` shell read is about 1.7ms from warm filesystem cache. A level directory resolve plus current copy loop should be lower than per-file `get_template` because it resolves once and lets `cp` copy all files.

## NFR-P01: Under 500ms

NFR-P01 holds if `create.sh` does not run full recomposition on every spec creation.

| Path | Budget |
| --- | ---: |
| Current Level 3 copy loop | Less than 10ms practical; `time -p` rounds six-file copy to 0.00s. |
| Warm resolver, directory mode | 1-5ms for level validation, cache metadata mtime check, and returning a directory path. |
| Warm resolver, per-file content mode worst case for six Level 3 docs | About 10.2ms from shell `test -f` + `cat` loop. |
| Full compose cache rebuild | 430ms measured. |
| Cold cache create with compose rebuild plus directory resolve/copy | About 435-450ms. |
| Warm cache create with directory resolve/copy | About 5-15ms. |

Conclusion: `<500ms` is credible for both warm cache and cold cache under current measurements. The condition is strict: the shell wrapper must resolve a generated level directory once in `create.sh`; it must not spawn Node once per template and must not run `compose.sh` once per file.

# Updated Answers

Q3: Finalized. Extend `.opencode/skill/system-spec-kit/scripts/templates/compose.sh` and add a thin resolver wrapper. Do not rewrite in TypeScript and do not make JSON the generator engine.

Q7: Finalized. Full compose is 430ms in `/tmp/template-experiment/`; warm resolver overhead is effectively single-digit milliseconds in the shell design. NFR-P01 remains under 500ms if cache rebuild is at most once per create operation and the hot path uses directory resolution.

Q9: Recommendation remains PARTIAL. Consolidate source-of-truth and resolver access, but defer deleting checked-in `templates/level_N` until Phase 4 parity gates are stable.

# Findings Emitted

The per-iteration delta file contains:

- `f-iter007-001`: Q3 generator pick finalized as compose.sh plus thin resolver.
- `f-iter007-002`: Resolver API contract finalized with path/content/metadata modes.
- `f-iter007-003`: Shell contract should resolve one level dir for create.sh.
- `f-iter007-004`: NFR-P01 remains below 500ms with measured 430ms compose and low resolver overhead.
- `f-iter007-005`: Per-file shell hash checks do not belong on the create.sh hot path.
- `f-iter007-006`: Consumer migration sequence is runtime helpers, validators, command YAMLs, docs.

# Next Iteration Prep

Iteration 8 should turn the stable PARTIAL recommendation into the synthesis outline: Phase 1 byte parity, Phase 2 resolver introduction, Phase 3 consumer migration, Phase 4 optional deletion. Iterations 9-10 can focus on final risk language and exact file/LOC deltas.
