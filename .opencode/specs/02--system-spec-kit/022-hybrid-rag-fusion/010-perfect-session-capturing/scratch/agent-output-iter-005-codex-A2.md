OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a29-5d0a-7bb0-a41d-ef8b9e8b393c
--------
user
# Role: Test Analyst (A2) — Iteration 005

## Mission
Comprehensive test coverage assessment across all session-capturing source files.

## Research Question
**Q7 (coverage).** What's the total test coverage for the session-capturing pipeline? What are the critical gaps?

## Files to Examine
Search under `.opencode/skill/system-spec-kit/` for:
- All `*.vitest.ts` files
- All `*.test.ts` files (excluding node_modules)
- Count test cases per source file

Map these source files to their test coverage:
- opencode-capture.ts
- input-normalizer.ts
- workflow.ts
- contamination-filter.ts
- decision-extractor.ts
- file-extractor.ts
- file-writer.ts
- memory-indexer.ts
- quality-scorer.ts
- session-extractor.ts
- collect-session-data.ts
- template-renderer.ts
- source-capabilities.ts
- data-loader.ts

## Deliverable
1. For each source file: Does a corresponding test file exist? How many test cases?
2. Identify source files with ZERO test coverage
3. Identify source files with partial coverage (some functions tested, others not)
4. List the top 10 untested code paths by risk
5. Estimate: What percentage of the "67 remaining items" would be caught by better tests?
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: cocoindex_code starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m going to audit the test surface under `.opencode/skill/system-spec-kit/`, map each of the 14 pipeline source files to existing tests, and then quantify gaps/risk. First I’ll inventory all relevant test files and any local `AGENTS.md` overrides so the assessment stays accurate to repo rules.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
exec
/bin/zsh -lc "sed -n '1,220p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

codex
I’ve confirmed the root guidance file and next I’m running the requested skill-routing check plus a full test-file inventory in the target folder so we can build an evidence-based coverage map.
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Comprehensive test coverage assessment for session-capturing pipeline under .opencode/skill/system-spec-kit" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 695ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !/system-spec-kit(explicit), !intent:memory, !session, !session(multi), !spec"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !opencode, check~, opencode(name), quality, system"
  },
  {
    "skill": "sk-doc",
    "kind": "skill",
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
tool cocoindex_code.search({"query":"session-capturing pipeline source files and tests in system-spec-kit","paths":".opencode/skill/system-spec-kit/**","limit":10})
cocoindex_code.search({"query":"session-capturing pipeline source files and tests in system-spec-kit","paths":".opencode/skill/system-spec-kit/**","limit":10}) failed in 7ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\npaths\n  Input should be a valid list [type=list_type, input_value='.opencode/skill/system-spec-kit/**', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"session-capturing pipeline source files and tests in system-spec-kit","paths":[".opencode/skill/system-spec-kit/**"],"limit":10})
cocoindex_code.search({"query":"session-capturing pipeline source files and tests in system-spec-kit","paths":[".opencode/skill/system-spec-kit/**"],"limit":10}) success in 784ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"opencode-capture.ts","paths":[".opencode/skill/system-spec-kit/**"],"limit":5,"refresh_index":true})
cocoindex_code.search({"query":"opencode-capture.ts","paths":[".opencode/skill/system-spec-kit/**"],"limit":5,"refresh_index":true}) success in 691ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
codex
I ran the mandated skill-routing check and attempted CocoIndex semantic lookup; now I’m switching to exact file inventory via `rg/find` because CocoIndex returned no indexed hits for this subtree. Next step is counting test cases and mapping each target source file to direct test references/imports.
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit -type f \\( -name '*.vitest.ts' -o -name '*.test.ts' \\) -not -path '*/node_modules/*' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "find .opencode/skill/system-spec-kit -type f -name '*.ts' | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 161ms:
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fallback.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-key-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/batch-processor.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
 succeeded in 164ms:
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/core/config.ts
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
.opencode/skill/system-spec-kit/mcp_server/core/index.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/eval.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/index.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/indexing.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/providers.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/search.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/api/storage.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/cli.d.ts
.opencode/skill/system-spec-kit/mcp_server/dist/configs/cognitive.d.ts
exec
/bin/zsh -lc 'for f in opencode-capture.ts input-normalizer.ts workflow.ts contamination-filter.ts decision-extractor.ts file-extractor.ts file-writer.ts memory-indexer.ts quality-scorer.ts session-extractor.ts collect-session-data.ts template-renderer.ts source-capabilities.ts data-loader.ts; do find .opencode/skill/system-spec-kit -type f -name "$f" -not -path '"'*/dist/*' -not -path '*/node_modules/*'; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.48s:
.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
codex
I’ve located all 14 target source files (including two `quality-scorer.ts` variants in `core/` and `extractors/`). I’m now building a source-to-test mapping from actual import references and test names, then I’ll inspect branch-level gaps in the highest-risk files.
exec
/bin/zsh -lc "python3 -c 'import os,re,json; root=\".opencode/skill/system-spec-kit\"; targets={\"opencode-capture.ts\",\"input-normalizer.ts\",\"workflow.ts\",\"contamination-filter.ts\",\"decision-extractor.ts\",\"file-extractor.ts\",\"file-writer.ts\",\"memory-indexer.ts\",\"quality-scorer.ts\",\"session-extractor.ts\",\"collect-session-data.ts\",\"template-renderer.ts\",\"source-capabilities.ts\",\"data-loader.ts\"}; files=[]
for dp,dn,fns in os.walk(root):
  dn[:] = [d for d in dn if d not in {\"node_modules\",\"dist\",\".git\"}]
  for fn in fns: files.append(os.path.join(dp,fn))
tests=[f for f in files if re.search(r\"\\.(vitest|test)\\.ts"'$",f)]
src=[f for f in files if os.path.basename(f) in targets]
def count_cases(txt):
  return len(re.findall(r"'"\\\\b(?:it|test)(?:\\\\.[A-Za-z_]+)*\\\\s*\\\\(\",txt))
meta=[]
for t in tests:
  try: txt=open(t,encoding=\"utf-8\").read()
  except: txt=\"\"
  meta.append((t,os.path.basename(t),txt,count_cases(txt)))
res=[]
for s in sorted(src):
  base=os.path.basename(s); stem=base[:-3]
  mapped=[]
  for t,b,txt,cases in meta:
    name_match=stem in b
    ref_match=(base in txt) or (stem in txt) or (s.lstrip(\"./\") in txt)
    if name_match or ref_match: mapped.append((t,cases))
  uniq={t:c for t,c in mapped}
  res.append({\"source\":s,\"mappedTestCount\":len(uniq),\"testCases\":sum(uniq.values()),\"mappedTests\":sorted(uniq)})
print(json.dumps({\"testFiles\":len(tests),\"sources\":len(src),\"result\":res},indent=2))'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 1.17s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-8QcWa7sf' (errno=Operation not permitted)
Traceback (most recent call last):
  File "<string>", line 13, in <module>
  File "<string>", line 8, in count_cases
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/re.py", line 241, in findall
    return _compile(pattern, flags).findall(string)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/re.py", line 304, in _compile
    p = sre_compile.compile(pattern, flags)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/sre_compile.py", line 764, in compile
    p = sre_parse.parse(p, flags)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/sre_parse.py", line 948, in parse
    p = _parse_sub(source, state, flags & SRE_FLAG_VERBOSE, 0)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/sre_parse.py", line 443, in _parse_sub
    itemsappend(_parse(source, state, verbose, nested + 1,
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/sre_parse.py", line 836, in _parse
    raise source.error("missing ), unterminated subpattern",
re.error: missing ), unterminated subpattern at position 38
exec
/bin/zsh -lc "rg -l -g '*.vitest.ts' -g '*.test.ts' -g '"'!**/node_modules/**'"' 'opencode-capture' .opencode/skill/system-spec-kit | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
exec
/bin/zsh -lc "rg -o -P '\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(' .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts | wc -l" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
       4
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targets=[\"opencode-capture.ts\",\"input-normalizer.ts\",\"workflow.ts\",\"contamination-filter.ts\",\"decision-extractor.ts\",\"file-extractor.ts\",\"file-writer.ts\",\"memory-indexer.ts\",\"quality-scorer.ts\",\"session-extractor.ts\",\"collect-session-data.ts\",\"template-renderer.ts\",\"source-capabilities.ts\",\"data-loader.ts\"];const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name)) continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));const testMeta=tests.map(f=>{const text=fs.readFileSync(f,"utf8");const m=text.match(/'"\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(/g);return {file:f,text,cases:m?m.length:0,base:path.basename(f)};});const srcFiles=files.filter(f=>targets.includes(path.basename(f))).sort();const out=[];for(const src of srcFiles){const base=path.basename(src);const stem=base.replace(/\\.ts"'$/,"");const mapped=testMeta.filter(t=>t.text.includes(base)||t.text.includes(stem)||t.base.includes(stem));const uniq=[...new Map(mapped.map(m=>[m.file,m])).values()];out.push({source:src,mappedTestCount:uniq.length,testCases:uniq.reduce((a,b)=>a+b.cases,0),mappedTests:uniq.map(u=>u.file).sort()});}console.log(JSON.stringify(out,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 5ms:
[
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/file-writer.ts",
    "mappedTestCount": 2,
    "testCases": 64,
    "mappedTests": [
      ".opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts"
    ]
  },
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts",
    "mappedTestCount": 4,
    "testCases": 76,
    "mappedTests": [
      ".opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts"
    ]
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targets=[\"opencode-capture.ts\",\"input-normalizer.ts\",\"workflow.ts\",\"contamination-filter.ts\",\"decision-extractor.ts\",\"file-extractor.ts\",\"file-writer.ts\",\"memory-indexer.ts\",\"quality-scorer.ts\",\"session-extractor.ts\",\"collect-session-data.ts\",\"template-renderer.ts\",\"source-capabilities.ts\",\"data-loader.ts\"];const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name)) continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));const sources=files.filter(f=>targets.includes(path.basename(f))).sort();const countCases=t=>((t.match(/'"\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(/g)||[]).length);const testMeta=tests.map(f=>{const text=fs.readFileSync(f,\"utf8\");const imports=[...text.matchAll(/from\\s+[\"\\'](["'^"'"\\']+)[\"\\']/g)].map(m=>m[1]).concat([...text.matchAll(/require\\(\\s*[\"\\'](["'^"'"\\']+)[\"\\']\\s*\\)/g)].map(m=>m[1]));return {file:f,text,imports,cases:countCases(text),base:path.basename(f)};});const out=[];for(const src of sources){const base=path.basename(src);const stem=base.replace(/\\.ts"'$/,"");const direct=testMeta.filter(t=>t.imports.some(i=>i.includes(base)||i.includes(stem)));const sameName=testMeta.filter(t=>t.base.includes(stem));const merged=[...new Map([...direct,...sameName].map(t=>[t.file,t])).values()].sort((a,b)=>a.file.localeCompare(b.file));out.push({source:src,directImportTests:direct.map(t=>t.file).sort(),sameNameTests:sameName.map(t=>t.file).sort(),mappedTests:merged.map(t=>t.file),testCases:merged.reduce((a,b)=>a+b.cases,0)});}console.log(JSON.stringify(out,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: parse error near `)'
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targets=[\"opencode-capture.ts\",\"input-normalizer.ts\",\"workflow.ts\",\"contamination-filter.ts\",\"decision-extractor.ts\",\"file-extractor.ts\",\"file-writer.ts\",\"memory-indexer.ts\",\"quality-scorer.ts\",\"session-extractor.ts\",\"collect-session-data.ts\",\"template-renderer.ts\",\"source-capabilities.ts\",\"data-loader.ts\"];const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name))continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));const sources=files.filter(f=>targets.includes(path.basename(f))).sort();const countCases=t=>(t.match(/'"\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(/g)||[]).length;const reFrom=new RegExp(\"from\\\\s+[\\\"\\\\x27](["'^'"\\\"\\\\x27]+)[\\\"\\\\x27]\",\"g\");const reReq=new RegExp(\"require\\\\(\\\\s*[\\\"\\\\x27](["'^'"\\\"\\\\x27]+)[\\\"\\\\x27]\\\\s*\\\\)\",\"g\");const meta=tests.map(f=>{const text=fs.readFileSync(f,\"utf8\");const imports=[];for(const m of text.matchAll(reFrom))imports.push(m[1]);for(const m of text.matchAll(reReq))imports.push(m[1]);return {file:f,imports,cases:countCases(text),base:path.basename(f)};});const out=sources.map(src=>{const base=path.basename(src);const stem=base.replace(/\\.ts"'$/,"");const direct=meta.filter(t=>t.imports.some(i=>i.includes(base)||i.includes(stem)));const same=meta.filter(t=>t.base.includes(stem));const merged=[...new Map([...direct,...same].map(t=>[t.file,t])).values()].sort((a,b)=>a.file.localeCompare(b.file));return {source:src,mappedTests:merged.map(t=>t.file),testCases:merged.reduce((a,b)=>a+b.cases,0)};});console.log(JSON.stringify(out,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 9ms:
[
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/file-writer.ts",
    "mappedTests": [],
    "testCases": 0
  },
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts",
    "mappedTests": [
      ".opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts"
    ],
    "testCases": 1
  },
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts",
    "mappedTests": [
      ".opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts"
    ],
    "testCases": 13
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targets=[\"opencode-capture.ts\",\"input-normalizer.ts\",\"workflow.ts\",\"contamination-filter.ts\",\"decision-extractor.ts\",\"file-extractor.ts\",\"file-writer.ts\",\"memory-indexer.ts\",\"quality-scorer.ts\",\"session-extractor.ts\",\"collect-session-data.ts\",\"template-renderer.ts\",\"source-capabilities.ts\",\"data-loader.ts\"];const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name))continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));const sources=files.filter(f=>targets.includes(path.basename(f))).sort();const reFrom=new RegExp("from'"\\\\s+[\\\"\\\\x27](["'^'"\\\"\\\\x27]+)[\\\"\\\\x27]\",\"g\");const reReq=new RegExp(\"require\\\\(\\\\s*[\\\"\\\\x27](["'^'"\\\"\\\\x27]+)[\\\"\\\\x27]\\\\s*\\\\)\",\"g\");const testMeta=tests.map(f=>{const text=fs.readFileSync(f,\"utf8\");const imports=[];for(const m of text.matchAll(reFrom))imports.push(m[1]);for(const m of text.matchAll(reReq))imports.push(m[1]);const cases=(text.match(/\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(/g)||[]).length;return {file:f,text,imports,cases,base:path.basename(f)};});const exportRegexes=[/export\\s+(?:async\\s+)?function\\s+([A-Za-z0-9_]+)/g,/export\\s+const\\s+([A-Za-z0-9_]+)/g,/export\\s+class\\s+([A-Za-z0-9_]+)/g,/export\\s*\\{\\s*(["'^}]+)'"\\s*\\}/g,/export\\s+default\\s+([A-Za-z0-9_]+)/g];function getExports(txt){const names=new Set();for(const re of exportRegexes){for(const m of txt.matchAll(re)){if(re.source.includes(\"["'^}]+")){m[1].split(",").map(s=>s.trim()).forEach(p=>{if(!p)return;const n=p.split(/'"\\s+as\\s+/i)[0].trim();if(n)names.add(n);});}else names.add(m[1]);}}return [...names].sort();}const out=[];for(const src of sources){const base=path.basename(src);const stem=base.replace(/\\.ts"'$/,"");const mapped=[...new Map(testMeta.filter(t=>t.imports.some(i=>i.includes(base)||i.includes(stem))||t.base.includes(stem)).map(t=>[t.file,t])).values()];const srcText=fs.readFileSync(src,"utf8");const exps=getExports(srcText);const tested=[];const untested=[];for(const name of exps){const re=new RegExp("'"\\\\b\"+name+\"\\\\b\");if(mapped.some(t=>re.test(t.text)))tested.push(name);else untested.push(name);}out.push({source:src,exports:exps,testedExports:tested,untestedExports:untested,mappedTests:mapped.map(t=>t.file).sort(),testCases:mapped.reduce((a,b)=>a+b.cases,0)});}console.log(JSON.stringify(out,null,2));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 70ms:
[
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/file-writer.ts",
    "exports": [
      "writeFilesAtomically"
    ],
    "testedExports": [],
    "untestedExports": [
      "writeFilesAtomically"
    ],
    "mappedTests": [],
    "testCases": 0
  },
  {
    "source": ".opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts",
    "exports": [
      "indexMemory",
      "updateMetadataEmbeddingStatus",
      "updateMetadataWithEmbedding"
    ],
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/core/file-writer.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     231 .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
     204 .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
     356 .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
    2477 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
    1005 .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
     199 .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
     614 .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
     447 .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
     860 .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
     235 .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
     556 .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts
     584 .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
     221 .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts
    1157 .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
      82 .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
    9228 total
exec
/bin/zsh -lc 'for p in scripts/extractors/opencode-capture scripts/utils/input-normalizer scripts/core/workflow scripts/extractors/contamination-filter scripts/extractors/decision-extractor scripts/extractors/file-extractor scripts/core/file-writer scripts/core/memory-indexer scripts/core/quality-scorer scripts/extractors/session-extractor scripts/extractors/collect-session-data scripts/renderers/template-renderer scripts/utils/source-capabilities scripts/loaders/data-loader; do echo "=== $p ==="; rg -l -g '"'*.vitest.ts' -g '*.test.ts' -g '"'!**/node_modules/**'"' \""'$p" .opencode/skill/system-spec-kit | sort; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 69ms:
=== scripts/extractors/collect-session-data ===
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
=== scripts/renderers/template-renderer ===
=== scripts/utils/source-capabilities ===
=== scripts/loaders/data-loader ===
.opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/codex-cli-capture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/gemini-cli-capture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
codex
I now have an initial direct-import map, but some tests import through barrel modules rather than direct file paths, so I’m drilling into the key test files to avoid false negatives before finalizing the zero/partial coverage calls.
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts .opencode/skill/system-spec-kit/shared/parsing/*.test.ts; do c=$(rg -o -P '"'\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(' \""'$f" | wc -l | tr -d '"' '); echo \""'$c $f"; done | sort -nr' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 3ms:
53 .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
52 .opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.ts
39 .opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.ts
27 .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
18 .opencode/skill/system-spec-kit/scripts/tests/tool-sanitizer.vitest.ts
16 .opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts
14 .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
14 .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts
12 .opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts
11 .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
11 .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
10 .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
9 .opencode/skill/system-spec-kit/scripts/tests/template-structure.vitest.ts
9 .opencode/skill/system-spec-kit/scripts/tests/slug-uniqueness.vitest.ts
8 .opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts
8 .opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
7 .opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts
7 .opencode/skill/system-spec-kit/scripts/tests/memory-template-contract.vitest.ts
7 .opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts
7 .opencode/skill/system-spec-kit/scripts/tests/architecture-boundary-enforcement.vitest.ts
exec
/bin/zsh -lc 'for s in opencode-capture input-normalizer workflow contamination-filter decision-extractor file-extractor file-writer memory-indexer quality-scorer session-extractor collect-session-data template-renderer source-capabilities data-loader; do echo "=== $s ==="; find .opencode/skill/system-spec-kit -type f '"\\( -name \"*"'${s}*.vitest.ts" -o -name "*${s}*.test.ts" '"\\) -not -path '*/node_modules/*' -not -path '*/dist/*' | sort; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 2.56s:
.opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts
=== input-normalizer ===
=== workflow ===
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
=== contamination-filter ===
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
=== decision-extractor ===
=== file-extractor ===
=== file-writer ===
=== memory-indexer ===
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts
=== quality-scorer ===
.opencode/skill/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
=== session-extractor ===
=== collect-session-data ===
=== template-renderer ===
=== source-capabilities ===
=== data-loader ===
codex
I’ve now separated dedicated tests (same-name files) from broad integration suites. Next I’m extracting exported functions per source and checking which exports are actually asserted in tests, so we can confidently label “zero” vs “partial” coverage and rank risk gaps.
exec
/bin/zsh -lc 'for f in .opencode/skill/system-spec-kit/scripts/core/file-writer.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts; do echo "=== $f ==="; rg -n '"'"'^export '"' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
=== .opencode/skill/system-spec-kit/scripts/core/file-writer.ts ===
112:export async function writeFilesAtomically(
=== .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts ===
195:export {
201:export type {
=== .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts ===
45:export type QualityFlag =
65:export interface QualityDimensionScore {
73:export interface QualityInsufficiencySummary {
80:export interface QualityScoreResult {
93:export type QualityScore = QualityScoreResult;
164:export function scoreMemoryQuality(
=== .opencode/skill/system-spec-kit/scripts/core/workflow.ts ===
93:export interface WorkflowOptions {
112:export interface WorkflowResult {
2474:export {
=== .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts ===
61:export type {
76:export interface PreflightPostflightResult {
106:export interface ContinueSessionData {
exec
/bin/zsh -lc "sed -n '170,230p' .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '150,210p' .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      memoryId: indexingStatus.memoryId,
      updatedAt: timestamp,
      ...(indexingStatus.status === 'indexed'
        ? { generatedAt: timestamp }
        : { lastAttemptedAt: timestamp }),
      ...(indexingStatus.reason ? { reason: indexingStatus.reason } : {}),
      ...(indexingStatus.errorMessage ? { errorMessage: indexingStatus.errorMessage } : {}),
    };

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (metaError: unknown) {
    const errMsg = metaError instanceof Error ? metaError.message : String(metaError);
    structuredLog('warn', 'Failed to update metadata.json', {
      metadataPath: path.join(contextDir, 'metadata.json'),
      indexingStatus,
      error: errMsg
    });
    console.warn(`   Warning: Could not update metadata.json: ${errMsg}`);
  }
}
 succeeded in 0ms:

  const normalized = normalizeMemoryNameCandidate(title);
  if (normalized.length < 10) {
    return false;
  }

  return !isGenericContentTask(normalized) && !isContaminatedMemoryName(normalized);
}

/**
 * Score the quality of a generated memory file.
 * Runs after template rendering, before file writing.
 * Returns canonical score01 plus a score100 compatibility alias and a per-criterion breakdown.
 */
export function scoreMemoryQuality(
  content: string,
  triggerPhrases: string[],
  keyTopics: string[],
  files: FileWithDescription[],
  observations: ObservationWithNarrative[],
exec
/bin/zsh -lc "sed -n '960,1015p' .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '2450,2485p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    LAST_ACTION: (typeof sessionMeta?.lastAction === 'string' && sessionMeta.lastAction.length > 0) ? sessionMeta.lastAction : lastAction,
    NEXT_ACTION: (typeof sessionMeta?.nextAction === 'string' && sessionMeta.nextAction.length > 0) ? sessionMeta.nextAction : nextAction,
    BLOCKERS: (typeof sessionMeta?.blockers === 'string') ? sessionMeta.blockers : blockers,
    FILE_PROGRESS: fileProgress,
    HAS_FILE_PROGRESS: fileProgress.length > 0,
    SOURCE_TRANSCRIPT_PATH: sourceTranscriptPath,
    SOURCE_SESSION_ID: sourceSessionId,
    SOURCE_SESSION_CREATED: sourceSessionCreated,
    SOURCE_SESSION_UPDATED: sourceSessionUpdated,
    // Git provenance metadata (M-007d + Phase 1B) — git.* payload fields take priority, then enrichment
    HEAD_REF: (typeof gitMeta?.headRef === 'string' && gitMeta.headRef.length > 0)
      ? gitMeta.headRef
      : (typeof data.headRef === 'string' ? data.headRef : null),
    COMMIT_REF: (typeof gitMeta?.commitRef === 'string' && gitMeta.commitRef.length > 0)
      ? gitMeta.commitRef
      : (typeof data.commitRef === 'string' ? data.commitRef : null),
    REPOSITORY_STATE: (typeof gitMeta?.repositoryState === 'string' && gitMeta.repositoryState.length > 0)
      ? gitMeta.repositoryState
      : (typeof data.repositoryState === 'string' ? data.repositoryState : 'unavailable'),
    IS_DETACHED_HEAD: (typeof gitMeta?.isDetachedHead === 'boolean')
 succeeded in 0ms:
        specFolderName,
        contextFilename: ctxFilename,
        writtenFiles,
        memoryId,
        indexingStatus: indexingStatus ?? {
          status: 'failed_embedding',
          memoryId,
          reason: 'Indexing status was not finalized before workflow completion.',
        },
        stats: {
          messageCount: conversations.MESSAGES.length,
          decisionCount: decisions.DECISIONS.length,
          diagramCount: diagrams.DIAGRAMS.length,
          qualityScore: qualityResult.score,
          isSimulation
        }
      };
  });
}

exec
/bin/zsh -lc "sed -n '170,230p' .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    .replace(/^(?:And|But|Or|So|Then)\s+/gim, '') // orphaned leading conjunctions
    .replace(/ {2,}/g, ' ');                   // collapse double-spaces

  return {
    cleanedText: normalizeWhitespace(cleaned),
    removedPhrases,
    hadContamination: removedPhrases.length > 0,
    matchedPatterns: [...matchedPatterns],
    maxSeverity: severity,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
------------------------------------------------------------------*/

export {
  DEFAULT_DENYLIST,
  SEVERITY_RANK,
  filterContamination,
exec
/bin/zsh -lc "sed -n '590,640p' .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      ...decision,
      DECISION_ANCHOR_ID: anchorId,
      DECISION_IMPORTANCE: importance
    };
  });

  return {
    DECISIONS: decisionsWithAnchors.map((d) => validateDataStructure(d) as DecisionRecord),
    DECISION_COUNT: allDecisions.length,
    HIGH_CONFIDENCE_COUNT: highConfidence,
    MEDIUM_CONFIDENCE_COUNT: mediumConfidence,
    LOW_CONFIDENCE_COUNT: lowConfidence,
    FOLLOWUP_COUNT: followupCount
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
------------------------------------------------------------------*/

exec
/bin/zsh -lc "sed -n '420,460p' .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      } else {
        existing.obs.narrative = (existing.obs.narrative || title).replace(
          /\(repeated \d+ times\)/,
          `(repeated ${existing.count} times)`
        );
      }
    } else {
      // Deep copy nested arrays to prevent mutation of the original observations
      const obsCopy = { ...obs, facts: obs.facts ? [...obs.facts] : undefined, files: obs.files ? [...obs.files] : undefined };
      mergeTracker.set(dedupKey, { obs: obsCopy, count: 1, index: result.length });
      result.push(obsCopy);
    }
  }

  return result;
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
------------------------------------------------------------------*/
exec
/bin/zsh -lc "sed -n '820,875p' .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      ? Array.from(assistantResponseContent).slice(0, CONFIG.TOOL_OUTPUT_MAX_LENGTH).join('')
      : null;

    if (!userInput && !assistantResponse) {
      continue;
    }

    exchanges.unshift({
      userInput: userInput || 'User initiated conversation',
      assistantResponse: assistantResponse || 'Assistant processed request',
      timestamp: userMsg.created,
      user_message_id: userMsg.id,
      assistant_message_id: response?.messageId || null,
      mode: prompt?.mode || 'normal',
    });
  }

  return exchanges;
}

exec
/bin/zsh -lc "sed -n '210,245p' .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '560,600p' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '195,230p' .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,565p' .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    warnings,
    qualityFlags: [...qualityFlags],
    hadContamination,
    dimensions: buildRuleDimensions(validatorSignals),
    insufficiency: normalizedSufficiencyScore !== null || insufficientContext ? {
      pass: !insufficientContext,
      score01: normalizedSufficiencyScore,
      reasons: insufficientContext ? ['Insufficient context flag set during rendered-memory quality scoring.'] : [],
    } : null,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
------------------------------------------------------------------*/

export {
  scoreMemoryQuality,
};

 succeeded in 0ms:
  }

  for (const source of nativeCaptureOrder) {
    const loaded = await attemptNativeCapture(source, specFolderArg, sessionId);
    if (loaded) {
      return loaded;
    }
  }

  // Priority 7: No data available — refuse to proceed
  throw new Error(
    'NO_DATA_AVAILABLE: No session data found. Neither JSON data file, OpenCode session capture, Claude Code session capture, Codex CLI session capture, Copilot CLI session capture, nor Gemini CLI session capture provided usable content. ' +
    'External CLI agents must provide data via JSON mode: ' +
    'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
  );
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
 succeeded in 0ms:
    );
  }

  let template: string;
  try {
    template = await fs.readFile(templatePath, 'utf-8');
  } catch (readError: unknown) {
    const readErrorMessage = readError instanceof Error ? readError.message : String(readError);
    throw new Error(
      `Failed to read template "${templateName}": ${readErrorMessage}`
    );
  }

  const rendered: string = renderTemplate(template, data);
  return stripTemplateConfigComments(rendered);
}

// ───────────────────────────────────────────────────────────────
// 8. EXPORTS
// ───────────────────────────────────────────────────────────────
 succeeded in 0ms:
 * @returns Snapshot with project phase, active file, last/next actions, blockers, and file progress.
 */
function buildProjectStateSnapshot(params: ProjectStateParams): ProjectStateSnapshot {
  const { toolCounts, observations, messageCount, FILES, SPEC_FILES, recentContext } = params;
  const behavioralObservations = getBehavioralObservations(observations);
  return {
    projectPhase: detectProjectPhase(toolCounts, observations, messageCount),
    activeFile: extractActiveFile(observations, FILES),
    lastAction: behavioralObservations.slice(-1)[0]?.title || 'Context save initiated',
    nextAction: extractNextAction(behavioralObservations, recentContext),
    blockers: extractBlockers(behavioralObservations),
    fileProgress: buildFileProgress(SPEC_FILES)
  };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
------------------------------------------------------------------*/

export {
exec
/bin/zsh -lc "sed -n '1120,1165p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    _source: source,
    _sessionId: normalizedCapture.sessionId,
    _capturedAt: normalizedCapture.capturedAt,
    _toolCallCount: filteredToolCalls.length,
    _sourceTranscriptPath: typeof metadata?.file_summary === 'object' && metadata?.file_summary !== null
      ? (metadata.file_summary as Record<string, unknown>).transcriptPath as string | undefined
      : undefined,
    _sourceSessionId: typeof metadata?._sourceSessionId === 'string'
      ? metadata._sourceSessionId as string
      : normalizedCapture.sessionId,
    _sourceSessionCreated: typeof metadata?._sourceSessionCreated === 'number'
      ? metadata._sourceSessionCreated as number
      : typeof metadata?.session_created === 'number'
        ? metadata.session_created as number
        : undefined,
    _sourceSessionUpdated: typeof metadata?._sourceSessionUpdated === 'number'
      ? metadata._sourceSessionUpdated as number
      : typeof metadata?.session_updated === 'number'
        ? metadata.session_updated as number
        : undefined,
exec
/bin/zsh -lc "sed -n '65,95p' .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  }

  if (typeof source === 'string' && isKnownDataSource(source)) {
    return SOURCE_CAPABILITIES[source];
  }

  if (typeof source === 'string') {
    return SOURCE_CAPABILITIES.file;
  }

  return SOURCE_CAPABILITIES[source];
}

export {
  SOURCE_CAPABILITIES,
  getSourceCapabilities,
  isKnownDataSource,
};
exec
/bin/zsh -lc "sed -n '95,135p' .opencode/skill/system-spec-kit/scripts/core/file-writer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  }
  for (const existing of entries) {
    try {
      const existingContent = await fs.readFile(path.join(contextDir, existing), 'utf-8');
      const existingHash = crypto.createHash('sha256').update(existingContent).digest('hex');
      if (hash === existingHash) {
        return existing; // duplicate found — return the matching filename
      }
    } catch (readErr: unknown) {
      // F-29: Only skip ENOENT (file removed between readdir and read), rethrow others
      if ((readErr as NodeJS.ErrnoException).code !== 'ENOENT') throw readErr;
    }
  }
  return null;
}

/** Write files atomically with batch rollback on failure. */
export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// TEST: OpenCode Capture project selection
// Guards against stale project resolution when workspaces share a .opencode anchor.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_HOME = process.env.HOME;
const tempRoots: string[] = [];

function makeTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

function writeSessionFile(
  storageRoot: string,
  projectId: string,
exec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      }

      throw new Error(`Unexpected opencode args: ${args.join(' ')}`);
    });

    vi.doMock('node:child_process', () => ({ execFileSync }));

    const { captureConversation } = await import('../extractors/opencode-capture');
    const result = await captureConversation(10, workspace);

    expect(result.projectId).toBe('native-project');
    expect(result.sessionId).toBe('ses_live');
    expect(result.sessionTitle).toBe('OpenCode Proof 2026-03-17');
    expect(result.exchanges).toHaveLength(2);
    expect(result.exchanges[0]?.userInput).toBe('First prompt');
    expect(result.exchanges[1]?.userInput).toBe('Second prompt');
    expect(result.toolCalls).toHaveLength(2);
    expect(result.toolCalls.map((call) => call.tool)).toEqual(['read', 'grep']);
    expect(execFileSync).toHaveBeenCalledWith(
      'opencode',
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// TEST: Contamination Filter — severity tracking and SEVERITY_RANK export
import { describe, expect, it } from 'vitest';

import { filterContamination, SEVERITY_RANK } from '../extractors/contamination-filter';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('filterContamination severity tracking', () => {
  it('reports low severity for preamble-only input', () => {
    const result = filterContamination('Let me check the logs. Let me read the config.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('low');
  });

  it('escalates to high when low and high patterns co-occur', () => {
    const result = filterContamination('Let me check this. As an AI, I can help.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
  });
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/decision-confidence.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { describe, expect, it } from 'vitest';

import { extractDecisions } from '../extractors/decision-extractor';

describe('decision confidence calibration', () => {
  it('keeps choice confidence modest when only alternatives are present', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'We reviewed the database options.',
        timestamp: '2026-03-16T10:00:00Z',
        facts: [
          'Option A: PostgreSQL - Relational database',
          'Option B: SQLite - Embedded database',
        ],
      }],
    });

exec
/bin/zsh -lc "rg -n \"from '../\" .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
9:import { buildSessionActivitySignal } from '../extractors/session-activity-signal';
10:import { extractDecisions } from '../extractors/decision-extractor';
11:import { extractBlockers } from '../extractors/session-extractor';
12:import { TEST_HELPERS } from '../spec-folder/folder-detector';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildSessionActivitySignal } from '../extractors/session-activity-signal';
import { extractDecisions } from '../extractors/decision-extractor';
import { extractBlockers } from '../extractors/session-extractor';
import { TEST_HELPERS } from '../spec-folder/folder-detector';
import { buildRichSessionData } from './fixtures/session-data-factory';

const TEMPLATE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'templates',
);
exec
/bin/zsh -lc 'rg -n "extractDecisions|extractBlockers" .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
10:import { extractDecisions } from '../extractors/decision-extractor';
11:import { extractBlockers } from '../extractors/session-extractor';
278:    const result = await extractDecisions({
296:    const result = await extractDecisions({
322:    const blocker = extractBlockers([
exec
/bin/zsh -lc "sed -n '255,350p' .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        filesModified: [
          {
            path: '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes/checklist.md',
          },
        ],
      },
      '02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/013-auto-detection-fixes',
    );

    expect(signal.toolCallPaths).toHaveLength(2);
    expect(signal.gitChangedFiles).toHaveLength(1);
    expect(signal.transcriptMentions).toHaveLength(2);
    // Derivation: Read(0.2) + Edit(0.3) + gitChanged(0.25) + transcriptMentions(2 × 0.1) = 0.95
    expect(signal.confidenceBoost).toBeCloseTo(0.95, 3);
  });

  it('suppresses observation-derived decision duplicates when manual decisions exist (SC-002: 4+4 → 4)', async () => {
    const manualTitles = [
      'Use git-status as a ranking signal for auto-detection.',
      'Narrow TOOL_READ_SET to exclude bash/task.',
exec
/bin/zsh -lc "rg -n \"from '../\" .opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
3:import { scoreMemoryQuality } from '../core/quality-scorer';
4:import { extractFilesFromData } from '../extractors/file-extractor';
5:import { deriveModificationMagnitude } from '../extractors/git-context-extractor';
6:import { validateDescription } from '../utils/file-helpers';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/description-enrichment.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { describe, expect, it } from 'vitest';

import { scoreMemoryQuality } from '../core/quality-scorer';
import { extractFilesFromData } from '../extractors/file-extractor';
import { deriveModificationMagnitude } from '../extractors/git-context-extractor';
import { validateDescription } from '../utils/file-helpers';

function buildContent(title: string): string {
  return [
    '---',
    `title: "${title}"`,
    '---',
    '',
    `# ${title}`,
    '',
    ...Array.from({ length: 24 }, (_, index) => `Evidence line ${index + 1} for file-description quality scoring.`),
  ].join('\n');
}

describe('description enrichment', () => {
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────────
// MODULE: Phase Classification Tests
// ───────────────────────────────────────────────────────────────────
import { describe, expect, it } from 'vitest';

import { extractConversations } from '../extractors/conversation-extractor';
import { detectObservationType } from '../extractors/file-extractor';
import {
  classifyConversationExchanges,
  classifyConversationPhase,
} from '../utils/phase-classifier';

describe('phase classification', () => {
  it('resolves grep in debug output to Debugging', () => {
    expect(classifyConversationPhase([{ tool: 'Grep' }], 'grep in debug output while fixing the error')).toBe('Debugging');
  });

  it('normalizes Copilot view tool names to canonical read scoring', () => {
    expect(classifyConversationPhase([{ tool: 'View' }], 'Okay')).toBe('Research');

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';

const {
  generateEmbeddingMock,
  generateDocumentEmbeddingMock,
  indexMemoryMock,
} = vi.hoisted(() => ({
  generateEmbeddingMock: vi.fn(),
  generateDocumentEmbeddingMock: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
  indexMemoryMock: vi.fn(() => 42),
}));

vi.mock('../lib/embeddings', async () => {
  const actual = await vi.importActual<typeof import('../lib/embeddings')>('../lib/embeddings');
  return {
    ...actual,
    generateEmbedding: generateEmbeddingMock,
    generateDocumentEmbedding: generateDocumentEmbeddingMock,
exec
/bin/zsh -lc "rg -n \"from '../\" .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow E2E Tests
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildRichSessionData, buildSparseSessionData, buildTreeThinningSessionData } from './fixtures/session-data-factory';

/* ───────────────────────────────────────────────────────────────
   1. CAPTURE MOCKS
──────────────────────────────────────────────────────────────── */

const captureConversation = vi.hoisted(() => vi.fn(async () => null));
const captureClaudeConversation = vi.hoisted(() => vi.fn(async () => null));
const captureCodexConversation = vi.hoisted(() => vi.fn(async () => null));
exec
/bin/zsh -lc 'rg -n "runWorkflow|writeFilesAtomically|indexMemory|collectSessionData|populateTemplate|loadCollectedData|scoreMemoryQuality" .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
202:        learning: 'A deterministic collectSessionDataFn stabilizes save-path assertions while the real render and write path remains under test.',
329:        indexMemory: mockedIndexMemory,
425:    const result = await workflowModule.runWorkflow({
428:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
477:    const result = await workflowModule.runWorkflow({
515:    const result = await workflowModule.runWorkflow({
542:    const result = await workflowModule.runWorkflow({
545:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
588:    await expect(workflowModule.runWorkflow({
621:    await expect(workflowModule.runWorkflow({
636:    const first = await workflowModule.runWorkflow({
639:      collectSessionDataFn: sessionDataFactory,
644:    const second = await workflowModule.runWorkflow({
647:      collectSessionDataFn: sessionDataFactory,
695:    const first = await workflowModule.runWorkflow({
698:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
701:    const second = await workflowModule.runWorkflow({
704:      collectSessionDataFn: async (_collectedData, specFolderName) => buildRichSessionData(specFolderName || harness.specRelativePath),
733:    await expect(workflowModule.runWorkflow({
736:      collectSessionDataFn: async (_collectedData, specFolderName) => buildSparseSessionData(specFolderName || harness.specRelativePath),
exec
/bin/zsh -lc "sed -n '300,380p' .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    failEmbedding?: boolean;
    validationOverride?: ValidationOverride | null;
  } = {},
): Promise<typeof import('../core/workflow')> {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../core/memory-indexer');
  vi.doUnmock('../memory/validate-memory-quality');

  captureConversation.mockReset();
  captureClaudeConversation.mockReset();
  captureCodexConversation.mockReset();
  captureCopilotConversation.mockReset();
  captureGeminiConversation.mockReset();
  captureConversation.mockResolvedValue(options.statelessCapture ?? null);
  captureClaudeConversation.mockResolvedValue(null);
  captureCodexConversation.mockResolvedValue(null);
  captureCopilotConversation.mockResolvedValue(null);
  captureGeminiConversation.mockResolvedValue(null);
  mockedIndexMemory.mockReset();
exec
/bin/zsh -lc "rg -n \"from '../\" .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
11:import { normalizeQualityAbortThreshold } from '../core/config';
12:import { collectSessionData } from '../extractors/collect-session-data';
13:import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
exec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Memory Input Tests
// ───────────────────────────────────────────────────────────────────
// TEST: Runtime Memory Inputs
// Covers explicit data-file failures and next-steps normalization
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeQualityAbortThreshold } from '../core/config';
import { collectSessionData } from '../extractors/collect-session-data';
import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';

const captureConversation = vi.fn(async () => null);
const captureClaudeConversation = vi.fn(async () => null);
const captureCodexConversation = vi.fn(async () => null);
const captureCopilotConversation = vi.fn(async () => null);
const captureGeminiConversation = vi.fn(async () => null);

exec
/bin/zsh -lc "rg -n \"collectSessionData\\(|normalizeInputData\\(|transformOpencodeCapture\\(\" .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
526:    const transformed = transformOpencodeCapture({
578:    const normalized = normalizeInputData({
629:    const normalized = normalizeInputData({
660:    const normalized = normalizeInputData({
684:    const sessionData = await collectSessionData(normalized, '022-hybrid-rag-fusion');
691:    const normalized = normalizeInputData({
721:    const sessionData = await collectSessionData(
728:    const normalizedAgain = normalizeInputData({
740:    const normalized = normalizeInputData({
751:    const normalized = normalizeInputData({
766:    const normalized = normalizeInputData({
782:    const normalized = normalizeInputData({
800:    const sessionData = await collectSessionData(
810:    const normalized = normalizeInputData({
828:    const sessionData = await collectSessionData(
842:    const normalized = normalizeInputData({
873:    const sessionData = await collectSessionData(
884:    const normalized = normalizeInputData({
903:    const sessionData = await collectSessionData(
exec
/bin/zsh -lc "rg -n \"from '../\" .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { describe, expect, it } from 'vitest';

import { evaluateMemorySufficiency } from '@spec-kit/shared/parsing/memory-sufficiency';

describe('evaluateMemorySufficiency', () => {
  it('passes rich specific evidence', () => {
    const result = evaluateMemorySufficiency({
      title: 'Perfect Session Capturing Sufficiency Hardening',
      content: [
        '# Perfect Session Capturing Sufficiency Hardening',
        '',
        '## Overview',
        'Implemented a shared insufficiency gate across workflow and memory_save so thin saves fail explicitly.',
        '',
        '## Decisions',
        '- Chosen approach: reject thin memories before indexing because synthetic metadata should not count as durable context.',
        '- Rationale: the prior path could index generic sessions that matched workspace identity but not the real task.',
      ].join('\n'),
      triggerPhrases: ['perfect session capturing', 'memory sufficiency', 'memory save', 'alignment block'],
      files: [
exec
/bin/zsh -lc "rg -n \"extractors/quality-scorer|from '../extractors/quality-scorer|import\\('\\.\\./extractors/quality-scorer|doMock\\('\\.\\./extractors/quality-scorer|vi\\.mock\\('\\.\\./extractors/quality-scorer\" .opencode/skill/system-spec-kit/scripts/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:223:vi.mock('../extractors/quality-scorer', () => ({
exec
/bin/zsh -lc 'rg -n "extractors/quality-scorer|core/quality-scorer|collect-session-data|input-normalizer|opencode-capture|session-extractor|decision-extractor|file-extractor|memory-indexer|file-writer|template-renderer|source-capabilities|data-loader|core/workflow|loaders/data-loader" .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
12:import { collectSessionData } from '../extractors/collect-session-data';
191:vi.mock('../core/file-writer', () => ({
198:vi.mock('../loaders/data-loader', () => ({
213:      _source: 'opencode-capture',
219:vi.mock('../core/quality-scorer', () => ({
223:vi.mock('../extractors/quality-scorer', () => ({
257:vi.mock('../core/memory-indexer', () => ({
476:    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', '/tmp/context.json')).toBe(false);
480:    expect(shouldEnrichTaskFromSpecTitle('Development session', 'opencode-capture', null)).toBe(true);
485:    expect(shouldEnrichTaskFromSpecTitle('Architecture boundary remediation', 'opencode-capture', null)).toBe(false);
521:    const taskForSlug = shouldEnrichTaskFromSpecTitle(genericTask, 'opencode-capture', null)
541:    const taskForSlug = shouldEnrichTaskFromSpecTitle('Implementation and updates', 'opencode-capture', null)
656:      'Inspected `scripts/core/workflow.ts` and `scripts/memory/validate-memory-quality.ts`.',
893:          FILE_PATH: 'scripts/core/workflow.ts',
932:    const { runWorkflow } = await import('../core/workflow');
977:    const { runWorkflow } = await import('../core/workflow');
1026:    const { runWorkflow } = await import('../core/workflow');
1093:        '| `scripts/core/workflow.ts` | Modify | Insert enrichment after alignment guards |',
1101:      _source: 'opencode-capture',
1107:          files: ['.opencode/skill/system-spec-kit/scripts/core/workflow.ts'],
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targetRel=[\"scripts/extractors/opencode-capture.ts\",\"scripts/utils/input-normalizer.ts\",\"scripts/core/workflow.ts\",\"scripts/extractors/contamination-filter.ts\",\"scripts/extractors/decision-extractor.ts\",\"scripts/extractors/file-extractor.ts\",\"scripts/core/file-writer.ts\",\"scripts/core/memory-indexer.ts\",\"scripts/core/quality-scorer.ts\",\"scripts/extractors/quality-scorer.ts\",\"scripts/extractors/session-extractor.ts\",\"scripts/extractors/collect-session-data.ts\",\"scripts/renderers/template-renderer.ts\",\"scripts/utils/source-capabilities.ts\",\"scripts/loaders/data-loader.ts\"];const targets=new Set(targetRel.map(r=>path.resolve(root,r)));const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name))continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));function resolveImport(spec,importer){if(!spec.startsWith('"'.'))return null;const dir=path.dirname(importer);const base=path.resolve(dir,spec);const cands=[base,base+\".ts\",base+\".tsx\",base+\".js\",path.join(base,\"index.ts\"),path.join(base,\"index.tsx\"),path.join(base,\"index.js\")];for(const c of cands){if(fs.existsSync(c)&&fs.statSync(c).isFile())return path.resolve(c);}return null;}function collect(re,text){const out=[];for(const m of text.matchAll(re))out.push(m[1]);return out;}const summary={};for(const t of targets)summary[t]={imports:new Set(),dynamics:new Set(),mocks:new Set(),unmocks:new Set()};for(const tf of tests){const text=fs.readFileSync(tf,\"utf8\");const staticSpecs=collect(/import\\s+(?:["'^'"\\\"\\']+?\\s+from\\s+)?[\\\"\\'](["'^'"\\\"\\']+)[\\\"\\']/g,text);const dynSpecs=collect(/import\\(\\s*[\\\"\\'](["'^'"\\\"\\']+)[\\\"\\']\\s*\\)/g,text);const mockSpecs=collect(/vi\\.(?:mock|doMock)\\(\\s*[\\\"\\'](["'^'"\\\"\\']+)[\\\"\\']/g,text);const unmockSpecs=collect(/vi\\.(?:unmock|doUnmock)\\(\\s*[\\\"\\'](["'^'"\\\"\\']+)[\\\"\\']/g,text);for(const s of staticSpecs){const r=resolveImport(s,tf);if(r&&targets.has(r))summary[r].imports.add(tf);}for(const s of dynSpecs){const r=resolveImport(s,tf);if(r&&targets.has(r))summary[r].dynamics.add(tf);}for(const s of mockSpecs){const r=resolveImport(s,tf);if(r&&targets.has(r))summary[r].mocks.add(tf);}for(const s of unmockSpecs){const r=resolveImport(s,tf);if(r&&targets.has(r))summary[r].unmocks.add(tf);}}const out=[];for(const rel of targetRel){const abs=path.resolve(root,rel);const s=summary[abs];out.push({source:path.relative(\".\",abs),imports:[...s.imports].sort(),dynamicImports:[...s.dynamics].sort(),mocks:[...s.mocks].sort(),unmocks:[...s.unmocks].sort()});}console.log(JSON.stringify(out,null,2));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: parse error near `)'
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const targetRel=[\"scripts/extractors/opencode-capture.ts\",\"scripts/utils/input-normalizer.ts\",\"scripts/core/workflow.ts\",\"scripts/extractors/contamination-filter.ts\",\"scripts/extractors/decision-extractor.ts\",\"scripts/extractors/file-extractor.ts\",\"scripts/core/file-writer.ts\",\"scripts/core/memory-indexer.ts\",\"scripts/core/quality-scorer.ts\",\"scripts/extractors/quality-scorer.ts\",\"scripts/extractors/session-extractor.ts\",\"scripts/extractors/collect-session-data.ts\",\"scripts/renderers/template-renderer.ts\",\"scripts/utils/source-capabilities.ts\",\"scripts/loaders/data-loader.ts\"];const targetAbs=targetRel.map(r=>path.resolve(root,r));const targetSet=new Set(targetAbs);const files=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name))continue;walk(p);}else files.push(p);}};walk(root);const tests=files.filter(f=>/\\.(vitest|test)\\.ts"'$/.test(f));const summary=Object.fromEntries(targetAbs.map(a=>[a,{imports:new Set(),dynamics:new Set(),mocks:new Set(),unmocks:new Set()}]));function resolve(spec,importer){if(!spec.startsWith('"'.'))return null;const base=path.resolve(path.dirname(importer),spec);const cands=[base,base+\".ts\",base+\".tsx\",base+\".js\",path.join(base,\"index.ts\"),path.join(base,\"index.tsx\"),path.join(base,\"index.js\")];for(const c of cands){if(fs.existsSync(c)&&fs.statSync(c).isFile())return path.resolve(c);}return null;}function scan(text,re){const out=[];for(const m of text.matchAll(re))out.push(m[1]);return out;}for(const tf of tests){const text=fs.readFileSync(tf,\"utf8\");const norm=text.replace(/\\'/g,'\"');const staticSpecs=scan(norm,/import\\s+(?:["'^'"\\\"]+?\\s+from\\s+)?\\\"(["'^'"\\\"]+)\\\"/g);const dynSpecs=scan(norm,/import\\(\\s*\\\"(["'^'"\\\"]+)\\\"\\s*\\)/g);const mockSpecs=scan(norm,/vi\\.(?:mock|doMock)\\(\\s*\\\"(["'^'"\\\"]+)\\\"/g);const unmockSpecs=scan(norm,/vi\\.(?:unmock|doUnmock)\\(\\s*\\\"(["'^'"\\\"]+)\\\"/g);for(const s of staticSpecs){const r=resolve(s,tf);if(r&&targetSet.has(r))summary[r].imports.add(tf);}for(const s of dynSpecs){const r=resolve(s,tf);if(r&&targetSet.has(r))summary[r].dynamics.add(tf);}for(const s of mockSpecs){const r=resolve(s,tf);if(r&&targetSet.has(r))summary[r].mocks.add(tf);}for(const s of unmockSpecs){const r=resolve(s,tf);if(r&&targetSet.has(r))summary[r].unmocks.add(tf);}}const out=targetRel.map(rel=>{const abs=path.resolve(root,rel);const s=summary[abs];return {source:path.relative('.',abs),imports:[...s.imports].sort(),dynamicImports:[...s.dynamics].sort(),mocks:[...s.mocks].sort(),unmocks:[...s.unmocks].sort()};});console.log(JSON.stringify(out,null,2));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
zsh:1: parse error near `)'
codex
I’m switching to a structured parser run to avoid shell-quoting noise and produce a precise map of where each target source is imported, dynamically imported, or mocked in tests. That will make the coverage calls defensible instead of heuristic.
tool code_mode.call_tool_chain({"code":"import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = '.opencode/skill/system-spec-kit';\nconst targetRel = [\n  'scripts/extractors/opencode-capture.ts',\n  'scripts/utils/input-normalizer.ts',\n  'scripts/core/workflow.ts',\n  'scripts/extractors/contamination-filter.ts',\n  'scripts/extractors/decision-extractor.ts',\n  'scripts/extractors/file-extractor.ts',\n  'scripts/core/file-writer.ts',\n  'scripts/core/memory-indexer.ts',\n  'scripts/core/quality-scorer.ts',\n  'scripts/extractors/quality-scorer.ts',\n  'scripts/extractors/session-extractor.ts',\n  'scripts/extractors/collect-session-data.ts',\n  'scripts/renderers/template-renderer.ts',\n  'scripts/utils/source-capabilities.ts',\n  'scripts/loaders/data-loader.ts',\n];\n\nconst targetAbs = targetRel.map((r) => path.resolve(root, r));\nconst targetSet = new Set(targetAbs);\n\nfunction walk(dir: string): string[] {\n  const out: string[] = [];\n  const entries = fs.readdirSync(dir, { withFileTypes: true });\n  for (const ent of entries) {\n    const p = path.join(dir, ent.name);\n    if (ent.isDirectory()) {\n      if (['node_modules', 'dist', '.git'].includes(ent.name)) continue;\n      out.push(...walk(p));\n    } else {\n      out.push(p);\n    }\n  }\n  return out;\n}\n\nconst files = walk(root);\nconst tests = files.filter((f) => /\\.(vitest|test)\\.ts$/.test(f));\n\nfunction resolveImport(spec: string, importer: string): string | null {\n  if (!spec.startsWith('.')) return null;\n  const base = path.resolve(path.dirname(importer), spec);\n  const cands = [\n    base,\n    `${base}.ts`,\n    `${base}.tsx`,\n    `${base}.js`,\n    path.join(base, 'index.ts'),\n    path.join(base, 'index.tsx'),\n    path.join(base, 'index.js'),\n  ];\n  for (const c of cands) {\n    if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.resolve(c);\n  }\n  return null;\n}\n\nfunction collect(text: string, re: RegExp): string[] {\n  return Array.from(text.matchAll(re), (m) => m[1]);\n}\n\nconst summary = new Map<string, { imports: Set<string>; dynamics: Set<string>; mocks: Set<string>; unmocks: Set<string> }>();\nfor (const abs of targetAbs) {\n  summary.set(abs, { imports: new Set(), dynamics: new Set(), mocks: new Set(), unmocks: new Set() });\n}\n\nfor (const tf of tests) {\n  const text = fs.readFileSync(tf, 'utf8');\n\n  const staticSpecs = collect(text, /import\\s+(?:[^'\"\\n]+?\\s+from\\s+)?['\"]([^'\"]+)['\"]/g);\n  const dynamicSpecs = collect(text, /import\\(\\s*['\"]([^'\"]+)['\"]\\s*\\)/g);\n  const mockSpecs = collect(text, /vi\\.(?:mock|doMock)\\(\\s*['\"]([^'\"]+)['\"]/g);\n  const unmockSpecs = collect(text, /vi\\.(?:unmock|doUnmock)\\(\\s*['\"]([^'\"]+)['\"]/g);\n\n  for (const s of staticSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.imports.add(tf);\n  }\n  for (const s of dynamicSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.dynamics.add(tf);\n  }\n  for (const s of mockSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.mocks.add(tf);\n  }\n  for (const s of unmockSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.unmocks.add(tf);\n  }\n}\n\nconst output = targetRel.map((rel) => {\n  const abs = path.resolve(root, rel);\n  const s = summary.get(abs)!;\n  return {\n    source: path.relative('.', abs),\n    imports: [...s.imports].sort(),\n    dynamicImports: [...s.dynamics].sort(),\n    mocks: [...s.mocks].sort(),\n    unmocks: [...s.unmocks].sort(),\n  };\n});\n\nreturn JSON.stringify(output, null, 2);"})
code_mode.call_tool_chain({"code":"import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = '.opencode/skill/system-spec-kit';\nconst targetRel = [\n  'scripts/extractors/opencode-capture.ts',\n  'scripts/utils/input-normalizer.ts',\n  'scripts/core/workflow.ts',\n  'scripts/extractors/contamination-filter.ts',\n  'scripts/extractors/decision-extractor.ts',\n  'scripts/extractors/file-extractor.ts',\n  'scripts/core/file-writer.ts',\n  'scripts/core/memory-indexer.ts',\n  'scripts/core/quality-scorer.ts',\n  'scripts/extractors/quality-scorer.ts',\n  'scripts/extractors/session-extractor.ts',\n  'scripts/extractors/collect-session-data.ts',\n  'scripts/renderers/template-renderer.ts',\n  'scripts/utils/source-capabilities.ts',\n  'scripts/loaders/data-loader.ts',\n];\n\nconst targetAbs = targetRel.map((r) => path.resolve(root, r));\nconst targetSet = new Set(targetAbs);\n\nfunction walk(dir: string): string[] {\n  const out: string[] = [];\n  const entries = fs.readdirSync(dir, { withFileTypes: true });\n  for (const ent of entries) {\n    const p = path.join(dir, ent.name);\n    if (ent.isDirectory()) {\n      if (['node_modules', 'dist', '.git'].includes(ent.name)) continue;\n      out.push(...walk(p));\n    } else {\n      out.push(p);\n    }\n  }\n  return out;\n}\n\nconst files = walk(root);\nconst tests = files.filter((f) => /\\.(vitest|test)\\.ts$/.test(f));\n\nfunction resolveImport(spec: string, importer: string): string | null {\n  if (!spec.startsWith('.')) return null;\n  const base = path.resolve(path.dirname(importer), spec);\n  const cands = [\n    base,\n    `${base}.ts`,\n    `${base}.tsx`,\n    `${base}.js`,\n    path.join(base, 'index.ts'),\n    path.join(base, 'index.tsx'),\n    path.join(base, 'index.js'),\n  ];\n  for (const c of cands) {\n    if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.resolve(c);\n  }\n  return null;\n}\n\nfunction collect(text: string, re: RegExp): string[] {\n  return Array.from(text.matchAll(re), (m) => m[1]);\n}\n\nconst summary = new Map<string, { imports: Set<string>; dynamics: Set<string>; mocks: Set<string>; unmocks: Set<string> }>();\nfor (const abs of targetAbs) {\n  summary.set(abs, { imports: new Set(), dynamics: new Set(), mocks: new Set(), unmocks: new Set() });\n}\n\nfor (const tf of tests) {\n  const text = fs.readFileSync(tf, 'utf8');\n\n  const staticSpecs = collect(text, /import\\s+(?:[^'\"\\n]+?\\s+from\\s+)?['\"]([^'\"]+)['\"]/g);\n  const dynamicSpecs = collect(text, /import\\(\\s*['\"]([^'\"]+)['\"]\\s*\\)/g);\n  const mockSpecs = collect(text, /vi\\.(?:mock|doMock)\\(\\s*['\"]([^'\"]+)['\"]/g);\n  const unmockSpecs = collect(text, /vi\\.(?:unmock|doUnmock)\\(\\s*['\"]([^'\"]+)['\"]/g);\n\n  for (const s of staticSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.imports.add(tf);\n  }\n  for (const s of dynamicSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.dynamics.add(tf);\n  }\n  for (const s of mockSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.mocks.add(tf);\n  }\n  for (const s of unmockSpecs) {\n    const r = resolveImport(s, tf);\n    if (r && targetSet.has(r)) summary.get(r)!.unmocks.add(tf);\n  }\n}\n\nconst output = targetRel.map((rel) => {\n  const abs = path.resolve(root, rel);\n  const s = summary.get(abs)!;\n  return {\n    source: path.relative('.', abs),\n    imports: [...s.imports].sort(),\n    dynamicImports: [...s.dynamics].sort(),\n    mocks: [...s.mocks].sort(),\n    unmocks: [...s.unmocks].sort(),\n  };\n});\n\nreturn JSON.stringify(output, null, 2);"}) failed in 95ms:
exec
/bin/zsh -lc 'for s in ../extractors/opencode-capture ../utils/input-normalizer ../core/workflow ../extractors/contamination-filter ../extractors/decision-extractor ../extractors/file-extractor ../core/file-writer ../core/memory-indexer ../core/quality-scorer ../extractors/quality-scorer ../extractors/session-extractor ../extractors/collect-session-data ../renderers/template-renderer ../utils/source-capabilities ../loaders/data-loader; do echo "=== $s ==="; rg -n --no-heading --glob '"'*.vitest.ts' --glob '*.test.ts' \""'$s" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/shared/parsing || true; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

exec
/bin/zsh -lc 'rg -n "transformOpencodeCapture|normalizeInputData|validateInputData|buildSessionSummaryObservation|buildTechnicalContextObservation|transformKeyDecision" .opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
14:import { transformOpencodeCapture } from '../utils/input-normalizer';
47:    const transformed = transformOpencodeCapture({
68:    const transformed = transformOpencodeCapture({
95:    const transformed = transformOpencodeCapture({
116:    const transformed = transformOpencodeCapture({
154:    const transformed = transformOpencodeCapture({
exec
/bin/zsh -lc 'rg -n "extractKeyTopics|buildProjectStateSnapshot|extractBlockers" .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:11:import { extractBlockers } from '../extractors/session-extractor';
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:322:    const blocker = extractBlockers([
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:12:import { buildProjectStateSnapshot } from '../extractors/session-extractor';
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:558:    const snapshot = buildProjectStateSnapshot({
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:4:import { extractKeyTopics as extractWorkflowTopics } from '../core/topic-extractor';
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:5:import { extractKeyTopics as extractSessionTopics } from '../extractors/session-extractor';
exec
/bin/zsh -lc 'rg -n "extractSessionTopics|extractWorkflowTopics" .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
4:import { extractKeyTopics as extractWorkflowTopics } from '../core/topic-extractor';
5:import { extractKeyTopics as extractSessionTopics } from '../extractors/session-extractor';
137:    const workflowTopics = extractWorkflowTopics(summaryText, decisions, '008-signal-extraction');
138:    const sessionTopics = extractSessionTopics(summaryText, decisions);
exec
/bin/zsh -lc "sed -n '110,180p' .opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      text,
      mode: 'topics',
      stopwordProfile: 'aggressive',
      ngramDepth: 1,
    });
    const depth4 = SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: 'aggressive',
      ngramDepth: 4,
    });

    expect(depth1.topics.some((topic) => topic.includes(' '))).toBe(false);
    expect(depth4.topics.some((topic) => topic.includes('workspace identity'))).toBe(true);
    expect(depth4.topics.length).toBeGreaterThan(0);
  });

  it('keeps workflow topics, session topics, and summary trigger phrases aligned on the same dominant concepts', () => {
    const summaryText = 'Implemented unified signal extraction for workspace identity alignment and adapter migration with deterministic trigger generation.';
    const decisions = [
exec
/bin/zsh -lc "rg -n \"collectSessionData\\(\" .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
875:    const sessionData = await collectSessionData(collectedData, '022-hybrid-rag-fusion');
882:    const sessionData = await collectSessionData({
exec
/bin/zsh -lc "rg -n --glob '*.vitest.ts' --glob '*.test.ts' \"\\b(writeFilesAtomically|indexMemory|updateMetadataEmbeddingStatus|updateMetadataWithEmbedding|runWorkflow|stripWorkflowHtmlOutsideCodeFences|collectSessionData|shouldAutoSave|extractPreflightPostflightData|calculateLearningIndex|getScoreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateResumeContext|filterContamination|getContaminationPatternLabels|extractDecisions_alias|extractDecisions|detectObservationType|extractFilesFromData|enhanceFilesWithSemanticDescriptions|buildObservationsWithAnchors|deduplicateObservations|captureConversation|getProjectId|getRecentSessions|getCurrentSession|getSessionMessages|getMessageParts|getSessionResponses|getToolExecutions|pathExists|readJsonSafe|readJsonlTail|scoreMemoryQuality|generateSessionId|getChannel|detectContextType|detectImportanceTier|detectProjectPhase|extractActiveFile|extractNextAction|extractBlockers|buildFileProgress|countToolsByType|calculateSessionDuration|calculateExpiryEpoch|detectRelatedDocs|extractKeyTopics|detectSessionCharacteristics|buildProjectStateSnapshot|loadCollectedData|inferPreferredCaptureSourceFromEnv|buildNativeCaptureOrder|populateTemplate|renderTemplate|cleanupExcessiveNewlines|stripTemplateConfigComments|isFalsy|transformKeyDecision|buildSessionSummaryObservation|buildTechnicalContextObservation|normalizeInputData|validateInputData|transformOpencodeCapture|transformOpenCodeCapture|getSourceCapabilities|isKnownDataSource|SOURCE_CAPABILITIES)\\b\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/shared/parsing" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:4:import { filterContamination, SEVERITY_RANK } from '../extractors/contamination-filter';
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:5:import { getSourceCapabilities } from '../utils/source-capabilities';
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:7:describe('filterContamination severity tracking', () => {
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:9:    const result = filterContamination('Let me check the logs. Let me read the config.');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:16:    const result = filterContamination('Let me check this. As an AI, I can help.');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:23:    const result = filterContamination('Decision: adopt deterministic scoring.');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:38:    const result = filterContamination("I'll execute this step by step");
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:45:    const result = filterContamination("Let me check. I'll now review.");
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:52:    const result = filterContamination("Modified via: I'll now handle the edge case");
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:60:    const result = filterContamination('API Error: 500 {"type":"error","error":{"type":"api_error"}}');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:68:    const result = filterContamination('Response was {"type": "error", "error": {"type": "overloaded_error"}}');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:76:    const result = filterContamination('Failed with "request_id": "req_011cz9eisjyoe5devttoidqk" in response');
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:84:    const result = filterContamination(
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:87:      { sourceCapabilities: getSourceCapabilities('claude-code-capture') },
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:96:    const result = filterContamination(
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:99:      { sourceCapabilities: getSourceCapabilities('codex-cli-capture') },
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:108:    const result = filterContamination(
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts:120:    const result = filterContamination('Read tool on /src/file.ts');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:2:// Ensures main() preserves explicit CLI targets into runWorkflow
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:8:  runWorkflow: vi.fn(async () => undefined),
exec
/bin/zsh -lc 'rg -n "inferPreferredCaptureSourceFromEnv|buildNativeCaptureOrder|loadCollectedData" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:9:  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:18:  loadCollectedData: harness.loadCollectedData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:44:    harness.loadCollectedData.mockClear();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:67:      loadDataFn: harness.loadCollectedData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:84:      loadDataFn: harness.loadCollectedData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:101:      loadDataFn: harness.loadCollectedData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:129:    expect(harness.loadCollectedData).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:155:    expect(harness.loadCollectedData).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:223:    expect(harness.loadCollectedData).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:238:    expect(harness.loadCollectedData).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:253:    expect(harness.loadCollectedData).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:38:      'title: "Analyzed loadCollectedData in data-loader.ts"',
.opencode/skill/system-spec-kit/scripts/tests/historical-memory-remediation.vitest.ts:48:      '# Analyzed loadCollectedData in data-loader.ts',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:67:describe('loadCollectedData explicit data-file handling', () => {
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:75:    const { loadCollectedData } = await import('../loaders/data-loader');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:77:    await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:94:      const { loadCollectedData } = await import('../loaders/data-loader');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:96:      await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:119:      const { loadCollectedData } = await import('../loaders/data-loader');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:121:      await expect(loadCollectedData({
exec
/bin/zsh -lc 'rg -n "populateTemplate|renderTemplate|cleanupExcessiveNewlines|stripTemplateConfigComments|isFalsy" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:391:    const { populateTemplate } = await import('../renderers');
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:397:      const rendered = await populateTemplate('context', {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:13:import { populateTemplate } from '../renderers';
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:119:  populateTemplate: vi.fn(async (_templateName: string, data: Record<string, unknown>) => [
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1327:    const populateTemplateMock = vi.mocked(populateTemplate);
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1328:    const previousImplementation = populateTemplateMock.getMockImplementation();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1329:    populateTemplateMock.mockImplementationOnce(async () => [
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1372:        populateTemplateMock.mockImplementation(previousImplementation);
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/scripts/renderers/index.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for template rendering modules
export {
  populateTemplate,
  renderTemplate,
  cleanupExcessiveNewlines,
  stripTemplateConfigComments,
  isFalsy,
} from './template-renderer';

export type { TemplateContext } from './template-renderer';
exec
/bin/zsh -lc "sed -n '370,430p' .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf-8');
      const frontmatter = rendered.match(/^---\n([\s\S]*?)\n---/m)?.[1] ?? '';

      expect(frontmatter).toContain('_sourceTranscriptPath: "/tmp/.claude/projects/spec-kit/session-xyz.jsonl"');
      expect(frontmatter).toContain('_sourceSessionId: "session-xyz"');
      expect(frontmatter).toContain('_sourceSessionCreated: 1763328000000');
      expect(frontmatter).toContain('_sourceSessionUpdated: 1763328300000');
      expect(frontmatter).toContain('captured_file_count: 3');
      expect(frontmatter).toContain('filesystem_file_count: 2');
      expect(frontmatter).toContain('git_changed_file_count: 1');
      expect(rendered).toContain('file_count: 2');
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('renders an empty trigger list when no trigger phrases are provided', async () => {
exec
/bin/zsh -lc 'rg -n "isKnownDataSource|SOURCE_CAPABILITIES" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc 'rg -n "shouldAutoSave|extractPreflightPostflightData|calculateLearningIndex|getScoreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateResumeContext|collectSessionData" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:10:  collectSessionData: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:22:  collectSessionData: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:45:    harness.collectSessionData.mockClear();
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:68:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:85:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:102:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:127:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:153:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:212:      collectSessionDataFn: harness.collectSessionData,
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:217:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(specFolderName || '014-rendered-memory-regression'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:297:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:356:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:546:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(specFolderName || '010-perfect-session-capturing'),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:624:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:694:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:762:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:844:        collectSessionDataFn: async (_input, specFolderName) => createSessionData(
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:684:    const sessionData = await collectSessionData(normalized, '022-hybrid-rag-fusion');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:721:    const sessionData = await collectSessionData(
exec
/bin/zsh -lc 'rg -n "transformKeyDecision|buildSessionSummaryObservation|buildTechnicalContextObservation|normalizeInputData|validateInputData|transformOpencodeCapture|transformOpenCodeCapture" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:13:import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:526:    const transformed = transformOpencodeCapture({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:578:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:629:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:660:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:691:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:728:    const normalizedAgain = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:740:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:751:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:766:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:782:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:810:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:842:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:884:    const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:14:import { transformOpencodeCapture } from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:47:    const transformed = transformOpencodeCapture({
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:68:    const transformed = transformOpencodeCapture({
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:95:    const transformed = transformOpencodeCapture({
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:116:    const transformed = transformOpencodeCapture({
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:154:    const transformed = transformOpencodeCapture({
exec
/bin/zsh -lc 'rg -n "getProjectId|getRecentPrompts|getSessionResponses|getToolExecutions|captureConversation|getRecentSessions|getCurrentSession|getSessionMessages|getMessageParts|pathExists|readJsonSafe|readJsonlTail|OPENCODE_STORAGE|PROMPT_HISTORY" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:18:const captureConversation = vi.hoisted(() => vi.fn(async () => null));
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:26:  captureConversation,
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:309:  captureConversation.mockReset();
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:314:  captureConversation.mockResolvedValue(options.statelessCapture ?? null);
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:368:  captureConversation.mockReset();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:15:const captureConversation = vi.fn(async () => null);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:22:  captureConversation,
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:42:  for (const mock of [captureConversation, captureClaudeConversation, captureCodexConversation, captureCopilotConversation, captureGeminiConversation]) {
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:82:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:101:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:126:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:149:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:185:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:230:      expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:255:    expect(captureConversation).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:271:    captureConversation.mockResolvedValueOnce(null);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:292:    expect(captureConversation).toHaveBeenCalledTimes(1);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:309:    captureConversation.mockResolvedValueOnce(null);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:331:    expect(captureConversation).toHaveBeenCalledTimes(1);
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:341:    captureConversation.mockResolvedValueOnce(null);
exec
/bin/zsh -lc 'rg -n "indexMemory|updateMetadataEmbeddingStatus|updateMetadataWithEmbedding" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:329:        indexMemory: mockedIndexMemory,
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:292:      typeof vectorIndex.indexMemory === 'function' ||
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:293:      typeof vectorIndex.indexMemoryDeferred === 'function',
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:8:  indexMemoryMock,
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:12:  indexMemoryMock: vi.fn(() => 42),
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:26:    indexMemory: indexMemoryMock,
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:44:import { indexMemory } from '../core/memory-indexer';
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:50:    indexMemoryMock.mockClear();
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:61:    const memoryId = await indexMemory(
.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts:74:    expect(indexMemoryMock).toHaveBeenCalledWith(expect.objectContaining({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:258:  indexMemory: vi.fn(async () => null),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:259:  updateMetadataEmbeddingStatus: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:260:  updateMetadataWithEmbedding: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1190:      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1191:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1245:      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1246:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1368:      expect(memoryIndexer.indexMemory).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1369:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:24:  indexMemory: vi.fn(async () => null),
exec
/bin/zsh -lc 'rg -n "writeFilesAtomically" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:192:  writeFilesAtomically: vi.fn(async (contextDir: string, files: Record<string, string>) => {
exec
/bin/zsh -lc "rg -n \"runWorkflow\\(|stripWorkflowHtmlOutsideCodeFences\\(\" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:375:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:425:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:477:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:515:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:542:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:588:    await expect(workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:621:    await expect(workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:636:    const first = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:644:    const second = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:695:    const first = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:701:    const second = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:733:    await expect(workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:753:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:784:    const result = await workflowModule.runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:310:    const cleaned = workflow.stripWorkflowHtmlOutsideCodeFences(testContent);
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:320:    const cleaned = workflow.stripWorkflowHtmlOutsideCodeFences(badContent);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:161:    const cleaned = stripWorkflowHtmlOutsideCodeFences(raw);
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:215:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:284:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:351:      const result = await runWorkflow({
exec
/bin/zsh -lc 'rg -n "generateSessionId|getChannel|detectContextType|detectImportanceTier|detectProjectPhase|extractActiveFile|extractNextAction|extractBlockers|buildFileProgress|countToolsByType|calculateSessionDuration|calculateExpiryEpoch|detectRelatedDocs|extractKeyTopics|detectSessionCharacteristics|buildProjectStateSnapshot" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:11:import { extractBlockers } from '../extractors/session-extractor';
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:322:    const blocker = extractBlockers([
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:780:describe('extractNextAction recentContext regex fallback', () => {
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:4:import { extractKeyTopics as extractWorkflowTopics } from '../core/topic-extractor';
.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:5:import { extractKeyTopics as extractSessionTopics } from '../extractors/session-extractor';
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:12:import { buildProjectStateSnapshot } from '../extractors/session-extractor';
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts:558:    const snapshot = buildProjectStateSnapshot({
exec
/bin/zsh -lc "sed -n '1,130p' .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { describe, expect, it } from 'vitest';

import {
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
} from '../memory/validate-memory-quality';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('validation rule metadata', () => {
  it('marks V10 as a soft rule that still allows write and index', () => {
    const metadata = getRuleMetadata('V10');

    expect(metadata.severity).toBe('low');
    expect(metadata.blockOnWrite).toBe(false);
    expect(metadata.blockOnIndex).toBe(false);
    expect(shouldBlockWrite('V10', 'opencode-capture')).toBe(false);
    expect(shouldBlockIndex('V10', 'opencode-capture')).toBe(false);
    expect(determineValidationDisposition(['V10'], 'opencode-capture')).toMatchObject({
exec
/bin/zsh -lc 'rg -n "function (writeFilesAtomically|checkForDuplicateContent|validateNoLeakedPlaceholders|validateContentSubstance|validateAnchors|updateMetadataEmbeddingStatus|updateMetadataWithEmbedding|buildNativeCaptureOrder|inferPreferredCaptureSourceFromEnv|loadCollectedData|renderTemplate|cleanupExcessiveNewlines|stripTemplateConfigComments|isFalsy|getContaminationPatternLabels|buildObservationsWithAnchors|deduplicateObservations|enhanceFilesWithSemanticDescriptions|getRecentSessions|getCurrentSession|getSessionMessages|getMessageParts|getSessionResponses|getToolExecutions|readJsonSafe|readJsonlTail|pathExists|calculateLearningIndex|determineSessionStatus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateResumeContext|shouldAutoSave|isKnownDataSource)" .opencode/skill/system-spec-kit/scripts/core/file-writer.ts .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:56:function isFalsy(value: unknown): boolean {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:66:function cleanupExcessiveNewlines(text: string): string {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:77:function stripTemplateConfigComments(text: string): string {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:96:function renderTemplate(template: string, data: TemplateContext, parentData: TemplateContext = {}): string {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:283:function inferPreferredCaptureSourceFromEnv(env: NodeJS.ProcessEnv = process.env): CaptureDataSource | null {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:312:function buildNativeCaptureOrder(preferredCaptureSource: CaptureDataSource | null): CaptureDataSource[] {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:481:async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:275:function enhanceFilesWithSemanticDescriptions(
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:330:function buildObservationsWithAnchors(
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:381:function deduplicateObservations(observations: ObservationInput[]): ObservationInput[] {
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:125:function getContaminationPatternLabels(denylist: readonly DenylistPattern[] = DEFAULT_DENYLIST): string[] {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:58:function isKnownDataSource(source: string): source is KnownDataSource {
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:64:function validateContentSubstance(content: string, filename: string): void {
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:83:async function checkForDuplicateContent(
.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:112:export async function writeFilesAtomically(
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:149:async function updateMetadataWithEmbedding(contextDir: string, memoryId: number): Promise<void> {
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:156:async function updateMetadataEmbeddingStatus(
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:157:function calculateLearningIndex(
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:339:function determineSessionStatus(
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:396:function estimateCompletionPercent(
exec
/bin/zsh -lc 'rg -n "extractPreflightPostflightData|getScoreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|generateContextSummary|generateResumeContext" .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
125:function getScoreAssessment(score: number | null | undefined, metric: string): string {
143:function getTrendIndicator(delta: number | null | undefined, invertedBetter: boolean = false): string {
172:function extractPreflightPostflightData(collectedData: CollectedDataFull | null): PreflightPostflightResult {
207:    PREFLIGHT_KNOW_ASSESSMENT: getScoreAssessment(preflight?.knowledgeScore, 'knowledge'),
208:    PREFLIGHT_UNCERTAINTY_ASSESSMENT: getScoreAssessment(preflight?.uncertaintyScore, 'uncertainty'),
209:    PREFLIGHT_CONTEXT_ASSESSMENT: getScoreAssessment(preflight?.contextScore, 'context'),
257:      DELTA_KNOW_TREND: getTrendIndicator(deltaKnow, false),
258:      DELTA_UNCERTAINTY_TREND: getTrendIndicator(deltaUncert, true),
259:      DELTA_CONTEXT_TREND: getTrendIndicator(deltaContext, false),
261:      LEARNING_SUMMARY: generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex)
280:function generateLearningSummary(
510:function generateContextSummary(
546:function generateResumeContext(
593:function buildContinueSessionData(params: ContinueSessionParams): ContinueSessionData {
605:  const contextSummary = generateContextSummary(summary, observations, projectPhase, decisionCount);
606:  const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
901:  const preflightPostflightData = extractPreflightPostflightData(data);
903:  const continueSessionData = buildContinueSessionData({
994:  extractPreflightPostflightData,
996:  getScoreAssessment,
exec
/bin/zsh -lc 'rg -n "updateMetadataEmbeddingStatus|updateMetadataWithEmbedding|buildNativeCaptureOrder|inferPreferredCaptureSourceFromEnv|getContaminationPatternLabels|buildObservationsWithAnchors|deduplicateObservations|enhanceFilesWithSemanticDescriptions|getRecentSessions|getCurrentSession|getSessionMessages|getMessageParts|getSessionResponses|getToolExecutions|readJsonSafe|readJsonlTail|pathExists|shouldAutoSave|extractPreflightPostflightData|getScoreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|generateContextSummary|generateResumeContext|isKnownDataSource|SOURCE_CAPABILITIES|renderTemplate|cleanupExcessiveNewlines|stripTemplateConfigComments|isFalsy|writeFilesAtomically" .opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts .opencode/skill/system-spec-kit/shared/parsing/*.test.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:25:  updateMetadataEmbeddingStatus: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:26:  updateMetadataWithEmbedding: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:115:  enhanceFilesWithSemanticDescriptions: vi.fn((files) => files),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:192:  writeFilesAtomically: vi.fn(async (contextDir: string, files: Record<string, string>) => {
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:259:  updateMetadataEmbeddingStatus: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:260:  updateMetadataWithEmbedding: vi.fn(async () => undefined),
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1191:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1246:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1369:      expect(memoryIndexer.updateMetadataWithEmbedding).not.toHaveBeenCalled();
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/file-writer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: File Writer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. FILE WRITER
// ───────────────────────────────────────────────────────────────
// Atomic file writing with validation and rollback on failure

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

const MIN_SUBSTANCE_CHARS = 200;
const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

function verifyResolvedWriteTarget(
  resolvedContextDir: string,
exec
/bin/zsh -lc "sed -n '240,390p' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  opencode: 'opencode-capture',
  'opencode-capture': 'opencode-capture',
  claude: 'claude-code-capture',
  'claude-code': 'claude-code-capture',
  'claude-code-capture': 'claude-code-capture',
  codex: 'codex-cli-capture',
  'codex-cli': 'codex-cli-capture',
  'codex-cli-capture': 'codex-cli-capture',
  copilot: 'copilot-cli-capture',
  'copilot-cli': 'copilot-cli-capture',
  'copilot-cli-capture': 'copilot-cli-capture',
  gemini: 'gemini-cli-capture',
  'gemini-cli': 'gemini-cli-capture',
  'gemini-cli-capture': 'gemini-cli-capture',
};

function normalizePreferredCaptureSource(rawValue: string | null | undefined): CaptureDataSource | null {
  if (!rawValue) {
    return null;
  }
exec
/bin/zsh -lc "sed -n '430,585p' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
      try {
        const conversation = await copilotCliCapture.captureCopilotConversation(20, projectRoot);
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from Copilot CLI`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          const data = transformOpencodeCapture(conversation, specFolderArg, 'copilot-cli-capture');
          return { ...data, _source: 'copilot-cli-capture' } as LoadedData;
        }

        structuredLog('debug', 'Copilot CLI capture returned empty data', { projectRoot });
        console.log('   ⚠️  Copilot CLI capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'Copilot CLI capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  Copilot CLI capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }

exec
/bin/zsh -lc "sed -n '1,230p' .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Template Renderer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TEMPLATE RENDERER
// ───────────────────────────────────────────────────────────────
// Mustache-based template engine — renders memory files from collected session data

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../core';
import { structuredLog } from '../utils/logger';

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────
exec
/bin/zsh -lc "sed -n '120,240p' .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
interface NativeExportPayload {
  info?: Record<string, unknown>;
  messages?: NativeExportMessage[];
}

/* ───────────────────────────────────────────────────────────────
   2. STORAGE PATHS
------------------------------------------------------------------*/

const OPENCODE_STORAGE: string = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/share/opencode/storage',
);

const PROMPT_HISTORY: string = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/state/opencode/prompt-history.jsonl',
);

const nativeSessionMessageCache = new Map<string, MessageInfo[]>();
exec
/bin/zsh -lc "sed -n '470,730p' .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
            continue;
          }

          const score = scoreSessionDirectoryMatch(session.directory);
          if (score === 0) {
            continue;
          }

          const sessionTime = session.time as Record<string, unknown> | undefined;
          const updatedRaw = typeof sessionTime?.updated === 'number' ? sessionTime.updated : 0;
          const updated = Number.isFinite(updatedRaw) ? updatedRaw : 0;

          if (
            bestMatch === null
            || score > bestMatch.score
            || (score === bestMatch.score && updated > bestMatch.updated)
          ) {
            bestMatch = { projectId, score, updated };
          }
        } catch {
exec
/bin/zsh -lc "sed -n '730,860p' .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  if (!projectId) {
    throw new Error(`No OpenCode sessions found for: ${directory}`);
  }

  const session = await getCurrentSession(projectId);
  if (!session) {
    throw new Error('No active session found');
  }

  // RC-1/RC-8: Scope prompts to the active session's time range
  const prompts = await getRecentPrompts(maxMessages, session.created, session.updated);
  const messages = await getSessionMessages(session.id);
  const responses = await getSessionResponses(session.id);
  const toolCalls = await getToolExecutions(session.id);
  const exchanges = buildExchanges(prompts, messages, responses, maxMessages);
  const capturedAt = new Date().toISOString();

  return {
    session_id: session.id,
    sessionId: session.id,
codex
I’ve confirmed export-level usage gaps and I’m now finalizing a stricter source-to-test map using exact module-specifier matches (so string mentions of file paths don’t inflate coverage). This will drive the final per-file case counts and zero/partial flags.
exec
/bin/zsh -lc 'for s in ../extractors/opencode-capture ../utils/input-normalizer ../core/workflow ../extractors/contamination-filter ../extractors/decision-extractor ../extractors/file-extractor ../core/file-writer ../core/memory-indexer ../core/quality-scorer ../extractors/quality-scorer ../extractors/session-extractor ../extractors/collect-session-data ../renderers/template-renderer ../utils/source-capabilities ../loaders/data-loader; do echo "=== $s ==="; rg -l --glob '"'*.vitest.ts' --glob '*.test.ts' \"['\\\"]"'${s}['"'\\\"]\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/shared/parsing | sort; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 28ms:
=== ../utils/source-capabilities ===
.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
=== ../loaders/data-loader ===
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
exec
/bin/zsh -lc 'for s in ../extractors/opencode-capture ../utils/input-normalizer ../core/workflow ../extractors/contamination-filter ../extractors/decision-extractor ../extractors/file-extractor ../core/file-writer ../core/memory-indexer ../core/quality-scorer ../extractors/quality-scorer ../extractors/session-extractor ../extractors/collect-session-data ../renderers/template-renderer ../utils/source-capabilities ../loaders/data-loader; do echo "=== $s (mocked) ==="; rg -l --glob '"'*.vitest.ts' --glob '*.test.ts' \"vi\\.(mock|doMock)\\(['\\\"]"'${s}['"'\\\"]\" .opencode/skill/system-spec-kit/scripts/tests .opencode/skill/system-spec-kit/shared/parsing | sort; done" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 16ms:
=== ../loaders/data-loader (mocked) ===
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"),path=require(\"path\");const root=\".opencode/skill/system-spec-kit\";const sources=[\"../extractors/opencode-capture\",\"../utils/input-normalizer\",\"../core/workflow\",\"../extractors/contamination-filter\",\"../extractors/decision-extractor\",\"../extractors/file-extractor\",\"../core/file-writer\",\"../core/memory-indexer\",\"../core/quality-scorer\",\"../extractors/quality-scorer\",\"../extractors/session-extractor\",\"../extractors/collect-session-data\",\"../renderers/template-renderer\",\"../utils/source-capabilities\",\"../loaders/data-loader\"];const tests=[];const walk=d=>{for(const ent of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,ent.name);if(ent.isDirectory()){if([\"node_modules\",\"dist\",\".git\"].includes(ent.name))continue;walk(p);}else if(/\\.(vitest|test)\\.ts"'$/.test(p))tests.push(p);}};walk(root);const esc=s=>s.replace(/[.*+?''^${}()|['"\\]\\\\]/g,\"\\\\"'$&");const q="['"\\\"\\\\x27]\";const caseCount=t=>(t.match(/\\b(?:it|test)(?:\\.[A-Za-z_]+)*\\s*\\(/g)||[]).length;const out=[];for(const src of sources){const refRe=new RegExp(q+esc(src)+q);const mockRe=new RegExp(\"vi\\\\.(?:mock|doMock)\\\\(\\\\s*\"+q+esc(src)+q);const refs=[];const mocks=[];for(const f of tests){const text=fs.readFileSync(f,\"utf8\");if(refRe.test(text))refs.push({f,text});if(mockRe.test(text))mocks.push(f);}const mockSet=new Set(mocks);const nonMock=refs.filter(r=>"'!mockSet.has(r.f));const unique=[...new Map(nonMock.map(r=>[r.f,r])).values()];out.push({source:src,refFiles:refs.map(r=>r.f).sort(),mockFiles:[...mockSet].sort(),activeFiles:unique.map(r=>r.f).sort(),activeCaseTotal:unique.reduce((a,b)=>a+caseCount(b.text),0)});}console.log(JSON.stringify(out,null,2));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 147ms:
[
  {
    "source": "../extractors/opencode-capture",
    "refFiles": [
      ".opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts"
    ],
    "mockFiles": [
      ".opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts",
      ".opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts"
    ],
    "activeFiles": [
      ".opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts"
    ],
    "activeCaseTotal": 4
  },
  {
    "source": "../utils/input-normalizer",
    "refFiles": [
exec
/bin/zsh -lc "rg -l --glob '*.vitest.ts' \"['\\\"]../renderers['\\\"]\" .opencode/skill/system-spec-kit/scripts/tests | sort" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
codex
Coverage assessment done for `.opencode/skill/system-spec-kit/` using exact test-module references (and excluding mock-only references as “real coverage”).

| Source file | Corresponding active test file(s) | Test cases (in active files) | Status |
|---|---|---:|---|
| `opencode-capture.ts` | `opencode-capture.vitest.ts` | 4 | Partial |
| `input-normalizer.ts` | `runtime-memory-inputs.vitest.ts`, `stateless-enrichment.vitest.ts` | 43 | Partial |
| `workflow.ts` | `workflow-e2e.vitest.ts`, `task-enrichment.vitest.ts`, `memory-render-fixture.vitest.ts`, `auto-detection-fixes.vitest.ts` | 89 | Partial |
| `contamination-filter.ts` | `contamination-filter.vitest.ts` | 14 | Partial |
| `decision-extractor.ts` | `decision-confidence.vitest.ts`, `auto-detection-fixes.vitest.ts` | 20 | Partial |
| `file-extractor.ts` | `description-enrichment.vitest.ts`, `phase-classification.vitest.ts` | 12 | Partial |
| `file-writer.ts` | none (mocked only) | 0 | **Zero direct coverage** |
| `memory-indexer.ts` | `memory-indexer-weighting.vitest.ts` | 1 | Partial |
| `quality-scorer.ts` (`core/quality-scorer.ts`) | `quality-scorer-calibration.vitest.ts`, `description-enrichment.vitest.ts` | 13 | Partial |
| `session-extractor.ts` | `semantic-signal-golden.vitest.ts`, `stateless-enrichment.vitest.ts`, `auto-detection-fixes.vitest.ts` | 35 | Partial |
| `collect-session-data.ts` | `runtime-memory-inputs.vitest.ts`, `task-enrichment.vitest.ts` | 80 | Partial |
| `template-renderer.ts` | none direct (only indirect via `../renderers` barrel) | 0 direct | **Zero direct coverage** |
| `source-capabilities.ts` | `contamination-filter.vitest.ts`, `validation-rule-metadata.vitest.ts` | 19 | Partial |
| `data-loader.ts` | `runtime-memory-inputs.vitest.ts` | 27 | Partial |

Notes:
- There are two `quality-scorer.ts` files; `scripts/extractors/quality-scorer.ts` is mock-referenced only (effectively zero direct coverage).
- Total relevant tests touching this pipeline: ~187 unique test cases across referenced suites.
- By export-surface sampling, effective explicit API exercise is roughly “about a quarter” (many exported helpers are never called in tests).

## 2) ZERO coverage files
- `scripts/core/file-writer.ts`
- `scripts/renderers/template-renderer.ts` (direct)
- Also zero direct: `scripts/extractors/quality-scorer.ts` (duplicate module not in your 14-item list but relevant)

## 3) Partial coverage files
All other listed files are partial; none of the listed modules appears fully covered at export/path level.

## 4) Top 10 untested paths by risk
1. Atomic write rollback/restore path in [`file-writer.ts:112`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:112)
2. Capture-source env inference precedence in [`data-loader.ts:283`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:283)
3. Native capture ordering logic in [`data-loader.ts:312`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:312)
4. Metadata embedding-success update path in [`memory-indexer.ts:149`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:149)
5. Metadata embedding-status update path in [`memory-indexer.ts:156`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:156)
6. OpenCode filesystem fallback retrieval chain (`getSessionMessages/getMessageParts/getSessionResponses/getToolExecutions`) in [`opencode-capture.ts:555`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:555)
7. OpenCode low-level JSON/JSONL readers and fault handling in [`opencode-capture.ts:146`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:146)
8. Continue-session heuristics (`buildContinueSessionData` + summary/resume helpers) in [`collect-session-data.ts:593`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:593)
9. File observation enrichment/dedup pipeline in [`file-extractor.ts:275`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:275)
10. Template rendering internals (`renderTemplate`, comment stripping, falsy semantics) in [`template-renderer.ts:96`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:96)

## 5) Estimate for the “67 remaining items”
Estimated catch potential with better targeted tests: **~55–65%** (point estimate: **~60%**, about **40 of 67**).  
Rationale: highest-risk untested paths are in write/index/render/fallback logic where regressions are typically high-impact and currently under-tested.
tokens used
296,419
Coverage assessment done for `.opencode/skill/system-spec-kit/` using exact test-module references (and excluding mock-only references as “real coverage”).

| Source file | Corresponding active test file(s) | Test cases (in active files) | Status |
|---|---|---:|---|
| `opencode-capture.ts` | `opencode-capture.vitest.ts` | 4 | Partial |
| `input-normalizer.ts` | `runtime-memory-inputs.vitest.ts`, `stateless-enrichment.vitest.ts` | 43 | Partial |
| `workflow.ts` | `workflow-e2e.vitest.ts`, `task-enrichment.vitest.ts`, `memory-render-fixture.vitest.ts`, `auto-detection-fixes.vitest.ts` | 89 | Partial |
| `contamination-filter.ts` | `contamination-filter.vitest.ts` | 14 | Partial |
| `decision-extractor.ts` | `decision-confidence.vitest.ts`, `auto-detection-fixes.vitest.ts` | 20 | Partial |
| `file-extractor.ts` | `description-enrichment.vitest.ts`, `phase-classification.vitest.ts` | 12 | Partial |
| `file-writer.ts` | none (mocked only) | 0 | **Zero direct coverage** |
| `memory-indexer.ts` | `memory-indexer-weighting.vitest.ts` | 1 | Partial |
| `quality-scorer.ts` (`core/quality-scorer.ts`) | `quality-scorer-calibration.vitest.ts`, `description-enrichment.vitest.ts` | 13 | Partial |
| `session-extractor.ts` | `semantic-signal-golden.vitest.ts`, `stateless-enrichment.vitest.ts`, `auto-detection-fixes.vitest.ts` | 35 | Partial |
| `collect-session-data.ts` | `runtime-memory-inputs.vitest.ts`, `task-enrichment.vitest.ts` | 80 | Partial |
| `template-renderer.ts` | none direct (only indirect via `../renderers` barrel) | 0 direct | **Zero direct coverage** |
| `source-capabilities.ts` | `contamination-filter.vitest.ts`, `validation-rule-metadata.vitest.ts` | 19 | Partial |
| `data-loader.ts` | `runtime-memory-inputs.vitest.ts` | 27 | Partial |

Notes:
- There are two `quality-scorer.ts` files; `scripts/extractors/quality-scorer.ts` is mock-referenced only (effectively zero direct coverage).
- Total relevant tests touching this pipeline: ~187 unique test cases across referenced suites.
- By export-surface sampling, effective explicit API exercise is roughly “about a quarter” (many exported helpers are never called in tests).

## 2) ZERO coverage files
- `scripts/core/file-writer.ts`
- `scripts/renderers/template-renderer.ts` (direct)
- Also zero direct: `scripts/extractors/quality-scorer.ts` (duplicate module not in your 14-item list but relevant)

## 3) Partial coverage files
All other listed files are partial; none of the listed modules appears fully covered at export/path level.

## 4) Top 10 untested paths by risk
1. Atomic write rollback/restore path in [`file-writer.ts:112`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:112)
2. Capture-source env inference precedence in [`data-loader.ts:283`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:283)
3. Native capture ordering logic in [`data-loader.ts:312`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:312)
4. Metadata embedding-success update path in [`memory-indexer.ts:149`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:149)
5. Metadata embedding-status update path in [`memory-indexer.ts:156`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:156)
6. OpenCode filesystem fallback retrieval chain (`getSessionMessages/getMessageParts/getSessionResponses/getToolExecutions`) in [`opencode-capture.ts:555`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:555)
7. OpenCode low-level JSON/JSONL readers and fault handling in [`opencode-capture.ts:146`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:146)
8. Continue-session heuristics (`buildContinueSessionData` + summary/resume helpers) in [`collect-session-data.ts:593`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:593)
9. File observation enrichment/dedup pipeline in [`file-extractor.ts:275`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:275)
10. Template rendering internals (`renderTemplate`, comment stripping, falsy semantics) in [`template-renderer.ts:96`](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:96)

## 5) Estimate for the “67 remaining items”
Estimated catch potential with better targeted tests: **~55–65%** (point estimate: **~60%**, about **40 of 67**).  
Rationale: highest-risk untested paths are in write/index/render/fallback logic where regressions are typically high-impact and currently under-tested.
