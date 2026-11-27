/* Complete local backup manager: localStorage + IndexedDB (dictionary and personal English files). */
(()=>{'use strict';
 const DB_DEFS=[
  {name:'ABA-English-Dictionary-v2',stores:[{name:'words',keyPath:'english'},{name:'meta',keyPath:'key'}]},
  {name:'AmoozeshBaAmirLibrary',stores:[{name:'files',keyPath:'id',autoIncrement:true}]}
 ];
 const MAX_BYTES=100*1024*1024;
 const $=id=>document.getElementById(id);
 const status=msg=>{const el=$('backupStatus');if(el)el.textContent=msg};
 const isAllowed=k=>typeof window.isAmirBackupKey==='function'?window.isAmirBackupKey(k):false;
 const toBase64=blob=>new Promise((resolve,reject)=>{
  const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]||'');reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob);
 });
 const fromBase64=(value,type)=>{const raw=atob(value),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new Blob([bytes],{type:type||'application/octet-stream'})};
 async function encode(value){
  if(typeof Blob!=='undefined'&&value instanceof Blob)return {__abaBackupType:'Blob',mime:value.type||'',data:await toBase64(value)};
  if(Array.isArray(value))return Promise.all(value.map(encode));
  if(value&&typeof value==='object'){const out={};for(const [k,v] of Object.entries(value))out[k]=await encode(v);return out}
  return value;
 }
 function decode(value){
  if(Array.isArray(value))return value.map(decode);
  if(value&&typeof value==='object'){
   if(value.__abaBackupType==='Blob'&&typeof value.data==='string')return fromBase64(value.data,value.mime);
   const out={};for(const [k,v] of Object.entries(value))out[k]=decode(v);return out;
  }
  return value;
 }
 function openDB(def){
  return new Promise((resolve,reject)=>{
   const req=indexedDB.open(def.name);
   req.onupgradeneeded=()=>{const db=req.result;for(const s of def.stores)if(!db.objectStoreNames.contains(s.name))db.createObjectStore(s.name,{...(s.keyPath?{keyPath:s.keyPath}:{}),...(s.autoIncrement?{autoIncrement:true}:{})})};
   req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
 }
 async function getDBSnapshot(def){
  const known=typeof indexedDB.databases==='function'?await indexedDB.databases():null;
  if(known&&!known.some(x=>x.name===def.name))return null;
  const db=await openDB(def);
  try{
   const stores={};
   for(const s of def.stores){
    if(!db.objectStoreNames.contains(s.name)){stores[s.name]=[];continue}
    stores[s.name]=await new Promise((resolve,reject)=>{
     const req=db.transaction(s.name,'readonly').objectStore(s.name).getAll();
     req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
    });
    stores[s.name]=await encode(stores[s.name]);
   }
   return {name:def.name,stores};
  }finally{db.close()}
 }
 async function restoreDBSnapshot(def,snapshot){
  const db=await openDB(def);
  try{
   for(const s of def.stores){
    if(!db.objectStoreNames.contains(s.name))continue;
    const rows=Array.isArray(snapshot.stores?.[s.name])?decode(snapshot.stores[s.name]):[];
    await new Promise((resolve,reject)=>{
     const tx=db.transaction(s.name,'readwrite'),store=tx.objectStore(s.name);store.clear();
     for(const row of rows)store.put(row);
     tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('IndexedDB restore aborted'));
    });
   }
  }finally{db.close()}
 }
 async function exportAll(){
  const payload={app:'آموزش با امیر',schemaVersion:4,exportedAt:new Date().toISOString(),data:{},indexedDB:[]};
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);if(!key||!isAllowed(key))continue;
   const value=localStorage.getItem(key);if(value!==null)payload.data[key]=value;
  }
  status('در حال آماده‌سازی فایل‌های شخصی و بانک واژگان…');
  for(const def of DB_DEFS){const snapshot=await getDBSnapshot(def);if(snapshot)payload.indexedDB.push(snapshot)}
  const json=JSON.stringify(payload),size=new Blob([json]).size;
  if(size>MAX_BYTES)throw new Error('حجم نسخه پشتیبان از ۱۰۰ مگابایت بیشتر است. فایل‌های حجیم را جداگانه نگه‌داری کن.');
  const blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='backup-amoozesh-ba-amir-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
  const fileCount=payload.indexedDB.find(x=>x.name==='AmoozeshBaAmirLibrary')?.stores?.files?.length||0;
  const wordCount=payload.indexedDB.find(x=>x.name==='ABA-English-Dictionary-v2')?.stores?.words?.length||0;
  status('نسخه پشتیبان ساخته شد؛ '+Object.keys(payload.data).length+' داده محلی، '+wordCount+' مدخل دیکشنری و '+fileCount+' فایل شخصی. اطلاعات ورود و توکن‌ها ذخیره نمی‌شوند.');
 }
 async function importAll(){
  const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange=async()=>{
   const file=input.files?.[0];if(!file)return;
   if(file.size>MAX_BYTES){alert('حجم فایل از سقف ۱۰۰ مگابایت بیشتر است.');return}
   try{
    status('در حال بررسی نسخه پشتیبان…');
    const obj=JSON.parse(await file.text());
    if(obj.app!=='آموزش با امیر'||![1,2,3,4].includes(obj.schemaVersion)||!obj.data||typeof obj.data!=='object'||Array.isArray(obj.data))throw new Error('ساختار فایل پشتیبان معتبر نیست.');
    const incoming=Object.entries(obj.data).filter(([k,v])=>isAllowed(k)&&typeof v==='string');
    const dbSnapshots=Array.isArray(obj.indexedDB)?obj.indexedDB:[];
    if(!incoming.length&&!dbSnapshots.length)throw new Error('هیچ داده قابل بازیابی در فایل پیدا نشد.');
    if(!confirm('اطلاعات محلی و کتابخانه‌های ذخیره‌شده در این دستگاه با اطلاعات فایل جایگزین شوند؟ اطلاعات ورود و توکن‌های امنیتی دست‌نخورده می‌مانند.'))return;
    const keep=new Set(incoming.map(([k])=>k));
    for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&isAllowed(key)&&!keep.has(key))localStorage.removeItem(key)}
    for(const [key,value] of incoming)localStorage.setItem(key,value);
    for(const def of DB_DEFS){const snapshot=dbSnapshots.find(x=>x?.name===def.name);if(snapshot)await restoreDBSnapshot(def,snapshot)}
    status('بازیابی اطلاعات محلی و پایگاه‌های داده انجام شد. برنامه در حال تازه‌سازی است…');
    alert('بازیابی انجام شد. برنامه برای بارگذاری دوباره اطلاعات تازه‌سازی می‌شود.');
    location.reload();
   }catch(error){status('بازیابی ناموفق بود: '+(error.message||'خطای نامشخص'));alert(error.message||'خواندن فایل پشتیبان ناموفق بود.')}
  };
  input.click();
 }
 window.exportFullBackup=()=>{exportAll().catch(e=>{status('ساخت نسخه پشتیبان ناموفق بود: '+(e.message||'خطا'));alert(e.message||'ساخت نسخه پشتیبان ناموفق بود.')})};
 window.importFullBackup=importAll;
})();