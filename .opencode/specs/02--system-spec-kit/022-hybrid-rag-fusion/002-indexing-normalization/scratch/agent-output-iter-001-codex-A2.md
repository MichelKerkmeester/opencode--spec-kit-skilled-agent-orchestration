OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d0aa0-2bc6-7d51-89ab-b3fa8639a6c0
--------
user
You are a software architect performing a structural review of a TypeScript indexing/normalization system.

TASK: Analyze the architecture and modularity of these files:

Primary files (READ ALL):
1. .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts (1,157 lines)
2. .opencode/skill/system-spec-kit/scripts/core/workflow.ts (2,482 lines)
3. .opencode/skill/system-spec-kit/scripts/types/session-types.ts (534 lines)

Specific questions to answer:
1. Does input-normalizer.ts violate SRP? It's 1,157 lines - what are the distinct responsibilities?
2. Propose a decomposition plan if SRP is violated. What modules would you extract?
3. Is workflow.ts (2,482 lines) too large? What's its cyclomatic complexity profile?
4. Are there circular dependencies between these files?
5. Is the type hierarchy in session-types.ts well-designed? Are there redundant interfaces?
6. What coupling exists between input-normalizer.ts and spec-affinity.ts? Is it warranted?
7. Are there opportunities for better abstraction (strategy pattern, pipeline pattern)?
8. How well do the module boundaries align with domain concepts?

OUTPUT FORMAT: For each finding, provide:
- FINDING-ID (e.g., ARCH-001, SRP-001, COUPLING-001)
- Impact: HIGH / MEDIUM / LOW
- Description with evidence
- Recommendation (specific, actionable)

Read the entire files. Map the function call graph before drawing conclusions.
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a read-only architectural review: I’ll load the relevant review standards, inspect all three files in full, and build a concrete call/dependency map before making any claims.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code--opencode/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code--review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code--review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code--review` and paired with one `sk-code--*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
 succeeded in 0ms:
---
name: sk-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.2.0.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.


## 1. WHEN TO USE

### Activation Triggers

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Architectural review of TypeScript indexing/normalization system across input-normalizer.ts, workflow.ts, and session-types.ts; assess SRP, decomposition, cyclomatic complexity, circular dependencies, coupling, abstractions, and domain boundaries" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !session, !session(multi), context, memory"
  },
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), review(name)"
  },
  {
    "skill": "sk-code--opencode",
    "kind": "skill",
codex
SKILL ROUTING: `system-spec-kit`, `sk-code--review`, and `sk-code--opencode` all passed threshold; I’m using the review baseline plus the OpenCode overlay, and I’ll pull only the spec-kit context I need for these session/workflow modules.
exec
/bin/zsh -lc 'wc -l .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/types/session-types.ts .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    1217 .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
    2494 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
     534 .opencode/skill/system-spec-kit/scripts/types/session-types.ts
     546 .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
    4791 total
exec
/bin/zsh -lc "sed -n '1,200p' package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: package.json: No such file or directory
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
codex
I’ve confirmed the target sizes and loaded the review overlays. Next I’m mapping imports, exports, and cross-file references so the SRP and coupling conclusions are grounded in actual call paths rather than file length alone.
tool cocoindex_code.search({"query":"input normalization workflow session types spec affinity architecture normalization pipeline session","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":"typescript","limit":10,"refresh_index":true})
cocoindex_code.search({"query":"input normalization workflow session types spec affinity architecture normalization pipeline session","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":"typescript","limit":10,"refresh_index":true}) failed in 9ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
exec
/bin/zsh -lc "rg --files -g 'package.json' -g 'tsconfig*.json' ." in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/package.json
./.opencode/skill/mcp-code-mode/mcp_server/tsconfig.json
./.opencode/skill/mcp-code-mode/mcp_server/package.json
./.opencode/skill/system-spec-kit/mcp_server/tsconfig.json
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/tsconfig.json
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/package.json
./.opencode/skill/system-spec-kit/scripts/tsconfig.json
./.opencode/skill/system-spec-kit/tsconfig.json
./.opencode/skill/system-spec-kit/package.json
./.opencode/skill/system-spec-kit/mcp_server/package.json
./.opencode/skill/system-spec-kit/shared/tsconfig.json
./.opencode/skill/system-spec-kit/shared/package.json
./.opencode/skill/system-spec-kit/scripts/package.json
exec
/bin/zsh -lc "node - <<'NODE'
const fs=require('fs');
const paths=[
'.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts',
'.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
'.opencode/skill/system-spec-kit/scripts/types/session-types.ts',
'.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts'
];
for (const p of paths){
  const s=fs.readFileSync(p,'utf8');
  const imports=[...s.matchAll(/"'^import'"\\s+.*?from\\s+['\\\"](.*?)['\\\"];?/gm)].map(m=>m[1]);
  const exports=[...s.matchAll(/"'^export'"\\s+(?:async\\s+)?(?:function|class|interface|type|const|enum)\\s+([A-Za-z0-9_]+)/gm)].map(m=>m[1]);
  console.log('\\nFILE',p);
  console.log('IMPORTS',JSON.stringify(imports,null,2));
  console.log('EXPORTS',JSON.stringify(exports,null,2));
}
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

FILE .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
IMPORTS [
  "./logger"
]
EXPORTS [
  "DataSource",
  "CaptureDataSource",
  "Observation",
  "UserPrompt",
  "RecentContext",
  "FileEntry",
  "RawInputData",
  "DecisionItemObject",
  "NormalizedData",
  "CaptureExchange",
  "CaptureToolCall",
  "OpencodeCapture",
  "TransformedCapture"
]
codex
One quick correction: the first import/export scrape undercounted `input-normalizer.ts`, so I’m switching to AST-backed inspection for the dependency graph and complexity metrics. That should give us cleaner evidence for the review.
tool cocoindex_code.search({"query":"input normalization workflow session types spec affinity architecture normalization pipeline session","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":["typescript"],"limit":10,"refresh_index":true})
cocoindex_code.search({"query":"input normalization workflow session types spec affinity architecture normalization pipeline session","paths":[".opencode/skill/system-spec-kit/scripts/**/*.ts"],"languages":["typescript"],"limit":10,"refresh_index":true}) success in 1.12s:
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
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tsconfig.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@spec-kit/shared/*": ["../shared/*"],
      "@spec-kit/mcp-server/*": ["../mcp_server/*"]
    }
  },
  "references": [
    { "path": "../shared" },
    { "path": "../mcp_server" }
  ],
  "include": [
    "*.ts",
    "core/**/*.ts",
    "evals/**/*.ts",
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
{
  "name": "@spec-kit/scripts",
  "version": "1.7.2",
  "description": "CLI tools for spec-kit context generation and memory management",
  "type": "commonjs",
  "main": "dist/memory/generate-context.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "tsc --build",
    "lint": "tsc --noEmit",
    "test": "vitest run --config ../mcp_server/vitest.config.ts --root .",
    "check:ast": "npx tsx evals/check-no-mcp-lib-imports-ast.ts && npx tsx evals/check-handler-cycles-ast.ts",
    "check": "npm run lint && npx tsx evals/check-no-mcp-lib-imports.ts && bash check-api-boundary.sh && npx tsx evals/check-architecture-boundaries.ts && npx tsx evals/check-allowlist-expiry.ts && npx tsx evals/check-source-dist-alignment.ts"
  },
  "dependencies": {
    "better-sqlite3": "12.6.2",
    "sqlite-vec": "0.1.7-alpha.2"
  },
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/package.json" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
{
  "type": "module",
  "dependencies": {
    "@opencode-ai/plugin": "1.2.27"
  }
}
exec
/bin/zsh -lc "node -p \"require.resolve('tsx')\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scriptsexec
/bin/zsh -lc "node -p \"require.resolve('typescript')\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript.js
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs
codex
I’ve got local TypeScript tooling available, so I’m generating a proper structural report now: top-level declarations, import graph, per-function complexity estimates, and the internal call graph across the target files plus `spec-affinity.ts`.
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('typescript');
const path = require('path');
const fs = require('fs');

const files = [
  '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts',
  '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
  '.opencode/skill/system-spec-kit/scripts/types/session-types.ts',
  '.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts',
].map(f => path.resolve(f));
const fileSet = new Set(files);

function read(file){ return fs.readFileSync(file,'utf8'); }
function parse(file){ return ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS); }

function importInfo(sf){
  const imports=[];
  sf.forEachChild(node=>{
    if(ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)){
      const spec=node.moduleSpecifier.text;
      let resolved=null;
      if(spec.startsWith('.')){
        const base=path.resolve(path.dirname(sf.fileName), spec);
        for(const ext of ['.ts','.tsx','.d.ts','/index.ts']){
          const candidate=base.endsWith(ext)?base:base+ext;
          if(fs.existsSync(candidate)){ resolved=candidate; break; }
        }
        if("'!resolved && fs.existsSync(base)) resolved=base;
      }
      const bindings=[];
      if(node.importClause){
        if(node.importClause.name) bindings.push({kind:'"'default',name:node.importClause.name.text});
        const nb=node.importClause.namedBindings;
        if(nb){
          if(ts.isNamespaceImport(nb)) bindings.push({kind:'namespace',name:nb.name.text});
          if(ts.isNamedImports(nb)){
            for(const el of nb.elements){
              bindings.push({kind:'named',name:el.name.text,property:el.propertyName?.text||el.name.text});
            }
          }
        }
      }
      imports.push({spec,resolved,bindings});
    }
  });
  return imports;
}

function exportNames(sf){
  const names=[];
  sf.forEachChild(node=>{
    const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    const isExport = "'!!mods?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword);
    if(!isExport) return;
    if(node.name && node.name.text) names.push({kind:ts.SyntaxKind[node.kind],name:node.name.text});
    else if(ts.isVariableStatement(node)){
      for(const d of node.declarationList.declarations){ if(ts.isIdentifier(d.name)) names.push({kind:'"'Variable',name:d.name.text}); }
    }
  });
  return names;
}

function decisionCount(node){
  let c=1;
  function visit(n){
    switch(n.kind){
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.CaseClause:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ConditionalExpression:
        c++; break;
      case ts.SyntaxKind.BinaryExpression: {
        const op = n.operatorToken.kind;
        if(op===ts.SyntaxKind.AmpersandAmpersandToken || op===ts.SyntaxKind.BarBarToken || op===ts.SyntaxKind.QuestionQuestionToken) c++;
        break;
      }
    }
    ts.forEachChild(n, visit);
  }
  if(node.body) ts.forEachChild(node.body, visit);
  return c;
}

function gatherNames(scopeNode){
  const names = new Set();
  function addBinding(name){
    if(ts.isIdentifier(name)) names.add(name.text);
    else if(ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)){
      for(const e of name.elements||[]){ if(e.name) addBinding(e.name); }
    }
  }
  function visit(n){
    if(ts.isParameter(n) || ts.isVariableDeclaration(n) || ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n) || ts.isMethodDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)){
      if(n.name) addBinding(n.name);
      if((ts.isFunctionDeclaration(n)||ts.isMethodDeclaration(n)||ts.isFunctionExpression(n)||ts.isArrowFunction(n)) && n.parameters){
        for(const p of n.parameters) addBinding(p.name);
      }
    }
    ts.forEachChild(n, visit);
  }
  if(scopeNode.body) ts.forEachChild(scopeNode.body, visit); else ts.forEachChild(scopeNode, visit);
  return names;
}

function functionsInfo(sf, imports){
  const importedNames = new Map();
  for(const imp of imports){ for(const b of imp.bindings){ importedNames.set(b.name, imp.spec); } }
  const topLevel = new Map();
  sf.forEachChild(node=>{
    if((ts.isFunctionDeclaration(node)||ts.isClassDeclaration(node)||ts.isInterfaceDeclaration(node)||ts.isTypeAliasDeclaration(node)||ts.isEnumDeclaration(node)) && node.name){ topLevel.set(node.name.text, node); }
    if(ts.isVariableStatement(node)) for(const d of node.declarationList.declarations){ if(ts.isIdentifier(d.name)) topLevel.set(d.name.text,d); }
  });
  const fns=[];
  function record(name,node,container){
    const localNames = gatherNames(node);
    const calls=[];
    function visit(n){
      if(ts.isCallExpression(n)){
        let callee=''; let kind='unknown'; let source='external';
        if(ts.isIdentifier(n.expression)){
          callee=n.expression.text;
          kind='identifier';
          if(topLevel.has(callee)) source='local';
          else if(importedNames.has(callee)) source='import:'+importedNames.get(callee);
          else if(localNames.has(callee)) source='nested/local';
        } else if(ts.isPropertyAccessExpression(n.expression)){
          callee=n.expression.getText(sf);
          kind='property';
          const left=n.expression.expression;
          if(ts.isIdentifier(left) && importedNames.has(left.text)) source='importns:'+importedNames.get(left.text);
          else if(ts.isThis(left)) source='this';
        }
        calls.push({callee,kind,source});
      }
      ts.forEachChild(n, visit);
    }
    if(node.body) ts.forEachChild(node.body, visit);
    fns.push({name,container,complexity:decisionCount(node),calls});
  }
  sf.forEachChild(node=>{
    if(ts.isFunctionDeclaration(node) && node.name) record(node.name.text,node,'file');
    else if(ts.isVariableStatement(node)){
      for(const d of node.declarationList.declarations){
        if(ts.isIdentifier(d.name) && d.initializer && (ts.isArrowFunction(d.initializer)||ts.isFunctionExpression(d.initializer))) record(d.name.text,d.initializer,'file');
      }
    } else if(ts.isClassDeclaration(node) && node.name){
      for(const member of node.members){ if(ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name)) record("'`${node.name.text}.${member.name.text}`,member,'"'class'); }
    }
  });
  return fns;
}

const summary=[];
for(const file of files){
  const sf=parse(file);
  const imports=importInfo(sf);
  const exps=exportNames(sf);
  const fns=functionsInfo(sf, imports);
  const depTargets=imports.filter(i=>i.resolved && fileSet.has(i.resolved)).map(i=>path.relative(process.cwd(), i.resolved));
  summary.push({file:path.relative(process.cwd(),file), imports, exports:exps, functions:fns, targetDeps:depTargets});
}

for(const item of summary){
  console.log('\\n=== FILE ===');
  console.log(item.file);
  console.log('TARGET_DEPS', JSON.stringify(item.targetDeps));
  console.log('IMPORTS');
  for(const imp of item.imports){
    console.log("'`  ${imp.spec} -> ${imp.resolved ? path.relative(process.cwd(),imp.resolved) : '"'(external/unresolved)'}"'`);
  }
  console.log('"'EXPORTS', item.exports.map(e=>"'`${e.kind}:${e.name}`).join('"', '));
  const sorted=[...item.functions].sort((a,b)=>b.complexity-a.complexity);
  console.log('TOP_COMPLEXITY');
  for(const fn of sorted.slice(0,20)){
    const localCalls=fn.calls.filter(c=>c.source==='local').map(c=>c.callee);
    const importedCalls=fn.calls.filter(c=>String(c.source).startsWith('import')).map(c=>"'`${c.callee} [${c.source}]`);
    console.log(`  ${fn.name} :: complexity=${fn.complexity} :: localCalls=${JSON.stringify(localCalls.slice(0,12))} :: importedCalls=${JSON.stringify(importedCalls.slice(0,12))}`);
  }
  console.log('"'FUNCTION_COUNT', item.functions.length);
}

console.log('\\n=== DIRECT_DEPENDENCY_MATRIX ===');
for(const item of summary){
  console.log(item.file, '->', item.targetDeps.join(', ') || '(none)');
}
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts exited 1 in 44ms:
node:fs:435
    return binding.readFileUtf8(path, stringToFlags(options.flag));
                   ^

Error: ENOENT: no such file or directory, open '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'
    at Object.readFileSync (node:fs:435:20)
    at read ([stdin]:13:32)
    at parse ([stdin]:14:56)
    at [stdin]:160:12
    at runScriptInThisContext (node:internal/vm:219:10)
    at node:internal/process/execution:451:12
    at [stdin]-wrapper:6:24
    at runScriptInContext (node:internal/process/execution:449:60)
    at evalFunction (node:internal/process/execution:283:30)
    at evalTypeScript (node:internal/process/execution:295:3) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'
}
codex
The AST script tripped over path resolution from the `scripts/` subdirectory. I’m rerunning it from the repo root so the file graph and complexity report line up with the real paths.
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const path = require('path');
const fs = require('fs');

const relFiles = [
  '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts',
  '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
  '.opencode/skill/system-spec-kit/scripts/types/session-types.ts',
  '.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts',
];
const files = relFiles.map(f => path.resolve(f));
const fileSet = new Set(files);

function read(file) { return fs.readFileSync(file, 'utf8'); }
function parse(file) { return ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS); }

function resolveImport(fromFile, spec) {
  if ("'!spec.startsWith('"'.')) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, base + '.ts', base + '.tsx', base + '.d.ts', path.join(base, 'index.ts')];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function importInfo(sf) {
  const imports = [];
  sf.forEachChild(node => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      const resolved = resolveImport(sf.fileName, spec);
      const bindings = [];
      if (node.importClause) {
        if (node.importClause.name) bindings.push({ kind: 'default', name: node.importClause.name.text });
        const nb = node.importClause.namedBindings;
        if (nb) {
          if (ts.isNamespaceImport(nb)) bindings.push({ kind: 'namespace', name: nb.name.text });
          if (ts.isNamedImports(nb)) {
            for (const el of nb.elements) {
              bindings.push({ kind: 'named', name: el.name.text, property: el.propertyName ? el.propertyName.text : el.name.text });
            }
          }
        }
      }
      imports.push({ spec, resolved, bindings });
    }
  });
  return imports;
}

function exportNames(sf) {
  const names = [];
  sf.forEachChild(node => {
    const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    const isExport = "'!!mods?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!isExport) return;
    if (node.name && node.name.text) names.push({ kind: ts.SyntaxKind[node.kind], name: node.name.text });
    else if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) names.push({ kind: '"'Variable', name: d.name.text });
      }
    }
  });
  return names;
}

function decisionCount(node) {
  let c = 1;
  function visit(n) {
    switch (n.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.CaseClause:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.ConditionalExpression:
        c++;
        break;
      case ts.SyntaxKind.BinaryExpression: {
        const op = n.operatorToken.kind;
        if (op === ts.SyntaxKind.AmpersandAmpersandToken || op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) c++;
        break;
      }
    }
    ts.forEachChild(n, visit);
  }
  if (node.body) ts.forEachChild(node.body, visit);
  return c;
}

function gatherNames(scopeNode) {
  const names = new Set();
  function addBinding(name) {
    if (ts.isIdentifier(name)) names.add(name.text);
    else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
      for (const e of name.elements) {
        if (e && e.name) addBinding(e.name);
      }
    }
  }
  function visit(n) {
    if (ts.isParameter(n) || ts.isVariableDeclaration(n) || ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n) || ts.isMethodDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)) {
      if (n.name) addBinding(n.name);
      if ((ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n)) && n.parameters) {
        for (const p of n.parameters) addBinding(p.name);
      }
    }
    ts.forEachChild(n, visit);
  }
  if (scopeNode.body) ts.forEachChild(scopeNode.body, visit);
  else ts.forEachChild(scopeNode, visit);
  return names;
}

function functionsInfo(sf, imports) {
  const importedNames = new Map();
  for (const imp of imports) {
    for (const b of imp.bindings) importedNames.set(b.name, imp.spec);
  }
  const topLevel = new Map();
  sf.forEachChild(node => {
    if ((ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) && node.name) topLevel.set(node.name.text, node);
    if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) if (ts.isIdentifier(d.name)) topLevel.set(d.name.text, d);
    }
  });

  const fns = [];
  function record(name, node, container) {
    const localNames = gatherNames(node);
    const calls = [];
    function visit(n) {
      if (ts.isCallExpression(n)) {
        let callee = '';
        let source = 'external';
        if (ts.isIdentifier(n.expression)) {
          callee = n.expression.text;
          if (topLevel.has(callee)) source = 'local';
          else if (importedNames.has(callee)) source = 'import:' + importedNames.get(callee);
          else if (localNames.has(callee)) source = 'nested/local';
        } else if (ts.isPropertyAccessExpression(n.expression)) {
          callee = n.expression.getText(sf);
          const left = n.expression.expression;
          if (ts.isIdentifier(left) && importedNames.has(left.text)) source = 'importns:' + importedNames.get(left.text);
          else if (ts.isThis(left)) source = 'this';
        }
        calls.push({ callee, source });
      }
      ts.forEachChild(n, visit);
    }
    if (node.body) ts.forEachChild(node.body, visit);
    fns.push({ name, container, complexity: decisionCount(node), calls });
  }

  sf.forEachChild(node => {
    if (ts.isFunctionDeclaration(node) && node.name) record(node.name.text, node, 'file');
    else if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
          record(d.name.text, d.initializer, 'file');
        }
      }
    } else if (ts.isClassDeclaration(node) && node.name) {
      for (const member of node.members) {
        if (ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name)) {
          record("'`${node.name.text}.${member.name.text}`, member, '"'class');
        }
      }
    }
  });
  return fns;
}

const summary = [];
for (const file of files) {
  const sf = parse(file);
  const imports = importInfo(sf);
  const exports = exportNames(sf);
  const functions = functionsInfo(sf, imports);
  const targetDeps = imports.filter(i => i.resolved && fileSet.has(i.resolved)).map(i => path.relative(process.cwd(), i.resolved));
  summary.push({ file: path.relative(process.cwd(), file), imports, exports, functions, targetDeps });
}

for (const item of summary) {
  console.log('\\n=== FILE ===');
  console.log(item.file);
  console.log('TARGET_DEPS', JSON.stringify(item.targetDeps));
  console.log('IMPORTS');
  for (const imp of item.imports) {
    console.log("'`  ${imp.spec} -> ${imp.resolved ? path.relative(process.cwd(), imp.resolved) : '"'(external/unresolved)'}"'`);
  }
  console.log('"'EXPORTS', item.exports.map(e => "'`${e.kind}:${e.name}`).join('"', '));
  const sorted = [...item.functions].sort((a, b) => b.complexity - a.complexity);
  console.log('TOP_COMPLEXITY');
  for (const fn of sorted.slice(0, 20)) {
    const localCalls = fn.calls.filter(c => c.source === 'local').map(c => c.callee);
    const importedCalls = fn.calls.filter(c => String(c.source).startsWith('import')).map(c => "'`${c.callee} [${c.source}]`);
    console.log(`  ${fn.name} :: complexity=${fn.complexity} :: localCalls=${JSON.stringify(localCalls.slice(0, 12))} :: importedCalls=${JSON.stringify(importedCalls.slice(0, 12))}`);
  }
  console.log('"'FUNCTION_COUNT', item.functions.length);
}

console.log('\\n=== DIRECT_DEPENDENCY_MATRIX ===');
for (const item of summary) {
  console.log(item.file, '->', item.targetDeps.join(', ') || '(none)');
}
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

=== FILE ===
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
TARGET_DEPS [".opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts"]
IMPORTS
  ./logger -> .opencode/skill/system-spec-kit/scripts/utils/logger.ts
  ./spec-affinity -> .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts
EXPORTS TypeAliasDeclaration:DataSource, TypeAliasDeclaration:CaptureDataSource, InterfaceDeclaration:Observation, InterfaceDeclaration:UserPrompt, InterfaceDeclaration:RecentContext, InterfaceDeclaration:FileEntry, InterfaceDeclaration:RawInputData, InterfaceDeclaration:DecisionItemObject, InterfaceDeclaration:NormalizedData, InterfaceDeclaration:CaptureExchange, InterfaceDeclaration:CaptureToolCall, InterfaceDeclaration:OpencodeCapture, InterfaceDeclaration:TransformedCapture
TOP_COMPLEXITY
  transformOpencodeCapture :: complexity=105 :: localCalls=["buildSpecRelevanceKeywords","getCurrentSpecId","containsRelevantKeyword","isSafeSpecFallback","containsRelevantKeyword","isSafeSpecFallback","containsRelevantKeyword","containsRelevantKeyword","buildToolObservationTitle","containsRelevantKeyword","isSafeSpecFallback"] :: importedCalls=["buildSpecAffinityTargets [import:./spec-affinity]","matchesSpecAffinityText [import:./spec-affinity]","matchesSpecAffinityFilePath [import:./spec-affinity]","matchesSpecAffinityFilePath [import:./spec-affinity]","matchesSpecAffinityFilePath [import:./spec-affinity]","matchesSpecAffinityText [import:./spec-affinity]","matchesSpecAffinityText [import:./spec-affinity]","structuredLog [import:./logger]","structuredLog [import:./logger]","matchesSpecAffinityText [import:./spec-affinity]","matchesSpecAffinityText [import:./spec-affinity]","matchesSpecAffinityText [import:./spec-affinity]"]
  validateInputData :: complexity=84 :: localCalls=[] :: importedCalls=[]
  normalizeInputData :: complexity=71 :: localCalls=["cloneInputData","normalizeFileEntryLike","hasPersistedNextStepsObservation","buildNextStepsObservation","mapTechnicalContext","normalizeFileEntryLike","buildSessionSummaryObservation","transformKeyDecision","buildTechnicalContextObservation","mapTechnicalContext","buildNextStepsObservation","cloneInputData"] :: importedCalls=[]
  buildToolObservationTitle :: complexity=33 :: localCalls=[] :: importedCalls=[]
  transformKeyDecision :: complexity=20 :: localCalls=[] :: importedCalls=[]
  normalizeFileEntryLike :: complexity=20 :: localCalls=[] :: importedCalls=[]
  buildSpecRelevanceKeywords :: complexity=9 :: localCalls=[] :: importedCalls=["normalizeText [import:./spec-affinity]","normalizeText [import:./spec-affinity]"]
  extractAlternativeLabel :: complexity=7 :: localCalls=[] :: importedCalls=[]
  isSafeSpecFallback :: complexity=5 :: localCalls=["extractSpecIds"] :: importedCalls=[]
  hasPersistedNextStepsObservation :: complexity=4 :: localCalls=[] :: importedCalls=[]
  getCurrentSpecId :: complexity=3 :: localCalls=["extractSpecIds"] :: importedCalls=[]
codex
I have the first pass metrics now. The next step is line-level reading: I’m pulling the full source in chunks plus symbol outlines so I can tie each finding back to concrete responsibilities and boundaries in the code.
exec
/bin/zsh -lc 'rg -n "''^(import|export )|''^function |''^const [A-Za-z0-9_]+'"\\s*=\\s*(async\\s*)?\\(|"'^interface |''^type |''^class " .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "''^(import|export )|''^function |''^const [A-Za-z0-9_]+'"\\s*=\\s*(async\\s*)?\\(|"'^interface |''^type |''^class " .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
9:import { structuredLog } from './logger';
10:import {
22:export type DataSource =
31:export type CaptureDataSource = Exclude<DataSource, 'file' | 'simulation'>;
34:export interface Observation {
49:export interface UserPrompt {
55:export interface RecentContext {
61:export interface FileEntry {
72:export interface RawInputData {
99:export interface DecisionItemObject {
110:export interface NormalizedData {
123:export interface CaptureExchange {
130:export interface CaptureToolCall {
145:export interface OpencodeCapture {
155:export interface TransformedCapture {
174:function extractAlternativeLabel(alt: unknown): string {
190:function transformKeyDecision(decisionItem: string | DecisionItemObject | null): Observation | null {
262:function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
280:function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
298:function mapTechnicalContext(techContext: Record<string, unknown>): Array<{ KEY: string; VALUE: string }> {
 succeeded in 0ms:
10:import * as path from 'node:path';
11:import * as fsSync from 'node:fs';
12:import * as crypto from 'node:crypto';
15:import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
16:import {
23:import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
24:import { populateTemplate } from '../renderers';
25:import { scoreMemoryQuality } from './quality-scorer';
26:import { extractKeyTopics } from './topic-extractor';
27:import type { DecisionForTopics } from './topic-extractor';
28:import { writeFilesAtomically } from './file-writer';
29:import { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';
30:import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
31:import { validateDescription } from '../utils/file-helpers';
32:import {
36:import { deriveMemoryDescription } from '../utils/memory-frontmatter';
37:import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
38:import type { CollectedDataFull } from '../extractors/collect-session-data';
39:import type { SemanticFileInfo } from '../extractors/file-extractor';
40:import { filterContamination, getContaminationPatternLabels, SEVERITY_RANK, type ContaminationSeverity } from '../extractors/contamination-filter';
exec
/bin/zsh -lc 'rg -n "''^(import|export )|''^function |''^const [A-Za-z0-9_]+'"\\s*=\\s*(async\\s*)?\\(|"'^interface |''^type |''^class " .opencode/skill/system-spec-kit/scripts/types/session-types.ts .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:12:import * as fs from 'fs';
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:13:import * as path from 'path';
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:14:import type { CollectedDataSubset } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:65:export interface SpecAffinityTargets {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:74:export interface SpecAffinityEvaluation {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:83:type SpecAffinityCollectedData = CollectedDataSubset<'userPrompts' | 'recentContext' | 'observations' | 'FILES' | 'SUMMARY'>;
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:85:function normalizeText(value: string): string {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:93:function normalizePathLike(value: string): string {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:104:function uniqueStrings(values: Array<string | null | undefined>): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:125:function extractSpecIds(value: string): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:129:function resolveSpecFolderPathCandidates(specFolderHint: string): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:153:function readFileSafe(filePath: string): string | null {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:161:function parseFrontmatterValue(content: string | null, keyName: string): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:205:function extractFilesToChange(content: string | null): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:217:function readSpecMetadata(specFolderHint: string): {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:266:function buildSlugCandidates(specFolderHint: string): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:285:function buildStrongKeywordTokens(values: string[]): string[] {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:301:export function buildSpecAffinityTargets(specFolderHint?: string | null): SpecAffinityTargets {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:337:export function matchesSpecAffinityFilePath(filePath: string, targets: SpecAffinityTargets): boolean {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:350:function countKeywordMatches(normalizedText: string, strongKeywordTokens: string[]): string[] {
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INPUT NORMALIZER
// ───────────────────────────────────────────────────────────────
// Validates, normalizes, and transforms raw input data into structured session format
import { structuredLog } from './logger';
import {
  buildSpecAffinityTargets,
  evaluateSpecAffinityText,
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  normalizeText,
} from './spec-affinity';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
 succeeded in 0ms:
 */
function buildSessionSummaryObservation(summary: string, triggerPhrases: string[] = []): Observation {
  const summaryTitle: string = summary.length > 100
    ? summary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
    : summary;

  return {
    type: 'feature',
    title: summaryTitle,
    narrative: summary,
    facts: triggerPhrases
  };
}

/**
 * Builds an implementation observation from a technical context key-value map.
 * @param techContext - A record of technical details (e.g., stack, config, dependencies).
 * @returns An Observation of type 'implementation' with a semicolon-delimited narrative of the context entries.
 */
function buildTechnicalContextObservation(techContext: Record<string, unknown>): Observation {
exec
/bin/zsh -lc "sed -n '521,780p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  if (nextSteps.length > 0) {
    observations.push(buildNextStepsObservation(nextSteps));
  }

  normalized.observations = observations;

  normalized.userPrompts = [{
    prompt: sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];

  normalized.recentContext = [{
    request: sessionSummary || 'Manual context save',
    learning: sessionSummary || ''
  }];

  if (triggerPhrases.length > 0) {
    normalized._manualTriggerPhrases = [...triggerPhrases];
  }

exec
/bin/zsh -lc "sed -n '781,1040p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1041,1217p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    '"rate_limit_error"',
    'internal server error',
  ];

  for (const ex of exchanges) {
    if (ex.assistantResponse) {
      const lowerResponse: string = ex.assistantResponse.toLowerCase();
      const isPlaceholder: boolean = placeholderPatterns.some((p: string) => lowerResponse.includes(p.toLowerCase()));

      if (!isPlaceholder && ex.assistantResponse.length > 20) {
        // When spec folder hint is provided, skip exchanges whose content
        // Doesn't mention any relevant keyword
        if (specFolderHint && relevanceKeywords.length > 0) {
          const responseRelevant = containsRelevantKeyword(relevanceKeywords, ex.assistantResponse)
            || matchesSpecAffinityText(ex.assistantResponse, specAffinityTargets);
          const inputRelevant = ex.userInput
            ? (
              containsRelevantKeyword(relevanceKeywords, ex.userInput)
              || matchesSpecAffinityText(ex.userInput, specAffinityTargets)
            )
 succeeded in 0ms:
  if (!specFolderHint) return [];

  const keywords = new Set<string>();
  const segments = specFolderHint
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim())
    .filter(Boolean);

  for (const segment of segments) {
    const normalizedSegment = normalizeText(segment);
    // Multi-word phrases are specific enough to keep (e.g., "session capturing")
    if (normalizedSegment.length > 2 && normalizedSegment.includes(' ')) {
      keywords.add(normalizedSegment);
    }

    for (const token of normalizedSegment.split(' ')) {
      // P1-07: Skip generic single tokens that cause false-positive relevance matches
      if (token.length > 2 && !RELEVANCE_PATH_STOPWORDS.has(token)) {
        keywords.add(token);
      }
exec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Spec Affinity
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SPEC AFFINITY
// ───────────────────────────────────────────────────────────────
// Builds spec-specific anchors from a target spec folder and evaluates
// whether captured stateless content is actually about that spec rather
// than merely coming from the same workspace.

import * as fs from 'fs';
import * as path from 'path';
import type { CollectedDataSubset } from '../types/session-types';

const SPEC_ID_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/g;
const KEYWORD_STOPWORDS = new Set([
  'about',
  'after',
  'align',
exec
/bin/zsh -lc "sed -n '281,546p' .opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/types/session-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,534p' .opencode/skill/system-spec-kit/scripts/types/session-types.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    normalizedSlug,
  ]).filter((value) => normalizeText(value).length >= 6);
}

function buildStrongKeywordTokens(values: string[]): string[] {
  const tokens = new Set<string>();

  for (const value of values) {
    const normalized = normalizeText(value);
    for (const token of normalized.split(' ')) {
      if (token.length < 4 || KEYWORD_STOPWORDS.has(token)) {
        continue;
      }
      tokens.add(token);
    }
  }

  return Array.from(tokens);
}

 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Session Types
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SESSION TYPES
// ───────────────────────────────────────────────────────────────
// Canonical type definitions shared between simulation-factory and extractors.
// Eliminates parallel type hierarchies (TECH-DEBT P6-05).

export type DescriptionProvenance = 'git' | 'spec-folder' | 'tool';

export type ModificationMagnitude = 'trivial' | 'small' | 'medium' | 'large' | 'unknown';

/** Captures a file change discovered in session data. */
export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
  MODIFICATION_MAGNITUDE?: ModificationMagnitude;
 succeeded in 0ms:
  TIMESTAMP: string;
  OPTIONS: DecisionOption[];
  CHOSEN: string;
  RATIONALE: string;
  HAS_PROS: boolean;
  PROS: Array<{ PRO: string }>;
  HAS_CONS: boolean;
  CONS: Array<{ CON: string }>;
  CHOICE_CONFIDENCE: number;
  RATIONALE_CONFIDENCE: number;
  CONFIDENCE: number;
  HAS_EVIDENCE: boolean;
  EVIDENCE: Array<{ EVIDENCE_ITEM: string }>;
  HAS_CAVEATS: boolean;
  CAVEATS: Array<{ CAVEAT_ITEM: string }>;
  HAS_FOLLOWUP: boolean;
  FOLLOWUP: Array<{ FOLLOWUP_ITEM: string }>;
  DECISION_TREE: string;
  HAS_DECISION_TREE: boolean;
  DECISION_ANCHOR_ID: string;
exec
/bin/zsh -lc "sed -n '521,780p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

function truncateMemoryTitle(title: string, maxLength: number = 110): string {
  if (title.length <= maxLength) {
    return title;
  }

  const truncated = title.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace >= Math.floor(maxLength * 0.6)) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/(?<=\d)-(?=\d)/g, '\x00')   // protect digit-digit hyphens (dates like 2026-03-13)
    .replace(/-/g, ' ')
    .replace(/\x00/g, '-')                 // restore digit-digit hyphens
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. WORKFLOW
// ───────────────────────────────────────────────────────────────
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// Node stdlib
import * as path from 'node:path';
import * as fsSync from 'node:fs';
import * as crypto from 'node:crypto';

// Internal modules
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
import {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractPhasesFromData,
exec
/bin/zsh -lc "sed -n '261,520p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  return segments.map((segment) => {
    if (segment.startsWith('```')) {
      return segment;
    }

    const preservedAnchorIds: string[] = [];
    const protectedSegment = segment.replace(WORKFLOW_PRESERVED_ANCHOR_ID_RE, (match: string) => {
      const token = `__WORKFLOW_ANCHOR_ID_${preservedAnchorIds.length}__`;
      preservedAnchorIds.push(match);
      return token;
    });

    let cleaned = protectedSegment
      .replace(WORKFLOW_HTML_COMMENT_RE, '')
      .replace(WORKFLOW_DANGEROUS_HTML_BLOCK_RE, '\n')
      .replace(WORKFLOW_BLOCK_HTML_TAG_RE, '\n')
      .replace(WORKFLOW_INLINE_HTML_TAG_RE, '')
      .replace(WORKFLOW_ANY_HTML_TAG_RE, '')
      .replace(/[ \t]+\n/g, '\n')
exec
/bin/zsh -lc "sed -n '781,1040p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  return 'episodic';
}

function defaultHalfLifeDays(memoryType: string): number {
  switch (memoryType) {
    case 'constitutional':
      return 0;
    case 'procedural':
      return 180;
    case 'semantic':
      return 365;
    case 'episodic':
    default:
      return 30;
  }
}

function baseDecayRateFromHalfLife(halfLifeDays: number): number {
  if (halfLifeDays <= 0) {
    return 0;
exec
/bin/zsh -lc "sed -n '1041,1300p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

  return '';
}

type WorkflowObservationEvidence = {
  TITLE?: string;
  title?: string;
  NARRATIVE?: string;
  narrative?: string;
  FACTS?: unknown[];
  facts?: unknown[];
  _synthetic?: boolean;
  _provenance?: string;
  _specRelevant?: boolean;
};

type WorkflowDecisionEvidence = {
  TITLE?: string;
  CHOSEN?: string;
  RATIONALE?: string;
exec
/bin/zsh -lc "sed -n '1301,1560p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        ];
      }

      // Merge decisions
      if (specContext.decisions.length > 0) {
        enriched._manualDecisions = [
          ...(enriched._manualDecisions || []),
          ...specContext.decisions,
        ];
      }

      // Use spec summary if collectedData summary is missing or generic
      if (specContext.summary && (!enriched.SUMMARY || enriched.SUMMARY === 'Development session')) {
        enriched.SUMMARY = specContext.summary;
      }

      // Merge recentContext
      if (specContext.recentContext.length > 0) {
        enriched.recentContext = [
          ...(enriched.recentContext || []),
exec
/bin/zsh -lc "sed -n '1561,1820p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1821,2080p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
          narrative: observation.narrative ? cleanContaminationText(observation.narrative) : observation.narrative,
          facts: observation.facts?.map((fact) => (
            typeof fact === 'string'
              ? cleanContaminationText(fact)
              : {
                ...fact,
                text: typeof fact.text === 'string' ? cleanContaminationText(fact.text) : fact.text
              }
          )),
        };
      });
    };

    // F-23: Pre-enrichment contamination cleaning pass
    {
      const preCleanedObservations = cleanObservations(collectedData.observations);
      const preCleanedSummary = (typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0)
        ? cleanContaminationText(collectedData.SUMMARY) : collectedData.SUMMARY;
      collectedData = { ...collectedData, observations: preCleanedObservations, SUMMARY: preCleanedSummary };
 succeeded in 0ms:

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
  );

  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof extractFileChanges>[1]
  );
  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
    sessionData.FILES || [],
    semanticFileChanges
  );

exec
/bin/zsh -lc "sed -n '2081,2340p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
        decisions: implSummary.decisions.length,
        messageStats: implSummary.messageStats
      },
      fileCounts: {
        fileCount: sessionData.FILE_COUNT,
        capturedFileCount: sessionData.CAPTURED_FILE_COUNT,
        filesystemFileCount: sessionData.FILESYSTEM_FILE_COUNT,
        gitChangedFileCount: sessionData.GIT_CHANGED_FILE_COUNT,
      },
      sourceProvenance: {
        transcriptPath: sessionData.SOURCE_TRANSCRIPT_PATH,
        sessionId: sessionData.SOURCE_SESSION_ID,
        sessionCreated: sessionData.SOURCE_SESSION_CREATED,
        sessionUpdated: sessionData.SOURCE_SESSION_UPDATED,
      },
      embedding: {
        status: 'pending',
        model: MODEL_NAME,
        dimensions: EMBEDDING_DIM
      }
exec
/bin/zsh -lc "sed -n '2341,2494p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  }
  log();

  // Step 9.5: State embedded in memory file
  log('Step 9.5: State embedded in memory file (V13.0)');

  // Step 10: Success confirmation
  log('Context saved successfully!\n');
  log(`Location: ${contextDir}\n`);
  log('Files created:');
  for (const [filename, content] of Object.entries(files)) {
    const lines = content.split('\n').length;
    log(`  - ${filename} (${lines} lines)`);
  }
  log();
  log('Summary:');
  log(`  - ${conversations.MESSAGES.length} messages captured`);
  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  log(`  - Session duration: ${sessionData.DURATION}\n`);
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/core/workflow.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
function decisionCount(node){let c=1; function visit(n){switch(n.kind){case ts.SyntaxKind.IfStatement: case ts.SyntaxKind.ForStatement: case ts.SyntaxKind.ForInStatement: case ts.SyntaxKind.ForOfStatement: case ts.SyntaxKind.WhileStatement: case ts.SyntaxKind.DoStatement: case ts.SyntaxKind.CaseClause: case ts.SyntaxKind.CatchClause: case ts.SyntaxKind.ConditionalExpression: c++; break; case ts.SyntaxKind.BinaryExpression:{const op=n.operatorToken.kind; if(op===ts.SyntaxKind.AmpersandAmpersandToken||op===ts.SyntaxKind.BarBarToken||op===ts.SyntaxKind.QuestionQuestionToken) c++; break;}} ts.forEachChild(n, visit);} if(node.body) ts.forEachChild(node.body, visit); return c; }
const results=[];
sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name){ const {line}=sf.getLineAndCharacterOfPosition(node.name.getStart()); results.push({name:node.name.text,line:line+1,complexity:decisionCount(node)}); } });
results.sort((a,b)=>b.complexity-a.complexity);
console.log(JSON.stringify({count:results.length, top:results.slice(0,20), buckets:{ge50:results.filter(r=>r.complexity>=50).length, ge20:results.filter(r=>r.complexity>=20).length, ge10:results.filter(r=>r.complexity>=10).length, lt10:results.filter(r=>r.complexity<10).length, total:results.length}}, null, 2));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
function decisionCount(node){let c=1; function visit(n){switch(n.kind){case ts.SyntaxKind.IfStatement: case ts.SyntaxKind.ForStatement: case ts.SyntaxKind.ForInStatement: case ts.SyntaxKind.ForOfStatement: case ts.SyntaxKind.WhileStatement: case ts.SyntaxKind.DoStatement: case ts.SyntaxKind.CaseClause: case ts.SyntaxKind.CatchClause: case ts.SyntaxKind.ConditionalExpression: c++; break; case ts.SyntaxKind.BinaryExpression:{const op=n.operatorToken.kind; if(op===ts.SyntaxKind.AmpersandAmpersandToken||op===ts.SyntaxKind.BarBarToken||op===ts.SyntaxKind.QuestionQuestionToken) c++; break;}} ts.forEachChild(n, visit);} if(node.body) ts.forEachChild(node.body, visit); return c; }
const results=[];
sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name){ const {line}=sf.getLineAndCharacterOfPosition(node.name.getStart()); results.push({name:node.name.text,line:line+1,complexity:decisionCount(node)}); } });
results.sort((a,b)=>b.complexity-a.complexity);
console.log(JSON.stringify({count:results.length, all:results}, null, 2));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 29ms:
{
  "count": 18,
  "all": [
    {
      "name": "transformOpencodeCapture",
      "line": 866,
      "complexity": 105
    },
    {
      "name": "validateInputData",
      "line": 576,
      "complexity": 84
    },
    {
      "name": "normalizeInputData",
      "line": 386,
      "complexity": 71
    },
    {
      "name": "buildToolObservationTitle",
 succeeded in 43ms:
{
  "count": 48,
  "top": [
    {
      "name": "runWorkflow",
      "line": 1384,
      "complexity": 198
    },
    {
      "name": "enrichFileSourceData",
      "line": 1169,
      "complexity": 29
    },
    {
      "name": "enrichStatelessData",
      "line": 1250,
      "complexity": 29
    },
    {
      "name": "buildWorkflowMemoryEvidenceSnapshot",
codex
I’ve finished reading the full sources. I’m tightening the evidence now with call-graph slices and cross-file usage so the recommendations can be specific about what to extract and what to leave together.
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const imports = new Map();
sf.forEachChild(node=>{ if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)&&node.importClause?.namedBindings&&ts.isNamedImports(node.importClause.namedBindings)){ for(const el of node.importClause.namedBindings.elements){ imports.set(el.name.text,node.moduleSpecifier.text); } }});
const topLevel = new Set();
sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name) topLevel.add(node.name.text); });
function analyze(name){ let fn=null; sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name?.text===name) fn=node; }); if("'!fn) return; const calls=[]; function visit(n){ if(ts.isCallExpression(n)){ if(ts.isIdentifier(n.expression)) calls.push(n.expression.text); else if(ts.isPropertyAccessExpression(n.expression)) calls.push(n.expression.getText(sf)); } ts.forEachChild(n,visit);} ts.forEachChild(fn.body,visit); console.log('"'\\n'+name); console.log([...new Set(calls)].map(c=>"'`${c}${topLevel.has(c)?'"' [local]':imports.has(c)?"'` [import ${imports.get(c)}]`:'"''}"'`).join('"'\\n')); }
['normalizeInputData','validateInputData','transformOpencodeCapture'].forEach(analyze);
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/core/workflow.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const imports = new Map();
sf.forEachChild(node=>{ if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier.text?node.moduleSpecifier:node.moduleSpecifier)){ const spec=node.moduleSpecifier.text; const clause=node.importClause; if(clause?.name) imports.set(clause.name.text,spec); const nb=clause?.namedBindings; if(nb&&ts.isNamedImports(nb)){ for(const el of nb.elements){ imports.set(el.name.text,spec);} } if(nb&&ts.isNamespaceImport(nb)){ imports.set(nb.name.text,spec);} }});
const topLevel = new Set();
sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name) topLevel.add(node.name.text); });
function analyze(name){ let fn=null; sf.forEachChild(node=>{ if(ts.isFunctionDeclaration(node)&&node.name?.text===name) fn=node; }); if("'!fn) return; const calls=[]; function visit(n){ if(ts.isCallExpression(n)){ if(ts.isIdentifier(n.expression)) calls.push(n.expression.text); else if(ts.isPropertyAccessExpression(n.expression)) calls.push(n.expression.getText(sf)); } ts.forEachChild(n,visit);} ts.forEachChild(fn.body,visit); console.log('"'\\n'+name); console.log([...new Set(calls)].map(c=>"'`${c}${topLevel.has(c)?'"' [local]':imports.has(c)?"'` [import ${imports.get(c)}]`:'"''}"'`).join('"'\\n')); }
['runWorkflow','enrichStatelessData','enrichFileSourceData'].forEach(analyze);
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/types/session-types.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const interfaces=[];
sf.forEachChild(node=>{ if(ts.isInterfaceDeclaration(node)||ts.isTypeAliasDeclaration(node)){ const name=node.name.text; const members=[]; if(ts.isInterfaceDeclaration(node)){ for(const m of node.members){ if(m.name&&ts.isIdentifier(m.name)) members.push(m.name.text+(m.questionToken?'?':'')); } } interfaces.push({kind:ts.isInterfaceDeclaration(node)?'interface':'type',name,members}); }});
console.log(JSON.stringify(interfaces,null,2));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 45ms:

normalizeInputData
Array.isArray
[
    data.userPrompts || data.user_prompts,
    data.observations,
    data.recentContext || data.recent_context,
  ].filter
cloneInputData [local]
cloned.FILES.map
normalizeFileEntryLike [local]
hasPersistedNextStepsObservation [local]
cloned.observations.push
buildNextStepsObservation [local]
mapTechnicalContext [local]
data.FILES.map
filesModified.map
entry.indexOf
entry.substring(0, sepIdx).includes
entry.substring
 succeeded in 33ms:
[
  {
    "kind": "type",
    "name": "DescriptionProvenance",
    "members": []
  },
  {
    "kind": "type",
    "name": "ModificationMagnitude",
    "members": []
  },
  {
    "kind": "interface",
    "name": "FileChange",
    "members": [
      "FILE_PATH",
      "DESCRIPTION",
      "ACTION?",
      "MODIFICATION_MAGNITUDE?",
      "_provenance?",
 succeeded in 53ms:

runWorkflow
withWorkflowRunLock [local]
console.log.bind
console.warn.bind
log
loadDataFn
loadCollectedDataFromLoader [import ../loaders/data-loader]
resolveAlignmentTargets [local]
buildSpecAffinityTargets [import ../utils/spec-affinity]
evaluateCollectedDataSpecAffinity [import ../utils/spec-affinity]
warn
(collectedData.observations || [])
        .flatMap((obs: { files?: string[] }) => obs.files || [])
        .concat
(collectedData.observations || [])
        .flatMap
(collectedData.FILES || []).map
allFilePaths.filter
matchesAlignmentTarget [local]
exec
/bin/zsh -lc "rg -n \"input-normalizer|spec-affinity|session-types|core/workflow\" .opencode/skill/system-spec-kit/scripts --glob '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:1:import type { DataSource } from './input-normalizer';
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:22:import type { DescriptionProvenance } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:24:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:35:} from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:40:// Re-export DataSource from input-normalizer for consumers importing from loaders
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:35:} from '../utils/spec-affinity';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:85:import type { FileChange, SessionData } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:25:import { runWorkflow } from '../core/workflow';
.opencode/skill/system-spec-kit/scripts/utils/tool-detection.ts:10:import type { ConversationPhaseLabel } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:23:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:22:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/phase-classifier.ts:15:} from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:14:import type { CollectedDataSubset } from '../types/session-types';
.opencode/skill/system-spec-kit/scripts/core/index.ts:10:// Import directly: import { runWorkflow } from './core/workflow';
.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:14:import type { DataSource } from '../utils/input-normalizer';
.opencode/skill/system-spec-kit/scripts/utils/index.ts:32:} from './spec-affinity';
.opencode/skill/system-spec-kit/scripts/utils/index.ts:36:} from './spec-affinity';
.opencode/skill/system-spec-kit/scripts/utils/index.ts:55:} from './input-normalizer';
.opencode/skill/system-spec-kit/scripts/utils/index.ts:68:} from './input-normalizer';
.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:27:} from '../types/session-types';
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const root = path.resolve('.opencode/skill/system-spec-kit/scripts');
const targets = [
  path.resolve('.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'),
  path.resolve('.opencode/skill/system-spec-kit/scripts/core/workflow.ts'),
  path.resolve('.opencode/skill/system-spec-kit/scripts/types/session-types.ts'),
  path.resolve('.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts'),
];
const all=[];
function walk(dir){ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ if(ent.name==='dist'||ent.name==='node_modules') continue; const p=path.join(dir,ent.name); if(ent.isDirectory()) walk(p); else if(ent.isFile()&&p.endsWith('.ts')) all.push(p);} }
walk(root);
function resolveImport(from,spec){ if("'!spec.startsWith('"'.')) return null; const base=path.resolve(path.dirname(from),spec); for(const c of [base,base+'.ts',base+'.tsx',base+'.d.ts',path.join(base,'index.ts')]) if(fs.existsSync(c)&&fs.statSync(c).isFile()) return c; return null; }
const graph=new Map();
for(const file of all){ const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS); const deps=[]; sf.forEachChild(node=>{ if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)){ const r=resolveImport(file,node.moduleSpecifier.text); if(r) deps.push(r);} }); graph.set(file,deps); }
function reachable(start,target,seen=new Set()){ if(start===target) return true; if(seen.has(start)) return false; seen.add(start); for(const dep of graph.get(start)||[]){ if(reachable(dep,target,seen)) return true; } return false; }
for(const a of targets){ for(const b of targets){ if(a===b) continue; const fwd=reachable(a,b,new Set()); const back=reachable(b,a,new Set()); if(fwd&&back){ console.log('CYCLE', path.relative(process.cwd(),a), '<->', path.relative(process.cwd(),b)); } } }
console.log('INCOMING');
for(const t of targets){ const incoming=[]; for(const [file,deps] of graph){ if(deps.includes(t)) incoming.push(path.relative(process.cwd(),file)); }
 console.log(path.relative(process.cwd(),t)); console.log(incoming.sort().join('\\n') || '(none)'); }
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const file = path.resolve('.opencode/skill/system-spec-kit/scripts/types/session-types.ts');
const sf = ts.createSourceFile(file, fs.readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const typeRefs = [];
function visit(n){ if(ts.isTypeReferenceNode(n)){ typeRefs.push(n.typeName.getText(sf)); } ts.forEachChild(n,visit); }
ts.forEachChild(sf,visit);
const counts = {};
for(const t of typeRefs) counts[t]=(counts[t]||0)+1;
console.log(JSON.stringify(Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,30), null, 2));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 42ms:
[
  [
    "Array",
    11
  ],
  [
    "DescriptionProvenance",
    3
  ],
  [
    "GapDescription",
    3
  ],
  [
    "ModificationMagnitude",
    2
  ],
  [
    "CollectedDataBase",
    2
 succeeded in 173ms:
INCOMING
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/stateless-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
.opencode/skill/system-spec-kit/scripts/types/session-types.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/core/workflow.ts
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts
exec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
for (const rel of ['.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts','.opencode/skill/system-spec-kit/scripts/core/workflow.ts','.opencode/skill/system-spec-kit/scripts/types/session-types.ts']) {
 const file=path.resolve(rel); const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 let importCount=0; let namedBindings=0; sf.forEachChild(node=>{ if(ts.isImportDeclaration(node)){ importCount++; if(node.importClause?.namedBindings&&ts.isNamedImports(node.importClause.namedBindings)) namedBindings += node.importClause.namedBindings.elements.length; }});
 console.log(rel, JSON.stringify({importCount,namedBindings}));
}
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const files=['.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts','.opencode/skill/system-spec-kit/scripts/core/workflow.ts'];
for(const rel of files){ const file=path.resolve(rel); const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS); let ifs=0, loops=0, catches=0, cond=0, binary=0; function visit(n){ switch(n.kind){ case ts.SyntaxKind.IfStatement: ifs++; break; case ts.SyntaxKind.ForStatement: case ts.SyntaxKind.ForInStatement: case ts.SyntaxKind.ForOfStatement: case ts.SyntaxKind.WhileStatement: case ts.SyntaxKind.DoStatement: loops++; break; case ts.SyntaxKind.CatchClause: catches++; break; case ts.SyntaxKind.ConditionalExpression: cond++; break; case ts.SyntaxKind.BinaryExpression: { const op=n.operatorToken.kind; if(op===ts.SyntaxKind.AmpersandAmpersandToken||op===ts.SyntaxKind.BarBarToken||op===ts.SyntaxKind.QuestionQuestionToken) binary++; break; } } ts.forEachChild(n,visit);} ts.forEachChild(sf,visit); console.log(rel, JSON.stringify({ifs,loops,catches,conditionalExpressions:cond,logicalOperators:binary})); }
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node - <<'NODE'
const ts = require('./.opencode/skill/system-spec-kit/node_modules/typescript/lib/typescript');
const fs = require('fs');
const path = require('path');
const rel='.opencode/skill/system-spec-kit/scripts/types/session-types.ts';
const file=path.resolve(rel); const sf=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
let interfaces=0, types=0; sf.forEachChild(node=>{ if(ts.isInterfaceDeclaration(node)) interfaces++; if(ts.isTypeAliasDeclaration(node)) types++; });
console.log(JSON.stringify({interfaces,types}));
NODE" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 32ms:
{"interfaces":40,"types":5}
 succeeded in 65ms:
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts {"ifs":113,"loops":9,"catches":0,"conditionalExpressions":64,"logicalOperators":164}
.opencode/skill/system-spec-kit/scripts/core/workflow.ts {"ifs":143,"loops":20,"catches":12,"conditionalExpressions":73,"logicalOperators":157}
 succeeded in 73ms:
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts {"importCount":2,"namedBindings":6}
.opencode/skill/system-spec-kit/scripts/core/workflow.ts {"importCount":43,"namedBindings":71}
.opencode/skill/system-spec-kit/scripts/types/session-types.ts {"importCount":0,"namedBindings":0}
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. VALIDATE MEMORY QUALITY
// ───────────────────────────────────────────────────────────────
// Post-render quality gate for generated memory files

import fs from 'fs';
import path from 'path';
import { structuredLog } from '../utils/logger';
import type { ContaminationAuditRecord } from '../lib/content-filter';
import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';

type ValidationRuleSeverity = 'low' | 'medium' | 'high';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
exec
/bin/zsh -lc "sed -n '1,120p' .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Data Loader
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. DATA LOADER
// ───────────────────────────────────────────────────────────────
// Loads session data from file, native CLI capture, or hard-fail

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { CONFIG } from '../core';
import { structuredLog, sanitizePath } from '../utils';

import {
exec
/bin/zsh -lc "sed -n '1,80p' .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import type { DataSource } from './input-normalizer';

export type SourceInputMode = 'structured' | 'stateless';
export type KnownDataSource = DataSource;

export interface SourceCapabilities {
  source: DataSource;
  inputMode: SourceInputMode;
  toolTitleWithPathExpected: boolean;
  /** @planned Wire to mode selection in workflow.ts. Currently unused at runtime. */
  prefersStructuredSave: boolean;
}

const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
  file: {
    source: 'file',
    inputMode: 'structured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
codex
**SRP-001**  
Impact: HIGH  
Description: [`input-normalizer.ts:22`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L22 ) does not have a single responsibility. Its call graph splits into at least four concerns: manual payload normalization in [`normalizeInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L386 ), schema/domain validation in [`validateInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L576 ), capture transformation plus timestamp/file synthesis in [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ), and spec-relevance heuristics in [`buildSpecRelevanceKeywords`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L780 ) and [`isSafeSpecFallback`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L833 ). The complexity profile reinforces that split: `transformOpencodeCapture=105`, `validateInputData=84`, `normalizeInputData=71`.  
Recommendation: Treat this file as an overloaded facade and split by concern, not by line count.

**SRP-002**  
Impact: HIGH  
Description: A clean decomposition falls out of the existing call graph. The manual path is centered on [`normalizeInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L386 ); the capture path is centered on [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ); the decision/observation builders are separate helpers around [`transformKeyDecision`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L190 ); and relevance filtering is a separate policy cluster around [`buildSpecRelevanceKeywords`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L780 ).  
Recommendation: Extract `types/source-types.ts` for `DataSource` and capture types, `normalizers/manual-input.ts` for `normalizeInputData` and file-entry helpers, `validators/input-schema.ts` for `validateInputData`, `transformers/opencode-capture.ts` for `transformOpencodeCapture` and `buildToolObservationTitle`, and `policies/capture-relevance.ts` for the fallback/relevance helpers. Keep `input-normalizer.ts` as a thin compatibility barrel.

**ARCH-001**  
Impact: HIGH  
Description: [`workflow.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts ) is too large primarily because [`runWorkflow`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1384 ) is a god function. AST-based cyclomatic complexity puts `runWorkflow` at `198`; the next highest functions are `29`, `29`, `19`, and `17`. The file also carries `43` imports and `71` named bindings. `runWorkflow` spans loading, alignment, contamination scrubbing, enrichment, parallel extraction, semantic summarization, tree thinning, template population, quality gates, writing, description tracking, indexing, and retry processing in one control flow.  
Recommendation: Keep `workflow.ts` only as the top-level use-case entrypoint and move stage logic into dedicated modules.

**ARCH-002**  
Impact: MEDIUM  
Description: The file already advertises a pipeline with “Step 1” through “Step 12” log sections in [`workflow.ts:1406`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1406 ) through [`workflow.ts:2462`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2462 ), but the implementation is still monolithic. There are also obvious strategy seams: file-backed vs stateless enrichment in [`enrichFileSourceData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1169 ) and [`enrichStatelessData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1250 ), plus indexing policy in [`shouldIndexMemory`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L151 ).  
Recommendation: Introduce a `WorkflowContext` plus pipeline stages like `load`, `align`, `enrich`, `extract`, `summarize`, `render`, `validate`, `persist`, and `index`. Use strategies for `EnrichmentStrategy`, `AlignmentPolicy`, and `IndexPolicy` instead of branching inside `runWorkflow`.

**DEP-001**  
Impact: LOW  
Description: I found no circular dependency among the reviewed modules. The direct graph is acyclic: `input-normalizer -> spec-affinity`, `spec-affinity -> session-types` via `import type`, and `workflow -> spec-affinity` plus `workflow -> session-types` [`input-normalizer.ts:9`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L9 ) [`spec-affinity.ts:14`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L14 ) [`workflow.ts:33`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L33 ). I also checked reachability across the `scripts/` tree and did not find an indirect cycle among these four.  
Recommendation: No cycle fix is needed. Keep it that way by preventing `session-types.ts` or `spec-affinity.ts` from ever importing workflow-level orchestration code.

**TYPES-001**  
Impact: HIGH  
Description: [`session-types.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts ) is not really a type hierarchy; it is a flat schema dump. It contains `40` interfaces and `5` type aliases with almost no composition. It mixes ingestion contracts like [`CollectedDataBase`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L125 ), extractor outputs like [`DecisionData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L286 ) and [`ConversationData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L365 ), render DTOs like [`SessionData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L442 ), and analytics models like [`TopicCluster`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L341 ) in one namespace.  
Recommendation: Split by bounded context: `types/collected-data.ts`, `types/decisions.ts`, `types/conversation.ts`, `types/diagrams.ts`, `types/rendered-memory.ts`, and `types/shared.ts`.

**TYPES-002**  
Impact: MEDIUM  
Description: There are redundant or overlapping interfaces. `FileChange`, `CollectedFileEntry`, `FileEntry`, and `SpecFileEntry` all model “a file” with slightly different casing and optionality [`session-types.ts:16`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L16 ) [`session-types.ts:26`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L26 ) [`session-types.ts:183`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L183 ) [`session-types.ts:190`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L190 ). The same duplication exists across files: `input-normalizer.ts` redeclares `Observation`, `UserPrompt`, `RecentContext`, and `FileEntry` instead of using the canonical shared types [`input-normalizer.ts:34`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L34 ).  
Recommendation: Define one canonical domain shape per concept and use adapters for loose/raw inputs. Also move `DataSource` out of `input-normalizer.ts`; it is already used by unrelated modules like [`source-capabilities.ts:1`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts#L1 ) and [`validate-memory-quality.ts:12`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L12 ).

**COUPLING-001**  
Impact: MEDIUM  
Description: The coupling between `input-normalizer.ts` and `spec-affinity.ts` is conceptually warranted but implemented at the wrong level. It is warranted because stateless capture transformation really does need spec-scoping to avoid cross-spec contamination, and [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ) uses that policy directly. It is too intimate because `input-normalizer` imports five low-level affinity helpers [`input-normalizer.ts:10`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L10 ), redefines related concepts like `SPEC_ID_REGEX` and fallback heuristics locally, and becomes indirectly filesystem-aware because `buildSpecAffinityTargets` reads `spec.md` and `description.json` in [`spec-affinity.ts:217`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L217 ) and [`spec-affinity.ts:301`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L301 ).  
Recommendation: Keep the dependency, but collapse it behind a single policy API such as `createCaptureAffinityPolicy(specFolderHint)` or `filterCaptureToSpec(capture, specFolderHint)`. That keeps normalization focused on transformation while `spec-affinity` owns all spec-matching logic.

**BOUNDARY-001**  
Impact: MEDIUM  
Description: Module boundaries only partially align with domain concepts. [`spec-affinity.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts ) is cohesive and domain-shaped. [`workflow.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts ) is a use-case orchestrator, but it has absorbed multiple subdomains. [`session-types.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts ) is organized by “sharedness” rather than domain. [`input-normalizer.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts ) straddles ingestion, validation, capture transformation, and relevance policy.  
Recommendation: Realign around domains: `ingestion`, `spec-affinity`, `workflow-orchestration`, `rendered-memory`, and `conversation/decision/diagram extraction`. That will make responsibilities discoverable and reduce the need for giant shared utility modules.
tokens used
260,983
**SRP-001**  
Impact: HIGH  
Description: [`input-normalizer.ts:22`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L22 ) does not have a single responsibility. Its call graph splits into at least four concerns: manual payload normalization in [`normalizeInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L386 ), schema/domain validation in [`validateInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L576 ), capture transformation plus timestamp/file synthesis in [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ), and spec-relevance heuristics in [`buildSpecRelevanceKeywords`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L780 ) and [`isSafeSpecFallback`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L833 ). The complexity profile reinforces that split: `transformOpencodeCapture=105`, `validateInputData=84`, `normalizeInputData=71`.  
Recommendation: Treat this file as an overloaded facade and split by concern, not by line count.

**SRP-002**  
Impact: HIGH  
Description: A clean decomposition falls out of the existing call graph. The manual path is centered on [`normalizeInputData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L386 ); the capture path is centered on [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ); the decision/observation builders are separate helpers around [`transformKeyDecision`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L190 ); and relevance filtering is a separate policy cluster around [`buildSpecRelevanceKeywords`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L780 ).  
Recommendation: Extract `types/source-types.ts` for `DataSource` and capture types, `normalizers/manual-input.ts` for `normalizeInputData` and file-entry helpers, `validators/input-schema.ts` for `validateInputData`, `transformers/opencode-capture.ts` for `transformOpencodeCapture` and `buildToolObservationTitle`, and `policies/capture-relevance.ts` for the fallback/relevance helpers. Keep `input-normalizer.ts` as a thin compatibility barrel.

**ARCH-001**  
Impact: HIGH  
Description: [`workflow.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts ) is too large primarily because [`runWorkflow`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1384 ) is a god function. AST-based cyclomatic complexity puts `runWorkflow` at `198`; the next highest functions are `29`, `29`, `19`, and `17`. The file also carries `43` imports and `71` named bindings. `runWorkflow` spans loading, alignment, contamination scrubbing, enrichment, parallel extraction, semantic summarization, tree thinning, template population, quality gates, writing, description tracking, indexing, and retry processing in one control flow.  
Recommendation: Keep `workflow.ts` only as the top-level use-case entrypoint and move stage logic into dedicated modules.

**ARCH-002**  
Impact: MEDIUM  
Description: The file already advertises a pipeline with “Step 1” through “Step 12” log sections in [`workflow.ts:1406`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1406 ) through [`workflow.ts:2462`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L2462 ), but the implementation is still monolithic. There are also obvious strategy seams: file-backed vs stateless enrichment in [`enrichFileSourceData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1169 ) and [`enrichStatelessData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L1250 ), plus indexing policy in [`shouldIndexMemory`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L151 ).  
Recommendation: Introduce a `WorkflowContext` plus pipeline stages like `load`, `align`, `enrich`, `extract`, `summarize`, `render`, `validate`, `persist`, and `index`. Use strategies for `EnrichmentStrategy`, `AlignmentPolicy`, and `IndexPolicy` instead of branching inside `runWorkflow`.

**DEP-001**  
Impact: LOW  
Description: I found no circular dependency among the reviewed modules. The direct graph is acyclic: `input-normalizer -> spec-affinity`, `spec-affinity -> session-types` via `import type`, and `workflow -> spec-affinity` plus `workflow -> session-types` [`input-normalizer.ts:9`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L9 ) [`spec-affinity.ts:14`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L14 ) [`workflow.ts:33`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L33 ). I also checked reachability across the `scripts/` tree and did not find an indirect cycle among these four.  
Recommendation: No cycle fix is needed. Keep it that way by preventing `session-types.ts` or `spec-affinity.ts` from ever importing workflow-level orchestration code.

**TYPES-001**  
Impact: HIGH  
Description: [`session-types.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts ) is not really a type hierarchy; it is a flat schema dump. It contains `40` interfaces and `5` type aliases with almost no composition. It mixes ingestion contracts like [`CollectedDataBase`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L125 ), extractor outputs like [`DecisionData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L286 ) and [`ConversationData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L365 ), render DTOs like [`SessionData`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L442 ), and analytics models like [`TopicCluster`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L341 ) in one namespace.  
Recommendation: Split by bounded context: `types/collected-data.ts`, `types/decisions.ts`, `types/conversation.ts`, `types/diagrams.ts`, `types/rendered-memory.ts`, and `types/shared.ts`.

**TYPES-002**  
Impact: MEDIUM  
Description: There are redundant or overlapping interfaces. `FileChange`, `CollectedFileEntry`, `FileEntry`, and `SpecFileEntry` all model “a file” with slightly different casing and optionality [`session-types.ts:16`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L16 ) [`session-types.ts:26`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L26 ) [`session-types.ts:183`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L183 ) [`session-types.ts:190`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts#L190 ). The same duplication exists across files: `input-normalizer.ts` redeclares `Observation`, `UserPrompt`, `RecentContext`, and `FileEntry` instead of using the canonical shared types [`input-normalizer.ts:34`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L34 ).  
Recommendation: Define one canonical domain shape per concept and use adapters for loose/raw inputs. Also move `DataSource` out of `input-normalizer.ts`; it is already used by unrelated modules like [`source-capabilities.ts:1`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts#L1 ) and [`validate-memory-quality.ts:12`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L12 ).

**COUPLING-001**  
Impact: MEDIUM  
Description: The coupling between `input-normalizer.ts` and `spec-affinity.ts` is conceptually warranted but implemented at the wrong level. It is warranted because stateless capture transformation really does need spec-scoping to avoid cross-spec contamination, and [`transformOpencodeCapture`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L866 ) uses that policy directly. It is too intimate because `input-normalizer` imports five low-level affinity helpers [`input-normalizer.ts:10`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L10 ), redefines related concepts like `SPEC_ID_REGEX` and fallback heuristics locally, and becomes indirectly filesystem-aware because `buildSpecAffinityTargets` reads `spec.md` and `description.json` in [`spec-affinity.ts:217`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L217 ) and [`spec-affinity.ts:301`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts#L301 ).  
Recommendation: Keep the dependency, but collapse it behind a single policy API such as `createCaptureAffinityPolicy(specFolderHint)` or `filterCaptureToSpec(capture, specFolderHint)`. That keeps normalization focused on transformation while `spec-affinity` owns all spec-matching logic.

**BOUNDARY-001**  
Impact: MEDIUM  
Description: Module boundaries only partially align with domain concepts. [`spec-affinity.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts ) is cohesive and domain-shaped. [`workflow.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts ) is a use-case orchestrator, but it has absorbed multiple subdomains. [`session-types.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/types/session-types.ts ) is organized by “sharedness” rather than domain. [`input-normalizer.ts`]( /Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts ) straddles ingestion, validation, capture transformation, and relevance policy.  
Recommendation: Realign around domains: `ingestion`, `spec-affinity`, `workflow-orchestration`, `rendered-memory`, and `conversation/decision/diagram extraction`. That will make responsibilities discoverable and reduce the need for giant shared utility modules.
