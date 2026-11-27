import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = new URL('.', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const book = JSON.parse(await read('504-essential-words.json'));
const webBook = await read('web/504-essential-words.json');
assert.equal(await read('504-essential-words.json'), webBook, 'root and web 504-word banks must match');
assert.equal(book.words.length, 504, '504 vocabulary bank must contain exactly 504 words');
assert.equal(new Set(book.words.map(x => x.english.toLowerCase())).size, 504, '504 vocabulary bank must not contain duplicate English entries');
const groups = new Map();
for (const word of book.words) {
  assert.ok(word.english && word.group && Number.isInteger(word.order), 'each 504 entry must have a word, lesson group and order');
  groups.set(word.group, (groups.get(word.group) || 0) + 1);
}
assert.equal(groups.size, 42, '504 vocabulary bank must contain 42 lessons');
for (const [group, count] of groups) assert.equal(count, 12, group + ' must contain 12 words');

const dictionary = await read('dictionary-unified-v1.js');
assert.match(dictionary, /504-essential-words\.json/, 'dictionary must seed its offline word index from the bundled 504 list');
assert.match(dictionary, /for\(const offset of \[0,500\]\)/, 'dictionary must fetch both pages of the 504 API dataset');
assert.match(dictionary, /render504Course\(\)/, 'dictionary must render the 42-lesson course');
assert.match(dictionary, /IndexedDB/, 'dictionary should describe durable offline storage');
const supportSql = await read('backend/support-feedback-v1.sql');
assert.match(supportSql, /enable row level security/i, 'support feedback table must enforce RLS');
assert.match(supportSql, /user_id=auth\.uid\(\)/, 'users may submit only feedback tied to their own account');
assert.match(supportSql, /public\.current_role\(\)='admin'/, 'only admins may review other users feedback');
assert.match(supportSql, /revoke all on public\.support_feedback from anon,authenticated/i, 'support table must start from revoked table privileges');
assert.match(supportSql, /grant insert,select,update on public\.support_feedback to authenticated/i, 'support permissions must be explicitly granted to authenticated users');

for (const file of ['english-studio-v3.js','dictionary-unified-v1.js','support-center-v1.js']) {
  const check = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  assert.equal(check.status, 0, file + ' must pass JavaScript syntax validation: ' + check.stderr);
}
console.log('PASS: 504 unique words across 42 complete 12-word lessons; offline dictionary wiring; support RLS and explicit permissions.');
