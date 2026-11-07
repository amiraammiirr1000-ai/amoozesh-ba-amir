import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = name => readFile(resolve(root, name), 'utf8');
const html = await read('index.html');
const auth = await read('auth.js');
const schema = await read('backend/schema.sql');
assert.match(html, /backend-config\.js/, 'backend config hook missing');
assert.match(html, /supabase-js@2/, 'Supabase client library missing');
assert.match(html, /auth\.js/, 'multi-user auth module missing');
assert.match(auth, /requested_role/);
assert.match(auth, /admin_set_teacher_status/);
assert.match(auth, /amirAuthUsername/);
assert.match(auth, /class_student_roster/);
assert.match(auth, /join_class_by_code/);
assert.match(auth, /loadAllUsers/);
assert.match(auth, /loadTeacherClasses/);
assert.match(auth, /loadStudentClasses/);
assert.match(auth, /async function shareInvite/);
assert.match(auth, /meeting_url/);
assert.match(auth, /https:/);
const multiuser = await read('backend/multiuser-v2.sql');
assert.match(multiuser, /profiles_username_ci_uidx/);
assert.match(multiuser, /class_student_roster/);
assert.match(multiuser, /join_class_by_code/);
assert.match(multiuser, /classes_meeting_url_https_check/);
assert.match(schema, /approval_status/);
assert.match(schema, /enable row level security/i);
assert.match(schema, /admin_set_teacher_status/);

const webHtml = await read('web/index.html');
const sw = await read('sw.js');
const webSw = await read('web/sw.js');
const manifestText = await read('manifest.webmanifest');
const webManifestText = await read('web/manifest.webmanifest');
const manifest = JSON.parse(manifestText);
const cap = JSON.parse(await read('capacitor.config.json'));
const pkg = JSON.parse(await read('package.json'));

assert.equal(html, webHtml, 'root and web index.html must be synchronized');
assert.equal(sw, webSw, 'root and web service worker must be synchronized');
assert.equal(manifestText, webManifestText, 'root and web manifests must be synchronized');
assert.equal(cap.webDir, 'web', 'Capacitor must package the synchronized web directory');
assert.equal(manifest.lang, 'fa-IR');
assert.equal(manifest.dir, 'rtl');
assert.equal(pkg.version, '2.4.0', 'package version must match the current release');

for (const f of ['index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','sw.js','study-hero.svg']) {
  await access(resolve(root,'web',f), constants.R_OK);
}

const lessonSection = html.slice(html.indexOf('const lessons=['), html.indexOf('const quizQuestions=['));
const lessonIds = [...lessonSection.matchAll(/(?:\bid:|"id":)(\d+)/g)].map(m => Number(m[1]));
const expectedLessonIds = [1,2,3,4,...Array.from({length:25},(_,i)=>i+6)];
assert.deepEqual([...new Set(lessonIds)].sort((a,b)=>a-b), expectedLessonIds, 'all 29 grade-six math lessons must exist exactly once');
assert.match(lessonSection, /lessons\.sort\(\(a,b\)=>a\.id-b\.id\)/, 'lesson list must be sorted by chapter sequence');

for (const chapter of [1,2,3,4,5,6,7]) {
  const re = new RegExp('\\{n:' + chapter + ',title:[^}]+ready:true,lessonIds:\\[');
  assert.match(html, re, 'chapter ' + chapter + ' must be marked ready and link to its lessons');
}
for (const id of expectedLessonIds) {
  const hasBank = id <= 4
    ? new RegExp('\\n' + id + ':\\[').test(html)
    : html.includes('"' + id + '":[') || html.includes('lessonQuestionBanks[' + id + ']=[');
  assert.ok(hasBank, 'lesson exam bank missing: ' + id);
}
for (const topic of ['fractions','measurement','ratio','approximation']) {
  assert.ok(html.includes(topic + ':['), 'worksheet bank missing: ' + topic);
  assert.ok(html.includes('value="' + topic + '"'), 'worksheet selector missing: ' + topic);
}
assert.match(html, /const chapterQuizBanks=Object.fromEntries/);
assert.match(html, /function startChapterQuiz\(n\)/);
assert.match(html, /function getQuestions\(\)[\s\S]*lessonQuestionBanks\[currentLesson\]/, 'lesson quiz must use the selected lesson bank');
assert.ok(html.includes("عدد بعدی را بنویس: ۳، ۷، ۱۱، ۱۵، …','۱۹'"), 'pattern worksheet answer must be correct');
assert.match(html, /id="globalSearch"/);
assert.match(html, /id="english"/);
assert.match(html, /id="dictionarySearch"/);
assert.match(html, /function searchEnglishDictionary\(/);
assert.match(html, /englishExtendedThemes/);
assert.match(html, /function renderEnglishBook\(/);
for (const level of ['first-friends-1','first-friends-2','first-friends-3','family-friends-1','family-friends-2','family-friends-3','family-friends-4','family-friends-5','family-friends-6']) assert.ok(html.includes(level), 'English pathway missing: ' + level);
assert.match(html, /englishWords/);
assert.match(html, /englishPdfInput/);
assert.match(html, /englishAudioInput/);
assert.match(html, /function openEnglishPDF\(/);
assert.match(html, /function loadEnglishAudio\(/);
assert.match(html, /function speakEnglish\(/);
assert.match(html, /en-US/);
assert.match(html, /americanEnglishExtras/);
assert.match(html, /American English/);
assert.match(html, /American Family and Friends/);
assert.match(html, /function initEnglishStudio\(/);

assert.match(sw, /amoozesh-ba-amir-v34/);
assert.match(html, /id="classSessionList"/);
assert.match(html, /function saveClassSession\(/);
assert.match(html, /id="studentSearch"/);
assert.match(html, /function editStudent\(/);
assert.match(html, /id="classGrade"/);
assert.match(html, /function studentsForSession\(/);
assert.match(html, /function openAttendanceForm\(/);
assert.match(html, /function saveSessionAttendance\(/);
assert.match(html, /function exportAttendanceCSV\(/);
assert.match(html, /amClassAttendanceV1/);
assert.match(html, /function renderTeacherOverview\(/);
assert.match(html, /targetGrade:document.getElementById\('classGrade'\)\.value/);
assert.match(html, /function setAllPresent\(sessionId\)/);
assert.match(html, /recordSkillAnswer\(q,i===q\.a\)/);
assert.match(html, /onclick="exportAttendanceCSV\(\)">خروجی حضور و غیاب/);
assert.match(html, /id="aiAccessToken"/);
assert.match(html, /function exportFullBackup\(/);
assert.match(html, /function importFullBackup\(/);
assert.match(sw, /url\.origin !== self\.location\.origin/);
assert.match(sw, /pathname\.includes\('\/api\/'\)/);

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m => !/\bsrc\s*=/.test(m[1]) && m[2].trim());
assert.ok(inlineScripts.length > 0, 'inline application script must exist');
for (let i=0; i<inlineScripts.length; i++) {
  const check = spawnSync(process.execPath, ['--check','-'], { input: inlineScripts[i][2], encoding: 'utf8' });
  assert.equal(check.status, 0, 'inline script ' + (i+1) + ' has a syntax error: ' + check.stderr);
}

const authCheck = spawnSync(process.execPath, ['--check', resolve(root,'auth.js')], { encoding: 'utf8' });
assert.equal(authCheck.status, 0, 'auth.js syntax check failed: ' + authCheck.stderr);

const serverCheck = spawnSync(process.execPath, ['--check', resolve(root,'secure-ai-server/server.mjs')], { encoding: 'utf8' });
assert.equal(serverCheck.status, 0, 'server syntax check failed: ' + serverCheck.stderr);
console.log('PASS: synchronized PWA/Capacitor assets, multi-user role client, class invites, HTTPS meeting links, privacy RPCs, 29 math lessons, English studio, lesson exams, worksheets and inline JavaScript syntax.');
console.log('NOTE: static QA is not a substitute for testing on real Android devices, accessibility, privacy, live-class workflows or release signing.');
