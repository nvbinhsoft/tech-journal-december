import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { UsersService } from '../users/users.service.js';
import { TagsService } from '../tags/tags.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { ArticlesService } from '../articles/articles.service.js';
import { ConfigService } from '@nestjs/config';

// Sample articles data
const sampleArticles = [
    {
        title: 'Getting Started with TypeScript in 2024',
        slug: 'getting-started-with-typescript-2024',
        excerpt: 'A comprehensive guide to setting up TypeScript for modern web development, covering best practices and common pitfalls.',
        content: `# Getting Started with TypeScript in 2024

TypeScript has become the industry standard for building large-scale JavaScript applications. In this guide, we'll cover everything you need to know to get started.

## Why TypeScript?

TypeScript adds static type checking to JavaScript, helping you catch errors before runtime. This is incredibly valuable for:

- **Better IDE support**: Autocomplete, refactoring, and inline documentation
- **Fewer bugs**: Catch type errors at compile time
- **Improved maintainability**: Self-documenting code with type annotations

## Setting Up Your Project

First, install TypeScript globally:

\`\`\`bash
npm install -g typescript
\`\`\`

Then initialize your project:

\`\`\`bash
tsc --init
\`\`\`

## Essential Configuration

Here's a recommended \`tsconfig.json\` for modern projects:

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true
  }
}
\`\`\`

Happy coding with TypeScript!`,
        tags: ['typescript'],
        published: true,
    },
    {
        title: 'Building a REST API with NestJS and MongoDB',
        slug: 'building-rest-api-nestjs-mongodb',
        excerpt: 'Learn how to build a production-ready REST API using NestJS framework with MongoDB as the database.',
        content: `# Building a REST API with NestJS and MongoDB

NestJS is a powerful Node.js framework that brings Angular-like architecture to the backend. Combined with MongoDB, it's perfect for building scalable APIs.

## Project Setup

\`\`\`bash
npm install -g @nestjs/cli
nest new my-api
cd my-api
npm install @nestjs/mongoose mongoose
\`\`\`

## Creating Your First Module

NestJS uses modules to organize your code:

\`\`\`typescript
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
\`\`\`

## Defining Schemas

With Mongoose, you define your data structure:

\`\`\`typescript
@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;
}
\`\`\`

This combination gives you the best of both worlds: structured code and flexible data storage.`,
        tags: ['nestjs', 'mongodb', 'nodejs'],
        published: true,
    },
    {
        title: 'React Hooks: A Complete Guide',
        slug: 'react-hooks-complete-guide',
        excerpt: 'Master React Hooks from useState to custom hooks. Everything you need to write modern React components.',
        content: `# React Hooks: A Complete Guide

Hooks revolutionized how we write React components. Let's explore the most important ones.

## useState

The most basic hook for managing state:

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect

For side effects like data fetching:

\`\`\`jsx
useEffect(() => {
  fetchData();
}, [dependency]);
\`\`\`

## Custom Hooks

Create reusable logic:

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
\`\`\`

Hooks make your React code cleaner and more reusable!`,
        tags: ['react', 'typescript'],
        published: true,
    },
    {
        title: 'Docker for Node.js Developers',
        slug: 'docker-nodejs-developers',
        excerpt: 'Learn how to containerize your Node.js applications with Docker for consistent development and deployment.',
        content: `# Docker for Node.js Developers

Docker ensures your Node.js app runs the same everywhere. Here's how to get started.

## Basic Dockerfile

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "dist/main.js"]
\`\`\`

## Docker Compose for Development

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
\`\`\`

## Best Practices

1. Use multi-stage builds
2. Don't run as root
3. Use .dockerignore
4. Leverage build cache

Docker makes deployment predictable and scalable!`,
        tags: ['docker', 'nodejs'],
        published: true,
    },
    {
        title: 'MongoDB Aggregation Pipeline Deep Dive',
        slug: 'mongodb-aggregation-pipeline-deep-dive',
        excerpt: 'Unlock the power of MongoDB aggregation pipelines for complex data transformations and analytics.',
        content: `# MongoDB Aggregation Pipeline Deep Dive

The aggregation pipeline is MongoDB's most powerful feature for data analysis.

## Pipeline Stages

### $match - Filter Documents

\`\`\`javascript
{ $match: { status: "published" } }
\`\`\`

### $group - Aggregate Data

\`\`\`javascript
{ $group: { _id: "$category", count: { $sum: 1 } } }
\`\`\`

### $lookup - Join Collections

\`\`\`javascript
{
  $lookup: {
    from: "authors",
    localField: "authorId",
    foreignField: "_id",
    as: "author"
  }
}
\`\`\`

## Real-World Example

Get article stats by tag:

\`\`\`javascript
db.articles.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
\`\`\`

Master aggregations to unlock MongoDB's full potential!`,
        tags: ['mongodb'],
        published: true,
    },
    {
        title: 'AWS Lambda with TypeScript: Serverless Made Easy',
        slug: 'aws-lambda-typescript-serverless',
        excerpt: 'Build and deploy serverless functions using AWS Lambda with TypeScript for type-safe cloud computing.',
        content: `# AWS Lambda with TypeScript

Serverless computing lets you focus on code, not infrastructure. Here's how to use Lambda with TypeScript.

## Project Setup

\`\`\`bash
npm install -g serverless
serverless create --template aws-nodejs-typescript
\`\`\`

## Lambda Handler

\`\`\`typescript
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };
};
\`\`\`

## Deployment

\`\`\`bash
serverless deploy
\`\`\`

That's it! Your function is now live on AWS.`,
        tags: ['aws', 'typescript', 'nodejs'],
        published: true,
    },
    {
        title: 'State Management in React: Zustand vs Redux',
        slug: 'state-management-zustand-vs-redux',
        excerpt: 'Compare Zustand and Redux for React state management. Learn when to use each and their trade-offs.',
        content: `# State Management: Zustand vs Redux

Choosing the right state management library is crucial. Let's compare the two popular options.

## Zustand - Minimal and Elegant

\`\`\`typescript
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
\`\`\`

## Redux Toolkit - Powerful and Structured

\`\`\`typescript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
  },
});
\`\`\`

## When to Use Which?

| Use Case | Recommendation |
|----------|----------------|
| Small to medium apps | Zustand |
| Large enterprise apps | Redux Toolkit |
| Need middleware | Redux |
| Quick prototyping | Zustand |

Both are excellent choices - pick based on your project size!`,
        tags: ['react', 'typescript'],
        published: true,
    },
    {
        title: 'GraphQL vs REST: Making the Right Choice',
        slug: 'graphql-vs-rest-making-right-choice',
        excerpt: 'Understand the differences between GraphQL and REST APIs to make informed architectural decisions.',
        content: `# GraphQL vs REST: Making the Right Choice

Both GraphQL and REST have their place. Let's explore when to use each.

## REST Advantages

- Simple and well-understood
- Great caching with HTTP
- Stateless communication
- Wide tooling support

## GraphQL Advantages

- Fetch exactly what you need
- Single endpoint
- Strong typing with schema
- Great for complex, nested data

## Example Comparison

**REST**: Multiple requests needed
\`\`\`
GET /users/1
GET /users/1/posts
GET /users/1/followers
\`\`\`

**GraphQL**: One request
\`\`\`graphql
query {
  user(id: 1) {
    name
    posts { title }
    followers { name }
  }
}
\`\`\`

Choose based on your data complexity and team experience!`,
        tags: ['graphql', 'nodejs'],
        published: true,
    },
    {
        title: 'Deploying Node.js Apps to AWS ECS',
        slug: 'deploying-nodejs-aws-ecs',
        excerpt: 'Step-by-step guide to deploying containerized Node.js applications to AWS Elastic Container Service.',
        content: `# Deploying Node.js Apps to AWS ECS

ECS is a great way to run Docker containers in production. Here's how to deploy your Node.js app.

## Prerequisites

- Docker installed
- AWS CLI configured
- ECR repository created

## Push to ECR

\`\`\`bash
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ECR_URL
docker build -t my-app .
docker push YOUR_ECR_URL/my-app:latest
\`\`\`

## Create Task Definition

Define CPU, memory, and container settings in your task definition JSON.

## Create Service

\`\`\`bash
aws ecs create-service \\
  --cluster my-cluster \\
  --service-name my-service \\
  --task-definition my-task \\
  --desired-count 2
\`\`\`

Your app is now running on AWS with auto-scaling capabilities!`,
        tags: ['aws', 'docker', 'nodejs'],
        published: true,
    },
    {
        title: 'Testing NestJS Applications',
        slug: 'testing-nestjs-applications',
        excerpt: 'Learn how to write unit tests, integration tests, and e2e tests for your NestJS applications.',
        content: `# Testing NestJS Applications

Good tests are essential for maintainable software. NestJS makes testing easy.

## Unit Testing Services

\`\`\`typescript
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
  });

  it('should create a user', async () => {
    const user = await service.create('test@example.com', 'password');
    expect(user.email).toBe('test@example.com');
  });
});
\`\`\`

## E2E Testing

\`\`\`typescript
describe('Users (e2e)', () => {
  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200);
  });
});
\`\`\`

Write tests as you build features for confident deployments!`,
        tags: ['nestjs', 'typescript'],
        published: true,
    },
    {
        title: 'React Performance Optimization Tips',
        slug: 'react-performance-optimization-tips',
        excerpt: 'Practical tips to make your React applications faster, from memoization to code splitting.',
        content: `# React Performance Optimization Tips

A fast app is a good app. Here are proven ways to speed up React.

## 1. Use React.memo

Prevent unnecessary re-renders:

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* complex rendering */}</div>;
});
\`\`\`

## 2. useMemo for Expensive Calculations

\`\`\`jsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
\`\`\`

## 3. Code Splitting with Lazy Loading

\`\`\`jsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
\`\`\`

## 4. Virtualize Long Lists

Use react-window or react-virtualized for lists with thousands of items.

## 5. Optimize Images

- Use next/image or similar
- Lazy load below-the-fold images
- Serve WebP format

Profile first, then optimize!`,
        tags: ['react', 'typescript'],
        published: true,
    },
    {
        title: 'Understanding MongoDB Indexes',
        slug: 'understanding-mongodb-indexes',
        excerpt: 'Learn how MongoDB indexes work and how to use them effectively for query optimization.',
        content: `# Understanding MongoDB Indexes

Indexes are crucial for MongoDB performance. Let's understand them deeply.

## Creating Indexes

\`\`\`javascript
db.articles.createIndex({ slug: 1 }, { unique: true });
db.articles.createIndex({ tags: 1 });
db.articles.createIndex({ title: "text", content: "text" });
\`\`\`

## Index Types

- **Single Field**: Basic index on one field
- **Compound**: Multiple fields together
- **Text**: Full-text search
- **Geospatial**: Location queries

## The explain() Method

\`\`\`javascript
db.articles.find({ slug: "my-article" }).explain("executionStats");
\`\`\`

Look for "IXSCAN" (good) vs "COLLSCAN" (bad).

## Best Practices

1. Index fields used in queries
2. Consider query patterns
3. Don't over-index (writes slow down)
4. Monitor index usage

Right indexes = fast queries!`,
        tags: ['mongodb'],
        published: true,
    },
    {
        title: 'Building a CI/CD Pipeline with GitHub Actions',
        slug: 'building-cicd-pipeline-github-actions',
        excerpt: 'Automate your testing and deployment workflow using GitHub Actions for Node.js projects.',
        content: `# Building a CI/CD Pipeline with GitHub Actions

Automate your workflow for faster, safer deployments.

## Basic Workflow

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Deploy to production"
\`\`\`

## Adding Docker Build

\`\`\`yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: user/app:latest
\`\`\`

Commit, push, and let GitHub do the rest!`,
        tags: ['docker', 'nodejs'],
        published: true,
    },
    {
        title: 'TypeScript Utility Types You Should Know',
        slug: 'typescript-utility-types-you-should-know',
        excerpt: 'Master TypeScript utility types like Partial, Pick, Omit, and more for cleaner type definitions.',
        content: `# TypeScript Utility Types You Should Know

TypeScript's built-in utility types save you from writing repetitive type code.

## Partial<T>

Make all properties optional:

\`\`\`typescript
interface User {
  name: string;
  email: string;
}

type UpdateUser = Partial<User>;
// { name?: string; email?: string; }
\`\`\`

## Pick<T, K>

Select specific properties:

\`\`\`typescript
type UserPreview = Pick<User, 'name'>;
// { name: string; }
\`\`\`

## Omit<T, K>

Remove specific properties:

\`\`\`typescript
type UserWithoutEmail = Omit<User, 'email'>;
// { name: string; }
\`\`\`

## Record<K, T>

Create key-value types:

\`\`\`typescript
type Roles = Record<string, string[]>;
// { [key: string]: string[]; }
\`\`\`

## ReturnType<T>

Get function return type:

\`\`\`typescript
type Result = ReturnType<typeof myFunction>;
\`\`\`

Use these to write DRY, expressive types!`,
        tags: ['typescript'],
        published: true,
    },
    {
        title: 'Implementing Authentication with JWT',
        slug: 'implementing-authentication-jwt',
        excerpt: 'A practical guide to implementing secure JWT-based authentication in Node.js applications.',
        content: `# Implementing Authentication with JWT

JSON Web Tokens are the standard for API authentication. Let's implement it securely.

## How JWT Works

1. User logs in with credentials
2. Server validates and returns JWT
3. Client includes JWT in requests
4. Server validates JWT on each request

## Generating Tokens

\`\`\`typescript
import { sign } from 'jsonwebtoken';

const token = sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
\`\`\`

## Validating Tokens

\`\`\`typescript
import { verify } from 'jsonwebtoken';

const payload = verify(token, process.env.JWT_SECRET);
\`\`\`

## Security Best Practices

1. Use strong secrets (32+ characters)
2. Set short expiration times
3. Use HTTPS only
4. Store tokens securely (httpOnly cookies)
5. Implement token refresh

Never store JWTs in localStorage for sensitive apps!`,
        tags: ['nodejs', 'typescript'],
        published: true,
    },
];

async function seed() {
    console.log('🌱 Starting database seed...');

    const app = await NestFactory.createApplicationContext(AppModule);

    const usersService = app.get(UsersService);
    const tagsService = app.get(TagsService);
    const settingsService = app.get(SettingsService);
    const articlesService = app.get(ArticlesService);
    const configService = app.get(ConfigService);

    try {
        // 1. Create admin user
        console.log('👤 Creating admin user...');
        const adminEmail = configService.get<string>('admin.email') ?? 'admin@example.com';
        const adminPassword = configService.get<string>('admin.password') ?? 'Admin123!';

        const existingUser = await usersService.findByEmail(adminEmail);
        if (!existingUser) {
            await usersService.create(adminEmail, adminPassword);
            console.log(`   ✅ Admin user created: ${adminEmail}`);
        } else {
            console.log(`   ⏭️  Admin user already exists: ${adminEmail}`);
        }

        // 2. Create default tags
        // console.log('🏷️  Creating default tags...');
        // const defaultTags = [
        //     { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
        //     { name: 'React', slug: 'react', color: '#61DAFB' },
        //     { name: 'Node.js', slug: 'nodejs', color: '#339933' },
        //     { name: 'MongoDB', slug: 'mongodb', color: '#47A248' },
        //     { name: 'NestJS', slug: 'nestjs', color: '#E0234E' },
        //     { name: 'GraphQL', slug: 'graphql', color: '#E535AB' },
        //     { name: 'Docker', slug: 'docker', color: '#2496ED' },
        //     { name: 'AWS', slug: 'aws', color: '#FF9900' },
        // ];
// 
        // const tagMap: Record<string, string> = {};
        // for (const tagData of defaultTags) {
        //     try {
        //         const tag = await tagsService.create(tagData);
        //         tagMap[tagData.slug] = tag.id;
        //         console.log(`   ✅ Created tag: ${tagData.name}`);
        //     } catch {
        //         // Tag exists, find it
        //         const existingTags = await tagsService.findAll();
        //         const existing = existingTags.find((t) => t.slug === tagData.slug);
        //         if (existing && existing.id) {
        //             tagMap[tagData.slug] = existing.id;
        //         }
        //         console.log(`   ⏭️  Tag already exists: ${tagData.name}`);
        //     }
        // }

        // 3. Initialize default settings
        // console.log('⚙️  Initializing default settings...');
        // await settingsService.get();
        // console.log('   ✅ Default settings initialized');

        // 4. Create sample articles
        // console.log('📝 Creating sample articles...');
        // for (const articleData of sampleArticles) {
        //     try {
        //         // Map tag slugs to tag IDs
        //         const tagIds = articleData.tags
        //             .map((slug) => tagMap[slug])
        //             .filter((id): id is string => id !== undefined);

        //         await articlesService.create({
        //             title: articleData.title,
        //             slug: articleData.slug,
        //             excerpt: articleData.excerpt,
        //             content: articleData.content,
        //             tags: tagIds,
        //             published: articleData.published,
        //         });
        //         console.log(`   ✅ Created article: ${articleData.title}`);
        //     } catch (error: any) {
        //         if (error.message?.includes('duplicate') || error.code === 11000) {
        //             console.log(`   ⏭️  Article already exists: ${articleData.title}`);
        //         } else {
        //             console.log(`   ❌ Failed to create: ${articleData.title} - ${error.message}`);
        //         }
        //     }
        // }

        console.log('\n🎉 Seed completed successfully!');
    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        await app.close();
    }
}

seed().catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
});
