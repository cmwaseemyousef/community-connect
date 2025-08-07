# 🚀 CommunityConnect Deployment Guide

This guide provides multiple deployment options for CommunityConnect, all using free services.

## ⚡ Quick Deploy Options

### 1. Netlify (Recommended - Easiest)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/community-connect)

**Manual Netlify Deployment:**

1. **Create GitHub Repository**
   - Push your code to GitHub
   - Make repository public

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `public`
   - Click "Deploy site"

3. **Configure Environment**
   - Netlify automatically handles serverless functions
   - Your site will be available at `https://your-site-name.netlify.app`

### 2. Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/community-connect)

**Manual Vercel Deployment:**

1. **Visit [vercel.com](https://vercel.com)**
2. **Import Project from GitHub**
3. **Configure Build Settings:**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `public`
4. **Deploy**

### 3. GitHub Pages (Static Only)

For static hosting without server functionality:

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Source: Deploy from branch
   - Branch: main, folder: /public

2. **Access at:** `https://yourusername.github.io/community-connect`

## 🏠 Local Network Deployment

Perfect for community centers, libraries, or local organizations:

### Option 1: Simple Local Server

```bash
# Install dependencies
npm install

# Start server
npm start

# Access at http://localhost:3000
```

### Option 2: Production with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name community-connect

# Save configuration
pm2 save

# Setup auto-restart on boot
pm2 startup

# View logs
pm2 logs community-connect

# Stop
pm2 stop community-connect
```

### Option 3: Docker Deployment

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# Build and run
docker build -t community-connect .
docker run -p 3000:3000 -d community-connect
```

## 🌐 Custom Domain Setup

### For Netlify:
1. **Purchase domain** (optional - Netlify provides free subdomain)
2. **Add custom domain in Netlify dashboard**
3. **Update DNS records** at your domain provider
4. **Enable HTTPS** (automatic with Netlify)

### For Vercel:
1. **Add domain in Vercel dashboard**
2. **Configure DNS records**
3. **HTTPS enabled automatically**

## 📱 Progressive Web App Setup

CommunityConnect works as a PWA out of the box:

- **Installable** on mobile devices
- **Offline functionality** via Service Worker
- **App-like experience**

Users can install by:
1. Visiting your site on mobile
2. Tapping browser menu
3. Selecting "Add to Home Screen" or "Install"

## 🔧 Environment Configuration

### Environment Variables

Create `.env` file for local development:

```env
PORT=3000
NODE_ENV=production
```

### For cloud deployment, set these in your platform:

**Netlify:** Site Settings → Environment Variables  
**Vercel:** Project Settings → Environment Variables

## 🗄️ Database Considerations

### Default: SQLite (Included)
- **Perfect for:** Small communities (< 1000 users)
- **Storage:** Local file system
- **Setup:** None required

### Upgrade Options for Larger Communities:

**1. PostgreSQL (Free tier available on many platforms)**
```javascript
// Replace sqlite3 with pg in server.js
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
});
```

**2. MongoDB Atlas (Free tier)**
```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

## 📊 Analytics & Monitoring

### Free Monitoring Options:

**1. Netlify Analytics** (Built-in)
**2. Google Analytics** (Add to HTML)
**3. Plausible Analytics** (Privacy-friendly)

Add to `public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Best Practices

### HTTPS (Automatic with Netlify/Vercel)
### Rate Limiting (Add to server.js):
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

### Input Validation:
```javascript
const validator = require('validator');
// Validate email addresses, sanitize inputs
```

## 🚨 Troubleshooting

### Common Issues:

**1. Build Fails**
- Check Node.js version (14+ required)
- Run `npm install` to ensure dependencies

**2. Database Issues**
- SQLite file permissions in production
- Consider upgrading to PostgreSQL for cloud deployment

**3. Maps Not Loading**
- Check internet connectivity
- Verify OpenStreetMap tile server access

**4. PWA Not Installing**
- Ensure HTTPS enabled
- Check manifest.json is accessible
- Verify Service Worker registration

### Debug Mode:
```bash
# Enable debug logging
DEBUG=* npm start
```

## 📈 Performance Optimization

### For Production:

1. **Enable Compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Cache Static Assets:**
```javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: false
}));
```

3. **Database Optimization:**
```sql
-- Add indexes for better query performance
CREATE INDEX idx_access_points_active ON access_points(active);
CREATE INDEX idx_bookings_end_time ON bookings(end_time);
```

## 🎯 Success Checklist

- [ ] ✅ Application runs locally (`npm start`)
- [ ] ✅ Tests pass (`npm test`)
- [ ] ✅ Deployed to cloud platform
- [ ] ✅ Custom domain configured (optional)
- [ ] ✅ HTTPS enabled
- [ ] ✅ PWA installable on mobile
- [ ] ✅ Maps loading correctly
- [ ] ✅ Database operations working
- [ ] ✅ Community can access and use

## 🆘 Getting Help

- **GitHub Issues:** Report deployment problems
- **Community:** Join discussions for deployment help
- **Documentation:** Check README.md for setup details

---

**Your CommunityConnect deployment helps bridge the digital divide! 🌐**