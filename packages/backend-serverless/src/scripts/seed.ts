import { connectToDatabase } from '../lib/database.js';
import { User } from '../models/User.js';
import { Tag } from '../models/Tag.js';
import { Settings } from '../models/Settings.js';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Starting database seed...');

    await connectToDatabase();

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@techjournal.com' });
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@techjournal.com',
            passwordHash,
            name: 'Admin',
            role: 'admin',
        });
        console.log('✅ Created admin user: admin@techjournal.com / admin123');
    } else {
        console.log('ℹ️  Admin user already exists');
    }

    // Create default tags
    const defaultTags = [
        { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' },
        { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
        { name: 'React', slug: 'react', color: '#61DAFB' },
        { name: 'Node.js', slug: 'nodejs', color: '#339933' },
        { name: 'AWS', slug: 'aws', color: '#FF9900' },
        { name: 'DevOps', slug: 'devops', color: '#326CE5' },
        { name: 'Tutorial', slug: 'tutorial', color: '#10B981' },
        { name: 'Opinion', slug: 'opinion', color: '#8B5CF6' },
    ];

    for (const tagData of defaultTags) {
        const existingTag = await Tag.findOne({ slug: tagData.slug });
        if (!existingTag) {
            await Tag.create(tagData);
            console.log(`✅ Created tag: ${tagData.name}`);
        }
    }

    // Create default settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
        await Settings.create({
            blogTitle: 'Tech Journal',
            blogDescription: 'A personal blog about technology and software development',
            authorName: 'Admin',
            authorBio: 'Software developer passionate about building things.',
            authorAvatar: null,
            socialLinks: {
                twitter: '',
                github: '',
                linkedin: '',
            },
        });
        console.log('✅ Created default settings');
    } else {
        console.log('ℹ️  Settings already exist');
    }

    console.log('🌱 Seed completed!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
