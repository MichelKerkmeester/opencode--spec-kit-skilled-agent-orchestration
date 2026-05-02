// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Integration Surface Scanner for sk-improve-agent                      ║
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
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
];
const GLOBAL_DOC_PATHS = ['CLAUDE.md', '.claude/CLAUDE.md'];
const SKILL_ADVISOR_PATH = '.opencode/skill/scripts/skill_advisor.py';

// ─────────────────────────────────────────────────────────────────────────────
// 3. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) continue;
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readOptional(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch (_e) { return null; }
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n/, '');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) fm[key] = val;
  }
  return fm;
}

function collectFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  const files = [];
  walk(rootDir, files);
  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SIGNAL-BASED MIRROR SYNC CHECK
// ─────────────────────────────────────────────────────────────────────────────
function extractSignals(body) {
  const signals = [];
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    if (m[1].length > 20 && signals.length < 3) signals.push(m[1]);
  }
  return signals;
}

function checkMirrorSync(canonicalBody, mirrorContent) {
  if (mirrorContent === null) return 'missing';
  const signals = extractSignals(canonicalBody);
  if (signals.length === 0) return 'aligned';
  const mirrorBody = stripFrontmatter(mirrorContent);
  const hits = signals.filter((s) => mirrorBody.includes(s)).length;
  return hits >= 2 ? 'aligned' : 'diverged';
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SURFACE SCANNERS
// ─────────────────────────────────────────────────────────────────────────────
function scanCanonical(repoRoot, agentName) {
  const relPath = `.opencode/agent/${agentName}.md`;
  const content = readOptional(path.join(repoRoot, relPath));
  return { path: relPath, exists: content !== null, frontmatter: content ? parseFrontmatter(content) : null };
}

function scanMirrors(repoRoot, agentName, canonicalBody) {
  return MIRROR_TEMPLATES.map((tpl) => {
    const relPath = tpl.replace('{name}', agentName);
    const content = readOptional(path.join(repoRoot, relPath));
    return { path: relPath, exists: content !== null, syncStatus: checkMirrorSync(canonicalBody, content) };
  });
}

function scanFilesByExt(repoRoot, agentName, ext, patternFn) {
  const files = collectFiles(path.join(repoRoot, '.opencode/command'));
  const pattern = patternFn(agentName);
  const results = [];
  for (const file of files) {
    if (!file.endsWith(ext)) continue;
    const content = readOptional(file);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      results.push({ path: path.relative(repoRoot, file), references: [...new Set(matches)] });
    }
  }
  return results;
}

function scanCommands(repoRoot, agentName) {
  return scanFilesByExt(repoRoot, agentName, '.md', (n) => new RegExp(`@${n}\\b`, 'g'));
}

function scanYamlWorkflows(repoRoot, agentName) {
  const yamlFiles = collectFiles(path.join(repoRoot, '.opencode/command'));
  const pattern = new RegExp(`(?:@${agentName}|\\b${agentName}\\b)`, 'g');
  const results = [];
  for (const file of yamlFiles) {
    if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
    const content = readOptional(file);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      results.push({ path: path.relative(repoRoot, file), references: [...new Set(matches)] });
    }
  }
  return results;
}

function scanSkills(repoRoot, agentName) {
  const skillDir = path.join(repoRoot, '.opencode/skill');
  if (!fs.existsSync(skillDir)) return [];
  const pattern = new RegExp(`\\b${agentName}\\b`, 'gi');
  const results = [];
  for (const entry of fs.readdirSync(skillDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(skillDir, entry.name, 'SKILL.md');
    const content = readOptional(skillMd);
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches) results.push({ path: path.relative(repoRoot, skillMd), referenceCount: matches.length });
  }
  return results;
}

function scanGlobalDocs(repoRoot, agentName) {
  const pattern = new RegExp(`\\b${agentName}\\b`, 'gi');
  const results = [];
  for (const relPath of GLOBAL_DOC_PATHS) {
    const content = readOptional(path.join(repoRoot, relPath));
    if (!content) continue;
    const matches = content.match(pattern);
    if (matches) results.push({ path: relPath, referenceCount: matches.length });
  }
  return results;
}

function scanSkillAdvisor(repoRoot, agentName) {
  const content = readOptional(path.join(repoRoot, SKILL_ADVISOR_PATH));
  return { path: SKILL_ADVISOR_PATH, matched: content !== null && new RegExp(`\\b${agentName}\\b`, 'i').test(content) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  const agentName = args.agent;
  const repoRoot = path.resolve(args['repo-root'] || '.');
  const outputPath = args.output;

  if (!agentName) {
    process.stderr.write('Usage: node scan-integration.cjs --agent=<name> [--repo-root=.] [--output=path.json]\n');
    process.exit(2);
  }

  const canonical = scanCanonical(repoRoot, agentName);
  const canonicalContent = readOptional(path.join(repoRoot, canonical.path));
  const canonicalBody = canonicalContent ? stripFrontmatter(canonicalContent) : '';
  const mirrors = scanMirrors(repoRoot, agentName, canonicalBody);
  const commands = scanCommands(repoRoot, agentName);
  const yamlWorkflows = scanYamlWorkflows(repoRoot, agentName);
  const skills = scanSkills(repoRoot, agentName);
  const globalDocs = scanGlobalDocs(repoRoot, agentName);
  const skillAdvisor = scanSkillAdvisor(repoRoot, agentName);

  const existingMirrors = mirrors.filter((m) => m.exists).length;
  const missingMirrors = mirrors.filter((m) => m.syncStatus === 'missing').length;
  const divergedMirrors = mirrors.filter((m) => m.syncStatus === 'diverged').length;
  const totalSurfaces = (canonical.exists ? 1 : 0) + existingMirrors
    + commands.length + yamlWorkflows.length + skills.length
    + globalDocs.length + (skillAdvisor.matched ? 1 : 0);

  let mirrorSyncStatus = 'all-aligned';
  if (missingMirrors > 0) mirrorSyncStatus = 'has-missing';
  else if (divergedMirrors > 0) mirrorSyncStatus = 'has-divergence';

  const result = {
    status: 'complete',
    agent: agentName,
    timestamp: new Date().toISOString(),
    surfaces: { canonical, mirrors, commands, yamlWorkflows, skills, globalDocs, skillAdvisor },
    summary: {
      totalSurfaces,
      existingCount: totalSurfaces,
      missingCount: missingMirrors + (canonical.exists ? 0 : 1),
      mirrorSyncStatus,
      commandCount: commands.length,
      skillCount: skills.length,
    },
  };

  const json = JSON.stringify(result, null, 2) + '\n';
  process.stdout.write(json);
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), json, 'utf8');
  }
}

main();
