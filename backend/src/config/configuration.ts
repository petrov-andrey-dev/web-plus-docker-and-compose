export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    name: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD,
    schema: process.env.POSTGRES_SCHEMA,
    synchronize: process.env.SYNCHRONIZE,
  },
  jwt: {
    secret: process.env.PRIVATE_KEY || 'SUPER_SECRET',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
