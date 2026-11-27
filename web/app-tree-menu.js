/* Floating tree navigation for Amoozesh ba Amir */
(()=>{'use strict';
const css=`
#abaTreeFab{position:fixed;right:14px;bottom:78px;z-index:10020;width:54px;height:54px;border:0;border-radius:18px;background:linear-gradient(145deg,#183750,#6256c8);color:#fff;font-size:25px;box-shadow:0 8px 24px #172b5540}
#abaTreeShade{position:fixed;inset:0;background:#10182770;z-index:10021;display:none}
#abaTreePanel{position:fixed;z-index:10022;top:0;bottom:0;right:0;width:min(88vw,370px);background:var(--white,#fff);color:var(--ink,#18313d);box-shadow:-12px 0 36px #10182730;transform:translateX(110%);transition:transform .22s;overflow:auto;padding:18px 15px calc(28px + env(safe-area-inset-bottom))}
#abaTreePanel.open{transform:translateX(0)}#abaTreeShade.open{display:block}
.aba-tree-head{display:flex;align-items:center;justify-content:space-between;padding:8px 4px 16px;border-bottom:1px solid var(--line,#dce6ea);margin-bottom:12px}
.aba-tree-head b{font-size:16px}.aba-tree-close{border:0;border-radius:10px;padding:7px 11px;background:var(--bg,#f3f7f9);color:inherit}
.aba-tree-group{margin:8px 0;border:1px solid var(--line,#dce6ea);border-radius:14px;overflow:hidden}
.aba-tree-group summary{cursor:pointer;list-style:none;padding:12px;font-weight:800;font-size:13px;display:flex;gap:9px;align-items:center}
.aba-tree-group summary::-webkit-details-marker{display:none}.aba-tree-items{padding:0 10px 10px 10px;display:grid;gap:5px}
.aba-tree-item{width:100%;text-align:right;padding:10px 12px;border:0;border-radius:10px;background:var(--bg,#f3f7f9);color:inherit;font-size:12px}
.aba-tree-item:active{background:var(--glow,#e9eaff)}.aba-tree-sub{font-size:10px;color:var(--muted,#647782);font-weight:500;margin-right:auto}
body[data-theme="midnight"] #abaTreePanel{background:#151f33;color:#edf2ff}
body[data-theme="midnight"] .aba-tree-item,body[data-theme="midnight"] .aba-tree-close{background:#202c42;color:#edf2ff}
@media(min-width:700px){#abaTreeFab{right:max(18px,calc((100vw - 980px)/2 + 18px));bottom:86px}}
`;
function add(){if(document.getElementById('abaTreeFab'))return;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
const fab=document.createElement('button');fab.id='abaTreeFab';fab.type='button';fab.title='فهرست همه بخش‌ها';fab.setAttribute('aria-label','باز کردن فهرست درختی');fab.textContent='⋮';
const shade=document.createElement('div');shade.id='abaTreeShade';
const panel=document.createElement('aside');panel.id='abaTreePanel';panel.setAttribute('aria-label','فهرست بخش‌های برنامه');
panel.innerHTML=`
<div class="aba-tree-head"><div><b>فهرست آموزش با امیر</b><div class="small">دسترسی سریع و دسته‌بندی‌شده</div></div><button class="aba-tree-close" type="button">بستن ✕</button></div>
<details class="aba-tree-group" open><summary>📚 پایه‌ها و درس‌های ابتدایی</summary><div class="aba-tree-items">
<button class="aba-tree-item" data-view="gradeFolderView">پوشه پایه‌ها و درس‌ها (اول تا ششم)</button>
<button class="aba-tree-item" data-view="grade6FolderView">ریاضی پایه ششم</button>
<button class="aba-tree-item" data-view="tools">درس‌ها و ابزارهای ریاضی پایه‌های اول تا پنجم</button>
</div></details>
<details class="aba-tree-group"><summary>🇺🇸 زبان انگلیسی</summary><div class="aba-tree-items">
<button class="aba-tree-item" data-view="english" data-tab="dictionary">دیکشنری انگلیسی–فارسی</button>
<button class="aba-tree-item" data-view="english" data-tab="courses">دوره‌ها و مسیرهای آموزشی</button>
<button class="aba-tree-item" data-view="english" data-tab="learning">۵۰۴ واژه و داستان‌های انگلیسی</button>
<button class="aba-tree-item" data-view="english" data-tab="library">کتابخانه PDF شخصی</button>
<button class="aba-tree-item" data-view="english" data-tab="audio">استودیو صوتی و تلفظ</button>
</div></details>
<details class="aba-tree-group"><summary>📝 تمرین، آزمون و فایل‌ها</summary><div class="aba-tree-items">
<button class="aba-tree-item" data-view="library">کتابخانه PDF ریاضی ششم</button>
<button class="aba-tree-item" data-view="worksheets">کاربرگ‌ها و ساخت برگه تمرین</button>
<button class="aba-tree-item" data-view="english" data-tab="learning">کتابخانهٔ داستان‌ها و منابع ابتدایی</button>
<button class="aba-tree-item" data-view="quiz">آزمون و خودآزمایی</button>
<button class="aba-tree-item" data-view="shop">فروشگاه و محصولات آموزشی</button>
<button class="aba-tree-item" data-view="memory">یادداشت‌ها و حافظه یادگیری</button>
</div></details>
<details class="aba-tree-group"><summary>🎮 ابزارهای یادگیری</summary><div class="aba-tree-items">
<button class="aba-tree-item" data-view="tools">بازیگاه و ابزارهای ریاضی</button>
<button class="aba-tree-item" data-view="whiteboard">تخته هوشمند</button>
<button class="aba-tree-item" data-view="tutor">معلم هوشمند</button>
<button class="aba-tree-item" data-view="video">ویدئوهای آموزشی</button>
</div></details>
<details class="aba-tree-group"><summary>👩‍🏫 کلاس و حساب کاربری</summary><div class="aba-tree-items">
<button class="aba-tree-item" data-view="onlineClassroom">کلاس‌های من و ورود آنلاین</button>
<button class="aba-tree-item" data-view="teacher">برنامه‌ریزی و مدیریت کلاس</button>
<button class="aba-tree-item" data-view="groupBoard">تابلوی پیشرفت گروهی A3</button>
<button class="aba-tree-item" data-view="profile">👤 حساب کاربری و اعلان‌ها</button>
<button class="aba-tree-item" data-view="about">درباره برنامه</button>
</div></details>
`;
document.body.append(fab,shade,panel);
const close=()=>{panel.classList.remove('open');shade.classList.remove('open');fab.setAttribute('aria-expanded','false')};
const open=()=>{panel.classList.add('open');shade.classList.add('open');fab.setAttribute('aria-expanded','true')};
fab.setAttribute('aria-expanded','false');fab.addEventListener('click',open);shade.addEventListener('click',close);panel.querySelector('.aba-tree-close').addEventListener('click',close);
panel.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;const view=b.dataset.view;if(typeof window.showView==='function')window.showView(view);if(b.dataset.tab){const tab=panel.querySelector('[data-tab="'+b.dataset.tab+'"]');const target=document.querySelector('.english-tab[data-etab="'+b.dataset.tab+'"]');target?.click()}close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();