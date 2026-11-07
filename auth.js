/* آموزش با امیر — Supabase account and role UI foundation.
   The database RLS policies in backend/schema.sql are the actual security boundary. */
(function(){
  const cfg=window.AMIR_BACKEND_CONFIG||{};
  const ready=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase?.createClient);
  let client=null,profile=null;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function inject(){
    if($('amirAccountStyles'))return;
    const st=document.createElement('style');st.id='amirAccountStyles';st.textContent=`
      .amir-account-bar{display:flex;gap:8px;align-items:center;justify-content:flex-end;margin:0 16px 10px}
      .amir-account-btn{border:1px solid #dce6ea;border-radius:12px;background:#fff;color:#18313d;padding:8px 12px;font:700 12px inherit}
      .amir-account-status{font-size:11px;color:var(--muted)}
      .amir-auth-overlay{position:fixed;inset:0;background:#0b1729b8;z-index:9999;display:none;align-items:center;justify-content:center;padding:16px}
      .amir-auth-overlay.open{display:flex}.amir-auth-panel{background:var(--white,#fff);color:var(--ink,#18313d);border-radius:22px;padding:20px;width:min(100%,430px);max-height:90vh;overflow:auto;box-shadow:0 20px 70px #0005}
      .amir-auth-panel h2{margin:0 0 8px}.amir-auth-panel label{display:block;font-size:12px;margin:9px 0 4px}.amir-auth-panel input,.amir-auth-panel select{width:100%;padding:11px;border:1px solid var(--line,#dce6ea);border-radius:11px;background:var(--white,#fff);color:var(--ink,#18313d)}
      .amir-auth-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.amir-auth-msg{font-size:12px;padding:9px;border-radius:10px;background:#eef5fa;margin-top:10px;white-space:pre-wrap}
      .amir-role-panel{border:1px solid var(--line);border-radius:16px;padding:14px;margin:12px 16px;background:var(--white)}
      .amir-role-panel h3{margin:0 0 8px}.amir-role-panel .amir-list-row{padding:9px 0;border-bottom:1px solid var(--line);font-size:12px}
      .amir-hidden-role{display:none!important}
      `;
    document.head.appendChild(st);
    const bar=document.createElement('div');bar.className='amir-account-bar';bar.innerHTML='<span id="amirAccountStatus" class="amir-account-status">حالت مهمان · داده‌ها محلی</span><button id="amirAccountOpen" class="amir-account-btn">ورود / ثبت‌نام</button>';
    const header=document.querySelector('.top');if(header)header.insertAdjacentElement('afterend',bar);
    const overlay=document.createElement('div');overlay.id='amirAuthOverlay';overlay.className='amir-auth-overlay';
    overlay.innerHTML=`<div class="amir-auth-panel" role="dialog" aria-modal="true" aria-labelledby="amirAuthTitle">
      <h2 id="amirAuthTitle">حساب کاربری آموزش با امیر</h2>
      <p class="small">برای همگام‌سازی اطلاعات، با حساب خودت وارد شو.</p>
      <label>نام نمایشی</label><input id="amirAuthName" autocomplete="name" placeholder="نام نمایشی"><label>آیدی دلخواه (۳ تا ۲۴ حرف انگلیسی، عدد یا زیرخط)</label><input id="amirAuthUsername" autocomplete="username" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" placeholder="مثلاً amir_student">
      <label>ایمیل</label><input id="amirAuthEmail" type="email" autocomplete="email" placeholder="name@example.com">
      <label>رمز عبور</label><input id="amirAuthPassword" type="password" autocomplete="current-password" minlength="8" placeholder="حداقل ۸ نویسه">
      <label>نوع حساب هنگام ثبت‌نام</label><select id="amirAuthRole"><option value="student">دانش‌آموز</option><option value="teacher">معلم (نیازمند تأیید مدیر)</option></select>
      <div class="amir-auth-msg" id="amirAuthMessage">${ready?'ثبت‌نام معلم پس از تأیید مدیر کل فعال می‌شود.':'اتصال آنلاین هنوز پیکربندی نشده است؛ برنامه فعلاً در حالت محلی کار می‌کند.'}</div>
      <div class="amir-auth-actions"><button class="btn" id="amirAuthLogin" ${ready?'':'disabled'}>ورود</button><button class="btn gold" id="amirAuthSignup" ${ready?'':'disabled'}>ایجاد حساب</button><button class="btn outline" id="amirAuthClose">بستن</button></div>
    </div>`;
    document.body.appendChild(overlay);
    $('amirAccountOpen').onclick=()=>overlay.classList.add('open');$('amirAuthClose').onclick=()=>overlay.classList.remove('open');
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open');});
    $('amirAuthLogin').onclick=login;$('amirAuthSignup').onclick=signup;
  }
  function msg(t){if($('amirAuthMessage'))$('amirAuthMessage').textContent=t;}
  async function login(){
    if(!client)return;
    const {data,error}=await client.auth.signInWithPassword({email:$('amirAuthEmail').value.trim(),password:$('amirAuthPassword').value});
    if(error)return msg(error.message);
    await loadProfile();
  }
  async function signup(){
    if(!client)return;
    const email=$('amirAuthEmail').value.trim(),password=$('amirAuthPassword').value,name=$('amirAuthName').value.trim(),username=$('amirAuthUsername').value.trim().toLowerCase(),role=$('amirAuthRole').value;
    if(!name||!email||password.length<8||!/^[a-z0-9_]{3,24}$/.test(username))return msg('نام، ایمیل معتبر، آیدی ۳ تا ۲۴ حرفی (انگلیسی/عدد/زیرخط) و رمز حداقل ۸ نویسه لازم است.');
    const {data,error}=await client.auth.signUp({email,password,options:{data:{display_name:name,username,requested_role:role}}});
    if(error)return msg(error.message);
    if(data.session){await loadProfile();}else msg(role==='teacher'?'درخواست معلم ثبت شد و پس از تأیید ایمیل و مدیر کل فعال می‌شود.':'حساب ساخته شد؛ ایمیل را برای تأیید بررسی کن. آیدی انتخابی‌ات برای معلم فقط در کلاس‌هایی که عضو می‌شوی نمایش داده می‌شود.');
  }
  async function loadProfile(){
    if(!client)return;
    const {data:{user}}=await client.auth.getUser();
    if(!user){profile=null;render();return;}
    const {data,error}=await client.from('profiles').select('*').eq('id',user.id).single();
    if(error){msg('حساب وارد شد اما دریافت نقش ناموفق بود: '+error.message);return;}
    profile=data;render();
    $('amirAuthOverlay')?.classList.remove('open');
    msg('ورود موفق بود.');
    if(profile.approval_status==='pending')alert('درخواست حساب معلم شما در انتظار تأیید مدیر کل است.');
    if(profile.approval_status==='rejected'||profile.approval_status==='suspended')alert('حساب شما در حال حاضر اجازه ورود به پنل آموزشی را ندارد.');
  }
  function render(){
    const status=$('amirAccountStatus'),btn=$('amirAccountOpen');
    if(!profile){if(status)status.textContent='حالت مهمان · داده‌ها محلی';if(btn)btn.textContent='ورود / ثبت‌نام';}
    else{if(status)status.textContent=profile.display_name+' · '+({admin:'مدیر کل',teacher:'معلم',student:'دانش‌آموز'}[profile.role]||'کاربر')+' · '+profile.approval_status;if(btn)btn.textContent='حساب کاربری / خروج';}
    document.querySelectorAll('[data-view="teacher"]').forEach(b=>b.classList.toggle('amir-hidden-role',ready&&(!profile||profile.role!=='admin'&&(profile.role!=='teacher'||profile.approval_status!=='approved'))));
    document.querySelectorAll('[data-view="admin"]').forEach(b=>b.classList.toggle('amir-hidden-role',!profile||profile.role!=='admin'));
    const old=$('amirStudentDashboard');if(old)old.remove();
    if(profile&&profile.role==='student'&&profile.approval_status==='approved'){
      const s=document.createElement('section');s.id='amirStudentDashboard';s.className='amir-role-panel';s.innerHTML='<h3>پنل دانش‌آموز</h3><p class="small">حساب دانش‌آموز فعال است. درس‌ها و محتوای عمومی در دسترس‌اند؛ تکالیف و کلاس‌های اختصاصی پس از اتصال کامل بخش‌های آموزشی نمایش داده می‌شوند.</p>';
      const home=$('home');if(home)home.insertBefore(s,home.firstChild);
    }
    if(profile&&profile.role==='admin'&&!$('amirAdminPanel')){
      const s=document.createElement('section');s.id='amirAdminPanel';s.className='amir-role-panel';s.innerHTML='<h3>مدیریت درخواست معلمان</h3><p class="small">درخواست‌های ثبت‌نام معلم برای تأیید شما نمایش داده می‌شود.</p><div id="amirPendingTeachers">در حال بارگذاری…</div>';
      const main=document.querySelector('main.content');if(main)main.prepend(s);loadPending();
    }
    if((!profile||profile.role!=='admin')&&$('amirAdminPanel'))$('amirAdminPanel').remove();
  }
  async function loadPending(){
    const box=$('amirPendingTeachers');if(!box||!client)return;
    const {data,error}=await client.from('profiles').select('id,display_name,created_at').eq('role','teacher').eq('approval_status','pending').order('created_at');
    if(error){box.textContent='خطا در دریافت درخواست‌ها: '+error.message;return;}
    box.innerHTML=data.length?data.map(p=>'<div class="amir-list-row"><b>'+esc(p.display_name)+'</b><div class="small">'+new Date(p.created_at).toLocaleDateString('fa-IR')+'</div><div class="amir-auth-actions"><button class="btn" data-approve="'+p.id+'">تأیید</button><button class="btn outline" data-reject="'+p.id+'">رد درخواست</button></div></div>').join(''):'درخواست معلم در انتظار وجود ندارد.';
    box.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>setTeacher(b.dataset.approve,'approved'));
    box.querySelectorAll('[data-reject]').forEach(b=>b.onclick=()=>setTeacher(b.dataset.reject,'rejected'));
  }
  async function setTeacher(id,status){
    const {error}=await client.rpc('admin_set_teacher_status',{p_teacher_id:id,p_status:status});
    if(error){alert('تغییر وضعیت انجام نشد: '+error.message);return;}
    await loadPending();
  }
  async function logout(){await client.auth.signOut();profile=null;render();}
  function init(){
    inject();
    $('amirAccountOpen').addEventListener('click',()=>{if(profile){if(confirm('از حساب خارج شوی؟'))logout();}else $('amirAuthOverlay').classList.add('open');});
    if(!ready){return;}
    client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    client.auth.onAuthStateChange((_event,session)=>{if(!session){profile=null;render();}else setTimeout(loadProfile,0);});
    loadProfile();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.AmirAuth={get profile(){return profile;},get client(){return client;},get ready(){return ready;},refresh:loadProfile};
})();
