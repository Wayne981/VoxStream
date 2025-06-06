# VoxStream - Twitter Clone

A full-stack Twitter clone built with Next.js, GraphQL, and PostgreSQL.

## Project Structure

- `lfm2-main/` - Frontend (Next.js)
- `twitter-server-main/` - Backend (Node.js/GraphQL)

## Technologies Used

### Frontend
- Next.js 14
- React Query
- GraphQL Code Generator
- Tailwind CSS
- TypeScript

### Backend
- Node.js
- GraphQL
- Prisma
- PostgreSQL
- AWS S3 for image storage

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL
- AWS Account (for S3)

### Backend Setup
1. Navigate to `twitter-server-main`
```bash
cd twitter-server-main
npm install
```

2. Create `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/twitter_db"
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="your_region"
S3_BUCKET_NAME="your_bucket_name"
JWT_SECRET="your_jwt_secret"
```

3. Run migrations:
```bash
npx prisma generate
npx prisma db push
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to `lfm2-main`
```bash
cd lfm2-main
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features
- User authentication with Google OAuth
- Tweet creation with image upload
- Image storage using AWS S3
- Real-time updates
- Responsive design

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region
- `S3_BUCKET_NAME`: S3 bucket name
- `JWT_SECRET`: Secret for JWT tokens

### Frontend (.env)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 