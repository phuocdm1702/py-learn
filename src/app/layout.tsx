import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    template: "%s | PyLearn OS",
    default: "PyLearn OS — Python Learning Admin",
  },
  description: "Admin dashboard theo dõi tiến trình học Python — Hardcore Mode",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-[var(--font-inter)] antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('py_theme') || 'dark';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch(e) { document.documentElement.classList.add('dark'); }
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
