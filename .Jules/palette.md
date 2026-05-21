## 2025-05-15 - [Consistent focus indicators]
**Learning:** Standardizing focus indicators across the app (buttons, inputs, and nav links) significantly improves keyboard navigation predictability and ensures accessibility compliance. Using `focus-visible` prevents the "blue ring" from appearing on mouse clicks while providing it for keyboard users.
**Action:** Always include `focus-visible` styles in the global design system (or base CSS) for all interactive elements.

## 2025-05-15 - [Form Accessibility and Feedback]
**Learning:** Explicitly associating labels with inputs using `htmlFor` and `id` is more robust for screen readers than simple wrapping. Providing visual icons (like a spinner for loading or an alert icon for errors) alongside text feedback makes the interface more intuitive for all users.
**Action:** Use explicit label-input associations and include meaningful icons for status changes in forms.

## 2025-05-15 - [Dropdown Affordance with Custom Styles]
**Learning:** When using `appearance-none` on `<select>` elements to implement custom designs, the native dropdown arrow is removed. This significantly degrades UX as users can't easily identify the field as a dropdown.
**Action:** Always wrap custom-styled `<select>` elements in a relative container and provide a custom icon (e.g., `ChevronDown`) with `pointer-events-none` to restore visual affordance.
