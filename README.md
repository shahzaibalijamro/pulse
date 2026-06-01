# Pulse

Pulse is a privacy-focused analytics SaaS project. Businesses register a site, receive an API key, add a small tracker script, and see pageviews, referrers, devices, countries, active visitors, and live events in a dashboard.

This repository is being built in two main folders:

- `backend/` - TypeScript Express API with MongoDB, Redis, Socket.io, and analytics aggregation.
- `frontend/` - Next.js TypeScript dashboard with Tailwind CSS, Recharts, and Socket.io.

## Backend Local Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a local environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Fill in the required values:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/pulse
   REDIS_URL=redis://127.0.0.1:6379
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=http://localhost:3000
   COOKIE_SECRET=replace-with-another-long-random-secret
   ```

4. Start MongoDB and Redis locally, then run the backend:

   ```bash
   npm run dev
   ```

5. Optional: seed sample development data:

   ```bash
   npm run seed
   ```

## Backend Scripts

- `npm run dev` - start the API in development with `tsx`.
- `npm run build` - type-check and compile TypeScript to `dist/`.
- `npm start` - run the compiled production server.
- `npm test` - run Vitest tests.
- `npm run seed` - create a demo user, site, and sample analytics events.

## Frontend Local Setup

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a local environment file from the example:

   ```bash
   cp .env.example .env.local
   ```

3. Confirm the API URL points to the backend:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_TRACKER_ENDPOINT=http://localhost:5000/ingest
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000` by default.

## Frontend Scripts

- `npm run dev` - start the Next.js development server.
- `npm run build` - create a production build.
- `npm start` - run the production build.

## How The Backend Works

1. A user registers and automatically gets a workspace.
2. The user creates a site and receives an API key.
3. The public `/ingest` endpoint accepts events with that API key.
4. Events are enriched with user-agent and country data without storing raw IP addresses.
5. Events are buffered in Redis and flushed to MongoDB in batches.
6. Authenticated analytics routes use MongoDB aggregation pipelines to power charts and tables.
7. Socket.io broadcasts new events to subscribed dashboard clients in real time.

## Design Decisions

- Redis buffering keeps ingestion fast and avoids one MongoDB write per request.
- Session hashes use IP, user agent, and the current date, so Pulse can estimate visitors without cookies or long-term personal identifiers.
- Every customer-owned query includes `workspaceId` to protect multi-tenant data isolation.
- API keys authenticate tracker traffic, while JWT cookies authenticate dashboard users.
