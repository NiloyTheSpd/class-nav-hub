# Backend Setup

## Prerequisites
- Node.js 16+ installed
- PostgreSQL database running

## Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
FRONTEND_URL="http://localhost:8080"
```

## Installation

```bash
npm install
```

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (if available)
npx prisma migrate dev

# Or push schema to database
npx prisma db push

# Seed the database with sample data (optional)
npm run seed
```

## Running the Server

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## API Endpoints

- `GET /students` - Get all students with user information
- `GET /tutors` - Get all tutors with user information
- `GET /sessions` - Get all sessions with student and tutor information
- `GET /reports` - Get all reports
- `GET /settings` - Get user settings (requires authentication)

All endpoints include proper error handling and return appropriate HTTP status codes.
