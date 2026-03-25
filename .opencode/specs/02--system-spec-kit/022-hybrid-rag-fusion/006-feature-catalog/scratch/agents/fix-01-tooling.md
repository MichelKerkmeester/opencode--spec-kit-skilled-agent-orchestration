● skill(system-spec-kit)

● skill(sk-doc)

I’m verifying the current reality behind each requested correction first, then I’ll patch the five catalog files and validate the edits.

● Read 17-json-primary-deprecation-posture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
  │ ion-posture.md
  └ 96 lines read

● Read 05-code-standards-alignment.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignm
  │ ent.md
  └ 125 lines read

● Read 11-feature-catalog-code-references.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
  │ references.md
  └ 56 lines read

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ 1 line read

● Read 18-template-compliance-contract-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-c
  │ ontract-enforcement.md
  └ 61 lines read

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 142 lines read

● Search (grep)
  │ "AI-WHY|AI-TRACE|AI-GUARD" in *.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Search (grep)
  │ "// Feature catalog:" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (grep)
  │ "retry|attempt" in *.md (.opencode/agent)
  └ 5 lines found

● Count non-test TS files (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && total=$(find . -type f -name '*.ts' !
  │ -path './tests/*' ! -path './dist/*' | wc -l | tr -d ' ') && echo "$total"
  └ 2 lines...

● Run skill advisor (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .opencode/skill/scripts/skill_advisor.py "Fix five feature catalog documentation inaccuracies
  │ under .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/ about positional
  │ JSON input support, AI-intent comment coverage, feature-catalog comment coverage, save-path
  │ posture, and template validation retry loop." --threshold 0.8
  └ 43 lines...

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/870cc05f-047f-4906-83fa-1a01b16d0fa3/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

I found the first mismatches: AI-intent comment counts are stale, and the JSON save-path docs overclaim exclusivity. I’m tightening the evidence now so the edits match the live code exactly.

✗ Search (grep)
  │ "--stdin|--json|data file|positional|argv|process\.argv|loadCollectedData|JSON file path"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ rg: unrecognized flag --stdin|--json|data
    file|positional|argv|process\.argv|loadCollectedData|JSON file path

● Search (grep)
  │ "sole|only path|only paths|--stdin|--json|positional|JSON-only|sole save contract"
  │ (.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pi
  │ peline-quality.md)
  └ 79 lines found

● Search (grep)
  │ "AI-intent|AI-WHY|AI-TRACE|AI-GUARD|26|purposeful comment|MODULE" (.opencode/skill/system-spec-k
  │ it/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md)
  └ 44 lines found

● Search (grep)
  │ "validate\.sh --strict|attempt|retry|fix loop|post-write validation" in **/speckit*.md
  │ (.opencode/agent)
  └ 71 lines found

● Search (grep)
  │ "validate\.sh --strict|attempt|retry|fix loop|post-write validation" in **/speckit*.md
  │ (.claude/agents)
  └ 35 lines found

● Search (grep)
  │ "validate\.sh --strict|attempt|retry|fix loop|post-write validation" in **/speckit*.md
  │ (.gemini/agents)
  └ 11 lines found

● Search (grep)
  │ "validate\.sh --strict|attempt|retry|fix loop|post-write validation" in **/speckit*.toml
  │ (.codex/agents)
  └ 41 lines found

● Count mcp_server coverage (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit/mcp_server')
  │ files = [p for p in root.rglob('*.ts') if 'node_modules' not in p.parts and 'dist' not in
  │ p.parts and 'tests' not in p.parts and not …
  └ 12 lines...

● Count feature catalog coverage (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('.opencode/skill/system-spec-kit')
  │ files = [p for p in root.rglob('*.ts') if 'node_modules' not in p.parts and 'dist' not in
  │ p.parts and 'tests' not in p.parts and not …
  └ 15 lines...

One of the requested fixes doesn’t fully match the repo: the `speckit` agent files still document a three-attempt repair loop. I’m adjusting that entry carefully so it stops sounding validator-enforced or automatic, while still staying truthful to the live agent definitions.

● Read 12-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
  │ eline-quality.md
  └ L1:220 (220 lines read)

● Search (grep)
  │ "\-\-stdin|\-\-json|JSON file path|dataFile|process\.argv|specFolderArg"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 5 lines found

● Count by TS source area (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('.opencode/skill/system-spec-kit')
  │ for name in ['mcp_server','shared','scripts']:
  │ root = base / name…
  └ 10 lines...

I’ve pinned down the coverage numbers now: the `192/280` figure holds for non-test `.ts` files in `mcp_server/` plus `shared/`, not for the entire skill tree. I’m patching the docs to say exactly that and cleaning up the stale JSON-only wording next.

● Search (grep)
  │ "Direct positional|sole save contract|JSON-only|only save path|only save paths|only save
  │ contract|direct positional saves" (.opencode/skill/system-spec-kit/feature_catalog/16--tooling-a
  │ nd-scripts/17-json-primary-deprecation-posture.md)
  └ 49 lines found

● Search (grep)
  │ "dataFile|loadCollectedData\(|argv|specFolderArg|jsonPayload|stdinPayload"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 5 lines found

● Search (grep)
  │ "191|257|74%|universal|69%|192|280" (.opencode/skill/system-spec-kit/feature_catalog/16--tooling
  │ -and-scripts/11-feature-catalog-code-references.md)
  └ 5 lines found

The remaining question is just how to phrase the JSON save behavior precisely. I’m reading the CLI authority code and test coverage now so the wording reflects “preferred” versus “still supported” instead of hand-waving.

● Read generate-context-cli-authority.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
  └ 269 lines read

● Search (grep)
  │ "stdin|jsonPayload|dataFile|loadCollectedData\(|specFolderArg|argv"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 5 lines found

● Read copilot-tool-output-1774461639813-7t1d2j.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774461639813-7t1d2j.txt
  └ L1:160 (128 lines read)

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-dep
  │ recation-posture.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-a
  │ lignment.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-
  │ code-references.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturin
  │ g-pipeline-quality.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-complia
    nce-contract-enforcement.md

The edits are in. I’m doing a last pass to catch any stale wording or formatting issues before I show you the diffs.

● Search (grep)
  │ "sole save contract|JSON-only save contract|only save path|only save paths|positional
  │ rejection|26 AI-intent|191` of `257|74%" in
  │ {05-code-standards-alignment,11-feature-catalog-code-references,12-session-capturing-pipeline-qu
  │ ality,17-json-primary-deprecation-posture,18-template-compliance-contract-enforcement}.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts)
  └ No matches found

● Check diff formatting (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && git --no-pager diff
  │ --check -- .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-pri
  │ mary-deprecation-posture.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-sc
  │ ripts/05-code-standards-alignment.md .opencode/skill/system-spec-kit/feature_catalog/16--tooli
  │ ng-and-scripts/11-feature-catalog-code-references.md .opencode/skill/system-spec-kit/feature_c…
  └ 4 lines...

● Verify frontmatter fences (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3 - <<'PY'
  │ from pathlib import Path
  │ paths = [
  │ Path('.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-prim
  │ ary-deprecation-posture.md'),…
  └ 17 lines...

● Run doc validator (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .agents/skills/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/feature_cat
  │ alog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md >/tmp/validate-17.txt 2>&1
  │ && python3 .agents/skills/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit
  │ /feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md >/tmp/validate-05.txt …
  └ 9 lines...

The repository checks passed, but the doc validator complained, so I’m reading those validator outputs before I wrap.

● Show validator outputs (shell)
  │ for f in /tmp/validate-17.txt /tmp/validate-05.txt /tmp/validate-11.txt /tmp/validate-12.txt
  │ /tmp/validate-18.txt; do echo "=== $f ==="; cat "$f"; echo; done
  └ 25 lines...

● Show git diff (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && git --no-pager diff --
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprec
  │ ation-posture.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-co
  │ de-standards-alignment.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scri
  │ pts/11-feature-catalog-code-references.md .opencode/skill/system-spec-kit/feature_catalog/16--…
  └ 3 lines...

The validator issue is structural, not factual: some of these catalog entries are missing the repo’s expected `TABLE OF CONTENTS` block. I’m checking all five individually and will patch only the ones that actually fail.

● Validate each changed doc (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && for f in
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprec
  │ ation-posture.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-co
  │ de-standards-alignment.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scri
  │ pts/11-feature-catalog-code-references.md .opencode/skill/system-spec-kit/feature_catalog/16--…
  └ 46 lines...

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-a
  │ lignment.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-
  │ code-references.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-complia
    nce-contract-enforcement.md

I fixed the validator-only gaps too. One more validation pass, then I’ll show the diffs file by file.

● Re-run diff check (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && git --no-pager diff
  │ --check -- .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-pri
  │ mary-deprecation-posture.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-sc
  │ ripts/05-code-standards-alignment.md .opencode/skill/system-spec-kit/feature_catalog/16--tooli
  │ ng-and-scripts/11-feature-catalog-code-references.md .opencode/skill/system-spec-kit/feature_c…
  └ 5 lines...

● Re-run doc validator (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && for f in
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprec
  │ ation-posture.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-co
  │ de-standards-alignment.md .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scri
  │ pts/11-feature-catalog-code-references.md .opencode/skill/system-spec-kit/feature_catalog/16--…
  └ 6 lines...

● Show diff 17-json-primary-deprecation-posture.md
  │
  │ [2m1[22m No pending changes.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
    ion-posture.md

● Show diff 05-code-standards-alignment.md
  │
  │  5
  │  6     # Code standards alignment
  │  7
  │  8 +   ## TABLE OF CONTENTS
  │  9 +
  │ 10 +   - [1. OVERVIEW](#1--overview)
  │ 11 +   - [2. CURRENT REALITY](#2--current-reality)
  │ 12 +   - [3. SOURCE EVIDENCE](#3--source-evidence)
  │ 13 +   - [4. VERIFICATION TRACEABILITY](#4--verification-traceability)
  │ 14 +   - [5. SOURCE FILES](#5--source-files)
  │ 15 +   - [6. SOURCE METADATA](#6--source-metadata)
  │ 16 +
  │ 17     ## 1. OVERVIEW
  │ 18
  │ 19    Code standards alignment brought comments, MODULE/COMPONENT headers, import ordering, and
  │       constant naming into line with sk-code--opencode standards.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignm
    ent.md

● Show diff 11-feature-catalog-code-references.md
  │
  │  5
  │  6     # Feature catalog code references
  │  7
  │  8 +   ## TABLE OF CONTENTS
  │  9 +
  │ 10 +   - [1. OVERVIEW](#1--overview)
  │ 11 +   - [2. CURRENT REALITY](#2--current-reality)
  │ 12 +   - [3. SOURCE FILES](#3--source-files)
  │ 13 +   - [4. SOURCE METADATA](#4--source-metadata)
  │ 14 +   - [5. PLAYBOOK COVERAGE](#5--playbook-coverage)
  │ 15 +
  │ 16     ## 1. OVERVIEW
  │ 17
  │ 18    Feature catalog code references embed inline traceability comments in a measured majority
  │       of non-test TypeScript source files, linking implementation code back to the feature
  │       catalog by name. Annotated files declare which catalog features they implement via `//
  │       Feature catalog: <feature-name>` comments near the top of the file.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-
    references.md

● Show diff 12-session-capturing-pipeline-quality.md
  │
  │ [2m1[22m No pending changes.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
    eline-quality.md

● Show diff 18-template-compliance-contract-enforcement.md
  │
  │  5
  │  6     # Template Compliance Contract Enforcement
  │  7
  │  8 +   ## TABLE OF CONTENTS
  │  9 +
  │ 10 +   - [1. OVERVIEW](#1--overview)
  │ 11 +   - [2. CURRENT REALITY](#2--current-reality)
  │ 12 +   - [3. SOURCE FILES](#3--source-files)
  │ 13 +   - [4. SOURCE METADATA](#4--source-metadata)
  │ 14 +
  │ 15     ## 1. OVERVIEW
  │ 16
  │ 17    Template Compliance Contract Enforcement is a 3-layer defense-in-depth system that ensures
  │        all spec folder documents generated by AI agents pass structural validation on first
  │       write.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-c
    ontract-enforcement.md

● Show diff 17-json-primary-deprecation-posture.md
  │
  │ [2m1[22m No pending changes.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
    ion-posture.md

● Show diff 12-session-capturing-pipeline-quality.md
  │
  │ [2m1[22m No pending changes.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
    eline-quality.md

● Show 17-json-primary-deprecation-posture.md
  │
  │ [2m 1[22m ---
  │ [2m 2[22m title: "JSON-primary deprecation posture"
  │ [2m 3[22m description: "Routine saves prefer --json or --stdin structured input, while positional JSON
  │ file input remains supported on the same structured path; operator guidance documents JSON-first
  │  save workflows without claiming positional input was removed."
  │ [2m 4[22m ---
  │ [2m 5[22m
  │ [2m 6[22m # JSON-primary deprecation posture
  │ [2m 7[22m
  │ [2m 8[22m ## TABLE OF CONTENTS
  │ [2m 9[22m
  │ [2m10[22m - [1. OVERVIEW](#1--overview)
  │ [2m11[22m - [2. CURRENT REALITY](#2--current-reality)
  │ [2m12[22m - [3. FEATURE BREAKDOWN](#3--feature-breakdown)
  │ [2m13[22m - [4. SOURCE FILES](#4--source-files)
  │ [2m14[22m - [5. VERIFICATION SOURCES](#5--verification-sources)
  │ [2m15[22m - [6. SOURCE METADATA](#6--source-metadata)
  │ [2m16[22m
  │ [2m17[22m ## 1. OVERVIEW
  │ [2m18[22m
  │ [2m19[22m Phase 017 established the JSON-primary deprecation posture for `generate-context.js`.
  │ Runtime-derived capture for routine saves proved unreliable: wrong-session selection,
  │ contamination, and thin-evidence failures persisted across multiple research and fix rounds. The
  │  resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract,
  │ while positional JSON file input remains functional on the same structured-input path.
  │ [2m20[22m
  │ [2m21[22m The obsolete follow-up phases now live in the archived branch for this workstream.
  │ [2m22[22m
  │ [2m23[22m ---
  │ [2m24[22m
  │ [2m25[22m ## 2. CURRENT REALITY
  │ [2m26[22m
  │ [2m27[22m The shipped posture enforces the following behavior:
  │ [2m28[22m
  │ [2m29[22m 1. Positional JSON file input remains supported and routes through the same structured loader
  │  path as other file-backed saves.
  │ [2m30[22m 2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented
  │  and preferred routine-save paths for AI-composed structured input.
  │ [2m31[22m 3. Operator-facing guidance in SKILL.md and the save command documents JSON mode as the
  │ preferred routine-save contract, not an exclusive removal of positional file input.
  │ [2m32[22m 4. The obsolete follow-up phases (001-session-source-validation,
  │ 002-outsourced-agent-handback, 003-multi-cli-parity) are archived under the retired branch for
  │ this workstream.
  │ [2m33[22m
  │ [2m34[22m ---
  │ [2m35[22m
  │ [2m36[22m ## 3. FEATURE BREAKDOWN
  │ [2m37[22m
  │ [2m38[22m ### 3.1 JSON-primary preference
  │ [2m39[22m
  │ [2m40[22m - Direct positional mode using a JSON file path still works and routes through
  │ `loadCollectedData()`.
  │ [2m41[22m - The removed behavior is routine runtime-derived capture, not structured file-backed JSON
  │ input.
  │ [2m42[22m
  │ [2m43[22m ### 3.2 Structured JSON as primary contract
  │ [2m44[22m
  │ [2m45[22m - `--json '<inline-json>'` accepts structured session data as a CLI argument.
  │ [2m46[22m - `--stdin` reads structured JSON from standard input.
  │ [2m47[22m - File-backed JSON (path as first argument) remains on the same structured path.
  │ [2m48[22m - Explicit CLI target still outranks payload `specFolder` in structured-input modes.
  │ [2m49[22m
  │ [2m50[22m ### 3.3 Operator guidance updates
  │ [2m51[22m
  │ [2m52[22m - SKILL.md updated to describe `--json` / `--stdin` as the preferred routine-save contract.
  │ [2m53[22m - The save command (`/memory:save`) updated to document the JSON-primary posture.
  │ [2m54[22m - CLAUDE.md and equivalent agent instructions updated to emphasize structured JSON capture
  │ without claiming positional file input was removed.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecat
    ion-posture.md

● Show 12-session-capturing-pipeline-quality.md
  │
  │ [2m52[22m 19. Rendered memory files preserve `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` comments
  │ through post-render cleanup while still stripping non-anchor workflow comments.
  │ [2m53[22m 20. Frontmatter `trigger_phrases` now render the same session-specific values as the trailing
  │  metadata block and fall back to `[]` instead of generic placeholders.
  │ [2m54[22m 21. Explicit JSON mode accepts the documented snake_case save contract as well as the
  │ existing camelCase fields.
  │ [2m55[22m 22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js
  │ --json <string>` as the preferred AI-composed save paths.
  │ [2m56[22m 22a. Positional JSON file input remains supported and routes through the same structured
  │ loader path.
  │ [2m57[22m 24. The structured JSON contract explicitly preserves summary fields such as `toolCalls` and
  │ `exchanges`, while older payloads that omit them remain backward compatible.
  │ [2m58[22m 25. File-backed JSON remains on the authoritative structured path and does not reopen the
  │ abandoned runtime-derived enrichment branch.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
    eline-quality.md

● Show 12-session-capturing-pipeline-quality.md
  │
  │ [2m94[22m ### 3.1 JSON-mode authority
  │ [2m95[22m
  │ [2m96[22m - `--stdin` and `--json` are the preferred save paths for AI-composed input. Positional JSON
  │ file input remains supported on the same structured path.
  │ [2m97[22m - JSON-mode accepts the documented snake_case fields such as `user_prompts`,
  │ `recent_context`, and `trigger_phrases` in addition to the existing camelCase keys.
  │ [2m98[22m - Structured JSON summaries also preserve shipped fields such as `toolCalls` and `exchanges`.
  │ [2m99[22m - File-backed JSON remains on the structured path and does not fall back into hybrid
  │ reconstruction.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
    eline-quality.md

● Show 12-session-capturing-pipeline-quality.md
  │
  │ [2m148[22m
  │ [2m149[22m ### 3.10 Operator expectations
  │ [2m150[22m
  │ [2m151[22m - `--stdin` / `--json` is the preferred save path for routine structured saves. Positional
  │ JSON file input remains supported, and there is no transcript fallback.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pip
    eline-quality.md

✗ Memory stored memory save
  └ generate-context still supports positional JSON file input alongside --json and …

Done. I fixed the five catalog entries and showed the changed snippets/diffs above.

Changes:
- `17-json-primary-deprecation-posture.md` and `12-session-capturing-pipeline-quality.md` now say `--json` / `--stdin` are preferred, while positional JSON file input still works on the same structured path.
- `05-code-standards-alignment.md` removes the stale `26 AI-intent` claim and reflects the current `MODULE:` + purposeful-comment posture.
- `11-feature-catalog-code-references.md` now reports ~69% coverage: `192/280` non-test `.ts` files in `mcp_server/` + `shared/`.
- `18-template-compliance-contract-enforcement.md` now describes post-write validation as violation flagging plus targeted fixes, without framing it as a validator-managed automatic loop.

Validation passed: `validate_document.py` for all five files, plus `git diff --check`.

