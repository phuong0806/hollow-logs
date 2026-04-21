# hollow.logs — Personal blog (Tailwind v4 edition)

Blog cá nhân với **3 theme design riêng biệt** — mỗi bài có thể chọn theme khác nhau.
Built với Astro 5 + Tailwind v4, deploy free trên Vercel.

## Stack

- **[Astro 5](https://astro.build)** — static site generator
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **HTML + Tailwind** — viết bài với full control (không phải markdown)
- **3 layouts có sẵn**: Minimalist Dark, Neobrutalism, Editorial
- **Vercel** — hosting free
- **GitHub** — source + auto-deploy

---

## 📁 Cấu trúc project

```
hollow-logs/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro           # Nav với 4 variants (dark/light/neo/editorial)
│   │   └── Footer.astro        # Footer tương ứng
│   ├── layouts/
│   │   ├── BaseLayout.astro          # HTML skeleton
│   │   ├── MinimalistDarkLayout.astro  # Theme 1
│   │   ├── NeobrutalismLayout.astro    # Theme 2
│   │   └── EditorialLayout.astro       # Theme 3
│   ├── lib/
│   │   └── posts.ts            # Helper to collect posts
│   ├── pages/
│   │   ├── index.astro         # Trang chủ - list posts
│   │   ├── about.astro
│   │   ├── rss.xml.js
│   │   └── posts/              # ⭐ VIẾT BÀI Ở ĐÂY (mỗi bài .astro)
│   │       ├── value-trap.astro       # Theme: Minimalist Dark
│   │       ├── habits.astro           # Theme: Neobrutalism
│   │       └── slow-thinking.astro    # Theme: Editorial
│   └── styles/
│       └── global.css          # ⭐ Tokens + prose styles
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 🚀 Chạy local

```bash
npm install
npm run dev
# → http://localhost:4321
```

---

## ✍️ Viết bài mới (3 bước)

### Bước 1: Chọn theme

Xem 3 bài mẫu để chọn style phù hợp với nội dung:
- `value-trap.astro` — Minimalist Dark (cho essay nghiêm túc)
- `habits.astro` — Neobrutalism (cho nội dung vui, bold)
- `slow-thinking.astro` — Editorial (cho văn chương, meditation)

### Bước 2: Tạo file mới

Copy một trong 3 bài mẫu → rename thành `ten-bai.astro` trong `src/pages/posts/`

### Bước 3: Chỉnh sửa

Mỗi bài bắt đầu với 2 phần:

```astro
---
import MinimalistDarkLayout from '../../layouts/MinimalistDarkLayout.astro';
// Hoặc NeobrutalismLayout, EditorialLayout

export const metadata = {
  title: 'Tiêu đề',
  description: 'Mô tả hiện dưới tiêu đề',
  pubDate: new Date('2026-04-21'),
  tags: ['tag1', 'tag2'],
  theme: 'minimalist-dark',   // Để hiện badge trên homepage
  draft: false,               // true để ẩn bài
};
---

<MinimalistDarkLayout {...metadata}>
  <!-- Nội dung HTML + Tailwind thoải mái ở đây -->
  <p>Đoạn văn...</p>
  
  <div class="my-8 p-6 bg-ink-soft border border-border-subtle">
    Custom component...
  </div>
</MinimalistDarkLayout>
```

---

## 🎨 Tailwind tokens có sẵn

Trong bất kỳ class nào, bạn có thể dùng:

**Fonts:**
- `font-serif` (EB Garamond)
- `font-sans` (Inter)
- `font-mono` (JetBrains Mono)
- `font-display` (Archivo Black - cho neobrutalism)
- `font-editorial` (Playfair Display - cho magazine style)

**Colors:**
- `bg-ink`, `text-ink` — nền đen
- `bg-ink-soft` — đen nhạt hơn (cho card)
- `text-paper` — chữ trắng
- `text-paper-dim`, `text-paper-faint` — chữ xám đậm/nhạt
- `text-accent-gold`, `bg-accent-yellow`, `text-accent-pink`, ...
- `border-border-subtle` — viền đen subtle

**Ví dụ:**
```html
<div class="bg-ink-soft border-l-2 border-accent-gold p-6 font-mono text-sm text-paper-dim">
  Callout box
</div>
```

Muốn thêm màu/font mới? Mở `src/styles/global.css` → block `@theme` → thêm vào.

---

## 🎭 Dùng prose class cho long-form text

Mỗi theme có 1 prose class sẵn style cho heading/paragraph/blockquote:

```html
<article class="prose-custom">    <!-- Minimalist Dark -->
  <p>...</p>
  <h2>...</h2>
  <blockquote>...</blockquote>
</article>

<article class="prose-neo">       <!-- Neobrutalism -->
  ...
</article>

<article class="prose-editorial"> <!-- Editorial -->
  ...
</article>
```

Các layout đã tự wrap sẵn prose class tương ứng — bạn chỉ việc viết HTML bên trong.

---

## 🌐 Deploy lên Vercel

### 1. Push lên GitHub

```bash
git init
git add .
git commit -m "initial commit"

# Tạo repo mới trên GitHub (không tick README)
git remote add origin https://github.com/USERNAME/hollow-logs.git
git branch -M main
git push -u origin main
```

Nếu gặp lỗi authentication — dùng Personal Access Token:
1. Vào https://github.com/settings/tokens/new
2. Tick scope `repo` → Generate
3. Khi push, username là GitHub username, password là token

### 2. Import vào Vercel

1. Vào https://vercel.com/new
2. Login GitHub, chọn repo
3. Framework preset: **Astro** (auto)
4. Click **Deploy** → live sau ~30s

### 3. Update `site` URL

Sau khi có domain thật, update trong `astro.config.mjs`:
```js
site: 'https://your-real-domain.com',
```

---

## 📝 Workflow hàng ngày

```bash
# 1. Tạo bài mới: copy file .astro có theme mong muốn, rename
cp src/pages/posts/value-trap.astro src/pages/posts/my-new-post.astro

# 2. Edit nội dung

# 3. Preview
npm run dev

# 4. Deploy
git add .
git commit -m "post: my new post"
git push
# → Vercel tự build trong ~30s
```

---

## 💡 Tips

### Custom component inline

Không cần file component riêng — chỉ cần viết HTML + Tailwind trong bài:

```html
<!-- Custom stats card cho bài về investing -->
<div class="grid grid-cols-3 gap-4 my-8">
  <div class="bg-ink-soft border border-border-subtle p-4">
    <div class="text-4xl font-bold text-accent-gold">68%</div>
    <div class="text-sm text-paper-dim mt-1">Cổ phiếu "rẻ" là value trap</div>
  </div>
  <!-- ... -->
</div>
```

### Mix theme

Bạn có thể override từng phần của layout:

```html
<MinimalistDarkLayout ...>
  <!-- Một section đặc biệt với style neobrutalism chẳng hạn -->
  <div class="not-prose bg-accent-yellow text-black p-8 border-4 border-black shadow-[6px_6px_0_black] my-12">
    <h3 class="font-display text-3xl uppercase">Highlight</h3>
    <p>Nội dung kiểu neobrutalism giữa bài minimalist</p>
  </div>
</MinimalistDarkLayout>
```

### Tạo theme riêng

1. Copy `MinimalistDarkLayout.astro` → `MyThemeLayout.astro`
2. Thêm `.prose-mytheme` rules vào `global.css`
3. Dùng trong bài: `import MyThemeLayout from '../../layouts/MyThemeLayout.astro'`

---

## 🆘 Troubleshooting

**Build fail với "Cannot apply unknown utility class"**
- Đừng dùng `@apply` với custom color (`@apply bg-ink` không được)
- Dùng raw CSS thay: `background: var(--color-ink);`

**Font không load**
- Check kết nối mạng
- Fonts import từ Google Fonts ở đầu `global.css`

**Thay đổi không reflect**
- Restart dev server: `Ctrl+C` rồi `npm run dev` lại

---

Happy writing với nhiều theme! ✍️🎨
