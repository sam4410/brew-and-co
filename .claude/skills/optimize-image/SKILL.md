---
name: optimize-image
description: Download an image from a URL (e.g. Pexels, Unsplash stock photos), resize it for the web and convert it to WebP in public/images so the app serves it locally. Use when the user wants to add, download, localize or optimize a stock/remote image.
---

# Optimize image

Run from the project root, once per image:

```bash
node .claude/skills/optimize-image/optimize.mjs <url> <name> [maxWidth]
```

- `url`: direct image URL. For Pexels, use the image file URL (`https://images.pexels.com/photos/...jpeg`), not the photo page URL. If given a page URL, open it and find the image URL first.
- `name`: kebab-case output name describing the image, e.g. `latte-art`. Overwrites an existing file with the same name, so check `public/images/` first.
- `maxWidth`: default `1600` (full-width hero). Use ~`800` for cards/thumbnails. Never upscales.

Output: `public/images/<name>.webp` (quality 80, EXIF stripped). The script prints the public path, e.g. `/images/latte-art.webp`, to use in `src`/`next/image`.

After converting, replace any external URL for that image in the code with the local path and tell the user each file's size and dimensions.
