import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile(new URL('./math-game-engine-v2.js',import.meta.url),'utf8');
function harness(){
 const els={};
 for(const id of ['gameStage','mathGameInput','mathGameFeedback','mathGameCheckBtn','gameProgress']){
  els[id]={id,innerHTML:'',textContent:'',value:'',disabled:false,focus(){},addEventListener(){},scrollIntoView(){},classList:{add(){},remove(){}}};
 }
 const document={getElementById:id=>els[id]||null,addEventListener(){}};
 const state={points:0,gameStats:{}};
 const window={state,fa:String,persist(){this.persisted=(this.persisted||0)+1},renderStats(){},showView(){}};
 const math=Object.create(Math);math.random=()=>0;
 const context={window,document,state,Math:math,Number,String,Object,Array,JSON,localStorage:{getItem(){return null},setItem(){}},setTimeout(){},console};
 vm.createContext(context);vm.runInContext(source,context);
 return {window,els,state};
}
const answers={1:'ده‌هزارگان',2:'بله',3:'9',4:'=',5:'11',6:'-4,-4',7:'<',8:'1/1'};
for(let id=1;id<=8;id++){
 const h=harness();h.window.startMathGame(id);
 assert.match(h.els.gameStage.innerHTML,/بررسی پاسخ/,'game '+id+' must render an answer control');
 assert.ok(h.els.mathGameInput,'game '+id+' input must exist');
 h.els.mathGameInput.value=answers[id];h.window.checkMathGame();
 assert.equal(h.state.gameStats[id].correct,1,'game '+id+' must accept a correct answer');
 assert.equal(h.state.points,10,'game '+id+' must award 10 points');
 assert.equal(h.els.mathGameInput.disabled,true,'game '+id+' must lock a solved round');
 h.window.checkMathGame();
 assert.equal(h.state.gameStats[id].correct,1,'game '+id+' must not double-award');
 h.window.nextMathGame();
 assert.match(h.els.gameStage.innerHTML,/مرحله/,'game '+id+' must advance to the next question');
}
{
 const h=harness();h.window.openGameLab();assert.match(h.els.gameProgress.innerHTML,/کارنامه بازیگاه/);
 h.window.startMathGame(1);h.window.showMathGameHint();assert.match(h.els.mathGameFeedback.textContent,/راهنما/);
 for(let i=0;i<10;i++)h.window.nextMathGame();
 assert.match(h.els.gameStage.innerHTML,/دور جدید/,'a ten-question round must end cleanly');
}
console.log('PASS: runtime test for all 8 games: render, correct answer, score, no duplicate award, hint, next question, progress and round completion.');
