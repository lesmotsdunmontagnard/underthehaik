import type {ImageMetadata} from 'astro';
const images=import.meta.glob<{default:ImageMetadata}>('/public/images/articles/**/*.{jpg,jpeg,png,webp,avif}',{eager:true});
export interface EditorialImageData {src:string;alt:string;caption?:string;credit?:string;creditUrl?:string;position?:string;}
export function resolveEditorialImage(src:string,alt:string){
 if(!alt||alt.trim().length<10)throw new Error(`Write meaningful alternative text (at least 10 characters) for ${src}.`);
 const entry=images[`/public${src}`];
 if(!entry)throw new Error(`Editorial image not found: ${src}. Save a JPG, PNG, WebP or AVIF under public/images/articles/.`);
 return entry.default;
}
export function validateCredit(credit?:string,creditUrl?:string){if(creditUrl&&(!credit?.trim()||!/^https?:\/\//.test(creditUrl)))throw new Error('Image credits require a label and an HTTP(S) URL.');}
