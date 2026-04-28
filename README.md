# Personal Portfolio Website

Dark theme, red-accent стильтэй нэг хуудсан (single page) хувийн портфолио вебсайт.

## Local ажиллуулах

1. Project folder-оо нээнэ.
2. `index.html` файлыг browser дээр нээнэ.

## GitHub Pages дээр байршуулах

1. GitHub дээр шинэ repository үүсгэнэ (жишээ: `personal-portfolio`).
2. Энэ төслийн файлуудаа push хийнэ:

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/<your-username>/personal-portfolio.git
git push -u origin main
```

3. Repository дээрээ **Settings -> Pages** рүү орно.
4. **Source** хэсгээс `Deploy from a branch` сонгоно.
5. Branch: `main`, Folder: `/ (root)` сонгоод **Save** дарна.
6. 1-2 минутын дараа GitHub Pages URL үүснэ:
   `https://<your-username>.github.io/personal-portfolio/`

## Засвар хийх

- Layout/контент: `index.html`
- Өнгө, дизайн: `styles.css`
- Жижиг интеракц: `script.js`
