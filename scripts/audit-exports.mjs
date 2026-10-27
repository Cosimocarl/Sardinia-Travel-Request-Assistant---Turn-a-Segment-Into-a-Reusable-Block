import fs from 'node:fs';
import path from 'node:path';
const dir=new URL('../workflows/',import.meta.url);let issues=[];
for(const name of ['main.json','validate-request.json','record-failure.json']) if(!fs.existsSync(new URL(name,dir))) issues.push(`${name}: required tested export missing`);
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json'))) {
 let w;const text=fs.readFileSync(new URL(name,dir),'utf8');
 try{w=JSON.parse(text);}catch{issues.push(`${name}: invalid JSON`);continue;}
 if(!Array.isArray(w.nodes))issues.push(`${name}: expected a single workflow object`);
 if(w.active===true)issues.push(`${name}: active export; review manual-only scope`);
 if(w.pinData&&Object.keys(w.pinData).length)issues.push(`${name}: pinned data present`);
 for(const n of w.nodes||[])if(n.credentials&&Object.keys(n.credentials).length)issues.push(`${name}: credential bindings present on ${n.name}`);
 if(/AIza[0-9A-Za-z_-]{30,}|gh[pousr]_[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text))issues.push(`${name}: possible secret pattern`);
}
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('Basic export checks passed. Manually inspect private data and scan Git history separately.');
