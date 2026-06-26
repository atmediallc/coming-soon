const DEFAULT_SITE_URL = "https://traderadd.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(configuredUrl);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
