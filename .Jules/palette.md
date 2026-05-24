## 2025-05-15 - [Consistent focus indicators]
**Learning:** Standardizing focus indicators across the app (buttons, inputs, and nav links) significantly improves keyboard navigation predictability and ensures accessibility compliance. Using `focus-visible` prevents the "blue ring" from appearing on mouse clicks while providing it for keyboard users.
**Action:** Always include `focus-visible` styles in the global design system (or base CSS) for all interactive elements.

## 2025-05-15 - [Form Accessibility and Feedback]
**Learning:** Explicitly associating labels with inputs using `htmlFor` and `id` is more robust for screen readers than simple wrapping. Providing visual icons (like a spinner for loading or an alert icon for errors) alongside text feedback makes the interface more intuitive for all users.
**Action:** Use explicit label-input associations and include meaningful icons for status changes in forms.

## 2025-05-16 - [Animated Feedback for Dynamic Metrics]
**Learning:** When users perform complex actions like drawing farm boundaries, providing immediate, animated feedback on the resulting metrics (like area) confirms the system is responsive. However, using `key`-based re-mounts for high-frequency updates (like area acres changing while dragging) can cause visual "jank".
**Action:** Use `motion` components to animate metric changes but prefer simple `animate` transitions over `key`-based re-mounting for values that update rapidly during user interaction.

## 2025-05-16 - [Restoring Dropdown Affordance]
**Learning:** When using `appearance-none` on `<select>` elements to implement custom styling, the native arrow icon is hidden, removing the visual indicator that the field is a dropdown. Manually adding a `ChevronDown` icon in a relative container restores this essential UX affordance.
**Action:** Always include a visual indicator (like a Chevron) when using `appearance-none` on dropdowns to maintain user expectations of interactivity.
