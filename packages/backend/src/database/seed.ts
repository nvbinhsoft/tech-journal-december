import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { UsersService } from '../users/users.service.js';
import { TagsService } from '../tags/tags.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { ArticlesService } from '../articles/articles.service.js';
import { ConfigService } from '@nestjs/config';

// Sample articles data


async function seed() {
  console.log('🌱 Starting database seed...');

  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
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
