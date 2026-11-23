import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('./student-growth-suite-v1.js',import.meta.url),'utf8');
const store={abaGrowthSuiteV1:JSON.stringify({xp:7,streak:2,lastDay:'2026-11-23',days:[],answers:1,correct:1,badges:['first'],sessions:[],mission:{day:'',done:[]},events:[]})};
const localStorage={
 getItem(key){return Object.prototype.hasOwnProperty.call(store,key)?store[key]:null},
 setItem(key,value){store[key]=String(value)}
};
const listeners={};
const window={
 addEventListener(name,fn){(listeners[name]??=[]).push(fn)},
 dispatchEvent(event){(listeners[event.type]||[]).forEach(fn=>fn(event))}
};
const document={readyState:'loading',addEventListener(){},getElementById(){return null}};
const context={window,document,localStorage,Date,JSON,Math,String,Number,Object,Array,Event:class{constructor(type){this.type=type}},setTimeout(){},console};
vm.createContext(context);vm.runInContext(source,context);
assert.equal(window.AbaGrowth.snapshot().xp,7,'legacy guest progress must be preserved');
assert.ok(store['abaGrowthSuiteV1:guest'],'legacy progress must be migrated to guest scope');
window.AbaGrowth.switchUser('student-A');
assert.equal(window.AbaGrowth.snapshot().xp,0,'new student must start with isolated progress');
window.AbaGrowth.award(true,'fractions');
assert.equal(window.AbaGrowth.snapshot().xp,10);
window.AbaGrowth.switchUser('student-B');
assert.equal(window.AbaGrowth.snapshot().xp,0,'a second student must not see the first student progress');
window.AbaGrowth.award(false,'decimals');
assert.equal(window.AbaGrowth.snapshot().xp,2);
window.AbaGrowth.switchUser('student-A');
assert.equal(window.AbaGrowth.snapshot().xp,10,'returning student must recover their own progress');
window.AbaGrowth.switchUser(null);
assert.equal(window.AbaGrowth.snapshot().xp,7,'logging out must return to preserved guest progress');
console.log('PASS: growth and gamification data are isolated per account; legacy guest data is preserved.');
