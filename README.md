# my.logs — Personal blog

Blog cá nhân theo phong cách **Minimalist Dark** — lấy cảm hứng từ grimlogs.com.
Built với Astro, deploy lên Vercel.

## Stack

- **[Astro 5](https://astro.build)** — static site generator
- **Markdown** — viết bài
- **EB Garamond + JetBrains Mono** — typography
- **Vercel** — hosting (free tier)
- **GitHub** — source code + trigger auto-deploy

## Cấu trúc project

```
my-blog/
├── public/                 # Static assets (favicon, images)
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── blog/           # ⭐ VIẾT BÀI TẠI ĐÂY (file .md)
│   │       ├── value-trap.md
│   │       └── welcome.md
│   ├── layouts/            # HTML skeleton
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/              # Routes
│   │   ├── index.astro     # Trang chủ (/)
│   │   ├── about.astro     # Trang about (/about)
│   │   ├── rss.xml.js      # RSS feed
│   │   └── posts/
│   │       └── [...slug].astro  # Route động cho bài viết
│   ├── styles/
│   │   └── global.css      # ⭐ CUSTOMIZE DESIGN TẠI ĐÂY
│   └── content.config.ts   # Schema cho blog posts
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 🚀 Setup lần đầu

### 1. Cài dependencies

```bash
npm install
```

### 2. Chạy local

```bash
npm run dev
```

Mở http://localhost:4321

### 3. Build (test production)

```bash
npm run build
npm run preview
```

---

## ✍️ Viết bài mới

Tạo file mới trong `src/content/blog/ten-bai.md`:

```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn hiện dưới tiêu đề"
pubDate: 2026-04-21
tags: ["tag1", "tag2"]
draft: false
---

Nội dung markdown ở đây...

## Heading 2

Đoạn văn với **bold** và *italic*.

> Quote từ ai đó
> — Tên tác giả

`inline code` và code block:

​```python
def hello():
    print("world")
​```
```

**Tips:**
- `draft: true` để bài không xuất hiện trên trang chủ
- File `.md` có thể dùng HTML tags nếu cần (như `<div class="callout">`)
- Xem `value-trap.md` để tham khảo cách dùng callout, lead paragraph, footnote

---

## 🎨 Customize design

### Đổi màu / font

Mở `src/styles/global.css`, tìm `:root` block:

```css
:root {
  --bg: #0d0d0d;           /* Nền */
  --text: #e8e6e1;         /* Chữ chính */
  --accent: #c9a961;       /* Màu nhấn (vàng đồng) */
  --font-serif: 'EB Garamond', serif;
  ...
}
```

Một số palette khác bạn có thể thử:

```css
/* Emerald dark */
--bg: #0a0e0c;
--text: #e8f0ec;
--accent: #7ac092;

/* Blue terminal */
--bg: #0a0e14;
--text: #e2e8f0;
--accent: #22d3ee;

/* Warm paper */
--bg: #f4ebe1;
--text: #1a1915;
--accent: #8b0000;
```

### Đổi nội dung nav + footer

Sửa file `src/layouts/BaseLayout.astro`:
- Logo: dòng `<a href="/" class="logo">my.logs</a>`
- Links: trong `<div class="nav-links">`
- Footer: cuối file

### Đổi trang About

Sửa `src/pages/about.astro`.

---

## 🌐 Deploy lên Vercel

### Bước 1: Push code lên GitHub

```bash
git init
git add .
git commit -m "initial commit"

# Tạo repo trên github.com (không cần README)
# Sau đó:
git remote add origin https://github.com/YOUR-USERNAME/my-blog.git
git branch -M main
git push -u origin main
```

### Bước 2: Import vào Vercel

1. Vào https://vercel.com/new
2. Đăng nhập bằng GitHub
3. Chọn repo `my-blog` → Import
4. Framework preset: Astro (tự detect)
5. Click **Deploy**

Sau ~30 giây, bạn sẽ có blog chạy ở `your-blog.vercel.app`.

### Bước 3: Custom domain (optional)

1. Mua domain tại [Porkbun](https://porkbun.com) hoặc [Namecheap](https://namecheap.com) — khoảng ~$10/năm
2. Vào Vercel → Project → Settings → Domains
3. Add domain của bạn
4. Vercel sẽ hướng dẫn cách trỏ DNS (thêm CNAME record)
5. Chờ ~10 phút để SSL cert tự setup

**Nhớ:** Cập nhật `site` trong `astro.config.mjs` thành domain mới để RSS/sitemap đúng link.

---

## 📝 Workflow hàng ngày

Sau khi setup xong, viết bài mới chỉ cần:

```bash
# 1. Tạo bài mới
# src/content/blog/bai-moi.md

# 2. Preview local
npm run dev

# 3. Commit + push
git add .
git commit -m "new post: tên bài"
git push

# → Vercel tự động build & deploy trong ~30s
```

---

## 🧰 Mẹo viết hay hơn

### 1. Lead paragraph (đoạn mở đầu to hơn)

```html
<p class="lead">Đoạn mở đầu sẽ có drop cap và font lớn hơn.</p>
```

### 2. Callout box

```html
<div class="callout">
  <div class="callout-label">Lưu ý</div>
  Nội dung callout ở đây...
</div>
```

### 3. Divider ornament

```markdown
---
```
(dấu `---` trong markdown sẽ render thành `* * *`)

### 4. Footnote ở cuối

```html
<div class="footnote">
  <p><span class="footnote-num">[1]</span> Nguồn hoặc ghi chú.</p>
</div>
```

---

## 🆘 Troubleshooting

**Lỗi `Module not found`**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fail trên Vercel**
- Check log trên Vercel dashboard
- Test local: `npm run build`

**Font không load**
- Check kết nối mạng
- Fonts được import từ Google Fonts ở đầu `global.css`

---

## 📚 Tham khảo

- [Astro Docs](https://docs.astro.build)
- [Markdown Guide](https://www.markdownguide.org)
- [Vercel Docs](https://vercel.com/docs)

---

Happy writing! ✍️
