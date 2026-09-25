import {readFile,readdir,access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.BUILD_DIR||'dist');
const base=(process.env.BASE_PATH||'').replace(/\/$/,'');
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root);const html=files.filter(f=>f.endsWith('.html'));
for(const f of html){const text=await readFile(f,'utf8');assert.match(text,/<title>.+<\/title>/);assert.match(text,/name="description"/);assert.match(text,/rel="canonical"/);for(const [,href] of text.matchAll(/(?:href|src)="([^"#]+)"/g)){if(!href.startsWith('/'))continue;assert.ok(!base||href.startsWith(base+'/'),`Missing base path: ${href}`);const local=decodeURIComponent(href.slice(base.length).split(/[?#]/)[0]);const target=path.join(root,local.endsWith('/')?`${local}index.html`:local);await access(target).catch(()=>{throw Error(`Broken local link in ${f}: ${href}`);});}}
for(const name of ['rss.xml','sitemap-index.xml','robots.txt'])await access(path.join(root,name));
const home=await readFile(path.join(root,'index.html'),'utf8');assert.ok(home.includes('Essays on faith, heritage and the changing world, through an Algerian Muslim woman’s lens.'));assert.ok(!home.includes('Where culture meets faith'));assert.ok(!home.includes('THREADS OF BELONGING'));
console.log(`Checked ${html.length} HTML pages: metadata, local links/assets, base paths, homepage copy, RSS, sitemap, and robots file.`);
for(const page of ['index.html','essays/index.html','categories/index.html','about/index.html','contact/index.html','privacy/index.html','essays/who-owns-the-book/index.html']){const content=await readFile(path.join(root,'fr',page),'utf8');assert.match(content,/<html lang="fr"/);assert.ok(content.includes('Mode sombre'));assert.ok(content.includes('Accueil'));}
console.log('French page language and translated navigation verified.');
const example=await readFile(path.join(root,'essays/who-owns-the-book/index.html'),'utf8');
assert.match(example,/srcset="/);assert.match(example,/\.webp/);
for(const [,attrs] of example.matchAll(/<img\s+([^>]+)>/g)){if(attrs.includes('class="brand-logo"'))continue;assert.match(attrs,/alt="[^"]{10,}"/);assert.match(attrs,/width="\d+"/);assert.match(attrs,/height="\d+"/);}
console.log('Article cover, responsive sources, alt text and intrinsic dimensions verified.');

