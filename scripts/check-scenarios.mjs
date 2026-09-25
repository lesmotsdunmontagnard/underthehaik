import {writeFile,unlink,readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
const created=[];
const env={...process.env,ASTRO_TELEMETRY_DISABLED:'1',SITE_URL:'https://example.github.io',BASE_PATH:'/journal',BUILD_DIR:'work/scenario-dist'};
function run(args){const r=spawnSync(process.execPath,args,{env,stdio:'inherit'});if(r.status!==0)throw Error(`Scenario command failed (${r.status})`);}
async function fixture(name,body){const file=`src/content/articles/${name}.md`;await writeFile(file,body,{flag:'wx'});created.push(file);}
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
try{
 await fixture('validation-private-draft','---\ntitle: PRIVATE_DRAFT_SENTINEL\ndescription: PRIVATE_DRAFT_SENTINEL\npubDate: 2026-09-08\ncategory: Faith\ntags: [private-sentinel]\nlanguage: en\ndraft: true\nfeatured: true\n---\nPRIVATE_DRAFT_SENTINEL');
 await fixture('validation-french','---\ntitle: Une réflexion\ndescription: Un texte de vérification.\npubDate: 2026-08-01\ncategory: Technology\ntags: [digital books]\nlanguage: fr\ndraft: false\n---\nUne réflexion en français.');
 run(['node_modules/astro/bin/astro.mjs','build','--outDir',env.BUILD_DIR]);
 run(['scripts/check-build.mjs']);
 for(const f of await files(env.BUILD_DIR)){if(!/\.(html|xml|txt)$/.test(f))continue;const content=await readFile(f,'utf8');assert.ok(!content.includes('PRIVATE_DRAFT_SENTINEL')&&!content.includes('private-sentinel')&&!content.includes('validation-private-draft'),`Draft leaked into ${f}`);}
 const french=await readFile(`${env.BUILD_DIR}/essays/validation-french/index.html`,'utf8');assert.match(french,/<html lang="fr"/);assert.ok(french.includes('Related writing'));assert.ok(french.includes('https://example.github.io/journal/essays/validation-french/'));
 const rss=await readFile(`${env.BUILD_DIR}/rss.xml`,'utf8');assert.ok(rss.includes('https://example.github.io/journal/essays/'));
 const sitemap=await readFile(`${env.BUILD_DIR}/sitemap-0.xml`,'utf8');assert.ok(sitemap.includes('https://example.github.io/journal/essays/'));
 console.log('Passed: draft exclusion, French article language, related articles, project-subpath links, canonical URLs, RSS and sitemap.');
}finally{for(const file of created)await unlink(file);}

