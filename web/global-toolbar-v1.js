/* Shared top navigation: search icon + three-dot section menu. */
(()=>{'use strict';
function init(){
 const header=document.querySelector('header.top');
 if(!header||document.getElementById('abaGlobalToolbar'))return;
 const bar=document.createElement('div');bar.id='abaGlobalToolbar';bar.className='aba-global-toolbar';
 bar.innerHTML='<div class="aba-toolbar-inner"><div class="aba-toolbar-brand"><img src="icon.svg" alt="" width="27" height="27"><b>آموزش با امیر</b></div><div class="aba-toolbar-actions"><button id="abaSearchToggle" class="aba-toolbar-icon" type="button" aria-label="جستجو" aria-expanded="false" title="جستجو"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg></button><button id="abaOptionsToggle" class="aba-toolbar-icon" type="button" aria-label="گزینه‌ها" aria-expanded="false" title="گزینه‌ها">⋮</button></div></div><div id="abaToolbarSearchHost" class="aba-toolbar-search-host" hidden></div>';
 header.insertAdjacentElement('afterend',bar);
 const search=document.getElementById('globalSearch'),host=document.getElementById('abaToolbarSearchHost');
 if(search){host.append(search);search.classList.add('aba-search-panel');search.hidden=true;}
 const searchBtn=document.getElementById('abaSearchToggle'),menuBtn=document.getElementById('abaOptionsToggle');
 const treeFab=document.getElementById('abaTreeFab');
 if(treeFab){treeFab.style.display='none';treeFab.setAttribute('aria-hidden','true');treeFab.tabIndex=-1;}
 const setSearch=open=>{host.hidden=!open;if(search)search.hidden=!open;searchBtn.setAttribute('aria-expanded',String(open));if(open){document.getElementById('appSearchInput')?.focus();closeTree();}};
 const closeTree=()=>{const shade=document.getElementById('abaTreeShade');if(shade?.classList.contains('open'))shade.click();menuBtn.setAttribute('aria-expanded','false');};
 searchBtn.addEventListener('click',()=>setSearch(host.hidden));
 menuBtn.addEventListener('click',()=>{
  setSearch(false);
  const panel=document.getElementById('abaTreePanel');
  if(panel?.classList.contains('open'))closeTree();
  else if(treeFab){treeFab.click();menuBtn.setAttribute('aria-expanded','true');}
  else menuBtn.setAttribute('aria-expanded','false');
 });
 document.getElementById('abaTreeShade')?.addEventListener('click',()=>menuBtn.setAttribute('aria-expanded','false'));
 document.getElementById('abaTreePanel')?.addEventListener('click',e=>{if(e.target.closest('[data-view]'))menuBtn.setAttribute('aria-expanded','false');});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){setSearch(false);closeTree();}
  if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement?.tagName||'')){e.preventDefault();setSearch(true);}
 });
 document.addEventListener('click',e=>{
  if(!bar.contains(e.target)&&!document.getElementById('abaTreePanel')?.contains(e.target)&&!document.getElementById('abaTreeShade')?.classList.contains('open'))setSearch(false);
 });
 const style=document.createElement('style');style.id='abaGlobalToolbarStyle';style.textContent=`
 #abaGlobalToolbar{position:sticky;top:0;z-index:10030;background:rgba(255,255,255,.97);border-bottom:1px solid #dce6ea;box-shadow:0 5px 18px #1837500b;backdrop-filter:blur(14px);padding:7px 14px;direction:rtl}
 .aba-toolbar-inner{max-width:980px;margin:auto;min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:12px}
 .aba-toolbar-brand{display:flex;align-items:center;gap:8px;color:#183750;font-size:12px;font-weight:900}.aba-toolbar-brand img{border-radius:8px}
 .aba-toolbar-actions{display:flex;align-items:center;gap:8px}
 .aba-toolbar-icon{width:42px;height:40px;border:1px solid #e1e8ed;border-radius:13px;background:#f7fafc;color:#183750;display:grid;place-items:center;font-size:25px;font-weight:900;line-height:1}
 .aba-toolbar-icon:active{transform:scale(.96);background:#edf3f7}
 .aba-toolbar-icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
 .aba-toolbar-search-host{max-width:980px;margin:0 auto;padding:7px 0 9px}.aba-toolbar-search-host[hidden]{display:none!important}
 #globalSearch.aba-search-panel{display:block;margin:0;padding:12px;border:1px solid #e2eaf0;border-radius:15px;background:#f8fbfd}
 #globalSearch.aba-search-panel[hidden]{display:none!important}
 #globalSearch.aba-search-panel>label{display:block;font-size:11px;font-weight:800;margin-bottom:6px;color:#36556a}
 #globalSearch .global-search-row{display:flex;align-items:center;gap:7px}#globalSearch .global-search-row>span{display:none}
 #globalSearch #appSearchInput{min-width:0;flex:1;margin:0}#globalSearch .global-search-row .btn{white-space:nowrap;padding:8px 10px}
 #globalSearch .global-search-results{max-height:42vh;overflow:auto;margin-top:8px}
 #abaTreeFab{display:none!important}
 body[data-theme="midnight"] #abaGlobalToolbar{background:rgba(21,31,51,.97);border-color:#34425c}
 body[data-theme="midnight"] .aba-toolbar-brand{color:#edf2ff}body[data-theme="midnight"] .aba-toolbar-icon{background:#202c42;border-color:#34425c;color:#edf2ff}
 @media(min-width:700px){#abaGlobalToolbar{padding-left:max(14px,calc((100vw - 980px)/2));padding-right:max(14px,calc((100vw - 980px)/2))}}
 `;
 document.head.append(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();