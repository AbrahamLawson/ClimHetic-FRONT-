export function setCookie(name, value, days = 180) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    const payload = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${name}=${payload}; Expires=${expires}; Path=/; SameSite=Lax`;
  }
  export function getCookie(name) {
    const match = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match.split("=")[1])); }
    catch { return null; }
  }
  export function delCookie(name) {
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
  }
  