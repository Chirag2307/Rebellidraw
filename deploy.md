# Deployment Guide

## Quick Deployment Steps

### 1. Frontend Deployment (Vercel)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set the following:
     - **Framework Preset:** Next.js
     - **Root Directory:** `apps/rebelidraw`
     - **Build Command:** `cd ../.. && pnpm install && pnpm build --filter=rebelidraw`
     - **Output Directory:** `.next`
   - Click "Deploy"

3. **Update WebSocket URL**
   - After deployment, update the WebSocket URL in `apps/rebelidraw/draw/index.ts`
   - Replace `ws://localhost:8080` with your deployed WebSocket server URL
   - Redeploy

### 2. WebSocket Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set the following:
     - **Root Directory:** `apps/ws-backend`
     - **Build Command:** `pnpm install && pnpm build`
     - **Start Command:** `node dist/index.js`
   - Click "Deploy"

2. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add: `JWT_SECRET=your-secret-key`

3. **Get the WebSocket URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - The WebSocket URL will be: `wss://your-app.railway.app`

### 3. Update Frontend with WebSocket URL

1. **Update the WebSocket URL in your code:**
   ```typescript
   // In apps/rebelidraw/draw/index.ts
   const wsUrl = token 
       ? `wss://your-app.railway.app?token=${token}`
       : 'wss://your-app.railway.app';
   ```

2. **Redeploy the frontend**
   - Push the changes to GitHub
   - Vercel will automatically redeploy

## Alternative Deployment Options

### Render.com
- Similar to Railway
- Good for WebSocket servers
- Free tier available

### Heroku
- Requires Procfile
- Good for both frontend and backend
- Paid service

### DigitalOcean App Platform
- Simple deployment
- Good for both static sites and Node.js apps
- Reasonable pricing

## Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_WS_URL`: Your WebSocket server URL

### Backend (Railway/Render)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Port number (usually auto-detected)

## Testing Deployment

1. **Test WebSocket Connection**
   ```javascript
   // In browser console
   const ws = new WebSocket('wss://your-app.railway.app');
   ws.onopen = () => console.log('Connected!');
   ws.onmessage = (e) => console.log('Message:', e.data);
   ```

2. **Test Drawing Collaboration**
   - Open your deployed frontend in two browser tabs
   - Join the same room
   - Draw in one tab and verify it appears in the other

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if the WebSocket server is running
   - Verify the URL is correct (wss:// not ws:// for production)
   - Check CORS settings

2. **Build Failures**
   - Ensure all dependencies are installed
   - Check TypeScript compilation errors
   - Verify build commands are correct

3. **Real-time Not Working**
   - Check WebSocket server logs
   - Verify room joining logic
   - Check browser console for errors

### Debug Commands

```bash
# Check if servers are running
curl http://localhost:3000
curl http://localhost:8080

# Check WebSocket connection
wscat -c ws://localhost:8080
```

## Production Checklist

- [ ] WebSocket server deployed and accessible
- [ ] Frontend deployed with correct WebSocket URL
- [ ] Environment variables configured
- [ ] SSL certificates working (wss://)
- [ ] Real-time drawing tested
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Monitoring set up 