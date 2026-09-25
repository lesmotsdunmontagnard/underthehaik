# Under the Haik

Website: https://lesmotsdunmontagnard.github.io/underthehaik/

French version: https://lesmotsdunmontagnard.github.io/underthehaik/fr/

Publishing: push changes to `main`; GitHub Actions builds and deploys this repository to GitHub Pages.

A static personal journal built with Astro and Markdown. The default theme uses warm linen, ivory, charcoal, and deep olive. Dark mode is optional. No database, accounts, analytics, cookies, external fonts, or subscription service are included.

## Preview locally

Install Node.js 24 LTS and pnpm 11.19.0. In this folder:

```sh
pnpm install
pnpm dev
```

Open the local address printed in the terminal (normally http://localhost:4321). Leave the terminal running while editing. Stop it with Ctrl+C.

To disable Astro's developer telemetry in PowerShell, run `$env:ASTRO_TELEMETRY_DISABLED='1'` before the commands. This telemetry is a framework developer feature, not part of the published website.

```sh
pnpm check
pnpm build
pnpm test
pnpm preview
```

The complete static website is generated in `dist/`. Never edit generated files there.

## Write an article

For a French version of an existing English article, create a separate Markdown file with `language: fr` and `translationOf: original-article-filename` (without its extension). Keep the publication date and category aligned. The site shows one entry per article, choosing the matching language, and the EN/FR switch opens the corresponding text. `who-owns-the-book-fr.md` is the French version of `who-owns-the-book.md`. Your supplied text is preserved independently in each file.

Create a file such as `src/content/articles/my-new-essay.md`. The filename becomes its URL, `/essays/my-new-essay/`. Use lowercase filenames with hyphens and keep published filenames stable so links continue to work.

```markdown
---
title: My new essay
description: A short description for the archive and search results.
pubDate: 2026-09-08
category: Personal Essays
tags: [reflection, belonging]
language: en
featured: false
draft: true
placeholder: false
# updatedDate: 2026-09-12
# coverImage: /images/my-image.jpg
# coverAlt: A meaningful description of the image
---

Your opening paragraph.

## A section heading

Your writing continues here. Use **bold**, *italics*, and
[source links](https://example.com) when useful.
```

Categories: Faith, Heritage, Society, Technology, Motherhood, Personal Essays. Tags generate their own pages automatically; use consistent lowercase hyphenated names. Category pages exist even before they contain writing.

Set `language` to `en` or `fr`. Article content is never automatically translated. The EN/FR switch opens the corresponding page in the English or French interface. French pages live under `/fr/`, including the homepage, archives, About, Contact, Privacy, and article reading controls. All essays remain visible, with their original language indicated. To publish French writing, add a Markdown article with `language: fr`. French interface labels use `src/lib/i18n.ts` and `src/pages/fr/[...path].astro`; shared navigation is in `Base.astro`. Logical CSS properties and article-level `dir="auto"` prepare the reading layout for future RTL work. Adding Arabic later requires extending the language schema, interface translations, and a full RTL review; it is not enabled now.

Both homepages automatically feature the newest published essay by `pubDate`. The legacy `featured` field is accepted but no longer controls the homepage. Drafts are excluded. Articles with the same date are ordered by their filename.

Drafts are excluded from all pages, feeds, and sitemaps, including the local preview. To preview a draft, temporarily set `draft: false` locally and restore it before committing if it should stay unpublished. A future publication date does not schedule publication: use the draft flag until you are ready.

Use the editorial image instructions below for new covers and inline images. Older `coverImage` / `coverAlt` fields still render for compatibility, but do not use the new optimisation and caption system.

The three sample essays have been removed. Your article “who owns the book” is the only current article. Review the temporary About biography before launching. Use `draft: true` to exclude an article.

## Publish to GitHub Pages — when you are ready

Nothing has been pushed or published by this setup.

1. Create a GitHub repository, then commit and push this folder to its `main` branch. Do not include `node_modules`, `.pnpm-store`, `.astro`, `dist`, or private drafts you do not want stored on GitHub. Git ignores the generated folders automatically; Markdown drafts are still source files and will be visible in a public repository.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build source.
3. Run **Deploy blog to GitHub Pages** from the Actions tab (or push a change to `main`). The workflow checks, builds, tests links, and publishes `dist/`.
4. Subsequent pushes to `main` automatically publish. Review content before pushing.

The workflow gets the site origin and repository base path from GitHub Pages, supporting both `username.github.io` and `username.github.io/repository/`. The local config defaults to `https://underthehaik.com` for canonical URLs only; this does not connect or purchase the domain.

### Connect underthehaik.com later

After deciding to publish, set the custom domain in **Settings → Pages**, then follow GitHub's displayed DNS and domain-verification instructions at your domain provider. Enable HTTPS when GitHub makes it available. Run the deployment workflow again so canonical URLs, RSS, and the sitemap match the domain. There is intentionally no active `CNAME` file.

For a manual build at another address, set `SITE_URL` to the origin (for example `https://username.github.io`) and `BASE_PATH` to `/repository` (or `/` for a root site). In PowerShell:

```powershell
$env:SITE_URL='https://username.github.io'
$env:BASE_PATH='/repository'
pnpm build
pnpm test
```

Remove those environment variables or open a fresh terminal to return to local defaults. The GitHub workflow sets them automatically.

## Structure and editing

- `src/content/articles/`: Markdown essays and frontmatter.
- `src/content.config.ts`: article schema and allowed languages/categories.
- `src/lib/content.ts`: published-article queries, dates, paths, reading time.
- `src/layouts/Base.astro`: shared header, footer, metadata, and theme control.
- `src/styles/global.css`: exact approved light palette, optional dark palette, responsive layout.
- `src/pages/`: homepage, archives, generated articles/categories/tags, About, Contact, Privacy, 404, RSS, robots.
- `.github/workflows/deploy.yml`: GitHub Pages workflow.
- `scripts/check-build.mjs`: generated-page metadata and local-link checks.

Theme preference is stored only in the current tab's session storage. Copy-link uses the browser clipboard and has a fallback message if access is denied. Navigation and article reading work without JavaScript. RSS includes all published English and French articles. Related writing appears when categories or tags overlap. Previous/next links follow publication dates.

## Decisions before launch

Replace sample content and temporary biography; choose the GitHub repository and domain; decide whether to add a dedicated contact address. A subscription provider is optional and has not been added. Review Privacy if you add any external service.

References: [Astro content collections](https://docs.astro.build/en/guides/content-collections/) and [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/).

## Editorial images — step by step

### 1. Save an image

Keep each article's images together:

```text
public/images/articles/
  digital-books/cover.png
  faith-and-choice/notebook.png
  north-africa-maps/books.png
```

Add more article folders as needed. Use lowercase filenames with hyphens. The three supplied photographs are **AI-generated demonstration images**, labelled in their captions; replace them before publication. The books image in the maps folder is a reading still life, **not an archival map**. Generation prompts are recorded in `public/images/articles/EXAMPLE-IMAGE-PROMPTS.md`.

Local JPG/JPEG, PNG, WebP and AVIF files in this directory are imported through Astro's image tools. The components generate appropriately sized WebP files and responsive `srcset` markup, preserving intrinsic dimensions to avoid layout jumps. Original files remain in `public/`; do not put private files there. Nothing downloads images from an external service at build time.

### 2. Add a cover to any .md or .mdx article

```yaml
cover:
  src: "/images/articles/digital-books/cover.png"
  alt: "A blank e-reader beside worn books on an ivory linen cloth"
  caption: "Optional explanation of the image."
  credit: "Photographer or archive name"
  creditUrl: "https://example.com/source-page"
  position: "center"
```

Omit the entire `cover` block for a text-only article. There is no fallback graphic. Covers appear on the featured homepage essay, archive cards, and article pages in both interfaces. Preview images are cropped with `object-fit: cover`; the article displays the complete image. Set `position` to a CSS object position such as `center`, `top`, or `50% 30%` to protect the subject in a crop. Credits/captions appear beneath the full article image, not over it or on compact cards.

The build requires non-empty descriptive alternative text of at least ten characters. Describe the actual visual information; a filename or “image” is not sufficient. A minimum length cannot judge meaning, so review your wording. Supply a credit label whenever using `creditUrl`; source links must use `https://` or `http://`.

### 3. Insert an image between paragraphs

Ordinary `.md` articles continue to work, including the new cover field. For reusable components inside the body, rename the file from `.md` to `.mdx` (Markdown with components). **Do not leave both versions with the same filename.** Its article URL stays the same.

After the closing frontmatter `---`, add imports before your prose:

```mdx
import EditorialImage from '../../components/EditorialImage.astro';

Your first paragraph.

<EditorialImage
  src="/images/articles/north-africa-maps/map.jpg"
  alt="Describe the specific map, its region, labels and visible features"
  caption="Map title, publication and date."
  credit="Archive name"
  creditUrl="https://example.com/source-page"
  display="wide"
/>

Your next paragraph.
```

The `map.jpg` above is an example filename: save your own map there first. Import paths shown assume files directly inside `src/content/articles/`; adjust relative imports for nested folders. Use MDX components for optimised inline images and credits; ordinary Markdown `![alt](path)` is not this component system.

Display options:

| Value | Layout |
| --- | --- |
| `normal` | Same width as the reading column |
| `wide` | Up to 780px, wider than the prose |
| `full` | Full available page width, within the existing page margins |
| `portrait` | Centred, up to 420px wide |

All inline images preserve their full proportions. They load lazily by default. The leading cover loads eagerly; use `loading="eager"` only when an inline image is deliberately above the fold.

### 4. Captions, credits and grouped images

`caption` and `credit` are optional. `creditUrl` makes the credit a link. Credit the actual creator/archive and its source page; do not imply a licence you have not verified. Omit the URL for the supplied AI examples, which have no archive source.

```mdx
import ImageComparison from '../../components/ImageComparison.astro';
import ImageGallery from '../../components/ImageGallery.astro';
import PullQuote from '../../components/PullQuote.astro';
import SectionDivider from '../../components/SectionDivider.astro';

<ImageComparison
  label="Two views of reading materials"
  left={{src:"/images/articles/digital-books/cover.png", alt:"An e-reader and books on linen", caption:"First view.", credit:"AI-generated demonstration image"}}
  right={{src:"/images/articles/north-africa-maps/books.png", alt:"Worn books stacked in daylight", caption:"Second view.", credit:"AI-generated demonstration image"}}
/>

<ImageGallery label="Reading materials" images={[
  {src:"/images/articles/digital-books/cover.png", alt:"An e-reader and books on linen", caption:"Example landscape."},
  {src:"/images/articles/faith-and-choice/notebook.png", alt:"A blank notebook with an olive sprig", caption:"Example portrait."},
  {src:"/images/articles/north-africa-maps/books.png", alt:"Worn books stacked in daylight", caption:"Example square."}
]} />

<PullQuote quote="A sentence drawn from your essay." attribution="Optional attribution" />

<SectionDivider />
```

Comparisons use two columns and galleries up to three; both stack on narrow screens. Captions remain attached to each image. These layouts preserve the complete images rather than cropping evidence such as maps.

### 5. Dimensions and formats

- Covers: around 1600–2000px on the long edge; landscape 3:2 or 16:9 usually crops well.
- Full-width images and detailed maps: up to 2000–2400px wide. Keep important detail legible; link to the archive for a higher-resolution original if appropriate.
- Portraits: about 1000–1400px wide. Square images: around 1200–1600px per side.
- Photographs: JPG or WebP. Fine line art, scans, or transparency: PNG; WebP or AVIF also work. Prefer sRGB colour.
- Aim for source files below 1–2MB where practical. Astro generates smaller responsive outputs and never deliberately upscales. Keep an original master elsewhere.

Run `pnpm check`, `pnpm build`, and `pnpm test`, then `pnpm preview`. Check each image's crop on cards and its full view in the article. Replace every demo caption/credit along with the image, and confirm permission to publish your chosen material.

