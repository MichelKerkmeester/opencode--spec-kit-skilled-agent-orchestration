---
title: "M-006 -- Session Enrichment and Alignment Guardrails"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`."
audited_post_018: true
phase_018_replaces: "archived phase 014 quality-gate framing and external memory-continuity assumptions"
---

# M-006 -- Session Enrichment and Alignment Guardrails

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`.

---

## 2. SCENARIO CONTRACT

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

### Prompt

`As a spec-doc record-quality validation operator, validate Session Enrichment and Alignment Guardrails against memory_search({ query: "handover continuity alignment", specFolder: "specs/<target-spec>" }). Verify the save resolves through handover.md first, then _memory.continuity, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise ALIGNMENT_BLOCK when captured files match the spec's files-to-change table. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands
- `memory_search({ query: "handover continuity alignment", specFolder: "specs/<target-spec>" })`
### Expected

the save resolves through `handover.md` first, then `_memory.continuity`, then spec docs; spec-folder and git enrichment remain supporting-only; and it does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table.
### Evidence

save stdout showing the continuity ladder, absence of false alignment aborts for matching code files, and saved memory content/search hits reflecting handover/continuity/spec-derived context.
### Pass/Fail

captured-session save succeeds for matching files, emits provenance-backed context, and still blocks unrelated captures when overlap is genuinely low.
### Failure Triage

inspect `input-normalizer.ts` relevance filtering, compare captured file paths to the spec's files-to-change table, verify handover/continuity precedence, then rerun.

#### M-006a: Unborn-HEAD and dirty snapshot fallback
1. Initialize a sandbox repo without creating a commit yet, then create one in-scope file.
2. Run:
   `node - <<'NODE'
   const { extractGitContext } = require('./.opencode/skill/system-spec-kit/scripts/dist/extractors/git-context-extractor.js');
   (async () => {
     const result = await extractGitContext(process.cwd());
     console.log(JSON.stringify(result, null, 2));
   })().catch((error) => {
     console.error(error);
     process.exit(1);
   });
   NODE`
3. Verify: `headRef` shows the current branch, `commitRef` is `null`, `repositoryState` is `dirty`, and uncommitted files are listed.

#### M-006b: Detached-HEAD snapshot preservation
1. Checkout a detached `HEAD` in a sandbox repo that already has at least one commit affecting the target scope.
2. Run the same extractor command as M-006a.
3. Verify: `headRef` is `HEAD`, `commitRef` is populated, `isDetachedHead` is `true`, and the extractor still returns recent in-scope commit observations.

#### M-006c: Similar-folder boundary protection
1. Create two spec folders where one slug is a prefix of the other, but only the target spec contains in-scope files.
2. Commit a change only under the similarly named foreign folder.
3. Run the extractor command from M-006a with the target spec folder hint.
4. Verify: recent commit observations do not include the foreign folder path, and the target result remains empty or limited to genuinely in-scope history.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md](../../feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/006-session-enrichment-and-alignment-guardrails.md`
