# Troubleshooting Guide

## Fetch Data Error - FIXED

### What was the problem?

The frontend was getting a "Failed to fetch data" error when trying to load the Dashboard, Students, or Sessions pages. This happened because:

1. **Missing User Relations**: The backend API endpoints were returning raw Prisma data without including the User relationships. The frontend expected a `name` field, but the database schema has names stored in a related `User` table.

2. **No Error Handling**: Backend routes had no try-catch blocks, so errors weren't being logged or handled properly.

3. **CORS Issues**: The backend wasn't configured to accept requests from the frontend's origin.

4. **Type Mismatches**: Frontend expected specific data structures that the backend wasn't providing.

### What was fixed?

#### 1. Backend API Improvements

**Students Endpoint (`/students`)**:
- Now includes User relation: `include: { user: true }`
- Transforms data to include `name` field from `firstName` and `lastName`
- Returns proper `grade` and `attendance` fields with defaults

**Tutors Endpoint (`/tutors`)**:
- Now includes User relation
- Transforms data to include `name` field
- Returns `earnings` with default value

**Sessions Endpoint (`/sessions`)**:
- Includes both Student and Tutor relations with their Users
- Transforms data to include `studentName` and `tutorName`
- Calculates session `status` based on endTime
- Formats `date` field properly

#### 2. Error Handling

All routes now have:
```typescript
try {
  // Route logic
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error message' });
}
```

#### 3. CORS Configuration

Added CORS middleware:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
```

## How to Verify the Fix

### 1. Set up the Database

```bash
cd backend

# Create .env file with your database credentials
cp .env.example .env
# Edit .env with your actual database URL

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run seed
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Backend server running on port 3001
DATABASE_URL: postgresql://...
```

### 3. Test Backend Endpoints

```bash
# Test if backend is running
curl http://localhost:3001/

# Test students endpoint
curl http://localhost:3001/students

# Test tutors endpoint
curl http://localhost:3001/tutors

# Test sessions endpoint
curl http://localhost:3001/sessions
```

You should see JSON responses with the transformed data including `name` fields.

### 4. Start the Frontend

```bash
# In the root directory
npm install
npm run dev
```

Frontend runs on http://localhost:8080

### 5. Check the Dashboard

Open http://localhost:8080 in your browser. You should now see:
- Active Students count
- Upcoming Sessions count
- Recent Students list with names
- Upcoming Sessions list

No more "Failed to fetch data" errors!

## Common Issues

### Issue: "Failed to fetch data" still appearing

**Possible causes:**
1. Backend not running - Check terminal for errors
2. Database not set up - Run `npx prisma db push` and `npm run seed`
3. Wrong DATABASE_URL - Check your .env file
4. Port conflict - Make sure ports 3001 and 8080 are available

**Solution:**
```bash
# Check backend logs
cd backend
npm run dev

# Check if database is accessible
npx prisma studio
```

### Issue: Empty data (no students/sessions)

**Cause:** Database hasn't been seeded

**Solution:**
```bash
cd backend
npm run seed
```

### Issue: CORS errors in browser console

**Cause:** Backend CORS not configured properly

**Solution:**
Make sure backend/.env has:
```
FRONTEND_URL="http://localhost:8080"
```

And backend is restarted after changing .env

### Issue: TypeScript compilation errors

**Cause:** Missing dependencies or types

**Solution:**
```bash
cd backend
npm install
npm run build
```

### Issue: Database connection errors

**Cause:** PostgreSQL not running or wrong credentials

**Solution:**
1. Make sure PostgreSQL is running
2. Check DATABASE_URL in backend/.env
3. Test connection: `npx prisma studio`

## Environment Variables

### Backend (.env)

Required variables:
- `PORT` - Backend port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:8080)

Optional (for authentication):
- `CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `CLERK_SECRET_KEY` - Clerk secret key

## Architecture Overview

```
Frontend (React/Vite) :8080
    ↓ /api/* requests (proxied via vite.config.ts)
    ↓
Backend (Express) :3001
    ↓ Prisma ORM
    ↓
PostgreSQL Database
```

**Proxy Configuration** (vite.config.ts):
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

This means:
- Frontend requests `/api/students`
- Gets proxied to `http://localhost:3001/students`

## Need More Help?

If issues persist:
1. Check browser console for errors
2. Check backend terminal for errors
3. Check that both frontend and backend are running
4. Verify database has data: `npx prisma studio`
5. Test endpoints directly with curl or Postman
