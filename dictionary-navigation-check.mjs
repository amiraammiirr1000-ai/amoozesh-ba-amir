import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const index=read('./index.html'),webIndex=read('./web/index.html');
const sw=read('./sw.js'),webSw=read('./web/sw.js');
assert.equal(index,webIndex,'root and web index.html must be synchronized');
assert.equal(sw,webSw,'root and web sw.js must be synchronized');
const data=JSON.parse(read('./504-essential-words.json'));
assert.equal(data.words.length,504,'504 course must contain exactly 504 source words');
const groups=new Map();
for(const w of data.words){assert.ok(w.english&&w.group&&Number.isInteger(w.order),'every 504 word needs english/group/order');groups.set(w.group,(groups.get(w.group)||0)+1)}
assert.equal(groups.size,42,'504 course must contain 42 lessons');
for(const [g,n] of groups)assert.equal(n,12,g+' must contain 12 words');
for(const file of ['grade6-ch1-worksheet-pack.js','dictionary-unified-v1.js','navigation-history-v1.js']){
 assert.ok(index.includes(file),'index must load '+file);
 assert.ok(sw.includes('./'+file),'service worker must cache '+file);
 execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
}
assert.ok(sw.includes('./504-essential-words.json'),'service worker must cache the 504 dataset');
assert.ok(read('./dictionary-unified-v1.js').includes("'./504-essential-words.json'"),'dictionary module must load the offline 504 dataset');
const dict=read('./dictionary-unified-v1.js');
assert.ok(dict.includes("'/books/504-essential/words?lang=fa&limit=500&offset='"),'dictionary must sync 504 translations from the documented Openjam endpoint');
assert.ok(dict.includes("'/search?q='")&&dict.includes("'/words/'"),'dictionary must use search and word detail endpoints');
assert.ok(dict.includes('indexedDB.open(DB,1)'),'dictionary must persist offline entries in IndexedDB');
const nav=read('./navigation-history-v1.js');
assert.ok(nav.includes("window.addEventListener('popstate'"),'back navigation must support Android/browser back');
assert.ok(nav.includes('aba-global-back'),'all main views must render a back control');
const worksheets=read('./grade6-ch1-worksheet-pack.js');
for(const key of ['patterns','place','divisibility','integers','mixed'])assert.ok(worksheets.includes("add('"+key+"'"),'missing grade-six chapter-one worksheet bank: '+key);
const menu=read('./app-tree-menu.js');
const home=read('./app-home-v3.js'),classroom=read('./online-classroom-v1.js');
assert.ok(menu.includes('data-view="gradeFolderView"')&&home.includes('function buildGradeView()'),'grade folder menu must target a mounted view');
assert.ok(menu.includes('data-view="grade6FolderView"')&&home.includes('function buildGrade6View()'),'grade-six menu must target its mounted chapter folder');
assert.ok(menu.includes('data-view="onlineClassroom"')&&classroom.includes("view.id='onlineClassroom'"),'online classroom menu must target its mounted view');
assert.ok(index.includes('app-home-v3.js')&&sw.includes('./app-home-v3.js'),'grade folder module must load and cache');
assert.ok(index.includes('online-classroom-v1.js')&&sw.includes('./online-classroom-v1.js'),'online classroom module must load and cache');
console.log('Dictionary, offline 504 course, back navigation and grade-six worksheet checks passed.');
