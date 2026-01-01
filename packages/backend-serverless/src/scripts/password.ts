/**
 * Password utility script
 * 
 * Usage:
 *   Generate hash:  npx tsx src/scripts/password.ts hash "your-password"
 *   Verify password: npx tsx src/scripts/password.ts verify "password" "hash"
 */

import bcrypt from 'bcryptjs';

const [, , command, ...args] = process.argv;

async function main() {
    if (command === 'hash') {
        const password = args[0];
        if (!password) {
            console.log('Usage: npx tsx src/scripts/password.ts hash "your-password"');
            process.exit(1);
        }
        const hash = await bcrypt.hash(password, 10);
        console.log('\n🔐 Password Hash Generator\n');
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('\nYou can update MongoDB with:');
        console.log(`db.users.updateOne({email: "your-email"}, {$set: {passwordHash: "${hash}"}})`);
    }
    else if (command === 'verify') {
        const [password, hash] = args;
        if (!password || !hash) {
            console.log('Usage: npx tsx src/scripts/password.ts verify "password" "hash"');
            process.exit(1);
        }
        const isValid = await bcrypt.compare(password, hash);
        console.log('\n🔍 Password Verification\n');
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('Match:', isValid ? '✅ YES' : '❌ NO');
    }
    else {
        console.log('Password Utility\n');
        console.log('Commands:');
        console.log('  hash <password>        Generate bcrypt hash');
        console.log('  verify <password> <hash>  Verify password matches hash');
        console.log('\nExamples:');
        console.log('  npx tsx src/scripts/password.ts hash "mypassword123"');
        console.log('  npx tsx src/scripts/password.ts verify "mypassword123" "$2a$10$..."');
    }
}

main().catch(console.error);
