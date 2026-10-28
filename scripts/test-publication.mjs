import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

// Deliberately fixed to the isolated review tunnel, never the production API.
const base='http://127.0.0.1:18884/api/index.php';
const credentials=JSON.parse(await fs.readFile('backend/review.local.json','utf8'));
const prefix=`publication-${Date.now()}`;
const created=[];
function client(){
 let cookie='',csrf='';
 return async function request(action,body,raw=false){
  const response=await fetch(`${base}?action=${action}`,{method:body===undefined?'GET':'POST',headers:{Cookie:cookie,'Content-Type':'application/json','X-CSRF-Token':csrf},body:body===undefined?undefined:raw?body:JSON.stringify(body)});
  if(response.headers.getSetCookie().length)cookie=response.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
  const data=await response.json();if(data.csrf)csrf=data.csrf;
  return {status:response.status,data};
 };
}
const q=client(),other=client();
async function records(){return (await q('records')).data;}
async function save(r,publish=true){const current=(await records()).drafts.find(x=>x.id===r.id);const result=await q('save',{record:r,publish,expected:current?.updated_at??null});if(result.status===200&&!created.includes(r.id))created.push(r.id);return result;}
const record=(suffix,kind,data)=>({id:`${prefix}-${suffix}`,slug:`${prefix}-${suffix}`,kind,status:'draft',updated_at:'',data});
try{
 for(const request of [q,other]){assert.equal((await request('session')).status,200);assert.equal((await request('login',credentials)).status,200);}
 assert.equal((await q('save','{',true)).status,400,'Malformed JSON must return 400');
 const a=record('slug-a','partners',{name:'Publication verification A'});
 assert.equal((await save(a)).status,200);
 assert.equal((await save({...a,slug:`a-new-${prefix}`},false)).status,200);
 const b={...record('slug-b','partners',{name:'Publication verification B'}),slug:a.slug};
 assert.equal((await save(b)).status,409,'Public slug remains reserved after draft rename');
 const settings=(await records()).drafts.find(r=>r.kind==='settings');assert.ok(settings);
 assert.equal((await save({...settings,id:`${prefix}-settings`,slug:`${prefix}-settings`})).status,409,'Settings are a singleton');
 const event=record('event','events',{name:'Publication verification event',date:'2026-12-20'});
 const red=record('red','fighters',{name:'Publication verification red'});
 const blue=record('blue','fighters',{name:'Publication verification blue'});
 const discipline=record('discipline','disciplines',{name:'Publication verification discipline'});
 for(const r of [event,red,blue,discipline])assert.equal((await save(r)).status,200);
 const fight=record('fight','fightcards',{name:'Publication verification fight',event:event.id,fighterA:red.id,fighterB:blue.id,discipline:discipline.id,order:1,rounds:3,minutes:5});
 assert.equal((await save(fight)).status,200);
 assert.equal((await save({...red,data:{...red.data,bio:'Unpublished revision'}},false)).status,200);
 assert.equal((await save(fight)).status,200,'Published athlete with a newer draft remains a valid reference');
 assert.equal((await save({...fight,data:{...fight.data,order:2}},false)).status,200);
 const collision={...fight,id:`${prefix}-fight-collision`,slug:`${prefix}-fight-collision`};
 assert.equal((await save(collision)).status,409,'Public fight position stays reserved after draft move');
 const secondFight={...fight,id:`${prefix}-second-fight`,slug:`${prefix}-second-fight`,data:{...fight.data,name:'Second verification fight',order:3}};
 assert.equal((await save(secondFight)).status,200);
 const beforeOrder=await records();
 const orderPayload={event:event.id,ids:[secondFight.id,fight.id],expected:Object.fromEntries(beforeOrder.drafts.filter(r=>r.kind==='fightcards'&&r.data.event===event.id).map(r=>[r.id,r.updated_at]))};
 assert.equal((await q('reorder',{...orderPayload,publish:false})).status,200,'Reorder all draft positions together');
 const draftOrder=await records();assert.equal(draftOrder.published.find(r=>r.id===fight.id).data.order,1,'Draft order leaves public order unchanged');
 assert.equal(draftOrder.drafts.find(r=>r.id===secondFight.id).data.order,1);
 assert.equal((await q('reorder',{...orderPayload,publish:true})).status,409,'Reject stale reorder');
 const freshExpected=Object.fromEntries(draftOrder.drafts.filter(r=>r.kind==='fightcards'&&r.data.event===event.id).map(r=>[r.id,r.updated_at]));
 assert.equal((await q('reorder',{...orderPayload,ids:[fight.id,fight.id],expected:freshExpected,publish:true})).status,400,'Reject duplicate fight IDs');
 assert.equal((await q('reorder',{...orderPayload,expected:freshExpected,publish:true})).status,200,'Publish the order atomically');
 const publishedOrder=await records();assert.equal(publishedOrder.published.find(r=>r.id===fight.id).data.order,2);assert.equal(publishedOrder.published.find(r=>r.id===secondFight.id).data.order,1);
 const concurrentA=record('concurrent-a','partners',{name:'Concurrent publication A'});
 const concurrentB={...record('concurrent-b','partners',{name:'Concurrent publication B'}),slug:concurrentA.slug};
 const responses=await Promise.all([q('save',{record:concurrentA,publish:true,expected:null}),other('save',{record:concurrentB,publish:true,expected:null})]);
 responses.forEach((r,i)=>{if(r.status===200)created.push([concurrentA.id,concurrentB.id][i]);});
 assert.deepEqual(responses.map(r=>r.status).sort(),[200,409],'Concurrent duplicate publication must be rejected');
 console.log('Publication checks passed: malformed JSON, public slug, singleton settings, draft references, public fight position, concurrent writes.');
}finally{
 for(const id of [...created].reverse()){
  const r=(await records()).drafts.find(x=>x.id===id);if(!r)continue;
  assert.equal((await save({...r,status:'archived'},false)).status,200,`Archive test record ${id}`);
  const archived=(await records()).drafts.find(x=>x.id===id);
  assert.equal((await q('delete',{id,expected:archived.updated_at})).status,200,`Remove test record ${id}`);
 }
 await q('logout',{});await other('logout',{});
 console.log('Isolated publication test records removed.');
}
