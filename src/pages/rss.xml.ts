import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import {published,articleUrl} from '../lib/content';
export async function GET(context:APIContext){return rss({title:'Under the Haik',description:'Rooted in faith, shaped by heritage.',site:context.site!,items:(await published()).map(a=>({title:a.data.title,description:a.data.description,pubDate:a.data.pubDate,link:articleUrl(a),categories:[a.data.category,...a.data.tags]}))});}
