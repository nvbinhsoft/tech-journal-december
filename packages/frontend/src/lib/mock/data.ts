// Mock data for local development without backend
// Used when VITE_MOCK_DATA=true

import type { Article, Tag, Settings, User } from '../api/types';

// Default credentials for mock mode
export const MOCK_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123',
};

// Mock user
export const mockUser: User = {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
};

// Mock tags
export const mockTags: Tag[] = [
    { id: '1', name: 'React', slug: 'react', color: '#61DAFB' },
    { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { id: '3', name: 'System Design', slug: 'system-design', color: '#10B981' },
    { id: '4', name: 'Career', slug: 'career', color: '#F59E0B' },
];

// Mock articles
export const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Building Scalable React Applications',
        slug: 'building-scalable-react-applications',
        excerpt: 'Learn the architectural patterns and best practices for building React applications that scale with your team and user base.',
        content: `# Building Scalable React Applications

When building large-scale React applications, architecture matters. In this post, we'll explore patterns that help teams maintain velocity as codebases grow.

## Component Architecture

The key to scalable React applications lies in how you structure your components. Here are some principles I've found invaluable:

### 1. Composition Over Inheritance

React's compositional model is its greatest strength. Instead of creating complex component hierarchies, compose simple components together.

\`\`\`tsx
// Instead of a monolithic component
function Dashboard() {
  return (
    <DashboardLayout>
      <Sidebar />
      <MainContent>
        <Header />
        <MetricsGrid />
        <ActivityFeed />
      </MainContent>
    </DashboardLayout>
  );
}
\`\`\`

### 2. State Colocation

Keep state as close as possible to where it's used. This reduces prop drilling and makes components more self-contained.

### 3. Custom Hooks for Logic Reuse

Extract complex logic into custom hooks. This keeps components focused on rendering while making logic testable and reusable.

## Conclusion

Building scalable applications is about making the right architectural decisions early. These patterns have served me well across multiple large-scale projects.`,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
        tags: ['1', '2'],
        published: true,
        readingTime: 5,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        title: 'TypeScript Tips for Senior Engineers',
        slug: 'typescript-tips-for-senior-engineers',
        excerpt: 'Advanced TypeScript patterns that will level up your code quality and developer experience.',
        content: `# TypeScript Tips for Senior Engineers

After years of working with TypeScript, here are patterns that have dramatically improved my code quality.

## Discriminated Unions

One of TypeScript's most powerful features for modeling state:

\`\`\`typescript
type LoadingState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
\`\`\`

## Template Literal Types

Create precise string types:

\`\`\`typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = \`/api/\${string}\`;
type Route = \`\${HTTPMethod} \${Endpoint}\`;
\`\`\`

## The Power of 'satisfies'

Validate types while preserving inference:

\`\`\`typescript
const config = {
  port: 3000,
  host: 'localhost',
} satisfies Record<string, string | number>;
\`\`\`

These patterns have helped me catch bugs at compile time and create more maintainable codebases.`,
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop',
        tags: ['2'],
        published: true,
        readingTime: 4,
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-02-01T10:00:00Z',
    },
    {
        id: '3',
        title: 'Designing for Scale: A Practical Guide',
        slug: 'designing-for-scale',
        excerpt: 'System design principles that will help you build applications capable of handling millions of users.',
        content: `# Designing for Scale: A Practical Guide

Scaling systems is both an art and a science. Here's what I've learned from building systems that serve millions.

## Start Simple, Scale When Needed

The biggest mistake I see is premature optimization. Start with a monolith, measure, then scale the bottlenecks.

## Caching is Your Friend

A well-designed caching strategy can reduce database load by 90%+:

- **Application cache**: In-memory for hot data
- **Distributed cache**: Redis for shared state
- **CDN**: Static assets and API responses

## Database Scaling Strategies

1. **Read replicas**: Scale reads independently
2. **Sharding**: Distribute data across nodes
3. **Connection pooling**: Manage database connections efficiently

## Async Processing

Move heavy work off the critical path:

- Message queues for background jobs
- Event-driven architectures for loose coupling
- Batch processing for bulk operations

The key is understanding your system's bottlenecks and addressing them systematically.`,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
        tags: ['3'],
        published: true,
        readingTime: 6,
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-02-20T10:00:00Z',
    },
];

// Mock settings
export const mockSettings: Settings = {
    blogTitle: 'The Engineering Chronicle',
    blogDescription: 'Insights on software engineering, system design, and building great products.',
    authorName: 'Alex Chen',
    authorBio: 'Senior Software Engineer passionate about building scalable systems and sharing knowledge.',
    socialLinks: {
        twitter: 'https://twitter.com',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
    },
};
