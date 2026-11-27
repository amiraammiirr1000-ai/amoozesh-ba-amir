/* Video library: safe YouTube/Vimeo embeds, direct HTTPS media and temporary local playback. */
(()=>{'use strict';
const KEY='amirVideoLibraryV1',fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=[],objectUrl=null;
const $=id=>document.getElementById(id);
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(v=>v&&typeof v.title==='string'&&typeof v.url==='string'):[]}catch{return[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch{return false}}
function parseUrl(raw){
 let u;try{u=new URL(raw)}catch{return null}
 if(u.protocol!=='https:')return null;
 let m=u.hostname.replace(/^www\./,'').match(/^(?:youtube\.com|m\.youtube\.com)$/)&&u.pathname==='/watch'?u.searchParams.get('v')?.match(/^[A-Za-z0-9_-]{11}$/):null;
 if(!m){const y=u.hostname.replace(/^www\./,'');if(y==='youtu.be')m=u.pathname.slice(1).match(/^[A-Za-z0-9_-]{11}$/);else if(y==='youtube.com'||y==='m.youtube.com')m=u.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})/);}
 if(m)return {kind:'youtube',id:Array.isArray(m)?m[0]:m[0]};
 const host=u.hostname.replace(/^www\./,'');
 if(host==='vimeo.com'||host==='player.vimeo.com'){const v=u.pathname.match(/\/(?:video\/)?(\d+)/);if(v)return{kind:'vimeo',id:v[1]};}
 if(/\.(mp4|webm|ogg)$/i.test(u.pathname))return{kind:'file',url:u.href};
 return null;
}
function mount(){
 const view=$('video');if(!view||view.dataset.videoLibrary==='1')return;
 view.dataset.videoLibrary='1';
 view.innerHTML='<div class="section-head"><div><h2>🎬 کتابخانه ویدئوهای آموزشی</h2><p class="small">ویدئوهای مجاز خودت را اضافه کن و برای هر پایه دسته‌بندی کن.</p></div><span class="tag">پخش امن</span></div><div class="card video-player-card"><div id="abaVideoPlayer" class="aba-video-player"><div class="mutedbox">برای شروع، یک ویدئو از فهرست انتخاب کن یا لینک مجاز اضافه کن.</div></div><div id="abaVideoNow" class="small" style="margin-top:8px">هنوز ویدئویی انتخاب نشده است.</div></div><div class="card"><h3>افزودن ویدئو به کتابخانه</h3><label class="small" for="abaVideoTitle">عنوان ویدئو</label><input id="abaVideoTitle" class="input" placeholder="مثلاً آموزش جمع کسرها"><div class="grid" style="margin-top:8px"><div><label class="small" for="abaVideoGrade">پایه</label><select id="abaVideoGrade" class="input"><option value="all">همه پایه‌ها</option><option>اول</option><option>دوم</option><option>سوم</option><option>چهارم</option><option>پنجم</option><option>ششم</option></select></div><div><label class="small" for="abaVideoSubject">موضوع</label><select id="abaVideoSubject" class="input"><option>ریاضی</option><option>فارسی</option><option>علوم</option><option>مطالعات اجتماعی</option><option>زبان انگلیسی</option><option>مهارت‌های معلم</option><option>سایر</option></select></div></div><label class="small" for="abaVideoUrl" style="display:block;margin-top:8px">پیوند امن YouTube، Vimeo یا فایل ویدئویی HTTPS</label><input id="abaVideoUrl" class="input" type="url" inputmode="url" placeholder="https://..." style="direction:ltr"><div class="btnrow" style="margin-top:10px"><button id="abaVideoAdd" class="btn gold" type="button">افزودن به کتابخانه</button><label class="btn outline" for="abaVideoLocal">پخش فایل از گوشی</label><input id="abaVideoLocal" type="file" accept="video/mp4,video/webm,video/ogg" hidden></div><p id="abaVideoMsg" class="small" role="status" aria-live="polite" style="margin-top:8px">فقط پیوندهای HTTPS از YouTube، Vimeo و فایل‌های مستقیم ویدئویی پذیرفته می‌شوند.</p></div><div class="card"><div class="section-head"><h3>فهرست ویدئوها</h3><span id="abaVideoCount" class="tag">۰ ویدئو</span></div><input id="abaVideoFilter" class="input" type="search" placeholder="جست‌وجو در عنوان، پایه یا موضوع"><div id="abaVideoList" style="display:grid;gap:8px;margin-top:10px"></div></div><div class="mutedbox">توجه: برای رعایت حق نشر، ویدئوهای کتاب‌ها یا دوره‌های تجاری بدون مجوز در برنامه قرار نمی‌گیرند. فایل انتخاب‌شده از گوشی فقط برای همین نوبت پخش می‌شود و در کتابخانه ذخیره دائمی نمی‌شود.</div>';
 items=read();
 $('abaVideoAdd').addEventListener('click',addLink);
 $('abaVideoFilter').addEventListener('input',renderList);
 $('abaVideoLocal').addEventListener('change',playLocal);
 $('abaVideoList').addEventListener('click',e=>{const b=e.target.closest('[data-play],[data-delete]');if(!b)return;const i=Number(b.dataset.play??b.dataset.delete);if(b.hasAttribute('data-play'))play(items[i]);else{items.splice(i,1);save();renderList();}});
 renderList();
}
function renderList(){
 const box=$('abaVideoList'),q=($('abaVideoFilter')?.value||'').trim().toLocaleLowerCase('fa');if(!box)return;
 const rows=items.map((v,i)=>({...v,i})).filter(v=>[v.title,v.grade,v.subject].join(' ').toLocaleLowerCase('fa').includes(q));
 $('abaVideoCount').textContent=fa(items.length)+' ویدئو';
 box.replaceChildren();
 if(!rows.length){const p=document.createElement('p');p.className='small';p.textContent=items.length?'موردی با این جست‌وجو پیدا نشد.':'هنوز ویدئویی ثبت نشده است؛ می‌توانی پیوند ویدئوی مجاز خودت را اضافه کنی.';box.append(p);return;}
 rows.forEach(v=>{const card=document.createElement('article');card.className='assignment-row';const title=document.createElement('b');title.textContent=v.title;const meta=document.createElement('p');meta.className='small';meta.textContent='پایه '+(v.grade==='all'?'همه':v.grade)+' · '+v.subject;const actions=document.createElement('div');actions.className='btnrow';const playBtn=document.createElement('button');playBtn.className='btn gold';playBtn.type='button';playBtn.dataset.play=String(v.i);playBtn.textContent='▶ پخش';const del=document.createElement('button');del.className='btn outline';del.type='button';del.dataset.delete=String(v.i);del.textContent='حذف';actions.append(playBtn,del);card.append(title,meta,actions);box.append(card);});
}
function addLink(){
 const title=$('abaVideoTitle').value.trim(),raw=$('abaVideoUrl').value.trim(),parsed=parseUrl(raw);
 if(!title||!raw){$('abaVideoMsg').textContent='عنوان و پیوند ویدئو را وارد کن.';return;}
 if(!parsed){$('abaVideoMsg').textContent='این پیوند پشتیبانی نمی‌شود. از لینک HTTPS یوتیوب، ویمئو یا فایل مستقیم MP4/WebM/OGG استفاده کن.';return;}
 items.unshift({title,url:raw,kind:parsed.kind,id:parsed.id||'',grade:$('abaVideoGrade').value,subject:$('abaVideoSubject').value,created:new Date().toISOString()});
 const ok=save();$('abaVideoMsg').textContent=ok?'ویدئو به کتابخانه اضافه شد.':'فضای ذخیره‌سازی دستگاه کافی نیست؛ ویدئو ذخیره نشد.';
 $('abaVideoTitle').value='';$('abaVideoUrl').value='';renderList();play(items[0]);
}
function play(item){
 if(!item)return;const box=$('abaVideoPlayer');box.replaceChildren();if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
 let media;
 if(item.kind==='youtube'){media=document.createElement('iframe');media.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(item.id);media.title=item.title;media.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';media.allowFullscreen=true;media.referrerPolicy='strict-origin-when-cross-origin';}
 else if(item.kind==='vimeo'){media=document.createElement('iframe');media.src='https://player.vimeo.com/video/'+encodeURIComponent(item.id);media.title=item.title;media.allow='autoplay; fullscreen; picture-in-picture';media.allowFullscreen=true;media.referrerPolicy='strict-origin-when-cross-origin';}
 else{media=document.createElement('video');media.src=item.url;media.controls=true;media.playsInline=true;media.preload='metadata';}
 box.append(media);$('abaVideoNow').textContent=item.title+' · پایه '+(item.grade==='all'?'همه':item.grade)+' · '+item.subject;
}
function playLocal(e){
 const file=e.target.files?.[0];if(!file)return;if(!/^video\/(mp4|webm|ogg)$/.test(file.type)){ $('abaVideoMsg').textContent='فرمت فایل پشتیبانی نمی‌شود؛ MP4، WebM یا OGG انتخاب کن.';return;}
 const box=$('abaVideoPlayer');box.replaceChildren();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(file);
 const v=document.createElement('video');v.src=objectUrl;v.controls=true;v.playsInline=true;v.preload='metadata';box.append(v);$('abaVideoNow').textContent=file.name+' · فایل محلی';$('abaVideoMsg').textContent='فایل از گوشی پخش می‌شود؛ برای ماندگاری در کتابخانه باید نسخه مجاز آن را با لینک HTTPS اضافه کنی.';e.target.value='';
}
function openVideo(){const u=$('abaVideoUrl');if(u)u.focus();}
window.openVideo=openVideo;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();