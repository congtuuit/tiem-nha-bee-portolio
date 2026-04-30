async function testApi() {
  const data = {
    shop_name: "Tiệm Nhà Bee",
    phone: "0704859175",
    address: "958/10/6 Lạc Long Quân, TP.HCM",
    zalo_url: "https://zalo.me/0704859175",
    facebook_url: "https://www.facebook.com/huong.tiem.nha.bee",
    footer_text: "Nhận dạy móc len & shop len sợi thành phẩm",
    meta_title: "Tiệm Nhà Bee - Len Handmade, Nguyên Liệu & Học Móc Len",
    meta_description: "Tiệm Nhà Bee chuyên len handmade, nguyên liệu móc len và khóa học móc len cho người mới. Sản phẩm tinh tế, dễ học, giao hàng toàn quốc."
  };

  try {
    const response = await fetch('http://localhost:3000/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testApi();
