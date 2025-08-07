# 🌐 CommunityConnect

**Community Internet Access Points Manager**

CommunityConnect helps rural and underserved communities coordinate shared internet access through a simple, offline-first web application. Community members can find available internet access points, share their own connections, and coordinate usage to ensure fair access for everyone.

## 🎯 Problem Solved

**Digital Divide**: 1 in 4 rural Americans lack broadband access. Even where available, connectivity can be unreliable and expensive. CommunityConnect helps communities leverage existing internet access points more effectively through coordination and sharing.

## ✨ Features

- 📍 **Interactive Map**: Visual map of all community internet access points
- ➕ **Add Access Points**: Community members can register their sharable internet
- 📅 **Booking System**: Coordinate usage to prevent overcrowding
- 📊 **Real-time Stats**: Track community usage and availability
- 📱 **Mobile-First PWA**: Works offline and installs like a native app
- 🔄 **Offline Sync**: Critical functionality works without internet

## 🚀 Quick Start

### Prerequisites
- Node.js (14+ recommended)
- No other dependencies needed!

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/community-connect.git
   cd community-connect
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open Your Browser**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

Run the built-in test suite:

```bash
npm test
```

The test suite verifies:
- API endpoints functionality
- Database operations
- Error handling
- Data validation

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Database**: SQLite (serverless, no setup required)
- **Maps**: OpenStreetMap + Leaflet.js (free)
- **PWA**: Service Worker for offline functionality

### Key Components
- **Interactive Map**: Shows all access points with real-time status
- **Access Point Management**: Add, view, and manage internet sharing points
- **Booking System**: Schedule access to prevent overcrowding
- **Offline Storage**: Critical data cached for offline access

## 📱 Progressive Web App

CommunityConnect works as a Progressive Web App (PWA):
- **Installable**: Add to home screen on mobile devices
- **Offline-First**: Core features work without internet
- **Responsive**: Optimized for mobile, tablet, and desktop
- **Fast**: Service worker caching for instant loading

## 🎨 User Interface

### Main Sections
1. **📍 Map View**: Interactive map with all access points
2. **➕ Add Point**: Register new internet access points
3. **📅 Book Access**: Schedule internet usage time
4. **📋 My Bookings**: View active bookings and history

### Access Point Status
- 🟢 **Available**: Ready for use
- 🟡 **Busy**: Currently in use but not at capacity
- 🔴 **Full**: At maximum capacity

## 🚀 Deployment Options

### Free Hosting Options

1. **Netlify** (Recommended)
   - Fork repository on GitHub
   - Connect to Netlify
   - Auto-deploy on commits
   - Custom domain support

2. **Vercel**
   - Import from GitHub
   - Serverless functions support
   - Global CDN

3. **GitHub Pages**
   - Static hosting
   - Free custom domains
   - Automatic SSL

### Local Network Deployment
Perfect for community centers, libraries, or local organizations:

```bash
# Install PM2 for production
npm install -g pm2

# Start with PM2
pm2 start server.js --name community-connect

# Save configuration
pm2 save
pm2 startup
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### Database
SQLite database is automatically created on first run. No configuration needed!

## 📊 Usage Analytics

Built-in analytics track:
- Total access points in community
- Active users across all points
- Current bookings
- Historical usage patterns

## 🤝 Contributing

CommunityConnect is open source! Contributions welcome:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Changes**
4. **Run Tests**
   ```bash
   npm test
   ```
5. **Commit & Push**
   ```bash
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```
6. **Create Pull Request**

### Development Setup
```bash
# Clone repository
git clone https://github.com/yourusername/community-connect.git
cd community-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📄 License

MIT License - feel free to use, modify, and distribute!

## 🆘 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the code comments for implementation details
- **Community**: Start discussions in GitHub Discussions

## 🌟 Impact

CommunityConnect addresses the digital divide by:
- **Maximizing Existing Resources**: Better coordination of available internet access
- **Community Empowerment**: Local ownership and management
- **Cost-Effective**: No expensive infrastructure required
- **Scalable**: Works for small neighborhoods or entire communities

## 🔮 Future Enhancements

Planned features:
- [ ] Mesh network integration
- [ ] Mobile app (React Native)
- [ ] Usage analytics dashboard
- [ ] Community chat/messaging
- [ ] QR code check-ins
- [ ] Multi-language support

---

**Built with ❤️ for communities worldwide**

*CommunityConnect - Bridging the Digital Divide, One Connection at a Time*