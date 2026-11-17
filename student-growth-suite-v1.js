/* Student Growth Suite v1: adaptive study, local gamification, family-friendly reports, voice and accessibility. */
(()=>{'use strict';
const KEY='abaGrowthSuiteV1', ACCESS='abaAccessibilityV1';
const $=id=>document.getElementById(id);
const today=()=>new Date().toLocaleDateString('en-CA');
const safe=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
let data=read(KEY,{xp:0,streak:0,lastDay:'',days:[],answers:0,correct:0,badges:[],sessions:[],mission:{day:'',done:[]},events:[]});
const persist=()=>localStorage.setItem(KEY,JSON.stringify(data));
const access=read(ACCESS,{font:100,contrast:false,motion:false});
function award(correct,topic){
 const day=today();if(data.lastDay!==day){const prev=new Date();prev.setDate(prev.getDate()-1);const p=prev.toLocaleDateString('en-CA');data.streak=data.lastDay===p?data.streak+1:1;data.lastDay=day;data.days=[...new Set([...(data.days||[]),day])].slice(-60)}
 data.answers++;if(correct){data.correct++;data.xp+=10}else data.xp+=2;
 data.events.push({at:Date.now(),correct:!!correct,topic:String(topic||'تمرین')});data.events=data.events.slice(-300);
 if(data.correct>=1&&!data.badges.includes('first'))data.badges.push('first');
 if(data.correct>=10&&!data.badges.includes('ten'))data.badges.push('ten');
 if(data.streak>=3&&!data.badges.includes('streak3'))data.badges.push('streak3');
 if(data.xp>=100&&!data.badges.includes('xp100'))data.badges.push('xp100');
 if(data.mission.day!==day)data.mission={day,done:[]};
 if(correct&&!data.mission.done.includes('practice'))data.mission.done.push('practice');
 persist();render();
}
function skillRows(){
 const s=window.AmirSkillResults?.()||window.skillResults||{};
 return Object.entries(s).filter(([,v])=>v&&v.total>0).map(([name,v])=>({name,total:v.total,correct:v.correct||0,rate:Math.round((v.correct||0)/v.total*100)})).sort((a,b)=>a.rate-b.rate);
}
function recommend(){
 const rows=skillRows();if(!rows.length)return {title:'شروع ارزیابی',detail:'یک آزمون یا کاربرگ حل کن تا سامانه بر اساس پاسخ‌ها مسیر تمرینت را پیشنهاد دهد.',topic:'patterns'};
 const weak=rows[0],topicMap={'الگوهای عددی':'patterns','عددنویسی و ارزش مکانی':'place','بخش‌پذیری':'divisibility','اعداد صحیح':'integers','کسرها':'fractions','اعداد اعشاری':'decimals','تقارن':'symmetry','مختصات':'coordinates','اندازه‌گیری':'measurement','نسبت و درصد':'ratio','تقریب':'approximation'};
 return {title:'تمرکز پیشنهادی: '+weak.name,detail:'در '+weak.total+' پاسخ، '+weak.rate+'٪ پاسخ درست ثبت شده است. ابتدا آموزش کوتاه، سپس ۵ تمرین ساده و بعد آزمون مرور انجام بده.',topic:topicMap[weak.name]||'mixed'};
}
function goWorksheet(topic){if(typeof window.showView==='function')window.showView('worksheets');setTimeout(()=>{const s=$('wsTopic');if(s){const valid=[...s.options].some(o=>o.value===topic);s.value=valid?topic:'mixed';s.dispatchEvent(new Event('change',{bubbles:true}))}},80)}
function missionDone(id){if(data.mission.day!==today())data.mission={day:today(),done:[]};if(!data.mission.done.includes(id))data.mission.done.push(id);persist();render()}
function addStyle(){if($('abaGrowthStyle'))return;const st=document.createElement('style');st.id='abaGrowthStyle';st.textContent=`
.aba-growth-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.aba-growth-stat{border:1px solid var(--line);border-radius:16px;padding:13px;background:var(--white)}.aba-growth-stat b{font-size:22px;display:block;color:var(--accent)}.aba-growth-stat small{font-size:11px;color:var(--muted)}.aba-growth-progress{height:9px;background:var(--bg);border-radius:9px;overflow:hidden;margin:7px 0}.aba-growth-progress i{display:block;height:100%;background:linear-gradient(90deg,#16a085,#6c63ff)}.aba-growth-row{padding:10px 0;border-bottom:1px solid var(--line)}.aba-growth-row:last-child{border:0}.aba-growth-badges{display:flex;gap:9px;flex-wrap:wrap}.aba-growth-badge{border:1px solid #f3d47c;background:#fff8df;color:#6e4c00;border-radius:14px;padding:9px;font-size:11px}.aba-growth-actions{display:flex;gap:8px;flex-wrap:wrap}.aba-growth-actions button{border:1px solid var(--line);border-radius:12px;background:var(--white);color:var(--ink);padding:9px 12px;font-size:12px}.aba-read-btn{display:inline-flex;align-items:center;gap:5px;margin:5px;border:1px solid var(--line);border-radius:20px;background:var(--white);color:var(--ink);padding:6px 10px;font-size:11px}.aba-access-panel label{display:block;margin:8px 0;font-size:12px}.aba-access-panel input{accent-color:var(--accent)}body.aba-high-contrast{--ink:#000!important;--muted:#222!important;--line:#555!important;--bg:#fff!important;--white:#fff!important}body.aba-large-text{font-size:calc(1rem * var(--aba-font-scale,1))!important}body.aba-reduce-motion *,body.aba-reduce-motion *:before,body.aba-reduce-motion *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}@media(min-width:650px){.aba-growth-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}`;
document.head.append(st)}
function addViews(){
 const main=document.querySelector('main.content');if(!main)return;
 const add=(id,title,html)=>{if($(id))return;const v=document.createElement('section');v.id=id;v.className='view';v.innerHTML='<div class="section-head"><h2>'+title+'</h2><button class="btn light" type="button" data-back-home>بازگشت</button></div>'+html;main.append(v)};
 add('adaptive','مسیر یادگیری اختصاصی','<div class="card"><div id="abaAdaptiveRecommendation"></div><div class="aba-growth-actions"><button type="button" id="abaAdaptiveStart">شروع تمرین پیشنهادی</button><button type="button" id="abaAdaptiveRefresh">به‌روزرسانی تحلیل</button></div></div><div class="card"><h3>نقاط قوت و نیازمند تمرین</h3><div id="abaAdaptiveSkills"></div><p class="small">پیشنهادها از پاسخ‌های ثبت‌شده در همین حساب/دستگاه ساخته می‌شوند؛ برای دقت بیشتر، چند آزمون از موضوعات مختلف حل کن.</p></div>');
 add('familyReport','گزارش خانواده','<div class="card"><p class="small">گزارش محلیِ همین دستگاه؛ این صفحه هنوز جایگزین حساب مستقل والدین و اتصال امن والد به حساب فرزند نیست.</p><div class="aba-growth-grid" id="abaFamilyStats"></div></div><div class="card"><h3>گزارش مهارت‌ها</h3><div id="abaFamilySkills"></div></div><div class="card"><h3>فعالیت‌های اخیر</h3><div id="abaFamilyEvents"></div></div>');
 add('accessibility','تنظیمات دسترس‌پذیری','<div class="card aba-access-panel"><label>اندازه نوشته: <input id="abaFontScale" type="range" min="90" max="140" step="5" value="100"> <b id="abaFontLabel">۱۰۰٪</b></label><label><input id="abaContrast" type="checkbox"> کنتراست بالا</label><label><input id="abaMotion" type="checkbox"> کاهش حرکت و انیمیشن</label><p class="small">پشتیبانی صفحه‌خوان با عنوان‌های معنایی و برچسب کنترل‌ها رعایت شده؛ کیفیت نهایی باید با TalkBack روی گوشی واقعی آزموده شود.</p></div>');
 const nav=document.querySelector('.navinner');if(nav){
  const addNav=(id,label,ico)=>{if(nav.querySelector('[data-view="'+id+'"]'))return;const b=document.createElement('button');b.dataset.view=id;b.type='button';b.innerHTML='<span class="ico">'+ico+'</span>'+label;b.addEventListener('click',()=>window.showView?.(id));nav.append(b)};
  addNav('adaptive','مسیر من','🧭');addNav('familyReport','گزارش خانواده','👨‍👩‍👧');addNav('accessibility','دسترس‌پذیری','♿');
 }
 document.querySelectorAll('[data-back-home]').forEach(b=>b.addEventListener('click',()=>window.history?.state?.aba?history.back():window.showView?.('home')));
}
function render(){
 const day=today(),mission=data.mission.day===day?data.mission.done:[];
 const rec=recommend(),r=$('abaAdaptiveRecommendation');
 if(r)r.innerHTML='<span class="tag">پیشنهاد هوشمند</span><h3>'+safe(rec.title)+'</h3><p>'+safe(rec.detail)+'</p><div class="small">تمرین پیشنهادی: '+safe(rec.topic)+'</div>';
 const skills=$('abaAdaptiveSkills');if(skills){const rows=skillRows();skills.innerHTML=rows.length?rows.map(x=>'<div class="aba-growth-row"><b>'+safe(x.name)+'</b><div class="aba-growth-progress"><i style="width:'+x.rate+'%"></i></div><small>'+x.rate+'٪ موفقیت · '+x.total+' پاسخ</small></div>').join(''):'هنوز داده کافی نیست؛ از آزمون‌ها و کاربرگ‌ها شروع کن.'}
 const stats=$('abaFamilyStats');if(stats)stats.innerHTML=[['امتیاز تجربه',data.xp],['سطح',Math.floor(data.xp/100)+1],['روزهای پیوسته',data.streak],['پاسخ درست',data.correct],['کل پاسخ‌ها',data.answers],['روزهای مطالعه',(data.days||[]).length]].map(x=>'<div class="aba-growth-stat"><b>'+x[1]+'</b><small>'+x[0]+'</small></div>').join('');
 const fs=$('abaFamilySkills');if(fs)fs.innerHTML=skillRows().map(x=>'<div class="aba-growth-row"><b>'+safe(x.name)+'</b><div class="aba-growth-progress"><i style="width:'+x.rate+'%"></i></div><small>'+x.correct+' پاسخ درست از '+x.total+'</small></div>').join('')||'هنوز مهارتی ثبت نشده است.';
 const ev=$('abaFamilyEvents');if(ev)ev.innerHTML=data.events.slice(-8).reverse().map(x=>'<div class="aba-growth-row">'+(x.correct?'✅':'📝')+' '+safe(x.topic)+' · '+(x.correct?'درست':'نیازمند مرور')+' · '+new Date(x.at).toLocaleString('fa-IR')+'</div>').join('')||'فعالیتی ثبت نشده است.';
 const badgeNames={first:'اولین پاسخ درست 🥇',ten:'۱۰ پاسخ درست 🌟',streak3:'۳ روز پیوسته 🔥',xp100:'۱۰۰ امتیاز ⭐'};
 const badgeHost=$('abaGrowthBadges');if(badgeHost)badgeHost.innerHTML=data.badges.map(b=>'<span class="aba-growth-badge">'+badgeNames[b]+'</span>').join('')||'هنوز نشانی دریافت نشده است.';
 const missionHost=$('abaGrowthMissions');if(missionHost)missionHost.innerHTML='<div class="aba-growth-row"><b>ماموریت روزانه</b><p>یک تمرین را با دقت پاسخ بده.</p><label><input type="checkbox" id="abaMissionPractice" '+(mission.includes('practice')?'checked':'')+'> انجام شد</label></div><div class="small">استریک: '+data.streak+' روز · امتیاز: '+data.xp+'</div>';
 const m=$('abaMissionPractice');if(m)m.onchange=()=>m.checked?missionDone('practice'):null;
}
function applyAccess(){document.body.classList.toggle('aba-high-contrast',!!access.contrast);document.body.classList.toggle('aba-reduce-motion',!!access.motion);document.documentElement.style.setProperty('--aba-font-scale',String(access.font/100));document.body.classList.toggle('aba-large-text',access.font!==100);const range=$('abaFontScale');if(range)range.value=access.font;const label=$('abaFontLabel');if(label)label.textContent=access.font+'٪';if($('abaContrast'))$('abaContrast').checked=!!access.contrast;if($('abaMotion'))$('abaMotion').checked=!!access.motion}
function speech(text){if(!('speechSynthesis'in window))return alert('خواندن صوتی در این مرورگر پشتیبانی نمی‌شود.');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fa-IR';u.rate=.88;speechSynthesis.speak(u)}
function addQuestionReadButtons(){
 const selectors=['#quizQuestion','#questionText','.question','#lessonContent .lesson-body'];
 selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{if(el.dataset.abaSpeakReady)return;el.dataset.abaSpeakReady='1';const b=document.createElement('button');b.type='button';b.className='aba-read-btn';b.textContent='🔊 خواندن سؤال';b.setAttribute('aria-label','خواندن متن سؤال با صدای فارسی');b.addEventListener('click',()=>speech(el.innerText));el.insertAdjacentElement('afterend',b)}));
}
function mount(){
 addStyle();addViews();
 const old=window.recordSkillAnswer;
 if(typeof old==='function'&&!old.__abaGrowthWrapped){const wrapped=function(q,ok){const out=old.apply(this,arguments);award(!!ok,(window.AmirSkillNameForQuestion?.(q))||(q&& (q.topic||q.skill||q.title))||'تمرین');return out};wrapped.__abaGrowthWrapped=true;window.recordSkillAnswer=wrapped}
 $('abaAdaptiveStart')?.addEventListener('click',()=>goWorksheet(recommend().topic));
 $('abaAdaptiveRefresh')?.addEventListener('click',render);
 $('abaFontScale')?.addEventListener('input',e=>{access.font=Number(e.target.value);localStorage.setItem(ACCESS,JSON.stringify(access));applyAccess()});
 $('abaContrast')?.addEventListener('change',e=>{access.contrast=e.target.checked;localStorage.setItem(ACCESS,JSON.stringify(access));applyAccess()});
 $('abaMotion')?.addEventListener('change',e=>{access.motion=e.target.checked;localStorage.setItem(ACCESS,JSON.stringify(access));applyAccess()});
 const profile=document.getElementById('profile');if(profile&&!$('abaGrowthSummary')){const card=document.createElement('div');card.id='abaGrowthSummary';card.className='card';card.innerHTML='<h3>پیشرفت و انگیزه</h3><div id="abaGrowthBadges" class="aba-growth-badges"></div><div id="abaGrowthMissions"></div><div class="aba-growth-actions"><button type="button" id="abaGoAdaptive">مسیر یادگیری</button><button type="button" id="abaGoFamily">گزارش خانواده</button><button type="button" id="abaGoAccess">دسترس‌پذیری</button></div>';profile.append(card)}
 $('abaGoAdaptive')?.addEventListener('click',()=>showView('adaptive'));$('abaGoFamily')?.addEventListener('click',()=>showView('familyReport'));$('abaGoAccess')?.addEventListener('click',()=>showView('accessibility'));
 applyAccess();render();addQuestionReadButtons();
 const mo=new MutationObserver(()=>{addQuestionReadButtons();});mo.observe(document.body,{childList:true,subtree:true});
 if(navigator.onLine===false){const note=document.createElement('div');note.className='card';note.textContent='حالت آفلاین فعال است؛ محتوای ذخیره‌شده و فایل‌های دانلودشده در دسترس‌اند.';document.querySelector('.content')?.prepend(note)}
 window.addEventListener('online',()=>{const n=document.querySelector('.aba-online-note');if(n)n.remove()});
 window.AbaGrowth={snapshot:()=>JSON.parse(JSON.stringify(data)),recommend,award};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();