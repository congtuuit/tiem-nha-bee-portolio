const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing upsert...');
    const result = await prisma.shop_config.upsert({
      where: { id: 'default' },
      update: { shop_name: 'Test' },
      create: { id: 'default', shop_name: 'Test' },
    });
    console.log('Upsert successful:', result);
  } catch (error) {
    console.error('Upsert failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
