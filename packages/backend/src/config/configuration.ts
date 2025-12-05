export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    apiPrefix: process.env.API_PREFIX ?? 'v1',
    database: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/tech-journal',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'default-secret-change-me',
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
    },
    admin: {
        email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
        password: process.env.ADMIN_PASSWORD ?? 'Admin123!',
    },
});
