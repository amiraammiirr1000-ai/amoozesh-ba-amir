/* Support center v1 — local-first feedback and transparent contact flow */
(function(){
 'use strict';
 const KEY='amirSupportFeedbackV1';
 const byId=id=>document.getElementById(id);
 function readItems(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}}
 function status(message){const el=byId('supportStatus');if(el)el.textContent=message}
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
   try{const items=readItems();items.push(item);localStorage.setItem(KEY,JSON.stringify(items.slice(-50)))}catch(_){status('ذخیره محلی ممکن نشد؛ مجوز فضای ذخیره‌سازی را بررسی کن.');return false;}
   const textBody='پیام برای آموزش با امیر\nموضوع: '+item.type+'\n'+item.message+(item.contact?'\nراه پاسخ: '+item.contact:'');
   status('پیام روی همین دستگاه ذخیره شد. برای ارسال آن، گزینه اشتراک‌گذاری را انتخاب کن؛ هنوز به سرور پشتیبانی ارسال نشده است.');
   try{
     if(navigator.share){await navigator.share({title:'پیشنهاد و انتقاد | آموزش با امیر',text:textBody});status('پنجره اشتراک‌گذاری باز شد. اگر پیام را ارسال کردی، کار تمام است.');}
     else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(textBody);status('متن پیام کپی شد. آن را از طریق راه ارتباطی دلخواه ارسال کن.');}
     else {const w=window.open('https://www.instagram.com/amoozesh_ba_amir/','_blank','noopener');status('پیام ذخیره شد. از صفحه اینستاگرام آموزش با امیر برای ارسال دستی استفاده کن.');}
   }catch(_){status('پیام در پیش‌نویس همین دستگاه باقی ماند؛ برای ارسال دستی از اینستاگرام آموزش با امیر استفاده کن.');}
   return false;
 };
 window.exportSupportFeedback=function(){
   const items=readItems();if(!items.length){status('هنوز پیامی در این دستگاه ذخیره نشده است.');return;}
   const blob=new Blob([JSON.stringify({schemaVersion:1,items},null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='amoozesh-ba-amir-feedback.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   status('نسخه‌ای از پیام‌های ذخیره‌شده دانلود شد.');
 };
})();