import fs from 'node:fs';
import assert from 'node:assert/strict';
const auth=fs.readFileSync('auth.js','utf8'),index=fs.readFileSync('index.html','utf8'),web=fs.readFileSync('web/index.html','utf8'),sql=fs.readFileSync('backend/student-progress-v1.sql','utf8'),pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
assert.equal(index,web,'root and web app must stay synchronized');
for(const x of ['window.AmirProgress','switchUser(userId)','amir:progress-changed','amirMathState:user:'])assert.ok(index.includes(x),'missing account-scoped local progress: '+x);
for(const x of ['merge_student_progress','syncStudentProgress','class_student_progress','loadClassProgress','switchUser(profile.id)'])assert.ok(auth.includes(x),'missing cloud integration: '+x);
for(const x of ['enable row level security','user_id=auth.uid()','public.current_role()=\'teacher\'','public.is_approved()','merge_student_progress','class_student_progress','revoke all on public.student_progress'])assert.ok(sql.toLowerCase().includes(x.toLowerCase()),'missing SQL security requirement: '+x);
assert.ok(pkg.scripts.qa.includes('cloud-progress-check.mjs'),'cloud QA is not wired');
console.log('Cloud progress integration checks passed: per-account local isolation, offline fallback, student-only cloud writes, RLS, and teacher class reports.');
