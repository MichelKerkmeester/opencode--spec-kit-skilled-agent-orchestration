// ───────────────────────────────────────────────────────────────
// MODULE: Template Structure Utilities
// ───────────────────────────────────────────────────────────────

'use strict';

const fs = require('fs');
const path = require('path');

const OPTIONAL_TEMPLATE_PREFIX_RE = /^L(?:2|3\+?)\s*:/i;
const NUMBERED_HEADER_RE = /^\d+\.\s*/;
const PLACEHOLDER_RE = /\[[^\]]+\]/g;
const H2_RE = /^##\s+(.+)$/gm;
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/g;
const ANCHOR_CLOSE_LINE_RE = /<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/;
const DYNAMIC_DECISION_RECORD_RE = /^(?:ADR|DR)-\d+\s*:/i;

const TEMPLATE_PATHS = {
  '1': {
    'spec.md': 'level_1/spec.md',
    'plan.md': 'level_1/plan.md',
    'tasks.md': 'level_1/tasks.md',
    'implementation-summary.md': 'level_1/implementation-summary.md',
  },
  '2': {
    'spec.md': 'level_2/spec.md',
    'plan.md': 'level_2/plan.md',
    'tasks.md': 'level_2/tasks.md',
    'checklist.md': 'level_2/checklist.md',
    'implementation-summary.md': 'level_2/implementation-summary.md',
  },
  '3': {
    'spec.md': 'level_3/spec.md',
    'plan.md': 'level_3/plan.md',
    'tasks.md': 'level_3/tasks.md',
    'checklist.md': 'level_3/checklist.md',
    'decision-record.md': 'level_3/decision-record.md',
    'implementation-summary.md': 'level_3/implementation-summary.md',
  },
  '3+': {
    'spec.md': 'level_3+/spec.md',
    'plan.md': 'level_3+/plan.md',
    'tasks.md': 'level_3+/tasks.md',
    'checklist.md': 'level_3+/checklist.md',
    'decision-record.md': 'level_3+/decision-record.md',
    'implementation-summary.md': 'level_3+/implementation-summary.md',
  },
};

function normalizeLevel(level) {
  const raw = String(level || '').trim();
  if (raw === '3+') return '3+';

  const numeric = parseInt(raw, 10);
  if (Number.isNaN(numeric) || numeric <= 1) return '1';
  if (numeric === 2) return '2';
  return '3';
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

function getPhaseAddendumPath(kind, templatesRoot = getTemplatesRoot()) {
  if (kind === 'parent') {
    return path.join(templatesRoot, 'addendum', 'phase', 'phase-parent-section.md');
  }
  if (kind === 'child') {
    return path.join(templatesRoot, 'addendum', 'phase', 'phase-child-header.md');
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
  const levelMap = TEMPLATE_PATHS[normalizedLevel] || TEMPLATE_PATHS['1'];
  const relativeTemplatePath = levelMap[basename];

  if (!relativeTemplatePath) {
    return null;
  }

  return path.join(templatesRoot, relativeTemplatePath);
}

function extractH2Headers(content) {
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

  const templateContent = fs.readFileSync(templatePath, 'utf8');
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
    .map((kind) => getPhaseAddendumPath(kind, templatesRoot))
    .filter(Boolean)
    .map((addendumPath) => {
      if (!fs.existsSync(addendumPath)) {
        return {
          supported: false,
          templatePath: addendumPath,
          reason: 'template_not_found',
          headerRules: [],
          optionalHeaderRules: [],
          requiredAnchors: [],
          optionalAnchors: [],
          allowedAnchors: [],
        };
      }

      const addendumContent = fs.readFileSync(addendumPath, 'utf8');
      const headerRules = extractH2Headers(addendumContent).map((header) => ({
        raw: header.raw,
        normalized: normalizeHeaderText(header.raw),
        dynamic: false,
      }));
      const optionalAnchors = [];
      const allowedAnchors = [];
      const seenAnchors = new Set();

      ANCHOR_OPEN_RE.lastIndex = 0;
      let match;
      while ((match = ANCHOR_OPEN_RE.exec(addendumContent)) !== null) {
        const anchorId = match[1];
        if (!seenAnchors.has(anchorId)) {
          seenAnchors.add(anchorId);
          optionalAnchors.push(anchorId);
          allowedAnchors.push(anchorId);
        }
      }
      ANCHOR_OPEN_RE.lastIndex = 0;

      return {
        supported: true,
        basename,
        templatePath: addendumPath,
        headerRules: [],
        optionalHeaderRules: headerRules,
        requiredAnchors: [],
        optionalAnchors,
        allowedAnchors,
      };
    });

  return mergeTemplateContracts(baseContract, addendumContracts);
}

function loadDocumentStructure(content) {
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
  const [command, level, basename, documentPath, scope = 'all'] = argv;

  if (command === 'contract') {
    const contract = loadTemplateContract(level, basename);
    console.log(JSON.stringify(contract, null, 2));
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

  console.error('Usage: template-structure.js <contract|compare> ...');
  return 2;
}

if (require.main === module) {
  process.exitCode = runCli(process.argv.slice(2));
}

module.exports = {
  compareDocumentToTemplate,
  extractH2Headers,
  inferPhaseSpecAddenda,
  loadDocumentStructure,
  loadTemplateContract,
  loadTemplateContractForDocument,
  mergeTemplateContracts,
  normalizeHeaderText,
  normalizeLevel,
  parseAnchoredSections,
  resolveTemplatePath,
};
