// ───────────────────────────────────────────────────────────────
// MODULE: Explicit Author Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, skillNameVariants, tokenize } from '../text.js';

const TOKEN_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  audit: [['sk-code-review', 0.75]],
  branch: [['sk-git', 0.45]],
  browser: [['sk-code-web', 0.55]],
  checklist: [['system-spec-kit', 0.55]],
  chrome: [['mcp-chrome-devtools', 0.95]],
  codex: [['cli-codex', 0.9]],
  commit: [['sk-git', 0.65]],
  commonjs: [['sk-code-opencode', 0.75]],
  component: [['mcp-figma', 0.55]],
  context: [['system-spec-kit', 0.65]],
  corpus: [['system-spec-kit', 0.45]],
  css: [['sk-code-web', 0.55]],
  dashboard: [['sk-code-web', 0.35]],
  debug: [['sk-code-web', 0.25]],
  design: [['mcp-figma', 0.65]],
  devtools: [['mcp-chrome-devtools', 1]],
  docs: [['sk-doc', 0.8]],
  documentation: [['sk-doc', 0.85]],
  figma: [['mcp-figma', 1]],
  findings: [['sk-code-review', 0.85]],
  frontend: [['sk-code-web', 0.7]],
  git: [['sk-git', 1]],
  github: [['sk-git', 0.95]],
  grep: [['mcp-coco-index', 0.45]],
  har: [['mcp-chrome-devtools', 0.75]],
  html: [['sk-code-web', 0.55]],
  javascript: [['sk-code-web', 0.65]],
  json: [['sk-code-opencode', 0.4]],
  jsonl: [['sk-code-opencode', 0.45], ['system-spec-kit', 0.35]],
  layout: [['sk-code-web', 0.45]],
  mcp: [['sk-code-opencode', 0.65], ['mcp-code-mode', 0.45]],
  memory: [['system-spec-kit', 0.95]],
  mobile: [['sk-code-web', 0.45]],
  opencode: [['sk-code-opencode', 1]],
  packet: [['system-spec-kit', 0.55]],
  playbook: [['sk-doc', 0.75]],
  pr: [['sk-code-review', 0.5], ['sk-git', 0.35]],
  prompt: [['sk-improve-prompt', 0.75]],
  prompts: [['sk-improve-prompt', 0.75]],
  python: [['sk-code-opencode', 0.7]],
  readme: [['sk-doc', 0.95]],
  rebase: [['sk-git', 0.85]],
  reducer: [['sk-code-opencode', 0.35]],
  regression: [['sk-code-review', 0.55]],
  responsive: [['sk-code-web', 0.55]],
  review: [['sk-code-review', 0.85]],
  reviewer: [],
  routing: [['system-spec-kit', 0.25]],
  save: [['system-spec-kit', 0.6]],
  semantic: [['mcp-coco-index', 0.8]],
  shell: [['sk-code-opencode', 0.55]],
  staging: [['mcp-chrome-devtools', 0.35]],
  style: [['sk-code-web', 0.4]],
  taxonomy: [['sk-doc', 0.45]],
  tests: [['sk-code-opencode', 0.35]],
  typescript: [['sk-code-opencode', 0.75]],
  vitest: [['sk-code-opencode', 0.85]],
  viewport: [['sk-code-web', 0.45]],
  vscode: [['sk-code-opencode', 0.75]],
  web: [['sk-code-web', 0.5]],
  worktree: [['sk-git', 1]],
  delete: [['system-spec-kit', 0.45]],
  scratch: [['system-spec-kit', 0.45]],
};

const PHRASE_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  '/memory:save': [['command-memory-save', 1], ['system-spec-kit', 0.9]],
  '/spec_kit:deep-research': [['sk-deep-research', 1.6], ['command-spec-kit', 0.45]],
  '/spec_kit:deep-review': [['sk-deep-review', 1.6], ['command-spec-kit', 0.45]],
  '/spec_kit:resume': [['system-spec-kit', 0.9], ['command-spec-kit', 0.75]],
  'auto review release readiness': [['sk-deep-review', 1]],
  'chrome devtools': [['mcp-chrome-devtools', 1]],
  'staging url': [['mcp-chrome-devtools', 0.65]],
  'staging site': [['mcp-chrome-devtools', 0.65]],
  'staging website': [['mcp-chrome-devtools', 0.65]],
  'live site': [['mcp-chrome-devtools', 0.65]],
  'live website': [['mcp-chrome-devtools', 0.65]],
  'live url': [['mcp-chrome-devtools', 0.65]],
  'production site': [['mcp-chrome-devtools', 0.65]],
  'production website': [['mcp-chrome-devtools', 0.65]],
  'production url': [['mcp-chrome-devtools', 0.65]],
  'browser console': [['mcp-chrome-devtools', 0.75]],
  'cleaner prompt': [['sk-improve-prompt', 1]],
  'code review': [['sk-code-review', 1]],
  'classifier vocabulary': [['sk-code-review', 0.9]],
  'commonjs helper': [['sk-code-opencode', 1]],
  'create a prompt': [['sk-improve-prompt', 0.95]],
  'deep research': [['sk-deep-research', 1]],
  'deep review': [['sk-deep-review', 1]],
  'deep-research': [['sk-deep-research', 1.3]],
  'deep-review': [['sk-deep-review', 1.3]],
  'gate 3': [['system-spec-kit', 0.35], ['sk-code-opencode', 0.25]],
  'gate-3-classifier': [['sk-code-opencode', 1]],
  'generate implementation-summary': [['system-spec-kit', 1]],
  'implementation-summary.md': [['system-spec-kit', 0.8]],
  'continuation prompts': [['system-spec-kit', 0.9]],
  'first-100 predictions': [['system-spec-kit', 0.8]],
  'improve my prompt': [['sk-improve-prompt', 1]],
  'manual testing playbook': [['sk-doc', 1]],
  'negative-trigger whitelist': [['sk-code-opencode', 0.9]],
  'list any mismatches': [['sk-code-review', 0.8]],
  'open the figma': [['mcp-figma', 1]],
  'pull request': [['sk-code-review', 0.45], ['sk-git', 0.45]],
  'resume deep research': [['sk-deep-research', 1]],
  'resume deep review': [['sk-deep-review', 1]],
  'resume the phase folder': [['system-spec-kit', 1]],
  'phase folder': [['system-spec-kit', 0.75]],
  'routing dashboard': [['sk-code-web', 0.35]],
  'routing study config': [['system-spec-kit', 0.85]],
  'css layout': [['sk-code-web', 0.85]],
  'viewport height': [['sk-code-web', 0.55]],
  'mobile browser': [['sk-code-web', 0.6]],
  'browser verification': [['sk-code-web', 0.7]],
  'save context': [['system-spec-kit', 1]],
  'save memory': [['system-spec-kit', 1]],
  'semantic code search': [['mcp-coco-index', 1]],
  'source-type mix': [['system-spec-kit', 0.35]],
  'system prompt': [['sk-improve-prompt', 0.8]],
  'prompt variant': [['sk-improve-prompt', 1]],
  'user prompt': [['sk-improve-prompt', 0.9]],
  'cleaner user prompt': [['sk-improve-prompt', 1]],
  'vector-search': [['mcp-coco-index', 1]],
};

const WRITE_VERBS = /\b(add|build|change|configure|create|edit|fix|generate|implement|modify|patch|refactor|rename|replace|run|update|write)\b/;

function push(scores: Map<string, { score: number; evidence: string[] }>, skillId: string, amount: number, evidence: string): void {
  const current = scores.get(skillId) ?? { score: 0, evidence: [] };
  current.score += amount;
  current.evidence.push(evidence);
  scores.set(skillId, current);
}

export function scoreExplicitLane(prompt: string, projection: AdvisorProjection): LaneMatch[] {
  const lower = prompt.toLowerCase();
  const tokens = tokenize(prompt, true);
  const scores = new Map<string, { score: number; evidence: string[] }>();

  for (const [phrase, boosts] of Object.entries(PHRASE_BOOSTS)) {
    if (!lower.includes(phrase)) continue;
    for (const [skillId, amount] of boosts) {
      push(scores, skillId, amount, `phrase:${phrase}`);
    }
  }

  for (const token of tokens) {
    for (const [skillId, amount] of TOKEN_BOOSTS[token] ?? []) {
      push(scores, skillId, amount, `token:${token}`);
    }
  }

  if (WRITE_VERBS.test(lower) && /\b(readme|docs|documentation|playbook|taxonomy|markdown|feature_catalog)\b/.test(lower)) {
    push(scores, 'sk-doc', 0.7, 'write-doc-surface');
  }
  if (WRITE_VERBS.test(lower) && /\b(classifier|helper|fixture|json|jsonl|vitest|typescript|python|script|skill_advisor\.py|mcp\.json|commonjs)\b/.test(lower)) {
    push(scores, 'sk-code-opencode', 0.7, 'write-system-code-surface');
  }
  if (WRITE_VERBS.test(lower) && /\b(error classes|trigger gap|reporter|mismatches?|bucket|gate 3)\b/.test(lower)) {
    push(scores, 'sk-code-opencode', 0.6, 'write-routing-tool-surface');
  }
  if (/\b(continue|resume|launch|kick off|overnight|convergence|iteration)\b/.test(lower) && /\bresearch\b/.test(lower)) {
    push(scores, 'sk-deep-research', 0.85, 'research-loop');
  }
  if (/\b(continue|resume|launch|start|convergence|iteration)\b/.test(lower) && /\breview\b/.test(lower)) {
    push(scores, 'sk-deep-review', 0.85, 'review-loop');
  }

  for (const skill of projection.skills) {
    for (const variant of skillNameVariants(skill.id)) {
      if (matchesPhraseBoundary(lower, variant)) {
        push(scores, skill.id, 1, `explicit:${variant}`);
      }
    }
    for (const phrase of [...skill.intentSignals, ...skill.keywords]) {
      if (matchesPhraseBoundary(lower, phrase)) {
        push(scores, skill.id, phraseSpecificity(phrase), `author:${phrase}`);
      }
    }
  }

  return [...scores.entries()].map(([skillId, value]) => ({
    skillId,
    lane: 'explicit_author' as const,
    score: Math.min(value.score, 1),
    evidence: value.evidence.slice(0, 6),
  }));
}
