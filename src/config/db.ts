import pkg from '@prisma/client';
import logger from '@/utils/logger.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      await prisma.$connect();
      logger.info('🐘 Connected to PostgreSQL via Prisma');
      return;
    } catch (error) {
      retries -= 1;
      logger.error(`❌ Database connection failed. Retries left: ${retries}`, error);
      if (retries === 0) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default prisma;
