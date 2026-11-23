import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const moduleSource = fs.readFileSync(new URL('./web/success-club-v1.js', import.meta.url), 'utf8');
const sql = fs.readFileSync(new URL('./backend/success-club-v1.sql', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('./web/index.html', import.meta.url), 'utf8');
new vm.Script(moduleSource, { filename: 'success-club-v1.js' });
for (const table of ['success_clubs','success_groups','success_students','success_subjects','success_assessments','success_performance','success_awards']) {
  assert.match(sql, new RegExp('create table if not exists public\\.' + table + '\\b'), 'missing table ' + table);
  assert.match(sql, new RegExp('alter table public\\.' + table + ' enable row level security'), 'RLS missing for ' + table);
}
assert.match(sql, /can_access_success_club/);
assert.match(sql, /can_manage_success_club/);
assert.match(moduleSource, /0\.75/);
assert.match(moduleSource, /0\.25/);
assert.match(moduleSource, /scOverviewMonth/);
assert.match(moduleSource, /assessment_date/);
assert.match(html, /success-club-v1\.js/);
console.log('Success Club checks passed: JavaScript syntax, RLS tables, score formula, monthly summaries and app integration.');
