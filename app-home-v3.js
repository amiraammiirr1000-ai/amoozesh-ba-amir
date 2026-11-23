/* Home v3 — compact folder-first dashboard */
(()=>{'use strict';
const css=`
.home-v3{display:grid;gap:14px;padding-bottom:8px}
.home-v3-head{padding:20px 18px;border-radius:22px;background:linear-gradient(125deg,#183750,#3d5296);color:#fff;position:relative;overflow:hidden}
.home-v3-head:after{content:"✦";position:absolute;left:16px;top:5px;font-size:78px;color:#ffffff17}
.home-v3-head small{font-size:10px;letter-spacing:1px;color:#ffe29a;font-weight:900}
.home-v3-head h2{font-size:20px;margin:6px 0 3px}
.home-v3-head p{font-size:11px;margin:0;color:#e4edf6}
.home-v3-title{font-size:14px;font-weight:900;margin:3px 2px 0}
.home-v3-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
.home-v3-card{min-height:112px;border:1px solid var(--line);border-radius:19px;background:var(--white);color:var(--ink);padding:14px;text-align:right;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 5px 16px #1837500a}
.home-v3-card:active{transform:scale(.98)}
.home-v3-card .ico{width:43px;height:43px;border-radius:14px;display:grid;place-items:center;font-size:24px;background:var(--tint,#edf1ff)}
.home-v3-card b{font-size:12px;display:block;margin-top:8px}
.home-v3-card small{font-size:10px;color:var(--muted);display:block}
.home-v3-card[data-go="grades"]{--tint:#e9eaff}
.home-v3-card[data-go="worksheets"]{--tint:#fff0dc}
.home-v3-card[data-go="practice"]{--tint:#e2f6ef}
.home-v3-card[data-go="more"]{--tint:#f5eafa}
.home-v3-grade-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.home-v3-grade{padding:17px 12px;border:1px solid var(--line);border-radius:17px;background:var(--white);color:var(--ink);text-align:center;font-weight:900}
.home-v3-grade span{display:block;font-size:26px;margin-bottom:5px}
.home-v3-note{padding:12px;border-radius:14px;background:var(--bg);color:var(--muted);font-size:11px;line-height:1.9}
body[data-theme="midnight"] .home-v3-card,body[data-theme="midnight"] .home-v3-grade{background:#151f33;color:var(--ink)}
@media(min-width:650px){.home-v3-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.home-v3-grade-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;
if(!document.getElementById('homeV3Style')){const st=document.createElement('style');st.id='homeV3Style';st.textContent=css;document.head.append(st)}
function openGrade(n){
 if(n===6){showView('home');setTimeout(()=>{const d=document.querySelector('.home-details');d?.setAttribute('open','');document.getElementById('lessonList')?.scrollIntoView({behavior:'smooth',block:'start'})},100);return}
 showView('tools');if(typeof window.openPrimaryGradesHub==='function'){window.openPrimaryGradesHub();setTimeout(()=>document.querySelector('[data-grade="'+n+'"]')?.click(),80)}
}
window.openGrade=openGrade;
function buildGradeView(){
 const main=document.querySelector('main.content');if(!main||document.getElementById('gradeFolderView'))return;
 const v=document.createElement('section');v.id='gradeFolderView';v.className='view';
 v.innerHTML='<div class="section-head"><h2>پایه‌ها و درس‌ها</h2><button class="btn light" type="button" onclick="showView(\'home\')">بازگشت</button></div><p class="small">ابتدا پایه را انتخاب کن؛ سپس درس‌ها و منابع همان پایه را ببین.</p><div class="home-v3-grade-grid">'+[1,2,3,4,5,6].map(n=>'<button class="home-v3-grade" type="button" data-grade-open="'+n+'"><span>📘</span>پایه '+('۰۱۲۳۴۵۶'[n])+'</button>').join('')+'</div><div class="home-v3-note" style="margin-top:12px">محتوای ریاضی پایه‌های اول تا پنجم در حال حاضر به‌صورت درس‌های مکمل تألیفی ارائه می‌شود؛ پایه ششم مسیر اصلی ریاضی را دارد. سایر درس‌ها و منابع هر پایه به‌تدریج در همین ساختار افزوده می‌شوند.</div>';
 main.append(v);v.addEventListener('click',e=>{const b=e.target.closest('[data-grade-open]');if(b)openGrade(Number(b.dataset.gradeOpen))});
}
function rebuild(){
 const home=document.getElementById('home');if(!home||home.dataset.homeV3==='1')return;
 home.replaceChildren();
 const shell=document.createElement('div');shell.className='home-v3';
 shell.innerHTML='<div class="home-v3-head"><small>AMOOZESH BA AMIR</small><h2>یادگیری، ساده و منظم 🌱</h2><p>برای شروع، پوشه موردنظرت را انتخاب کن.</p></div><div class="home-v3-title">کتابخانه و امکانات</div><div class="home-v3-grid"><button class="home-v3-card" data-go="grades"><span class="ico">📚</span><span><b>پایه‌ها و درس‌ها</b><small>اول تا ششم · انتخاب پایه و درس</small></span></button><button class="home-v3-card" data-go="worksheets"><span class="ico">🗂️</span><span><b>کاربرگ‌ها و فایل‌ها</b><small>تمرین، آزمون و PDF</small></span></button><button class="home-v3-card" data-go="practice"><span class="ico">🎯</span><span><b>تمرین و بازی</b><small>بازیگاه و خودآزمایی</small></span></button><button class="home-v3-card" data-go="more"><span class="ico">🧰</span><span><b>سایر امکانات</b><small>انگلیسی، دیکشنری، کلاس و ابزارها</small></span></button></div><div class="home-v3-note">صفحهٔ اصلی فقط چهار پوشهٔ اصلی را نشان می‌دهد تا خلوت بماند. پایه‌ها و درس‌ها داخل پوشهٔ اول قرار دارند و دیگر به‌صورت فهرست بلند در صفحهٔ خانه نمایش داده نمی‌شوند.</div>';
 home.append(shell);home.dataset.homeV3='1';
 shell.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;const g=b.dataset.go;if(g==='grades')showView('gradeFolderView');if(g==='worksheets')showView('worksheets');if(g==='practice'){if(typeof window.openGameLab==='function')window.openGameLab();else showView('tools')}if(g==='more')showView('libraryHub')});
}
function init(){buildGradeView();rebuild()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
