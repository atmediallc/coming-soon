"use client";

import { useEffect } from "react";

export function WebMCP() {
  useEffect(() => {
    // Check if the WebMCP API is available
    if (typeof navigator !== "undefined" && 'modelContext' in navigator) {
      const abortController = new AbortController();

      // Ensure we call provideContext with tools
      // Based on WebMCP docs, navigator.modelContext.provideContext() is used
      // https://webmachinelearning.github.io/webmcp/

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).modelContext.provideContext({
          tools: [
            {
              name: "search_journal",
              description: "Searches the trading journal for a specific ticker or keyword.",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query (e.g., 'AAPL', 'loss')"
                  }
                },
                required: ["query"]
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              execute: async (args: any) => {
                console.log(`Searching for ${args.query}...`);
                return { success: true, message: `Simulated search for ${args.query}` };
              }
            }
          ],
          signal: abortController.signal
        });
      } catch (e) {
        console.error("Failed to provide WebMCP context:", e);
      }

      return () => {
        abortController.abort();
      };
    }
  }, []);

  return null;
}
