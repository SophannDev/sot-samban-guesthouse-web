"use client";

import React from "react";
import { GeistSans } from "geist/font/sans";

export default function ClientFontStyles() {
  return (
    <style>{`
      html {
        font-family: ${GeistSans.style.fontFamily};
        --font-sans: ${GeistSans.variable};
      }
    `}</style>
  );
}