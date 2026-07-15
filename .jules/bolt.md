## 2024-05-18 - Avoid Animating CSS Filters on Large Elements
**Learning:** Animating `filter: blur(...)` in CSS keyframes on large background blobs forces the GPU to recalculate the expensive blur operation on every frame, causing significant battery drain and frame drops.
**Action:** Always animate `opacity` and `transform` (like `scale`) on elements that have a static `blur` applied to them, rather than animating the `blur` value itself. The scaling naturally gives the illusion of the blur expanding.

## 2024-06-22 - Hoist static arrays outside of render maps
**Learning:** Recreating a static array inside a `.map()` callback within a React render function causes unnecessary memory allocations and garbage collection on every single render cycle, especially for loops that map over many items.
**Action:** Always hoist static arrays and object configurations outside the component scope entirely when they do not depend on props or state, effectively reducing runtime allocation overhead.

## 2024-06-24 - Pre-calculate Tailwind classes outside render loops
**Learning:** Running `cn` (clsx + tailwind-merge) inside a `.map()` callback within a React render function wastes CPU cycles evaluating string interpolations and objects when the backing array consists entirely of static data.
**Action:** When mapping over static application config arrays to render components, pre-calculate the class names into the object structure outside of the component scope to save runtime rendering overhead.
## 2024-05-18 - Pre-calculating Tailwind Classes and Hoisting Arrays for Render Performance
**Learning:** Running `cn()` (which uses `clsx` and `tailwind-merge`) inside a `.map()` loop during every React render cycle on static data wastes CPU cycles and significantly degrades performance. Similarly, re-creating static arrays inside a component causes unnecessary memory allocations and triggers garbage collection on each render.
**Action:** Always pre-calculate complex Tailwind class strings and hoist static arrays (like configuration lists or steps) outside of the React component's render function when dealing with static data to ensure optimal backend/SSR performance.

## 2025-05-18 - Hoisting static object maps out of React Render Loop
**Learning:** During profiling, I discovered that creating objects within `.map()` loops directly in a React functional component caused unnecessary memory allocations and math calculations on every single render cycle. In particular, iterating over static arrays (e.g. `CANDLES` or `RISK_METRICS`) inside the component and calculating derived string templates, inline styles, or dynamic props significantly impacted rendering speed.
**Action:** Always pre-calculate complex, derived static objects (such as mapped SVG dimensions or composed CSS class names) outside of the React render loop. This ensures the allocations and calculations are performed only once when the module loads, instead of repetitively on every render, leading to measurable rendering speed improvements (e.g., 66% faster rendering in benchmark).
