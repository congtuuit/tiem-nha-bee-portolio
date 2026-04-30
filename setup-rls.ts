import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const queries = [
    `ALTER TABLE products ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "Public can view products" ON products;`,
    `DROP POLICY IF EXISTS "Admin can insert" ON products;`,
    `DROP POLICY IF EXISTS "Admin can update" ON products;`,
    `DROP POLICY IF EXISTS "Admin can delete" ON products;`,
    `CREATE POLICY "Public can view products" ON products FOR SELECT USING ( true );`,
    `CREATE POLICY "Admin can insert" ON products FOR INSERT TO authenticated WITH CHECK ( true );`,
    `CREATE POLICY "Admin can update" ON products FOR UPDATE TO authenticated USING ( true );`,
    `CREATE POLICY "Admin can delete" ON products FOR DELETE TO authenticated USING ( true );`
  ];

  try {
    for (const q of queries) {
      await prisma.$executeRawUnsafe(q);
    }
    console.log("Cấu hình RLS thành công!")
  } catch (error) {
    console.error("Lỗi khi cấu hình RLS:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
