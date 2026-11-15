import fs from 'node:fs';
const home=fs.readFileSync('app-home-v3.js','utf8');
const dict=fs.readFileSync('dictionary-openjam.js','utf8');
const html=fs.readFileSync('index.html','utf8');
for(const x of ['پایه‌ها و درس‌ها','کاربرگ‌ها و فایل‌ها','تمرین و بازی','سایر امکانات','gradeFolderView']) if(!home.includes(x)) throw new Error('Missing home feature: '+x);
for(const x of ['/v1/search','/v1/words/','openjam-word','audio_url','language_code']) if(!dict.includes(x)) throw new Error('Missing dictionary feature: '+x);
if(!html.includes('dictionary-openjam.js')||!html.includes('app-home-v3.js')) throw new Error('New modules are not loaded');
console.log('Home v3 and Openjam dictionary checks passed.');
