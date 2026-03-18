---
title: "M-006 -- Stateless Enrichment and Alignment Guardrails"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`."
---

# M-006 -- Stateless Enrichment and Alignment Guardrails

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-006`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Run a stateless memory save for a spec that edits generic code paths and verify enrichment/guard behavior`
- Commands:
  - `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/<target-spec>`
  - `memory_search({ query: "stateless enrichment alignment", specFolder: "specs/<target-spec>" })`
- Expected: the save uses spec-folder and git enrichment, keeps natural-language prompt variants of the spec slug, records git snapshot metadata (`headRef`, `commitRef`, `repositoryState`, `isDetachedHead`), and does not raise `ALIGNMENT_BLOCK` when captured files match the spec's files-to-change table.
- Evidence: save stdout showing Step 3.5 enrichment, absence of false alignment aborts for matching code files, and saved memory content/search hits reflecting spec/git-derived context.
- Pass: stateless save succeeds for matching files, emits provenance-backed context, and still blocks unrelated captures when overlap is genuinely low.
- Fail triage: inspect `input-normalizer.ts` relevance filtering, compare captured file paths to the spec's files-to-change table, verify git scope includes the declared code paths, then rerun.

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

---

## 5. SOURCE METADATA

- Group: Dedicated Memory/Spec-Kit Scenarios
- Playbook ID: M-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--memory-and-spec-kit-scenarios/006-stateless-enrichment-and-alignment-guardrails.md`
