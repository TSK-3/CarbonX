## 2025-05-15 - [Consistent focus indicators]
**Learning:** Standardizing focus indicators across the app (buttons, inputs, and nav links) significantly improves keyboard navigation predictability and ensures accessibility compliance. Using `focus-visible` prevents the "blue ring" from appearing on mouse clicks while providing it for keyboard users.
**Action:** Always include `focus-visible` styles in the global design system (or base CSS) for all interactive elements.

## 2025-05-15 - [Form Accessibility and Feedback]
**Learning:** Explicitly associating labels with inputs using `htmlFor` and `id` is more robust for screen readers than simple wrapping. Providing visual icons (like a spinner for loading or an alert icon for errors) alongside text feedback makes the interface more intuitive for all users.
**Action:** Use explicit label-input associations and include meaningful icons for status changes in forms.

## 2025-05-15 - [Select Component Affordance]
**Learning:** Using `appearance-none` on select elements to remove default styling also removes the native dropdown arrow, which can hide the element's interactivity. Manually adding a chevron icon ensures users recognize the field as a clickable dropdown.
**Action:** Always provide a visual indicator (like a Chevron icon) when using `appearance-none` on select components to maintain visual affordance.
