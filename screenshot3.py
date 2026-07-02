from playwright.sync_api import sync_playwright
import time
import subprocess

def capture_screenshot():
    print("Starting Next.js server...")
    # Start the Next.js server in the background
    server_process = subprocess.Popen(["pnpm", "run", "dev"])

    # Wait for the server to start
    time.sleep(5)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()

            print("Navigating to localhost:3000...")
            page.goto("http://localhost:3000")

            print("Waiting for dynamic rendering and CSS animations to settle...")
            time.sleep(3)

            print("Taking screenshot...")
            page.screenshot(path="screenshot3.png", full_page=True)
            print("Screenshot saved to screenshot3.png")

            browser.close()
    finally:
        print("Stopping Next.js server...")
        server_process.terminate()
        server_process.wait()

capture_screenshot()
