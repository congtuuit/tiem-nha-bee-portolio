import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Categories
  const categories = [
    { name: 'Thành phẩm Handmade', slug: 'thanh-pham-handmade' },
    { name: 'Len & Sợi', slug: 'len-va-soi' },
    { name: 'Dụng cụ & Phụ kiện', slug: 'dung-cu-phu-kien' },
  ];

  for (const cat of categories) {
    await prisma.categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const allCats = await prisma.categories.findMany();
  const getCatId = (slug: string) => allCats.find(c => c.slug === slug)?.id;

  // 2. Create Products (25 items)
  const products = [
    // Thành phẩm
    { name: 'Gấu Bông Thỏ Hồng Đáng Yêu', slug: 'gau-bong-tho-hong', price: 150000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1558694440-03ade9215d7b?q=80&w=800' },
    { name: 'Móc Khóa Ong Vàng (Bee)', slug: 'moc-khoa-ong-vang', price: 35000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800' },
    { name: 'Túi Len Đeo Chéo Hoa Cúc', slug: 'tui-len-hoa-cuc', price: 220000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=800' },
    { name: 'Khủng Long Len Màu Xanh', slug: 'khung-long-len-xanh', price: 180000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1559440666-4477c28251f0?q=80&w=800' },
    { name: 'Búp Bê Len Dáng Công Chúa', slug: 'bup-be-len-cong-chua', price: 250000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=800' },
    { name: 'Móc Khóa Quả Bơ Len', slug: 'moc-khoa-qua-bo', price: 40000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1583111000888-ba48a706696b?q=80&w=800' },
    { name: 'Lót Ly Hình Hướng Dương', slug: 'lot-ly-huong-duong', price: 25000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1590664095641-7fa05f689813?q=80&w=800' },
    { name: 'Nón Len Beanie Handmade', slug: 'non-len-beanie', price: 120000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800' },
    { name: 'Túi Đựng Airpod Hình Heo', slug: 'tui-airpod-heo', price: 55000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1588444839799-eb0c5990e760?q=80&w=800' },
    { name: 'Chậu Hoa Tulip Len', slug: 'chau-hoa-tulip-len', price: 85000, category_id: getCatId('thanh-pham-handmade'), cover_image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800' },
    
    // Len & Sợi
    { name: 'Len Cotton Milk 50g', slug: 'len-cotton-milk-50g', price: 12000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=800' },
    { name: 'Len Nhung Đũa Loại 1', slug: 'len-nhung-dua', price: 35000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=800' },
    { name: 'Len Jean YarnArt Nhập Khẩu', slug: 'len-jean-yarnart', price: 45000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800' },
    { name: 'Sợi Dệt Thô Làm Túi', slug: 'soi-det-tho', price: 28000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1506806732259-39c2d4a3b5a5?q=80&w=800' },
    { name: 'Len Baby Yarn Siêu Mềm', slug: 'len-baby-yarn', price: 18000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1528476513691-07e6f563d97f?q=80&w=800' },
    { name: 'Sợi Loang Nhiều Màu', slug: 'soi-loang-mau', price: 32000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1579546678183-a9a1a49e0d1e?q=80&w=800' },
    { name: 'Len Lông Cừu Nguyên Chất', slug: 'len-long-cuu', price: 95000, category_id: getCatId('len-va-soi'), cover_image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?q=80&w=800' },

    // Dụng cụ
    { name: 'Bộ Kim Móc Cán Dẻo 8 Size', slug: 'bo-kim-moc-can-deo', price: 120000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1527018263374-5adb6a54f01e?q=80&w=800' },
    { name: 'Kim Móc Tulips Nhật Bản', slug: 'kim-moc-tulips', price: 180000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=800' },
    { name: 'Mắt Thú Đen Có Chốt (Gói)', slug: 'mat-thu-co-chot', price: 15000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800' },
    { name: 'Bông Gòn Nhân Tạo Tơi', slug: 'bong-gon-nhan-tao', price: 45000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1520004434532-668416a08753?q=80&w=800' },
    { name: 'Kéo Cắt Chỉ Vintage', slug: 'keo-cat-chi-vintage', price: 65000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1506806732259-39c2d4a3b5a5?q=80&w=800' },
    { name: 'Ghim Đánh Dấu Vòng (10 cái)', slug: 'ghim-danh-dau-vong', price: 5000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=800' },
    { name: 'Kim Khâu Len Đầu Tù', slug: 'kim-khau-len', price: 3000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=800' },
    { name: 'Ruy Băng Lụa Gói Quà', slug: 'ruy-bang-lua', price: 15000, category_id: getCatId('dung-cu-phu-kien'), cover_image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800' },
  ];

  for (const product of products) {
    await prisma.products.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        description: `Sản phẩm ${product.name} chất lượng cao, phù hợp làm quà tặng hoặc sử dụng hàng ngày tại Tiệm Nhà Bee.`,
        images: [product.cover_image],
      },
    });
  }

  console.log('✅ Seed finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
