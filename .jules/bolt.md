## 2024-05-18 - Avoid Animating CSS Filters on Large Elements
**Learning:** Animating `filter: blur(...)` in CSS keyframes on large background blobs forces the GPU to recalculate the expensive blur operation on every frame, causing significant battery drain and frame drops.
**Action:** Always animate `opacity` and `transform` (like `scale`) on elements that have a static `blur` applied to them, rather than animating the `blur` value itself. The scaling naturally gives the illusion of the blur expanding.

## 2024-06-22 - Hoist static arrays outside of render maps
**Learning:** Recreating a static array inside a `.map()` callback within a React render function causes unnecessary memory allocations and garbage collection on every single render cycle, especially for loops that map over many items.
**Action:** Always hoist static arrays and object configurations outside the component scope entirely when they do not depend on props or state, effectively reducing runtime allocation overhead.

## 2024-06-24 - Pre-calculate Tailwind classes outside render loops
**Learning:** Running `cn` (clsx + tailwind-merge) inside a `.map()` callback within a React render function wastes CPU cycles evaluating string interpolations and objects when the backing array consists entirely of static data.
**Action:** When mapping over static application config arrays to render components, pre-calculate the class names into the object structure outside of the component scope to save runtime rendering overhead.

## 2024-07-03 - Pre-calculating complex Tailwind classes in React
**Learning:** Running `cn` (clsx + tailwind-merge) inside `.map()` during every render cycle wastes CPU cycles on static data.
**Action:** Pre-calculate complex Tailwind class strings and hoist static arrays outside of the React render loop. This reduces rendering overhead in list maps.
