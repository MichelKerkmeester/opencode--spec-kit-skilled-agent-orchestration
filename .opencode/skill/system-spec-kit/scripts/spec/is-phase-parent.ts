import * as fs from 'fs';
import * as path from 'path';

const PHASE_CHILD_REGEX = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

export function isPhaseParent(specFolderAbsPath: string): boolean {
  let entries: string[];

  try {
    entries = fs.readdirSync(specFolderAbsPath);
  } catch {
    return false;
  }

  const phaseChildren = entries.filter((name) => PHASE_CHILD_REGEX.test(name));

  if (phaseChildren.length === 0) return false;

  for (const child of phaseChildren) {
    const childPath = path.join(specFolderAbsPath, child);
    try {
      if (!fs.statSync(childPath).isDirectory()) continue;
    } catch {
      continue;
    }
    if (
      fs.existsSync(path.join(childPath, 'spec.md')) ||
      fs.existsSync(path.join(childPath, 'description.json'))
    ) {
      return true;
    }
  }

  return false;
}
