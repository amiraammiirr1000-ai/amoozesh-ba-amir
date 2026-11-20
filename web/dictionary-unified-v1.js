/* Unified English-Persian dictionary: Openjam API + persistent offline cache + complete 504 course. */
(()=>{'use strict';
const API='https://openjam.amirj4m.com/v1';
const DB='ABA-English-Dictionary-v2', STORE='words', META='meta';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let bookWords=[],lastQuery='',requestNo=0,searchTimer=0,dbPromise=null,activeDetail=null;
const favKey='abaDictionaryFavoritesV2';
const favorites=()=>{try{return JSON.parse(localStorage.getItem(favKey)||'[]')}catch(e){return []}};
const saveFavorites=a=>{try{localStorage.setItem(favKey,JSON.stringify(a))}catch(e){}};
function openDB(){
 if(dbPromise)return dbPromise;
 dbPromise=new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{
   const d=req.result;
   if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:'english'});
   if(!d.objectStoreNames.contains(META))d.createObjectStore(META,{keyPath:'key'});
  };
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });
 return dbPromise;
}
async function dbPut(record){
 const d=await openDB();
 return new Promise((resolve,reject)=>{
  const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put(record);
  tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);
 });
}
async function dbGet(word){
 const d=await openDB();
 return new Promise((resolve,reject)=>{
  const req=d.transaction(STORE).objectStore(STORE).get(String(word||'').toLowerCase());
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
 });
}
async function dbAll(){
 const d=await openDB();
 return new Promise((resolve,reject)=>{
  const req=d.transaction(STORE).objectStore(STORE).getAll();
  req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
 });
}
async function metaGet(key){
 const d=await openDB();
 return new Promise(resolve=>{const req=d.transaction(META).objectStore(META).get(key);req.onsuccess=()=>resolve(req.result?.value);req.onerror=()=>resolve(null)});
}
async function metaSet(key,value){
 const d=await openDB();
 return new Promise(resolve=>{const tx=d.transaction(META,'readwrite');tx.objectStore(META).put({key,value});tx.oncomplete=()=>resolve();tx.onerror=()=>resolve()});
}
function localCore(){
 const rows=Array.isArray(window.ABA_HYBRID_LOCAL_WORDS)?window.ABA_HYBRID_LOCAL_WORDS:[];
 return rows.map(w=>({english:String(w[0]).toLowerCase(),localMeaning:w[1]||'',localExample:w[2]||'',source:'offline-core'}));
}
async function seedOffline(){
 try{
  const response=await fetch('./504-essential-words.json',{cache:'force-cache'});
  if(!response.ok)throw new Error('504 list not available');
  const data=await response.json();bookWords=Array.isArray(data.words)?data.words:[];
  for(const w of bookWords){
   const old=await dbGet(w.english);
   if(!old)await dbPut({english:w.english.toLowerCase(),group:w.group,order:w.order,source:'Openjam 504 word list',senses:[],phonetics:[]});
   else if(!old.group)await dbPut({...old,group:w.group,order:w.order});
  }
  for(const w of localCore()){
   const old=await dbGet(w.english);
   if(!old)await dbPut(w);
   else if(!old.localMeaning&&w.localMeaning)await dbPut({...old,localMeaning:w.localMeaning,localExample:w.localExample});
  }
  return true;
 }catch(e){console.warn('Dictionary offline seed:',e);return false}
}
function normalizeBookEntry(w){
 const senses=(w.translations||[]).map(t=>({
  part_of_speech:t.part_of_speech||'',
  definition_en:t.definition_en||'',
  example_en:t.example_en||'',
  translations:[{language_code:'fa',meaning:t.meaning||'',example:t.example||''}]
 }));
 return {english:String(w.english||'').toLowerCase(),group:w.group||'',order:w.sort_order||w.order||0,level:w.level||'',senses,phonetics:w.phonetics||[],source:'Openjam 504 Essential',in_openjam:w.in_openjam!==false};
}
function setStatus(msg){const c=$('dictionaryCount');if(c)c.textContent=msg}
async function sync504(showMessage=true){
 if(!navigator.onLine){if(showMessage)setStatus('آفلاین · واژه‌های ذخیره‌شده آماده‌اند');return false}
 try{
  if(showMessage)setStatus('در حال دریافت بانک کامل ۵۰۴ واژه…');
  let count=0;
  for(const offset of [0,500]){
   const r=await fetch(API+'/books/504-essential/words?lang=fa&limit=500&offset='+offset,{headers:{Accept:'application/json'}});
   if(!r.ok)throw new Error('Openjam '+r.status);
   const payload=await r.json(),rows=Array.isArray(payload.data)?payload.data:[];
   for(const row of rows){await dbPut(normalizeBookEntry(row));count++}
  }
  await metaSet('504-last-sync',Date.now());
  if(showMessage)setStatus('۵۰۴ واژه با معنی فارسی در حافظه آفلاین ذخیره شد · '+count+' مدخل');
  render504Course();
  return count>0;
 }catch(e){
  console.warn('504 sync failed:',e);
  if(showMessage)setStatus('دریافت آنلاین انجام نشد؛ بانک واژگان داخلی همچنان فعال است. بعداً دوباره تلاش کن.');
  return false;
 }
}
function getPersianMeanings(w){
 const out=[];
 (w?.senses||[]).forEach(s=>(s.translations||[]).forEach(t=>{if(t.language_code==='fa'&&t.meaning)out.push(t.meaning)}));
 if(w?.localMeaning)out.push(w.localMeaning);
 return [...new Set(out)];
}
function resultRow(w,matched){
 const word=String(w.english||w.word||'').toLowerCase(),meanings=getPersianMeanings(w);
 const extra=matched||w.matched_meaning||'';
 return '<button type="button" class="eng-dict-entry aba-dict-v2-result" data-word="'+esc(word)+'" style="width:100%;text-align:right;color:inherit"><div class="eng-dict-main"><b dir="ltr">'+esc(word)+'</b><span>'+esc(meanings.slice(0,3).join('، ')||extra||'برای مشاهده معنی، واژه را انتخاب کن')+'</span><small>'+esc(w.level||w.group||'')+'</small></div><div class="eng-dict-actions"><span>'+ (favorites().includes(word)?'★':'›')+'</span></div></button>';
}
function renderRows(rows,label){
 const box=$('dictionaryResults');if(!box)return;
 const unique=[],seen=new Set();
 rows.forEach(w=>{const k=String(w.english||w.word||'').toLowerCase();if(k&&!seen.has(k)){seen.add(k);unique.push(w)}});
 box.innerHTML=unique.length?unique.slice(0,70).map(w=>resultRow(w,w.matched_meaning)).join(''):'<div class="mutedbox">واژه‌ای پیدا نشد. املای دیگری را امتحان کن یا جست‌وجوی آنلاین را بررسی کن.</div>';
 setStatus((unique.length)+' نتیجه'+(label?' · '+label:''));
}
function showEmpty(){
 const box=$('dictionaryResults');if(!box)return;
 box.innerHTML='<div class="mutedbox">فرهنگ لغت ترکیبی آموزش با امیر آماده است. واژه انگلیسی یا معنی فارسی را جست‌وجو کن. برای استفاده آفلاین، بانک ۵۰۴ واژه را یک‌بار دریافت کن.</div>';
}
async function search(q='',skipOnline=false){
 const query=String(q||'').trim();lastQuery=query;const my=++requestNo;
 if(!query){
  const all=await dbAll();
  const ordered=[...all.filter(w=>w.source==='offline-core'),...all.filter(w=>w.group)];
  renderRows(ordered.slice(0,55),'آفلاین');
  return;
 }
 const normalized=query.toLocaleLowerCase();
 const all=await dbAll();
 const local=all.filter(w=>{
  const hay=[w.english,w.localMeaning,w.localExample,...getPersianMeanings(w)].join(' ').toLocaleLowerCase();
  return hay.includes(normalized);
 }).sort((a,b)=>(a.english||'').localeCompare(b.english||''));
 renderRows(local,'نتایج ذخیره‌شده');
 if(skipOnline||!navigator.onLine||query.length<2)return;
 clearTimeout(searchTimer);
 const token=my;
 searchTimer=setTimeout(async()=>{
  try{
   const from=/[\u0600-\u06FF]/.test(query)?'fa':'en';
   const url=API+'/search?q='+encodeURIComponent(query)+'&from='+from+'&mode=contains&limit=35';
   const r=await fetch(url,{headers:{Accept:'application/json'}});
   if(!r.ok)throw new Error('Search HTTP '+r.status);
   const payload=await r.json();if(token!==requestNo)return;
   const remote=Array.isArray(payload.results)?payload.results:[];
   const merged=[...remote,...local];
   renderRows(merged,from==='fa'?'آنلاین + آفلاین · فارسی به انگلیسی':'آنلاین + آفلاین');
  }catch(e){
   if(token===requestNo&&local.length===0)renderRows([],'اتصال آنلاین در دسترس نیست');
  }
 },280);
}
async function fetchWord(word){
 const key=String(word||'').trim().toLowerCase();if(!key)return null;
 const cached=await dbGet(key);
 if(cached&&(cached.senses?.length||cached.localMeaning))return cached;
 if(!navigator.onLine)return cached;
 try{
  const r=await fetch(API+'/words/'+encodeURIComponent(key),{headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error('Word HTTP '+r.status);
  const data=await r.json();await dbPut({...data,english:String(data.english||key).toLowerCase(),source:'Openjam dictionary'});
  return data;
 }catch(e){console.warn('Word detail failed:',e);return cached}
}
function renderDetail(w,queried){
 const box=$('dictionaryResults');if(!box)return;
 const senses=w?.senses||[],phon=(w?.phonetics||[]).find(p=>p.variant==='us')||(w?.phonetics||[])[0]||{};
 const meanings=getPersianMeanings(w);
 const senseHtml=senses.map((s,i)=>{
  const fa=(s.translations||[]).filter(t=>t.language_code==='fa').map(t=>t.meaning).filter(Boolean).join('، ');
  return '<section style="border-top:1px solid var(--line);padding-top:10px;margin-top:10px"><b>'+esc(s.part_of_speech||('معنی '+(i+1)))+'</b><p>'+esc(fa||'ترجمه فارسی ثبت نشده')+'</p>'+(s.definition_en?'<p dir="ltr">'+esc(s.definition_en)+'</p>':'')+(s.example_en?'<p dir="ltr" class="small">'+esc(s.example_en)+'</p>':'')+'</section>';
 }).join('');
 const localHtml=w?.localMeaning?'<section><b>معنی آفلاین</b><p>'+esc(w.localMeaning)+'</p><p dir="ltr" class="small">'+esc(w.localExample||'')+'</p></section>':'';
 const offlineMsg=(!senses.length&&!w?.localMeaning)?'<div class="mutedbox">این واژه در فهرست آفلاین موجود است، اما معنی آن هنوز ذخیره نشده. برای دریافت معنی به اینترنت وصل شو و «تلاش دوباره» را بزن.</div>':'';
 const f=favorites(),isFav=f.includes(String(w?.english||queried).toLowerCase());
 box.innerHTML='<article class="eng-dict-entry" style="display:block"><button type="button" class="english-chip" id="abaDictV2Back">← بازگشت به نتایج</button><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px"><div><h2 dir="ltr" style="margin:0">'+esc(w?.english||queried)+'</h2><small>'+esc(w?.level||'')+' '+(w?.resolved_from?'· شکل صرفی':'')+'</small></div><span class="english-icon">Aa</span></div>'+(phon.ipa?'<p dir="ltr" class="small">IPA: '+esc(phon.ipa)+'</p>':'')+(phon.audio_url?'<button class="english-chip" id="abaDictV2Audio">🔊 تلفظ آمریکایی</button>':'')+senseHtml+localHtml+offlineMsg+'<div class="btnrow" style="margin-top:12px"><button class="english-chip" id="abaDictV2Fav">'+(isFav?'★ حذف از نشان‌شده‌ها':'☆ افزودن به نشان‌شده‌ها')+'</button><button class="english-chip" id="abaDictV2Retry">↻ تلاش دوباره</button></div><p class="small">منبع واژگان: Openjam · مجوز MIT · ترجمه‌ها برای یادگیری‌اند و ممکن است به بازبینی انسانی نیاز داشته باشند.</p></article>';
 $('abaDictV2Back').onclick=()=>search(lastQuery,true);
 $('abaDictV2Fav').onclick=()=>{const word=String(w?.english||queried).toLowerCase(),a=favorites();saveFavorites(a.includes(word)?a.filter(x=>x!==word):[...a,word]);renderDetail(w,queried)};
 $('abaDictV2Retry').onclick=async()=>{const fresh=await forceFetchWord(queried);renderDetail(fresh||w,queried)};
 $('abaDictV2Audio')?.addEventListener('click',()=>{const audio=new Audio(phon.audio_url);audio.play().catch(()=>setStatus('پخش تلفظ در این دستگاه ممکن نشد.'))});
}
async function forceFetchWord(word){
 try{const r=await fetch(API+'/words/'+encodeURIComponent(String(word).toLowerCase()),{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);const d=await r.json();await dbPut({...d,english:String(d.english||word).toLowerCase(),source:'Openjam dictionary'});return d}catch(e){return null}
}
async function openDetail(word){
 const box=$('dictionaryResults');if(!box)return;
 box.innerHTML='<div class="mutedbox">در حال دریافت معنی و مثال…</div>';
 const data=await fetchWord(word);
 if(data){renderDetail(data,word);return}
 renderDetail({english:word,senses:[]},word);
}
function initSyncButton(){
 const tools=document.querySelector('#english-pane-dictionary .english-tools');
 if(tools&&!$('abaDictSync504')){
  const b=document.createElement('button');b.type='button';b.id='abaDictSync504';b.className='english-chip';b.textContent='⬇ ذخیره ۵۰۴ واژه برای آفلاین';
  b.addEventListener('click',()=>sync504(true));tools.appendChild(b);
 }
 const oldStart=$('aba504Start');
 if(oldStart){
  const card=oldStart.parentElement;
  card.innerHTML='<div><small>504 ESSENTIAL · ۴۲ درس</small><b>دوره کامل ۵۰۴ واژه</b><span>فهرست کامل ۵۰۴ واژه، معنی‌های فارسی و مثال‌ها با دریافت بانک آفلاین</span></div><button type="button" class="btn gold" id="aba504SyncCourse">دریافت بانک واژگان</button>';
  $('aba504SyncCourse').addEventListener('click',()=>sync504(true));
 }
}
function render504Course(){
 const root=$('aba504Words');if(!root||!bookWords.length)return;
 const byGroup={};
 bookWords.forEach(w=>{(byGroup[w.group]||(byGroup[w.group]=[])).push(w)});
 const groups=Object.keys(byGroup).sort((a,b)=>Number(a.split('-')[1])-Number(b.split('-')[1]));
 root.innerHTML='<div class="mutedbox" style="margin:10px 0">۵۰۴ واژه در ۴۲ درس · لمس هر واژه، معنی و مثال را در دیکشنری باز می‌کند. پس از دریافت بانک، درس‌ها بدون اینترنت هم قابل استفاده‌اند.</div>'+groups.map(group=>{
  const words=byGroup[group].sort((a,b)=>a.order-b.order),n=Number(group.split('-')[1]);
  return '<details class="eng-unit-card" style="display:block;margin:9px 0"><summary style="cursor:pointer;font-weight:800">درس '+String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)])+' <span class="small">· ۱۲ واژه</span></summary><div class="eng-word-grid" style="margin-top:10px">'+words.map(w=>'<button type="button" class="eng-word-card aba-504-open" data-word="'+esc(w.english)+'"><b dir="ltr">'+esc(w.english)+'</b><small>'+esc(w.order)+'/12</small></button>').join('')+'</div></details>';
 }).join('')+'<p class="small">منبع فهرست ۵۰۴: <a href="https://github.com/amirj4m/openjam" target="_blank" rel="noopener">پروژه Openjam</a> با مجوز MIT. این فهرست، بازنشر صفحات یا متن کتاب تجاری نیست.</p>';
}
function switchToDictionary(word){
 const view=$('english');if(!view)return;
 if(typeof window.showView==='function')window.showView('english');
 const tab=document.querySelector('.english-tab[data-etab="dictionary"]');if(tab&&!tab.classList.contains('active'))tab.click();
 const input=$('dictionarySearch');if(input)input.value=word;
 openDetail(word);
}
document.addEventListener('click',e=>{
 const row=e.target.closest('.aba-dict-v2-result');if(row){openDetail(row.dataset.word);return}
 const word=e.target.closest('.aba-504-open');if(word){switchToDictionary(word.dataset.word);return}
});
window.searchEnglishDictionary=search;
window.showFavoriteWords=async()=>{
 const f=favorites(),all=await dbAll(),rows=all.filter(w=>f.includes(w.english));
 renderRows(rows,'واژه‌های نشان‌شده');
};
async function start(){
 await seedOffline();
 initSyncButton();
 render504Course();
 const input=$('dictionarySearch');
 if(input&&!input.value)await search('');
 const synced=await metaGet('504-last-sync');
 if(navigator.onLine&&(!synced||Date.now()-synced>7*24*60*60*1000))sync504(false).then(ok=>{if(ok){initSyncButton();setStatus('بانک ۵۰۴ واژه به‌روز و آفلاین ذخیره شد')}})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('online',()=>{if(!bookWords.length)seedOffline().then(()=>sync504(true))});
})();