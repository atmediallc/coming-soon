## 2024-05-20 - Add input length limit to Waitlist Form
**Vulnerability:** Unbounded input length on the waitlist email field. This could lead to a Denial of Service (DoS) vulnerability via algorithmic complexity attacks on the regex engine or memory exhaustion when processing extremely large email strings.
**Learning:** Even simple forms need input length boundaries to prevent resource exhaustion.
**Prevention:** Implement strict length limits on all user inputs, regardless of validation regex, as a defense-in-depth measure. Maximum length of an email address according to RFC 5321 is 254 characters.

## 2025-02-27 - CSRF Vulnerability on Waitlist API Endpoint
**Vulnerability:** The `/api/waitlist` endpoint did not check the `Content-Type` header.
**Learning:** Next.js API routes that process JSON payloads are vulnerable to Cross-Site Request Forgery (CSRF) if they accept simple requests (like `application/x-www-form-urlencoded` or `text/plain` from HTML forms) that bypass CORS preflight checks.
**Prevention:** Always enforce strict `Content-Type: application/json` checking on API routes that expect JSON, or use CSRF tokens.

## 2025-02-27 - Host Header Injection in well-known endpoints
**Vulnerability:** The `.well-known` API endpoints (like `oauth-authorization-server`, `mcp`, `agent-skills`, `oauth-protected-resource`) dynamically determined the base URL using `new URL(request.url).origin`. Next.js resolves `request.url` using the `Host` or `X-Forwarded-Host` headers when deployed behind a proxy. An attacker could spoof this header, tricking the endpoint into returning a malicious URL (e.g., an attacker-controlled OAuth authorization endpoint or token endpoint), leading to OAuth code interception or similar attacks.
**Learning:** Never trust the `Host` or `X-Forwarded-Host` headers to construct absolute URLs, especially for security-critical metadata like OAuth server URLs or agent skills configurations.
**Prevention:** Use a configured environment variable (e.g., `NEXT_PUBLIC_SITE_URL`) or hardcoded constants for the base URL when returning absolute URLs in API endpoints.

## 2024-03-24 - Prevent DoS via Next.js Payload Exhaustion
**Vulnerability:** API routes calling `request.json()` can be vulnerable to memory exhaustion/DoS if they accept arbitrarily large payloads without size limits. Next.js does not enforce strict limits natively within edge/nodejs handlers.
**Learning:** Next.js allows unbounded payloads out of the box unless specifically restricted.
**Prevention:** Enforce early `Content-Length` checks on Next.js API routes (e.g., rejecting lengths > 1024 bytes) and add `maxLength` attributes on client-side form inputs.
