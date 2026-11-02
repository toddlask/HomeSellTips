export const CANONICAL_ORIGIN = "https://helpfulideasforsellingyourhome.com";

const REDIRECT_HOSTS = new Set(["homeselltips.vercel.app"]);

export const VERIFICATION_PATH = "/google4f514a5b84ae4e70.html";

export function canonicalRedirect(host: string | null, pathname: string): string | null {
  const name = host?.split(":")[0]?.toLowerCase() ?? "";
  if (!REDIRECT_HOSTS.has(name) || pathname === VERIFICATION_PATH) {
    return null;
  }
  return `${CANONICAL_ORIGIN}${pathname}`;
}
