# Image migration + optimization pipeline for inbarbenaderet
# Copies curated originals from the crawl dir into site-src/images-original/<semantic-name>.<ext>,
# emits optimized responsive WebP into wwwroot/assets/img/, and writes IMAGE_MANIFEST.md.
# Run from repo root:  python site-src/tools/optimize-images.py <crawl-images-dir>
import os, sys, shutil
from PIL import Image, ImageOps

CRAWL = sys.argv[1] if len(sys.argv) > 1 else None
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ORIG = os.path.join(ROOT, 'site-src', 'images-original')
OUT = os.path.join(ROOT, 'wwwroot', 'assets', 'img')
os.makedirs(ORIG, exist_ok=True); os.makedirs(OUT, exist_ok=True)

# semantic name -> (crawl filename, old URL, pages used on)
CURATED = {
  'inbar-portrait-01':        ('bc70f573.jpg', 'wp-content/uploads/2022/07/ענבר.jpg', 'clinic'),
  'inbar-portrait-02':        ('Pi7_image_tool.jpeg', 'wp-content/uploads/2025/12/Pi7_image_tool.jpeg', 'home, clinic'),
  'inbar-portrait-03':        ('WhatsApp-Image-2022-08-08-at-21.41.50.jpeg', 'wp-content/uploads/2022/08/WhatsApp-Image-2022-08-08-at-21.41.50.jpeg', 'clinic'),
  'clinic-treatment-01':      ('0X6A9977_Custom.jpeg', 'wp-content/uploads/2026/01/0X6A9977_Custom.jpeg', 'home hero, clinic'),
  'clinic-treatment-02':      ('4G8A5682-scaled.webp', 'wp-content/uploads/2022/09/4G8A5682-scaled.webp', 'home, treatments index'),
  'clinic-treatment-03':      ('IMG_2214-scaled.jpg', 'wp-content/uploads/2026/01/IMG_2214-scaled.jpg', 'treatments (evolux/rf)'),
  'clinic-room-01':           ('0dee1ee5.jpg', 'wp-content/uploads/2022/07/הסרת-שיער.jpg', 'treatment laser-hair-removal'),
  'treatment-mesotherapy-01': ('Mesotherapy-1-1170x1122-1.jpg', 'wp-content/uploads/2022/07/Mesotherapy-1-1170x1122-1.jpg', 'treatment mesotherapy'),
  'treatment-mesotherapy-02': ('Mesotherapy-2-1152x1536-1-e1657533112268.jpg', 'wp-content/uploads/2022/07/Mesotherapy-2-1152x1536-1-e1657533112268.jpg', 'treatment mesotherapy'),
  'treatment-rf-01':          ('RF-1-1152x1536-1.jpg', 'wp-content/uploads/2022/07/RF-1-1152x1536-1.jpg', 'treatment rf'),
  'treatment-acupuncture-01': ('IMG_5620-1152x1536-1.jpg', 'wp-content/uploads/2022/07/IMG_5620-1152x1536-1.jpg', 'treatment cosmetic-acupuncture'),
  'treatment-acupuncture-02': ('IMG_8772-1152x1536-1.jpg', 'wp-content/uploads/2022/07/IMG_8772-1152x1536-1.jpg', 'treatment cosmetic-acupuncture'),
  'treatment-facial-01':      ('face-2-scaled-470x627-1.jpg', 'wp-content/uploads/2022/07/face-2-scaled-470x627-1.jpg', 'treatment facial'),
  'treatment-facial-02':      ('face-3-scaled-470x627-1.jpg', 'wp-content/uploads/2022/07/face-3-scaled-470x627-1.jpg', 'treatment facial'),
  'device-evolux-01':         ('PHOTO-2025-10-10-08-57-56.jpg', 'wp-content/uploads/2026/02/PHOTO-2025-10-10-08-57-56.jpg', 'treatment evolux-pro-plasma'),
  'device-microneedling-01':  ('IMG_6839.jpg', 'wp-content/uploads/2026/02/IMG_6839.jpg', 'treatment mesotherapy'),
  'academy-01':               ('PHOTO-2026-02-17-21-34-46.jpg', 'wp-content/uploads/2026/02/PHOTO-2026-02-17-21-34-46.jpg', 'academy'),
  'academy-02':               ('PHOTO-2026-02-17-21-35-05.jpg', 'wp-content/uploads/2026/02/PHOTO-2026-02-17-21-35-05.jpg', 'academy'),
  'academy-03':               ('PHOTO-2026-02-17-21-35-22.jpg', 'wp-content/uploads/2026/02/PHOTO-2026-02-17-21-35-22.jpg', 'academy'),
  'academy-04':               ('PHOTO-2026-02-17-21-37-09.jpg', 'wp-content/uploads/2026/02/PHOTO-2026-02-17-21-37-09.jpg', 'academy, clinic'),
  'academy-05':               ('PHOTO-2026-02-17-21-37-40.jpg', 'wp-content/uploads/2026/02/PHOTO-2026-02-17-21-37-40.jpg', 'academy'),
  'ba-post-acne-01':          ('post-acne-1.png', 'wp-content/uploads/2022/07/post-acne-1.png', 'treatment post-acne'),
  'ba-post-acne-02':          ('post-acne-2.png', 'wp-content/uploads/2022/07/post-acne-2.png', 'treatment post-acne'),
  'ba-pigmentation-01':       ('Pigmentation-2-1.jpg', 'wp-content/uploads/2022/07/Pigmentation-2-1.jpg', 'treatment pigmentation'),
  'ba-pigmentation-02':       ('DFEE4A4A-00E4-4A1B-A684-12D77B0342FE-e1740926845613.png', 'wp-content/uploads/2025/03/DFEE4A4A-00E4-4A1B-A684-12D77B0342FE-e1740926845613.png', 'treatment pigmentation'),
  'ba-acne-01':               ('IMG_0365.jpg', 'wp-content/uploads/2024/02/IMG_0365.jpg', 'treatment acne'),
  'ba-acne-02':               ('IMG_0366.jpg', 'wp-content/uploads/2024/02/IMG_0366.jpg', 'treatment acne'),
  'ba-acne-03':               ('IMG_2921.jpg', 'wp-content/uploads/2026/01/IMG_2921.jpg', 'treatment acne'),
  'video-still-01':           ('1.png', 'wp-content/uploads/2022/07/1.png', 'clinic (videos)'),
  'video-still-02':           ('2-e1657463395397.png', 'wp-content/uploads/2022/07/2-e1657463395397.png', 'clinic (videos)'),
  'video-still-03':           ('3-e1657463473218.png', 'wp-content/uploads/2022/07/3-e1657463473218.png', 'clinic (videos)'),
  'video-still-04':           ('4-e1657463552972.png', 'wp-content/uploads/2022/07/4-e1657463552972.png', 'clinic (videos)'),
  # stock already licensed/used on the old site — gap fillers where no authentic photo exists
  'stock-chemical-peel-01':   ('2fb60c7f.jpg', 'wp-content/uploads/2024/06/young-white-woman-getting-acid-organic-retinol-peel-face-skin-with-brush-beauty-clinic-scaled.jpg', 'treatment chemical-peel'),
  'stock-phototherapy-01':    ('d74ef82d.jpg', 'wp-content/uploads/2024/06/led-light-antiaging-mask-facial-skin-care-spa-slow-motion-woman-lies-couch-special-mask-modern-technologies-beauty-health-scaled.jpg', 'treatment phototherapy'),
  'stock-hifu-01':            ('7d9f6d42.jpg', 'wp-content/uploads/2024/06/skin-doctor-using-hifu-...-scaled.jpg', 'treatment hifu'),
  'stock-hydration-01':       ('2d04f3f1.jpg', 'wp-content/uploads/2024/06/theres-nothing-better-than-day-spa-...jpg', 'treatment hydration'),
  'stock-oxygeneo-01':        ('6780a79c.jpg', 'wp-content/uploads/2024/06/beautiful-cosmetologist-white-uniform-...-scaled.jpg', 'treatment oxygeneo'),
  'stock-hair-removal-01':    ('019c87f6.jpg', 'wp-content/uploads/2024/06/beautician-makes-...-occupation.jpg', 'treatment anti-aging (facial detail)'),
}

WIDTHS = [480, 960, 1600]
HERO_EXTRA = {'clinic-treatment-01': 2200}
QUALITY = 82

def main():
    rows = []
    for name, (src, old_url, pages) in CURATED.items():
        sp = os.path.join(CRAWL, src) if CRAWL else None
        ext = os.path.splitext(src)[1].lower()
        orig_path = os.path.join(ORIG, name + ext)
        if sp and os.path.exists(sp) and not os.path.exists(orig_path):
            shutil.copy2(sp, orig_path)
        if not os.path.exists(orig_path):
            print('MISSING SOURCE:', name, src); continue
        im = Image.open(orig_path)
        im = ImageOps.exif_transpose(im)
        if im.mode in ('RGBA', 'P', 'LA'):
            im = im.convert('RGB')
        w, h = im.size
        outs = []
        widths = WIDTHS + ([HERO_EXTRA[name]] if name in HERO_EXTRA else [])
        for tw in widths:
            if tw >= w and outs:
                continue
            tw2 = min(tw, w)
            t = im.copy()
            t.thumbnail((tw2, 100000), Image.LANCZOS)
            op = os.path.join(OUT, f'{name}-{t.size[0]}.webp')
            t.save(op, 'WEBP', quality=QUALITY, method=6)
            outs.append((t.size, os.path.getsize(op), os.path.basename(op)))
        rows.append((name, old_url, pages, (w, h), outs))
        print(name, (w, h), '->', [o[2] for o in outs])

    with open(os.path.join(ROOT, 'IMAGE_MANIFEST.md'), 'w', encoding='utf-8') as f:
        f.write('# Image Migration Manifest\n\nOriginals: `site-src/images-original/` · Optimized: `wwwroot/assets/img/`\n\n')
        f.write('| New file(s) | Old URL | Used on | Source dims | Optimized sizes |\n|---|---|---|---|---|\n')
        for name, old_url, pages, dims, outs in rows:
            sizes = ', '.join(f'{o[2]} ({o[1]//1024}KB)' for o in outs)
            f.write(f'| {name}-*.webp | https://inbarbenaderet.com/{old_url} | {pages} | {dims[0]}x{dims[1]} | {sizes} |\n')
        f.write('\nExcluded: all BIA ITALY product photography (4G8A5385, IMG_9059, 729C9904, product PNGs, wepik exports), WhatsApp testimonial screenshots (quoted as text instead), old Elementor decoration PNGs.\n')
    print('manifest written')

if __name__ == '__main__':
    main()
