# Rebellidraw - Real-time Collaborative Drawing App

A real-time collaborative drawing application built with Next.js, WebSockets, and TypeScript.

## Features

- 🎨 Real-time collaborative drawing
- ✏️ Multiple drawing tools (pencil, rectangle, circle, eraser)
- 🚀 Instant room creation and joining
- 💬 WebSocket-based real-time communication
- 🎯 Simple and intuitive interface

## Project Structure

```
Rebellidraw/
├── apps/
│   ├── rebelidraw/          # Next.js frontend
│   └── ws-backend/          # WebSocket server
├── packages/
│   ├── backend-common/      # Shared backend utilities
│   ├── database/           # Database schema and client
│   └── ui/                 # Shared UI components
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Local Development

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the WebSocket server:**
   ```bash
   cd apps/ws-backend
   pnpm build
   pnpm start
   ```

3. **Start the frontend (in a new terminal):**
   ```bash
   cd apps/rebelidraw
   pnpm dev
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - WebSocket server: ws://localhost:8080

### How to Use

1. Visit http://localhost:3000
2. Enter a room ID or click "Create Random Room"
3. Start drawing! Your drawings will appear in real-time for other users in the same room
4. Share the room URL with others to collaborate

## Deployment

### Frontend (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   cd apps/rebelidraw
   pnpm build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set the root directory to `apps/rebelidraw`
   - Deploy

3. **Environment Variables:**
   - Update the WebSocket URL in `apps/rebelidraw/draw/index.ts` to point to your deployed WebSocket server

### WebSocket Backend (Railway/Render)

1. **Prepare for deployment:**
   ```bash
   cd apps/ws-backend
   pnpm build
   ```

2. **Deploy to Railway:**
   - Connect your GitHub repository
   - Set the root directory to `apps/ws-backend`
   - Set the start command to: `node dist/index.js`
   - Set the port to: `8080`

3. **Environment Variables:**
   - `JWT_SECRET`: Your JWT secret (optional, defaults to "123123")

### Database (Optional)

The app currently works without a database for basic drawing functionality. If you want to add chat features:

1. Set up a PostgreSQL database
2. Update the database connection in `packages/database/prisma/schema.prisma`
3. Run migrations: `pnpm prisma migrate deploy`

## Development

### Adding New Features

1. **Drawing Tools:** Add new tools in `apps/rebelidraw/draw/index.ts`
2. **WebSocket Events:** Add new event types in both frontend and backend
3. **UI Components:** Create reusable components in `packages/ui`

### Project Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Run linting
- `pnpm check-types` - Check TypeScript types

## Architecture

- **Frontend:** Next.js 15 with React 19
- **Backend:** Node.js with WebSocket server
- **Real-time:** WebSocket for instant drawing synchronization
- **Styling:** Tailwind CSS
- **Type Safety:** TypeScript throughout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT
