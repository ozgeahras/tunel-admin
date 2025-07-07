# 🚀 Cloudflare Pages Deployment Instructions

## Seçenek 1: Manuel Cloudflare Pages Ayarları

1. **Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Workers & Pages** → **Create a project** → **Connect to Git**
3. **Repository**: `ozgeahras/tunel` seç
4. **Project name**: `tunel-frontend`

### Build Settings:
- **Root directory**: `tunel-app`
- **Build command**: `npm run build`
- **Build output directory**: `out`
- **Environment variables**: (boş bırak)

### Deployment Settings:
- **Deploy command**: (boş bırak/sil)

## Seçenek 2: Yeni Repository (Önerilen)

### Yeni repo oluştur:
```bash
# GitHub'da yeni repo oluştur: tunel-frontend
git clone https://github.com/ozgeahras/tunel-frontend.git
cd tunel-frontend

# Bu dosyaları kopyala:
cp -r /path/to/tunel/tunel-app/* .
cp /path/to/tunel/tunel-app/.* .

git add .
git commit -m "Initial frontend commit"
git push
```

### Cloudflare Pages'te:
- **Repository**: `ozgeahras/tunel-frontend`
- **Root directory**: (boş bırak)
- **Build command**: `npm run build`
- **Build output directory**: `out`

## ✅ URL'ler

**Admin API**: https://tunel-admin.ozgeahras.workers.dev ✅ Çalışıyor
**Frontend**: Deploy edilmediği için henüz yok

## 🔗 Test Endpoints

```bash
# Admin API Health Check
curl https://tunel-admin.ozgeahras.workers.dev/health

# Admin Login
curl -X POST https://tunel-admin.ozgeahras.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@tunel.com", "password": "admin123"}'
```

Admin API tamamen çalışıyor! Frontend'i deploy etmek için yukarıdaki seçeneklerden birini kullan.