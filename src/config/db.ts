import pkg from '@prisma/client';
import logger from '@/utils/logger.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info('🐘 Connected to PostgreSQL via Prisma');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default prisma;
