// Accessible, responsive composer for the smart tutor.
(function(){
  function bindTutorComposer(){
    const input=document.getElementById('tutorInput');
    const form=input?.closest('form');
    const log=document.getElementById('chatlog');
    if(!input||!form||input.dataset.amirComposerBound==='1')return;
    input.dataset.amirComposerBound='1';
    input.style.minHeight='48px';
    input.style.maxHeight='168px';
    input.style.resize='none';
    input.style.overflowY='auto';
    input.style.fontSize='16px';
    input.style.lineHeight='1.7';
    const resize=()=>{
      input.style.height='auto';
      input.style.height=Math.min(Math.max(input.scrollHeight,48),168)+'px';
    };
    input.addEventListener('input',resize);
    input.addEventListener('keydown',event=>{
      if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){
        event.preventDefault();
        const send=form.querySelector('button[type="submit"],button:not([type])');
        if(!send?.disabled)form.requestSubmit();
      }
    });
    form.addEventListener('submit',()=>{requestAnimationFrame(()=>{input.style.height='auto';});});
    if(log&&'MutationObserver'in window){
      const observer=new MutationObserver(()=>{log.scrollTop=log.scrollHeight;});
      observer.observe(log,{childList:true});
    }
    resize();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindTutorComposer,{once:true});
  else bindTutorComposer();
})();
