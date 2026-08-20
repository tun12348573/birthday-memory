import "./globals.css";

import {
  Style_Script,
  Be_Vietnam_Pro,
} from "next/font/google";

const handwriting = Style_Script({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-handwriting",
  display: "swap",
});

const vietnameseFont = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-vietnamese",
  display: "swap",
});

export const metadata = {
  title: "Our Memory",
  description: "Our little memory",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`${handwriting.variable} ${vietnameseFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}