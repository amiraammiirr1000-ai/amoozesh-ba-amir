/* Openjam English–Persian dictionary integration. Dataset/API: MIT licensed Openjam. */
(()=>{'use strict';
const API='https://openjam.amirj4m.com/v1';
const cacheKey='amirOpenjamWordCacheV1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const readCache=()=>{try{return JSON.parse(localStorage.getItem(cacheKey)||'{}')}catch{return {}}};
const saveCache=(k,v)=>{const c=readCache();c[k]=v;const keys=Object.keys(c);while(keys.length>120)delete c[keys.shift()];try{localStorage.setItem(cacheKey,JSON.stringify(c))}catch{}};
let timer=0,seq=0;
function status(msg){let el=document.getElementById('openjamStatus');if(!el){const box=document.getElementById('dictionaryResults');if(!box)return;el=document.createElement('div');el.id='openjamStatus';el.className='small';el.style.margin='8px 0';box.before(el)}el.textContent=msg}
function resultBox(){return document.getElementById('dictionaryResults')}
function renderRows(rows){
 const box=resultBox();if(!box)return;
 box.innerHTML=rows.map(w=>{const word=w.english||w.word||w.term||'';const meanings=(w.translations||[]).map(t=>t.meaning).filter(Boolean);return '<button type="button" class="eng-dict-entry openjam-word" data-word="'+esc(word)+'" style="width:100%;text-align:right;background:transparent;color:inherit;border:0;cursor:pointer"><div class="eng-dict-main"><b dir="ltr">'+esc(word)+'</b><span>'+esc(meanings.slice(0,3).join('، ')||w.level||'برای مشاهده معنی بزنید')+'</span><small>'+esc(w.level||'')+'</small></div><div class="eng-dict-actions">›</div></button>'}).join('')||'<p class="mutedbox">واژه‌ای پیدا نشد. املای دیگری را امتحان کن.</p>';
}
function renderDetail(d,queried){
 const box=resultBox();if(!box)return;
 const senses=d.senses||[],phon=(d.phonetics||[]).find(p=>p.variant==='us')||(d.phonetics||[])[0]||{};
 box.innerHTML='<article class="eng-dict-entry" style="display:block"><button type="button" class="english-chip" id="openjamBack">← بازگشت به نتایج</button><div class="eng-dict-main" style="margin-top:12px"><b dir="ltr" style="font-size:23px">'+esc(d.english||queried)+'</b><span dir="ltr">'+esc(phon.ipa||'')+'</span><small>سطح '+esc(d.level||'نامشخص')+(d.resolved_from?' · شکل صرفی: '+esc(queried):'')+'</small></div>'+(phon.audio_url?'<button type="button" class="english-chip" id="openjamAudio">🔊 تلفظ آمریکایی</button>':'')+senses.map((s,i)=>'<section style="border-top:1px solid var(--line);margin-top:10px;padding-top:10px"><b>'+esc(s.part_of_speech||'معنی '+(i+1))+'</b><p>'+esc((s.translations||[]).filter(t=>t.language_code==='fa').map(t=>t.meaning).join('، ')||'ترجمه فارسی ثبت نشده')+'</p><small dir="ltr">'+esc(s.definition_en||'')+'</small>'+(s.example_en?'<p dir="ltr" style="margin:6px 0">'+esc(s.example_en)+'</p>':'')+((s.translations||[]).find(t=>t.language_code==='fa'&&t.example)?.example?'<small>'+esc((s.translations||[]).find(t=>t.language_code==='fa').example)+'</small>':'')+'</section>').join('')+'</article>';
 document.getElementById('openjamBack')?.addEventListener('click',()=>window.searchEnglishDictionary(document.getElementById('dictionarySearch')?.value||''));
 document.getElementById('openjamAudio')?.addEventListener('click',()=>{const a=new Audio(phon.audio_url);a.play().catch(()=>status('پخش صدا در این دستگاه ممکن نشد.'))});
}
async function search(q=''){
 const box=resultBox();if(!box)return;
 const query=String(q||'').trim();const my=++seq;
 if(!query){status('فرهنگ لغت آنلاین انگلیسی–فارسی؛ برای جست‌وجو، واژه انگلیسی یا معنی فارسی را بنویس.');box.innerHTML='<div class="mutedbox">جست‌وجوی انگلیسی به فارسی و فارسی به انگلیسی · معنی‌های چندگانه · تلفظ آمریکایی · مثال و سطح CEFR</div>';const c=document.getElementById('dictionaryCount');if(c)c.textContent='فرهنگ لغت آنلاین';return}
 status('در حال جست‌وجو در فرهنگ لغت جامع…');
 try{
  const from=/[\u0600-\u06FF]/.test(query)?'fa':'en';
  const url=API+'/search?q='+encodeURIComponent(query)+'&from='+from+'&mode=contains&limit=30';
  const r=await fetch(url,{headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const data=await r.json();if(my!==seq)return;
  const rows=data.results||data.words||data.items||data;
  if(!Array.isArray(rows))throw new Error('پاسخ فرهنگ لغت قابل‌خواندن نیست');
  renderRows(rows);status('نتایج فرهنگ لغت Openjam · برای دیدن معنی‌ها یک واژه را انتخاب کن.');
  const c=document.getElementById('dictionaryCount');if(c)c.textContent=rows.length+' نتیجه';
 }catch(e){
  if(my!==seq)return;
  status('اتصال به فرهنگ لغت آنلاین برقرار نشد؛ اتصال اینترنت را بررسی کن. واژه‌های ذخیره‌شده همچنان در دسترس‌اند.');
  if(typeof window.__legacyEnglishDictionary==='function')window.__legacyEnglishDictionary(query);
 }
}
async function detail(word){
 const box=resultBox();if(!box)return;const cached=readCache()[word];
 if(cached){renderDetail(cached,word);return}
 status('در حال دریافت معنی، مثال و تلفظ…');
 try{const r=await fetch(API+'/words/'+encodeURIComponent(word),{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);const d=await r.json();saveCache(word,d);renderDetail(d,word);status('اطلاعات واژه از فرهنگ لغت Openjam دریافت شد.')}
 catch(e){status('جزئیات این واژه دریافت نشد؛ لطفاً دوباره تلاش کن.')}
}
const old=window.searchEnglishDictionary;
window.__legacyEnglishDictionary=old;
window.searchEnglishDictionary=search;
window.showFavoriteWords=function(){const fav=(()=>{try{return JSON.parse(localStorage.getItem('amirEnglishFavoritesV2')||'[]')}catch{return []}})();if(!fav.length){status('هنوز واژه‌ای نشان‌دار نکرده‌ای.');return}renderRows(fav.map(english=>({english,translations:[]})));status('واژه‌های نشان‌دارشده روی دستگاه شما.')};
document.addEventListener('click',e=>{const b=e.target.closest('.openjam-word');if(b)detail(b.dataset.word)});
const input=document.getElementById('dictionarySearch');if(input)search('')
})();
