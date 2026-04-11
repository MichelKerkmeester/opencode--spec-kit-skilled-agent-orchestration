#!/usr/bin/env node
/**
 * Deep Memory Quality Audit — semantic and cross-file issues
 * Looks for patterns the surface audit missed
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const SPEC_ROOT = '.opencode/specs';
const files = execSync(
  `find ${SPEC_ROOT} -path '*/memory/*.md' -type f ! -name 'metadata.json' ! -name '.gitkeep' ! -name 'SKILL.md'`,
  { encoding: 'utf-8' }
).trim().split('\n').filter(Boolean);

const findings = {
  triggerPhrases_ngramNoise: [],      // trigger_phrases that look like n-gram noise
  triggerPhrases_overlapping: [],     // heavy overlap (e.g., "a b", "a b c", "b c")
  decisions_mismatch: [],             // session summary says N decisions but anchor has 0
  provenance_empty: [],               // _sourceTranscriptPath/_sourceSessionId empty
  git_fileCount_zero: [],             // captured_file_count > 0 but git_changed_file_count = 0
  causalLinks_empty: [],              // metadata has empty causal_links despite cross-spec references in body
  keyTopics_duplicated: [],           // key_topics items are n-gram duplicates
  title_pathSuffix: [],               // title ends with [full/path/to/session]
  description_mangled: [],            // description looks like colon-separated metadata
  session_history_empty: [],          // session-history has 0 messages
  continueSession_template: [],       // continue-session has only template boilerplate
  recoveryHints_empty: [],            // recovery-hints is just the table header
  metadata_messageCount_vs_historyLength: [],  // metadata message_count disagrees with history length
  duplicate_sessions: new Map(),      // files with identical H1 titles
  stale_specFolder_refs: [],          // references spec folders that don't exist
  quality_score_inflation: [],        // quality_score=1.00 but low actual content
  fs_missing_fields: [],              // spec_folder_health.errors > 0
};

// Build set of existing spec folders for stale reference check
const existingSpecs = new Set();
const specDirs = execSync('find .opencode/specs -maxdepth 3 -type d -name "[0-9]*-*"', { encoding: 'utf-8' })
  .trim().split('\n').filter(Boolean);
for (const d of specDirs) {
  const parts = d.split('/');
  const name = parts[parts.length - 1];
  existingSpecs.add(name);
}

for (const filePath of files) {
  const content = readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) continue;
  const fm = fmMatch[1];
  const body = fmMatch[2];

  // ─── Trigger phrases analysis ─────────────────────────────────
  const tpMatch = fm.match(/^trigger_phrases:\s*\n((?:\s*-\s+.+\n?)+)/m);
  if (tpMatch) {
    const items = tpMatch[1].match(/^\s*-\s+["']?(.+?)["']?$/gm)
      ?.map(l => l.replace(/^\s*-\s+["']?/, '').replace(/["']?$/, '').trim()) || [];
    
    // Overlapping n-gram detection: if we have "a b c", "b c d", "c d e" pattern
    let overlapping = 0;
    for (let i = 0; i < items.length - 1; i++) {
      const wordsA = items[i].split(' ');
      const wordsB = items[i + 1].split(' ');
      if (wordsA.length >= 2 && wordsB.length >= 2) {
        const suffix = wordsA.slice(1).join(' ');
        const prefix = wordsB.slice(0, -1).join(' ');
        if (suffix === prefix) overlapping++;
      }
    }
    if (overlapping >= 5) {
      findings.triggerPhrases_overlapping.push({ file: filePath, count: overlapping });
    }

    // N-gram noise: phrases like "022 hybrid rag" or "rag fusion 001"
    const noisy = items.filter(p => /^\d{3}|^kit \d|^spec kit|\d{3} hybrid/.test(p));
    if (noisy.length >= 5) {
      findings.triggerPhrases_ngramNoise.push({ file: filePath, count: noisy.length });
    }
  }

  // ─── Decisions mismatch ───────────────────────────────────────
  const decisionsClaimMatch = body.match(/Decisions Made\s*\|\s*(\d+)/) || body.match(/decision_count:\s*(\d+)/);
  const claimed = decisionsClaimMatch ? parseInt(decisionsClaimMatch[1]) : null;
  const actualDecisionHeadings = (body.match(/^###\s+\[?\s*[Dd]ecision\s*\d|<!-- ANCHOR:decision-/gm) || []).length;
  if (claimed && claimed >= 2 && actualDecisionHeadings === 0) {
    findings.decisions_mismatch.push({ file: filePath, claimed, actual: actualDecisionHeadings });
  }

  // ─── Provenance fields empty ──────────────────────────────────
  const sourcePathMatch = fm.match(/_sourceTranscriptPath:\s*(.*)/);
  const sourceIdMatch = fm.match(/_sourceSessionId:\s*(.*)/);
  if (sourcePathMatch && sourceIdMatch) {
    const p = sourcePathMatch[1].trim().replace(/['"]/g, '');
    const i = sourceIdMatch[1].trim().replace(/['"]/g, '');
    if (!p && !i) findings.provenance_empty.push(filePath);
  }

  // ─── Git file count anomaly ───────────────────────────────────
  const capturedMatch = fm.match(/captured_file_count:\s*(\d+)/);
  const gitCountMatch = fm.match(/git_changed_file_count:\s*(\d+)/);
  if (capturedMatch && gitCountMatch) {
    const captured = parseInt(capturedMatch[1]);
    const gitCount = parseInt(gitCountMatch[1]);
    if (captured >= 5 && gitCount === 0) {
      findings.git_fileCount_zero.push({ file: filePath, captured, gitCount });
    }
  }

  // ─── Causal links empty despite cross-refs ────────────────────
  const metadataBlock = body.match(/<!-- ANCHOR:metadata -->([\s\S]*?)<!-- \/ANCHOR:metadata -->/)?.[1] || '';
  const hasCausalLinks = /causal_links:\s*\n\s*caused_by:\s*\[\]/.test(metadataBlock) ||
                         /related_to:\s*\[\]/.test(metadataBlock);
  // Check if body mentions other spec folder patterns
  const crossRefs = body.match(/\b(?:022-hybrid-rag-fusion|023-hybrid-rag-fusion-refinement|024-compact-code-graph|025-|026-graph-and-context|027-)/g);
  if (hasCausalLinks && crossRefs && crossRefs.length >= 3) {
    findings.causalLinks_empty.push({ file: filePath, crossRefCount: crossRefs.length });
  }

  // ─── Key topics duplication ───────────────────────────────────
  const ktMatch = metadataBlock.match(/key_topics:\s*\n((?:\s*-\s+.+\n?)+)/);
  if (ktMatch) {
    const items = ktMatch[1].match(/^\s*-\s+.+$/gm)?.map(s => s.replace(/^\s*-\s+/, '').trim()) || [];
    // Check for n-gram duplicates (overlap similar to trigger phrases)
    let kOverlap = 0;
    for (let i = 0; i < items.length - 1; i++) {
      const wa = items[i].split(' ');
      const wb = items[i + 1].split(' ');
      if (wa.length >= 2 && wa.slice(1).join(' ') === wb.slice(0, -1).join(' ')) kOverlap++;
    }
    if (kOverlap >= 3) findings.keyTopics_duplicated.push({ file: filePath, overlap: kOverlap });
  }

  // ─── Title with path suffix ──────────────────────────────────
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?$/m);
  if (titleMatch && /\[[^\]]*\/[^\]]*\]$/.test(titleMatch[1])) {
    findings.title_pathSuffix.push({ file: filePath, title: titleMatch[1].slice(0, 80) });
  }

  // ─── Mangled description (colon soup) ────────────────────────
  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?$/m);
  if (descMatch) {
    const desc = descMatch[1];
    const colonPairs = (desc.match(/:\s+\w/g) || []).length;
    if (colonPairs >= 3 && /Session Date|Meta Data|SESSION SUMMARY/i.test(desc)) {
      findings.description_mangled.push({ file: filePath, desc: desc.slice(0, 80) });
    }
  }

  // ─── Session history empty ───────────────────────────────────
  const historyMatch = body.match(/<!-- ANCHOR:session-history -->([\s\S]*?)<!-- \/ANCHOR:session-history -->/) ||
                       body.match(/<!-- ANCHOR:conversation -->([\s\S]*?)<!-- \/ANCHOR:conversation -->/);
  if (historyMatch) {
    const hContent = historyMatch[1];
    const messageCount = (hContent.match(/^####?\s+\[?\d|^\*\*User|^\*\*Assistant|^---\s*$/gm) || []).length;
    // Also check if it's just a header table with no actual messages
    const hasOnlyTable = /\|.*\|[\s\S]*\|.*\|/.test(hContent) && !/^>\s*User|^>\s*Assistant/m.test(hContent);
    if (messageCount === 0) {
      findings.session_history_empty.push(filePath);
    }
  }

  // ─── Continue session template boilerplate ───────────────────
  const csMatch = body.match(/<!-- ANCHOR:continue-session -->([\s\S]*?)<!-- \/ANCHOR:continue-session -->/);
  if (csMatch) {
    const csContent = csMatch[1];
    // Heuristic: if continue-session lacks any "Pending" / "Next" / "Blocker" text, it's boilerplate
    const isActionable = /Pending|Next Action|Next Step|Blocker|IN_PROGRESS|PENDING|Status:/i.test(csContent);
    if (!isActionable && csContent.trim().length > 50) {
      findings.continueSession_template.push(filePath);
    }
  }

  // ─── Recovery hints empty/template ───────────────────────────
  const rhMatch = body.match(/<!-- ANCHOR:recovery-hints -->([\s\S]*?)<!-- \/ANCHOR:recovery-hints -->/);
  if (rhMatch) {
    const rhContent = rhMatch[1];
    const hasRealCommand = /```(?:bash|sh|shell)|`[a-z_]+\s+[a-z-]/i.test(rhContent);
    const hasRealScenario = /Scenario|Recovery Step|Diagnostic/i.test(rhContent);
    if (!hasRealCommand && !hasRealScenario) {
      findings.recoveryHints_empty.push(filePath);
    }
  }

  // ─── Duplicate sessions (same H1) ────────────────────────────
  const h1 = body.match(/^#\s+(.+)$/m)?.[1];
  if (h1) {
    if (!findings.duplicate_sessions.has(h1)) findings.duplicate_sessions.set(h1, []);
    findings.duplicate_sessions.get(h1).push(filePath);
  }

  // ─── Stale spec folder references ────────────────────────────
  const specRefs = body.match(/\b(\d{3}-[a-z][a-z0-9-]{3,40})/g);
  if (specRefs) {
    const uniqueRefs = [...new Set(specRefs)];
    const stale = uniqueRefs.filter(r => !existingSpecs.has(r));
    if (stale.length >= 3) {
      findings.stale_specFolder_refs.push({ file: filePath, stale: stale.slice(0, 5) });
    }
  }

  // ─── Quality score inflation ─────────────────────────────────
  const qsMatch = fm.match(/^quality_score:\s*([\d.]+)/m);
  if (qsMatch) {
    const qs = parseFloat(qsMatch[1]);
    const bodyBytes = body.length;
    if (qs >= 0.95 && bodyBytes < 3000) {
      findings.quality_score_inflation.push({ file: filePath, qs, bytes: bodyBytes });
    }
  }

  // ─── Spec folder health errors ───────────────────────────────
  const sfhMatch = fm.match(/spec_folder_health:[\s\S]*?errors:\s*(\d+)/);
  if (sfhMatch && parseInt(sfhMatch[1]) > 0) {
    findings.fs_missing_fields.push({ file: filePath, errors: parseInt(sfhMatch[1]) });
  }
}

// Collapse duplicate sessions Map to only entries with >= 2
const dupes = [...findings.duplicate_sessions.entries()].filter(([, files]) => files.length >= 2);
findings.duplicate_sessions = dupes;

console.log('╔══════════════════════════════════════════════╗');
console.log('║  DEEP MEMORY QUALITY AUDIT                    ║');
console.log('╚══════════════════════════════════════════════╝');
console.log(`Files audited: ${files.length}\n`);

const report = [];
function tally(name, items, description) {
  console.log(`  ${name}: ${items.length}`);
  report.push({ name, count: items.length, description, sample: items.slice(0, 3) });
}

tally('trigger_phrases N-GRAM NOISE', findings.triggerPhrases_ngramNoise, 'Files with 5+ path-derived noise phrases');
tally('trigger_phrases OVERLAPPING', findings.triggerPhrases_overlapping, 'Files with 5+ overlapping n-gram phrases');
tally('decisions COUNT MISMATCH', findings.decisions_mismatch, 'Session claims N decisions but ANCHOR has 0');
tally('provenance EMPTY', findings.provenance_empty, '_sourceTranscriptPath and _sourceSessionId both empty');
tally('git_changed_file_count ZERO', findings.git_fileCount_zero, 'captured>=5 but git_changed=0');
tally('causal_links EMPTY (with body refs)', findings.causalLinks_empty, 'empty causal_links despite 3+ cross-spec refs in body');
tally('key_topics N-GRAM DUPLICATION', findings.keyTopics_duplicated, 'key_topics has 3+ overlapping n-gram items');
tally('title PATH SUFFIX', findings.title_pathSuffix, 'title ends with [spec/path/] suffix');
tally('description MANGLED', findings.description_mangled, 'description looks like colon-separated metadata');
tally('session-history EMPTY', findings.session_history_empty, 'session-history has 0 messages');
tally('continue-session TEMPLATE', findings.continueSession_template, 'continue-session has no actionable status');
tally('recovery-hints EMPTY', findings.recoveryHints_empty, 'recovery-hints lacks commands and scenarios');
tally('DUPLICATE SESSIONS', findings.duplicate_sessions, 'Same H1 title in multiple files');
tally('STALE spec folder refs', findings.stale_specFolder_refs, 'Body references 3+ nonexistent spec folders');
tally('quality_score INFLATED', findings.quality_score_inflation, 'qs>=0.95 but body <3000 bytes');
tally('spec_folder_health ERRORS', findings.fs_missing_fields, 'spec_folder_health.errors > 0');

const totalFindings = Object.values(findings).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0);
console.log(`\nTotal deep findings: ${totalFindings}`);

// Write to JSON for phase plan use
import('fs').then(({ writeFileSync }) => {
  writeFileSync('/tmp/deep-findings.json', JSON.stringify(report, null, 2));
  console.log('Saved: /tmp/deep-findings.json');
});
