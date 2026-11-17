/* Universal in-app back navigation for every main view and English sub-tab. */
(()=>{'use strict';
const labels={home:'خانه',lesson:'درس',quiz:'آزمون',video:'ویدئو',tutor:'معلم هوشمند',teacher:'پنل معلم',shop:'فروشگاه',profile:'حساب کاربری',about:'درباره برنامه',tools:'ابزارهای یادگیری',whiteboard:'تخته هوشمند',worksheets:'کاربرگ‌ها',memory:'یادداشت‌ها',english:'آموزش انگلیسی'};
const style=document.createElement('style');
style.textContent='.aba-global-backbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 14px;padding:8px 2px;border-bottom:1px solid var(--line);min-height:46px}.aba-global-backbar[hidden]{display:none}.aba-global-back{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid var(--line);border-radius:13px;background:var(--white);color:var(--ink);font-weight:800;font-size:12px;box-shadow:0 4px 12px #173c4c0b}.aba-global-back:first-letter{font-size:22px}.aba-back-context{font-size:11px;color:var(--muted);font-weight:800}body[data-theme="midnight"] .aba-global-back{background:#202c42;color:var(--ink)}@media(max-width:390px){.aba-global-backbar{margin-bottom:10px}.aba-global-back{padding:7px 10px}}';
document.head.appendChild(style);
const tabLabels={dictionary:'دیکشنری',courses:'دوره‌ها',library:'کتابخانه',audio:'استودیو صوتی',learning:'۵۰۴ و داستان‌ها'};
const original=window.showView;
if(typeof original!=='function')return;
let current=document.querySelector('.view.active')?.id||'home';
let stack=[current],tabStack=[],replaying=false;
try{history.replaceState({abaAppRoot:true,abaView:current},'',location.href)}catch(e){}
function ensureBar(id){
 const view=document.getElementById(id);if(!view)return;
 let bar=view.querySelector(':scope > .aba-global-backbar');
 if(!bar){bar=document.createElement('div');bar.className='aba-global-backbar';view.prepend(bar)}
 const canTabBack=id==='english'&&tabStack.length>0;
 const previous=stack.length>1?stack[stack.length-2]:'home';
 const label=canTabBack?'بازگشت به '+(tabLabels[tabStack[tabStack.length-1]]||'دیکشنری'):(previous==='home'?'بازگشت به خانه':'بازگشت به '+(labels[previous]||'صفحه قبل'));
 bar.innerHTML='<button type="button" class="aba-global-back" aria-label="بازگشت">‹ <span>'+label+'</span></button><span class="aba-back-context">'+(labels[id]||'')+'</span>';
 bar.hidden=id==='home'&&!canTabBack;
}
function updateAll(){document.querySelectorAll('.view').forEach(v=>ensureBar(v.id))}
function goBack(){
 if(current==='english'&&tabStack.length){
  const target=tabStack.pop();const tab=document.querySelector('.english-tab[data-etab="'+target+'"]');
  if(tab){replaying=true;tab.click();replaying=false;ensureBar('english');return}
 }
 if(stack.length>1){history.back();return}
 if(current!=='home'){current='home';stack=['home'];original('home');ensureBar('home')}
}
window.showView=function(id){
 if(!document.getElementById(id)){return original(id)}
 if(id!==current){
  stack.push(id);current=id;
  try{history.pushState({abaAppView:true,abaView:id},'',location.href)}catch(e){}
 }
 const result=original(id);updateAll();return result;
};
document.addEventListener('click',e=>{
 const back=e.target.closest('.aba-global-back');if(back){goBack();return}
},true);
document.addEventListener('click',e=>{
 const tab=e.target.closest('.english-tab[data-etab]');
 if(!tab||replaying)return;
 const active=document.querySelector('.english-tab.active[data-etab]');
 if(active&&active!==tab)tabStack.push(active.dataset.etab);
 queueMicrotask(()=>ensureBar('english'));
},true);
window.addEventListener('popstate',()=>{
 if(stack.length>1)stack.pop();
 current=stack[stack.length-1]||'home';
 original(current);updateAll();
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',updateAll,{once:true});else updateAll();
})();