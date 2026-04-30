// ───────────────────────────────────────────────────────────────
// MODULE: Explicit Author Lane
// ───────────────────────────────────────────────────────────────

import type { AdvisorProjection, LaneMatch } from '../types.js';
import { matchesPhraseBoundary, phraseSpecificity, skillNameVariants, tokenize } from '../text.js';

const TOKEN_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
  audit: [['sk-code-review', 0.75]],
  branch: [['sk-git', 0.45]],
  browser: [['sk-code', 0.55]],
  checklist: [['system-spec-kit', 0.55]],
  chrome: [['mcp-chrome-devtools', 0.95]],
  codex: [['cli-codex', 0.9]],
  commit: [['sk-git', 0.65]],
  commonjs: [['sk-code-opencode', 0.75]],
  component: [['mcp-figma', 0.55]],
  context: [['system-spec-kit', 0.65]],
  corpus: [['system-spec-kit', 0.45]],
  css: [['sk-code', 0.55]],
  dashboard: [['sk-code', 0.35]],
  debug: [['sk-code', 0.25]],
  design: [['mcp-figma', 0.65]],
  devtools: [['mcp-chrome-devtools', 1]],
  docs: [['sk-doc', 0.8]],
  documentation: [['sk-doc', 0.85]],
  figma: [['mcp-figma', 1]],
  findings: [['sk-code-review', 0.85]],
  frontend: [['sk-code', 0.7]],
  git: [['sk-git', 1]],
  github: [['sk-git', 0.95]],
  grep: [['mcp-coco-index', 0.45]],
  har: [['mcp-chrome-devtools', 0.75]],
  html: [['sk-code', 0.55]],
  javascript: [['sk-code', 0.65]],
  json: [['sk-code-opencode', 0.4]],
  jsonl: [['sk-code-opencode', 0.45], ['system-spec-kit', 0.35]],
  layout: [['sk-code', 0.45]],
  mcp: [['sk-code-opencode', 0.65], ['mcp-code-mode', 0.45]],
  memory: [['system-spec-kit', 0.95]],
  mobile: [['sk-code', 0.45]],
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
  responsive: [['sk-code', 0.55]],
  review: [['sk-code-review', 0.85]],
  reviewer: [],
  routing: [['system-spec-kit', 0.25]],
  save: [['system-spec-kit', 0.6]],
  semantic: [['mcp-coco-index', 0.8]],
  shell: [['sk-code-opencode', 0.55]],
  staging: [['mcp-chrome-devtools', 0.35]],
  style: [['sk-code', 0.4]],
  taxonomy: [['sk-doc', 0.45]],
  tests: [['sk-code-opencode', 0.35]],
  typescript: [['sk-code-opencode', 0.75]],
  vitest: [['sk-code-opencode', 0.85]],
  viewport: [['sk-code', 0.45]],
  vscode: [['sk-code-opencode', 0.75]],
  web: [['sk-code', 0.5]],
  worktree: [['sk-git', 1]],
  delete: [['system-spec-kit', 0.45]],
  scratch: [['system-spec-kit', 0.45]],
  // sk-code stack keywords (added 2026-04-30 in 054-sk-code-merger)
  webflow: [['sk-code', 0.95]],
  animation: [['sk-code', 0.75]],
  react: [['sk-code', 0.85]],
  nextjs: [['sk-code', 0.85]],
  'next.js': [['sk-code', 0.85]],
  swift: [['sk-code', 0.85]],
  swiftui: [['sk-code', 0.85]],
  go: [['sk-code', 0.7]],
  golang: [['sk-code', 0.85]],
  nodejs: [['sk-code', 0.65]],
  expo: [['sk-code', 0.85]],
  service: [['sk-code', 0.45]],
  handler: [['sk-code', 0.5]],
  endpoint: [['sk-code', 0.5]],
  flicker: [['sk-code', 0.4]],
  minify: [['sk-code', 0.65]],
  cdn: [['sk-code', 0.55]],
  lighthouse: [['sk-code', 0.65]],
  pagespeed: [['sk-code', 0.65]],
  tbt: [['sk-code', 0.65]],
  inp: [['sk-code', 0.65]],
  lcp: [['sk-code', 0.55]],
  fcp: [['sk-code', 0.55]],
  cls: [['sk-code', 0.55]],
  lenis: [['sk-code', 0.85]],
  swiper: [['sk-code', 0.85]],
  hls: [['sk-code', 0.85]],
  filepond: [['sk-code', 0.85]],
  gsap: [['sk-code', 0.75]],
  motion: [['sk-code', 0.45]],
  observer: [['sk-code', 0.4]],
  intersection: [['sk-code', 0.4]],
  // sk-code fullstack-branch keywords (added 2026-04-30 in 056-sk-code-fullstack-branch)
  // REACT live-branch tokens (kerkmeester-style Next.js 14)
  'vanilla-extract': [['sk-code', 0.95]],
  vanillaextract: [['sk-code', 0.9]],
  recipe: [['sk-code', 0.4]],
  'untitled-ui': [['sk-code', 0.85]],
  untitledui: [['sk-code', 0.85]],
  hydration: [['sk-code', 0.85]],
  tinacms: [['sk-code', 0.85]],
  sonner: [['sk-code', 0.7]],
  'next-themes': [['sk-code', 0.75]],
  'react-aria': [['sk-code', 0.75]],
  'react-hook-form': [['sk-code', 0.85]],
  zod: [['sk-code', 0.55]],
  embla: [['sk-code', 0.6]],
  recharts: [['sk-code', 0.6]],
  kerkmeester: [['sk-code', 1]],
  // GO live-branch tokens (gin + sqlc + Postgres)
  gin: [['sk-code', 0.95]],
  echo: [['sk-code', 0.55]],
  chi: [['sk-code', 0.55]],
  fiber: [['sk-code', 0.55]],
  sqlc: [['sk-code', 0.95]],
  pgx: [['sk-code', 0.85]],
  postgres: [['sk-code', 0.45]],
  'golang-migrate': [['sk-code', 0.85]],
  validator: [['sk-code', 0.5]],
  'go-playground': [['sk-code', 0.85]],
  'golang-jwt': [['sk-code', 0.85]],
  dlv: [['sk-code', 0.7]],
  pprof: [['sk-code', 0.75]],
  'golangci-lint': [['sk-code', 0.85]],
  slog: [['sk-code', 0.6]],
  // Generic fullstack tokens
  fullstack: [['sk-code', 0.65]],
  hydrate: [['sk-code', 0.7]],
  ssr: [['sk-code', 0.6]],
  rsc: [['sk-code', 0.6]],
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
  'routing dashboard': [['sk-code', 0.35]],
  'routing study config': [['system-spec-kit', 0.85]],
  'css layout': [['sk-code', 0.85]],
  'viewport height': [['sk-code', 0.55]],
  'mobile browser': [['sk-code', 0.6]],
  'browser verification': [['sk-code', 0.7]],
  'save context': [['system-spec-kit', 1]],
  'save memory': [['system-spec-kit', 1]],
  'semantic code search': [['mcp-coco-index', 1]],
  'source-type mix': [['system-spec-kit', 0.35]],
  'system prompt': [['sk-improve-prompt', 0.8]],
  'prompt variant': [['sk-improve-prompt', 1]],
  'user prompt': [['sk-improve-prompt', 0.9]],
  'cleaner user prompt': [['sk-improve-prompt', 1]],
  'vector-search': [['mcp-coco-index', 1]],
  // sk-code fullstack-branch phrases (added 2026-04-30 in 056-sk-code-fullstack-branch)
  'app router': [['sk-code', 0.95]],
  'server component': [['sk-code', 0.95]],
  'client component': [['sk-code', 0.85]],
  'server action': [['sk-code', 0.95]],
  'next.js app': [['sk-code', 0.85]],
  'next-js app': [['sk-code', 0.85]],
  'nextjs app': [['sk-code', 0.85]],
  'kerkmeester pattern': [['sk-code', 1]],
  'kerkmeester style': [['sk-code', 1]],
  'kerkmeester-style': [['sk-code', 1]],
  'vanilla-extract recipe': [['sk-code', 1]],
  'motion v12': [['sk-code', 0.95]],
  'react aria': [['sk-code', 0.85]],
  'react-hook-form': [['sk-code', 0.85]],
  'gin handler': [['sk-code', 0.95]],
  'gin server': [['sk-code', 0.95]],
  'sqlc query': [['sk-code', 0.95]],
  'sqlc generate': [['sk-code', 0.95]],
  'pgx pool': [['sk-code', 0.85]],
  'go-playground/validator': [['sk-code', 0.95]],
  'go playground validator': [['sk-code', 0.85]],
  'golang-jwt': [['sk-code', 0.95]],
  'react go pairing': [['sk-code', 1]],
  'react-go pairing': [['sk-code', 1]],
  'cross-stack pairing': [['sk-code', 0.95]],
  'jwt handoff': [['sk-code', 0.85]],
  'error envelope': [['sk-code', 0.65]],
  'fullstack branch': [['sk-code', 0.85]],
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
