// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Dynamic Target Profile Generator                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const W_STRUCT = 10;
const W_RULE = 8;
const W_CHECK = 5;
const W_ANTI = 8;
const SECTION_RE = /^## (\d+)\.\s+(.+)$/gm;
const H3_RE = /^### (.+)$/gm;
const CHECKLIST_RE = /^[□☐]\s+(.+)$/gm;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const e of argv) {
    if (!e.startsWith('--')) { continue; }
    const [k, ...r] = e.slice(2).split('=');
    args[k] = r.length > 0 ? r.join('=') : true;
  }
  return args;
}

function writeJson(fp, v) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, `${JSON.stringify(v, null, 2)}\n`, 'utf8');
}

function allMatches(re, text) {
  const out = []; let m;
  const r = new RegExp(re.source, re.flags);
  while ((m = r.exec(text)) !== null) { out.push(m); }
  return out;
}

function listItems(text) {
  return text.split('\n')
    .filter((l) => /^[-*]\s+/.test(l.trim()))
    .map((l) => l.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONTMATTER PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseFrontmatter(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s+(.+)$/);
    if (kv && kv[2].trim()) { meta[kv[1]] = kv[2].trim(); }
  }
  return meta;
}

function parsePermissions(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { return {}; }
  const pb = fm[1].match(/permission:\s*\n((?:\s+\w+:\s+\w+\n?)+)/);
  if (!pb) { return {}; }
  const perms = {};
  for (const line of pb[1].split('\n')) {
    const m = line.trim().match(/^(\w+):\s+(\w+)$/);
    if (m) { perms[m[1]] = m[2]; }
  }
  return perms;
}

function permSummary(perms) {
  const allowed = [], denied = [];
  for (const [k, v] of Object.entries(perms)) {
    (v === 'allow' ? allowed : denied).push(k);
  }
  return { allowed, denied };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SECTION PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseSections(content) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const marks = allMatches(SECTION_RE, body);
  const secs = {};
  for (let i = 0; i < marks.length; i++) {
    const name = marks[i][2].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = marks[i].index + marks[i][0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : body.length;
    secs[name] = body.slice(start, end).trim();
  }
  return secs;
}

function getSection(secs, ...names) {
  for (const n of names) {
    const key = Object.keys(secs).find((k) => k.includes(n.toUpperCase()));
    if (key) { return secs[key]; }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DERIVED CHECK EXTRACTORS
// ─────────────────────────────────────────────────────────────────────────────
function deriveStructural(secs) {
  const probes = [
    ['has-core-workflow', 'CORE WORKFLOW'], ['has-output-verification', 'OUTPUT VERIFICATION'],
    ['has-anti-patterns', 'ANTI'], ['has-capability-scan', 'CAPABILITY SCAN'],
    ['has-rules', 'RULES'], ['has-related-resources', 'RELATED RESOURCES'],
  ];
  return probes
    .filter(([, label]) => Object.keys(secs).some((k) => k.includes(label.toUpperCase())))
    .map(([id, label]) => ({ id, description: `Agent has ${label} section`, weight: id.includes('anti') ? 5 : W_STRUCT }));
}

function extractRuleBlock(text, heading) {
  const re = new RegExp(`###\\s+(?:${heading})\\s*\\n([\\s\\S]*?)(?=\\n###|\\n##|\\n$|$)`, 'i');
  const m = text.match(re);
  return m ? listItems(m[1]) : [];
}

function deriveRules(secs) {
  const rc = getSection(secs, 'RULES') || getSection(secs, 'OPERATING RULES') || '';
  const checks = [];
  extractRuleBlock(rc, 'ALWAYS|Always|✅\\s*ALWAYS').forEach((rule, i) => {
    checks.push({ id: `always-rule-${i}`, rule, type: 'always', weight: W_RULE });
  });
  extractRuleBlock(rc, 'NEVER|Never|❌\\s*NEVER').forEach((rule, i) => {
    checks.push({ id: `never-rule-${i}`, rule, type: 'never', weight: W_RULE });
  });
  extractRuleBlock(rc, '(?:⚠️\\s*)?ESCALATE\\s+(?:IF|WHEN)').forEach((rule, i) => {
    checks.push({ id: `escalate-${i}`, rule, type: 'escalate', weight: 3 });
  });
  return checks;
}

function deriveOutputChecks(secs) {
  const vc = getSection(secs, 'OUTPUT VERIFICATION', 'VERIFICATION');
  if (!vc) { return []; }
  const checks = [];
  const items = allMatches(CHECKLIST_RE, vc);
  items.forEach((m, i) => checks.push({ id: `checklist-${i}`, check: m[1].trim(), weight: W_CHECK }));
  const brackets = allMatches(/^\[]\s+(.+)$/gm, vc);
  brackets.forEach((m, i) => checks.push({ id: `checklist-${items.length + i}`, check: m[1].trim(), weight: W_CHECK }));
  return checks;
}

function deriveForbidden(secs) {
  const ac = getSection(secs, 'ANTI');
  if (!ac) { return []; }
  return ac.split('\n')
    .filter((l) => /^[-*]\s+\*\*[Nn]ever\b/.test(l.trim()))
    .map((l, i) => ({ id: `anti-${i}`, pattern: l.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim(), weight: W_ANTI }));
}

function tableNames(text) {
  return text.split('\n')
    .filter((l) => /^\|/.test(l.trim()) && !/^\|[-\s|]+$/.test(l) && !/^\|\s*(Skill|Agent|Command|Purpose|Path)\s*\|/i.test(l))
    .map((r) => { const c = r.split('|').map((s) => s.trim()).filter(Boolean); return c.length ? c[0].replace(/`/g, '').replace(/^@/, '').trim() : null; })
    .filter(Boolean);
}

function deriveIntegration(secs) {
  const result = { commands: [], skills: [], agents: [] };
  const rc = getSection(secs, 'RELATED RESOURCES');
  if (!rc) { return result; }
  const subs = {};
  const h3s = allMatches(H3_RE, rc);
  for (let i = 0; i < h3s.length; i++) {
    const label = h3s[i][1].toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim();
    const start = h3s[i].index + h3s[i][0].length;
    const end = i + 1 < h3s.length ? h3s[i + 1].index : rc.length;
    subs[label] = rc.slice(start, end).trim();
  }
  const addUnique = (arr, val) => { if (!arr.includes(val)) { arr.push(val); } };
  const cmdKey = Object.keys(subs).find((k) => k.includes('COMMAND'));
  if (cmdKey) { allMatches(/`(\/[^`]+)`/g, subs[cmdKey]).forEach((m) => addUnique(result.commands, m[1])); }
  const skillKey = Object.keys(subs).find((k) => k.includes('SKILL'));
  if (skillKey) { tableNames(subs[skillKey]).forEach((n) => addUnique(result.skills, n)); }
  const agentKey = Object.keys(subs).find((k) => k.includes('AGENT'));
  if (agentKey) { tableNames(subs[agentKey]).forEach((n) => addUnique(result.agents, n)); }
  return result;
}

function deriveMismatches(secs, perms) {
  const cc = getSection(secs, 'CAPABILITY SCAN');
  if (!cc) { return []; }
  const out = [];
  for (const row of cc.split('\n').filter((l) => /^\|\s*`/.test(l.trim()))) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) { continue; }
    const tool = cells[0].replace(/`/g, '');
    const norm = tool.replace(/_/g, '').toLowerCase();
    for (const [perm, val] of Object.entries(perms)) {
      if (val === 'deny' && norm.includes(perm.toLowerCase())) {
        out.push({ tool, permission: perm, status: 'deny' });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROFILE BUILDER
// ─────────────────────────────────────────────────────────────────────────────
function buildProfile(agentPath, content) {
  const meta = parseFrontmatter(content);
  const perms = parsePermissions(content);
  const secs = parseSections(content);
  const id = meta.name || path.basename(agentPath, '.md');
  return {
    id, family: 'derived', targetPath: agentPath, outputKind: 'markdown',
    promotionEligible: false, generated: true, generatedAt: new Date().toISOString(),
    agentMeta: {
      name: id, mode: meta.mode || 'subagent',
      temperature: parseFloat(meta.temperature) || 0.1,
      permissionSummary: permSummary(perms),
    },
    derivedChecks: {
      structural: deriveStructural(secs), ruleCoherence: deriveRules(secs),
      outputChecks: deriveOutputChecks(secs), forbiddenBehaviors: deriveForbidden(secs),
      integrationPoints: deriveIntegration(secs), capabilityMismatches: deriveMismatches(secs, perms),
    },
    benchmark: { fixtureDir: null, requiredAggregateScore: 75, minimumFixtureScore: 60, repeatabilityTolerance: 0 },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.agent) {
    process.stderr.write('Usage: node generate-profile.cjs --agent=<path-to-agent.md> [--output=<path.json>]\n');
    process.exit(2);
  }
  let content;
  try { content = fs.readFileSync(args.agent, 'utf8'); } catch (err) {
    process.stderr.write(`Failed to read agent file: ${err.message}\n`);
    process.exit(1);
  }
  const profile = buildProfile(args.agent, content);
  const json = `${JSON.stringify(profile, null, 2)}\n`;
  if (args.output) { writeJson(args.output, profile); }
  process.stdout.write(json);
}

main();
