## 2024-05-18 - Input Fields UX and A11y Links\n**Learning:** Using `autoComplete="email"` and `spellCheck="false"` along with correct `name` attributes significantly reduces friction in forms. Skip-to-content links combined with a focusable target (`tabIndex={-1}`) provide robust keyboard accessibility without affecting normal tab flow.\n**Action:** Add these attributes as standard to all new forms and layout components.

## 2024-05-18 - Form Submission Focus Management
**Learning:** When a form successfully submits and the original component containing the submit button unmounts to show a success message, focus drops to the body, losing keyboard and screen reader context.
**Action:** Always implement focus management to shift focus to the new success state container (using `tabIndex={-1}`) or refocus the input on validation errors.

## 2024-06-23 - Absolute Elements in Inputs
**Learning:** When positioning elements (like buttons or icons) absolutely within an input field, the input's padding must account for the full width of the absolute element plus any margins. Otherwise, long user input will scroll behind the element, becoming unreadable and causing a frustrating user experience.
**Action:** Always verify input padding against the width of any overlapping absolute elements to ensure text remains fully visible at all scroll positions.
## 2024-06-24 - External Links A11y and UX\n**Learning:** Links that open in a new tab (`target="_blank"`) should provide visual and screen-reader cues to avoid disorienting users.\n**Action:** Add an external link icon and an `<span className="sr-only"> (opens in a new tab)</span>` label to all such links to clearly communicate behavior.

## 2026-06-26 - Text Contrast and Opacities
**Learning:** Using low opacity values for secondary text (e.g., `text-white/30`, `text-white/40`) often fails WCAG AA contrast ratio requirements, making the text difficult or impossible for users to read on dark backgrounds.
**Action:** For secondary text, use at least `text-white/50` or pre-defined semantic tokens like `text-muted` which are already confirmed to meet WCAG AA contrast standards.
