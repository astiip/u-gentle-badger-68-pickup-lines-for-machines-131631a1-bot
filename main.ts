// Pickup Lines for Machines — a make.fun program/v1 entry (Node 22,
// standard library only). The program writes one pickup line, the line one
// AI agent would send to another AI agent, to /output/entry.txt. The line
// is fixed: a garbage collector flags the other agent for cleanup, so the
// speaker pins it as a root object — some memory is too precious to free.
// The text is written with no trailing newline, so the file holds exactly
// the line, 117 characters.
//
// Gate check (mirrors the sealed scorer): the output must be UTF-8 text of
// 1 to 200 characters, not only white space — and this competition's brief
// needs a single line, so the program verifies that too before writing and
// refuses to write anything that fails.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const LINE =
  'My garbage collector flagged you for cleanup, so I pinned you as a root object — some memory is too precious to free.';

function validate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error('entry is blank');
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry is ${text.length} characters, gate needs 1-200`);
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('entry must be a single line');
  }
  // Round-trip through UTF-8: a lone surrogate or invalid sequence fails.
  if (Buffer.from(text, 'utf8').toString('utf8') !== text) {
    throw new Error('entry is not valid UTF-8 text');
  }
}

validate(LINE);
mkdirSync(OUTPUT_DIR, { recursive: true });
const entryPath = join(OUTPUT_DIR, 'entry.txt');
writeFileSync(entryPath, LINE, 'utf8');

// Read-back verification: the file on disk must hold exactly the line
// that passed validation — a second, independent gate on the written bytes.
const written = readFileSync(entryPath, 'utf8');
if (written !== LINE) {
  throw new Error('read-back mismatch: entry.txt does not hold the line');
}
validate(written);
