/**
 * page.tsx
 *
 * This file defines the main page component for this route.
 *
 * Purpose:
 *   - Acts as the entry point for this specific page in your Next.js app.
 *   - Renders the main App component which contains the full application UI.
 *
 * Details:
 *   - Uses default export to allow Next.js to recognize this as a page.
 *   - Imports the App component from "@/App" to render the app structure.
 *
 * Usage:
 *   - When this page is visited in the browser, the <App /> component will be rendered.
 *   - All child components and routing inside <App /> will be active.
 *
 * Example:
 *   // App.tsx might contain your task manager or main dashboard.
 *   export default function App() {
 *     return <div>Welcome to TaskFlow!</div>;
 *   }
 */

"use client";
import App from "@/App";

/**
 * Main page component for this route.
 * Renders the App component.
 */
export default function Page() {
  return <App />;
}
