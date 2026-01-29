# Knot API Next.js Integration

A Next.js application demonstrating Knot API integration for transaction linking.

## Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Knot SDK integration
- ✅ Backend API route for session creation
- ✅ Production-ready

## Environment Variables

Create a `.env.local` file with:

```bash
KNOT_CLIENT_ID=your-client-id
KNOT_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_KNOT_CLIENT_ID=your-client-id
```

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
nextapp/
├── app/
│   ├── api/knot/create-session/route.ts  # Backend API
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── knot-link.tsx                     # Main Knot component
└── .env.local                            # Environment variables
```

## How It Works

1. User enters their ID and selects a merchant
2. Frontend calls `/api/knot/create-session` to create a Knot session
3. Backend authenticates with Knot API using Basic Auth
4. Session ID is returned to frontend
5. Frontend opens Knot SDK with the session ID
6. User completes the connection flow
