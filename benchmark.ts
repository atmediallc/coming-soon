import React from "react";
import { renderToString } from "react-dom/server";
import { Process } from "./components/Process";

const iterations = 100000;

console.log("Warming up...");
for (let i = 0; i < 1000; i++) {
  renderToString(React.createElement(Process));
}

console.log("Measuring...");
const start = performance.now();
for (let i = 0; i < iterations; i++) {
  renderToString(Process());
}
const end = performance.now();

console.log(`Render ${iterations} times took ${(end - start).toFixed(2)}ms`);
