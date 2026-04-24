#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.resolve(SCRIPT_DIR, '../../../../');
const ROOT_SPEC = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization';

const REWRITE_EXTENSIONS = new Set([
  '.md',
  '.json',
  '.jsonl',
  '.yaml',
  '.yml',
  '.toml',
  '.txt',
  '.cjs',
  '.js',
  '.ts',
]);

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function listEntries(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function shouldSkipDir(dirPath, entryName) {
  if (entryName === '.git' || entryName === 'node_modules') {
    return true;
  }
  const normalizedDir = normalizePath(dirPath);
  return normalizedDir.includes('/research/iterations')
    || normalizedDir.includes('/review/iterations')
    || normalizedDir.includes('/prompts')
    || normalizedDir.includes('/logs');
}

function rewriteLiveReferences(replacements, dryRun) {
  const updatedFiles = [];

  function walk(currentDir) {
    for (const entry of listEntries(currentDir)) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (shouldSkipDir(fullPath, entry.name)) {
          continue;
        }
        walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !REWRITE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        continue;
      }

      const original = fs.readFileSync(fullPath, 'utf8');
      let next = original;
      for (const [fromPath, toPath] of replacements) {
        next = next.split(fromPath).join(toPath);
      }
      if (next !== original) {
        if (!dryRun) {
          fs.writeFileSync(fullPath, next, 'utf8');
        }
        updatedFiles.push(normalizePath(path.relative(REPO_ROOT, fullPath)));
      }
    }
  }

  walk(REPO_ROOT);
  return updatedFiles.sort();
}

function buildExplicitOwnerMap() {
  const ownerMap = new Map();

  const researchOwners = {
    '001-research-graph-context-systems-pt-01': `${ROOT_SPEC}/001-research-and-baseline`,
    '003-memory-quality-remediation-pt-02': `${ROOT_SPEC}/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction`,
    '003-memory-quality-remediation-pt-03': `${ROOT_SPEC}/002-continuity-memory-runtime/002-memory-quality-remediation/007-skill-catalog-sync`,
    '005-release-cleanup-playbooks-pt-01': `${ROOT_SPEC}/005-release-cleanup-playbooks`,
    '007-deep-review-remediation-pt-05': `${ROOT_SPEC}/007-deep-review-remediation`,
    '008-runtime-executor-hardening-pt-01': `${ROOT_SPEC}/008-runtime-executor-hardening`,
    '009-hook-package-pt-01': `${ROOT_SPEC}/009-hook-package`,
    '010-memory-indexer-lineage-and-concurrency-fix-pt-01': `${ROOT_SPEC}/010-memory-indexer-lineage-and-concurrency-fix`,
    '011-index-scope-and-constitutional-tier-invariants-pt-01': `${ROOT_SPEC}/011-index-scope-and-constitutional-tier-invariants`,
    '013-code-graph-hook-improvements-pt-02': `${ROOT_SPEC}/009-hook-package/013-code-graph-hook-improvements`,
    '013-code-graph-zero-calls-pt-03': `${ROOT_SPEC}/009-hook-package/013-code-graph-hook-improvements`,
    '014-memory-save-rewrite-pt-01': `${ROOT_SPEC}/002-continuity-memory-runtime/004-memory-save-rewrite`,
    '014-skill-advisor-hook-improvements-pt-02': `${ROOT_SPEC}/009-hook-package/014-skill-advisor-hook-improvements`,
    '016-foundational-runtime-pt-01': `${ROOT_SPEC}/008-runtime-executor-hardening/001-foundational-runtime`,
    '028-code-graph-hook-improvements-pt-01': `${ROOT_SPEC}/009-hook-package/013-code-graph-hook-improvements`,
    '029-skill-advisor-hook-improvements-pt-01': `${ROOT_SPEC}/009-hook-package/014-skill-advisor-hook-improvements`,
    '030-code-graph-gap-investigation-pt-01': `${ROOT_SPEC}/009-hook-package/013-code-graph-hook-improvements`,
    '031-skill-advisor-gap-investigation-pt-01': `${ROOT_SPEC}/009-hook-package/014-skill-advisor-hook-improvements`,
  };

  for (const [packetName, owner] of Object.entries(researchOwners)) {
    ownerMap.set(`${ROOT_SPEC}/research/${packetName}`, owner);
  }

  const reviewOwners = {
    '006-continuity-refactor-gates-pt-01': `${ROOT_SPEC}/005-release-cleanup-playbooks`,
    '006-continuity-refactor-gates-pt-05': `${ROOT_SPEC}/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready`,
    '006-continuity-refactor-gates-pt-06': `${ROOT_SPEC}/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration`,
    '006-continuity-refactor-gates-pt-07': `${ROOT_SPEC}/002-continuity-memory-runtime/003-continuity-refactor-gates/006-gate-f-cleanup-verification`,
    '006-search-routing-advisor-001-search-fusion-tuning-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning`,
    '006-search-routing-advisor-001-search-fusion-tuning-002-add-reranker-telemetry-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry`,
    '006-search-routing-advisor-001-search-fusion-tuning-003-continuity-search-profile-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile`,
    '006-search-routing-advisor-001-search-fusion-tuning-004-raise-rerank-minimum-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum`,
    '006-search-routing-advisor-001-search-fusion-tuning-005-doc-surface-alignment-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment`,
    '006-search-routing-advisor-001-search-fusion-tuning-006-continuity-profile-validation-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation`,
    '006-search-routing-advisor-002-content-routing-accuracy-001-fix-delivery-progress-confusion-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion`,
    '006-search-routing-advisor-002-content-routing-accuracy-002-fix-handover-drop-confusion-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion`,
    '006-search-routing-advisor-002-content-routing-accuracy-003-wire-tier3-llm-classifier-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/003-wire-tier3-llm-classifier`,
    '006-search-routing-advisor-002-content-routing-accuracy-004-doc-surface-alignment-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment`,
    '006-search-routing-advisor-002-content-routing-accuracy-005-task-update-merge-safety-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/005-task-update-merge-safety`,
    '006-search-routing-advisor-002-content-routing-accuracy-006-tier3-prompt-enrichment-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/006-tier3-prompt-enrichment`,
    '006-search-routing-advisor-003-graph-metadata-validation-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation`,
    '006-search-routing-advisor-003-graph-metadata-validation-001-fix-status-derivation-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/001-fix-status-derivation`,
    '006-search-routing-advisor-003-graph-metadata-validation-002-sanitize-key-files-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/002-sanitize-key-files`,
    '006-search-routing-advisor-003-graph-metadata-validation-003-deduplicate-entities-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities`,
    '006-search-routing-advisor-003-graph-metadata-validation-004-normalize-legacy-files-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files`,
    '006-search-routing-advisor-003-graph-metadata-validation-005-doc-surface-alignment-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment`,
    '006-search-routing-advisor-003-graph-metadata-validation-006-key-file-resolution-pt-01': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution`,
    '006-search-routing-advisor-003-graph-metadata-validation-006-key-file-resolution-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/006-key-file-resolution`,
    '011-skill-advisor-graph-pt-02': `${ROOT_SPEC}/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes`,
    '011-skill-advisor-graph-pt-03': `${ROOT_SPEC}/006-search-routing-advisor/002-skill-advisor-graph/002-manual-testing-playbook`,
    '011-skill-advisor-graph-pt-04': `${ROOT_SPEC}/006-search-routing-advisor/002-skill-advisor-graph/003-skill-advisor-packaging`,
    '011-skill-advisor-graph-pt-05': `${ROOT_SPEC}/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment`,
    '011-skill-advisor-graph-pt-06': `${ROOT_SPEC}/006-search-routing-advisor/002-skill-advisor-graph/005-repo-wide-path-migration`,
    '016-foundational-runtime-pt-01': `${ROOT_SPEC}/008-runtime-executor-hardening/001-foundational-runtime`,
    '016-foundational-runtime-pt-02': `${ROOT_SPEC}/008-runtime-executor-hardening/001-foundational-runtime`,
  };

  for (const [packetName, owner] of Object.entries(reviewOwners)) {
    ownerMap.set(`${ROOT_SPEC}/review/${packetName}`, owner);
  }

  return ownerMap;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const ownerMap = buildExplicitOwnerMap();
  const replacements = [];
  const moved = [];
  const conflicts = [];

  for (const [sourceRelative, ownerRelative] of ownerMap.entries()) {
    const mode = sourceRelative.includes('/review/') ? 'review' : 'research';
    const packetName = path.basename(sourceRelative);
    const sourceAbs = path.join(REPO_ROOT, sourceRelative);
    const ownerAbs = path.join(REPO_ROOT, ownerRelative);
    const destinationAbs = path.join(ownerAbs, mode, packetName);
    const ownerSpec = path.join(ownerAbs, 'spec.md');

    if (!fs.existsSync(sourceAbs)) {
      continue;
    }
    if (!fs.existsSync(ownerSpec)) {
      throw new Error(`Owner spec folder missing spec.md: ${ownerRelative}`);
    }
    if (fs.existsSync(destinationAbs)) {
      conflicts.push({
        source: sourceRelative,
        destination: normalizePath(path.relative(REPO_ROOT, destinationAbs)),
      });
      continue;
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(destinationAbs), { recursive: true });
      fs.renameSync(sourceAbs, destinationAbs);
    }

    const destinationRelative = normalizePath(path.relative(REPO_ROOT, destinationAbs));
    replacements.push([sourceRelative, destinationRelative]);
    moved.push({
      mode,
      packetName,
      source: sourceRelative,
      destination: destinationRelative,
      owner: ownerRelative,
    });
  }

  const rewrittenFiles = rewriteLiveReferences(replacements, dryRun);
  const rootResearchDir = path.join(REPO_ROOT, ROOT_SPEC, 'research');
  const rootReviewDir = path.join(REPO_ROOT, ROOT_SPEC, 'review');
  const remainingResearch = listEntries(rootResearchDir).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const remainingReview = listEntries(rootReviewDir).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

  process.stdout.write(`${JSON.stringify({
    dryRun,
    movedCount: moved.length,
    conflictCount: conflicts.length,
    rewrittenFilesCount: rewrittenFiles.length,
    moved,
    conflicts,
    rewrittenFiles,
    remainingRootResearch: remainingResearch,
    remainingRootReview: remainingReview,
  }, null, 2)}\n`);
}

main();
