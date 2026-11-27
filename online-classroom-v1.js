/* Role-aware online classroom hub backed by the user's own Supabase class memberships. */
(()=>{'use strict';
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(){
 const main=document.querySelector('main.content');if(!main||$('onlineClassroom'))return;
 const view=document.createElement('section');view.id='onlineClassroom';view.className='view';
 view.innerHTML='<div class="section-head"><div><h2>👩‍🏫 کلاس‌های آنلاین من</h2><p class="small">عضویت در کلاس، مشاهده برنامه و ورود به جلسه</p></div><span class="tag">حساب‌محور</span></div><div id="abaClassroomContent" class="card"><div class="small">در حال بررسی حساب کاربری…</div></div><div class="card"><h3>ابزارهای کلاس</h3><div class="btnrow"><button class="btn outline" type="button" id="abaClassroomManage">مدیریت و برنامه‌ریزی کلاس</button><button class="btn outline" type="button" id="abaClassroomProfile">پروفایل و حساب کاربری</button></div><p class="small" style="margin-top:8px">جلسات زنده از طریق پیوند امن Google Meet، Zoom یا سرویس انتخابی معلم برگزار می‌شوند؛ تماس تصویری مستقل داخل برنامه میزبانی نمی‌شود.</p></div>';
 main.append(view);
 $('abaClassroomManage').onclick=()=>window.showView?.('teacher');
 $('abaClassroomProfile').onclick=()=>window.showView?.('profile');
 view.addEventListener('click',async e=>{
  const b=e.target.closest('[data-join-code],[data-copy-code]');if(!b)return;
  if(b.hasAttribute('data-copy-code')){const code=b.dataset.copyCode;try{await navigator.clipboard.writeText(code);b.textContent='کپی شد ✓'}catch{prompt('کد دعوت را کپی کن:',code)}return;}
  const code=$('abaJoinClassCode')?.value.trim();if(!code)return alert('کد دعوت کلاس را وارد کن.');
  const auth=window.AmirAuth,client=auth?.client;if(!client)return alert('ابتدا وارد حساب کاربری شو.');
  b.disabled=true;b.textContent='در حال عضویت…';
  try{const {error}=await client.rpc('join_class_by_code',{p_code:code});if(error)throw error;alert('عضویت در کلاس با موفقیت انجام شد.');$('abaJoinClassCode').value='';await render();}
  catch(err){alert('عضویت انجام نشد: '+(err?.message||'خطای نامشخص'));}
  finally{b.disabled=false;b.textContent='عضویت در کلاس';}
 });
 render();
}
async function render(){
 const box=$('abaClassroomContent');if(!box)return;
 const auth=window.AmirAuth,profile=auth?.profile,client=auth?.client;
 if(!profile){box.innerHTML='<h3>برای مشاهده کلاس‌ها وارد حساب شو</h3><p class="small">دانش‌آموزان با کد دعوت معلم عضو کلاس می‌شوند. معلم‌ها نیز کلاس‌های خود را از حساب کاربری مدیریت می‌کنند.</p><button class="btn gold" type="button" id="abaClassroomLogin">ورود / ثبت‌نام</button>'; $('abaClassroomLogin').onclick=()=>window.showView?.('profile');return;}
 if(!client||!auth.ready){box.textContent='اتصال حساب آنلاین در دسترس نیست. اتصال اینترنت و تنظیمات حساب را بررسی کن.';return;}
 if(profile.role==='student'){
  box.innerHTML='<h3>عضویت در کلاس جدید</h3><p class="small">کد دعوتی را که آموزگارت فرستاده وارد کن.</p><div class="toolbar"><input id="abaJoinClassCode" class="input" placeholder="کد دعوت کلاس" autocomplete="off" maxlength="24"><button class="btn gold" data-join-code type="button">عضویت در کلاس</button></div><hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><h3>کلاس‌های من</h3><div id="abaMyClassList" class="small">در حال دریافت فهرست کلاس‌ها…</div>';
  const list=$('abaMyClassList');
  const {data,error}=await client.from('class_members').select('class_id,classes(title,grade,subject,meeting_url)').eq('student_id',profile.id);
  if(error){list.textContent='دریافت کلاس‌ها ناموفق بود: '+error.message;return;}
  list.replaceChildren?.();
  list.innerHTML=data.length?data.map(x=>{const c=x.classes||{};return '<article class="assignment-row"><h4>'+esc(c.title||'کلاس')+'</h4><p class="small">پایه '+esc(c.grade||'—')+' · '+esc(c.subject||'—')+'</p>'+(c.meeting_url&&/^https:\/\//i.test(c.meeting_url)?'<a class="btn gold" href="'+esc(c.meeting_url)+'" target="_blank" rel="noopener noreferrer">ورود به کلاس آنلاین ↗</a>':'<span class="tag">لینک جلسه هنوز ثبت نشده است</span>')+'</article>'}).join(''):'<p class="small">هنوز عضو کلاسی نیستی؛ با کد دعوت آموزگارت عضو شو.</p>';
 }else if(profile.role==='teacher'){
  box.innerHTML='<h3>کلاس‌های من</h3><p class="small">کلاس‌ها و پیوندهای جلسه‌ای که برای حساب معلم ثبت شده‌اند.</p><div id="abaMyClassList" class="small">در حال دریافت کلاس‌ها…</div>';
  const list=$('abaMyClassList'),{data,error}=await client.from('classes').select('id,title,grade,subject,invite_code,meeting_url').eq('teacher_id',profile.id).order('created_at',{ascending:false});
  if(error){list.textContent='دریافت کلاس‌ها ناموفق بود: '+error.message;return;}
  list.innerHTML=data.length?data.map(c=>'<article class="assignment-row"><h4>'+esc(c.title)+'</h4><p class="small">پایه '+esc(c.grade||'—')+' · '+esc(c.subject||'—')+'</p><div class="btnrow"><button class="btn outline" type="button" data-copy-code="'+esc(c.invite_code||'')+'">کد دعوت: '+esc(c.invite_code||'—')+' · کپی</button>'+(c.meeting_url&&/^https:\/\//i.test(c.meeting_url)?'<a class="btn gold" href="'+esc(c.meeting_url)+'" target="_blank" rel="noopener noreferrer">ورود به جلسه ↗</a>':'<span class="tag">لینک جلسه ثبت نشده</span>')+'</div></article>').join(''):'<p class="small">هنوز کلاسی ایجاد نکرده‌ای. از پروفایل، پنل معلم را باز کن.</p>';
 }else{
  box.innerHTML='<h3>دسترسی مدیر</h3><p class="small">مدیریت کلاس‌های معلم‌ها از بخش مدیریت کاربران و حساب کاربری انجام می‌شود.</p>';
 }
}
window.addEventListener('amir:user-changed',()=>render());
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.AmirClassroom={refresh:render};
})();