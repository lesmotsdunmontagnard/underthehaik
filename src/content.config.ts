import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
export const categories = ['Faith','Heritage','Society','Technology','Motherhood','Personal Essays'] as const;
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title:z.string(), description:z.string(), pubDate:z.coerce.date(), updatedDate:z.coerce.date().optional(),
    category:z.enum(categories), tags:z.array(z.string()).default([]), language:z.enum(['en','fr']).default('en'),
    featured:z.boolean().default(false), draft:z.boolean().default(false), placeholder:z.boolean().default(false),
    translationOf:z.string().optional(),
    series:z.object({name:z.string().trim().min(1),part:z.number().int().positive()}).optional(),
    coverLayout:z.enum(['top','side']).default('top'),
    coverImage:z.string().startsWith('/').optional(), coverAlt:z.string().optional(),
    cover:z.object({src:z.string().startsWith('/images/articles/'),alt:z.string().trim().min(10,'Describe what the image shows (at least 10 characters).'),caption:z.string().optional(),credit:z.string().optional(),creditUrl:z.url().refine(value=>/^https?:\/\//.test(value),'Use an HTTP(S) source URL.').optional(),position:z.string().default('center')}).refine(c=>!c.creditUrl||!!c.credit?.trim(),{message:'Provide credit text with creditUrl.'}).optional(),
  }).refine(data => !data.coverImage || !!data.coverAlt, {message:'Provide coverAlt when using coverImage.'}),
});
export const collections = { articles };
