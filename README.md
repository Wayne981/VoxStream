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

Json webtoken for googleAuth
![image](https://github.com/user-attachments/assets/63fd4fa0-27ee-4f41-8067-42413cc4d063)

npx prisma studio for the token
![image](https://github.com/user-attachments/assets/a6c95ae4-8c8d-4942-98ee-475f96744a24)

id
![image](https://github.com/user-attachments/assets/bb97c4b5-6c62-4f03-9902-17fd6e97ccc1)

Fetching specific queries using graphql
![image](https://github.com/user-attachments/assets/19ae145a-3bfe-4861-a96f-462a8f8ad39b)

Tanstack for storing user info
![image](https://github.com/user-attachments/assets/85b38ac9-ce10-40ae-b84a-501ba17a1135)

Deletion of the token for logout . When logged out
![image](https://github.com/user-attachments/assets/1eb6b197-c8b2-4ed4-ba0c-769e91359ccd)

Redis database in upstash for caching and rate limiting in code
![image](https://github.com/user-attachments/assets/1877c46c-5d45-48ea-9451-c875ad37bb07)

Redis reduces the response time and therefore increasing speed
Rate limiting helps to detect spams of tweets




