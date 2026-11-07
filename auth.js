/* آموزش با امیر — multi-user client. Database RLS is the security boundary. */
(function(){
 const cfg=window.AMIR_BACKEND_CONFIG||{}, ready=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase?.createClient);
 let client=null,profile=null; const $=id=>document.getElementById(id);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function mount(){
  if($('amirAuthOverlay'))return;
  const style=document.createElement('style');style.textContent='.amir-account-bar{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin:0 16px 10px}.amir-account-btn{border:1px solid #dce6ea;border-radius:12px;background:#fff;color:#18313d;padding:8px 12px;font:700 12px inherit}.amir-auth-overlay{position:fixed;inset:0;background:#0b1729b8;z-index:9999;display:none;align-items:center;justify-content:center;padding:16px}.amir-auth-overlay.open{display:flex}.amir-auth-panel{background:var(--white,#fff);color:var(--ink,#18313d);border-radius:22px;padding:20px;width:min(100%,430px);max-height:90vh;overflow:auto}.amir-auth-panel label{display:block;font-size:12px;margin:9px 0 4px}.amir-auth-panel input,.amir-auth-panel select{width:100%;padding:11px;border:1px solid var(--line);border-radius:11px;background:var(--white);color:var(--ink)}.amir-role-panel{border:1px solid var(--line);border-radius:16px;padding:14px;margin:12px 0;background:var(--white)}.amir-list-row{padding:9px 0;border-bottom:1px solid var(--line);font-size:12px}.amir-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.amir-msg{font-size:12px;padding:9px;border-radius:10px;background:#eef5fa;margin-top:10px}.amir-role-panel .input{margin:4px 0}';
  document.head.appendChild(style);
  const bar=document.createElement('div');bar.className='amir-account-bar';bar.innerHTML='<span id="amirAccountStatus" class="small">حالت مهمان · محتوای عمومی</span><button id="amirAccountOpen" class="amir-account-btn">ورود / ثبت‌نام</button>';document.querySelector('.top')?.insertAdjacentElement('afterend',bar);
  const overlay=document.createElement('div');overlay.id='amirAuthOverlay';overlay.className='amir-auth-overlay';
  overlay.innerHTML='<div class="amir-auth-panel" role="dialog" aria-modal="true"><h2>حساب کاربری آموزش با امیر</h2><p class="small">همه کاربران به محتوای پایه دسترسی دارند.</p><label>نام نمایشی</label><input id="amirAuthName" placeholder="نام نمایشی"><label>آیدی دلخواه (۳ تا ۲۴ حرف انگلیسی، عدد یا زیرخط)</label><input id="amirAuthUsername" maxlength="24" autocomplete="username" placeholder="مثلاً student_ali"><label>ایمیل</label><input id="amirAuthEmail" type="email" autocomplete="email" placeholder="name@example.com"><label>رمز عبور</label><input id="amirAuthPassword" type="password" minlength="8" autocomplete="current-password" placeholder="حداقل ۸ نویسه"><label>نوع حساب</label><select id="amirAuthRole"><option value="student">دانش‌آموز</option><option value="teacher">معلم (پس از تأیید مدیر)</option></select><div id="amirAuthMessage" class="amir-msg">'+(ready?'ثبت‌نام دانش‌آموز آزاد است؛ حساب معلم نیازمند تأیید مدیر کل است.':'اتصال آنلاین هنوز تنظیم نشده؛ برنامه در حالت مهمان/محلی است.')+'</div><div class="amir-actions"><button id="amirAuthLogin" class="btn" '+(ready?'':'disabled')+'>ورود</button><button id="amirAuthSignup" class="btn gold" '+(ready?'':'disabled')+'>ثبت‌نام</button><button id="amirAuthClose" class="btn outline">بستن</button></div></div>';
  document.body.appendChild(overlay);$('amirAccountOpen').onclick=()=>profile?logout():overlay.classList.add('open');$('amirAuthClose').onclick=()=>overlay.classList.remove('open');overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});$('amirAuthLogin').onclick=login;$('amirAuthSignup').onclick=signup;
 }
 const message=t=>{if($('amirAuthMessage'))$('amirAuthMessage').textContent=t};
 async function login(){const {error}=await client.auth.signInWithPassword({email:$('amirAuthEmail').value.trim(),password:$('amirAuthPassword').value});if(error)return message(error.message);await loadProfile()}
 async function signup(){
  const email=$('amirAuthEmail').value.trim(),password=$('amirAuthPassword').value,name=$('amirAuthName').value.trim(),username=$('amirAuthUsername').value.trim().toLowerCase(),role=$('amirAuthRole').value;
  if(!name||!email||password.length<8||!/^[a-z0-9_]{3,24}$/.test(username))return message('نام، ایمیل، آیدی معتبر و رمز حداقل ۸ نویسه لازم است.');
  const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name,username,requested_role:role}}});if(error)return message(error.message);
  if(data.session)await loadProfile();else message(role==='teacher'?'درخواست معلم ثبت شد؛ پس از تأیید ایمیل و مدیر کل فعال می‌شود.':'حساب ساخته شد؛ ایمیل را برای تأیید بررسی کن.');
 }
 async function loadProfile(){
  const {data:{user}}=await client.auth.getUser();if(!user){profile=null;render();return}
  const {data,error}=await client.from('profiles').select('*').eq('id',user.id).single();if(error){message('دریافت نقش ناموفق بود: '+error.message);return}
  profile=data;render();$('amirAuthOverlay')?.classList.remove('open');
  if(profile.approval_status==='pending')alert('درخواست معلم در انتظار تأیید مدیر کل است.');
  if(['rejected','suspended'].includes(profile.approval_status))alert('حساب فعلاً اجازه استفاده از پنل معلم را ندارد.');
 }
 function rolePanel(id,title,html,where){$(id)?.remove();const s=document.createElement('section');s.id=id;s.className='amir-role-panel';s.innerHTML='<h3>'+title+'</h3>'+html;const host=$(where)||document.querySelector('main.content');host?.prepend(s);return s}
 function render(){
  const status=$('amirAccountStatus'),btn=$('amirAccountOpen');
  if(status)status.textContent=profile?esc(profile.display_name)+' · '+({admin:'مدیر کل',teacher:'معلم',student:'دانش‌آموز'}[profile.role]||'کاربر'):'حالت مهمان · محتوای عمومی';
  if(btn)btn.textContent=profile?'خروج از حساب':'ورود / ثبت‌نام';
  document.querySelectorAll('[data-view="teacher"]').forEach(x=>x.classList.toggle('amir-hidden-role',ready&&(!profile||!['admin','teacher'].includes(profile.role)||profile.role==='teacher'&&profile.approval_status!=='approved')));
  document.querySelectorAll('[data-view="admin"]').forEach(x=>x.classList.toggle('amir-hidden-role',!profile||profile.role!=='admin'));
  ['amirStudentDashboard','amirTeacherDashboard','amirAdminPanel'].forEach(id=>$(id)?.remove());
  if(!profile||profile.approval_status!=='approved')return;
  if(profile.role==='student'){
   const s=rolePanel('amirStudentDashboard','پنل دانش‌آموز','<p class="small">محتوای عمومی برای همه یکسان است. برای پیوستن به کلاس معلم، کد دعوت را وارد کن.</p><label>کد دعوت کلاس</label><input id="amirJoinCode" class="input" placeholder="کد کلاس" value="'+esc(new URLSearchParams(location.search).get('join')||'')+'"><button id="amirJoinBtn" class="btn">عضویت در کلاس</button><div id="amirStudentClasses" class="amir-list-row">در حال بارگذاری کلاس‌ها…</div>','home');
   $('amirJoinBtn').onclick=joinClass;loadStudentClasses();
  }
  if(profile.role==='teacher'){
   const s=rolePanel('amirTeacherDashboard','پنل معلم','<p class="small">کلاس اختصاصی بساز و کد دعوت را برای دانش‌آموزانت بفرست.</p><label>نام کلاس</label><input id="amirClassTitle" class="input" placeholder="مثلاً ریاضی ششم"><div class="amir-actions"><input id="amirClassGrade" class="input" placeholder="پایه"><input id="amirClassSubject" class="input" placeholder="درس"></div><label>لینک کلاس آنلاین (اختیاری؛ Google Meet یا Zoom)</label><input id="amirClassMeeting" class="input" type="url" placeholder="https://..."><button id="amirCreateClass" class="btn">ایجاد کلاس و دریافت کد دعوت</button><div id="amirTeacherClasses" class="amir-list-row">در حال بارگذاری…</div>','home');
   $('amirCreateClass').onclick=createClass;loadTeacherClasses();
  }
  if(profile.role==='admin'){
   rolePanel('amirAdminPanel','مدیریت کاربران','<p class="small">اطلاعات ثبت‌نامی فقط برای مدیر کل نمایش داده می‌شود. معلم فقط آیدی و نام نمایشی اعضای کلاس خودش را می‌بیند.</p><div id="amirAllUsers">در حال بارگذاری کاربران…</div><h4>درخواست‌های معلمان</h4><div id="amirPendingTeachers">در حال بارگذاری…</div>');
   loadAllUsers();loadPending();
  }
 }
 async function loadAllUsers(){
  const box=$('amirAllUsers');if(!box)return;const {data,error}=await client.from('profiles').select('display_name,username,email,role,approval_status,created_at').order('created_at',{ascending:false}).limit(500);
  if(error){box.textContent='خطا: '+error.message;return}
  box.innerHTML=data.length?data.map(p=>'<div class="amir-list-row"><b>'+esc(p.display_name)+'</b> · @'+esc(p.username)+'<div class="small">'+esc(p.email||'')+' · '+esc(p.role)+' · '+esc(p.approval_status)+' · '+new Date(p.created_at).toLocaleDateString('fa-IR')+'</div></div>').join(''):'هنوز کاربری ثبت‌نام نکرده است.';
 }
 async function loadPending(){
  const box=$('amirPendingTeachers');if(!box)return;const {data,error}=await client.from('profiles').select('id,display_name,username,created_at').eq('role','teacher').eq('approval_status','pending').order('created_at');
  if(error){box.textContent='خطا: '+error.message;return}
  box.innerHTML=data.length?data.map(p=>'<div class="amir-list-row"><b>'+esc(p.display_name)+' · @'+esc(p.username)+'</b><div class="amir-actions"><button class="btn" data-approve="'+p.id+'">تأیید</button><button class="btn outline" data-reject="'+p.id+'">رد</button></div></div>').join(''):'درخواستی در انتظار نیست.';
  box.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>setTeacher(b.dataset.approve,'approved'));box.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>setTeacher(b.dataset.reject,'rejected'));
 }
 async function setTeacher(id,state){const {error}=await client.rpc('admin_set_teacher_status',{p_teacher_id:id,p_status:state});if(error)alert(error.message);else{loadPending();loadAllUsers()}}
 async function createClass(){
  const title=$('amirClassTitle').value.trim();if(!title)return alert('نام کلاس را وارد کن.');
  const meetingUrl=$('amirClassMeeting').value.trim();if(meetingUrl&&(!/^https:\/\//i.test(meetingUrl)))return alert('لینک کلاس باید با https:// شروع شود.');const {data,error}=await client.from('classes').insert({teacher_id:profile.id,title,grade:$('amirClassGrade').value.trim(),subject:$('amirClassSubject').value.trim(),meeting_url:meetingUrl||null}).select('id,title,invite_code').single();
  if(error)return alert('ایجاد کلاس ناموفق بود: '+error.message);await loadTeacherClasses();alert('کلاس ساخته شد. کد دعوت: '+data.invite_code+'\\nبرای ارسال دعوت، دکمه اشتراک‌گذاری کنار کلاس را بزن.');
 }
 async function loadTeacherClasses(){
  const box=$('amirTeacherClasses');if(!box)return;const {data,error}=await client.from('classes').select('id,title,grade,subject,invite_code,meeting_url').eq('teacher_id',profile.id).order('created_at',{ascending:false});
  if(error){box.textContent=error.message;return}
  box.innerHTML=data.length?data.map(x=>'<div class="amir-list-row"><b>'+esc(x.title)+'</b><div class="small">'+esc(x.grade||'')+' · '+esc(x.subject||'')+' · کد دعوت: <b>'+esc(x.invite_code)+'</b></div>'+(x.meeting_url?'<div><a href="'+esc(x.meeting_url)+'" target="_blank" rel="noopener noreferrer">ورود به کلاس آنلاین</a></div>':'<div class="small">هنوز لینک کلاس آنلاین ثبت نشده است.</div>')+'<div class="amir-actions"><button class="amir-account-btn" data-share="'+esc(x.invite_code)+'">ارسال دعوت</button><button class="amir-account-btn" data-roster="'+x.id+'">فهرست دانش‌آموزان</button></div><div id="amirRoster-'+x.id+'"></div></div>').join(''):'هنوز کلاسی نساخته‌ای.';
  box.querySelectorAll('[data-roster]').forEach(b=>b.onclick=()=>loadRoster(b.dataset.roster));box.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>shareInvite(b.dataset.share));
 }
 async function shareInvite(code){const link=location.origin+location.pathname+'?join='+encodeURIComponent(code);const text='برای عضویت در کلاس من، برنامه آموزش با امیر را نصب کن و پس از ثبت‌نام این کد را وارد کن: '+code+'\\n'+link;if(navigator.share){try{await navigator.share({title:'دعوت به کلاس آموزش با امیر',text,url:link});return}catch(e){}}try{await navigator.clipboard.writeText(text);alert('متن دعوت و لینک کلاس کپی شد.')}catch(e){prompt('متن دعوت را کپی کن:',text)}}
 async function loadRoster(id){const box=$('amirRoster-'+id);const {data,error}=await client.rpc('class_student_roster',{p_class_id:id});if(error){box.textContent=error.message;return}box.innerHTML=data.length?data.map(x=>'<div>'+esc(x.display_name)+' · @'+esc(x.username)+'</div>').join(''):'هنوز دانش‌آموزی عضو نشده است.'}
 async function joinClass(){const code=$('amirJoinCode').value.trim();if(!code)return alert('کد کلاس را وارد کن.');const {error}=await client.rpc('join_class_by_code',{p_code:code});if(error)return alert(error.message);alert('عضویت در کلاس انجام شد.');history.replaceState({},'',location.pathname);loadStudentClasses()}
 async function loadStudentClasses(){const box=$('amirStudentClasses');if(!box)return;const {data,error}=await client.from('class_members').select('class_id,classes(title,grade,subject)').eq('student_id',profile.id);if(error){box.textContent=error.message;return}box.innerHTML='<b>کلاس‌های من</b>'+(data.length?data.map(x=>'<div>'+esc(x.classes?.title||'کلاس')+' · '+esc(x.classes?.grade||'')+'</div>').join(''):'<div>هنوز عضو کلاسی نیستی.</div>')}
 async function logout(){await client.auth.signOut();profile=null;render()}
 function init(){mount();if(!ready)return;client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);client.auth.onAuthStateChange((_e,session)=>{if(!session){profile=null;render()}else setTimeout(loadProfile,0)});loadProfile()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 window.AmirAuth={get profile(){return profile},get client(){return client},get ready(){return ready},refresh:loadProfile};
})();