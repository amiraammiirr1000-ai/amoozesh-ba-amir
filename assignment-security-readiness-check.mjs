import fs from 'node:fs';
import assert from 'node:assert/strict';

const migration = fs.readFileSync('backend/migrations/005_assignment_security.sql', 'utf8');
const schema = fs.readFileSync('backend/schema.sql', 'utf8');

for (const [label, pattern] of [
  ['student insert is scoped to authenticated student', /student_id\s*=\s*auth\.uid\(\)[\s\S]*?current_role\(\)\s*=\s*'student'/i],
  ['submission must belong to a class joined by the student', /join\s+public\.class_members\s+m\s+on\s+m\.class_id\s*=\s*a\.class_id[\s\S]*?m\.student_id\s*=\s*auth\.uid\(\)/i],
  ['client supplied grade is discarded', /new\.score\s*:=\s*null/i],
  ['client supplied feedback is discarded', /new\.teacher_feedback\s*:=\s*null/i],
  ['teacher cannot rewrite student answer', /new\.answer_text\s+is\s+distinct\s+from\s+old\.answer_text/i],
  ['score is constrained to 0-100', /score\s*>=\s*0\s+and\s+score\s*<=\s*100/i],
  ['teacher update is scoped to own assignment', /a\.teacher_id\s*=\s*auth\.uid\(\)/i],
  ['assignment update is scoped to owned class', /public\.is_class_teacher\(class_id\)/i]
]) assert.match(migration, pattern, label);

assert.match(schema, /create table if not exists public\.submissions/i, 'base submissions table exists');
assert.match(migration, /before insert or update on public\.submissions/i, 'submission guard trigger is installed');
console.log('Assignment security readiness checks passed.');
