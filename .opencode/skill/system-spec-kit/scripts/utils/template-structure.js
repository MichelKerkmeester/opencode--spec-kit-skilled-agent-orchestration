// ───────────────────────────────────────────────────────────────
// MODULE: Template Structure Utilities
// ───────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPTIONAL_TEMPLATE_PREFIX_RE = /^L(?:2|3\+?)\s*:/i;
const NUMBERED_HEADER_RE = /^\d+\.\s*/;
const PLACEHOLDER_RE = /\[[^\]]+\]/g;
const H2_RE = /^##\s+(.+)$/gm;
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/g;
const ANCHOR_CLOSE_LINE_RE = /<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/;
const DYNAMIC_DECISION_RECORD_RE = /^(?:ADR|DR)-\d+\s*:/i;
const CUSTOM_ALLOWED_ANCHORS = {
  '3+': {
    'spec.md': [
      'executive-summary',
      'nfr',
      'edge-cases',
      'complexity',
      'risk-matrix',
      'user-stories',
      'compliance',
      'stakeholders',
      'changelog',
    ],
  },
  '*': {
    'decision-record.md': ['decision'],
  },
};
const CUSTOM_ALLOWED_ANCHOR_PATTERNS = {
  '*': {
    'tasks.md': [/^phase-\d+$/],
    'decision-record.md': [
      /^adr-\d+$/,
      /^adr-\d+-(?:context|decision|alternatives|consequences|five-checks|impl)$/,
    ],
  },
};
const DOC_TEMPLATE_NAMES = {
  'spec.md': 'spec.md.tmpl',
  'plan.md': 'plan.md.tmpl',
  'tasks.md': 'tasks.md.tmpl',
  'implementation-summary.md': 'implementation-summary.md.tmpl',
  'checklist.md': 'checklist.md.tmpl',
  'decision-record.md': 'decision-record.md.tmpl',
};
const VALID_LEVELS = new Set(['1', '2', '3', '3+', 'phase']);
const DOCUMENT_NAME_RE = /^(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)?[A-Za-z0-9][A-Za-z0-9_-]*\.md$/u;

const STATIC_PHASE_PARENT_ADDENDUM = {
  supported: true,
  templatePath: 'phase-parent-section',
  headerRules: [],
  optionalHeaderRules: [
    {
      raw: 'PHASE DOCUMENTATION MAP',
      normalized: normalizeHeaderText('PHASE DOCUMENTATION MAP'),
      dynamic: false,
    },
  ],
  requiredAnchors: [],
  optionalAnchors: ['phase-map'],
  allowedAnchors: ['phase-map'],
};

const STATIC_PHASE_CHILD_ADDENDUM = {
  supported: true,
  templatePath: 'phase-child-header',
  headerRules: [],
  optionalHeaderRules: [],
  requiredAnchors: [],
  optionalAnchors: ['phase-context'],
  allowedAnchors: ['phase-context'],
};

function normalizeLevel(level) {
  const raw = String(level || '').trim();
  if (raw === '') {
    throw new Error('Level is required');
  }
  if (raw === '1' || raw === '2' || raw === '3' || raw === '3+') return raw;
  if (raw === '4') return '3+';
  if (raw === '3+') return '3+';
  if (raw === 'phase' || raw === 'phase-parent') return 'phase';
  throw new Error(`Internal template contract could not be resolved for Level ${raw}`);
}

function getCustomAllowedAnchors(level, basename) {
  const normalizedLevel = normalizeLevel(level);
  return [
    ...(CUSTOM_ALLOWED_ANCHORS['*']?.[basename] || []),
    ...(CUSTOM_ALLOWED_ANCHORS[normalizedLevel]?.[basename] || []),
  ];
}

function getCustomAllowedAnchorPatterns(level, basename) {
  const normalizedLevel = normalizeLevel(level);
  return [
    ...(CUSTOM_ALLOWED_ANCHOR_PATTERNS['*']?.[basename] || []),
    ...(CUSTOM_ALLOWED_ANCHOR_PATTERNS[normalizedLevel]?.[basename] || []),
  ];
}

function normalizeHeaderText(header) {
  return String(header || '')
    .replace(PLACEHOLDER_RE, '')
    .replace(NUMBERED_HEADER_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function isOptionalTemplateHeader(rawHeader) {
  return OPTIONAL_TEMPLATE_PREFIX_RE.test(String(rawHeader || '').trim());
}

function getTemplatesRoot() {
  return path.resolve(__dirname, '..', '..', 'templates');
}

function getManifestPath(templatesRoot = getTemplatesRoot()) {
  return path.join(templatesRoot, 'manifest', 'spec-kit-docs.json');
}

function loadLevelContract(level, templatesRoot = getTemplatesRoot()) {
  const normalizedLevel = normalizeLevel(level);
  const manifest = JSON.parse(fs.readFileSync(getManifestPath(templatesRoot), 'utf8'));
  const row = manifest.levels[normalizedLevel];
  if (!row) {
    throw new Error(`Internal template contract could not be resolved for Level ${normalizedLevel}`);
  }
  const requiredCoreDocs = assertDocumentList(normalizedLevel, row, 'requiredCoreDocs');
  const requiredAddonDocs = assertDocumentList(normalizedLevel, row, 'requiredAddonDocs');
  const lazyAddonDocs = assertDocumentList(normalizedLevel, row, 'lazyAddonDocs');
  const sectionGates = assertSectionGates(normalizedLevel, row);
  if (typeof row.frontmatterMarkerLevel !== 'number') {
    throw new Error(`Internal template contract could not be resolved for Level ${normalizedLevel}`);
  }

  return {
    requiredCoreDocs: [...requiredCoreDocs],
    requiredAddonDocs: [...requiredAddonDocs],
    lazyAddonDocs: [...lazyAddonDocs],
    sectionGates: Object.fromEntries(Object.entries(sectionGates).map(([sectionId, levels]) => [sectionId, [...levels]])),
    frontmatterMarkerLevel: row.frontmatterMarkerLevel,
  };
}

function getContractDocs(level, templatesRoot = getTemplatesRoot()) {
  const contract = loadLevelContract(level, templatesRoot);
  return [...contract.requiredCoreDocs, ...contract.requiredAddonDocs];
}

function assertDocumentList(level, row, field) {
  const docs = row[field];
  if (!Array.isArray(docs) || (field === 'requiredCoreDocs' && docs.length === 0)) {
    throw new Error(`Internal template contract could not be resolved for Level ${level}`);
  }
  for (const doc of docs) {
    if (typeof doc !== 'string' || !DOCUMENT_NAME_RE.test(doc) || doc.includes('..')) {
      throw new Error(`Internal template contract could not be resolved for Level ${level}`);
    }
  }
  return docs;
}

function assertSectionGates(level, row) {
  const gates = row.sectionGates;
  if (!gates || typeof gates !== 'object' || Array.isArray(gates)) {
    throw new Error(`Internal template contract could not be resolved for Level ${level}`);
  }
  const flatGates = {};
  for (const [sectionId, levels] of Object.entries(gates)) {
    if (Array.isArray(levels)) {
      if (!sectionId || levels.some((entry) => !VALID_LEVELS.has(entry))) {
        throw new Error(`Internal template contract could not be resolved for Level ${level}`);
      }
      flatGates[sectionId] = levels;
      continue;
    }
    if (!sectionId.endsWith('.md') || !levels || typeof levels !== 'object') {
      throw new Error(`Internal template contract could not be resolved for Level ${level}`);
    }
    for (const [nestedSectionId, nestedLevels] of Object.entries(levels)) {
      if (!nestedSectionId || !Array.isArray(nestedLevels) || nestedLevels.some((entry) => !VALID_LEVELS.has(entry))) {
        throw new Error(`Internal template contract could not be resolved for Level ${level}`);
      }
      flatGates[nestedSectionId] = nestedLevels;
    }
  }
  return flatGates;
}

function renderManifestTemplate(content, level) {
  const lines = content.split(/(?<=\n)/u);
  const output = [];
  const stack = [];
  let isInFence = false;

  for (const line of lines) {
    if (/^\s*(`{3}|~~~)/u.test(line)) {
      if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
        output.push(line);
      }
      isInFence = !isInFence;
      continue;
    }

    if (!isInFence) {
      const openMatch = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/u.exec(line);
      if (openMatch) {
        const parentActive = stack.every((frame) => frame.parentActive && frame.conditionActive);
        stack.push({ parentActive, conditionActive: evaluateTemplateGate(openMatch[1], level) });
        continue;
      }
      if (/^\s*<!--\s*\/IF\s*-->\s*$/u.test(line)) {
        stack.pop();
        continue;
      }
    }

    if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
      output.push(line);
    }
  }

  return output.join('');
}

function evaluateTemplateGate(expression, level) {
  return expression
    .split(/\s+OR\s+/iu)
    .some((orTerm) =>
      orTerm
        .split(/\s+AND\s+/iu)
        .every((andTerm) => {
          const term = andTerm.trim();
          const not = /^NOT\s+/iu.test(term);
          const atom = term.replace(/^NOT\s+/iu, '');
          const match = /^level:([A-Za-z0-9+,_-]+)$/u.exec(atom);
          if (!match) {
            return false;
          }
          const values = match[1].split(',').map((value) => value.trim()).filter(Boolean);
          if (values.some((value) => !VALID_LEVELS.has(value))) {
            return false;
          }
          const active = values.includes(level);
          return not ? !active : active;
        })
    );
}

function getPhaseAddendumContract(kind) {
  if (kind === 'parent') {
    return STATIC_PHASE_PARENT_ADDENDUM;
  }
  if (kind === 'child') {
    return STATIC_PHASE_CHILD_ADDENDUM;
  }
  return null;
}

function hasPhaseChildDirectories(folderPath) {
  if (!folderPath || !fs.existsSync(folderPath)) {
    return false;
  }

  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    return entries.some((entry) => entry.isDirectory() && /^[0-9]{3}-/.test(entry.name));
  } catch (_error) {
    return false;
  }
}

function fileContainsAnchor(filePath, anchorId) {
  if (!filePath || !fs.existsSync(filePath)) {
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(`<!-- ANCHOR:${anchorId} -->`);
  } catch (_error) {
    return false;
  }
}

function inferPhaseSpecAddenda(documentPath) {
  if (!documentPath || path.basename(documentPath) !== 'spec.md') {
    return [];
  }

  const folderPath = path.dirname(documentPath);
  const addenda = [];

  if (hasPhaseChildDirectories(folderPath)) {
    addenda.push('parent');
  }

  const parentSpecPath = path.join(folderPath, '..', 'spec.md');
  if (fileContainsAnchor(parentSpecPath, 'phase-map')) {
    addenda.push('child');
  }

  return addenda;
}

function resolveTemplatePath(level, basename, templatesRoot = getTemplatesRoot()) {
  const normalizedLevel = normalizeLevel(level);
  if (!getContractDocs(normalizedLevel, templatesRoot).includes(basename)) {
    return null;
  }
  const manifestTemplateName = normalizedLevel === 'phase' && basename === 'spec.md'
    ? 'phase-parent.spec.md.tmpl'
    : DOC_TEMPLATE_NAMES[basename];

  if (!manifestTemplateName) {
    return null;
  }
  return path.join(templatesRoot, 'manifest', manifestTemplateName);
}

function extractH2Headers(content) {
  content = stripFencedCodeBlocks(content);
  H2_RE.lastIndex = 0;
  const headers = [];
  let match;

  while ((match = H2_RE.exec(content)) !== null) {
    headers.push({
      raw: match[1].trim(),
      normalized: normalizeHeaderText(match[1]),
      index: match.index,
    });
  }

  return headers;
}

function stripFencedCodeBlocks(content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;

  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      return '';
    }

    return inFence ? '' : line;
  }).join('\n');
}

function parseAnchoredSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];

  for (let index = 0; index < lines.length; index += 1) {
    const openMatch = lines[index].match(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
    if (!openMatch) {
      continue;
    }

    const id = openMatch[1];
    let endIndex = -1;

    for (let inner = index + 1; inner < lines.length; inner += 1) {
      const closeMatch = lines[inner].match(ANCHOR_CLOSE_LINE_RE);
      if (closeMatch && closeMatch[1] === id) {
        endIndex = inner;
        break;
      }
    }

    if (endIndex === -1) {
      continue;
    }

    sections.push({
      id,
      content: lines.slice(index, endIndex + 1).join('\n'),
      startLine: index + 1,
      endLine: endIndex + 1,
    });
    index = endIndex;
  }

  return sections;
}

function buildDecisionRecordContract(templatePath) {
  return {
    supported: true,
    templatePath,
    basename: 'decision-record.md',
    headerRules: [
      {
        raw: 'ADR/DR decision header',
        normalized: 'DECISION_RECORD_ENTRY',
        dynamic: true,
        pattern: DYNAMIC_DECISION_RECORD_RE.source,
      },
    ],
    optionalHeaderRules: [],
    requiredAnchors: [],
    optionalAnchors: [],
    allowedAnchors: ['adr-001', 'adr-001-context', 'adr-001-decision', 'adr-001-alternatives', 'adr-001-consequences', 'adr-001-five-checks', 'adr-001-impl'],
  };
}

function loadTemplateContract(level, basename, templatesRoot = getTemplatesRoot()) {
  const templatePath = resolveTemplatePath(level, basename, templatesRoot);
  if (!templatePath || !fs.existsSync(templatePath)) {
    return {
      supported: false,
      basename,
      templatePath,
      reason: 'template_not_found',
      headerRules: [],
      requiredAnchors: [],
    };
  }

  if (basename === 'decision-record.md') {
    return buildDecisionRecordContract(templatePath);
  }

  const templateContent = renderManifestTemplate(
    fs.readFileSync(templatePath, 'utf8'),
    normalizeLevel(level)
  );
  const headerRules = extractH2Headers(templateContent).map((header) => ({
    raw: header.raw,
    normalized: header.normalized,
    dynamic: false,
  }));
  const requiredHeaders = headerRules.filter((header) => !isOptionalTemplateHeader(header.raw));
  const optionalHeaders = headerRules.filter((header) => isOptionalTemplateHeader(header.raw));

  const requiredHeaderNames = new Set(requiredHeaders.map((header) => header.normalized));
  const optionalHeaderNames = new Set(optionalHeaders.map((header) => header.normalized));
  const requiredAnchors = [];
  const optionalAnchors = [];
  const seenAnchors = new Set();
  const allowedAnchors = [];
  const seenAllowedAnchors = new Set();

  let anchorMatch;
  while ((anchorMatch = ANCHOR_OPEN_RE.exec(templateContent)) !== null) {
    const anchorId = anchorMatch[1];
    if (!seenAllowedAnchors.has(anchorId)) {
      seenAllowedAnchors.add(anchorId);
      allowedAnchors.push(anchorId);
    }
  }
  ANCHOR_OPEN_RE.lastIndex = 0;

  for (const section of parseAnchoredSections(templateContent)) {
    const sectionHeaders = extractH2Headers(section.content).map((header) => header.normalized);
    const hasRequiredHeader = sectionHeaders.some((header) => requiredHeaderNames.has(header));
    const hasOptionalHeader = sectionHeaders.some((header) => optionalHeaderNames.has(header));

    if ((!hasRequiredHeader && !hasOptionalHeader) || seenAnchors.has(section.id)) {
      continue;
    }

    seenAnchors.add(section.id);
    if (hasRequiredHeader) {
      requiredAnchors.push(section.id);
    } else {
      optionalAnchors.push(section.id);
    }
  }

  for (const anchorId of getCustomAllowedAnchors(level, basename)) {
    if (!seenAllowedAnchors.has(anchorId)) {
      seenAllowedAnchors.add(anchorId);
      allowedAnchors.push(anchorId);
    }
  }

  return {
    supported: true,
    basename,
    templatePath,
    headerRules: requiredHeaders,
    optionalHeaderRules: optionalHeaders,
    requiredAnchors,
    optionalAnchors,
    allowedAnchors,
  };
}

function mergeTemplateContracts(baseContract, addendumContracts) {
  if (!baseContract.supported) {
    return baseContract;
  }

  const merged = {
    ...baseContract,
    headerRules: [...baseContract.headerRules],
    optionalHeaderRules: [...(baseContract.optionalHeaderRules || [])],
    requiredAnchors: [...baseContract.requiredAnchors],
    optionalAnchors: [...(baseContract.optionalAnchors || [])],
    allowedAnchors: [...(baseContract.allowedAnchors || [])],
    addendumTemplatePaths: [],
  };

  const seenRequiredHeaders = new Set(merged.headerRules.map((rule) => `${rule.raw}|${rule.normalized}|${rule.dynamic ? 'dynamic' : 'static'}`));
  const seenOptionalHeaders = new Set(merged.optionalHeaderRules.map((rule) => `${rule.raw}|${rule.normalized}|${rule.dynamic ? 'dynamic' : 'static'}`));
  const seenRequiredAnchors = new Set(merged.requiredAnchors);
  const seenOptionalAnchors = new Set(merged.optionalAnchors);
  const seenAllowedAnchors = new Set(merged.allowedAnchors);
  const seenTemplatePaths = new Set([merged.templatePath].filter(Boolean));

  for (const addendumContract of addendumContracts) {
    if (!addendumContract.supported) {
      continue;
    }

    if (addendumContract.templatePath && !seenTemplatePaths.has(addendumContract.templatePath)) {
      seenTemplatePaths.add(addendumContract.templatePath);
      merged.addendumTemplatePaths.push(addendumContract.templatePath);
    }

    for (const headerRule of addendumContract.headerRules || []) {
      const key = `${headerRule.raw}|${headerRule.normalized}|${headerRule.dynamic ? 'dynamic' : 'static'}`;
      if (!seenRequiredHeaders.has(key)) {
        seenRequiredHeaders.add(key);
        merged.headerRules.push(headerRule);
      }
    }

    for (const headerRule of addendumContract.optionalHeaderRules || []) {
      const key = `${headerRule.raw}|${headerRule.normalized}|${headerRule.dynamic ? 'dynamic' : 'static'}`;
      if (!seenOptionalHeaders.has(key)) {
        seenOptionalHeaders.add(key);
        merged.optionalHeaderRules.push(headerRule);
      }
    }

    for (const anchorId of addendumContract.requiredAnchors || []) {
      if (!seenRequiredAnchors.has(anchorId)) {
        seenRequiredAnchors.add(anchorId);
        merged.requiredAnchors.push(anchorId);
      }
      if (!seenAllowedAnchors.has(anchorId)) {
        seenAllowedAnchors.add(anchorId);
        merged.allowedAnchors.push(anchorId);
      }
    }

    for (const anchorId of addendumContract.optionalAnchors || []) {
      if (!seenOptionalAnchors.has(anchorId)) {
        seenOptionalAnchors.add(anchorId);
        merged.optionalAnchors.push(anchorId);
      }
      if (!seenAllowedAnchors.has(anchorId)) {
        seenAllowedAnchors.add(anchorId);
        merged.allowedAnchors.push(anchorId);
      }
    }

    for (const anchorId of addendumContract.allowedAnchors || []) {
      if (!seenAllowedAnchors.has(anchorId)) {
        seenAllowedAnchors.add(anchorId);
        merged.allowedAnchors.push(anchorId);
      }
    }
  }

  return merged;
}

function insertUniqueRulesAfter(rules, additions, afterNormalizedHeader) {
  const keysToMove = new Set(additions.map((rule) => `${rule.raw}|${rule.normalized}|${rule.dynamic ? 'dynamic' : 'static'}`));
  const filteredRules = rules.filter((rule) => !keysToMove.has(`${rule.raw}|${rule.normalized}|${rule.dynamic ? 'dynamic' : 'static'}`));

  const dedupedAdditions = [];
  const seenAdditionKeys = new Set();
  for (const rule of additions) {
    const key = `${rule.raw}|${rule.normalized}|${rule.dynamic ? 'dynamic' : 'static'}`;
    if (seenAdditionKeys.has(key)) {
      continue;
    }
    seenAdditionKeys.add(key);
    dedupedAdditions.push(rule);
  }

  if (dedupedAdditions.length === 0) {
    return rules;
  }

  const insertionIndex = filteredRules.findIndex((rule) => rule.normalized === afterNormalizedHeader);
  if (insertionIndex === -1) {
    return [...filteredRules, ...dedupedAdditions];
  }

  return [
    ...filteredRules.slice(0, insertionIndex + 1),
    ...dedupedAdditions,
    ...filteredRules.slice(insertionIndex + 1),
  ];
}

function insertUniqueAnchorsAfter(anchorIds, additions, afterAnchorId) {
  const additionsSet = new Set(additions);
  const filteredAnchors = anchorIds.filter((anchorId) => !additionsSet.has(anchorId));
  const dedupedAdditions = [];
  const seenAdditions = new Set();
  for (const anchorId of additions) {
    if (seenAdditions.has(anchorId)) {
      continue;
    }
    seenAdditions.add(anchorId);
    dedupedAdditions.push(anchorId);
  }

  if (dedupedAdditions.length === 0) {
    return anchorIds;
  }

  const insertionIndex = filteredAnchors.indexOf(afterAnchorId);
  if (insertionIndex === -1) {
    return [...filteredAnchors, ...dedupedAdditions];
  }

  return [
    ...filteredAnchors.slice(0, insertionIndex + 1),
    ...dedupedAdditions,
    ...filteredAnchors.slice(insertionIndex + 1),
  ];
}

function loadTemplateContractForDocument(level, basename, documentPath, templatesRoot = getTemplatesRoot()) {
  const baseContract = loadTemplateContract(level, basename, templatesRoot);
  if (!baseContract.supported || !documentPath || basename !== 'spec.md') {
    return baseContract;
  }

  const addendumKinds = inferPhaseSpecAddenda(documentPath);
  if (addendumKinds.length === 0) {
    return baseContract;
  }

  const addendumContracts = addendumKinds
    .map((kind) => getPhaseAddendumContract(kind))
    .filter(Boolean);

  return mergeTemplateContracts(baseContract, addendumContracts);
}

function loadDocumentStructure(content) {
  content = stripFencedCodeBlocks(content);
  ANCHOR_OPEN_RE.lastIndex = 0;
  const headers = extractH2Headers(content);
  const anchors = [];
  let match;

  while ((match = ANCHOR_OPEN_RE.exec(content)) !== null) {
    anchors.push({
      raw: match[1],
      normalized: match[1],
      index: match.index,
    });
  }

  return { headers, anchors };
}

function matchHeaderRule(actualHeader, headerRule) {
  if (headerRule.dynamic) {
    return new RegExp(headerRule.pattern, 'i').test(actualHeader.raw);
  }

  return actualHeader.normalized === headerRule.normalized;
}

function compareRequiredSequence(requiredRules, actualEntries, matcher) {
  const missing = [];
  const outOfOrder = [];
  const matchedIndexes = new Set();
  let currentIndex = 0;

  for (const requiredRule of requiredRules) {
    let foundIndex = -1;

    for (let index = currentIndex; index < actualEntries.length; index += 1) {
      if (matcher(actualEntries[index], requiredRule)) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex !== -1) {
      matchedIndexes.add(foundIndex);
      currentIndex = foundIndex + 1;
      continue;
    }

    const anyIndex = actualEntries.findIndex((entry) => matcher(entry, requiredRule));
    if (anyIndex !== -1) {
      matchedIndexes.add(anyIndex);
      outOfOrder.push(requiredRule.raw);
      continue;
    }

    missing.push(requiredRule.raw);
  }

  const extras = actualEntries
    .filter((_entry, index) => !matchedIndexes.has(index))
    .map((entry) => entry.raw);

  return { missing, outOfOrder, extras };
}

function compareDocumentToTemplate(level, basename, documentPath, templatesRoot = getTemplatesRoot()) {
  const contract = loadTemplateContractForDocument(level, basename, documentPath, templatesRoot);
  if (!contract.supported) {
    return {
      supported: false,
      basename,
      contract,
      headers: { missing: [], outOfOrder: [], extras: [] },
      anchors: { missing: [], outOfOrder: [], extras: [] },
    };
  }

  if (!fs.existsSync(documentPath)) {
    return { supported: false, reason: 'Document file not found: ' + documentPath };
  }

  const documentContent = fs.readFileSync(documentPath, 'utf8');
  const actual = loadDocumentStructure(documentContent);
  const headers = compareRequiredSequence(
    contract.headerRules,
    actual.headers,
    matchHeaderRule
  );
  if (contract.optionalHeaderRules.length > 0) {
    headers.extras = headers.extras.filter(
      (extraHeader) =>
        !contract.optionalHeaderRules.some((headerRule) =>
          matchHeaderRule({ raw: extraHeader, normalized: normalizeHeaderText(extraHeader) }, headerRule)
        )
    );
  }
  const anchors = compareRequiredSequence(
    contract.requiredAnchors.map((anchorId) => ({ raw: anchorId, normalized: anchorId })),
    actual.anchors,
    (actualAnchor, requiredAnchor) => actualAnchor.normalized === requiredAnchor.normalized
  );
  if ((contract.allowedAnchors || []).length > 0) {
    const allowedAnchors = new Set(contract.allowedAnchors);
    anchors.extras = anchors.extras.filter((anchorId) => !allowedAnchors.has(anchorId));
  }
  const customAllowedAnchors = new Set(getCustomAllowedAnchors(level, basename));
  if (customAllowedAnchors.size > 0) {
    anchors.extras = anchors.extras.filter((anchorId) => !customAllowedAnchors.has(anchorId));
  }
  const allowedAnchorPatterns = getCustomAllowedAnchorPatterns(level, basename);
  if (allowedAnchorPatterns.length > 0) {
    anchors.extras = anchors.extras.filter(
      (anchorId) => !allowedAnchorPatterns.some((pattern) => pattern.test(anchorId))
    );
  }

  return {
    supported: true,
    basename,
    contract,
    headers,
    anchors,
  };
}

function printCompareResult(result, scope) {
  console.log(`supported\t${result.supported ? 'true' : 'false'}`);
  if (!result.supported) {
    if (result.contract && result.contract.reason) {
      console.log(`reason\t${result.contract.reason}`);
    }
    return;
  }

  console.log(`template_path\t${result.contract.templatePath}`);

  if (scope === 'headers' || scope === 'all') {
    result.contract.headerRules.forEach((headerRule) => {
      console.log(`required_header\t${headerRule.raw}`);
    });
    (result.contract.optionalHeaderRules || []).forEach((headerRule) => {
      console.log(`optional_header\t${headerRule.raw}`);
    });
    result.headers.missing.forEach((header) => console.log(`missing_header\t${header}`));
    result.headers.outOfOrder.forEach((header) => console.log(`out_of_order_header\t${header}`));
    result.headers.extras.forEach((header) => console.log(`extra_header\t${header}`));
  }

  if (scope === 'anchors' || scope === 'all') {
    result.contract.requiredAnchors.forEach((anchorId) => console.log(`required_anchor\t${anchorId}`));
    (result.contract.optionalAnchors || []).forEach((anchorId) => console.log(`optional_anchor\t${anchorId}`));
    (result.contract.allowedAnchors || []).forEach((anchorId) => console.log(`allowed_anchor\t${anchorId}`));
    result.anchors.missing.forEach((anchorId) => console.log(`missing_anchor\t${anchorId}`));
    result.anchors.outOfOrder.forEach((anchorId) => console.log(`out_of_order_anchor\t${anchorId}`));
    result.anchors.extras.forEach((anchorId) => console.log(`extra_anchor\t${anchorId}`));
  }
}

function runCli(argv) {
  try {
    const [command, level, basename, documentPath, scope = 'all'] = argv;

    if (command === 'contract') {
      const contract = loadTemplateContract(level, basename);
      console.log(JSON.stringify(contract, null, 2));
      return 0;
    }

    if (command === 'docs') {
      console.log(getContractDocs(level).join('\n'));
      return 0;
    }

    if (command === 'level-contract') {
      console.log(JSON.stringify(loadLevelContract(level), null, 2));
      return 0;
    }

    if (command === 'compare') {
      if (!documentPath) {
        console.error('Usage: template-structure.js compare <level> <basename> <documentPath> [headers|anchors|all]');
        return 2;
      }

      const result = compareDocumentToTemplate(level, basename, documentPath);
      printCompareResult(result, scope);
      return 0;
    }

    console.error('Usage: template-structure.js <contract|compare|docs|level-contract> ...');
    return 2;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 3;
  }
}

if (process.argv[1] === __filename) {
  process.exitCode = runCli(process.argv.slice(2));
}

export {
  compareDocumentToTemplate,
  extractH2Headers,
  inferPhaseSpecAddenda,
  getContractDocs,
  loadLevelContract,
  loadDocumentStructure,
  loadTemplateContract,
  loadTemplateContractForDocument,
  mergeTemplateContracts,
  normalizeHeaderText,
  normalizeLevel,
  parseAnchoredSections,
  resolveTemplatePath,
};
