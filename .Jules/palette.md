## 2025-05-15 - [Consistent focus indicators]
**Learning:** Standardizing focus indicators across the app (buttons, inputs, and nav links) significantly improves keyboard navigation predictability and ensures accessibility compliance. Using `focus-visible` prevents the "blue ring" from appearing on mouse clicks while providing it for keyboard users.
**Action:** Always include `focus-visible` styles in the global design system (or base CSS) for all interactive elements.

## 2025-05-15 - [Form Accessibility and Feedback]
**Learning:** Explicitly associating labels with inputs using `htmlFor` and `id` is more robust for screen readers than simple wrapping. Providing visual icons (like a spinner for loading or an alert icon for errors) alongside text feedback makes the interface more intuitive for all users.
**Action:** Use explicit label-input associations and include meaningful icons for status changes in forms.

## 2025-05-16 - [Animated Feedback for Dynamic Metrics]
**Learning:** When users perform complex actions like drawing farm boundaries, providing immediate, animated feedback on the resulting metrics (like area) confirms the system is responsive. However, using `key`-based re-mounts for high-frequency updates (like area acres changing while dragging) can cause visual "jank".
**Action:** Use `motion` components to animate metric changes but prefer simple `animate` transitions over `key`-based re-mounting for values that update rapidly during user interaction.

## 2025-05-18 - [Password Visibility Toggle for Improved Login UX]
**Learning:** Adding a password visibility toggle is a high-impact, low-effort micro-UX improvement that reduces friction during authentication by allowing users to verify their input. Ensuring strict `exact=True` labels in Playwright tests avoids locator ambiguity between the input label and the toggle button's `aria-label`.
**Action:** Use `pr-12` for password inputs with toggles to prevent text overlap and include `focus-visible` on the toggle button for keyboard accessibility.
