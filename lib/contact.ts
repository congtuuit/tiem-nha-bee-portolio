/**
 * Utility to generate contact links for Facebook Messenger and Zalo
 */

export function generateMessengerLink(fbId: string, productName: string, productUrl: string) {
  // fbId can be username or numeric ID
  const cleanFbId = fbId.replace("https://facebook.com/", "").replace("https://www.facebook.com/", "").split("/")[0];
  const message = `Chào Tiệm Nhà Bee, mình muốn hỏi về sản phẩm: ${productName}. Link: ${productUrl}`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://m.me/${cleanFbId}?text=${encodedMessage}`;
}

export function generateZaloLink(phone: string, productName: string, productUrl: string) {
  // phone should be in format 09xxx or 84xxx. Remove +, spaces, and dots.
  const cleanPhone = phone.replace(/[\s\.\+]/g, "");
  const message = `Chào Tiệm Nhà Bee, mình muốn hỏi về sản phẩm: ${productName}. Link: ${productUrl}`;
  const encodedMessage = encodeURIComponent(message);
  
  return `https://zalo.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getContactUrls(shopConfig: any, productName: string, productUrl: string) {
  const fbUrl = shopConfig?.facebook_url ? generateMessengerLink(shopConfig.facebook_url, productName, productUrl) : null;
  const zaloUrl = shopConfig?.zalo_url ? generateZaloLink(shopConfig.zalo_url, productName, productUrl) : null;
  
  return { fbUrl, zaloUrl };
}
