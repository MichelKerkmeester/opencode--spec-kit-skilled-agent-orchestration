// ───────────────────────────────────────────────────────────────
// MODULE: Lexical Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, scoreTokenOverlap, tokenize } from '../text.js';

const SYNONYMS: Readonly<Record<string, readonly string[]>> = {
  branch: ['git', 'worktree', 'merge'],
  commit: ['git', 'changes'],
  context: ['memory', 'session', 'save'],
  docs: ['documentation', 'readme', 'markdown'],
  document: ['documentation', 'markdown'],
  find: ['search', 'locate'],
  fix: ['debug', 'correct', 'patch'],
  prompt: ['improve', 'enhance', 'optimize'],
  review: ['audit', 'findings', 'regression'],
  save: ['memory', 'context', 'preserve'],
  search: ['find', 'locate', 'semantic'],
  spec: ['plan', 'packet', 'tasks', 'checklist'],
  test: ['vitest', 'verify'],
  write: ['create', 'generate', 'documentation'],
};

const CATEGORY_HINTS: Readonly<Record<string, readonly string[]>> = {
  'sk-code-opencode': ['classifier', 'helper', 'fixture', 'vitest', 'commonjs', 'typescript', 'python', 'script', 'mcp json', 'gate3 baseline'],
  'sk-doc': ['readme', 'feature catalog', 'playbook', 'taxonomy', 'documentation', 'docs', 'manual testing'],
  'system-spec-kit': ['spec folder', 'packet', 'plan', 'tasks', 'checklist', 'memory save', 'handover', 'implementation summary', 'corpus'],
  'sk-code-review': ['review', 'audit', 'findings', 'regression', 'drift', 'readiness', 'false positives'],
  'mcp-coco-index': ['semantic search', 'vector search', 'grep not enough', 'find code', 'where logic'],
  'sk-deep-research': ['deep research', 'research loop', 'overnight research', 'delta record', 'state log', 'lineage'],
  'sk-deep-review': ['deep review', 'review loop', 'release readiness', 'canonical jsonl', 'convergence tracked'],
  'mcp-figma': ['figma design', 'component screenshots', 'component hierarchy', 'main frame'],
  'mcp-chrome-devtools': ['chrome devtools', 'har', 'console errors', 'staging'],
  'sk-improve-prompt': ['better prompt', 'cleaner prompt', 'prompt package', 'system prompt', 'prompt variant'],
  'sk-git': ['git worktree', 'experiment branch', 'clean branch'],
  'sk-code': ['css', 'html', 'javascript', 'webflow', 'browser', 'frontend', 'layout', 'viewport', 'responsive', 'mobile', 'cdn'],
};

function expandedTokens(prompt: string): string[] {
  const tokens = tokenize(prompt);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const synonym of SYNONYMS[token] ?? []) {
      expanded.add(synonym);
    }
  }
  return [...expanded];
}

export function scoreLexicalLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = expandedTokens(prompt);
  const matches: LaneMatch[] = [];

  for (const skill of projection.skills) {
    const evidence: string[] = [];
    let score = scoreTokenOverlap(tokens, [
      skill.id.replace(/-/g, ' '),
      skill.name,
      skill.description,
      ...skill.domains,
      ...skill.intentSignals,
      ...skill.keywords,
    ]);

    for (const hint of CATEGORY_HINTS[skill.id] ?? []) {
      if (matchesPhraseBoundary(lower, hint)) {
        score += 0.38;
        evidence.push(`hint:${hint}`);
      }
    }

    const tokenHits = tokens.filter((token) => {
      const haystack = `${skill.id} ${skill.name} ${skill.description} ${skill.domains.join(' ')}`.toLowerCase();
      return haystack.includes(token);
    }).slice(0, 5);
    evidence.push(...tokenHits.map((token) => `token:${token}`));

    if (score <= 0.05) continue;
    matches.push({
      skillId: skill.id,
      lane: 'lexical',
      score: Math.min(score, 1),
      evidence: evidence.slice(0, 6),
    });
  }

  return matches;
}
