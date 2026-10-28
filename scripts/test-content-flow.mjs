import fs from 'node:fs/promises';import assert from 'node:assert/strict';
let cookie='',csrf='';
async function q(action,body){const response=await fetch('http://127.0.0.1:18881/api/index.php?action='+action,{method:body?'POST':'GET',headers:{Cookie:cookie,'Content-Type':'application/json','X-CSRF-Token':csrf},body:body?JSON.stringify(body):undefined});if(response.headers.getSetCookie().length)cookie=response.headers.getSetCookie().map(s=>s.split(';')[0]).join('; ');const result=await response.json();if(result.csrf)csrf=result.csrf;return {status:response.status,...result};}
await q('session');assert.equal((await q('login',JSON.parse(await fs.readFile('backend/provision.local.json','utf8')))).status,200);
const id='verification-event-'+Date.now();const event={id,kind:'events',slug:id,status:'published',updated_at:'',data:{name:'Browserprüfung – Fight Night',description:'Temporärer Funktionstest. Kein angekündigtes Event.',date:'2099-01-01',time:'19:00',city:'Wien',venue:'Testansicht',image:'/assets/pages/heroes/events-hero-v1.webp'}};
assert.equal((await q('save',{record:{...event,data:{...event.data,date:'2099-99-99'}},publish:true,expected:null})).status,400);
assert.equal((await q('save',{record:event,publish:true,expected:null})).status,200);
const fight={id:id+'-fight',kind:'fightcards',slug:id+'-fight',status:'published',updated_at:'',data:{name:'Browserprüfung – Main Event',event:id,fighterA:'tanyo-tanev',fighterB:'liam-stancel',discipline:'mma',order:1,rounds:3,minutes:5}};
assert.equal((await q('save',{record:{...fight,data:{...fight.data,fighterB:'tanyo-tanev'}},publish:true,expected:null})).status,400);
assert.equal((await q('save',{record:fight,publish:true,expected:null})).status,200);
assert.equal((await q('save',{record:{...fight,id:id+'-duplicate',slug:id+'-duplicate'},publish:true,expected:null})).status,409);
const rows=await q('public');assert.equal(rows.published.filter(r=>r.kind==='fightcards'&&r.data.event===id).length,1);
const uploaded=await q('upload',{content:(await fs.readFile('public/assets/brand/wordmark-og.png')).toString('base64')});assert.equal(uploaded.status,200);assert.match(uploaded.url,/^\/assets\/uploads\/[a-f0-9]{32}\.webp$/);
await fs.writeFile('artifacts/content-flow.json',JSON.stringify({ids:[id,id+'-fight'],upload:uploaded.url}));await q('logout',{});
console.log('PASS: real event date validation, create event, reject self pairing, publish fightcard, duplicate position rejection, per-event public grouping, verified WebP upload.');
console.log('Temporary browser fixture: /events/detail/?slug='+id);
