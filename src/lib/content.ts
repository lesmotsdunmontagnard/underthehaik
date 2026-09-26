import { getCollection, type CollectionEntry } from 'astro:content';
export { categories } from '../content.config';
export type Article = CollectionEntry<'articles'>;
export const slug = (text:string) => text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const url = (path='') => `${import.meta.env.BASE_URL.replace(/\/$/,'')}/${path.replace(/^\//,'')}`;
export const articleUrl = (a:Article) => url(`essays/${a.id}/`);
export const readingTime = (a:Article) => Math.max(1,Math.ceil((a.body || '').split(/\s+/).length/220));
export const date = (value:Date, language='en') => new Intl.DateTimeFormat(language==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(value);
// Published articles are already ordered newest first, including date ties.
export function latestByCategory(articles:Article[]) {
 const seen=new Set<string>();
 return articles.filter(article=>{
  if(seen.has(article.data.category))return false;
  seen.add(article.data.category);
  return true;
 });
}
export async function published(language:'en'|'fr'='en') {
 const entries=await getCollection('articles',({data})=>!data.draft);
 const groups=new Map<string,Article>();
 for(const entry of entries){const key=entry.data.translationOf||entry.id;const current=groups.get(key);if(!current||entry.data.language===language)groups.set(key,entry);}
 return [...groups.entries()].map(([id,entry])=>({...entry,id})).sort((a,b)=>b.data.pubDate.valueOf()-a.data.pubDate.valueOf()||a.id.localeCompare(b.id));
}
