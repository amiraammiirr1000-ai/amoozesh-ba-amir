/* آموزش با امیر · خانه و پوشه‌بندی نسخه ۲.۹.۸ */
(()=>{
'use strict';
const css=`
.home-v2{display:grid;gap:15px}
.home-v2-hero{position:relative;isolation:isolate;overflow:hidden;min-height:194px;border-radius:26px;padding:22px 20px;color:#fff;background:linear-gradient(118deg,#142c50 0%,#4c46ae 56%,#d96d9d 100%);box-shadow:0 14px 32px #38318a24}
.home-v2-hero:before,.home-v2-hero:after{content:"";position:absolute;border:1px solid #ffffff2e;border-radius:50%;pointer-events:none;z-index:-1}
.home-v2-hero:before{width:230px;height:230px;left:-75px;top:-115px;box-shadow:0 0 0 22px #ffffff0b,0 0 0 48px #ffffff08}
.home-v2-hero:after{width:120px;height:120px;right:44%;bottom:-92px;background:#ffffff0c}
.home-v2-kicker{font-size:10px;font-weight:900;letter-spacing:1.6px;color:#ffe6a0}
.home-v2-hero h1{font-size:23px;line-height:1.55;margin:8px 0 4px;font-weight:900;max-width:72%}
.home-v2-hero p{font-size:12px;line-height:2;color:#f0edff;margin:0;max-width:67%}
.home-v2-hero img{position:absolute;left:4px;bottom:-15px;width:34%;max-width:190px;filter:drop-shadow(0 12px 12px #1115);pointer-events:none}
.home-v2-hero .home-v2-hero-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px;position:relative;z-index:2}
.home-v2-hero .home-v2-hero-actions button{border-radius:13px;padding:9px 13px;font-size:12px;font-weight:800;background:#ffe08b;color:#24314b;box-shadow:0 5px 14px #10152b30}
.home-v2-hero .home-v2-hero-actions button.secondary{background:#ffffff20;color:#fff;border:1px solid #ffffff55;box-shadow:none}
.home-v2-heading{display:flex;align-items:end;justify-content:space-between;gap:8px;margin:2px 0 0}
.home-v2-heading h2{font-size:17px;margin:0;font-weight:900}
.home-v2-heading p{font-size:11px;color:var(--muted);margin:2px 0 0}
.home-v2-folders{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.home-v2-folder{position:relative;display:flex;align-items:center;gap:11px;text-align:right;min-height:91px;padding:13px;border:1px solid var(--line);border-radius:19px;background:linear-gradient(145deg,var(--white),color-mix(in srgb,var(--folder-tint,#777) 8%,var(--white)));color:var(--ink);box-shadow:0 7px 18px #1b35500b;transition:transform .18s,box-shadow .18s}
.home-v2-folder:active{transform:scale(.98)}
.home-v2-folder-icon{width:47px;height:47px;flex:0 0 47px;border-radius:16px;display:grid;place-items:center;background:color-mix(in srgb,var(--folder-tint,#777) 15%,white);font-size:25px;box-shadow:inset 0 0 0 1px #ffffffaa}
.home-v2-folder b{display:block;font-size:12px;font-weight:900}
.home-v2-folder small{display:block;color:var(--muted);font-size:10px;line-height:1.7;margin-top:2px}
.home-v2-folder .folder-arrow{position:absolute;left:10px;top:9px;color:var(--folder-tint,#777);font-size:17px}
.home-v2-folder[data-folder="courses"]{--folder-tint:#5b65d8}
.home-v2-folder[data-folder="files"]{--folder-tint:#db8a35}
.home-v2-folder[data-folder="practice"]{--folder-tint:#1a9b83}
.home-v2-folder[data-folder="tools"]{--folder-tint:#8a63c7}
.home-v2-folder[data-folder="class"]{--folder-tint:#3484bc}
.home-v2-folder[data-folder="personal"]{--folder-tint:#d45f94}
.home-v2-quick{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.home-v2-quick button{display:grid;justify-items:center;gap:4px;padding:12px 6px;border:1px solid var(--line);border-radius:16px;background:var(--white);color:var(--ink);font-size:11px;font-weight:800}
.home-v2-quick span{font-size:22px}
.home-v2-progress{display:grid;gap:7px}
.home-v2-progress .card{margin:0}
.home-v2-resources{border:1px solid var(--line);border-radius:19px;background:var(--white);overflow:hidden}
.home-v2-resources summary{cursor:pointer;list-style:none;padding:15px 16px;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:space-between}
.home-v2-resources summary::-webkit-details-marker{display:none}
.home-v2-resources summary:after{content:"⌄";font-size:20px;color:var(--accent)}
.home-v2-resources[open] summary{border-bottom:1px solid var(--line)}
.home-v2-resource-body{padding:12px}
.library-v2-hero{padding:18px 17px;border-radius:22px;color:white;background:linear-gradient(120deg,#183b59,#4e4caa 65%,#cb6b9b);margin:4px 0 15px}
.library-v2-hero h2{font-size:19px;margin:0 0 3px}
.library-v2-hero p{font-size:12px;margin:0;color:#eeedff}
.library-v2-folder{border:1px solid var(--line);border-radius:19px;background:var(--white);margin:10px 0;overflow:hidden;box-shadow:0 6px 17px #1c36500a}
.library-v2-folder summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px}
.library-v2-folder summary::-webkit-details-marker{display:none}
.library-v2-folder-icon{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-size:24px;background:var(--folder-bg,#f0edff)}
.library-v2-folder-title{flex:1}
.library-v2-folder-title b{display:block;font-size:13px}
.library-v2-folder-title small{display:block;font-size:10px;color:var(--muted)}
.library-v2-folder summary:after{content:"＋";font-size:19px;color:var(--accent)}
.library-v2-folder[open] summary:after{content:"−"}
.library-v2-items{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:0 12px 13px}
.library-v2-item{min-height:67px;display:flex;align-items:center;gap:8px;text-align:right;padding:10px;border:1px solid var(--line);border-radius:13px;background:color-mix(in srgb,var(--accent) 4%,var(--white));color:var(--ink)}
.library-v2-item span{font-size:20px}
.library-v2-item b{font-size:11px;display:block}
.library-v2-item small{font-size:9px;color:var(--muted);display:block}
.library-v2-note{font-size:11px;color:var(--muted);padding:10px 12px;background:var(--bg);border-radius:12px;margin-top:12px}
body[data-theme="midnight"] .home-v2-folder,body[data-theme="midnight"] .home-v2-quick button,body[data-theme="midnight"] .library-v2-folder,body[data-theme="midnight"] .library-v2-item{background:#151f33;color:var(--ink)}
body[data-theme="midnight"] .home-v2-folder-icon,body[data-theme="midnight"] .library-v2-folder-icon{background:#293450}
@media(min-width:650px){.home-v2-folders{grid-template-columns:repeat(3,minmax(0,1fr))}.home-v2-hero{min-height:210px;padding:26px}.home-v2-hero h1{font-size:27px}.home-v2-hero img{width:210px}.library-v2-items{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:370px){.home-v2-folder{gap:8px;padding:10px}.home-v2-folder-icon{width:40px;height:40px;flex-basis:40px}.home-v2-hero h1{font-size:20px}.home-v2-hero img{width:31%}}
`;
const style=document.createElement('style');style.id='appHomeV2Styles';style.textContent=css;document.head.append(style);
const folders=[
{id:'courses',icon:'📚',title:'درس‌ها و کتابخانه',desc:'ریاضی، پایه‌ها و زبان انگلیسی',items:[
['📘','ریاضی ششم','درس‌ها و نقشه کتاب','math6'],['🎒','ریاضی پایه اول تا پنجم','مسیرهای آموزشی مکمل','primary'],['🔤','دوره‌های انگلیسی','First Friends و Family and Friends','english'],['📖','دیکشنری انگلیسی','جست‌وجو و واژه‌های ذخیره‌شده','dictionary']]},
{id:'files',icon:'🗂️',title:'کاربرگ و فایل‌ها',desc:'ساخت تمرین و کتابخانه PDF',items:[
['📝','کاربرگ‌ساز','ساخت و چاپ تمرین ریاضی','worksheet'],['📄','PDFهای شخصی','افزودن و بازکردن فایل مجاز','englishFiles'],['🎧','فایل‌های صوتی','کتابخانه و استودیوی صوتی','englishAudio']]},
{id:'practice',icon:'🎯',title:'تمرین و بازی',desc:'آزمون، چالش و بازی‌های آموزشی',items:[
['🎮','بازیگاه ریاضی','۸ بازی تعاملی','games'],['🧠','آزمون ریاضی','آزمون و سنجش یادگیری','quiz'],['🏅','چالش روزانه','تمرین کوتاه روز','challenge']]},
{id:'tools',icon:'🧰',title:'ابزارهای یادگیری',desc:'نوشتن، یادداشت و راهنمایی',items:[
['✍️','وایت‌برد','حل تمرین با لمس و قلم','whiteboard'],['🧠','دفتر حافظه','نکته‌ها و اشتباهات','memory'],['✨','معلم هوشمند','راهنمای آموزشی','tutor']]},
{id:'class',icon:'🏫',title:'کلاس و مدیریت',desc:'دانش‌آموز، تکلیف و گزارش',items:[
['👩‍🏫','پنل معلم','مدیریت کلاس و دانش‌آموزان','teacher'],['🗓️','جلسه‌های کلاس','برنامه‌ریزی و حضور و غیاب','teacher'],['📊','گزارش پیشرفت','کارنامه و تحلیل یادگیری','teacher']]},
{id:'personal',icon:'👤',title:'حساب و شخصی‌سازی',desc:'پروفایل و تنظیمات برنامه',items:[
['🎨','ظاهر برنامه','تم و تنظیمات نمایشی','profile'],['🛍️','فروشگاه','محصولات آموزشی','shop'],['ℹ️','درباره برنامه','معرفی و راه ارتباطی','about']]}
];
function route(action){
switch(action){
case'math6':showView('home');document.querySelector('.home-v2-resources')?.setAttribute('open','');document.getElementById('lessonList')?.scrollIntoView({behavior:'smooth',block:'start'});break;
case'primary':showView('tools');if(typeof window.openPrimaryGradesHub==='function')window.openPrimaryGradesHub();else setTimeout(()=>document.getElementById('primaryGradesHub')?.scrollIntoView({behavior:'smooth'}),200);break;
case'english':showView('english');document.querySelector('[data-etab="courses"]')?.click();break;
case'dictionary':showView('english');document.querySelector('[data-etab="dictionary"]')?.click();break;
case'worksheet':showView('worksheets');break;
case'englishFiles':showView('english');document.querySelector('[data-etab="library"]')?.click();break;
case'englishAudio':showView('english');document.querySelector('[data-etab="audio"]')?.click();break;
case'games':if(typeof window.openGameLab==='function')window.openGameLab();else showView('tools');break;
case'quiz':if(typeof window.startQuiz==='function')window.startQuiz();else showView('quiz');break;
case'challenge':if(typeof window.startDailyChallenge==='function')window.startDailyChallenge();else showView('home');break;
case'whiteboard':case'memory':case'tutor':case'teacher':case'shop':case'profile':case'about':showView(action);break;
}
}
window.openLibraryFolder=id=>{showView('libraryHub');const d=document.getElementById('library-folder-'+id);if(d){document.querySelectorAll('.library-v2-folder').forEach(x=>x.open=false);d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}};
window.routeLibraryAction=route;
function buildLibrary(){
const main=document.querySelector('main.content');if(!main||document.getElementById('libraryHub'))return;
const section=document.createElement('section');section.id='libraryHub';section.className='view';
section.innerHTML='<div class="section-head"><h2>پوشه‌های آموزش با امیر</h2><span class="tag">کتابخانه منظم</span></div><div class="library-v2-hero"><span class="home-v2-kicker">YOUR LEARNING LIBRARY</span><h2>هر چیزی، در پوشه خودش</h2><p>درس‌ها، فایل‌ها، تمرین‌ها و ابزارها را از اینجا پیدا کن.</p></div><div id="libraryFolderList"></div><div class="library-v2-note">این پوشه‌ها دسته‌بندی بخش‌ها و امکانات برنامه هستند. فایل‌های PDF شخصی فعلاً از کتابخانه انگلیسی و فایل‌هایی که خودت انتخاب می‌کنی باز می‌شوند؛ ذخیره‌سازی ابری و پوشه فایل مشترک هنوز فعال نشده است.</div>';
main.append(section);
const list=section.querySelector('#libraryFolderList');
list.innerHTML=folders.map(f=>'<details class="library-v2-folder" id="library-folder-'+f.id+'"><summary><span class="library-v2-folder-icon">'+f.icon+'</span><span class="library-v2-folder-title"><b>'+f.title+'</b><small>'+f.desc+'</small></span></summary><div class="library-v2-items">'+f.items.map(it=>'<button class="library-v2-item" type="button" data-library-action="'+it[3]+'"><span>'+it[0]+'</span><span><b>'+it[1]+'</b><small>'+it[2]+'</small></span></button>').join('')+'</div></details>').join('');
}
function rebuildHome(){
const home=document.getElementById('home');if(!home||home.dataset.homeV2==='1')return;
const stats=home.querySelector('.grid.stats');
const progress=[...home.querySelectorAll('.card')].find(x=>x.querySelector('#progressLabel'));
const lessonList=home.querySelector('#lessonList');
const curriculum=home.querySelector('#curriculumMap');
const sourceCard=[...home.querySelectorAll('.card')].find(x=>x.textContent.includes('منبع و نسخه کتاب'));
const challenge=home.querySelector('.achievement');
const lessonHead=lessonList?.previousElementSibling;
const curriculumHead=curriculum?.previousElementSibling;
const resources=document.createElement('details');resources.className='home-v2-resources';
const summary=document.createElement('summary');summary.textContent='فهرست درس‌ها و نقشه کامل کتاب ریاضی ششم';resources.append(summary);
const resourceBody=document.createElement('div');resourceBody.className='home-v2-resource-body';
if(lessonHead)resourceBody.append(lessonHead);if(lessonList)resourceBody.append(lessonList);
if(curriculumHead)resourceBody.append(curriculumHead);if(curriculum)resourceBody.append(curriculum);
if(sourceCard)resourceBody.append(sourceCard);
resources.append(resourceBody);
const shell=document.createElement('div');shell.className='home-v2';
shell.innerHTML='<div class="home-v2-hero"><div class="home-v2-kicker">AMOOZESH BA AMIR · LEARN WITH CONFIDENCE</div><h1>سلام! به دنیای یادگیری خوش آمدی 🌟</h1><p>درس‌ها، کاربرگ‌ها و ابزارهای آموزشی در پوشه‌های مرتب؛ مسیر یادگیری‌ات را با آرامش ادامه بده.</p><div class="home-v2-hero-actions"><button type="button" data-home-action="library">مشاهده همه پوشه‌ها</button><button type="button" class="secondary" data-home-action="english">ورود به انگلیسی</button></div><img src="study-hero.svg" alt="" aria-hidden="true"></div><div class="home-v2-heading"><div><h2>پوشه‌های اصلی</h2><p>هر بخش را جداگانه باز کن.</p></div><span class="tag">۶ دسته‌بندی</span></div><div class="home-v2-folders">'+folders.map(f=>'<button type="button" class="home-v2-folder" data-open-folder="'+f.id+'"><span class="home-v2-folder-icon">'+f.icon+'</span><span><b>'+f.title+'</b><small>'+f.desc+'</small></span><span class="folder-arrow">←</span></button>').join('')+'</div><div class="home-v2-heading"><div><h2>شروع سریع</h2><p>برای ادامه یادگیری، یک گزینه را انتخاب کن.</p></div></div><div class="home-v2-quick"><button data-home-action="math6"><span>📘</span>ادامه درس</button><button data-home-action="quiz"><span>🧠</span>آزمون</button><button data-home-action="games"><span>🎮</span>بازیگاه</button></div><div class="home-v2-heading"><div><h2>وضعیت یادگیری</h2><p>آمار ثبت‌شده روی این دستگاه</p></div></div><div id="homeV2Stats"></div><div id="homeV2Progress"></div><div id="homeV2Challenge"></div>';
home.replaceChildren(shell,resources);
if(stats)shell.querySelector('#homeV2Stats').append(stats);
if(progress)shell.querySelector('#homeV2Progress').append(progress);
if(challenge)shell.querySelector('#homeV2Challenge').append(challenge);
home.dataset.homeV2='1';
}
function addNavShortcut(){
const rail=document.getElementById('appNavInner');if(!rail||rail.querySelector('[data-view="libraryHub"]'))return;
const homeBtn=rail.querySelector('[data-view="home"]');
const b=document.createElement('button');b.type='button';b.dataset.view='libraryHub';b.innerHTML='<span class="ico">🗂️</span>پوشه‌ها';b.addEventListener('click',()=>showView('libraryHub'));
if(homeBtn)homeBtn.after(b);else rail.prepend(b);
}
function init(){
buildLibrary();rebuildHome();addNavShortcut();
document.addEventListener('click',e=>{
const folder=e.target.closest('[data-open-folder]');if(folder){window.openLibraryFolder(folder.dataset.openFolder);return;}
const action=e.target.closest('[data-library-action]');if(action){route(action.dataset.libraryAction);return;}
const homeAction=e.target.closest('[data-home-action]');if(homeAction){if(homeAction.dataset.homeAction==='library')showView('libraryHub');else route(homeAction.dataset.homeAction);return;}
});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();