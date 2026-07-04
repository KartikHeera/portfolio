# ⚡ Kartik Heera — Developer Portfolio

An anime-cyberpunk themed personal portfolio website built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, just open and go.

**🔗 Live site:** https://kartikheera.github.io/portfolio/

![status](https://img.shields.io/badge/status-live-brightgreen)
![made with](https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-ff2079)

---

## ✨ Features

- **Animated canvas background** — a neon perspective grid with falling katakana/glyph rain and occasional glitch flashes, drawn entirely in `<canvas>`
- **Glitch-text hero** with a typewriter effect cycling through role titles
- **Scroll-triggered animations** — sections, skill bars, and stat counters animate in as you scroll
- **Fully responsive** — collapses to a mobile nav drawer below 720px
- **Accessible by default** — visible focus states and full support for `prefers-reduced-motion`
- **Zero dependencies** — no npm install, no build tools, just static files

## 🛠️ Tech Stack

| Layer      | Details                                      |
|------------|-----------------------------------------------|
| Structure  | Semantic HTML5                                |
| Styling    | Vanilla CSS3 (custom properties, grid, flexbox) |
| Behavior   | Vanilla JavaScript (canvas API, IntersectionObserver) |
| Fonts      | [Bungee](https://fonts.google.com/specimen/Bungee), [Rajdhani](https://fonts.google.com/specimen/Rajdhani), [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) via Google Fonts |

## 📁 Project Structure

```
portfolio/
├── index.html    # Page structure & content
├── style.css     # All styling, theme tokens, animations
├── main.js       # Canvas background, interactions, scroll effects
└── README.md
```

## 🚀 Running Locally

No build step required.

```bash
git clone https://github.com/KartikHeera/portfolio.git
cd portfolio
```

Then either:
- Double-click `index.html` to open it directly in a browser, **or**
- Use a local dev server (recommended, avoids caching quirks) — e.g. the VS Code "Live Server" extension, or:

```bash
python3 -m http.server 5500
```
then visit `http://localhost:5500`.

## 🌐 Deployment

This site is deployed for free with **GitHub Pages**:

1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Set **Source: Deploy from a branch**, branch `main`, folder `/root`
4. Save — the site goes live at `https://<your-username>.github.io/<repo-name>/`

## 🎨 Customization

All content lives in `index.html` — swap out the name, role, bio, skills, work history, and project cards with your own. Colors, fonts, and spacing are controlled by CSS custom properties at the top of `style.css` under `:root`, so re-theming only requires editing a handful of variables.

## 📬 Contact

- GitHub: [@KartikHeera](https://github.com/KartikHeera)
- Email: kartikheera594@gmail.com
- Location: Garhshankar, Punjab, India

## 📄 License

Free to use as a starting point for your own portfolio. Attribution appreciated but not required.
