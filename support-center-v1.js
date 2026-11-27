/* Support center v2 — online feedback with local-first fallback and admin inbox. */
(function(){
 'use strict';
 const KEY='amirSupportFeedbackV1',VERSION='3.2.0';
 let storageKey=KEY;
 function switchUser(userId){storageKey=userId?KEY+':user:'+String(userId):KEY+':guest';}
 function readItems(){try{const x=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}}
 const byId=id=>document.getElementById(id);
 function status(message){const el=byId('supportStatus');if(el)el.textContent=message}
 function client(){return window.AmirAuth?.client||null}
 function profile(){return window.AmirAuth?.profile||null}
 window.openPlanFeedback=function(plan){
   if(typeof showView==='function')showView('support');
   const type=byId('supportType'),message=byId('supportMessage');
   if(type)type.value='درخواست امکانات / اشتراک';
   if(message)message.value='درباره طرح «'+String(plan||'اشتراک')+'» و شرایط فعال‌سازی آن اطلاعات می‌خواهم.';
   if(message)message.focus();
 };
 window.submitSupportFeedback=async function(event){
   if(event&&event.preventDefault)event.preventDefault();
   const type=byId('supportType'),message=byId('supportMessage'),contact=byId('supportContact');
   const body=(message&&message.value||'').trim();
   if(body.length<8){status('لطفاً پیام را کمی کامل‌تر بنویس.');return false;}
   const item={id:'FB-'+Date.now(),type:type?type.value:'پیشنهاد',message:body,contact:contact?contact.value.trim():'',createdAt:new Date().toISOString()};
   try{const items=readItems();items.push(item);localStorage.setItem(storageKey,JSON.stringify(items.slice(-50)))}catch(_){status('ذخیره محلی ممکن نشد؛ مجوز فضای ذخیره‌سازی را بررسی کن.');return false;}
   const authClient=client(),user=profile();
   if(authClient&&user?.id){
     try{
       const {error}=await authClient.from('support_feedback').insert({user_id:user.id,category:item.type,message:item.message,contact:item.contact||null,app_version:VERSION});
       if(!error){status('پیام با موفقیت به سامانه پشتیبانی ارسال شد. شناسه محلی: '+item.id);if(message)message.value='';if(contact)contact.value='';await loadInbox();return false;}
       status('ارسال آنلاین در دسترس نیست؛ پیش‌نویس ذخیره شد. پیام را می‌توانی دستی هم ارسال کنی.');
     }catch(_){status('ارسال آنلاین برقرار نشد؛ پیش‌نویس روی دستگاه ذخیره شد.');}
   }else status('برای ارسال آنلاین ابتدا وارد حساب شو؛ پیش‌نویس روی دستگاه ذخیره شد.');
   const textBody='پیام برای آموزش با امیر\nموضوع: '+item.type+'\n'+item.message+(item.contact?'\nراه پاسخ: '+item.contact:'');
   try{
     if(navigator.share){await navigator.share({title:'پیشنهاد و انتقاد | آموزش با امیر',text:textBody});status('پنجره اشتراک‌گذاری باز شد. اگر پیام را ارسال کردی، کار تمام است.');}
     else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(textBody);status('متن پیام کپی شد. آن را از طریق راه ارتباطی دلخواه ارسال کن.');}
     else {window.open('https://www.instagram.com/amoozesh_ba_amir/','_blank','noopener');status('پیام ذخیره شد؛ از اینستاگرام آموزش با امیر برای ارسال دستی استفاده کن.');}
   }catch(_){status('پیام در پیش‌نویس همین دستگاه باقی ماند؛ برای ارسال دستی از اینستاگرام استفاده کن.');}
   return false;
 };
 window.exportSupportFeedback=function(){
   const items=readItems();if(!items.length){status('هنوز پیامی در این دستگاه ذخیره نشده است.');return;}
   const blob=new Blob([JSON.stringify({schemaVersion:2,items},null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='amoozesh-ba-amir-feedback.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   status('نسخه‌ای از پیام‌های ذخیره‌شده دانلود شد.');
 };
 function ensureInbox(){
  const view=byId('support');if(!view)return;
  let box=byId('supportAdminInbox');
  if(!box){box=document.createElement('div');box.id='supportAdminInbox';box.className='card support-admin-inbox';view.append(box);}
  const admin=profile()?.role==='admin';
  box.hidden=!admin;
  if(admin&&!box.dataset.ready){box.dataset.ready='1';box.innerHTML='<div class="section-head"><div><h3>صندوق پیام‌های کاربران</h3><p class="small">فقط مدیر کل به پیام‌های همه کاربران دسترسی دارد.</p></div><button id="supportInboxRefresh" class="btn outline" type="button">به‌روزرسانی</button></div><div id="supportInboxList" class="small">برای دریافت پیام‌ها، جدول پشتیبانی باید در Supabase ایجاد شده باشد.</div>';byId('supportInboxRefresh').addEventListener('click',loadInbox);}
 }
 async function loadInbox(){
  ensureInbox();if(profile()?.role!=='admin')return;
  const list=byId('supportInboxList'),c=client();if(!list||!c)return;
  list.textContent='در حال دریافت پیام‌ها…';
  const {data,error}=await c.from('support_feedback').select('id,user_id,category,message,contact,status,created_at').order('created_at',{ascending:false}).limit(50);
  if(error){list.textContent='صندوق آنلاین هنوز آماده نیست یا دسترسی لازم وجود ندارد. اگر مهاجرت پشتیبانی اجرا نشده، فایل backend/support-feedback-v1.sql را در SQL Editor اجرا کن.';return;}
  if(!data.length){list.textContent='هنوز پیامی دریافت نشده است.';return;}
  list.innerHTML=data.map(x=>'<article class="support-inbox-item"><div class="support-inbox-meta"><b>'+String(x.category||'پیام').replace(/[&<>"]/g,'')+'</b><span>'+new Date(x.created_at).toLocaleString('fa-IR')+'</span><span class="tag">'+(x.status==='resolved'?'رسیدگی‌شده':x.status==='reviewing'?'در حال بررسی':'جدید')+'</span></div><p>'+String(x.message||'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]))+'</p><div class="small">شناسه کاربر: '+String(x.user_id||'').slice(0,8)+(x.contact?' · راه پاسخ: '+String(x.contact).replace(/[&<>"]/g,''):'')+'</div>'+(x.status!=='resolved'?'<button class="btn light" type="button" data-support-resolve="'+x.id+'">ثبت رسیدگی</button>':'')+'</article>').join('');
 }
 document.addEventListener('click',async e=>{const b=e.target.closest('[data-support-resolve]');if(!b)return;const c=client();if(!c)return;b.disabled=true;const {error}=await c.from('support_feedback').update({status:'resolved',updated_at:new Date().toISOString()}).eq('id',b.dataset.supportResolve);if(error){status('تغییر وضعیت پیام انجام نشد.');b.disabled=false;return;}await loadInbox();});
 window.addEventListener('amir:user-changed',event=>{switchUser(event.detail?.userId||null);ensureInbox();if(profile()?.role==='admin')loadInbox();});
 switchUser(profile()?.id||null);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ensureInbox();if(profile()?.role==='admin')loadInbox();},{once:true});else{ensureInbox();if(profile()?.role==='admin')loadInbox();}
})();