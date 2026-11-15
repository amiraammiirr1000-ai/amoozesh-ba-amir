/* Biamoz worksheet directory — links open the original publisher pages. */
(()=>{'use strict';
const grades=[
{n:1,url:'https://biamoz.com/doc/ابتدایی/اول/',subjects:'ریاضی، علوم، فارسی و قرآن'},
{n:2,url:'https://biamoz.com/doc/ابتدایی/دوم/',subjects:'ریاضی، علوم، فارسی، هدیه و قرآن'},
{n:3,url:'https://biamoz.com/doc/ابتدایی/سوم/',subjects:'ریاضی، علوم، فارسی، مطالعات و هدیه'},
{n:4,url:'https://biamoz.com/doc/ابتدایی/چهارم/',subjects:'ریاضی، علوم، فارسی، مطالعات و هدیه'},
{n:5,url:'https://biamoz.com/doc/ابتدایی/پنجم/',subjects:'ریاضی، علوم، فارسی، مطالعات و هدیه'},
{n:6,url:'https://biamoz.com/doc/ابتدایی/ششم/',subjects:'ریاضی، علوم، فارسی، مطالعات، قرآن و تفکر'}
];
function mount(){
 const view=document.getElementById('worksheets');if(!view||document.getElementById('biamozWorksheetLibrary'))return;
 const card=document.createElement('div');card.id='biamozWorksheetLibrary';card.className='card';
 card.innerHTML='<div class="section-head"><h3>کتابخانه کاربرگ‌های بیاموز</h3><span class="tag">منابع بیرونی</span></div><p class="small">کاربرگ‌ها و نمونه‌سؤال‌ها را بر اساس پایه انتخاب کن. هر گزینه صفحه اصلی همان پایه در سایت بیاموز را باز می‌کند.</p><div class="home-v3-grade-grid">'+grades.map(g=>'<a class="home-v3-grade" style="text-decoration:none" href="'+g.url+'" target="_blank" rel="noopener"><span>📂</span>پایه '+('۰۱۲۳۴۵۶'[g.n])+'<small style="display:block;color:var(--muted);font-weight:400;margin-top:5px">'+g.subjects+'</small></a>').join('')+'</div><div class="home-v3-note" style="margin-top:12px">فایل‌های رایگان و پولی در سایت از هم جدا هستند. فعلاً برنامه فقط به صفحه اصلی منبع پیوند می‌دهد و هیچ فایل پولی یا دارای حق نشر را کپی نمی‌کند. برای ذخیره نسخه‌ای داخل برنامه و حذف صفحه آخر، باید مجوز بازنشر/استفاده از فایل‌ها روشن باشد.</div><p class="small" style="margin-top:8px"><a href="https://biamoz.com/" target="_blank" rel="noopener">ورود به سایت بیاموز</a></p>';
 const head=view.querySelector('.section-head');if(head)head.after(card);else view.prepend(card);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
