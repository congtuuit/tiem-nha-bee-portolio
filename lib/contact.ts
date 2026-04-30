/**
 * Utility to generate contact links for Facebook Messenger and Zalo
 */

export function generateMessengerLink(fbInput: string, productName?: string, productUrl?: string) {
  // fbInput can be a full URL or just a username/ID
  let cleanId = fbInput.replace("https://facebook.com/", "")
                      .replace("https://www.facebook.com/", "")
                      .replace("https://m.me/", "")
                      .replace(/\//g, "")
                      .split("?")[0];
  
  const message = productName 
    ? `Chào Tiệm Nhà Bee, mình muốn hỏi về sản phẩm: ${productName}. Link: ${productUrl}`
    : `Chào Tiệm Nhà Bee, mình cần tư vấn ạ!`;
    
  const encodedMessage = encodeURIComponent(message);
  
  return `https://m.me/${cleanId}?text=${encodedMessage}`;
}

export function generateZaloLink(zaloInput: string, productName?: string, productUrl?: string) {
  // zaloInput can be a full URL https://zalo.me/0704859175 or just the phone 0704859175
  const cleanPhone = zaloInput.replace("https://zalo.me/", "")
                              .replace(/[\s\.\+]/g, "")
                              .replace(/\//g, "");
  
  const message = productName 
    ? `Chào Tiệm Nhà Bee, mình muốn hỏi về sản phẩm: ${productName}. Link: ${productUrl}`
    : `Chào Tiệm Nhà Bee, mình cần tư vấn ạ!`;
    
  const encodedMessage = encodeURIComponent(message);
  
  return `https://zalo.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getContactUrls(shopConfig: any, productName: string, productUrl: string) {
  const fbUrl = shopConfig?.facebook_url ? generateMessengerLink(shopConfig.facebook_url, productName, productUrl) : null;
  const zaloUrl = shopConfig?.zalo_url || shopConfig?.phone ? generateZaloLink(shopConfig?.zalo_url || shopConfig?.phone, productName, productUrl) : null;
  
  return { fbUrl, zaloUrl };
}
