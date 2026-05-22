## 2025-05-15 - [Consistent focus indicators]
**Learning:** Standardizing focus indicators across the app (buttons, inputs, and nav links) significantly improves keyboard navigation predictability and ensures accessibility compliance. Using `focus-visible` prevents the "blue ring" from appearing on mouse clicks while providing it for keyboard users.
**Action:** Always include `focus-visible` styles in the global design system (or base CSS) for all interactive elements.

## 2025-05-15 - [Form Accessibility and Feedback]
**Learning:** Explicitly associating labels with inputs using `htmlFor` and `id` is more robust for screen readers than simple wrapping. Providing visual icons (like a spinner for loading or an alert icon for errors) alongside text feedback makes the interface more intuitive for all users.
**Action:** Use explicit label-input associations and include meaningful icons for status changes in forms.

## 2025-05-22 - [Password Visibility Toggle]
**Learning:** Adding a "show/hide" toggle to password fields significantly improves user confidence and reduces input errors, especially on mobile or for complex passwords. Using a relative container for the icon button and adding extra right-padding to the input prevents text overlap.
**Action:** For password inputs, use a relative container for the toggle button, `Eye`/`EyeOff` icons, and include `pr-12` (or equivalent) on the input to ensure text doesn't overlap with the icon.
