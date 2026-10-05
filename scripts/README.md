# Website image downloader

Run from the project directory (Python 3, no extra packages):

```bash
python3 scripts/download_images.py
```

Defaults to https://www.justphilride.co.uk/ and saves images to `downloads/justphilride/`.

```bash
python3 scripts/download_images.py https://www.justphilride.co.uk/ --output downloads/justphilride --max-pages 100
```

The script discovers pages through the sitemap and same-site links, extracts HTML images, srcsets, social preview images, inline CSS images, linked stylesheet images and embedded Framer image URLs. It downloads each original Framer image once, preserves other services' transformation parameters, retries failed requests and skips files already downloaded. `image-urls.txt` lists discovered URLs; `manifest.json` maps URLs to files and reports failures or remaining pages. Rerun the command to retry failures.

It downloads images referenced in public HTML and linked stylesheets. Images available only after JavaScript interaction, behind authentication, on unlinked pages absent from the sitemap, or in external embedded pages are outside this crawl. It does not enumerate a site's private asset storage. A nonzero exit code indicates crawl or download failures; inspect the manifest for details.
