# 🚀 Frontend Repository Oluşturma Rehberi

## Adım 1: GitHub'da Yeni Repository Oluştur

1. **GitHub'a git**: https://github.com/new
2. **Repository name**: `tunel-frontend`
3. **Description**: `Tunel - European Tech Jobs Platform Frontend`
4. **Public** seç
5. **Create repository** tıkla

## Adım 2: Repository'yi Clone Et ve Dosyaları Kopyala

```bash
# Yeni repository'yi clone et
git clone https://github.com/ozgeahras/tunel-frontend.git
cd tunel-frontend

# Ana projeden frontend dosyalarını kopyala
cp -r ../tunel/tunel-app/* .
cp ../tunel/tunel-app/.* . 2>/dev/null || true

# Gereksiz dosyaları temizle
rm -rf DEPLOY-INSTRUCTIONS.md CREATE-FRONTEND-REPO.md
rm -rf admin-deploy-fix.md CLOUDFLARE-DEPLOYMENT.md PRODUCTION-DEPLOYMENT.md TROUBLESHOOTING.md
rm -rf package-*.json railway.json vercel.json .cloudflare-build.sh

# Git'e ekle ve push et
git add .
git commit -m "Initial frontend commit for Cloudflare Pages

- Next.js 15 with static export configuration
- Tailwind CSS styling and responsive design
- Multi-language support (EN, DE, NL, TR)
- Country-specific job pages (Germany, Netherlands, Malta)
- CV builder and profile management
- SEO optimized with meta tags and structured data
- Progressive Web App ready

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

## Adım 3: Cloudflare Pages'te Deploy Et

1. **Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Workers & Pages** → **Create a project** → **Connect to Git**
3. **Repository**: `ozgeahras/tunel-frontend` seç
4. **Project name**: `tunel-frontend`

### Build Settings:
- **Root directory**: (boş bırak)
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Node version**: `18`

### Deploy!
- **Deploy** butonuna bas
- 2-3 dakika bekle
- URL'ni al: `https://tunel-frontend.pages.dev`

## ✅ Sonuç

**Admin API**: https://tunel-admin.ozgeahras.workers.dev ✅
**Frontend**: https://tunel-frontend.pages.dev ✅ (deploy sonrası)

Both running on Cloudflare's global edge network! 🌍⚡