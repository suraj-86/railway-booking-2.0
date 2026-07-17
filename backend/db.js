import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Grab your database URL from the environment
const connectionString = process.env.DATABASE_URL;

// 2. Create a standard PostgreSQL connection pool
const pool = new Pool({ connectionString });

// 3. Pass that pool into Prisma's PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 4. Initialize the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;