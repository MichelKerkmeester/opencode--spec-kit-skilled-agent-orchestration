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

