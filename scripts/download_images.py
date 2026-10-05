#!/usr/bin/env python3
"""Download publicly referenced website images using Python's standard library."""
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
import mimetypes
from pathlib import Path
import re
import time
from urllib.error import URLError
from urllib.parse import unquote, urldefrag, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.ico', '.bmp'}


def fetch(url):
    error = None
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent': 'WebsiteImageDownloader/1.0', 'Accept': '*/*'}), timeout=30) as response:
                return response.read(), response.headers.get('Content-Type', '').split(';')[0], response.geturl()
        except (URLError, TimeoutError, OSError) as exc:
            error = exc
            if attempt < 2:
                time.sleep(attempt + 1)
    raise error


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.pages, self.images, self.styles = set(), set(), set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('href'):
            self.pages.add(attrs['href'])
        if tag in ('img', 'source'):
            for key in ('src', 'data-src', 'data-original'):
                if attrs.get(key):
                    self.images.add(attrs[key])
            for key in ('srcset', 'data-srcset'):
                for part in attrs.get(key, '').split(','):
                    if part.strip():
                        self.images.add(part.strip().split()[0])
        if tag == 'link':
            if 'stylesheet' in attrs.get('rel', '') and attrs.get('href'):
                self.styles.add(attrs['href'])
            if 'icon' in attrs.get('rel', '') and attrs.get('href'):
                self.images.add(attrs['href'])
        if tag == 'meta' and attrs.get('property', attrs.get('name', '')) in ('og:image', 'twitter:image'):
            if attrs.get('content'):
                self.images.add(attrs['content'])


def image_urls(source, base):
    # Include inline CSS and Framer's embedded image references.
    source = html.unescape(source).replace('\\/', '/')
    candidates = re.findall(r'''https?://[^\s<>"'\\]+''', source)
    candidates += re.findall(r'''url\(\s*["']?([^\s)"']+)''', source)
    return {urljoin(base, u) for u in candidates if Path(urlsplit(u).path).suffix.lower() in IMAGE_EXTENSIONS}


def canonical_image(url):
    url = urldefrag(url)[0]
    parts = urlsplit(url)
    # Framer query parameters generate resized copies. Download the original once.
    if parts.hostname == 'framerusercontent.com' and parts.path.startswith('/images/'):
        return urlunsplit((parts.scheme, parts.netloc, parts.path, '', ''))
    return url


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', nargs='?', default='https://www.justphilride.co.uk/')
    parser.add_argument('--output', default='downloads/justphilride')
    parser.add_argument('--max-pages', type=int, default=100)
    parser.add_argument('--delay', type=float, default=0.2, help='Pause between requests in seconds')
    args = parser.parse_args()
    if args.max_pages < 1 or args.delay < 0:
        parser.error('--max-pages must be positive and --delay must be nonnegative')
    origin = urlsplit(args.url)
    if origin.scheme not in ('http', 'https') or not origin.hostname:
        parser.error('URL must be an http(s) website')
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    queue, visited, styles, images, failures = [args.url], set(), set(), set(), []

    def add_page(url):
        url = urldefrag(url)[0]
        parts = urlsplit(url)
        ext = Path(parts.path).suffix.lower()
        if parts.scheme in ('http', 'https') and parts.netloc == origin.netloc and ext in ('', '.html', '.htm') and not parts.query and url not in visited and url not in queue:
            queue.append(url)

    # Discover unlinked pages through standard sitemaps, including sitemap indexes.
    sitemap_queue = [urljoin(args.url, '/sitemap.xml')]
    sitemap_seen = set()
    while sitemap_queue and len(sitemap_seen) < 20:
        sitemap_url = sitemap_queue.pop(0)
        if sitemap_url in sitemap_seen:
            continue
        sitemap_seen.add(sitemap_url)
        try:
            data, _, _ = fetch(sitemap_url)
            root = ET.fromstring(data)
            for node in root.iter():
                if node.tag.split('}')[-1] == 'loc' and node.text:
                    url = node.text.strip()
                    if root.tag.split('}')[-1] == 'sitemapindex':
                        if urlsplit(url).netloc == origin.netloc:
                            sitemap_queue.append(url)
                    else:
                        add_page(url)
        except (URLError, TimeoutError, OSError, ET.ParseError) as exc:
            print(f'Sitemap unavailable: {sitemap_url}: {exc}', flush=True)
        time.sleep(args.delay)

    while queue and len(visited) < args.max_pages:
        url = queue.pop(0)
        visited.add(url)
        print(f'PAGE {len(visited)}: {url}', flush=True)
        try:
            data, content_type, base = fetch(url)
            if content_type not in ('text/html', 'application/xhtml+xml'):
                continue
            source = data.decode('utf-8', errors='replace')
            links = Links()
            links.feed(source)
            images.update(image_urls(source, base))
            images.update(urljoin(base, u) for u in links.images if not u.startswith('data:'))
            styles.update(urljoin(base, u) for u in links.styles)
            for link in sorted(links.pages):
                add_page(urljoin(base, link))
        except (URLError, TimeoutError, OSError) as exc:
            failures.append({'url': url, 'stage': 'page', 'error': str(exc)})
        time.sleep(args.delay)

    for url in sorted(styles):
        try:
            data, _, base = fetch(url)
            images.update(image_urls(data.decode('utf-8', errors='replace'), base))
        except (URLError, TimeoutError, OSError) as exc:
            failures.append({'url': url, 'stage': 'stylesheet', 'error': str(exc)})
        time.sleep(args.delay)

    images = sorted({canonical_image(u) for u in images if urlsplit(u).scheme in ('http', 'https')})
    (output / 'image-urls.txt').write_text('\n'.join(images) + '\n', encoding='utf-8')
    records = []
    for index, url in enumerate(images, 1):
        filename = re.sub(r'[^a-zA-Z0-9._-]', '_', unquote(Path(urlsplit(url).path).name))[:160] or 'image'
        stem, suffix = Path(filename).stem, Path(filename).suffix
        filename = f'{stem}-{hashlib.sha256(url.encode()).hexdigest()[:10]}{suffix}'
        target = output / filename
        try:
            if target.exists() and target.stat().st_size:
                status = 'existing'
            else:
                data, content_type, _ = fetch(url)
                if not content_type.startswith('image/'):
                    raise OSError(f'Expected image, received {content_type}')
                if not suffix:
                    target = target.with_suffix(mimetypes.guess_extension(content_type) or '.img')
                target.write_bytes(data)
                status = 'downloaded'
            records.append({'url': url, 'file': target.name, 'status': status, 'bytes': target.stat().st_size})
            print(f'[{index}/{len(images)}] {status}: {target.name}', flush=True)
        except (URLError, TimeoutError, OSError) as exc:
            failures.append({'url': url, 'stage': 'image', 'error': str(exc)})
            print(f'FAILED: {url}: {exc}', flush=True)
        time.sleep(args.delay)
    manifest = {'website': args.url, 'pages': sorted(visited), 'remaining_pages': len(queue), 'images_found': len(images), 'images': records, 'failures': failures}
    (output / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Finished: {len(records)}/{len(images)} images saved to {output.resolve()}; {len(failures)} failures.', flush=True)
    if queue:
        print('Page limit reached. Increase --max-pages to crawl remaining pages.')
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
