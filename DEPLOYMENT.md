# 🚀 Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. GitHub Repository Setup
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - PropertyFinder Pro"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/property-finder-pro.git

# Push to GitHub
git push -u origin main
```

### 2. Vercel Account Setup
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Import your repository

### 3. Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token_here
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### 4. Database Setup Options

#### Option A: Vercel Postgres (Recommended)
1. In Vercel Dashboard → Storage
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

#### Option B: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables

#### Option C: PlanetScale (Free MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Update `prisma/schema.prisma` for MySQL

### 5. Mapbox Token
1. Go to [mapbox.com](https://mapbox.com)
2. Create account
3. Get access token from Account → Access tokens
4. Add to `NEXT_PUBLIC_MAPBOX_TOKEN`

## 🔧 Deployment Steps

### 1. Deploy to Vercel
1. Go to Vercel Dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Database Migration
After deployment, run database migration:
```bash
# In Vercel CLI or through dashboard
npx prisma migrate deploy
```

### 3. Verify Deployment
1. Check deployment URL
2. Test all pages:
   - `/` - Landing page
   - `/properties` - Property listings
   - `/wizard` - Property wizard
   - `/login` - Authentication
   - `/register` - User registration

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check environment variables
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database is accessible from Vercel
   - Run `npx prisma migrate deploy`

3. **Map Not Loading**
   - Verify NEXT_PUBLIC_MAPBOX_TOKEN
   - Check token permissions
   - Verify domain is allowed in Mapbox settings

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Verify HTTPS is enabled

## 📊 Post-Deployment

### 1. Add Sample Data
```bash
# Create sample properties (optional)
# You can add this through the API or admin panel
```

### 2. Monitor Performance
- Check Vercel Analytics
- Monitor database usage
- Set up error tracking

### 3. Custom Domain (Optional)
1. In Vercel Dashboard → Domains
2. Add your custom domain
3. Configure DNS settings

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Mapbox token has proper restrictions
- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed in client code

## 📈 Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure CDN settings
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up caching headers

---

**🎉 Your PropertyFinder Pro app should now be live on Vercel!**
