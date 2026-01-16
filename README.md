# Lead Management Dashboard - Backend API

A robust Node.js/Express backend API for managing leads with comprehensive authentication, search, filtering, sorting, and pagination capabilities. Built with TypeScript, Prisma ORM, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Testing](#testing)
- [Security](#security)

## Overview

This backend API serves as the core data layer for the Lead Management Dashboard. It provides secure, scalable endpoints for authentication, lead management, and analytics with built-in validation, error handling, and comprehensive query capabilities.

## Tech Stack

### Core Technologies

- **Node.js** - JavaScript runtime
- **Express 4.18** - Web application framework
- **TypeScript 5.4** - Type-safe development
- **Prisma 5.22** - Next-generation ORM
- **MongoDB** - NoSQL database (MongoDB Atlas)

### Security & Authentication

- **jsonwebtoken 9.0** - JWT token generation and verification
- **bcryptjs 2.4** - Password hashing
- **cors 2.8** - Cross-Origin Resource Sharing

### Validation & Configuration

- **Zod 3.23** - TypeScript-first schema validation
- **dotenv 16.4** - Environment variable management

### Development Tools

- **ts-node-dev 2.0** - TypeScript execution with hot reload
- **ts-node 10.9** - TypeScript execution
- **Prisma Client** - Auto-generated database client

## Features

### Authentication System
- JWT-based authentication
- Secure password hashing with bcrypt
- Token validation middleware
- User registration and login
- Protected routes

### Lead Management
- **CRUD Operations**: Create, Read, Update, Delete leads (Read implemented)
- **Advanced Search**: Full-text search across multiple fields
- **Multi-field Filtering**:
  - Stage (NEW, CONTACTED, QUALIFIED, etc.)
  - Status (ACTIVE, INACTIVE, CONVERTED, REJECTED)
  - Source (Website, Referral, etc.)
  - Country
- **Flexible Sorting**:
  - By creation date
  - By name (first/last)
  - By company
  - By value
  - Ascending/Descending order
- **Pagination**:
  - Configurable page size
  - Page number navigation
  - Total count and pages

### Analytics
- Total leads count
- Active leads count
- Converted leads count
- Total value calculation
- Average value
- Distribution by stage
- Distribution by status
- Top sources

### Data Seeding
- Automated database seeding
- 500+ realistic dummy leads
- Demo user creation
- Diverse data distribution

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Database schema definition
│
├── src/
│   ├── config/
│   │   └── database.ts            # Database connection configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication logic
│   │   └── lead.controller.ts     # Lead management logic
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT verification middleware
│   │   └── validation.middleware.ts # Zod validation middleware
│   │
│   ├── routes/
│   │   ├── auth.routes.ts         # Authentication endpoints
│   │   └── lead.routes.ts         # Lead management endpoints
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   │
│   ├── validations/
│   │   ├── auth.validation.ts     # Auth request schemas
│   │   └── lead.validation.ts     # Lead request schemas
│   │
│   ├── index.ts                    # Application entry point
│   └── seed.ts                     # Database seeding script
│
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── vercel.json                     # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- MongoDB Atlas account (free tier works)
- MongoDB Compass (optional, for database GUI)

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:

Create a `.env` file in the backend root directory:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/lead-management?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
```

**Important**: Replace the MongoDB connection string with your own credentials.

3. **Generate Prisma Client**:

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

4. **Push schema to database**:

```bash
npm run prisma:push
```

This creates the database collections and indexes.

5. **Seed the database**:

```bash
npm run seed
```

This creates:
- 500 dummy leads with realistic data
- 1 demo user (email: demo@example.com, password: demo123)

6. **Start the development server**:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `PORT` | Server port number | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |

### MongoDB Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Setup MongoDB Atlas**:
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string
6. Replace `<username>`, `<password>`, and `<database>`

## Database Setup

### Prisma Configuration

The `schema.prisma` file defines:
- Database provider (MongoDB)
- Data models (User, Lead)
- Enums (LeadStage, LeadStatus)
- Indexes for performance

### Models

#### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Lead Model
```prisma
model Lead {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  firstName   String
  lastName    String
  email       String     @unique
  phone       String
  company     String
  position    String
  stage       LeadStage
  status      LeadStatus
  source      String
  value       Float
  notes       String?
  assignedTo  String?
  country     String
  city        String
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([stage])
  @@index([status])
  @@index([source])
  @@index([createdAt])
}
```

### Enums

#### LeadStage
- `NEW` - New lead, not yet contacted
- `CONTACTED` - Initial contact made
- `QUALIFIED` - Lead is qualified
- `PROPOSAL` - Proposal sent
- `NEGOTIATION` - In negotiation phase
- `CLOSED_WON` - Successfully closed
- `CLOSED_LOST` - Lost opportunity

#### LeadStatus
- `ACTIVE` - Currently active lead
- `INACTIVE` - Inactive lead
- `CONVERTED` - Converted to customer
- `REJECTED` - Rejected/Disqualified

### Indexes

Performance indexes on:
- `stage` - Fast filtering by stage
- `status` - Fast filtering by status
- `source` - Fast filtering by source
- `createdAt` - Fast sorting by date

## Available Scripts

### Development

```bash
npm run dev
```
Starts development server with hot reload using ts-node-dev

### Production Build

```bash
npm run build
```
Compiles TypeScript to JavaScript in `dist/` directory

### Start Production Server

```bash
npm start
```
Runs compiled JavaScript from `dist/index.js`

### Database Scripts

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with dummy data
npm run seed
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```
Opens web-based database browser at `http://localhost:5555`

## API Documentation

### Base URL

- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

### Response Format

All responses follow this structure:

**Success Response**:
```json
{
  "message": "Success message",
  "data": { ... },
  "pagination": { ... }  // For paginated endpoints
}
```

**Error Response**:
```json
{
  "message": "Error message",
  "errors": [ ... ]  // Validation errors if applicable
}
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Response** (200 OK):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "demo@example.com",
    "name": "Demo User"
  }
}
```

### Lead Endpoints

**Authentication Required**: All lead endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### Get All Leads

```http
GET /api/leads?page=1&limit=10&search=john&stage=NEW&status=ACTIVE&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

**Query Parameters**:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |
| `search` | string | Search term (name, email, company, phone) | - |
| `stage` | string | Filter by stage | - |
| `status` | string | Filter by status | - |
| `source` | string | Filter by source | - |
| `country` | string | Filter by country | - |
| `sortBy` | string | Sort field (createdAt, firstName, lastName, company, value) | createdAt |
| `sortOrder` | string | Sort order (asc, desc) | desc |

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "position": "CEO",
      "stage": "NEW",
      "status": "ACTIVE",
      "source": "Website",
      "value": 50000,
      "notes": "Interested in enterprise plan",
      "assignedTo": "sales-rep-1",
      "country": "USA",
      "city": "New York",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-16T14:20:00.000Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 10,
    "totalPages": 50
  }
}
```

#### Get Lead by ID

```http
GET /api/leads/:id
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "position": "CEO",
  "stage": "QUALIFIED",
  "status": "ACTIVE",
  "source": "Website",
  "value": 50000,
  "notes": "Interested in enterprise plan",
  "assignedTo": "sales-rep-1",
  "country": "USA",
  "city": "New York",
  "createdAt": "2026-01-15T10:30:00.000Z",
  "updatedAt": "2026-01-16T14:20:00.000Z"
}
```

#### Get Analytics

```http
GET /api/leads/analytics
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "totalLeads": 500,
  "convertedLeads": 75,
  "activeLeads": 350,
  "totalValue": 50000000,
  "averageValue": 100000,
  "leadsByStage": {
    "NEW": 120,
    "CONTACTED": 80,
    "QUALIFIED": 100,
    "PROPOSAL": 70,
    "NEGOTIATION": 50,
    "CLOSED_WON": 50,
    "CLOSED_LOST": 30
  },
  "leadsByStatus": {
    "ACTIVE": 350,
    "INACTIVE": 50,
    "CONVERTED": 75,
    "REJECTED": 25
  },
  "leadsBySource": [
    { "source": "Website", "count": 200 },
    { "source": "Referral", "count": 150 },
    { "source": "Social Media", "count": 100 },
    { "source": "Cold Call", "count": 50 }
  ]
}
```

### Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

## Database Schema

### Collections

MongoDB creates these collections:
- `users` - User accounts
- `leads` - Lead records

### User Document Example

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "demo@example.com",
  "password": "$2a$10$...",  // bcrypt hash
  "name": "Demo User",
  "createdAt": ISODate("2026-01-16T10:00:00.000Z"),
  "updatedAt": ISODate("2026-01-16T10:00:00.000Z")
}
```

### Lead Document Example

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "position": "CEO",
  "stage": "QUALIFIED",
  "status": "ACTIVE",
  "source": "Website",
  "value": 50000,
  "notes": "Interested in enterprise plan",
  "assignedTo": "sales-rep-1",
  "country": "USA",
  "city": "New York",
  "createdAt": ISODate("2026-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2026-01-16T14:20:00.000Z")
}
```

## Authentication

### JWT Implementation

**Token Generation**:
```typescript
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);
```

**Token Verification**:
```typescript
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
```

### Password Hashing

**Hash Password**:
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```

**Verify Password**:
```typescript
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Auth Middleware

Protects routes by:
1. Extracting token from Authorization header
2. Verifying token signature
3. Checking token expiration
4. Attaching user ID to request
5. Allowing request to proceed or returning 401

## Validation

### Zod Schemas

All requests are validated using Zod schemas before reaching controllers.

**Example - Login Validation**:
```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
```

**Example - Lead Query Validation**:
```typescript
const leadQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  stage: z.enum([...leadStages]).optional(),
  status: z.enum([...leadStatuses]).optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'company', 'value']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});
```

### Validation Middleware

Automatically validates requests and returns 400 with detailed errors:

```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Error Handling

### Error Response Structure

```typescript
{
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  stack?: string; // Only in development
}
```

### Common Errors

**Validation Error (400)**:
```json
{
  "message": "Validation error",
  "errors": [...]
}
```

**Unauthorized (401)**:
```json
{
  "message": "Invalid or expired token"
}
```

**Not Found (404)**:
```json
{
  "message": "Lead not found"
}
```

**Duplicate Email (409)**:
```json
{
  "message": "Email already exists"
}
```

## Deployment

### Railway (Recommended)

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add MongoDB Plugin**:
   - Click "New" → "Database" → "Add MongoDB"
   - Railway provides a MongoDB instance

4. **Configure Environment Variables**:
   ```
   DATABASE_URL=<from-railway-mongodb>
   JWT_SECRET=your-secret-key-change-this
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**:
   - Railway auto-deploys on git push
   - Get your deployment URL

### Render

1. **Create Render Account**: [render.com](https://render.com)

2. **New Web Service**:
   - Connect GitHub repository
   - Select backend directory

3. **Configure**:
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`

4. **Environment Variables**:
   - Add all variables from `.env`
   - Use MongoDB Atlas for database

5. **Deploy**:
   - Click "Create Web Service"

### Vercel

The `vercel.json` is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

Deploy:
```bash
vercel
```

### Environment Setup for Production

1. Use strong JWT secret (32+ characters)
2. Restrict MongoDB IP whitelist
3. Enable MongoDB authentication
4. Use HTTPS only
5. Set appropriate CORS origins
6. Enable rate limiting
7. Set up monitoring

## Testing

### Manual Testing with Postman/Insomnia

1. **Import Collection**: Create requests for all endpoints

2. **Test Authentication**:
   - Register user
   - Login
   - Copy JWT token

3. **Test Lead Endpoints**:
   - Add token to Authorization header
   - Test all query parameters
   - Verify pagination
   - Test error cases

### Sample Test Flow

```bash
# 1. Login
POST http://localhost:5000/api/auth/login
Body: { "email": "demo@example.com", "password": "demo123" }

# 2. Get Leads
GET http://localhost:5000/api/leads?page=1&limit=10
Headers: Authorization: Bearer <token>

# 3. Search Leads
GET http://localhost:5000/api/leads?search=john
Headers: Authorization: Bearer <token>

# 4. Filter by Stage
GET http://localhost:5000/api/leads?stage=NEW&status=ACTIVE
Headers: Authorization: Bearer <token>

# 5. Get Analytics
GET http://localhost:5000/api/leads/analytics
Headers: Authorization: Bearer <token>
```

## Security

### Implemented Security Measures

1. **Password Security**:
   - Bcrypt hashing (10 rounds)
   - Never store plain passwords
   - Minimum password length

2. **JWT Security**:
   - Signed tokens
   - 7-day expiration
   - Secret key from environment
   - Verified on each request

3. **CORS**:
   - Configured allowed origins
   - Credentials support
   - Method restrictions

4. **Input Validation**:
   - Zod schema validation
   - Type checking
   - Sanitization

5. **Error Handling**:
   - No sensitive data in errors
   - Stack traces only in development
   - Generic error messages

6. **Database Security**:
   - Prisma prepared statements
   - No direct query injection
   - Indexed fields

### Security Best Practices

- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Enable API versioning
- [ ] Add input sanitization
- [ ] Implement refresh tokens
- [ ] Add account lockout
- [ ] Enable 2FA (future)
- [ ] Add audit logging
- [ ] Implement RBAC (future)

## Performance Optimizations

1. **Database Indexes**:
   - stage, status, source, createdAt

2. **Connection Pooling**:
   - Prisma handles automatically

3. **Query Optimization**:
   - Select only needed fields
   - Efficient filtering
   - Pagination instead of full fetch

4. **Caching** (Future):
   - Redis for frequently accessed data
   - Cache analytics results

## Troubleshooting

### Common Issues

**1. "Cannot connect to MongoDB"**
- Check DATABASE_URL is correct
- Verify MongoDB Atlas IP whitelist
- Check network connectivity
- Ensure database user has correct permissions

**2. "Prisma Client not generated"**
- Run: `npm run prisma:generate`
- Check `node_modules/@prisma/client` exists

**3. "JWT verification failed"**
- Check JWT_SECRET matches between environments
- Verify token hasn't expired
- Check Authorization header format

**4. "Port already in use"**
- Change PORT in .env
- Kill process using port: `lsof -ti:5000 | xargs kill -9`

**5. "Validation errors"**
- Check request body matches schema
- Verify data types
- Check required fields

### Debug Mode

Enable detailed logging:
```typescript
// In index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use Zod for all validation
3. Add proper error handling
4. Write descriptive commit messages
5. Keep functions small and focused
6. Use meaningful variable names

### Code Style

- Use camelCase for variables/functions
- Use PascalCase for types/interfaces
- Use UPPER_CASE for constants
- Indent with 2 spaces
- Use semicolons
- Use async/await over promises

## Future Enhancements

Potential improvements:
- [ ] Add update/delete lead endpoints
- [ ] Implement role-based access control
- [ ] Add email notifications
- [ ] Implement real-time updates (WebSocket)
- [ ] Add file upload for lead documents
- [ ] Implement activity logging
- [ ] Add bulk operations
- [ ] Implement data export (CSV/Excel)
- [ ] Add API versioning
- [ ] Implement rate limiting
- [ ] Add comprehensive test suite
- [ ] Add API documentation (Swagger)

## License

MIT

## Support

For issues or questions:
1. Check this README
2. Review Prisma documentation
3. Check MongoDB Atlas documentation
4. Review Express.js documentation

---

**Built with**: Node.js, Express, TypeScript, Prisma, MongoDB
**Last Updated**: January 2026
**API Version**: 1.0.0