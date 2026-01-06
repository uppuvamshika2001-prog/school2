# 🚀 School ERP - Deployment Guide

This guide covers multiple deployment options for the School ERP Frontend.

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Docker (for containerized deployment)
- Git for version control

---

## 🔧 Environment Variables

Before deploying, create your production environment file:

```bash
# Copy the example file
cp .env.production.example .env.production.local
```

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourschool.com/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `School ERP` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `https://yourschool.com` |

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

The easiest way to deploy Next.js applications.

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for production"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Click "Deploy"

3. **Environment Variables in Vercel:**
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.production.example`

### Option 2: Docker Deployment

Build and run the containerized application.

1. **Build the Docker image:**
   ```bash
   docker build \
     --build-arg NEXT_PUBLIC_API_URL=https://api.yourschool.com/api/v1 \
     --build-arg NEXT_PUBLIC_APP_NAME="School ERP" \
     --build-arg NEXT_PUBLIC_APP_URL=https://yourschool.com \
     -t school-erp-frontend:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name school-erp \
     -p 3000:3000 \
     --restart unless-stopped \
     school-erp-frontend:latest
   ```

3. **Docker Compose (recommended for production):**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     frontend:
       build:
         context: .
         args:
           - NEXT_PUBLIC_API_URL=https://api.yourschool.com/api/v1
           - NEXT_PUBLIC_APP_NAME=School ERP
           - NEXT_PUBLIC_APP_URL=https://yourschool.com
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       restart: unless-stopped
       healthcheck:
         test: ["CMD", "wget", "--spider", "http://localhost:3000"]
         interval: 30s
         timeout: 10s
         retries: 3
   ```

### Option 3: Static Export + Nginx

For traditional hosting with Nginx.

1. **Update next.config.js** (add if needed):
   ```javascript
   // Uncomment for static export
   // output: 'export',
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourschool.com;

       root /var/www/school-erp/out;
       index index.html;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;

       location / {
           try_files $uri $uri.html $uri/ =404;
       }

       # Cache static assets
       location /_next/static {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

### Option 4: PM2 (Node.js Process Manager)

For VPS or dedicated server deployment.

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Build and start:**
   ```bash
   npm run build
   pm2 start npm --name "school-erp" -- start
   ```

3. **PM2 Ecosystem file (ecosystem.config.js):**
   ```javascript
   module.exports = {
     apps: [{
       name: 'school-erp',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/school-erp',
       instances: 'max',
       exec_mode: 'cluster',
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

4. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

---

## 🔒 Security Checklist

Before deploying to production, ensure:

- [ ] All environment variables are set correctly
- [ ] HTTPS is enabled (SSL certificate configured)
- [ ] API URL uses HTTPS
- [ ] Console logs are disabled (handled by next.config.js)
- [ ] Source maps are disabled for production
- [ ] Rate limiting is configured on the backend
- [ ] CORS is properly configured on the backend

---

## 📊 Performance Optimization

The application includes these optimizations:

- ✅ **Standalone output** - Minimal production bundle
- ✅ **Console removal** - Logs stripped in production
- ✅ **Security headers** - XSS, CSRF protection
- ✅ **Source maps disabled** - Code protection
- ✅ **Image optimization** - Next.js Image component

---

## 🔧 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Docker Issues

```bash
# Check container logs
docker logs school-erp

# Rebuild without cache
docker build --no-cache -t school-erp-frontend:latest .
```

### Environment Variables Not Loading

- Ensure variables start with `NEXT_PUBLIC_` for client access
- Rebuild after changing environment variables
- Check variable spelling and values

---

## 📞 Support

For deployment issues, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)
