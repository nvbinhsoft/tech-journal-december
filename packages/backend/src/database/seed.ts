import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { UsersService } from '../users/users.service.js';
import { TagsService } from '../tags/tags.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { ArticlesService } from '../articles/articles.service.js';
import { ConfigService } from '@nestjs/config';

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

    // 2. Create sample tags
    console.log('🏷️  Creating sample tags...');
    const sampleTags = [
      { name: 'React', slug: 'react', color: '#61DAFB' },
      { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { name: 'System Design', slug: 'system-design', color: '#10B981' },
      { name: 'Career', slug: 'career', color: '#F59E0B' },
    ];

    const tagMap = new Map();
    for (const tagData of sampleTags) {
      const existingTags = await tagsService.findAll();
      const existing = existingTags.find(t => t.slug === tagData.slug);
      if (!existing) {
        const tag = await tagsService.create(tagData);
        tagMap.set(tagData.slug, tag.id);
        console.log(`   ✅ Tag created: ${tagData.name}`);
      } else {
        tagMap.set(tagData.slug, existing.id);
        console.log(`   ⏭️  Tag already exists: ${tagData.name}`);
      }
    }

    // 3. Create sample settings
    console.log('⚙️  Updating settings...');
    await settingsService.update({
      blogTitle: 'The Engineering Chronicle',
      blogDescription: 'Insights on software engineering, system design, and building great products.',
      authorName: 'Alex Chen',
      authorBio: 'Senior Software Engineer with a passion for scalable architectures and clean code.',
    });
    console.log('   ✅ Settings updated');

    // 4. Create sample articles
    console.log('📝 Creating sample articles...');
    const sampleArticles = [
      {
        title: 'Building Scalable React Applications',
        slug: 'building-scalable-react-applications',
        excerpt: 'Learn the architectural patterns and best practices for building React applications that scale with your team and user base.',
        content: `# Building Scalable React Applications\n\nWhen building large-scale React applications, architecture matters. In this post, we'll explore patterns that help teams maintain velocity as codebases grow.\n\n## Component Architecture\n\nThe key to scalable React applications lies in how you structure your components. Here are some principles I've found invaluable:\n\n### 1. Composition Over Inheritance\n\nReact's compositional model is its greatest strength. Instead of creating complex component hierarchies, compose simple components together.\n\n\`\`\`tsx\n// Instead of a monolithic component\nfunction Dashboard() {\n  return (\n    <DashboardLayout>\n      <Sidebar />\n      <MainContent>\n        <Header />\n        <MetricsGrid />\n        <ActivityFeed />\n      </MainContent>\n    </DashboardLayout>\n  );\n}\n\`\`\`\n\n### 2. State Colocation\n\nKeep state as close as possible to where it's used. This reduces prop drilling and makes components more self-contained.\n\n### 3. Custom Hooks for Logic Reuse\n\nExtract complex logic into custom hooks. This keeps components focused on rendering while making logic testable and reusable.\n\n## Conclusion\n\nBuilding scalable applications is about making the right architectural decisions early. These patterns have served me well across multiple large-scale projects.`,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
        tags: [tagMap.get('react'), tagMap.get('typescript')].filter(Boolean),
        published: true,
      },
      {
        title: 'TypeScript Tips for Senior Engineers',
        slug: 'typescript-tips-for-senior-engineers',
        excerpt: 'Advanced TypeScript patterns that will level up your code quality and developer experience.',
        content: `# TypeScript Tips for Senior Engineers\n\nAfter years of working with TypeScript, here are patterns that have dramatically improved my code quality.\n\n## Discriminated Unions\n\nOne of TypeScript's most powerful features for modeling state:\n\n\`\`\`typescript\ntype LoadingState<T> = \n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error };\n\`\`\`\n\n## Template Literal Types\n\nCreate precise string types:\n\n\`\`\`typescript\ntype HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';\ntype Endpoint = \`/api/\${string}\`;\ntype Route = \`\${HTTPMethod} \${Endpoint}\`;\n\`\`\`\n\n## The Power of 'satisfies'\n\nValidate types while preserving inference:\n\n\`\`\`typescript\nconst config = {\n  port: 3000,\n  host: 'localhost',\n} satisfies Record<string, string | number>;\n\`\`\`\n\nThese patterns have helped me catch bugs at compile time and create more maintainable codebases.`,
        coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop',
        tags: [tagMap.get('typescript')].filter(Boolean),
        published: true,
      }
    ];

    for (const article of sampleArticles) {
      try {
        await articlesService.findBySlug(article.slug);
        console.log(`   ⏭️  Article already exists: ${article.title}`);
      } catch {
        await articlesService.create(article);
        console.log(`   ✅ Article created: ${article.title}`);
      }
    }

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
