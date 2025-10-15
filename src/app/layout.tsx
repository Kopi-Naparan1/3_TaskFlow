// layout.tsx
// -------------------------------------------------------
// This is the "root layout" of your app.
// Think of it like the main kitchen where every recipe
// (page) will be cooked. Without this, Next.js doesn’t
// know how to structure the overall HTML.
//
// Everything you see here applies to EVERY page.
// -------------------------------------------------------

import "./globals.css";
// 👆 This imports your global stylesheet.
// It's like turning on the lights in the kitchen so
// all your meals (pages) share the same "look & feel".

import type { Metadata } from "next";
// 👆 This tells TypeScript what a Metadata object looks like.
// Metadata contains info about your site (title, description, etc.)
// used for SEO and in the browser tab.

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Simple Task Manager",
};
// 👆 This is your site's "business card" for the browser.
// - title → shows up in the browser tab
// - description → helps with SEO, search engines, previews

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👆 RootLayout is the main wrapper around your whole app.
  // Next.js automatically uses this for every page.
  // `children` = whatever page you’re currently on (like /, /about, etc.)

  return (
    <html lang="en">
      {/* 👆 The <html> tag: required, defines your site language */}

      <body>
        {/* 👆 The <body> tag: everything inside here
          is what your users actually see on the page */}

        {children}
        {/* 👆 The current page gets rendered here.
          Example: if you're on /about, the "About" page
          will be injected right here. */}
      </body>
    </html>
  );
}
