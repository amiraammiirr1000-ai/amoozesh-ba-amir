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
const webAuth = await read('web/auth.js');
const backendConfig = await read('backend-config.js');
const tutorWorker = await read('smart-teacher/worker.js');
const webBackendConfig = await read('web/backend-config.js');
const schema = await read('backend/schema.sql');
const pdfGenerator = await read('scripts/generate-grade6-pdfs.py');
assert.match(html, /backend-config\.js/, 'backend config hook missing');
assert.equal(auth, webAuth, 'root and web auth modules must be synchronized');
assert.match(auth, /id='amirProfilePanels'/, 'account and role dashboards must have a dedicated profile container');
assert.match(auth, /function rolePanel\(id,title,html\)\{[\s\S]*const host=\$\('amirProfilePanels'\);if\(!host\)return null/, 'role dashboards must be mounted only inside the profile page');
assert.doesNotMatch(auth, /host\?\.append\(s\)[\s\S]{0,100}main\.content/, 'role dashboards must never fall back to the shared main content area');
assert.match(auth, /clearInterval\(adminPollTimer\)/, 'admin notification polling must stop when leaving the admin role view');
assert.equal(backendConfig, webBackendConfig, 'root and web backend configs must be synchronized');
assert.match(html, /supabase-js@2/, 'Supabase client library missing');
assert.match(html, /auth\.js/, 'multi-user auth module missing');
assert.match(tutorWorker, /https:\/\/localhost/, 'secure Android Capacitor origin must be allowed by AI Worker CORS');
assert.match(tutorWorker, /capacitor:\/\/localhost/, 'Capacitor custom origin must remain supported');
assert.match(tutorWorker, /configured: Boolean\(env\.AI && typeof env\.AI\.run === "function"\)/, 'AI health check must verify the Cloudflare Workers AI binding');
assert.match(tutorWorker, /provider: "Cloudflare Workers AI"/, 'AI provider must match the deployed Workers AI service');
assert.match(tutorWorker, /model: "@cf\/openai\/gpt-oss-120b"/, 'AI health check must report the configured model');
assert.match(tutorWorker, /دست\u200cکم یک مثال واقعی و حل\u200cشده/, 'AI tutor must teach concepts with a worked example');
assert.match(tutorWorker, /max_tokens: 4500/, 'AI tutor must have room for detailed lessons');
assert.match(pdfGenerator, /def solutions\(kind\):/, 'Grade 6 PDF worksheets must include teacher answer keys');
for (const topic of ['الگو و دنباله','عددنویسی','بخش‌پذیری','اعداد صحیح','کسر','اعشاری','هندسه','مختصات','اندازه‌گیری','نسبت','درصد','تقریب']) assert.ok(pdfGenerator.includes(topic), 'Missing answer key topic: '+topic);
assert.match(pdfGenerator, /پاسخ‌نامهٔ آموزگار/, 'Generated lesson PDFs must include a separate teacher answer page');
const gradeHome = await read('app-home-v3.js');
assert.match(gradeHome, /window\.openGrade=openGrade/, 'home grade cards must call a globally available navigation handler');
assert.match(html, /AMIR_AI_DEFAULT_ENDPOINT='https:\/\/amoozesh-ba-amir-ai\.amir-aammiirr-1000\.workers\.dev'/, 'fresh installs must be preconfigured for the online AI tutor');
assert.match(html, /localStorage\.setItem\(AMIR_AI_ENDPOINT_KEY,''\)/, 'users must retain an explicit offline switch');
assert.match(auth, /requested_role/);
assert.match(auth, /admin_set_teacher_status/);
assert.match(auth, /amirAuthUsername/);
assert.match(auth, /class_student_roster/);
assert.match(auth, /join_class_by_code/);
assert.match(auth, /loadAllUsers/);
assert.match(auth, /loadTeacherClasses/);
assert.match(auth, /loadStudentClasses/);
assert.ok(auth.includes('classes(title,grade,subject,meeting_url)'), 'student class list must retrieve the secure meeting URL');
assert.match(auth, /ورود به کلاس آنلاین/, 'students must be able to open the teacher meeting link');
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
assert.equal(await read('grade6-pdf-library-v1.js'), await read('web/grade6-pdf-library-v1.js'), 'root and web Grade 6 PDF libraries must be synchronized');
const manifest = JSON.parse(manifestText);
const cap = JSON.parse(await read('capacitor.config.json'));
const pkg = JSON.parse(await read('package.json'));

assert.equal(html, webHtml, 'root and web index.html must be synchronized');
assert.equal(sw, webSw, 'root and web service worker must be synchronized');
assert.ok(sw.includes('primary-grades-v1.js') && sw.includes('math-game-engine-v2.js'), 'interactive math modules must be included in offline cache');
assert.match(sw, /const CACHE = 'amoozesh-ba-amir-v\d+'/, 'PWA cache version must be declared');
assert.ok(Number(sw.match(/amoozesh-ba-amir-v(\d+)/)?.[1]) >= 59, 'PWA cache version must include the latest app fixes');
assert.equal(manifestText, webManifestText, 'root and web manifests must be synchronized');
assert.equal(cap.webDir, 'web', 'Capacitor must package the synchronized web directory');
assert.equal(manifest.lang, 'fa-IR');
assert.equal(manifest.dir, 'rtl');
assert.equal(pkg.version, '3.2.0', 'package version must match the 3.2.0 release candidate');

for (const f of ['index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','sw.js','study-hero.svg']) {
  await access(resolve(root,'web',f), constants.R_OK);
}

const lessonSection = html.slice(html.indexOf('const lessons=['), html.indexOf('const quizQuestions=['));
const lessonIds = [...lessonSection.matchAll(/(?:\bid:|"id":)(\d+)/g)].map(m => Number(m[1]));
const expectedLessonIds = [1,2,3,4,...Array.from({length:25},(_,i)=>i+6)];
assert.deepEqual([...new Set(lessonIds)].sort((a,b)=>a-b), expectedLessonIds, 'all 29 grade-six math lessons must exist exactly once');
assert.match(html, /id="lessonTotal">۲۹<\/strong>/, 'home dashboard must display the actual 29-lesson total');
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
const videoLibrary = await read('video-library-v1.js');
const webVideoLibrary = await read('web/video-library-v1.js');
assert.equal(videoLibrary, webVideoLibrary, 'root and web video libraries must be synchronized');
assert.match(videoLibrary, /storageKey=KEY/);
assert.ok(videoLibrary.includes("KEY+':'+(userId?'user:'+String(userId):'guest')"), 'video library data must be scoped per signed-in account');
assert.match(videoLibrary, /amir:user-changed/, 'video library must switch data when account changes');
const supportModule = await read('support-center-v1.js');
const supportSyntax = spawnSync(process.execPath, ['--check','-'], { input: supportModule, encoding: 'utf8' });
assert.equal(supportSyntax.status, 0, 'support module syntax check failed: ' + supportSyntax.stderr);
assert.ok(supportModule.includes("from('support_feedback')"), 'online support feedback insert missing');
assert.ok(supportModule.includes('supportAdminInbox'), 'admin support inbox missing');
assert.ok((await read('privacy.html')).includes('جدول پشتیبانی آنلاین'), 'privacy policy must disclose online support data handling');
assert.ok(html.includes('صندوق مدیر کل ذخیره می‌شود'), 'in-app privacy notice must disclose support inbox');
assert.ok((await read('backend/support-feedback-v1.sql')).includes('enable row level security'), 'support feedback RLS migration missing');
for (const key of ['amirPrimaryGradeProgressV1','amirPrimaryGradeQuizV1','amirPrimaryGradeExamV1','amirVideoLibraryV1','amirEnglishFavoritesV2','amirEnglishWritingV2','amirEnglishScoresV2']) assert.ok(html.includes(key), 'local backup must include '+key);
assert.ok(html.includes('function showView(id){let navId=id;if(id==="library")id="worksheets";'), 'library navigation must open the real PDF and worksheet library');
assert.ok(html.includes('grade6FolderView') && html.includes('onlineClassroom') && html.includes('navId="home"'), 'dynamic views must preserve bottom navigation state');
assert.match(html, /math-game-engine-v2\.js/, 'math game engine module must be loaded');
assert.match(html, /id="gameLab"/, 'math game lab container must exist');
assert.match(html, /id="gameStage"/, 'math game stage container must exist');
assert.match(html, /id="gameProgress"/, 'persistent game progress panel missing');
assert.match(html, /dashboard-launch/, 'student dashboard quick actions missing');
assert.match(html, /id="english"/);
assert.match(html, /id="dictionarySearch"/);
assert.match(html, /function searchEnglishDictionary\(/);
assert.match(html, /englishExtendedThemes/);
assert.match(html, /function renderEnglishBook\(/);
for (const level of ['first-friends-1','first-friends-2','first-friends-3','family-friends-1','family-friends-2','family-friends-3','family-friends-4','family-friends-5','family-friends-6','cefr-b2','cefr-c1']) assert.ok(html.includes(level), 'English pathway missing: ' + level);
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
assert.match(html, /english-studio-v3\.js/);
assert.match(html, /math-game-engine-v2\.js/);
assert.match(html, /math-worksheets-v2\.js/);
assert.match(html, /math-lesson-depth-v1\.js/);
const mathDepth = await read('math-lesson-depth-v1.js');
assert.match(mathDepth, /window\.openLesson/);
assert.match(mathDepth, /مثال حل‌شده مرحله‌به‌مرحله/);

const classroomModule = await read('online-classroom-v1.js');
const classroomSyntax = spawnSync(process.execPath, ['--check','-'], { input: classroomModule, encoding: 'utf8' });
assert.equal(classroomSyntax.status, 0, 'online classroom syntax check failed: ' + classroomSyntax.stderr);
assert.ok(html.includes('online-classroom-v1.js'), 'online classroom module missing');
assert.ok(sw.includes('online-classroom-v1.js'), 'online classroom module missing from offline cache');
assert.match(classroomModule, /join_class_by_code/);
assert.match(classroomModule, /meeting_url/);
const videoModule = await read('video-library-v1.js');
assert.ok(videoModule.includes('function parseUrl('));
assert.ok(videoModule.includes('youtube-nocookie.com'));
assert.ok(videoModule.includes("host==='aparat.com'"), 'Aparat links must be supported for Iranian users');
assert.ok(videoModule.includes('videohash/') && videoModule.includes("item.kind==='aparat'"), 'Aparat embeds must use the secure HTTPS player');
assert.ok(videoModule.includes('function playLocal('));
const videoSyntax = spawnSync(process.execPath, ['--check','-'], { input: videoModule, encoding: 'utf8' });
assert.equal(videoSyntax.status, 0, 'video library syntax check failed: ' + videoSyntax.stderr);
assert.ok(html.includes('video-library-v1.js'), 'video library script missing');
assert.ok(sw.includes('video-library-v1.js'), 'video library missing from offline cache');
const toolbarModule = await read('global-toolbar-v1.js');
assert.equal(toolbarModule, await read('web/global-toolbar-v1.js'), 'root and web top toolbar modules must be synchronized');
const toolbarSyntax = spawnSync(process.execPath, ['--check','-'], { input: toolbarModule, encoding: 'utf8' });
assert.equal(toolbarSyntax.status, 0, 'top toolbar syntax check failed: ' + toolbarSyntax.stderr);
assert.ok(html.includes('global-toolbar-v1.js'), 'shared top toolbar script missing');
assert.ok(sw.includes('global-toolbar-v1.js'), 'shared top toolbar missing from offline cache');
assert.match(toolbarModule, /abaSearchToggle/);
assert.match(toolbarModule, /abaOptionsToggle/);
assert.match(toolbarModule, /globalSearch/);
const primaryModule = await read('primary-grades-v1.js');
assert.equal(primaryModule, await read('web/primary-grades-v1.js'), 'root and web primary-grade modules must be synchronized');
assert.ok(primaryModule.includes('function mount(){'), 'primary-grade hub must initialize its UI container');
assert.ok(primaryModule.includes('primaryGradesHub'), 'primary-grade hub container missing');
assert.ok(primaryModule.includes("amir:user-changed") && primaryModule.includes(':user:'), 'primary learning progress must be isolated per account');
assert.ok(html.includes("startsWith('amirPrimaryGradeProgressV1')"), 'primary progress backup must include account-scoped keys');
assert.ok(primaryModule.includes('primaryStartExam') && primaryModule.includes('function startExam()'), 'primary-grade comprehensive exam missing');
assert.ok(primaryModule.includes('primaryPrintArea') && primaryModule.includes('function printWorksheet()'), 'primary-grade printable worksheet missing');
assert.match(primaryModule, /function checkAnswer\(/, 'primary-grade exercises must check student answers');
assert.match(primaryModule, /data-primary-check/, 'primary-grade exercise check controls missing');
assert.match(primaryModule, /topicCorrectCount/, 'primary-grade learning progress must be tracked');
assert.match(primaryModule, /count<2/, 'a lesson must require at least two correct answers before completion');

const worksheetModule = await read('math-worksheets-v2.js');
assert.match(worksheetModule, /worksheetBanks\.decimals/);
assert.match(worksheetModule, /worksheetBanks\.symmetry/);
assert.match(worksheetModule, /worksheetBanks\.coordinates/);

const gameModule = await read('math-game-engine-v2.js');
assert.match(gameModule, /window\.startMathGame/);
assert.match(gameModule, /window\.checkMathGame/);
assert.match(gameModule, /window\.openGameLab/);
assert.match(gameModule, /function coordinateGrid\(/, 'coordinate game must render an actual coordinate grid');
assert.match(gameModule, /شبکهٔ زیر مشخص شده/, 'coordinate game must ask students to identify the plotted point');
assert.match(gameModule, /state\.points=\(Number\(state\.points\)\|\|0\)\+10/, 'correct game answers must add saved learning points');

assert.match(sw, /const CACHE = 'amoozesh-ba-amir-v\d+'/);
const englishModule = await read('english-studio-v3.js');
assert.match(englishModule, /window\.openEnglishUnit/);
assert.match(englishModule, /window\.checkEnglishUnit/);
assert.match(englishModule, /amirEnglishFavoritesV2/);
assert.match(englishModule, /SUPPLEMENTARY LESSON/);
assert.match(englishModule, /window\.printEnglishUnit/);
assert.match(englishModule, /U\.forEach\(\(u,i\)=>\{u\.id=i\+1\}\)/);

assert.match(englishModule, /window\.saveEnglishWriting/);
assert.match(englishModule, /amirEnglishScoresV2/);
assert.match(englishModule, /Upper elementary \/ B1/);
assert.match(englishModule, /Upper-intermediate B2/);
assert.match(englishModule, /Advanced C1/);
assert.match(englishModule, /function levelForBook/);
assert.match(englishModule, /eng-level-extension/);




assert.match(sw, /const CACHE = 'amoozesh-ba-amir-v\d+'/);
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
assert.match(html, /window\.AmirAuth\?\.getAccessToken\?\.\(\)/, 'AI tutor must use the authenticated Supabase session token');
assert.doesNotMatch(html, /id="aiAccessToken"/, 'client-side API token fields must not be exposed');
assert.match(html, /function exportFullBackup\(/);
assert.match(html, /function importFullBackup\(/);
for (const key of ['abaFlashCardsV1','abaDailyTasksV1','abaDictionaryFavoritesV2','abaWhiteboardSnapshotV1','amirEnglishRate']) assert.ok(html.includes(key), 'backup allowlist missing '+key);
assert.ok(html.includes("k.startsWith('abaGrowthSuiteV1')"), 'account-scoped learning growth data must be included in backup');
assert.ok(html.includes('const incoming=Object.entries(obj.data)') && html.includes('!keep.has(k)'), 'restore must replace managed local data, not silently merge stale keys');
assert.match(sw, /url\.origin !== self\.location\.origin/);
assert.match(sw, /pathname\.includes\('\/api\/'\)/);


for (const name of ['navigation-history-v1.js','learning-tools-suite-v1.js','whiteboard-pro-v1.js','student-growth-suite-v1.js','smart-tutor-input-v1.js']) {
  const source = await read(name);
  const check = spawnSync(process.execPath, ['--check','-'], { input: source, encoding: 'utf8' });
  assert.equal(check.status, 0, name + ' syntax check failed: ' + check.stderr);
  assert.ok(html.includes(name), name + ' script tag missing from HTML');
  assert.ok(sw.includes(name), name + ' missing from service worker cache');
}
assert.ok(html.includes('visual-polish-v15.css'), 'v15 stylesheet missing from HTML');
assert.ok(html.includes('visual-polish-v18.css') && sw.includes('visual-polish-v18.css'), 'v18 visual system must be linked and cached');
assert.ok(sw.includes('visual-polish-v15.css'), 'v15 stylesheet missing from cache');
assert.ok((await read('learning-tools-suite-v1.js')).includes('abaLearningSuite'));
assert.ok((await read('whiteboard-pro-v1.js')).includes('abaWbSave'));
const growthSuite = await read('student-growth-suite-v1.js');
assert.match(growthSuite, /function recommend\(/);
assert.match(growthSuite, /function award\(/);
assert.doesNotMatch(growthSuite, /familyReport|abaFamilyEvents|abaFamilyStats/, 'family monitoring/report view must remain excluded');
assert.match(growthSuite, /speechSynthesis/);
assert.match(growthSuite, /aba-high-contrast/);
assert.match(growthSuite, /aba-reduce-motion/);
assert.ok(html.includes('student-growth-suite-v1.js'), 'growth suite script missing');
assert.equal(growthSuite, await read('web/student-growth-suite-v1.js'), 'root and Android web growth modules must be synchronized');

const pdfLibrary = await read('grade6-pdf-library-v1.js');
assert.ok(html.includes('grade6-pdf-library-v1.js'), 'grade 6 PDF library script missing');
assert.ok(sw.includes('grade6-pdf-library-v1.js'), 'grade 6 PDF library missing from offline cache');
assert.ok(html.includes('data-view="library"'), 'library navigation button missing');
assert.ok(pdfLibrary.includes('chap.sch.ir'), 'official textbook source link missing');
assert.ok(pdfLibrary.includes('کاربرگ‌ساز') && pdfLibrary.includes('data-wstopic'), 'lesson worksheet integration missing');
assert.ok(pdfLibrary.includes('۲۲۲ صفحه') && pdfLibrary.includes('biamoz.com'), 'Biamoz resource links missing');

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

const supportJs = await read('support-center-v1.js');
assert.equal(supportJs, await read('web/support-center-v1.js'), 'root and web support scripts must be synchronized');
assert.equal(await read('support-center-v1.css'), await read('web/support-center-v1.css'), 'root and web support styles must be synchronized');
assert.ok(html.includes('support-center-v1.js') && html.includes('support-center-v1.css'), 'support center assets must be linked');
assert.ok(sw.includes('support-center-v1.js') && sw.includes('support-center-v1.css'), 'support center assets must be cached offline');
assert.ok(html.includes('id="support"') && html.includes('id="privacy"'), 'support and privacy views must exist');
assert.ok(html.includes('id="supportMessage"') && html.includes('submitSupportFeedback'), 'feedback form must be wired');
assert.ok(html.includes('privacy.html'), 'public privacy policy link must exist');
assert.ok((await read('privacy.html')).includes('سیاست حریم خصوصی'), 'standalone privacy policy page missing');
assert.equal(await read('privacy.html'), await read('web/privacy.html'), 'root and web privacy pages must be synchronized');
assert.ok(supportJs.includes("from('support_feedback')"), 'authenticated feedback must support online submission');
assert.ok(supportJs.includes('پیش‌نویس روی دستگاه ذخیره شد') && supportJs.includes('supportAdminInbox'), 'local fallback and admin inbox must remain available');
assert.match(supportJs, /localStorage/, 'feedback draft storage must be local and explicit');

console.log('PASS: synchronized PWA/Capacitor assets, multi-user role client, class invites, HTTPS meeting links, privacy RPCs, 29 math lessons, English studio, lesson exams, worksheets and inline JavaScript syntax.');
console.log('PASS: static project QA. Game execution tests run separately through game-lab-check.mjs.');
console.log('NOTE: automated checks are not a substitute for testing on real Android devices, accessibility, privacy, live-class workflows or release signing.');
