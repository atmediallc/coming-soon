## 2024-05-20 - Add input length limit to Waitlist Form
**Vulnerability:** Unbounded input length on the waitlist email field. This could lead to a Denial of Service (DoS) vulnerability via algorithmic complexity attacks on the regex engine or memory exhaustion when processing extremely large email strings.
**Learning:** Even simple forms need input length boundaries to prevent resource exhaustion.
**Prevention:** Implement strict length limits on all user inputs, regardless of validation regex, as a defense-in-depth measure. Maximum length of an email address according to RFC 5321 is 254 characters.
